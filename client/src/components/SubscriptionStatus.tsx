import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Clock, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

interface SubscriptionStatusProps {
  subscriptionStatus?: string;
  trialEndsAt?: string;
  subscriptionEndsAt?: string;
  limits?: {
    maxMenusPerWeek: number;
    maxServings: number;
    maxDays: number;
    maxMealsPerDay: number;
  };
  compact?: boolean;
}

export function SubscriptionStatus({ 
  subscriptionStatus = "trial", 
  trialEndsAt, 
  subscriptionEndsAt,
  limits,
  compact = false
}: SubscriptionStatusProps) {
  const now = new Date();
  const trialEnd = trialEndsAt ? new Date(trialEndsAt) : null;
  const subscriptionEnd = subscriptionEndsAt ? new Date(subscriptionEndsAt) : null;
  
  const isTrialActive = trialEnd && now < trialEnd;
  const isPremium = subscriptionStatus === 'active';
  const isExpired = subscriptionStatus === 'canceled' || (trialEnd && now > trialEnd && !isPremium);
  
  const daysLeft = trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0;

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="flex items-center space-x-2">
          {isPremium ? (
            <>
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">Premium Activo</span>
            </>
          ) : isTrialActive ? (
            <>
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm">Prueba ({daysLeft} día{daysLeft !== 1 ? 's' : ''})</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400">Expirado</span>
            </>
          )}
        </div>
        
        {!isPremium && (
          <Button asChild size="sm" variant="outline">
            <Link href="/pricing">
              Actualizar
            </Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            {isPremium ? (
              <>
                <Crown className="w-5 h-5 mr-2 text-yellow-400" />
                Estado Premium
              </>
            ) : isTrialActive ? (
              <>
                <Clock className="w-5 h-5 mr-2 text-blue-400" />
                Período de Prueba
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                Suscripción Expirada
              </>
            )}
          </span>
          
          <Badge 
            variant="outline" 
            className={
              isPremium 
                ? "text-green-400 border-green-400" 
                : isTrialActive 
                ? "text-blue-400 border-blue-400"
                : "text-red-400 border-red-400"
            }
          >
            {isPremium ? "Activo" : isTrialActive ? `${daysLeft} día${daysLeft !== 1 ? 's' : ''} restante${daysLeft !== 1 ? 's' : ''}` : "Expirado"}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Limits */}
        {limits && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-300">Límites Actuales:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Menús/semana:</span>
                <span className="font-medium">
                  {limits.maxMenusPerWeek === -1 ? "Ilimitados" : limits.maxMenusPerWeek}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Personas:</span>
                <span className="font-medium">{limits.maxServings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Días:</span>
                <span className="font-medium">{limits.maxDays === 7 ? "Toda la semana" : `${limits.maxDays} días`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Comidas/día:</span>
                <span className="font-medium">{limits.maxMealsPerDay}</span>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Info */}
        <div className="pt-4 border-t border-slate-700">
          {isPremium ? (
            <div className="text-sm text-slate-300">
              <p>Tu suscripción premium está activa.</p>
              {subscriptionEnd && (
                <p className="text-xs text-slate-400 mt-1">
                  Próxima facturación: {subscriptionEnd.toLocaleDateString('es-ES')}
                </p>
              )}
            </div>
          ) : isTrialActive ? (
            <div className="text-sm text-slate-300">
              <p>Estás en el período de prueba gratuita.</p>
              <p className="text-xs text-slate-400 mt-1">
                Expira el {trialEnd?.toLocaleDateString('es-ES')} a las {trialEnd?.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ) : (
            <div className="text-sm text-red-300">
              <p>Tu período de prueba ha expirado.</p>
              <p className="text-xs text-red-400 mt-1">
                Actualiza a premium para continuar generando menús.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {!isPremium && (
            <Button asChild className="flex-1" variant="default">
              <Link href="/pricing">
                <Crown className="w-4 h-4 mr-2" />
                Actualizar a Premium
              </Link>
            </Button>
          )}
          
          {isPremium && (
            <Button asChild variant="outline" size="sm">
              <Link href="/account">
                Gestionar Suscripción
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}