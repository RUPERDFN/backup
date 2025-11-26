import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, Eye, Clock, Users, ChefHat, Heart, ShoppingCart, Star } from 'lucide-react';

export default function TourRecipe() {
  const demoRecipe = {
    name: 'Paella Valenciana Tradicional',
    description: 'Auténtica paella valenciana con pollo, conejo y verduras de temporada, siguiendo la receta tradicional de Valencia.',
    difficulty: 'intermedio',
    cookingTime: 35,
    servings: 2,
    cost: 8.50,
    rating: 4.8,
    totalRatings: 156,
    ingredients: [
      { name: 'Arroz bomba', amount: '200g', category: 'Cereales', cost: 1.20 },
      { name: 'Pollo troceado', amount: '300g', category: 'Carnes', cost: 2.80 },
      { name: 'Garrofón', amount: '100g', category: 'Legumbres', cost: 0.90 },
      { name: 'Judías verdes', amount: '100g', category: 'Verduras', cost: 0.60 },
      { name: 'Tomate rallado', amount: '80g', category: 'Verduras', cost: 0.40 },
      { name: 'Pimiento rojo', amount: '1 unidad', category: 'Verduras', cost: 0.50 },
      { name: 'Azafrán', amount: '0.5g', category: 'Especias', cost: 1.50 },
      { name: 'Aceite de oliva', amount: '50ml', category: 'Aceites', cost: 0.60 }
    ],
    instructions: [
      'Calentar aceite en paellera de 32cm y sofreír el pollo hasta dorar por todos lados',
      'Añadir las judías verdes y el garrofón, cocinar 5 minutos removiendo ocasionalmente',
      'Incorporar el tomate rallado y el pimiento rojo cortado en tiras',
      'Añadir el azafrán disuelto en un poco de caldo caliente',
      'Incorporar el arroz y remover durante 2-3 minutos para que se impregne',
      'Verter el caldo caliente (doble cantidad que arroz) y NO remover más',
      'Cocinar a fuego medio-alto 10 minutos, luego fuego bajo 8-10 minutos',
      'Reposar 5 minutos cubierta con un paño antes de servir'
    ],
    nutritionalInfo: {
      calories: 420,
      protein: 28,
      carbs: 65,
      fat: 12,
      fiber: 4,
      sodium: 890
    },
    tips: [
      'El arroz bomba es esencial para la textura perfecta',
      'No remover una vez añadido el caldo',
      'El socarrat (fondo tostado) es la marca de una buena paella',
      'Usar paellera de hierro o acero, nunca antiadherente'
    ],
    allergens: [],
    dietaryTags: ['Sin gluten', 'Alto en proteínas']
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
            <ChefHat className="w-10 h-10 text-chalk-green" />
            <h1 className="text-4xl font-bold text-chalk-white">Tour 3: Detalle de Receta</h1>
          </div>
          <p className="text-chalk/70 text-lg">
            Vista completa con ingredientes, instrucciones e información nutricional
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recipe Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recipe Header */}
            <Card className="glass-container border-chalk-green/30">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-chalk-white mb-2">{demoRecipe.name}</h2>
                    <p className="text-chalk/70 mb-4">{demoRecipe.description}</p>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-chalk font-medium">{demoRecipe.rating}</span>
                        <span className="text-chalk/60 text-sm">({demoRecipe.totalRatings})</span>
                      </div>
                      <Badge className={`${getDifficultyColor(demoRecipe.difficulty)} border`}>
                        {demoRecipe.difficulty}
                      </Badge>
                      {demoRecipe.dietaryTags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-chalk-green border-chalk-green/30">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" className="text-chalk border-chalk-green/30 hover:bg-chalk-green/20">
                    <Heart className="w-4 h-4 mr-2" />
                    Guardar
                  </Button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-black/20 rounded-lg border border-chalk-green/20">
                    <Clock className="w-5 h-5 text-chalk-green mx-auto mb-1" />
                    <div className="font-bold text-chalk-white">{demoRecipe.cookingTime}min</div>
                    <div className="text-chalk/60 text-xs">Cocción</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-lg border border-chalk-green/20">
                    <Users className="w-5 h-5 text-chalk-green mx-auto mb-1" />
                    <div className="font-bold text-chalk-white">{demoRecipe.servings}</div>
                    <div className="text-chalk/60 text-xs">Personas</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-lg border border-chalk-green/20">
                    <ShoppingCart className="w-5 h-5 text-chalk-green mx-auto mb-1" />
                    <div className="font-bold text-chalk-white">€{demoRecipe.cost}</div>
                    <div className="text-chalk/60 text-xs">Coste total</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-lg border border-chalk-green/20">
                    <ChefHat className="w-5 h-5 text-chalk-green mx-auto mb-1" />
                    <div className="font-bold text-chalk-white">{demoRecipe.nutritionalInfo.calories}</div>
                    <div className="text-chalk/60 text-xs">Calorías</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card className="glass-container border-chalk-green/30">
              <CardHeader>
                <CardTitle className="text-chalk-white">Ingredientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {demoRecipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-chalk-green/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-chalk-green/10 rounded-full flex items-center justify-center">
                          <ChefHat className="w-4 h-4 text-chalk-green" />
                        </div>
                        <div>
                          <div className="font-medium text-chalk-white">{ingredient.name}</div>
                          <div className="text-chalk/60 text-sm">{ingredient.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-chalk-white">{ingredient.amount}</div>
                        <div className="text-chalk/60 text-sm">€{ingredient.cost}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-chalk-green/30">
                  <Button className="w-full bg-chalk-green text-dark-green hover:bg-chalk-green/80">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Añadir a Lista de Compra
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="glass-container border-chalk-green/30">
              <CardHeader>
                <CardTitle className="text-chalk-white">Instrucciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demoRecipe.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-8 h-8 bg-chalk-green rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-dark-green font-bold text-sm">{index + 1}</span>
                      </div>
                      <div className="text-chalk/80 leading-relaxed">{instruction}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chef Tips */}
            <Card className="glass-container border-chalk-green/30">
              <CardHeader>
                <CardTitle className="text-chalk-white">Consejos del Chef</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {demoRecipe.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-chalk-green rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-chalk/70 text-sm">{tip}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Nutritional Info */}
            <Card className="glass-container border-chalk-green/30">
              <CardHeader>
                <CardTitle className="text-chalk-white">Información Nutricional</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-chalk/70">Calorías</span>
                    <span className="font-medium text-chalk-white">{demoRecipe.nutritionalInfo.calories}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-chalk/70">Proteínas</span>
                    <span className="font-medium text-chalk-white">{demoRecipe.nutritionalInfo.protein}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-chalk/70">Carbohidratos</span>
                    <span className="font-medium text-chalk-white">{demoRecipe.nutritionalInfo.carbs}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-chalk/70">Grasas</span>
                    <span className="font-medium text-chalk-white">{demoRecipe.nutritionalInfo.fat}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-chalk/70">Fibra</span>
                    <span className="font-medium text-chalk-white">{demoRecipe.nutritionalInfo.fiber}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-chalk/70">Sodio</span>
                    <span className="font-medium text-chalk-white">{demoRecipe.nutritionalInfo.sodium}mg</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-container border-chalk-green/30">
              <CardHeader>
                <CardTitle className="text-chalk-white">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-chalk-green text-dark-green hover:bg-chalk-green/80">
                  Programar para Hoy
                </Button>
                <Button variant="outline" className="w-full text-chalk border-chalk-green/30 hover:bg-chalk-green/20">
                  Ajustar Porciones
                </Button>
                <Button variant="outline" className="w-full text-chalk border-chalk-green/30 hover:bg-chalk-green/20">
                  Sustituciones
                </Button>
                <Button variant="outline" className="w-full text-chalk border-chalk-green/30 hover:bg-chalk-green/20">
                  Compartir Receta
                </Button>
              </CardContent>
            </Card>

            {/* Recipe Features */}
            <Card className="glass-container border-chalk-green/30">
              <CardHeader>
                <CardTitle className="text-chalk-white">Características</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-chalk/70">Receta tradicional auténtica</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-chalk/70">Ingredientes de temporada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-chalk/70">Optimizado para 2 personas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-chalk/70">Dentro del presupuesto</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            onClick={() => window.open('/tour/2-menu', '_blank')}
            variant="outline"
            className="text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior: Menú Semanal
          </Button>
          
          <Button
            onClick={() => window.open('/tour/4-shopping-list', '_blank')}
            className="bg-chalk-green text-dark-green hover:bg-chalk-green/80"
          >
            Siguiente: Lista de Compra
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Tour Navigation */}
        <div className="mt-8 text-center">
          <div className="flex justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-chalk/30 rounded-full"></div>
            <div className="w-3 h-3 bg-chalk/30 rounded-full"></div>
            <div className="w-3 h-3 bg-chalk-green rounded-full"></div>
            <div className="w-3 h-3 bg-chalk/30 rounded-full"></div>
            <div className="w-3 h-3 bg-chalk/30 rounded-full"></div>
          </div>
          <div className="text-xs text-chalk/60">
            Tour 3 de 5: Detalle de Receta Completo
          </div>
        </div>
      </div>
    </div>
  );
}