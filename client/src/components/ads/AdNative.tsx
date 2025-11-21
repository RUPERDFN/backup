import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Clock, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ADMOB_CONFIG, shouldShowAds } from '@/config/admob';

interface AdNativeProps {
  variant?: 'recipe' | 'product' | 'offer';
  className?: string;
}

export function AdNative({ variant = 'product', className = '' }: AdNativeProps) {
  const [consentGiven, setConsentGiven] = useState(false);

  // Get user premium status
  const { data: userStatus } = useQuery({
    queryKey: ['/api/subscription/status'],
    retry: false,
    refetchInterval: false
  });

  // Check for GDPR consent
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

  const renderAdContent = () => {
    switch (variant) {
      case 'recipe':
        return (
          <>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-chalk-green/10 text-chalk-green border-chalk-green/30 text-xs">
                  PATROCINADO
                </Badge>
                <Clock className="w-4 h-4 text-chalk/50" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <img 
                  src="/api/placeholder/300/200" 
                  alt="Receta patrocinada"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <h3 className="font-handwritten text-xl text-chalk-green">
                  🍝 Pasta Barilla con Salsa Pomodoro
                </h3>
                <p className="text-sm text-chalk/70">
                  Receta fácil en 15 minutos con ingredientes Barilla®
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-chalk/50">Por Barilla®</span>
                  <button className="text-chalk-green text-sm hover:underline">
                    Ver receta →
                  </button>
                </div>
              </div>
            </CardContent>
          </>
        );

      case 'offer':
        return (
          <>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-yellow-600/10 text-yellow-600 border-yellow-600/30 text-xs">
                  OFERTA ESPECIAL
                </Badge>
                <TrendingUp className="w-4 h-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 p-4 rounded-lg">
                  <h3 className="font-bold text-lg text-chalk-green mb-2">
                    🎉 -30% en Carrefour
                  </h3>
                  <p className="text-sm text-chalk/80 mb-3">
                    Descuento exclusivo en productos frescos este fin de semana
                  </p>
                  <button className="w-full bg-chalk-green text-dark-green py-2 rounded-md font-medium hover:bg-chalk-green/90 transition-colors">
                    Aplicar cupón
                  </button>
                </div>
                <p className="text-xs text-chalk/40 text-center">
                  Válido hasta el domingo • Términos aplican
                </p>
              </div>
            </CardContent>
          </>
        );

      case 'product':
      default:
        return (
          <>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-chalk-green/10 text-chalk-green border-chalk-green/30 text-xs">
                  RECOMENDADO
                </Badge>
                <ShoppingBag className="w-4 h-4 text-chalk/50" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-20 h-20 bg-chalk-green/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🥑</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-chalk-green">
                      Aguacates Premium Bio
                    </h3>
                    <p className="text-sm text-chalk/70 mt-1">
                      Pack de 4 unidades • Origen: México
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-chalk-green">€3.99</span>
                      <span className="text-sm text-chalk/50 line-through">€5.49</span>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-chalk-green/10 text-chalk-green py-2 rounded-md text-sm font-medium hover:bg-chalk-green/20 transition-colors border border-chalk-green/30">
                  Añadir al carrito
                </button>
              </div>
            </CardContent>
          </>
        );
    }
  };

  return (
    <div 
      className={`ad-native ${className}`}
      data-testid={`ad-native-${variant}`}
      data-ad-unit="native"
      data-ad-unit-id={ADMOB_CONFIG.adUnits.native}
    >
      <Card className="bg-dark-green/50 border-chalk-green/30 hover:border-chalk-green/50 transition-colors">
        {renderAdContent()}
      </Card>
    </div>
  );
}