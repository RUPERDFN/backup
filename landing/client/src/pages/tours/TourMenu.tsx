import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, Eye, Calendar, Clock, Users, DollarSign, ChefHat } from 'lucide-react';

export default function TourMenu() {
  const demoMenu = {
    weeklyBudget: 58.50,
    servings: 2,
    totalRecipes: 7,
    cookingTime: 'normal',
    days: [
      {
        day: 'Lunes',
        meal: 'Paella Valenciana',
        time: 35,
        cost: 8.50,
        difficulty: 'intermedio'
      },
      {
        day: 'Martes', 
        meal: 'Gazpacho + Tortilla Española',
        time: 25,
        cost: 6.80,
        difficulty: 'fácil'
      },
      {
        day: 'Miércoles',
        meal: 'Pescado al Horno con Verduras',
        time: 30,
        cost: 9.20,
        difficulty: 'fácil'
      },
      {
        day: 'Jueves',
        meal: 'Lentejas con Chorizo',
        time: 40,
        cost: 5.90,
        difficulty: 'fácil'
      },
      {
        day: 'Viernes',
        meal: 'Pasta Carbonara',
        time: 20,
        cost: 7.40,
        difficulty: 'intermedio'
      },
      {
        day: 'Sábado',
        meal: 'Cordero Asado con Patatas',
        time: 60,
        cost: 12.50,
        difficulty: 'avanzado'
      },
      {
        day: 'Domingo',
        meal: 'Pollo al Chilindrón',
        time: 45,
        cost: 8.20,
        difficulty: 'intermedio'
      }
    ]
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'fácil': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermedio': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'avanzado': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

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
            <Calendar className="w-10 h-10 text-chalk-green" />
            <h1 className="text-4xl font-bold text-chalk-white">Tour 2: Menú Generado</h1>
          </div>
          <p className="text-chalk/70 text-lg">
            Plan semanal personalizado generado en menos de 10 segundos
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-container border-chalk-green/30">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 text-chalk-green mx-auto mb-2" />
              <div className="text-2xl font-bold text-chalk-green">€{demoMenu.weeklyBudget}</div>
              <div className="text-chalk/60 text-sm">Presupuesto semanal</div>
            </CardContent>
          </Card>
          
          <Card className="glass-container border-chalk-green/30">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-chalk-green mx-auto mb-2" />
              <div className="text-2xl font-bold text-chalk-green">{demoMenu.servings}</div>
              <div className="text-chalk/60 text-sm">Personas</div>
            </CardContent>
          </Card>
          
          <Card className="glass-container border-chalk-green/30">
            <CardContent className="p-4 text-center">
              <ChefHat className="w-8 h-8 text-chalk-green mx-auto mb-2" />
              <div className="text-2xl font-bold text-chalk-green">{demoMenu.totalRecipes}</div>
              <div className="text-chalk/60 text-sm">Recetas únicas</div>
            </CardContent>
          </Card>
          
          <Card className="glass-container border-chalk-green/30">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-chalk-green mx-auto mb-2" />
              <div className="text-2xl font-bold text-chalk-green">8.2s</div>
              <div className="text-chalk/60 text-sm">Tiempo generación</div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Menu */}
        <Card className="glass-container border-chalk-green/30 mb-8">
          <CardHeader>
            <CardTitle className="text-chalk-white">Plan Semanal Personalizado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demoMenu.days.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-chalk-green/20">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="font-bold text-chalk-green">{day.day}</div>
                      <div className="text-xs text-chalk/60">Día {index + 1}</div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-chalk-white">{day.meal}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-xs text-chalk/60">
                          <Clock className="w-3 h-3" />
                          {day.time}min
                        </div>
                        <div className="flex items-center gap-1 text-xs text-chalk/60">
                          <DollarSign className="w-3 h-3" />
                          €{day.cost}
                        </div>
                        <Badge className={`${getDifficultyColor(day.difficulty)} border text-xs`}>
                          {day.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
                  >
                    Ver Receta
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Demo */}
        <Card className="glass-container border-chalk-green/30 mb-8">
          <CardHeader>
            <CardTitle className="text-chalk-white">Acciones Rápidas (Quick Actions)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button className="bg-chalk-green text-dark-green hover:bg-chalk-green/80 p-6">
                <div className="text-center">
                  <ChefHat className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Cambiar Receta</div>
                  <div className="text-xs opacity-80">Sustituir plato del día</div>
                </div>
              </Button>
              
              <Button className="bg-chalk-green text-dark-green hover:bg-chalk-green/80 p-6">
                <div className="text-center">
                  <DollarSign className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Ajustar Presupuesto</div>
                  <div className="text-xs opacity-80">Optimizar costes</div>
                </div>
              </Button>
              
              <Button className="bg-chalk-green text-dark-green hover:bg-chalk-green/80 p-6">
                <div className="text-center">
                  <Calendar className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Añadir Leftovers</div>
                  <div className="text-xs opacity-80">Aprovechar sobras</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Card className="glass-container border-chalk-green/30 mb-8">
          <CardHeader>
            <CardTitle className="text-chalk-white">Características del Menú IA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-chalk-white mb-3">Personalización Inteligente</h4>
                <ul className="space-y-2 text-sm text-chalk/70">
                  <li>• Adaptado a 2 personas y nivel principiante</li>
                  <li>• Equilibrio entre cocina tradicional y moderna</li>
                  <li>• Tiempos de cocción optimizados (20-60min)</li>
                  <li>• Variedad de dificultades progresiva</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-chalk-white mb-3">Optimización Económica</h4>
                <ul className="space-y-2 text-sm text-chalk/70">
                  <li>• Presupuesto respetado: €58.50/semana</li>
                  <li>• Ingredientes de temporada priorizados</li>
                  <li>• Aprovechamiento inteligente de sobras</li>
                  <li>• Sustituciones económicas sugeridas</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={() => window.open('/tour/1-onboarding', '_blank')}
            variant="outline"
            className="text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior: Onboarding
          </Button>
          
          <Button
            onClick={() => window.open('/tour/3-recipe', '_blank')}
            className="bg-chalk-green text-dark-green hover:bg-chalk-green/80"
          >
            Siguiente: Detalle Receta
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Tour Navigation */}
        <div className="mt-8 text-center">
          <div className="flex justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-chalk/30 rounded-full"></div>
            <div className="w-3 h-3 bg-chalk-green rounded-full"></div>
            <div className="w-3 h-3 bg-chalk/30 rounded-full"></div>
            <div className="w-3 h-3 bg-chalk/30 rounded-full"></div>
            <div className="w-3 h-3 bg-chalk/30 rounded-full"></div>
          </div>
          <div className="text-xs text-chalk/60">
            Tour 2 de 5: Menú Generado con IA
          </div>
        </div>
      </div>
    </div>
  );
}