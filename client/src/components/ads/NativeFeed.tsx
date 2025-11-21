import { useEffect, useRef } from 'react';
import { usePremium } from '@/hooks/usePremium';
import adManager from '@/ads/adManager';

interface NativeFeedProps {
  targetSelector: string;
  frequency?: number; // Show ad every N items
  maxAds?: number;
}

export default function NativeFeed({ 
  targetSelector, 
  frequency = 6, 
  maxAds = 3 
}: NativeFeedProps) {
  const { isPremium } = usePremium();
  const mounted = useRef(false);

  useEffect(() => {
    if (isPremium || mounted.current) {
      return;
    }

    // Wait for the target container to be available
    const checkAndMount = () => {
      const targetContainer = document.querySelector(targetSelector);
      if (targetContainer && targetContainer.children.length > 0) {
        adManager.mountNativeInFeed(targetSelector, frequency);
        mounted.current = true;
      } else {
        // Retry after a short delay
        setTimeout(checkAndMount, 500);
      }
    };

    checkAndMount();

    // Cleanup function
    return () => {
      if (!isPremium) {
        // Remove native ads on unmount
        const nativeAds = document.querySelectorAll('.native-ad-card');
        nativeAds.forEach(ad => ad.remove());
      }
      mounted.current = false;
    };
  }, [isPremium, targetSelector, frequency]);

  // This component doesn't render anything visible
  return null;
}