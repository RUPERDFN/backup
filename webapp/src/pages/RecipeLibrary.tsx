import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Search, Filter, Clock, Users, ChefHat, Heart } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { usePremium } from '@/hooks/usePremium';
import { useAdManager } from '@/hooks/useAdManager';
import BannerBottom from '@/components/ads/BannerBottom';
import NativeCard from '@/components/ads/NativeCard';
import RecipeSchema from '@/components/RecipeSchema';

interface Recipe {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  difficulty: 'fácil' | 'intermedio' | 'avanzado';
  cookingTime: number;
  servings: number;
  ingredients: Array<{
    name: string;
    amount: string;
    category: string;
  }>;
  instructions: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  allergens: string[];
  dietaryTags: string[];
  rating: number;
  totalRatings: number;
  imageUrl?: string;
  isPopular: boolean;
  isSeasonal: boolean;
}

export default function RecipeLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [dietaryFilter, setDietaryFilter] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const { isPremium } = usePremium();
  const { canShowNativeAd } = useAdManager();

  // Demo recipe library data
  const demoRecipes: Recipe[] = [
    {
      id: 'rec-001',
      name: 'Paella Valenciana Tradicional',
      description: 'Auténtica paella valenciana con pollo, conejo, garrofón y verduras de temporada',
      cuisine: 'Española',
      difficulty: 'intermedio',
      cookingTime: 45,
      servings: 4,
      ingredients: [
        { name: 'Arroz bomba', amount: '400g', category: 'Cereales' },
        { name: 'Pollo troceado', amount: '500g', category: 'Carnes' },
        { name: 'Garrofón', amount: '200g', category: 'Legumbres' },
        { name: 'Tomate rallado', amount: '100g', category: 'Verduras' },
        { name: 'Pimiento rojo', amount: '1 unidad', category: 'Verduras' },
        { name: 'Judías verdes', amount: '150g', category: 'Verduras' },
        { name: 'Azafrán', amount: '1g', category: 'Especias' },
        { name: 'Aceite de oliva', amount: '100ml', category: 'Aceites' }
      ],
      instructions: [
        'Calentar aceite en paellera y sofreír el pollo hasta dorar',
        'Añadir las verduras y cocinar 5 minutos',
        'Incorporar el tomate y el azafrán',
        'Añadir el arroz y remover 2 minutos',
        'Verter el caldo caliente y no remover más',
        'Cocinar 18-20 minutos a fuego medio',
        'Reposar 5 minutos antes de servir'
      ],
      nutritionalInfo: {
        calories: 420,
        protein: 28,
        carbs: 65,
        fat: 12
      },
      allergens: [],
      dietaryTags: ['Sin gluten'],
      rating: 4.8,
      totalRatings: 156,
      isPopular: true,
      isSeasonal: false
    },
    {
      id: 'rec-002',
      name: 'Gazpacho Andaluz',
      description: 'Refrescante gazpacho tradicional perfecto para el verano',
      cuisine: 'Española',
      difficulty: 'fácil',
      cookingTime: 15,
      servings: 4,
      ingredients: [
        { name: 'Tomates maduros', amount: '1kg', category: 'Verduras' },
        { name: 'Pepino', amount: '200g', category: 'Verduras' },
        { name: 'Pimiento verde', amount: '100g', category: 'Verduras' },
        { name: 'Cebolla', amount: '50g', category: 'Verduras' },
        { name: 'Ajo', amount: '2 dientes', category: 'Verduras' },
        { name: 'Pan del día anterior', amount: '100g', category: 'Cereales' },
        { name: 'Aceite de oliva virgen extra', amount: '50ml', category: 'Aceites' },
        { name: 'Vinagre de Jerez', amount: '25ml', category: 'Condimentos' }
      ],
      instructions: [
        'Pelar y trocear todos los ingredientes',
        'Remojar el pan en agua',
        'Triturar todo junto hasta obtener textura fina',
        'Pasar por colador fino',
        'Refrigerar mínimo 2 horas',
        'Servir bien frío con guarniciones'
      ],
      nutritionalInfo: {
        calories: 95,
        protein: 3,
        carbs: 12,
        fat: 4
      },
      allergens: ['Gluten'],
      dietaryTags: ['Vegano', 'Bajo en calorías'],
      rating: 4.6,
      totalRatings: 89,
      isPopular: false,
      isSeasonal: true
    },
    {
      id: 'rec-003',
      name: 'Tortilla Española Perfecta',
      description: 'La clásica tortilla de patatas española con su punto justo',
      cuisine: 'Española',
      difficulty: 'intermedio',
      cookingTime: 30,
      servings: 3,
      ingredients: [
        { name: 'Patatas', amount: '500g', category: 'Verduras' },
        { name: 'Huevos', amount: '4 unidades', category: 'Proteínas' },
        { name: 'Cebolla', amount: '150g', category: 'Verduras' },
        { name: 'Aceite de oliva', amount: '200ml', category: 'Aceites' },
        { name: 'Sal', amount: 'al gusto', category: 'Condimentos' }
      ],
      instructions: [
        'Pelar y cortar patatas en láminas finas',
        'Freír patatas en aceite abundante a fuego medio',
        'Añadir cebolla cuando patatas estén tiernas',
        'Escurrir y mezclar con huevos batidos',
        'Cuajar en sartén antiadherente',
        'Dar la vuelta con ayuda de plato',
        'Terminar cocción por el otro lado'
      ],
      nutritionalInfo: {
        calories: 380,
        protein: 15,
        carbs: 28,
        fat: 24
      },
      allergens: ['Huevos'],
      dietaryTags: ['Vegetariano', 'Sin gluten'],
      rating: 4.9,
      totalRatings: 203,
      isPopular: true,
      isSeasonal: false
    },
    {
      id: 'rec-004',
      name: 'Crema de Calabaza Asada',
      description: 'Suave crema de calabaza con un toque de jengibre y coco',
      cuisine: 'Internacional',
      difficulty: 'fácil',
      cookingTime: 25,
      servings: 4,
      ingredients: [
        { name: 'Calabaza', amount: '800g', category: 'Verduras' },
        { name: 'Cebolla', amount: '100g', category: 'Verduras' },
        { name: 'Jengibre fresco', amount: '15g', category: 'Especias' },
        { name: 'Leche de coco', amount: '200ml', category: 'Lácteos' },
        { name: 'Caldo de verduras', amount: '500ml', category: 'Caldos' },
        { name: 'Aceite de oliva', amount: '30ml', category: 'Aceites' }
      ],
      instructions: [
        'Asar calabaza en el horno 30 minutos',
        'Sofreír cebolla y jengibre',
        'Añadir calabaza asada',
        'Verter caldo y cocinar 15 minutos',
        'Triturar hasta textura cremosa',
        'Incorporar leche de coco',
        'Ajustar sazón y servir caliente'
      ],
      nutritionalInfo: {
        calories: 125,
        protein: 4,
        carbs: 18,
        fat: 6
      },
      allergens: [],
      dietaryTags: ['Vegano', 'Sin gluten', 'Bajo en calorías'],
      rating: 4.4,
      totalRatings: 67,
      isPopular: false,
      isSeasonal: true
    }
  ];

  const { data: recipes = demoRecipes, isLoading } = useQuery({
    queryKey: ['/api/recipes/library'],
    queryFn: () => apiRequest('/api/recipes/library'),
    enabled: false // Use demo data for now
  });

  const filteredRecipes = recipes.filter((recipe: Recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = cuisineFilter === 'all' || recipe.cuisine === cuisineFilter;
    const matchesDifficulty = difficultyFilter === 'all' || recipe.difficulty === difficultyFilter;
    const matchesDietary = dietaryFilter === 'all' || recipe.dietaryTags.includes(dietaryFilter);
    
    return matchesSearch && matchesCuisine && matchesDifficulty && matchesDietary;
  });

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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-chalk-green" />
            <h1 className="text-4xl font-bold text-chalk-white">Biblioteca de Recetas</h1>
          </div>
          <p className="text-chalk/70 text-lg">
            Descubre nuestra colección de recetas tradicionales y modernas
          </p>
        </div>

        {/* Filters */}
        <Card className="glass-container border-chalk-green/30 mb-6">
          <CardHeader>
            <CardTitle className="text-chalk-white flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros de Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-chalk/60" />
                  <Input
                    placeholder="Buscar recetas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-chalk border-chalk-green/30"
                  />
                </div>
              </div>
              
              <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
                <SelectTrigger className="text-chalk border-chalk-green/30">
                  <SelectValue placeholder="Cocina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las cocinas</SelectItem>
                  <SelectItem value="Española">Española</SelectItem>
                  <SelectItem value="Internacional">Internacional</SelectItem>
                  <SelectItem value="Mediterránea">Mediterránea</SelectItem>
                </SelectContent>
              </Select>

              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="text-chalk border-chalk-green/30">
                  <SelectValue placeholder="Dificultad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="fácil">Fácil</SelectItem>
                  <SelectItem value="intermedio">Intermedio</SelectItem>
                  <SelectItem value="avanzado">Avanzado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dietaryFilter} onValueChange={setDietaryFilter}>
                <SelectTrigger className="text-chalk border-chalk-green/30">
                  <SelectValue placeholder="Dieta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las dietas</SelectItem>
                  <SelectItem value="Vegano">Vegano</SelectItem>
                  <SelectItem value="Vegetariano">Vegetariano</SelectItem>
                  <SelectItem value="Sin gluten">Sin gluten</SelectItem>
                  <SelectItem value="Bajo en calorías">Bajo en calorías</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recipe List */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-chalk/60">
                {filteredRecipes.length} recetas encontradas
              </div>
            </div>

            <div className="space-y-4">
              {filteredRecipes.map((recipe: Recipe, index: number) => (
                <div key={recipe.id}>
                  <Card 
                    className="glass-container border-chalk-green/30 cursor-pointer hover:border-chalk-green/50 transition-colors"
                    onClick={() => setSelectedRecipe(recipe)}
                    data-testid={`card-recipe-${recipe.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-chalk-green/10 rounded-lg flex items-center justify-center">
                          <ChefHat className="w-8 h-8 text-chalk-green" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-chalk-white text-lg">{recipe.name}</h3>
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4 text-red-400" />
                              <span className="text-sm text-chalk/60">{recipe.rating}</span>
                            </div>
                          </div>
                          
                          <p className="text-chalk/70 text-sm mb-3">{recipe.description}</p>
                          
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-1 text-xs text-chalk/60">
                              <Clock className="w-3 h-3" />
                              {recipe.cookingTime}min
                            </div>
                            <div className="flex items-center gap-1 text-xs text-chalk/60">
                              <Users className="w-3 h-3" />
                              {recipe.servings} personas
                            </div>
                            <Badge className={`${getDifficultyColor(recipe.difficulty)} border text-xs`}>
                              {recipe.difficulty}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-chalk-green border-chalk-green/30 text-xs">
                              {recipe.cuisine}
                            </Badge>
                            {recipe.isPopular && (
                              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                                Popular
                              </Badge>
                            )}
                            {recipe.isSeasonal && (
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                                Temporada
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Native ad inserted between recipes */}
                  {canShowNativeAd(index, filteredRecipes.length) && (
                    <NativeCard 
                      className="my-4" 
                      slotId="recipe-library-native"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recipe Detail */}
          <div className="lg:col-span-1">
            {selectedRecipe ? (
              <>
                <RecipeSchema
                  name={selectedRecipe.name}
                  description={selectedRecipe.description}
                  cookingTime={selectedRecipe.cookingTime}
                  servings={selectedRecipe.servings}
                  difficulty={selectedRecipe.difficulty}
                  cuisine={selectedRecipe.cuisine}
                  ingredients={selectedRecipe.ingredients}
                  instructions={selectedRecipe.instructions}
                  nutritionInfo={selectedRecipe.nutritionalInfo}
                  allergens={selectedRecipe.allergens}
                  dietaryTags={selectedRecipe.dietaryTags}
                  rating={selectedRecipe.rating}
                  totalRatings={selectedRecipe.totalRatings}
                  keywords={[selectedRecipe.name.toLowerCase(), selectedRecipe.cuisine.toLowerCase(), "receta española"]}
                />
                <Card className="glass-container border-chalk-green/30 sticky top-4">
                  <CardHeader>
                    <CardTitle className="text-chalk-white">{selectedRecipe.name}</CardTitle>
                  </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-chalk/70 text-sm">{selectedRecipe.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-black/20 rounded border border-chalk-green/20">
                      <div className="text-lg font-bold text-chalk-green">{selectedRecipe.cookingTime}</div>
                      <div className="text-xs text-chalk/60">minutos</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded border border-chalk-green/20">
                      <div className="text-lg font-bold text-chalk-green">{selectedRecipe.servings}</div>
                      <div className="text-xs text-chalk/60">personas</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-chalk-white mb-2">Ingredientes:</h4>
                    <div className="space-y-1">
                      {selectedRecipe.ingredients.slice(0, 5).map((ingredient, index) => (
                        <div key={index} className="text-sm text-chalk/70">
                          • {ingredient.amount} {ingredient.name}
                        </div>
                      ))}
                      {selectedRecipe.ingredients.length > 5 && (
                        <div className="text-xs text-chalk/60">
                          y {selectedRecipe.ingredients.length - 5} más...
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-chalk-white mb-2">Información nutricional:</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-chalk/60">Calorías: {selectedRecipe.nutritionalInfo.calories}</div>
                      <div className="text-chalk/60">Proteínas: {selectedRecipe.nutritionalInfo.protein}g</div>
                      <div className="text-chalk/60">Carbohidratos: {selectedRecipe.nutritionalInfo.carbs}g</div>
                      <div className="text-chalk/60">Grasas: {selectedRecipe.nutritionalInfo.fat}g</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {selectedRecipe.dietaryTags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-chalk-green border-chalk-green/30 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full bg-chalk-green text-dark-green hover:bg-chalk-green/80">
                    Ver Receta Completa
                  </Button>
                </CardContent>
              </Card>
              </>
            ) : (
              <Card className="glass-container border-chalk-green/30 sticky top-4">
                <CardContent className="p-8 text-center">
                  <BookOpen className="w-12 h-12 text-chalk/30 mx-auto mb-4" />
                  <p className="text-chalk/60">Selecciona una receta para ver los detalles</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {/* Bottom banner ad for non-premium users */}
        {!isPremium && (
          <BannerBottom 
            slotId="recipe-library-bottom" 
            className="mt-8"
          />
        )}
      </div>
    </div>
  );
}