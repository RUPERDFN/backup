import { useState, useCallback, useEffect } from 'react';
import { usePremium } from './usePremium';

interface AdCooldown {
  [key: string]: number;
}

interface AdFrequencyRules {
  interstitial: {
    globalCooldown: number; // 120s
    maxPerSession: number;
  };
  rewarded: {
    maxPerSession: number; // 2 per session
    resetOnAppOpen: boolean;
  };
  banner: {
    minRefreshInterval: number; // 60-90s
  };
  native: {
    minItemsBefore: number; // No antes del ítem 3
    frequency: number; // 1 cada 6-8 tarjetas
    firstAt: number; // Después del 6º
  };
  appOpen: {
    maxPerDay: number; // 1 per day (Android only)
  };
}

export function useAdManager() {
  const { isPremium } = usePremium();
  const [interstitialVisible, setInterstitialVisible] = useState(false);
  const [cooldowns, setCooldowns] = useState<AdCooldown>({});
  const [sessionCounts, setSessionCounts] = useState<Record<string, number>>({});
  const [hasShownCMP, setHasShownCMP] = useState(false);

  // Frequency rules as per expert specifications
  const rules: AdFrequencyRules = {
    interstitial: {
      globalCooldown: 120000, // 120s
      maxPerSession: 1
    },
    rewarded: {
      maxPerSession: 2, // ≤ 2 por sesión
      resetOnAppOpen: true
    },
    banner: {
      minRefreshInterval: 75000 // 75s average of 60-90s
    },
    native: {
      minItemsBefore: 3, // No antes del ítem 3
      frequency: 7, // Average of 6-8 = 7
      firstAt: 6 // Después del 6º
    },
    appOpen: {
      maxPerDay: 1 // Android only
    }
  };

  // Initialize session counts from localStorage on app open
  useEffect(() => {
    const savedCounts = localStorage.getItem('adSessionCounts');
    const lastReset = localStorage.getItem('adSessionReset');
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    
    // Reset session counts if more than a day has passed
    if (!lastReset || (now - parseInt(lastReset)) > dayInMs) {
      localStorage.setItem('adSessionReset', now.toString());
      localStorage.removeItem('adSessionCounts');
      setSessionCounts({});
    } else if (savedCounts) {
      setSessionCounts(JSON.parse(savedCounts));
    }

    // Check CMP status
    const cmpShown = localStorage.getItem('cmpShown');
    setHasShownCMP(!!cmpShown);
  }, []);

  // Save session counts to localStorage
  useEffect(() => {
    localStorage.setItem('adSessionCounts', JSON.stringify(sessionCounts));
  }, [sessionCounts]);

  const checkGDPRConsent = useCallback((): boolean => {
    // GDPR: mostrar CMP/UMP antes de la primera impresión
    if (!hasShownCMP) {
      console.log('GDPR: CMP required before first ad impression');
      // In production, show CMP here
      localStorage.setItem('cmpShown', 'true');
      setHasShownCMP(true);
      return true; // Assuming consent for demo
    }
    return true;
  }, [hasShownCMP]);

  const checkCooldown = useCallback((type: string, minCooldown: number): boolean => {
    const lastShown = cooldowns[type];
    if (!lastShown) return true;
    return Date.now() - lastShown >= minCooldown;
  }, [cooldowns]);

  const updateCooldown = useCallback((type: string) => {
    setCooldowns(prev => ({ ...prev, [type]: Date.now() }));
  }, []);

  const incrementSessionCount = useCallback((type: string) => {
    setSessionCounts(prev => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
  }, []);

  const showInterstitial = useCallback((type: string = 'GLOBAL') => {
    // Premium: si IS_PREMIUM === true → oculta TODO
    if (isPremium) return false;
    
    // GDPR check
    if (!checkGDPRConsent()) return false;
    
    // Interstitial: ≤ 1 cada 120 s (cooldown global)
    if (!checkCooldown('INTERSTITIAL_GLOBAL', rules.interstitial.globalCooldown)) {
      console.log(`Interstitial cooldown active (${rules.interstitial.globalCooldown/1000}s)`);
      return false;
    }

    // Check session limit
    const sessionCount = sessionCounts['INTERSTITIAL'] || 0;
    if (sessionCount >= rules.interstitial.maxPerSession) {
      console.log(`Interstitial session limit reached (${sessionCount}/${rules.interstitial.maxPerSession})`);
      return false;
    }

    setInterstitialVisible(true);
    updateCooldown('INTERSTITIAL_GLOBAL');
    incrementSessionCount('INTERSTITIAL');
    return true;
  }, [isPremium, checkGDPRConsent, checkCooldown, updateCooldown, incrementSessionCount, sessionCounts, rules]);

  const showRewarded = useCallback((type: string, callback: () => void) => {
    // Premium: si IS_PREMIUM === true → oculta TODO
    if (isPremium) {
      callback();
      return true;
    }

    // GDPR check
    if (!checkGDPRConsent()) return false;

    // Rewarded: ≤ 2 por sesión (reseteo al abrir app)
    const sessionCount = sessionCounts['REWARDED'] || 0;
    if (sessionCount >= rules.rewarded.maxPerSession) {
      console.log(`Rewarded ad limit reached (${sessionCount}/${rules.rewarded.maxPerSession})`);
      return false;
    }

    console.log(`Showing rewarded ad for ${type}`);
    incrementSessionCount('REWARDED');
    
    // Simulate ad completion (in production, this would be in the ad callback)
    setTimeout(() => {
      callback();
    }, 1000);

    return true;
  }, [isPremium, checkGDPRConsent, sessionCounts, incrementSessionCount, rules]);

  const canShowNativeAd = useCallback((itemIndex: number, totalItems: number): boolean => {
    // Premium: si IS_PREMIUM === true → oculta TODO
    if (isPremium) return false;
    
    // GDPR check
    if (!checkGDPRConsent()) return false;

    // Native: 1 cada 6–8 tarjetas, no antes del ítem 3 en una vista
    if (itemIndex < rules.native.minItemsBefore) return false;
    
    // After 6th item, then every 7 items (average of 6-8)
    if (itemIndex === rules.native.firstAt) return true;
    if (itemIndex > rules.native.firstAt && (itemIndex - rules.native.firstAt) % rules.native.frequency === 0) return true;
    
    return false;
  }, [isPremium, checkGDPRConsent, rules]);

  const canRefreshBanner = useCallback((bannerId: string): boolean => {
    // Premium: si IS_PREMIUM === true → oculta TODO
    if (isPremium) return false;
    
    // Banners: sin refresh < 60–90 s
    return checkCooldown(`BANNER_${bannerId}`, rules.banner.minRefreshInterval);
  }, [isPremium, checkCooldown, rules]);

  const refreshBanner = useCallback((bannerId: string) => {
    updateCooldown(`BANNER_${bannerId}`);
  }, [updateCooldown]);

  const closeInterstitial = useCallback(() => {
    setInterstitialVisible(false);
  }, []);

  return {
    // Core ad methods
    showInterstitial,
    showRewarded,
    closeInterstitial,
    canShowNativeAd,
    canRefreshBanner,
    refreshBanner,
    
    // State
    interstitialVisible,
    sessionCounts,
    
    // Rules and utilities
    rules,
    checkCooldown,
    isPremium
  };
}