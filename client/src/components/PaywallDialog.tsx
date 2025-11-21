import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, X, Zap, Gift } from "lucide-react";
import { openTCFSubscription } from "@/lib/tcf-bridge-integration";

interface PaywallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: "usage_limit" | "premium_feature";
  usageCount?: number;
  maxUsage?: number;
}

export function PaywallDialog({ 
  open, 
  onOpenChange, 
  reason = "usage_limit",
  usageCount = 3,
  maxUsage = 3 
}: PaywallDialogProps) {

  const handleSubscribe = () => {
    // Usar helper de TCF Bridge para abrir suscripción
    openTCFSubscription();
    onOpenChange(false);
  };

  const premiumFeatures = [
    "🍽️ Menús ilimitados",
    "📸 Visión Nevera 2.0 completa",
    "💰 Modo Ahorro avanzado",
    "🚫 Sin anuncios",
    "⚡ Soporte prioritario"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-blackboard border-chalk-green/30 text-chalk">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-chalk-green font-chalk text-2xl">
            <Crown className="w-6 h-6 text-yellow-400" />
            ¡Desbloquea Premium!
          </DialogTitle>
          <DialogDescription className="text-chalk/80 font-chalk">
            {reason === "usage_limit" ? (
              <span className="flex items-center gap-2 text-base mt-2">
                Has usado <Badge variant="outline" className="border-chalk-green text-chalk-green">{usageCount}/{maxUsage}</Badge> generaciones gratuitas hoy
              </span>
            ) : (
              <span className="text-base mt-2">
                Esta función está disponible solo para usuarios Premium
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          {/* Precio y Trial */}
          <div className="bg-chalk-green/10 border-2 border-chalk-green rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gift className="w-5 h-5 text-chalk-green" />
              <span className="text-chalk-green font-bold">7 días gratis</span>
            </div>
            <div className="text-3xl font-bold text-chalk">€1.99</div>
            <div className="text-sm text-chalk/70">/mes después del trial</div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <p className="font-semibold text-chalk text-sm mb-3">Con Premium obtienes:</p>
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-chalk/90">
                <Check className="w-4 h-4 text-chalk-green flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-chalk/30 text-chalk hover:bg-chalk/10"
            data-testid="button-cancel-paywall"
          >
            Tal vez luego
          </Button>
          <Button
            onClick={handleSubscribe}
            className="bg-chalk-green hover:bg-chalk-green/90 text-blackboard font-bold"
            data-testid="button-subscribe-premium"
          >
            <Zap className="w-4 h-4 mr-2" />
            Probar 7 días gratis
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
