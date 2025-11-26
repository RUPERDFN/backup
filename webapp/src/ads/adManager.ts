// Ad Manager for TheCookFlow PWA/TWA with GDPR compliance
interface AdManagerConfig {
  adsenseClientId?: string;
  adManagerNetworkCode?: string;
  enableCMP: boolean;
}

interface ConsentData {
  gdprApplies: boolean;
  tcString: string;
  purpose: {
    consents: { [key: string]: boolean };
    legitimateInterests: { [key: string]: boolean };
  };
  vendor: {
    consents: { [key: string]: boolean };
    legitimateInterests: { [key: string]: boolean };
  };
}

class AdManager {
  private isInitialized = false;
  private consentData: ConsentData | null = null;
  private config: AdManagerConfig;
  private rewardedWebCount = 0;
  private interstitialWebDisabled = true;

  constructor(config: AdManagerConfig) {
    this.config = config;
  }

  async initCMP(): Promise<void> {
    if (!this.config.enableCMP) {
      console.log('CMP disabled, assuming consent for testing');
      return;
    }

    return new Promise((resolve) => {
      // Load CMP script (example with a popular CMP)
      if (!document.querySelector('#cmp-script')) {
        const script = document.createElement('script');
        script.id = 'cmp-script';
        script.src = 'https://cmp.osano.com/AzZl2RMl4hLmrYZ/d4b0ed71-7d0c-4a3c-bcb3-2d92b0b1d1d1.js';
        script.onload = () => {
          this.setupTCFAPI();
          resolve();
        };
        document.head.appendChild(script);
      } else {
        this.setupTCFAPI();
        resolve();
      }
    });
  }

  private setupTCFAPI(): void {
    if (window.__tcfapi) {
      window.__tcfapi('addEventListener', 2, (tcData: any, success: boolean) => {
        if (success && tcData.eventStatus === 'useractioncomplete') {
          this.consentData = {
            gdprApplies: tcData.gdprApplies,
            tcString: tcData.tcString,
            purpose: tcData.purpose,
            vendor: tcData.vendor
          };
          this.initializeAds();
        }
      });
    }
  }

  canShowAds(): boolean {
    // Check premium status
    if (window.IS_PREMIUM) {
      return false;
    }

    // Check consent (simplified - in production you'd check specific purposes)
    if (this.config.enableCMP && this.consentData) {
      return this.consentData.purpose.consents['1'] && this.consentData.purpose.consents['3'];
    }

    // Default to true for non-GDPR or when CMP is disabled
    return true;
  }

  private async initializeAds(): Promise<void> {
    if (this.isInitialized || !this.canShowAds()) {
      return;
    }

    try {
      // Initialize Google AdSense or Ad Manager
      if (this.config.adsenseClientId) {
        await this.initAdSense();
      } else if (this.config.adManagerNetworkCode) {
        await this.initAdManager();
      }

      this.isInitialized = true;
      console.log('Ad Manager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Ad Manager:', error);
    }
  }

