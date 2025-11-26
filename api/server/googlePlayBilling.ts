import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import * as fs from 'fs';
import * as path from 'path';

interface GooglePlayConfig {
  packageName: string;
  serviceAccountKey: any;
}

interface PurchaseData {
  purchaseToken: string;
  productId: string;
  subscriptionId?: string;
}

interface SubscriptionPurchase {
  kind: string;
  startTimeMillis: string;
  expiryTimeMillis: string;
  autoRenewing: boolean;
  priceCurrencyCode: string;
  priceAmountMicros: string;
  countryCode: string;
  paymentState: number;
  cancelReason?: number;
  userCancellationTimeMillis?: string;
  orderId: string;
  acknowledgementState: number;
  purchaseType?: number;
}

interface ProductPurchase {
  kind: string;
  purchaseTimeMillis: string;
  purchaseState: number;
  consumptionState: number;
  orderId: string;
  acknowledgementState: number;
  purchaseToken: string;
  productId: string;
  quantity: number;
}

export class GooglePlayBillingService {
  private androidpublisher: any;
  private packageName: string;

  constructor(config: GooglePlayConfig) {
    this.packageName = config.packageName;
    
    const auth = new GoogleAuth({
      credentials: config.serviceAccountKey,
      scopes: ['https://www.googleapis.com/auth/androidpublisher'],
    });

    this.androidpublisher = google.androidpublisher({
      version: 'v3',
      auth: auth,
    });
  }

  /**
   * Verify a subscription purchase with Google Play
   */
  async verifySubscription(subscriptionId: string, purchaseToken: string): Promise<SubscriptionPurchase> {
    try {
      const response = await this.androidpublisher.purchases.subscriptions.get({
        packageName: this.packageName,
        subscriptionId: subscriptionId,
        token: purchaseToken,
      });

      return response.data;
    } catch (error) {
      console.error('Error verifying subscription:', error);
      throw new Error('Failed to verify subscription with Google Play');
    }
  }

  /**
   * Verify a product purchase with Google Play
   */
  async verifyProduct(productId: string, purchaseToken: string): Promise<ProductPurchase> {
    try {
      const response = await this.androidpublisher.purchases.products.get({
        packageName: this.packageName,
        productId: productId,
        token: purchaseToken,
      });

      return response.data;
    } catch (error) {
      console.error('Error verifying product:', error);
      throw new Error('Failed to verify product with Google Play');
    }
  }

  /**
   * Acknowledge a subscription purchase
   */
  async acknowledgeSubscription(subscriptionId: string, purchaseToken: string): Promise<void> {
    try {
      await this.androidpublisher.purchases.subscriptions.acknowledge({
        packageName: this.packageName,
        subscriptionId: subscriptionId,
        token: purchaseToken,
      });
    } catch (error) {
      console.error('Error acknowledging subscription:', error);
      throw new Error('Failed to acknowledge subscription');
    }
  }

