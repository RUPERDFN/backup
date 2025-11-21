import { Request, Response } from 'express';
import { z } from 'zod';
import { getGooglePlayService } from '../googlePlayBilling';
import { storage } from '../storage';
import { verifyPlaySignature, processGooglePlayPurchase } from '../googlePlayVerification';

// Validation schemas
const verifyPurchaseSchema = z.object({
  purchaseToken: z.string(),
  productId: z.string(),
  subscriptionId: z.string().optional(),
});

// Schema for RSA signature verification
const verifySignatureSchema = z.object({
  signedData: z.string(),
  signature: z.string(),
  receiptData: z.object({
    orderId: z.string(),
    packageName: z.string(),
    productId: z.string(),
    purchaseTime: z.number(),
    purchaseState: z.number(),
    purchaseToken: z.string(),
    quantity: z.number().optional(),
    acknowledged: z.boolean().optional(),
    autoRenewing: z.boolean().optional(),
    subscriptionId: z.string().optional(),
  }).optional(),
});

const webHookSchema = z.object({
  message: z.object({
    data: z.string(),
    messageId: z.string(),
    publishTime: z.string(),
  }),
});

interface DecodedMessage {
  version: string;
  packageName: string;
  eventTimeMillis: string;
  subscriptionNotification?: {
    version: string;
    notificationType: number;
    purchaseToken: string;
    subscriptionId: string;
  };
  oneTimeProductNotification?: {
    version: string;
    notificationType: number;
    purchaseToken: string;
    sku: string;
  };
}

/**
 * Verify a Google Play purchase
 */