  private async initAdSense(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector('#adsense-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'adsense-script';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.config.adsenseClientId}`;
      script.crossOrigin = 'anonymous';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load AdSense'));
      document.head.appendChild(script);
    });
  }

  private async initAdManager(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector('#gpt-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'gpt-script';
      script.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
      script.onload = () => {
        (window as any).googletag = (window as any).googletag || { cmd: [] };
        (window as any).googletag.cmd.push(() => {
          (window as any).googletag.pubads().enableSingleRequest();
          (window as any).googletag.enableServices();
          resolve();
        });
      };
      script.onerror = () => reject(new Error('Failed to load GPT'));
      document.head.appendChild(script);
    });
  }

  mountBanner(element: HTMLElement, slotId: string): void {
    if (!this.canShowAds() || !element) {
      return;
    }

    // Create ad container with proper styling to prevent accidental clicks
    const adContainer = document.createElement('div');
    adContainer.className = 'ad-banner-container';
    adContainer.style.cssText = `
      margin: 16px 0;
      padding: 8px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      text-align: center;
      background-color: #fafafa;
      min-height: 250px;
      position: relative;
    `;

    // Add "Advertisement" label
    const label = document.createElement('div');
    label.textContent = 'Publicidad';
    label.style.cssText = `
      font-size: 12px;
      color: #666;
      margin-bottom: 8px;
      text-transform: uppercase;
    `;
    adContainer.appendChild(label);

    if (this.config.adsenseClientId) {
      this.mountAdSenseBanner(adContainer, slotId);
    } else if (this.config.adManagerNetworkCode) {
      this.mountGPTBanner(adContainer, slotId);
    }

    element.appendChild(adContainer);
  }

  private mountAdSenseBanner(container: HTMLElement, slotId: string): void {
    const adElement = document.createElement('ins');
    adElement.className = 'adsbygoogle';
    adElement.style.cssText = 'display:block;width:100%;height:250px;';
    adElement.setAttribute('data-ad-client', this.config.adsenseClientId!);
    adElement.setAttribute('data-ad-slot', slotId);
    adElement.setAttribute('data-ad-format', 'auto');
    adElement.setAttribute('data-full-width-responsive', 'true');

    container.appendChild(adElement);

    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }

  private mountGPTBanner(container: HTMLElement, slotId: string): void {
    const adElement = document.createElement('div');
    adElement.id = `gpt-${slotId}-${Date.now()}`;
    container.appendChild(adElement);

    if ((window as any).googletag) {
      (window as any).googletag.cmd.push(() => {
        const slot = (window as any).googletag
          .defineSlot(`/${this.config.adManagerNetworkCode}/${slotId}`, [320, 250], adElement.id)
          .addService((window as any).googletag.pubads());

        (window as any).googletag.display(adElement.id);
      });
    }
  }

  mountNativeInFeed(listSelector: string, everyN: number = 6): void {
    if (!this.canShowAds()) {
      return;
    }

    const listContainer = document.querySelector(listSelector);
    if (!listContainer) {
      return;
    }

    const items = Array.from(listContainer.children);
    let nativeCount = 0;

    items.forEach((item, index) => {
      if ((index + 1) % everyN === 0 && nativeCount < 3) { // Max 3 native ads per feed
        const nativeAd = this.createNativeAdCard();
        item.parentNode?.insertBefore(nativeAd, item.nextSibling);
        nativeCount++;
      }
    });
  }

  createNativeAdCard(): HTMLElement {
    const adCard = document.createElement('div');
    adCard.className = 'native-ad-card';
    adCard.style.cssText = `
      margin: 16px 0;
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background-color: #fafafa;
      min-height: 120px;
      position: relative;
    `;

    // Native ad content would be populated by the ad network
    adCard.innerHTML = `
      <div style="font-size: 12px; color: #666; margin-bottom: 8px;">Contenido patrocinado</div>
      <div style="min-height: 100px; background: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999;">
        Anuncio nativo
      </div>
    `;

    return adCard;
  }

  showRewarded(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.canShowAds() || this.rewardedWebCount >= 2) {
        resolve(false);
        return;
      }

      // Simplified rewarded implementation
      // In a real app, this would show a proper rewarded video ad
      const confirmed = confirm('¿Quieres ver un anuncio para obtener beneficios premium temporales?');
      if (confirmed) {
        this.rewardedWebCount++;
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  // Reset session counters
  resetSession(): void {
    this.rewardedWebCount = 0;
  }
}

// Export singleton instance
const adManagerInstance = new AdManager({
  adsenseClientId: import.meta.env.VITE_ADSENSE_CLIENT_ID,
  adManagerNetworkCode: import.meta.env.VITE_AD_MANAGER_NETWORK_CODE,
  enableCMP: import.meta.env.VITE_ENABLE_CMP === 'true',
});

export default adManagerInstance;