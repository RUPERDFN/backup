import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ADMOB_CONFIG, shouldShowAds } from '@/config/admob';

interface AdBannerProps {
  position: 'top' | 'bottom' | 'inline';
  className?: string;
}

export function AdBanner({ position, className = '' }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [consentGiven, setConsentGiven] = useState(false);

  // Get user premium status
  const { data: userStatus } = useQuery({
    queryKey: ['/api/subscription/status'],
    retry: false,
    refetchInterval: false
  });

  // Check for GDPR consent (simplified for demo)
  useEffect(() => {
    const consent = localStorage.getItem('gdpr_consent');
    setConsentGiven(consent === 'true');
  }, []);

  // Don't show ads for premium users
  if (userStatus?.plan === 'pro' || userStatus?.trialActive) {
    return null;
  }

  // Don't show ads without consent
  if (!consentGiven) {
    return null;
  }

  // Hide if manually closed
  if (!isVisible) {
    return null;
  }

  const bannerStyles = {
    top: 'fixed top-0 left-0 right-0 z-40',
    bottom: 'fixed bottom-0 left-0 right-0 z-40',
    inline: 'relative'
  };

  return (
    <div 
      className={`${bannerStyles[position]} ${className}`}
      data-testid={`ad-banner-${position}`}
      data-ad-unit="banner"
      data-ad-unit-id={ADMOB_CONFIG.adUnits.banner}
    >
      <Card className="bg-dark-green/90 border-chalk-green/30 backdrop-blur-sm">
        <div className="relative p-4">
          {/* Close button for dismissible ads */}
          {position !== 'inline' && (
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 text-chalk/50 hover:text-chalk-green"
              aria-label="Cerrar anuncio"
              data-testid="ad-banner-close"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Ad placeholder content */}
          <div className="flex items-center justify-center min-h-[100px] bg-black/30 rounded-lg border border-chalk-green/20">
            <div className="text-center">
              <p className="text-chalk/50 text-xs mb-2">PUBLICIDAD</p>
              <div className="bg-chalk-green/10 p-4 rounded">
                <p className="text-chalk-green font-handwritten text-lg">
                  🍕 Pizza Casa - 2x1 Martes
                </p>
                <p className="text-chalk/70 text-sm mt-1">
                  Oferta exclusiva para usuarios TheCookFlow
                </p>
              </div>
            </div>
          </div>

          {/* Ad provider attribution */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-chalk/30">Powered by AdNetwork</span>
            <a 
              href="#" 
              className="text-xs text-chalk/30 hover:text-chalk/50 underline"
              onClick={(e) => {
                e.preventDefault();
                alert('Configuración de privacidad - Aquí puedes gestionar tus preferencias de anuncios');
              }}
            >
              Privacidad
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}