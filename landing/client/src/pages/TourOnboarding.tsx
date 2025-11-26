import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Eye, TestTube, Camera } from 'lucide-react';

export default function TourOnboarding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-green via-black to-dark-green text-chalk-white">
      <head>
        <meta name="robots" content="noindex,nofollow" />
        <title>Tour Demo - Onboarding | TheCookFlow</title>
      </head>
      
      {/* Demo Banner */}
      <div className="bg-yellow-600/20 border-b border-yellow-500/30 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold text-yellow-400">Vista Demo (Read-Only)</span>
            <Badge variant="outline" className="border-yellow-500 text-yellow-400">
              TOUR 1/5
            </Badge>
          </div>
          <div className="flex space-x-4">
            <a href="/qa" className="text-yellow-400 hover:underline text-sm">
              <TestTube className="w-4 h-4 inline mr-1" />
              QA Dashboard
            </a>
            <a href="/previews" className="text-yellow-400 hover:underline text-sm">
              <Camera className="w-4 h-4 inline mr-1" />
              Capturas
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-handwritten text-chalk-green mb-4">
              ¡Bienvenido a TheCookFlow!
            </h1>
            <p className="text-xl text-chalk/80 mb-6">
              Tu asistente culinario con inteligencia artificial
            </p>
            <p className="text-chalk/60">
              Vamos a configurar tu perfil en 4 pasos rápidos
            </p>
          </div>

          {/* Onboarding Steps Preview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-dark-green/20 border-chalk-green/30 relative">
              <div className="absolute -top-2 -right-2 bg-chalk-green text-dark-green rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-chalk-green text-lg">👤 Información Personal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-chalk/70 text-sm">
                  Nombre, edad, y composición del hogar
                </p>
                <div className="mt-4 space-y-2">
                  <div className="bg-black/20 p-2 rounded text-xs">
                    <span className="text-chalk/50">Nombre:</span> Usuario Demo
                  </div>
                  <div className="bg-black/20 p-2 rounded text-xs">
                    <span className="text-chalk/50">Personas:</span> 2 adultos
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dark-green/20 border-chalk-green/30 relative">
              <div className="absolute -top-2 -right-2 bg-chalk-green text-dark-green rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-chalk-green text-lg">🥗 Preferencias Dietéticas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-chalk/70 text-sm">
                  Restricciones, alergias, y preferencias
                </p>
                <div className="mt-4 flex flex-wrap gap-1">
                  <Badge className="bg-green-600 text-white text-xs">Vegetariano</Badge>
                  <Badge className="bg-red-600 text-white text-xs">Sin gluten</Badge>
                  <Badge className="bg-blue-600 text-white text-xs">Mediterránea</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dark-green/20 border-chalk-green/30 relative">
              <div className="absolute -top-2 -right-2 bg-chalk-green text-dark-green rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-chalk-green text-lg">💰 Presupuesto & Tiempo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-chalk/70 text-sm">
                  Presupuesto semanal y tiempo de cocina
                </p>
                <div className="mt-4 space-y-2">
                  <div className="bg-black/20 p-2 rounded text-xs">
                    <span className="text-chalk/50">Presupuesto:</span> €60/semana
                  </div>
                  <div className="bg-black/20 p-2 rounded text-xs">
                    <span className="text-chalk/50">Tiempo:</span> 30-45 min
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dark-green/20 border-chalk-green/30 relative">
              <div className="absolute -top-2 -right-2 bg-chalk-green text-dark-green rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-chalk-green text-lg">🍽️ Objetivos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-chalk/70 text-sm">
                  Objetivos de salud y preferencias culinarias
                </p>
                <div className="mt-4 flex flex-wrap gap-1">
                  <Badge className="bg-purple-600 text-white text-xs">Vida saludable</Badge>
                  <Badge className="bg-orange-600 text-white text-xs">Ahorrar tiempo</Badge>
                  <Badge className="bg-pink-600 text-white text-xs">Variedad</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Preview */}
          <Card className="bg-dark-green/20 border-chalk-green/30 mb-8">
            <CardHeader>
              <CardTitle className="text-chalk-green text-xl text-center">
                🤖 Con tu perfil personalizado obtendrás:
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">⚡</div>
                  <h3 className="font-semibold text-chalk-white mb-2">Menús en menos de 10s</h3>
                  <p className="text-chalk/70 text-sm">
                    Generación ultra-rápida adaptada a tus gustos
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">💰</div>
                  <h3 className="font-semibold text-chalk-white mb-2">Ahorro Garantizado</h3>
                  <p className="text-chalk/70 text-sm">
                    Optimización automática del presupuesto semanal
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🎯</div>
                  <h3 className="font-semibold text-chalk-white mb-2">100% Personalizado</h3>
                  <p className="text-chalk/70 text-sm">
                    Recetas que se adaptan a tu estilo de vida
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <div className="text-chalk/60 text-sm">
              🎭 Modo demo - Datos de ejemplo
            </div>
            
            <div className="flex space-x-4">
              <Button 
                onClick={() => window.open('/tour/2-menu', '_blank')}
                className="bg-chalk-green text-dark-green hover:bg-chalk-green/90"
              >
                Ver Menú Generado
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Quick Tour Navigation */}
          <div className="mt-8 p-4 bg-black/20 rounded-lg border border-chalk-green/20">
            <h3 className="text-chalk-green font-semibold mb-3">🎯 Tour Completo:</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="border-yellow-500 text-yellow-400 bg-yellow-500/10"
                disabled
              >
                1. Onboarding
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('/tour/2-menu', '_blank')}
                className="border-chalk-green text-chalk-green hover:bg-chalk-green/10"
              >
                2. Menú
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('/tour/3-recipe', '_blank')}
                className="border-chalk-green text-chalk-green hover:bg-chalk-green/10"
              >
                3. Receta
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('/tour/4-shopping-list', '_blank')}
                className="border-chalk-green text-chalk-green hover:bg-chalk-green/10"
              >
                4. Lista Compra
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('/tour/5-paywall', '_blank')}
                className="border-chalk-green text-chalk-green hover:bg-chalk-green/10"
              >
                5. Premium
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}