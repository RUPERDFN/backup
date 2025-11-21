import { useEffect, useCallback, useState } from 'react';
import { usePlan } from './usePlan';
import { ADMOB_CONFIG } from '@/config/admob';

declare global {
  interface Window {
    TCFAdMob?: {
      initialize: () => void;
      setPremiumStatus: (isPremium: boolean) => void;
      loadBannerAd: (position?: string) => void;
      loadInterstitialAd: (callback?: (shown: boolean) => void) => void;
      loadNativeAd: (elementId: string) => void;
      loadAppOpenAd: () => void;
      trackAdUnlock: (callback?: (success: boolean) => void) => void;
      hideAllAds: () => void;
      shouldShowAds: () => boolean;
    };
  }
}

interface UseAdMobReturn {
  isInitialized: boolean;
  shouldShowAds: boolean;
  showBannerAd: (position?: 'top' | 'bottom') => void;
  showInterstitialAd: (callback?: (shown: boolean) => void) => void;
  showNativeAd: (elementId: string) => void;
  showRewardedAdForUnlock: () => Promise<boolean>;
  hideAllAds: () => void;
}

export function useAdMob(): UseAdMobReturn {
  const { isPremium } = usePlan();
  const [isInitialized, setIsInitialized] = useState(false);
  const [shouldShowAds, setShouldShowAds] = useState(false);

  // Initialize AdMob
  useEffect(() => {
    const initAdMob = () => {
      if (window.TCFAdMob) {
        window.TCFAdMob.initialize();
        setIsInitialized(true);
        
        // Update premium status
        window.TCFAdMob.setPremiumStatus(isPremium);
        
        // Check if should show ads
        setShouldShowAds(window.TCFAdMob.shouldShowAds());
      } else {
        console.log('[AdMob] Integration script not loaded');
        
        // Try loading the script
        const script = document.createElement('script');
        script.src = '/admob-integration.js';
        script.async = true;
        script.onload = () => {
          if (window.TCFAdMob) {
            window.TCFAdMob.initialize();
            window.TCFAdMob.setPremiumStatus(isPremium);
            setIsInitialized(true);
            setShouldShowAds(window.TCFAdMob.shouldShowAds());
          }
        };
        document.body.appendChild(script);
      }
    };

    // Initialize on mount
    initAdMob();
  }, []);

  // Update premium status when it changes
  useEffect(() => {
    if (isInitialized && window.TCFAdMob) {
      window.TCFAdMob.setPremiumStatus(isPremium);
      setShouldShowAds(window.TCFAdMob.shouldShowAds());
    }
  }, [isPremium, isInitialized]);

  // Show banner ad
  const showBannerAd = useCallback((position: 'top' | 'bottom' = 'bottom') => {
    if (isInitialized && window.TCFAdMob) {
      window.TCFAdMob.loadBannerAd(position);
    }
  }, [isInitialized]);

  // Show interstitial ad
  const showInterstitialAd = useCallback((callback?: (shown: boolean) => void) => {
    if (isInitialized && window.TCFAdMob) {
      window.TCFAdMob.loadInterstitialAd(callback);
    } else if (callback) {
      callback(false);
    }
  }, [isInitialized]);

  // Show native ad
  const showNativeAd = useCallback((elementId: string) => {
    if (isInitialized && window.TCFAdMob) {
      window.TCFAdMob.loadNativeAd(elementId);
    }
  }, [isInitialized]);

  // Show rewarded ad for unlock
  const showRewardedAdForUnlock = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (isInitialized && window.TCFAdMob) {
        window.TCFAdMob.trackAdUnlock((success: boolean) => {
          resolve(success);
        });
      } else {
        resolve(false);
      }
    });
  }, [isInitialized]);

  // Hide all ads
  const hideAllAds = useCallback(() => {
    if (isInitialized && window.TCFAdMob) {
      window.TCFAdMob.hideAllAds();
    }
  }, [isInitialized]);

  return {
    isInitialized,
    shouldShowAds,
    showBannerAd,
    showInterstitialAd,
    showNativeAd,
    showRewardedAdForUnlock,
    hideAllAds
  };
}