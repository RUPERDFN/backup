// Digital Goods API integration for TWA/PWA Play Billing
interface DigitalGoodsService {
  getDetails(itemIds: string[]): Promise<ItemDetails[]>;
  listPurchases(): Promise<PurchaseDetails[]>;
  consume(purchaseToken: string): Promise<void>;
  acknowledge(purchaseToken: string): Promise<void>;
}

interface ItemDetails {
  itemId: string;
  title: string;
  price: {
    currency: string;
    value: string;
  };
  description: string;
  iconURLs: string[];
  subscriptionPeriod?: string;
  freeTrialPeriod?: string;
  introductoryPrice?: {
    currency: string;
    value: string;
  };
}

interface PurchaseDetails {
  itemId: string;
  purchaseToken: string;
  acknowledged: boolean;
  purchaseState: 'purchased' | 'pending';
  purchaseTime: number;
  developerPayload?: string;
}

interface PaymentRequest {
  methodData: {
    supportedMethods: string;
    data: {
      sku: string;
    };
  }[];
  details: {
    total: {
      amount: {
        currency: string;
        value: string;
      };
    };
  };
}

class BillingManager {
  private digitalGoodsService: DigitalGoodsService | null = null;
  private isInitialized = false;

  async init(): Promise<boolean> {
    try {
      // Check if we're in a TWA/PWA context with Digital Goods API
      if ('getDigitalGoodsService' in window) {
        this.digitalGoodsService = await (window as any).getDigitalGoodsService(
          'https://play.google.com/billing'
        );
        this.isInitialized = true;
        
        // Check existing purchases
        await this.checkExistingPurchases();
        
        console.log('Digital Goods API initialized successfully');
        return true;
      } else {
        console.log('Digital Goods API not available - running in web mode');
        return false;
      }
    } catch (error) {
      console.error('Failed to initialize Digital Goods API:', error);
      return false;
    }
  }

  async getDigitalGoodsService(): Promise<DigitalGoodsService | null> {
    if (!this.isInitialized) {
      await this.init();
    }
    return this.digitalGoodsService;
  }

  async listDetails(skus: string[]): Promise<ItemDetails[]> {
    const service = await this.getDigitalGoodsService();
    if (!service) {
      throw new Error('Digital Goods Service not available');
    }

    try {
      return await service.getDetails(skus);
    } catch (error) {
      console.error('Failed to get product details:', error);
      throw error;
    }
  }

  async listPurchases(): Promise<PurchaseDetails[]> {
    const service = await this.getDigitalGoodsService();
    if (!service) {
      return [];
    }

    try {
      return await service.listPurchases();
    } catch (error) {
      console.error('Failed to list purchases:', error);
      return [];
    }
  }

  private async checkExistingPurchases(): Promise<void> {
    try {
      const purchases = await this.listPurchases();
      const activePurchases = purchases.filter(
        purchase => purchase.purchaseState === 'purchased'
      );

      if (activePurchases.length > 0) {
        // User has active premium subscription
        window.IS_PREMIUM = true;
        console.log('Active premium subscription found');
        
        // Acknowledge purchases if needed
        for (const purchase of activePurchases) {
          if (!purchase.acknowledged && this.digitalGoodsService) {
            await this.digitalGoodsService.acknowledge(purchase.purchaseToken);
          }
        }
      } else {
        window.IS_PREMIUM = false;
      }
    } catch (error) {
      console.error('Error checking existing purchases:', error);
      window.IS_PREMIUM = false;
    }
  }

  async purchase(sku: string): Promise<boolean> {
    try {
      // Get product details first
      const details = await this.listDetails([sku]);
      if (details.length === 0) {
        throw new Error(`Product ${sku} not found`);
      }

      const productDetails = details[0];

      // Create payment request
      const paymentRequest: PaymentRequest = {
        methodData: [{
          supportedMethods: 'https://play.google.com/billing',
          data: {
            sku: sku
          }
        }],
        details: {
          total: {
            amount: {
              currency: productDetails.price.currency,
              value: productDetails.price.value
            }
          }
        }
      };

      // Use Payment Request API
      if ('PaymentRequest' in window) {
        const request = new PaymentRequest(
          paymentRequest.methodData as any,
          paymentRequest.details as any
        );

        const response = await request.show();
        
        if (response) {
          await response.complete('success');
          
          // Update premium status
          window.IS_PREMIUM = true;
          
          // Notify backend about the purchase
          await this.notifyBackendPurchase(sku);
          
          console.log('Purchase completed successfully');
          return true;
        }
      } else {
        throw new Error('Payment Request API not supported');
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      return false;
    }

    return false;
  }

  private async notifyBackendPurchase(sku: string): Promise<void> {
    try {
      const response = await fetch('/api/google-play/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: sku,
          source: 'digital_goods_api'
        }),
      });

      if (!response.ok) {
        console.error('Failed to notify backend about purchase');
      }
    } catch (error) {
      console.error('Error notifying backend:', error);
    }
  }

  async refreshPurchases(): Promise<void> {
    await this.checkExistingPurchases();
  }

  isAvailable(): boolean {
    return this.isInitialized && this.digitalGoodsService !== null;
  }
}

// Export singleton instance
const billingManager = new BillingManager();

export default billingManager;