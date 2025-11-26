import { useEffect, useRef } from 'react';
import { usePremium } from '@/hooks/usePremium';

interface BannerDetailProps {
  className?: string;
  slotId?: string;
}

export default function BannerDetail({ className = '', slotId = '1234567892' }: BannerDetailProps) {
  const { isPremium } = usePremium();
  const adRef = useRef<HTMLDivElement>(null);
  const adLoadedRef = useRef(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isPremium || adLoadedRef.current) return;

    const loadAd = () => {
      try {
        if ((window as any).googletag && adRef.current) {
          const slot = (window as any).googletag.defineSlot(
            `/21234567890/${slotId}`,
            ['fluid', [320, 50], [728, 90]],
            adRef.current
          );
          
          if (slot) {
            slot.addService((window as any).googletag.pubads());
            (window as any).googletag.display(adRef.current);
            adLoadedRef.current = true;

            // No refresh < 60s as specified
            if (refreshTimeoutRef.current) {
              clearTimeout(refreshTimeoutRef.current);
            }
            refreshTimeoutRef.current = setTimeout(() => {
              if ((window as any).googletag && slot) {
                (window as any).googletag.pubads().refresh([slot]);
              }
            }, 60000);
          }
        }
      } catch (error) {
        console.warn('Error loading detail banner ad:', error);
      }
    };

    if ((window as any).googletag?.cmd) {
      (window as any).googletag.cmd.push(loadAd);
    } else {
      setTimeout(loadAd, 100);
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [isPremium, slotId]);

  if (isPremium) return null;

  return (
    <div 
      className={`ad-banner ad-banner--detail bg-black/10 border border-chalk-green/20 rounded-lg p-4 my-6 ${className}`}
      aria-label="Publicidad"
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