  /**
   * Acknowledge a product purchase
   */
  async acknowledgeProduct(productId: string, purchaseToken: string): Promise<void> {
    try {
      await this.androidpublisher.purchases.products.acknowledge({
        packageName: this.packageName,
        productId: productId,
        token: purchaseToken,
      });
    } catch (error) {
      console.error('Error acknowledging product:', error);
      throw new Error('Failed to acknowledge product');
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string, purchaseToken: string): Promise<void> {
    try {
      await this.androidpublisher.purchases.subscriptions.cancel({
        packageName: this.packageName,
        subscriptionId: subscriptionId,
        token: purchaseToken,
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  /**
   * Refund a subscription
   */
  async refundSubscription(subscriptionId: string, purchaseToken: string): Promise<void> {
    try {
      await this.androidpublisher.purchases.subscriptions.refund({
        packageName: this.packageName,
        subscriptionId: subscriptionId,
        token: purchaseToken,
      });
    } catch (error) {
      console.error('Error refunding subscription:', error);
      throw new Error('Failed to refund subscription');
    }
  }

  /**
   * Check if subscription is active
   */
  isSubscriptionActive(subscription: SubscriptionPurchase): boolean {
    const now = Date.now();
    const expiryTime = parseInt(subscription.expiryTimeMillis);
    
    return subscription.paymentState === 1 && // Payment received
           expiryTime > now && // Not expired
           (!subscription.cancelReason || subscription.autoRenewing); // Not cancelled or auto-renewing
  }

  /**
   * Check if product purchase is valid
   */
  isProductPurchaseValid(product: ProductPurchase): boolean {
    return product.purchaseState === 0; // Purchased
  }

  /**
   * Get subscription status from verification result
   */
  getSubscriptionStatus(subscription: SubscriptionPurchase): string {
    if (this.isSubscriptionActive(subscription)) {
      return 'active';
    }

    if (subscription.cancelReason) {
      return 'cancelled';
    }

    const now = Date.now();
    const expiryTime = parseInt(subscription.expiryTimeMillis);
    
    if (expiryTime <= now) {
      return 'expired';
    }

    return 'pending';
  }
}

// Singleton instance
let googlePlayService: GooglePlayBillingService | null = null;

export function getGooglePlayService(): GooglePlayBillingService {
  if (!googlePlayService) {
    let serviceAccountKey;
    const packageName = process.env.GOOGLE_PLAY_PACKAGE_NAME || 'com.cookflow.app';

    // Try file first (preferred method)
    const keyFilePath = path.join(process.cwd(), 'firebase-service-account.json');
    if (fs.existsSync(keyFilePath)) {
      try {
        const fileContent = fs.readFileSync(keyFilePath, 'utf8');
        serviceAccountKey = JSON.parse(fileContent);
        console.log('✅ Google Play Service Account loaded from firebase-service-account.json');
      } catch (error) {
        console.error('❌ Error reading firebase-service-account.json:', error);
      }
    }

    // Fallback to base64 encoded env var
    if (!serviceAccountKey) {
      const serviceAccountBase64 = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON_BASE64;
      if (serviceAccountBase64) {
        try {
          const decoded = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
          serviceAccountKey = JSON.parse(decoded);
        } catch (error) {
          throw new Error('Invalid base64 encoded Google Play Service Account JSON');
        }
      }
    }

    // Fallback to direct JSON env var
    if (!serviceAccountKey) {
      const serviceAccountJson = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_KEY;
      if (serviceAccountJson) {
        try {
          serviceAccountKey = JSON.parse(serviceAccountJson);
        } catch (error) {
          throw new Error('Invalid Google Play Service Account JSON format');
        }
      }
    }

    if (!serviceAccountKey) {
      throw new Error('Google Play Service Account Key not configured. Add firebase-service-account.json or set GOOGLE_PLAY_SERVICE_ACCOUNT_JSON_BASE64');
    }

    googlePlayService = new GooglePlayBillingService({
      packageName,
      serviceAccountKey,
    });
  }

  return googlePlayService;
}

/**
 * Normalized verification function as requested
 * @param packageName - The app package name (com.cookflow.app)
 * @param productId - The product/subscription ID
 * @param purchaseToken - The purchase token to verify
 * @returns Normalized result with active status and expiry info
 */
export async function verifyPurchaseToken(
  packageName: string, 
  productId: string, 
  purchaseToken: string
): Promise<{ active: boolean; expiryTimeMillis?: string; orderId?: string }> {
  const service = getGooglePlayService();
  
  try {
    // For subscription products (like "suscripcion")
    if (productId === 'suscripcion') {
      const subscription = await service.verifySubscription(productId, purchaseToken);
      const isActive = service.isSubscriptionActive(subscription);
      
      return {
        active: isActive,
        expiryTimeMillis: subscription.expiryTimeMillis,
        orderId: subscription.orderId
      };
    } else {
      // For one-time products
      const product = await service.verifyProduct(productId, purchaseToken);
      const isValid = service.isProductPurchaseValid(product);
      
      return {
        active: isValid,
        orderId: product.orderId
      };
    }
  } catch (error) {
    console.error('Error in verifyPurchaseToken:', error);
    return { active: false };
  }
}

export default GooglePlayBillingService;