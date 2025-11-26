import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

interface PurchaseVerificationRequest {
  purchaseToken: string;
  productId: string;
  packageName: string;
}

interface PurchaseVerificationResponse {
  valid: boolean;
  purchaseState?: number;
  consumptionState?: number;
  orderId?: string;
  purchaseTimeMillis?: string;
  error?: string;
}

class GooglePlayVerificationService {
  private androidpublisher: any = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      // Load service account credentials
      const keyFilePath = path.join(process.cwd(), 'firebase-service-account.json');
      
      if (!fs.existsSync(keyFilePath)) {
        throw new Error('Firebase service account file not found');
      }

      const serviceAccount = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));

      // Create JWT auth client
      const auth = new google.auth.JWT({
        email: serviceAccount.client_email,
        key: serviceAccount.private_key,
        scopes: ['https://www.googleapis.com/auth/androidpublisher'],
      });

      this.androidpublisher = google.androidpublisher({
        version: 'v3',
        auth: auth,
      });

      this.initialized = true;
      console.log('✅ Google Play Verification Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Google Play Verification:', error);
      throw error;
    }
  }

  async verifySubscription(request: PurchaseVerificationRequest): Promise<PurchaseVerificationResponse> {
    await this.initialize();

    try {
      const { purchaseToken, productId, packageName } = request;

      // Call Google Play Developer API to verify the purchase
      const result = await this.androidpublisher.purchases.subscriptions.get({
        packageName: packageName,
        subscriptionId: productId,
        token: purchaseToken,
      });

      const purchase = result.data;

      // Check if purchase is valid and active
      // purchaseState: 0 = Purchased, 1 = Canceled
      // paymentState: 0 = Payment pending, 1 = Payment received
      const isValid = purchase.purchaseState === 0;

      return {
        valid: isValid,
        purchaseState: purchase.purchaseState,
        consumptionState: purchase.consumptionState,
        orderId: purchase.orderId,
        purchaseTimeMillis: purchase.startTimeMillis,
      };
    } catch (error: any) {
      console.error('❌ Purchase verification failed:', error);

      // Handle specific Google API errors
      if (error.code === 401 || error.code === 403) {
        return {
          valid: false,
          error: 'Authentication failed. Check service account permissions.',
        };
      }

      if (error.code === 404) {
        return {
          valid: false,
          error: 'Purchase not found',
        };
      }

      return {
        valid: false,
        error: error.message || 'Unknown error',
      };
    }
  }

  async verifyProduct(request: PurchaseVerificationRequest): Promise<PurchaseVerificationResponse> {
    await this.initialize();

    try {
      const { purchaseToken, productId, packageName } = request;

      // For one-time purchases (not subscriptions)
      const result = await this.androidpublisher.purchases.products.get({
        packageName: packageName,
        productId: productId,
        token: purchaseToken,
      });

      const purchase = result.data;

      // Check if purchase is valid
      // purchaseState: 0 = Purchased, 1 = Canceled, 2 = Pending
      const isValid = purchase.purchaseState === 0;

      return {
        valid: isValid,
        purchaseState: purchase.purchaseState,
        consumptionState: purchase.consumptionState,
        orderId: purchase.orderId,
        purchaseTimeMillis: purchase.purchaseTimeMillis,
      };
    } catch (error: any) {
      console.error('❌ Product verification failed:', error);

      if (error.code === 404) {
        return {
          valid: false,
          error: 'Product purchase not found',
        };
      }

      return {
        valid: false,
        error: error.message || 'Unknown error',
      };
    }
  }
}

// Export singleton instance
export const googlePlayVerification = new GooglePlayVerificationService();
