import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Check, Smartphone, Download, AlertTriangle, Clock } from "lucide-react";
import { Link } from "wouter";

interface GooglePlaySubscription {
  isPremium?: boolean;
  subscriptionStatus: string;
  expiryTime?: string;
  autoRenewing?: boolean;
  purchaseToken?: string;
  subscriptionId?: string;
  isInTrial?: boolean;
  trialEndDate?: string;
  trialExpired?: boolean;
  canGenerateMenu?: boolean;
  limits?: {
    maxMenusPerWeek: number;
    maxServings: number;
    maxDays: number;
    maxMealsPerDay: number;
  };
}

interface GooglePlayStatusProps {
  compact?: boolean;
}

export function GooglePlayStatus({ compact = false }: GooglePlayStatusProps) {
  const { data: subscription, isLoading } = useQuery<GooglePlaySubscription>({
    queryKey: ['/api/google-play/subscription-status'],
  });

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-chalk/20 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-chalk/20 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPremium = subscription?.isPremium || false;
  const status = subscription?.subscriptionStatus || 'trial';
  const isInTrial = subscription?.isInTrial || false;
  const trialExpired = subscription?.trialExpired || false;
  const canGenerateMenu = subscription?.canGenerateMenu || false;
  const trialEndDate = subscription?.trialEndDate ? new Date(subscription.trialEndDate) : null;
  const expiryTime = subscription?.expiryTime ? new Date(subscription.expiryTime) : null;
  const autoRenewing = subscription?.autoRenewing || false;

  const isExpired = expiryTime && new Date() > expiryTime;
  const daysUntilExpiry = expiryTime ? Math.ceil((expiryTime.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
  const trialDaysLeft = trialEndDate ? Math.max(0, Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 glass-card border border-chalk/20 rounded-lg">
        <div className="flex items-center space-x-2">
          {isPremium && !isExpired ? (
            <>
              <Crown className="w-4 h-4 text-chalk-green" />
              <span className="text-sm font-medium text-chalk-white">Premium</span>
              {expiryTime && daysUntilExpiry > 0 && (
                <span className="text-xs text-chalk">({daysUntilExpiry}d)</span>
              )}
            </>
          ) : isInTrial && !trialExpired ? (
            <>
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-chalk-white">Prueba ({trialDaysLeft}d)</span>
            </>
          ) : trialExpired ? (
            <>
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400">Prueba Expirada</span>
            </>
          ) : (
            <>
              <Smartphone className="w-4 h-4 text-chalk" />
              <span className="text-sm text-chalk">Nuevo Usuario</span>
            </>
          )}
        </div>
        
        {!isPremium && (
          <Button asChild size="sm" className="bg-chalk-green hover:bg-chalk-green/80 text-dark">
            <Link href="/pricing">
              Actualizar
            </Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="glass-card border-chalk/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center text-chalk-white">
            {isPremium && !isExpired ? (
              <>
                <Crown className="w-5 h-5 text-chalk-green mr-2" />
                Premium Activo
              </>
            ) : isInTrial && !trialExpired ? (
              <>
                <Clock className="w-5 h-5 text-blue-400 mr-2" />
                Prueba Gratuita
              </>
            ) : trialExpired ? (
              <>
                <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                Prueba Expirada
              </>
            ) : (
              <>
                <Smartphone className="w-5 h-5 text-chalk mr-2" />
                Nuevo Usuario
              </>
            )}
          </span>
          
          <Badge 
            variant={isPremium && !isExpired ? "default" : "secondary"}
            className={isPremium && !isExpired ? "bg-chalk-green text-dark" : trialExpired ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"}
          >
            {isPremium && !isExpired ? 'Premium' : trialExpired ? 'Expirada' : 'Prueba'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status Information */}
        <div className="space-y-2">
          {isPremium && !isExpired ? (
            <div className="space-y-2">
              {expiryTime && (
                <div className="flex justify-between text-sm">
                  <span className="text-chalk">Expira:</span>
                  <span className="text-chalk-white">
                    {expiryTime.toLocaleDateString('es-ES')}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-chalk">Renovación automática:</span>
                <span className="text-chalk-white">
                  {autoRenewing ? 'Activa' : 'Desactivada'}
                </span>
              </div>
              {daysUntilExpiry > 0 && daysUntilExpiry <= 7 && (
                <div className="p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-md">
                  <p className="text-sm text-yellow-200">
                    Tu suscripción expira en {daysUntilExpiry} día{daysUntilExpiry !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          ) : isInTrial && !trialExpired ? (
            <div className="space-y-3">
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-md">
                <p className="text-sm text-blue-300 mb-2">
                  Prueba Gratuita - Límites incluidos:
                </p>
                <ul className="text-xs text-chalk space-y-1">
                  <li className="flex items-center">
                    <Check className="w-3 h-3 text-blue-400 mr-2" />
                    3 menús por semana
                  </li>
                  <li className="flex items-center">
                    <Check className="w-3 h-3 text-blue-400 mr-2" />
                    Hasta 2 personas
                  </li>
                  <li className="flex items-center">
                    <Check className="w-3 h-3 text-blue-400 mr-2" />
                    Lunes a viernes
                  </li>
                  <li className="flex items-center">
                    <Check className="w-3 h-3 text-blue-400 mr-2" />
                    3 comidas diarias
                  </li>
                  <li className="flex items-center">
                    <Check className="w-3 h-3 text-blue-400 mr-2" />
                    Solo dieta normal
                  </li>
                </ul>
              </div>
              {trialDaysLeft > 0 && (
                <div className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-md">
                  <p className="text-sm text-blue-200">
                    Tu prueba expira en {trialDaysLeft} día{trialDaysLeft !== 1 ? 's' : ''}. 
                    Después se cobrará €1.99/mes automáticamente.
                  </p>
                  <p className="text-xs text-blue-300 mt-1">
                    Puedes cancelar en cualquier momento en Google Play.
                  </p>
                </div>
              )}
            </div>
          ) : trialExpired ? (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-md">
              <p className="text-sm text-red-200">
                Tu prueba gratuita ha terminado. Tu suscripción Premium se ha activado automáticamente.
              </p>
              <p className="text-xs text-red-300 mt-1">
                Gestiona tu suscripción en Google Play si deseas cancelar.
              </p>
            </div>
          ) : (
            <div className="p-3 bg-chalk-green/10 border border-chalk-green/30 rounded-md">
              <p className="text-sm text-chalk-green">
                ¡Bienvenido! Estás suscrito con 7 días de prueba gratuita.
              </p>
              <p className="text-xs text-chalk/70 mt-1">
                Después de la prueba se cobrará €1.99/mes automáticamente.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {trialExpired || (!isPremium && !isInTrial) ? (
            <>
              <Button 
                asChild 
                className="w-full bg-chalk-green hover:bg-chalk-green/80 text-dark font-semibold"
              >
                <Link href="/pricing">
                  {trialExpired ? 'Suscribirse a Premium' : 'Ver Planes'}
                </Link>
              </Button>
              
              <div className="text-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-chalk/30 text-chalk hover:bg-chalk/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar App Android
                </Button>
              </div>
              
              <p className="text-xs text-chalk/60 text-center">
                {trialExpired 
                  ? 'Tu prueba gratuita ha terminado. Tu suscripción se renovará automáticamente.'
                  : 'Suscripciones con facturación automática después de la prueba de 7 días'
                }
              </p>
            </>
          ) : isPremium ? (
            <div className="text-center space-y-2">
              <p className="text-sm text-chalk-green">
                ¡Tienes acceso completo a todas las funciones Premium!
              </p>
              <Button 
                variant="outline" 
                size="sm"
                className="border-chalk-green/30 text-chalk-green hover:bg-chalk-green/10"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Gestionar en Google Play
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <p className="text-sm text-blue-300">
                Estás en tu período de prueba gratuita. Facturación automática después de 7 días.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                className="border-chalk/30 text-chalk hover:bg-chalk/10"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Gestionar en Google Play
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default GooglePlayStatus;