import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Eye, User, Clock, ChefHat, DollarSign } from 'lucide-react';

export default function TourOnboarding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-green via-black to-dark-green p-4">
      <meta name="robots" content="noindex,nofollow" />
      
      {/* Demo Notice */}
      <div className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-4xl mx-auto">
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

      <div className="max-w-4xl mx-auto pt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <User className="w-10 h-10 text-chalk-green" />
            <h1 className="text-4xl font-bold text-chalk-white">Tour 1: Onboarding Inteligente</h1>
          </div>
          <p className="text-chalk/70 text-lg">
            Proceso de configuración de 4 pasos para personalización completa
          </p>
        </div>

        {/* Steps Preview */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Step 1 */}
          <Card className="glass-container border-chalk-green/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-chalk-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Paso 1: Información Personal
                </CardTitle>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  30s
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-chalk/70 text-sm mb-4">
                Configuración básica del perfil culinario
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-chalk-green rounded-full"></div>
                  <span className="text-chalk/60 text-sm">Número de personas: 2</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-chalk-green rounded-full"></div>
                  <span className="text-chalk/60 text-sm">Nivel culinario: Principiante</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-chalk-green rounded-full"></div>
                  <span className="text-chalk/60 text-sm">Tiempo disponible: Normal</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="glass-container border-chalk-green/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-chalk-white flex items-center gap-2">
                  <ChefHat className="w-5 h-5" />
                  Paso 2: Preferencias Culinarias
                </CardTitle>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  45s
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-chalk/70 text-sm mb-4">
                Tipos de cocina y restricciones alimentarias
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-chalk-green rounded-full"></div>
                  <span className="text-chalk/60 text-sm">Cocina: Mediterránea, Española</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-chalk-green rounded-full"></div>
                  <span className="text-chalk/60 text-sm">Dieta: Sin restricciones</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-chalk-green rounded-full"></div>
                  <span className="text-chalk/60 text-sm">Alergias: Ninguna</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="glass-container border-chalk-green/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-chalk-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Paso 3: Presupuesto
                </CardTitle>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  20s
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-chalk/70 text-sm mb-4">
                Optimización económica personalizada
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-chalk-green rounded-full"></div>
                  <span className="text-chalk/60 text-sm">Presupuesto semanal: €60</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-chalk-green rounded-full"></div>
                  <span className="text-chalk/60 text-sm">Prioridad: Equilibrio precio/calidad</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-chalk-green rounded-full"></div>
                  <span className="text-chalk/60 text-sm">Modo ahorro: Activado</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card className="glass-container border-chalk-green/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-chalk-white flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Paso 4: Generación
                </CardTitle>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  &lt;10s
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-chalk/70 text-sm mb-4">
                Generación instantánea del menú personalizado
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-chalk-green rounded-full"></div>
                  <span className="text-chalk/60 text-sm">IA analiza preferencias</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-chalk-green rounded-full"></div>
                  <span className="text-chalk/60 text-sm">Genera 7 días de menús</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-chalk-green rounded-full"></div>
                  <span className="text-chalk/60 text-sm">Crea lista de compra automática</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <Card className="glass-container border-chalk-green/30 mb-8">
          <CardHeader>
            <CardTitle className="text-chalk-white">Características Clave del Onboarding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-black/20 rounded-lg border border-chalk-green/20">
                <Clock className="w-8 h-8 text-chalk-green mx-auto mb-2" />
                <h3 className="font-bold text-chalk-white mb-1">Rápido</h3>
                <p className="text-xs text-chalk/60">Menos de 2 minutos para configuración completa</p>
              </div>
              
              <div className="text-center p-4 bg-black/20 rounded-lg border border-chalk-green/20">
                <ChefHat className="w-8 h-8 text-chalk-green mx-auto mb-2" />
                <h3 className="font-bold text-chalk-white mb-1">Inteligente</h3>
                <p className="text-xs text-chalk/60">IA adapta sugerencias en tiempo real</p>
              </div>
              
              <div className="text-center p-4 bg-black/20 rounded-lg border border-chalk-green/20">
                <User className="w-8 h-8 text-chalk-green mx-auto mb-2" />
                <h3 className="font-bold text-chalk-white mb-1">Personal</h3>
                <p className="text-xs text-chalk/60">100% personalizado a tus preferencias</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={() => window.open('/tour/2-menu', '_blank')}
            className="bg-chalk-green text-dark-green hover:bg-chalk-green/80"
          >
            Siguiente: Ver Menú Generado
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <div className="flex gap-2">
            <Button
              onClick={() => window.open('/onboarding', '_blank')}
              variant="outline"
              className="text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
            >
              Probar Onboarding Real
            </Button>
          </div>
        </div>

        {/* Tour Navigation */}
        <div className="mt-8 text-center">
          <div className="flex justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-chalk-green rounded-full"></div>
            <div className="w-3 h-3 bg-chalk/30 rounded-full"></div>
            <div className="w-3 h-3 bg-chalk/30 rounded-full"></div>
            <div className="w-3 h-3 bg-chalk/30 rounded-full"></div>
            <div className="w-3 h-3 bg-chalk/30 rounded-full"></div>
          </div>
          <div className="text-xs text-chalk/60">
            Tour 1 de 5: Onboarding Inteligente
          </div>
        </div>
      </div>
    </div>
  );
}