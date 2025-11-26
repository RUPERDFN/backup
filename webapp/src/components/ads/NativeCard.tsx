import { useEffect, useRef } from 'react';
import { usePremium } from '@/hooks/usePremium';

interface NativeCardProps {
  className?: string;
  slotId?: string;
}

export default function NativeCard({ className = '', slotId = '1234567890' }: NativeCardProps) {
  const { isPremium } = usePremium();
  const adRef = useRef<HTMLDivElement>(null);
  const adLoadedRef = useRef(false);

  useEffect(() => {
    // Premium: si IS_PREMIUM === true → oculta TODO
    if (isPremium || adLoadedRef.current) return;

    const loadAd = () => {
      try {
        if ((window as any).googletag && adRef.current) {
          const slot = (window as any).googletag.defineSlot(
            `/21234567890/${slotId}`,
            ['fluid'],
            adRef.current
          );
          
          if (slot) {
            slot.addService((window as any).googletag.pubads());
            (window as any).googletag.display(adRef.current);
            adLoadedRef.current = true;
          }
        }
      } catch (error) {
        console.warn('Error loading native card ad:', error);
      }
    };

    if ((window as any).googletag?.cmd) {
      (window as any).googletag.cmd.push(loadAd);
    } else {
      // Fallback for when GPT is not ready
      setTimeout(loadAd, 100);
    }
  }, [isPremium, slotId]);

  if (isPremium) return null;

  return (
    <li 
      className={`ad-card native-ad recipe-card bg-black/20 border border-chalk-green/30 rounded-lg ${className}`}
      role="complementary"
      aria-label="Contenido patrocinado"
      style={{ 
        marginBlock: '16px',
        // ESPACIADO: deja 12–16 px libres alrededor para evitar clics accidentales
        padding: '16px',
        margin: '16px 12px'
      }}
    >
      <div 
        ref={adRef}
        className="w-full min-h-[200px] flex items-center justify-center"
      >
        <div className="text-chalk/60 text-sm">
          <div className="animate-pulse">Cargando contenido patrocinado...</div>
        </div>
      </div>
    </li>
  );
}