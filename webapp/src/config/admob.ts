/**
 * AdMob Configuration for TheCookFlow
 * Production Ad Unit IDs
 */

export const ADMOB_CONFIG = {
  // Publisher ID
  publisherId: 'ca-app-pub-7982290772698799',
  
  // Ad Unit IDs
  adUnits: {
    banner: 'ca-app-pub-7982290772698799/7257867786',
    appOpen: 'ca-app-pub-7982290772698799/2139367466', 
    interstitial: 'ca-app-pub-7982290772698799/8325501869',
    native: 'ca-app-pub-7982290772698799/1052967761'
  },
  
  // Test Mode (set to false for production)
  testMode: false,
  
  // Ad Display Settings
  settings: {
    // Banner ad settings
    banner: {
      size: 'SMART_BANNER',
      position: 'bottom',
      autoShow: true
    },
    
    // Interstitial settings
    interstitial: {
      autoShow: false,
      showOnMenuGeneration: true,
      cooldownMinutes: 5
    },
    
    // Native ad settings
    native: {
      template: 'medium',
      showInFeed: true,
      showInRecipes: true
    },
    
    // App open ad settings
    appOpen: {
      showOnColdStart: true,
      showOnResume: true,
      cooldownMinutes: 60
    }
  },
  
  // GDPR/CMP Settings
  consent: {
    requireConsent: true,
    testDeviceIds: [], // Add test device IDs here during development
    tagForUnderAgeOfConsent: false,
    tagForChildDirectedTreatment: false
  }
};

// Helper function to get ad unit ID
export function getAdUnitId(type: 'banner' | 'interstitial' | 'native' | 'appOpen'): string {
  return ADMOB_CONFIG.adUnits[type];
}

// Helper function to check if ads should be shown
export function shouldShowAds(isPremium: boolean, hasConsent: boolean): boolean {
  if (isPremium) return false;
  if (ADMOB_CONFIG.consent.requireConsent && !hasConsent) return false;
  return true;
}