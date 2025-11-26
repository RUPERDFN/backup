import { useEffect, useRef } from 'react';
import { usePremium } from '@/hooks/usePremium';
import { useAdManager } from '@/hooks/useAdManager';

interface BannerShoppingProps {
  className?: string;
  slotId?: string;
}

export default function BannerShopping({ className = '', slotId = '1234567893' }: BannerShoppingProps) {
  const { isPremium } = usePremium();
  const { canRefreshBanner, refreshBanner } = useAdManager();
  const adRef = useRef<HTMLDivElement>(null);
  const adLoadedRef = useRef(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Premium: si IS_PREMIUM === true → oculta TODO
    if (isPremium || adLoadedRef.current) return;

    const loadAd = () => {
      try {
        if ((window as any).googletag && adRef.current) {
          const slot = (window as any).googletag.defineSlot(
            `/21234567890/${slotId}`,
            ['fluid', [320, 50], [728, 90], [970, 90]],
            adRef.current
          );
          
          if (slot) {
            slot.addService((window as any).googletag.pubads());
            (window as any).googletag.display(adRef.current);
            adLoadedRef.current = true;

            // Banners: sin refresh < 60–90 s (setup auto-refresh)
            const setupRefresh = () => {
              if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
              }
              
              refreshIntervalRef.current = setInterval(() => {
                if (canRefreshBanner(slotId) && (window as any).googletag && slot) {
                  (window as any).googletag.pubads().refresh([slot]);
                  refreshBanner(slotId);
                }
              }, 75000); // 75s (average of 60-90s)
            };

            setupRefresh();
          }
        }
      } catch (error) {
        console.warn('Error loading shopping banner ad:', error);
      }
    };

    if ((window as any).googletag?.cmd) {
      (window as any).googletag.cmd.push(loadAd);
    } else {
      setTimeout(loadAd, 100);
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [isPremium, slotId, canRefreshBanner, refreshBanner]);

  if (isPremium) return null;

  return (
    <div 
      className={`ad-banner ad-banner--shopping bg-black/10 border border-chalk-green/20 rounded-lg mt-6 md:sticky md:bottom-0 z-10 ${className}`}
      aria-label="Publicidad"
      style={{
        // ESPACIADO: deja 12–16 px libres alrededor para evitar clics accidentales
        margin: '16px 12px',
        padding: '16px'
      }}
    >
      <div 
        ref={adRef}
        className="w-full min-h-[90px] flex items-center justify-center"
      >
        <div className="text-chalk/60 text-sm">
          <div className="animate-pulse">Cargando anuncio...</div>
        </div>
      </div>
    </div>
  );
}