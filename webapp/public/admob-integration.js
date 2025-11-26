/**
 * AdMob Integration for TheCookFlow
 * This script handles AdMob initialization and ad loading in the Android WebView
 */

// AdMob configuration with production IDs
const ADMOB_IDS = {
  banner: 'ca-app-pub-7982290772698799/7257867786',
  appOpen: 'ca-app-pub-7982290772698799/2139367466',
  interstitial: 'ca-app-pub-7982290772698799/8325501869',
  native: 'ca-app-pub-7982290772698799/1052967761'
};

// AdMob integration object
window.TCFAdMob = {
  // Track ad states
  adsInitialized: false,
  consentStatus: null,
  isPremium: false,
  lastInterstitialShown: 0,
  
  // Initialize AdMob
  initialize: function() {
    console.log('[AdMob] Initializing AdMob integration...');
    
    // Check if running in Android WebView
    if (!window.Android || !window.Android.initializeAds) {
      console.log('[AdMob] Not running in Android WebView, ads disabled');
      return;
    }
    
    try {
      // Initialize ads through Android bridge
      window.Android.initializeAds(JSON.stringify(ADMOB_IDS));
      this.adsInitialized = true;
      console.log('[AdMob] AdMob initialized successfully');
      
      // Check consent status
      this.checkConsentStatus();
    } catch (error) {
      console.error('[AdMob] Failed to initialize:', error);
    }
  },
  
  // Check GDPR consent status
  checkConsentStatus: function() {
    const consent = localStorage.getItem('gdpr_consent');
    this.consentStatus = consent === 'true';
    
    if (!this.consentStatus) {
      console.log('[AdMob] No GDPR consent, ads disabled');
      this.requestConsent();
    }
    
    return this.consentStatus;
  },
  
  // Request GDPR consent
  requestConsent: function() {
    if (window.Android && window.Android.requestConsent) {
      window.Android.requestConsent();
    }
  },
  
  // Update premium status
  setPremiumStatus: function(isPremium) {
    this.isPremium = isPremium;
    console.log('[AdMob] Premium status updated:', isPremium);
    
    if (isPremium) {
      this.hideAllAds();
    }
  },
  
  // Load banner ad
  loadBannerAd: function(position = 'bottom') {
    if (!this.shouldShowAds()) return;
    
    try {
      if (window.Android && window.Android.loadBannerAd) {
        window.Android.loadBannerAd(ADMOB_IDS.banner, position);
        console.log('[AdMob] Banner ad requested');
      }
    } catch (error) {
      console.error('[AdMob] Failed to load banner:', error);
    }
  },
  
  // Load interstitial ad
  loadInterstitialAd: function(callback) {
    if (!this.shouldShowAds()) {
      if (callback) callback(false);
      return;
    }
    
    // Check cooldown (5 minutes)
    const now = Date.now();
    const cooldown = 5 * 60 * 1000; // 5 minutes
    if (now - this.lastInterstitialShown < cooldown) {
      console.log('[AdMob] Interstitial on cooldown');
      if (callback) callback(false);
      return;
    }
    
    try {
      if (window.Android && window.Android.loadInterstitialAd) {
        window.Android.loadInterstitialAd(ADMOB_IDS.interstitial);
        this.lastInterstitialShown = now;
        console.log('[AdMob] Interstitial ad requested');
        
        // Set up callback
        window.onInterstitialClosed = function() {
          console.log('[AdMob] Interstitial closed');
          if (callback) callback(true);
        };
      }
    } catch (error) {
      console.error('[AdMob] Failed to load interstitial:', error);
      if (callback) callback(false);
    }
  },
  
  // Load native ad
  loadNativeAd: function(elementId) {
    if (!this.shouldShowAds()) return;
    
    try {
      if (window.Android && window.Android.loadNativeAd) {
        window.Android.loadNativeAd(ADMOB_IDS.native, elementId);
        console.log('[AdMob] Native ad requested for element:', elementId);
      }
    } catch (error) {
      console.error('[AdMob] Failed to load native ad:', error);
    }
  },
  
  // Load app open ad
  loadAppOpenAd: function() {
    if (!this.shouldShowAds()) return;
    
    try {
      if (window.Android && window.Android.loadAppOpenAd) {
        window.Android.loadAppOpenAd(ADMOB_IDS.appOpen);
        console.log('[AdMob] App open ad requested');
      }
    } catch (error) {
      console.error('[AdMob] Failed to load app open ad:', error);
    }
  },
  
  // Check if ads should be shown
  shouldShowAds: function() {
    if (!this.adsInitialized) {
      console.log('[AdMob] Ads not initialized');
      return false;
    }
    
    if (this.isPremium) {
      console.log('[AdMob] Premium user, ads disabled');
      return false;
    }
    
    if (!this.consentStatus) {
      console.log('[AdMob] No consent, ads disabled');
      return false;
    }
    
    return true;
  },
  
  // Hide all ads (for premium users)
  hideAllAds: function() {
    try {
      if (window.Android && window.Android.hideAllAds) {
        window.Android.hideAllAds();
        console.log('[AdMob] All ads hidden');
      }
      
      // Also hide web placeholders
      const adElements = document.querySelectorAll('[data-ad-unit]');
      adElements.forEach(el => {
        el.style.display = 'none';
      });
    } catch (error) {
      console.error('[AdMob] Failed to hide ads:', error);
    }
  },
  
  // Track ad unlock (for freemium limits)
  trackAdUnlock: function(callback) {
    // Show interstitial ad and unlock on close
    this.loadInterstitialAd(function(shown) {
      if (shown) {
        // Call API to record ad unlock
        fetch('/api/freemium/unlock-after-ad', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
          console.log('[AdMob] Ad unlock recorded:', data);
          if (callback) callback(true);
        })
        .catch(error => {
          console.error('[AdMob] Failed to record ad unlock:', error);
          if (callback) callback(false);
        });
      } else {
        if (callback) callback(false);
      }
    });
  },
  
  // Auto-load ads on page elements
  autoLoadAds: function() {
    if (!this.shouldShowAds()) return;
    
    // Find all ad placeholders
    const banners = document.querySelectorAll('[data-ad-unit="banner"]');
    const natives = document.querySelectorAll('[data-ad-unit="native"]');
    
    // Load banner ads
    banners.forEach((el, index) => {
      const position = el.dataset.position || 'bottom';
      if (index === 0) { // Only load one banner at a time
        this.loadBannerAd(position);
      }
    });
    
    // Load native ads
    natives.forEach((el) => {
      if (el.id) {
        this.loadNativeAd(el.id);
      }
    });
  }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    window.TCFAdMob.initialize();
    
    // Auto-load ads after a short delay
    setTimeout(() => {
      window.TCFAdMob.autoLoadAds();
    }, 1000);
  });
} else {
  window.TCFAdMob.initialize();
  setTimeout(() => {
    window.TCFAdMob.autoLoadAds();
  }, 1000);
}

// Listen for premium status changes
window.addEventListener('tcf-premium-changed', function(event) {
  window.TCFAdMob.setPremiumStatus(event.detail.isPremium);
});

// Export for use in React components
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.TCFAdMob;
}