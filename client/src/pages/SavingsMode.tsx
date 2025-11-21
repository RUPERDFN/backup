import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DollarSign, TrendingDown, ShoppingCart, Lightbulb, CheckCircle, ArrowRight, PiggyBank, Calendar } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function SavingsMode() {
  const { toast } = useToast();
  const [savingsLevel, setSavingsLevel] = useState<'moderate' | 'aggressive'>('moderate');
  const [currentBudget, setCurrentBudget] = useState(60);

  const demoMenuPlan = {
    days: [
      {
        dayName: 'Lunes',
        meals: [
          {
            name: 'Salmón a la plancha',
            ingredients: [
              { name: 'salmón', amount: '400g', category: 'Pescado' },
              { name: 'espárragos', amount: '200g', category: 'Verduras' }
            ]
          }
        ]
      }
    ]
  };

  const { data: savingsData, isLoading, refetch } = useQuery({
    queryKey: ['/api/savings/analysis', savingsLevel, currentBudget],
    queryFn: () => apiRequest('/api/savings/savings', {
      method: 'POST',
      body: {
        menuPlan: demoMenuPlan,
        currentBudget,
        savingsLevel
      }
    }),
    enabled: false
  });

  const activateSavingsMutation = useMutation({
    mutationFn: () => apiRequest('/api/savings/activate-default-savings', {
      method: 'POST',
      body: {
        userId: 'demo-user',
        savingsLevel
      }
    }),
    onSuccess: () => {
      toast({
        title: "Modo Ahorro Activado",
        description: "Tus próximos menús se optimizarán automáticamente para ahorrar dinero.",
      });
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-green via-black to-dark-green p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <PiggyBank className="w-10 h-10 text-chalk-green" />
            <h1 className="text-4xl font-bold text-chalk-white">Modo Ahorro</h1>
          </div>
          <p className="text-chalk/70 text-lg">
            Optimiza tus menús para ahorrar dinero sin perder calidad nutricional
          </p>
        </div>

        <Card className="glass-container border-chalk-green/30 mb-6">
          <CardHeader>
            <CardTitle className="text-chalk-white flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Configuración de Ahorro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-chalk mb-3 block">Presupuesto semanal actual</Label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentBudget(Math.max(20, currentBudget - 10))}
                    className="text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
                  >
                    -€10
                  </Button>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-chalk-green">€{currentBudget}</div>
                    <div className="text-chalk/60">por semana</div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentBudget(currentBudget + 10)}
                    className="text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
                  >
                    +€10
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-chalk mb-3 block">Nivel de optimización</Label>
                <RadioGroup 
                  value={savingsLevel} 
                  onValueChange={(value: 'moderate' | 'aggressive') => setSavingsLevel(value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate" className="text-chalk cursor-pointer">
                      Moderado - Mantener sabores familiares
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="aggressive" id="aggressive" />
                    <Label htmlFor="aggressive" className="text-chalk cursor-pointer">
                      Agresivo - Máximo ahorro posible
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <Button
              onClick={() => refetch()}
              disabled={isLoading}
              className="w-full bg-chalk-green text-dark-green hover:bg-chalk-green/80"
            >
              {isLoading ? 'Analizando...' : 'Analizar Potencial de Ahorro'}
            </Button>
          </CardContent>
        </Card>

        {savingsData && (
          <Card className="glass-container border-chalk-green/30 mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-chalk-white">Resumen de Ahorros</CardTitle>
                <Badge className="bg-chalk-green text-dark-green text-lg px-4 py-2">
                  {savingsData.badge?.text || '-€15.20'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-black/20 rounded-lg border border-chalk-green/20">
                  <div className="text-2xl font-bold text-chalk-green">
                    €{savingsData.analysis?.originalCost || currentBudget}
                  </div>
                  <div className="text-chalk/60">Coste actual</div>
                </div>
                <div className="text-center p-4 bg-black/20 rounded-lg border border-chalk-green/20">
                  <div className="text-2xl font-bold text-chalk-green">
                    €{savingsData.analysis?.optimizedCost?.toFixed(2) || '44.80'}
                  </div>
                  <div className="text-chalk/60">Coste optimizado</div>
                </div>
                <div className="text-center p-4 bg-black/20 rounded-lg border border-chalk-green/20">
                  <div className="text-2xl font-bold text-chalk-green">
                    {savingsData.analysis?.savingsPercentage?.toFixed(1) || '25.3'}%
                  </div>
                  <div className="text-chalk/60">Ahorro semanal</div>
                </div>
                <div className="text-center p-4 bg-black/20 rounded-lg border border-chalk-green/20">
                  <div className="text-2xl font-bold text-chalk-green">
                    €{savingsData.analysis?.annualSavings?.toFixed(0) || '790'}
                  </div>
                  <div className="text-chalk/60">Ahorro anual</div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button
                  onClick={() => activateSavingsMutation.mutate()}
                  disabled={activateSavingsMutation.isPending}
                  className="bg-chalk-green text-dark-green hover:bg-chalk-green/80 px-8 py-6 text-lg"
                >
                  {activateSavingsMutation.isPending ? 'Activando...' : 'Activar Ahorro por Defecto'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}