import { Request, Response } from 'express';
import { z } from 'zod';
import { verifyPurchaseToken } from '../googlePlayBilling';

// Validation schemas according to requirements
const verifySchema = z.object({
  productId: z.string().refine(val => val === 'suscripcion', 'productId must be "suscripcion"'),
  purchaseToken: z.string().min(1, 'purchaseToken is required'),
});

const subscriptionStatusSchema = z.object({
  purchaseToken: z.string().min(1, 'purchaseToken is required'),
});

// Simple cache for verification results (1-5 minutes)
const verificationCache = new Map<string, { result: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCachedResult(key: string) {
  const cached = verificationCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.result;
  }
  verificationCache.delete(key);
  return null;
}

function setCachedResult(key: string, result: any) {
  verificationCache.set(key, { result, timestamp: Date.now() });
}

/**
 * POST /api/verify
 * Verify a Google Play purchase with validation
 */
export async function verify(req: Request, res: Response) {
  try {
    const { productId, purchaseToken } = verifySchema.parse(req.body);
    const packageName = process.env.GOOGLE_PLAY_PACKAGE_NAME || 'com.cookflow.app';
    
    // Check cache first
    const cacheKey = `verify:${packageName}:${productId}:${purchaseToken}`;
    const cachedResult = getCachedResult(cacheKey);
    if (cachedResult) {
      return res.json(cachedResult);
    }

    // Handle test token
    if (purchaseToken === 'TEST') {
      const result = { 
        active: false, 
        message: 'Test token - verification not performed',
        productId,
        packageName
      };
      return res.json(result);
    }

    // Verify with Google Play
    const verificationResult = await verifyPurchaseToken(packageName, productId, purchaseToken);
    
    const result = {
      active: verificationResult.active,
      expiryTimeMillis: verificationResult.expiryTimeMillis,
      orderId: verificationResult.orderId,
      productId,
      packageName
    };

    // Cache successful results
    if (verificationResult.active) {
      setCachedResult(cacheKey, result);
    }

    res.json(result);

  } catch (error) {
    console.error('Error in /api/verify:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors 
      });
    }

    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Error al verificar la compra'
    });
  }
}

/**
 * GET /api/subscription-status
 * Get subscription status by purchaseToken (query parameter)
 */
export async function subscriptionStatus(req: Request, res: Response) {
  try {
    const { purchaseToken } = subscriptionStatusSchema.parse(req.query);
    const packageName = process.env.GOOGLE_PLAY_PACKAGE_NAME || 'com.cookflow.app';
    const productId = 'suscripcion'; // Fixed product ID as per requirements
    
    // Check cache first
    const cacheKey = `status:${packageName}:${productId}:${purchaseToken}`;
    const cachedResult = getCachedResult(cacheKey);
    if (cachedResult) {
      return res.json(cachedResult);
    }

    // Handle test token
    if (purchaseToken === 'TEST') {
      const result = { 
        active: false, 
        message: 'Test token - verification not performed',
        productId,
        packageName
      };
      return res.json(result);
    }

    // Verify with Google Play
    const verificationResult = await verifyPurchaseToken(packageName, productId, purchaseToken);
    
    const result = {
      active: verificationResult.active,
      expiryTimeMillis: verificationResult.expiryTimeMillis,
      orderId: verificationResult.orderId,
      productId,
      packageName
    };

    // Cache successful results
    if (verificationResult.active) {
      setCachedResult(cacheKey, result);
    }

    res.json(result);

  } catch (error) {
    console.error('Error in /api/subscription-status:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors 
      });
    }

    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Error al obtener estado de suscripción'
    });
  }
}

/**
 * POST /api/googleplay/webhook
 * Handle Google Play webhook notifications (placeholder)
 */
export async function webhook(req: Request, res: Response) {
  try {
    console.log('Google Play webhook received:', req.body);
    
    // TODO: Implement proper webhook signature verification
    // TODO: Process subscription notifications
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error in webhook handler:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}