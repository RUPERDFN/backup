import { useEffect, useRef } from 'react';
import { usePremium } from '@/hooks/usePremium';
import adManager from '@/ads/adManager';

interface BannerBottomProps {
  slotId: string;
  className?: string;
}

export default function BannerBottom({ slotId, className = '' }: BannerBottomProps) {
  const { isPremium } = usePremium();
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPremium || !adContainerRef.current) {
      return;
    }

    // Mount banner ad
    adManager.mountBanner(adContainerRef.current, slotId);

    // Cleanup function
    return () => {
      if (adContainerRef.current) {
        adContainerRef.current.innerHTML = '';
      }
    };
  }, [isPremium, slotId]);

  // Don't render if user is premium
  if (isPremium) {
    return null;
  }

  return (
    <div 
      ref={adContainerRef}
      className={`banner-bottom ${className}`}
      style={{
        margin: '16px 0',
        minHeight: '250px',
        position: 'sticky',
        bottom: '16px',
        zIndex: 10,
      }}
    />
  );
}