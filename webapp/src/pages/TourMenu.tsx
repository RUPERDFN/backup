import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Eye, TestTube, Camera, Clock, Users, DollarSign } from 'lucide-react';

export default function TourMenu() {
  const demoMenu = {
    name: "Menú Mediterráneo Semanal",
    generated: "< 10 segundos",
    budget: "€52.30",
    servings: "2 personas",
    days: [
      {
        day: "Lunes",
        meals: [
          { type: "Desayuno", name: "Tostadas con tomate y aceite", time: "10 min", calories: "320 kcal" },
          { type: "Comida", name: "Paella Valenciana", time: "35 min", calories: "580 kcal" },
          { type: "Cena", name: "Ensalada César con pollo", time: "15 min", calories: "420 kcal" }
        ]
      },
      {
        day: "Martes",
        meals: [
          { type: "Desayuno", name: "Yogur griego con frutas", time: "5 min", calories: "280 kcal" },
          { type: "Comida", name: "Pasta Carbonara", time: "20 min", calories: "650 kcal" },
          { type: "Cena", name: "Salmón a la plancha con verduras", time: "25 min", calories: "480 kcal" }
        ]
      },
      {
        day: "Miércoles",
        meals: [
          { type: "Desayuno", name: "Smoothie de plátano y avena", time: "8 min", calories: "350 kcal" },
          { type: "Comida", name: "Gazpacho andaluz con jamón", time: "15 min", calories: "220 kcal" },
          { type: "Cena", name: "Tortilla española con ensalada", time: "20 min", calories: "520 kcal" }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-green via-black to-dark-green text-chalk-white">
      <head>
        <meta name="robots" content="noindex,nofollow" />
        <title>Tour Demo - Menú Generado | TheCookFlow</title>
      </head>
      
      {/* Demo Banner */}
      <div className="bg-yellow-600/20 border-b border-yellow-500/30 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold text-yellow-400">Vista Demo (Read-Only)</span>
            <Badge variant="outline" className="border-yellow-500 text-yellow-400">
              TOUR 2/5
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
        <div className="max-w-6xl mx-auto">
          {/* Header with Generation Stats */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-handwritten text-chalk-green mb-4">
              🍽️ Tu Menú Semanal Personalizado
            </h1>
            
            <div className="flex justify-center items-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-semibold">Generado en {demoMenu.generated}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400">{demoMenu.servings}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400">{demoMenu.budget}</span>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Badge className="bg-green-600 text-white">Vegetariano</Badge>
              <Badge className="bg-red-600 text-white">Sin gluten</Badge>
              <Badge className="bg-blue-600 text-white">Mediterránea</Badge>
              <Badge className="bg-purple-600 text-white">Equilibrado</Badge>
            </div>
          </div>

          {/* Weekly Menu Grid */}
          <div className="space-y-6 mb-8">
            {demoMenu.days.map((day, dayIndex) => (
              <Card key={dayIndex} className="bg-dark-green/20 border-chalk-green/30">
                <CardHeader className="pb-4">
                  <CardTitle className="text-chalk-green text-xl flex items-center justify-between">
                    <span>{day.day}</span>
                    <Badge variant="outline" className="border-chalk-green text-chalk-green">
                      {day.meals.reduce((total, meal) => total + parseInt(meal.calories), 0)} kcal
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {day.meals.map((meal, mealIndex) => (
                      <div key={mealIndex} className="bg-black/20 p-4 rounded-lg border border-chalk-green/20">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`text-xs ${
                            meal.type === 'Desayuno' ? 'bg-orange-600' :
                            meal.type === 'Comida' ? 'bg-green-600' : 'bg-purple-600'
                          } text-white`}>
                            {meal.type}
                          </Badge>
                          <span className="text-xs text-chalk/50">{meal.time}</span>
                        </div>
                        <h4 className="font-semibold text-chalk-white mb-1">{meal.name}</h4>
                        <p className="text-xs text-chalk/60">{meal.calories}</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full mt-2 text-chalk-green hover:bg-chalk-green/10"
                          onClick={() => window.open('/tour/3-recipe', '_blank')}
                        >
                          Ver receta →
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => window.open('/tour/4-shopping-list', '_blank')}
            >
              🛒 Ver Lista de Compra
            </Button>
            <Button 
              variant="outline"
              className="border-chalk-green text-chalk-green hover:bg-chalk-green/10"
            >
              📱 Compartir Menú
            </Button>
            <Button 
              variant="outline"
              className="border-chalk-green text-chalk-green hover:bg-chalk-green/10"
            >
              🔄 Regenerar Menú
            </Button>
          </div>

          {/* Modo Ahorro Preview */}
          <Card className="bg-dark-green/20 border-chalk-green/30 mb-8">
            <CardHeader>
              <CardTitle className="text-chalk-green text-lg flex items-center">
                💰 Modo Ahorro Detectado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl text-green-400 font-bold">€8.40</div>
                  <div className="text-sm text-chalk/70">Ahorro esta semana</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-blue-400 font-bold">3</div>
                  <div className="text-sm text-chalk/70">Sustituciones automáticas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-purple-400 font-bold">12%</div>
                  <div className="text-sm text-chalk/70">Reducción presupuesto</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost"
              onClick={() => window.open('/tour/1-onboarding', '_blank')}
              className="text-chalk/60 hover:text-chalk-white"
            >
              ← Volver al Onboarding
            </Button>
            
            <Button 
              onClick={() => window.open('/tour/3-recipe', '_blank')}
              className="bg-chalk-green text-dark-green hover:bg-chalk-green/90"
            >
              Ver Detalle de Receta
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Quick Tour Navigation */}
          <div className="mt-8 p-4 bg-black/20 rounded-lg border border-chalk-green/20">
            <h3 className="text-chalk-green font-semibold mb-3">🎯 Tour Completo:</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('/tour/1-onboarding', '_blank')}
                className="border-chalk-green text-chalk-green hover:bg-chalk-green/10"
              >
                1. Onboarding
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-yellow-500 text-yellow-400 bg-yellow-500/10"
                disabled
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