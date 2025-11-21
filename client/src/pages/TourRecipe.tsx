import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Eye, TestTube, Camera, Clock, Users, ChefHat, Heart } from 'lucide-react';
import RecipeSchema from '@/components/RecipeSchema';
import SEO from '@/components/SEO';

export default function TourRecipe() {
  const demoRecipe = {
    name: "Paella Valenciana Auténtica",
    description: "Receta tradicional valenciana con pollo, conejo, garrofón y judía verde",
    cookingTime: 35,
    servings: 4,
    difficulty: "Intermedio",
    calories: 580,
    cost: "€3.20 por ración",
    tags: ["Tradicional", "Mediterránea", "Sin gluten"],
    ingredients: [
      { name: "Arroz bomba", quantity: "320g", category: "Cereales", price: "€1.80" },
      { name: "Pollo troceado", quantity: "400g", category: "Carnes", price: "€2.60" },
      { name: "Judías verdes", quantity: "200g", category: "Verduras", price: "€1.20" },
      { name: "Garrofón", quantity: "100g", category: "Legumbres", price: "€0.90" },
      { name: "Tomate rallado", quantity: "1 unidad", category: "Verduras", price: "€0.30" },
      { name: "Pimiento rojo", quantity: "1 unidad", category: "Verduras", price: "€0.40" },
      { name: "Azafrán", quantity: "1g", category: "Especias", price: "€2.90" },
      { name: "Aceite de oliva", quantity: "4 cucharadas", category: "Aceites", price: "€0.50" }
    ],
    instructions: [
      {
        step: 1,
        title: "Preparar los ingredientes",
        description: "Trocea el pollo, limpia las judías verdes y prepara todos los ingredientes",
        time: "10 min",
        tip: "Corta las judías en trozos de 3-4 cm para mejor cocción"
      },
      {
        step: 2,
        title: "Dorar la carne",
        description: "Calentar el aceite en la paellera y dorar el pollo a fuego medio-alto",
        time: "8 min",
        tip: "No muevas el pollo hasta que esté bien dorado por un lado"
      },
      {
        step: 3,
        title: "Añadir verduras",
        description: "Incorporar las judías verdes y el pimiento, sofreír durante 5 minutos",
        time: "5 min",
        tip: "Las verduras deben quedar al dente, no las sobre-cocines"
      },
      {
        step: 4,
        title: "Incorporar base de sofrito",
        description: "Añadir el tomate rallado y el azafrán, cocinar hasta que evapore el agua",
        time: "3 min",
        tip: "El azafrán debe disolverse completamente para dar color uniforme"
      },
      {
        step: 5,
        title: "Añadir el arroz",
        description: "Incorporar el arroz bomba y remover durante 2 minutos para que se impregne",
        time: "2 min",
        tip: "No remuevas el arroz una vez añadas el caldo"
      },
      {
        step: 6,
        title: "Cocción final",
        description: "Verter el caldo caliente y cocer 18-20 minutos sin remover nunca",
        time: "20 min",
        tip: "El caldo debe estar muy caliente al añadirlo"
      },
      {
        step: 7,
        title: "Reposo",
        description: "Dejar reposar 5 minutos tapada con un paño antes de servir",
        time: "5 min",
        tip: "Este paso es crucial para que el arroz termine de absorber el caldo"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-green via-black to-dark-green text-chalk-white">
      <SEO
        title="Paella Valenciana Auténtica - Receta Tradicional | TheCookFlow"
        description="Receta tradicional valenciana de paella con pollo, conejo, garrofón y judía verde. Aprende a cocinar paella auténtica paso a paso con TheCookFlow, tu planificador de menús con IA."
        keywords="paella valenciana, receta paella, receta tradicional española, arroz bomba, cocina española, recetas con IA, planificador de menús"
      />
      <RecipeSchema
        name={demoRecipe.name}
        description={demoRecipe.description}
        cookingTime={demoRecipe.cookingTime}
        servings={demoRecipe.servings}
        difficulty={demoRecipe.difficulty}
        cuisine="Española"
        mealType="Almuerzo"
        ingredients={demoRecipe.ingredients.map(ing => ({
          name: ing.name,
          amount: ing.quantity,
          category: ing.category
        }))}
        instructions={demoRecipe.instructions}
        nutritionInfo={{
          calories: demoRecipe.calories,
          protein: 32,
          carbs: 68,
          fat: 18,
          fiber: 4
        }}
        dietaryTags={demoRecipe.tags}
        keywords={["paella", "receta valenciana", "arroz", "receta tradicional española"]}
      />
      
      {/* Demo Banner */}
      <div className="bg-yellow-600/20 border-b border-yellow-500/30 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold text-yellow-400">Vista Demo (Read-Only)</span>
            <Badge variant="outline" className="border-yellow-500 text-yellow-400">
              TOUR 3/5
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
          {/* Recipe Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-handwritten text-chalk-green mb-4">
              {demoRecipe.name}
            </h1>
            <p className="text-xl text-chalk/80 mb-6">
              {demoRecipe.description}
            </p>
            
            <div className="flex justify-center items-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-400" />
                <span className="text-orange-400">{demoRecipe.cookingTime} min</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400">{demoRecipe.servings} personas</span>
              </div>
              <div className="flex items-center space-x-2">
                <ChefHat className="w-5 h-5 text-purple-400" />
                <span className="text-purple-400">{demoRecipe.difficulty}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-red-400">{demoRecipe.calories} kcal</span>
              </div>
            </div>

            <div className="flex justify-center space-x-4 mb-6">
              {demoRecipe.tags.map((tag, index) => (
                <Badge key={index} className="bg-green-600 text-white">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="text-chalk-green font-semibold">
              💰 {demoRecipe.cost}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Ingredients */}
            <Card className="bg-dark-green/20 border-chalk-green/30">
              <CardHeader>
                <CardTitle className="text-chalk-green text-xl flex items-center">
                  🛒 Ingredientes ({demoRecipe.ingredients.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {demoRecipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded border border-chalk-green/20">
                      <div>
                        <div className="font-semibold text-chalk-white">{ingredient.name}</div>
                        <div className="text-sm text-chalk/60">{ingredient.quantity}</div>
                        <Badge variant="outline" className="text-xs mt-1 border-chalk-green/50 text-chalk-green">
                          {ingredient.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-chalk-green font-semibold">{ingredient.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-green-900/20 border border-green-400/30 rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-green-400">Total estimado:</span>
                    <span className="text-xl font-bold text-green-400">€12.80</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-dark-green/20 border-chalk-green/30">
              <CardHeader>
                <CardTitle className="text-chalk-green text-xl flex items-center">
                  👨‍🍳 Instrucciones (7 pasos)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demoRecipe.instructions.map((instruction, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-chalk-green text-dark-green rounded-full flex items-center justify-center font-bold text-sm">
                          {instruction.step}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-chalk-white">{instruction.title}</h4>
                            <Badge variant="outline" className="text-xs border-orange-400 text-orange-400">
                              {instruction.time}
                            </Badge>
                          </div>
                          <p className="text-chalk/80 text-sm mb-2">{instruction.description}</p>
                          <div className="bg-blue-900/20 border border-blue-400/30 rounded p-2">
                            <p className="text-xs text-blue-400">
                              💡 <strong>Consejo:</strong> {instruction.tip}
                            </p>
                          </div>
                        </div>
                      </div>
                      {index < demoRecipe.instructions.length - 1 && (
                        <div className="ml-4 mt-2 h-4 w-px bg-chalk-green/30"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-3 gap-4 mt-8 mb-8">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => window.open('/tour/4-shopping-list', '_blank')}
            >
              🛒 Añadir a Lista de Compra
            </Button>
            <Button 
              variant="outline"
              className="border-chalk-green text-chalk-green hover:bg-chalk-green/10"
            >
              ❤️ Guardar Receta
            </Button>
            <Button 
              variant="outline"
              className="border-chalk-green text-chalk-green hover:bg-chalk-green/10"
            >
              📱 Compartir Receta
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost"
              onClick={() => window.open('/tour/2-menu', '_blank')}
              className="text-chalk/60 hover:text-chalk-white"
            >
              ← Volver al Menú
            </Button>
            
            <Button 
              onClick={() => window.open('/tour/4-shopping-list', '_blank')}
              className="bg-chalk-green text-dark-green hover:bg-chalk-green/90"
            >
              Ver Lista de Compra
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
                onClick={() => window.open('/tour/2-menu', '_blank')}
                className="border-chalk-green text-chalk-green hover:bg-chalk-green/10"
              >
                2. Menú
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-yellow-500 text-yellow-400 bg-yellow-500/10"
                disabled
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