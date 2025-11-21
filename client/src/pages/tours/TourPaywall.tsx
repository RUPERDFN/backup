import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, Crown, Check, Star, Calendar, Users, ChefHat, Zap } from 'lucide-react';

export default function TourPaywall() {
  const freeFeatures = [
    '3 menús por semana',
    'Lunes a Viernes únicamente',
    'Máximo 2 personas',
    '3 comidas por día',
    'Dieta normal solamente',
    'Recetas básicas'
  ];

  const premiumFeatures = [
    '5 menús por semana completos',
    'Todos los días de la semana',
    'Hasta 6 personas',
    'Desayuno, almuerzo, cena y snacks',
    'Todas las dietas y restricciones',
    'Recetas premium y exclusivas',
    'Modo Ahorro avanzado',
    'Vision Nevera 2.0 con IA',
    'Amazon Fresh integrado',
    'SkinChef chat ilimitado',
    'Notificaciones inteligentes',
    'Sin anuncios',
    'Soporte prioritario',
    'Funciones beta tempranas'
  ];

  const comparisonData = [
    {
      feature: 'Menús semanales',
      free: '3/semana',
      premium: '5/semana'
    },
    {
      feature: 'Días disponibles',
      free: 'Lun-Vie',
      premium: 'Todos los días'
    },
    {
      feature: 'Máximo personas',
      free: '2',
      premium: '6'
    },
    {
      feature: 'Tipos de dieta',
      free: 'Normal',
      premium: 'Todas'
    },
    {
      feature: 'Vision Nevera IA',
      free: '❌',
      premium: '✅'
    },
    {
      feature: 'Modo Ahorro',
      free: 'Básico',
      premium: 'Avanzado'
    },
    {
      feature: 'Amazon Fresh',
      free: '❌',
      premium: '✅'
    },
    {
      feature: 'Sin anuncios',
      free: '❌',
      premium: '✅'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-green via-black to-dark-green p-4">
      <meta name="robots" content="noindex,nofollow" />
      
      {/* Demo Notice */}
      <div className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-6xl mx-auto">
          <Card className="glass-container border-blue-500/30 bg-blue-500/10">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 font-medium">Vista Demo (Read-Only)</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => window.open('/qa', '_blank')}
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:bg-blue-500/20 text-xs"
                  >
                    QA Panel
                  </Button>
                  <Button
                    onClick={() => window.open('/previews', '_blank')}
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:bg-blue-500/20 text-xs"
                  >
                    Capturas
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-10 h-10 text-chalk-green" />
            <h1 className="text-4xl font-bold text-chalk-white">Tour 5: Suscripción Premium</h1>
          </div>
          <p className="text-chalk/70 text-lg">
            Desbloquea todas las funciones avanzadas con 7 días gratis
          </p>
        </div>

        {/* Trial Banner */}
        <Card className="glass-container border-orange-500/30 bg-orange-500/10 mb-8">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-orange-400" />
              <h2 className="text-2xl font-bold text-orange-400">¡7 Días GRATIS!</h2>
            </div>
            <p className="text-orange-200 mb-4">
              Prueba todas las funciones premium sin coste. Cancela cuando quieras.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-orange-300">
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>Sin permanencia</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>Cancela en 1 clic</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>Activación inmediata</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Free Plan */}
          <Card className="glass-container border-gray-500/30">
            <CardHeader>
              <div className="text-center">
                <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 mb-4">
                  Actual
                </Badge>
                <CardTitle className="text-chalk-white text-2xl mb-2">Plan Gratuito</CardTitle>
                <div className="text-3xl font-bold text-chalk-white mb-2">€0</div>
                <div className="text-chalk/60">Durante la prueba de 7 días</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-chalk/60 text-sm mb-4">
                Funciones limitadas pero completas para empezar
              </div>
              
              <div className="space-y-3">
                {freeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-gray-400" />
                    <span className="text-chalk/70 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                variant="outline" 
                className="w-full text-chalk border-gray-500/30 hover:bg-gray-500/20 mt-6"
                disabled
              >
                Plan Actual
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="glass-container border-chalk-green/50 ring-2 ring-chalk-green/30">
            <CardHeader>
              <div className="text-center">
                <Badge className="bg-chalk-green/20 text-chalk-green border-chalk-green/30 mb-4 relative">
                  <Star className="w-3 h-3 mr-1" />
                  Recomendado
                </Badge>
                <CardTitle className="text-chalk-white text-2xl mb-2">TheCookFlow Premium</CardTitle>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-3xl font-bold text-chalk-green">€1,99</span>
                  <span className="text-chalk/60">/mes</span>
                </div>
                <div className="text-chalk/60">Después de la prueba gratuita</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-chalk-green text-sm mb-4">
                Experiencia completa sin limitaciones
              </div>
              
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-chalk-green" />
                    <span className="text-chalk text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button className="w-full bg-chalk-green text-dark-green hover:bg-chalk-green/80 mt-6 py-6 text-lg">
                <Crown className="w-5 h-5 mr-2" />
                Comenzar Prueba Gratuita
              </Button>
              
              <div className="text-center text-xs text-chalk/60">
                Después de 7 días: €1,99/mes. Cancela cuando quieras.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Table */}
        <Card className="glass-container border-chalk-green/30 mb-8">
          <CardHeader>
            <CardTitle className="text-chalk-white text-center">Comparación Detallada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-chalk-green/20">
                    <th className="text-left text-chalk/60 py-3 font-medium">Característica</th>
                    <th className="text-center text-chalk/60 py-3 font-medium">Gratuito</th>
                    <th className="text-center text-chalk-green py-3 font-medium">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index} className="border-b border-chalk-green/10">
                      <td className="py-3 text-chalk-white">{row.feature}</td>
                      <td className="py-3 text-center text-chalk/60">{row.free}</td>
                      <td className="py-3 text-center text-chalk-green font-medium">{row.premium}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Value Proposition */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-container border-chalk-green/30">
            <CardContent className="p-6 text-center">
              <Calendar className="w-12 h-12 text-chalk-green mx-auto mb-4" />
              <h3 className="font-bold text-chalk-white mb-2">Sin Compromisos</h3>
              <p className="text-chalk/70 text-sm">
                Prueba 7 días gratis. Cancela en cualquier momento sin penalizaciones.
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-container border-chalk-green/30">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-chalk-green mx-auto mb-4" />
              <h3 className="font-bold text-chalk-white mb-2">Para Toda la Familia</h3>
              <p className="text-chalk/70 text-sm">
                Planifica para hasta 6 personas con dietas personalizadas.
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-container border-chalk-green/30">
            <CardContent className="p-6 text-center">
              <ChefHat className="w-12 h-12 text-chalk-green mx-auto mb-4" />
              <h3 className="font-bold text-chalk-white mb-2">IA Avanzada</h3>
              <p className="text-chalk/70 text-sm">
                Funciones exclusivas como Vision Nevera y Modo Ahorro inteligente.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Digital Goods Notice */}
        <Card className="glass-container border-blue-500/30 bg-blue-500/10 mb-8">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Check className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-blue-400 mb-1">Pago Seguro vía Google Play</h3>
                <p className="text-sm text-blue-200/80">
                  Tu suscripción se gestiona de forma segura a través de Google Play Billing. 
                  Puedes cancelar desde tu cuenta de Google Play en cualquier momento.
                </p>
                <div className="mt-2 text-xs text-blue-300">
                  • Facturación automática tras el período gratuito
                  • Gestión desde Google Play Store
                  • Reembolso disponible según políticas de Google
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={() => window.open('/tour/4-shopping-list', '_blank')}
            variant="outline"
            className="text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior: Lista de Compra
          </Button>
          
          <div className="flex gap-4">
            <Button
              onClick={() => window.open('/qa', '_blank')}
              variant="outline"
              className="text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
            >
              Ver Panel QA
            </Button>
            <Button
              onClick={() => window.open('/auth/demo-login', '_blank')}
              className="bg-chalk-green text-dark-green hover:bg-chalk-green/80"
            >
              Probar Demo Completo
            </Button>
          </div>
        </div>

        {/* Tour Navigation */}
        <div className="mt-8 text-center">
          <div className="flex justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-chalk/30 rounded-full"></div>
            <div className="w-3 h-3 bg-chalk/30 rounded-full"></div>
            <div className="w-3 h-3 bg-chalk/30 rounded-full"></div>
            <div className="w-3 h-3 bg-chalk/30 rounded-full"></div>
            <div className="w-3 h-3 bg-chalk-green rounded-full"></div>
          </div>
          <div className="text-xs text-chalk/60 mb-4">
            Tour 5 de 5: Suscripción Premium Completa
          </div>
          
          <div className="p-4 bg-chalk-green/10 rounded-lg border border-chalk-green/30">
            <h4 className="font-bold text-chalk-green mb-2">¡Tour Completado!</h4>
            <p className="text-chalk/70 text-sm">
              Has visto todas las funcionalidades principales de TheCookFlow. 
              ¿Listo para empezar tu experiencia culinaria personalizada?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}