export async function verifyPurchase(req: Request, res: Response) {
  try {
    const { purchaseToken, productId, subscriptionId } = verifyPurchaseSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const googlePlayService = getGooglePlayService();

    // Check if purchase already exists
    const existingPurchase = await storage.getGooglePlayPurchase(purchaseToken);
    if (existingPurchase) {
      return res.status(400).json({ 
        error: 'Purchase already verified',
        purchase: existingPurchase 
      });
    }

    let verificationResult;
    let purchaseData;

    if (subscriptionId) {
      // Verify subscription
      verificationResult = await googlePlayService.verifySubscription(subscriptionId, purchaseToken);
      
      const isActive = googlePlayService.isSubscriptionActive(verificationResult);
      const status = googlePlayService.getSubscriptionStatus(verificationResult);

      // Store purchase record
      purchaseData = await storage.createGooglePlayPurchase({
        userId,
        purchaseToken,
        productId,
        packageName: process.env.GOOGLE_PLAY_PACKAGE_NAME || 'com.thecookflow.app',
        purchaseTime: new Date(parseInt(verificationResult.startTimeMillis)),
        purchaseState: verificationResult.paymentState === 1 ? 0 : 1,
        consumptionState: 0,
        autoRenewing: verificationResult.autoRenewing,
        acknowledged: verificationResult.acknowledgementState === 1,
        subscriptionId,
        orderId: verificationResult.orderId,
        verifiedAt: new Date(),
      });

      // Update user subscription status
      await storage.updateUserSubscription(userId, {
        isPremium: isActive,
        subscriptionStatus: status,
        googlePlayPurchaseToken: purchaseToken,
        subscriptionId,
        purchaseTime: new Date(parseInt(verificationResult.startTimeMillis)),
        expiryTime: new Date(parseInt(verificationResult.expiryTimeMillis)),
        autoRenewing: verificationResult.autoRenewing,
      });

      // Acknowledge if not already acknowledged
      if (verificationResult.acknowledgementState === 0) {
        await googlePlayService.acknowledgeSubscription(subscriptionId, purchaseToken);
        await storage.updateGooglePlayPurchase(purchaseData.id, { acknowledged: true });
      }

    } else {
      // Verify product purchase
      verificationResult = await googlePlayService.verifyProduct(productId, purchaseToken);
      
      const isValid = googlePlayService.isProductPurchaseValid(verificationResult);

      // Store purchase record
      purchaseData = await storage.createGooglePlayPurchase({
        userId,
        purchaseToken,
        productId,
        packageName: process.env.GOOGLE_PLAY_PACKAGE_NAME || 'com.thecookflow.app',
        purchaseTime: new Date(parseInt(verificationResult.purchaseTimeMillis)),
        purchaseState: verificationResult.purchaseState,
        consumptionState: verificationResult.consumptionState,
        autoRenewing: false,
        acknowledged: verificationResult.acknowledgementState === 1,
        orderId: verificationResult.orderId,
        verifiedAt: new Date(),
      });

      // Acknowledge if not already acknowledged
      if (verificationResult.acknowledgementState === 0) {
        await googlePlayService.acknowledgeProduct(productId, purchaseToken);
        await storage.updateGooglePlayPurchase(purchaseData.id, { acknowledged: true });
      }
    }

    res.json({
      success: true,
      purchase: purchaseData,
      verification: verificationResult,
    });

  } catch (error) {
    console.error('Error verifying Google Play purchase:', error);
    res.status(500).json({ 
      error: 'Error al verificar la compra',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Get user's Google Play purchases
 */
export async function getUserPurchases(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const purchases = await storage.getUserGooglePlayPurchases(userId);

    res.json({
      purchases,
    });

  } catch (error) {
    console.error('Error getting user purchases:', error);
    res.status(500).json({ error: 'Error al obtener las compras' });
  }
}

/**
 * Handle Google Play webhook notifications
 */
export async function handleWebhook(req: Request, res: Response) {
  try {
    const { message } = webHookSchema.parse(req.body);
    
    // Decode the base64 message
    const decodedData = JSON.parse(Buffer.from(message.data, 'base64').toString()) as DecodedMessage;
    
    console.log('Google Play webhook received:', decodedData);

    const googlePlayService = getGooglePlayService();

    if (decodedData.subscriptionNotification) {
      const { purchaseToken, subscriptionId, notificationType } = decodedData.subscriptionNotification;
      
      // Find the purchase in our database
      const existingPurchase = await storage.getGooglePlayPurchase(purchaseToken);
      if (!existingPurchase) {
        console.log('Purchase not found for webhook:', purchaseToken);
        return res.status(200).json({ received: true });
      }

      // Verify current subscription status
      const verificationResult = await googlePlayService.verifySubscription(subscriptionId, purchaseToken);
      const isActive = googlePlayService.isSubscriptionActive(verificationResult);
      const status = googlePlayService.getSubscriptionStatus(verificationResult);

      // Update user subscription based on notification type
      switch (notificationType) {
        case 2: // SUBSCRIPTION_RENEWED
        case 1: // SUBSCRIPTION_RECOVERED
          await storage.updateUserSubscription(existingPurchase.userId, {
            isPremium: true,
            subscriptionStatus: 'active',
            expiryTime: new Date(parseInt(verificationResult.expiryTimeMillis)),
            autoRenewing: verificationResult.autoRenewing,
          });
          break;

        case 3: // SUBSCRIPTION_CANCELED
          await storage.updateUserSubscription(existingPurchase.userId, {
            isPremium: isActive, // May still be active until expiry
            subscriptionStatus: isActive ? 'cancelled' : 'expired',
            autoRenewing: false,
          });
          break;

        case 13: // SUBSCRIPTION_EXPIRED
          await storage.updateUserSubscription(existingPurchase.userId, {
            isPremium: false,
            subscriptionStatus: 'expired',
            autoRenewing: false,
          });
          break;

        default:
          console.log('Unhandled subscription notification type:', notificationType);
      }

      // Update purchase record
      await storage.updateGooglePlayPurchase(existingPurchase.id, {
        purchaseState: verificationResult.paymentState === 1 ? 0 : 1,
        autoRenewing: verificationResult.autoRenewing,
      });
    }

    if (decodedData.oneTimeProductNotification) {
      const { purchaseToken, sku, notificationType } = decodedData.oneTimeProductNotification;
      
      // Handle one-time product notifications if needed
      console.log('One-time product notification:', { purchaseToken, sku, notificationType });
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error('Error handling Google Play webhook:', error);
    res.status(500).json({ error: 'Error al procesar webhook' });
  }
}

/**
 * Get subscription status for authenticated user
 */
export async function getSubscriptionStatus(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Check if subscription is still valid
    const now = new Date();
    const isExpired = user.expiryTime && user.expiryTime < now;

    let currentStatus = user.subscriptionStatus || 'free';
    if (isExpired && currentStatus === 'active') {
      currentStatus = 'expired';
      
      // Update user status
      await storage.updateUserSubscription(userId, {
        isPremium: false,
        subscriptionStatus: 'expired',
      });
    }

    const isPremium = user.isPremium && !isExpired;
    
    // Check if user is in 7-day trial period
    const registrationDate = user.createdAt ? new Date(user.createdAt) : new Date();
    const trialEndDate = new Date(registrationDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days after registration
    const isInTrial = now < trialEndDate;
    const trialExpired = now >= trialEndDate && !isPremium;
    
    // Note: User subscribes on registration day but billing occurs after 7 days if not cancelled
    
    // Define subscription limits based on plan
    let limits, canGenerateMenu;
    
    if (isPremium) {
      // Premium plan: 5 menus per week, all features
      limits = {
        maxMenusPerWeek: 5,
        maxServings: 10,
        maxDays: 7,
        maxMealsPerDay: 5,
        allowedDietaryRestrictions: ["normal", "vegetarian", "vegan", "keto", "mediterranean", "gluten-free", "paleo", "low-carb"]
      };
      canGenerateMenu = true;
    } else if (isInTrial) {
      // Free trial: 3 menus, Monday to Friday, 2 people, 3 meals daily, normal diet
      limits = {
        maxMenusPerWeek: 3,
        maxServings: 2,
        maxDays: 5, // Monday to Friday only
        maxMealsPerDay: 3,
        allowedDietaryRestrictions: ["normal"]
      };
      canGenerateMenu = true;
    } else {
      // Trial expired, no access
      limits = {
        maxMenusPerWeek: 0,
        maxServings: 0,
        maxDays: 0,
        maxMealsPerDay: 0,
        allowedDietaryRestrictions: []
      };
      canGenerateMenu = false;
    }

    const finalStatus = trialExpired ? 'trial_expired' : (isPremium ? 'active' : 'trial');

    res.json({
      isPremium,
      subscriptionStatus: finalStatus,
      expiryTime: user.expiryTime,
      autoRenewing: user.autoRenewing,
      purchaseToken: user.googlePlayPurchaseToken,
      subscriptionId: user.subscriptionId,
      isInTrial,
      trialEndDate: trialEndDate.toISOString(),
      trialExpired,
      unlimited: false,
      limits,
      canGenerateMenu
    });

  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({ error: 'Error al obtener estado de suscripción' });
  }
}

/**
 * Verify a Google Play purchase using RSA signature verification
 * This method uses the public key for direct client-side verification
 */
export async function verifyPurchaseRSA(req: Request, res: Response) {
  try {
    const { signedData, signature, receiptData } = verifySignatureSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    console.log('🔐 Verifying purchase with RSA signature...');

    // Method 1: Use parsed receipt data if provided
    if (receiptData) {
      const isValidSignature = verifyPlaySignature(signedData, signature);
      
      if (!isValidSignature) {
        return res.status(400).json({ 
          error: 'Invalid signature',
          message: 'La firma de la compra no es válida'
        });
      }

      // Validate purchase data
      if (receiptData.packageName !== 'com.thecookflow.app') {
        return res.status(400).json({ 
          error: 'Package name mismatch',
          message: 'El paquete no corresponde a TheCookFlow'
        });
      }

      if (receiptData.purchaseState !== 0) {
        return res.status(400).json({ 
          error: 'Invalid purchase state',
          message: 'El estado de la compra no es válido'
        });
      }

      // Check if purchase already exists
      const existingPurchase = await storage.getGooglePlayPurchase(receiptData.purchaseToken);
      if (existingPurchase) {
        return res.status(400).json({ 
          error: 'Purchase already verified',
          purchase: existingPurchase 
        });
      }

      // Store purchase record
      const purchaseData = await storage.createGooglePlayPurchase({
        userId,
        purchaseToken: receiptData.purchaseToken,
        productId: receiptData.productId,
        packageName: receiptData.packageName,
        purchaseTime: new Date(receiptData.purchaseTime),
        purchaseState: receiptData.purchaseState,
        consumptionState: 1, // Assuming consumed
        autoRenewing: receiptData.autoRenewing || false,
        acknowledged: receiptData.acknowledged || false,
        subscriptionId: receiptData.subscriptionId,
        orderId: receiptData.orderId,
        verifiedAt: new Date(),
        verificationMethod: 'rsa_signature'
      });

      // Update user subscription if this is a subscription
      if (receiptData.subscriptionId) {
        const trialPeriod = 7 * 24 * 60 * 60 * 1000; // 7 days
        const expiryTime = new Date(receiptData.purchaseTime + trialPeriod);
        
        await storage.updateUserSubscription(userId, {
          isPremium: true,
          subscriptionStatus: 'active',
          googlePlayPurchaseToken: receiptData.purchaseToken,
          subscriptionId: receiptData.subscriptionId,
          purchaseTime: new Date(receiptData.purchaseTime),
          expiryTime,
          autoRenewing: receiptData.autoRenewing || false,
        });
      }

      return res.json({
        success: true,
        message: 'Compra verificada exitosamente',
        purchase: purchaseData,
        verificationMethod: 'rsa_signature'
      });

    } else {
      // Method 2: Parse receipt from signedData
      const verificationResult = processGooglePlayPurchase(signedData, signature);
      
      if (!verificationResult.isValid) {
        return res.status(400).json({ 
          error: 'Verification failed',
          message: 'Verificación de compra fallida'
        });
      }

      const purchaseData = verificationResult.purchaseData!;

      // Check if purchase already exists
      const existingPurchase = await storage.getGooglePlayPurchase(purchaseData.purchaseToken);
      if (existingPurchase) {
        return res.status(400).json({ 
          error: 'Purchase already verified',
          purchase: existingPurchase 
        });
      }

      // Store purchase record
      const storedPurchase = await storage.createGooglePlayPurchase({
        userId,
        purchaseToken: purchaseData.purchaseToken,
        productId: purchaseData.productId,
        packageName: purchaseData.packageName,
        purchaseTime: new Date(purchaseData.purchaseTime),
        purchaseState: purchaseData.purchaseState,
        consumptionState: 1,
        autoRenewing: purchaseData.autoRenewing || false,
        acknowledged: purchaseData.acknowledged || false,
        subscriptionId: purchaseData.subscriptionId,
        orderId: purchaseData.orderId,
        verifiedAt: new Date(),
        verificationMethod: 'rsa_signature'
      });

      // Update user subscription if this is a subscription
      if (purchaseData.subscriptionId) {
        const trialPeriod = 7 * 24 * 60 * 60 * 1000; // 7 days
        const expiryTime = new Date(purchaseData.purchaseTime + trialPeriod);
        
        await storage.updateUserSubscription(userId, {
          isPremium: true,
          subscriptionStatus: 'active',
          googlePlayPurchaseToken: purchaseData.purchaseToken,
          subscriptionId: purchaseData.subscriptionId,
          purchaseTime: new Date(purchaseData.purchaseTime),
          expiryTime,
          autoRenewing: purchaseData.autoRenewing || false,
        });
      }

      return res.json({
        success: true,
        message: 'Compra verificada exitosamente con RSA',
        purchase: storedPurchase,
        verificationMethod: 'rsa_signature'
      });
    }

  } catch (error) {
    console.error('Error verifying purchase with RSA:', error);
    res.status(500).json({ 
      error: 'Error al verificar la compra',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}