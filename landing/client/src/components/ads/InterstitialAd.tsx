import { useEffect, useRef } from 'react';
import { usePremium } from '@/hooks/usePremium';
import { X } from 'lucide-react';

interface InterstitialAdProps {
  isVisible: boolean;
  onClose: () => void;
  slotId?: string;
  timeout?: number;
}

export default function InterstitialAd({ 
  isVisible, 
  onClose, 
  slotId = '1234567894',
  timeout = 1500 
}: InterstitialAdProps) {
  const { isPremium } = usePremium();
  const adRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isVisible || isPremium) return;

    // Fallback: close if ad doesn't load in 1.5s
    timeoutRef.current = setTimeout(() => {
      console.warn('Interstitial ad timeout, closing');
      onClose();
    }, timeout);

    const loadAd = () => {
      try {
        if ((window as any).googletag && adRef.current) {
          const slot = (window as any).googletag.defineSlot(
            `/21234567890/${slotId}`,
            ['fluid', [320, 480], [768, 1024]],
            adRef.current
          );
          
          if (slot) {
            slot.addService((window as any).googletag.pubads());
            (window as any).googletag.display(adRef.current);
            
            // Clear timeout since ad loaded
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          }
        }
      } catch (error) {
        console.warn('Error loading interstitial ad:', error);
        onClose();
      }
    };

    if ((window as any).googletag?.cmd) {
      (window as any).googletag.cmd.push(loadAd);
    } else {
      setTimeout(loadAd, 100);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, isPremium, slotId, timeout, onClose]);

  if (!isVisible || isPremium) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="relative bg-blackboard border border-chalk-green/30 rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-chalk-green/20 transition-colors"
          aria-label="Cerrar anuncio"
        >
          <X className="w-5 h-5 text-chalk" />
        </button>
        
        <div 
          ref={adRef}
          className="w-full min-h-[300px] flex items-center justify-center mt-8"
        >
          <div className="text-chalk/60 text-center">
            <div className="animate-pulse mb-2">Cargando anuncio...</div>
            <div className="text-sm">Se cerrará automáticamente</div>
          </div>
        </div>
      </div>
    </div>
  );
}