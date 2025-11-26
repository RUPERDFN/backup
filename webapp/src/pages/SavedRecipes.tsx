import { useState, useEffect } from 'react';
import { usePremium } from '@/hooks/usePremium';
import RecipeFeed from '@/components/RecipeFeed';
import { ChefHat, Heart, Search, Filter } from 'lucide-react';

interface Recipe {
  id: string;
  name: string;
  description: string;
  cookingTime: number;
  servings: number;
  difficulty: string;
  imageUrl?: string;
  category: string;
  isFavorite: boolean;
}

export default function SavedRecipes() {
  const { isPremium } = usePremium();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadSavedRecipes();
  }, []);

  const loadSavedRecipes = async () => {
    try {
      // In a real app, this would fetch from the API
      // For demo purposes, we'll use mock data
      const mockRecipes: Recipe[] = [
        {
          id: '1',
          name: 'Paella Valenciana',
          description: 'Auténtica paella con pollo, conejo y judías verdes',
          cookingTime: 45,
          servings: 6,
          difficulty: 'intermedio',
          category: 'Platos principales',
          isFavorite: true,
          imageUrl: '/api/placeholder/400/300'
        },
        {
          id: '2',
          name: 'Gazpacho Andaluz',
          description: 'Refrescante sopa fría de tomate y verduras',
          cookingTime: 15,
          servings: 4,
          difficulty: 'fácil',
          category: 'Entrantes',
          isFavorite: false,
        },
        {
          id: '3',
          name: 'Tortilla Española',
          description: 'Clásica tortilla de patatas española',
          cookingTime: 30,
          servings: 4,
          difficulty: 'intermedio',
          category: 'Platos principales',
          isFavorite: true,
        },
        {
          id: '4',
          name: 'Churros con Chocolate',
          description: 'Deliciosos churros caseros con chocolate espeso',
          cookingTime: 25,
          servings: 4,
          difficulty: 'fácil',
          category: 'Postres',
          isFavorite: true,
        },
        {
          id: '5',
          name: 'Fabada Asturiana',
          description: 'Tradicional guiso de alubias asturianas',
          cookingTime: 90,
          servings: 6,
          difficulty: 'intermedio',
          category: 'Platos principales',
          isFavorite: false,
        }
      ];
      
      setRecipes(mockRecipes);
    } catch (error) {
      console.error('Error loading saved recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || recipe.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(recipes.map(r => r.category)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-green via-black to-dark-green flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="animate-spin mx-auto mb-4 text-chalk-green" size={48} />
          <p className="text-chalk/70">Cargando recetas guardadas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-green via-black to-dark-green">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl text-chalk-white mb-4 flex items-center justify-center gap-3">
            <Heart className="text-chalk-green" />
            Mis Recetas Guardadas
          </h1>
          <p className="text-xl text-chalk max-w-2xl mx-auto">
            Todas tus recetas favoritas en un solo lugar
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="glass-container max-w-4xl mx-auto mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chalk/60 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar recetas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/30 border border-chalk-green/30 rounded-lg text-chalk placeholder-chalk/60 focus:border-chalk-green focus:outline-none"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chalk/60 w-5 h-5" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/30 border border-chalk-green/30 rounded-lg text-chalk focus:border-chalk-green focus:outline-none appearance-none"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-blackboard">
                    {category === 'all' ? 'Todas las categorías' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="text-center mb-6">
          <p className="text-chalk/70">
            {filteredRecipes.length} receta{filteredRecipes.length !== 1 ? 's' : ''} encontrada{filteredRecipes.length !== 1 ? 's' : ''}
            {!isPremium && filteredRecipes.length > 4 && (
              <span className="ml-2 text-chalk-green">
                • Anuncios solo al final del feed (baja presión publicitaria)
              </span>
            )}
          </p>
        </div>

        {/* Recipe Feed with Expert Ad Placement */}
        {filteredRecipes.length > 0 ? (
          <RecipeFeed 
            recipes={filteredRecipes}
            className="max-w-6xl mx-auto"
          />
        ) : (
          <div className="text-center py-12">
            <ChefHat className="mx-auto mb-4 text-chalk/40" size={64} />
            <h3 className="text-xl text-chalk-white mb-2">No se encontraron recetas</h3>
            <p className="text-chalk/70">
              {searchTerm || filterCategory !== 'all' 
                ? 'Prueba con otros términos de búsqueda o filtros'
                : 'Aún no has guardado ninguna receta'
              }
            </p>
          </div>
        )}

        {/* Stats for Premium Users */}
        {isPremium && (
          <div className="glass-container max-w-4xl mx-auto mt-12">
            <h3 className="text-xl text-chalk-white mb-4 text-center">Estadísticas Premium</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-chalk-green">{recipes.length}</div>
                <div className="text-sm text-chalk/70">Total Recetas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-chalk-green">
                  {recipes.filter(r => r.isFavorite).length}
                </div>
                <div className="text-sm text-chalk/70">Favoritas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-chalk-green">{categories.length - 1}</div>
                <div className="text-sm text-chalk/70">Categorías</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-chalk-green">
                  {Math.round(recipes.reduce((acc, r) => acc + r.cookingTime, 0) / recipes.length) || 0}
                </div>
                <div className="text-sm text-chalk/70">Tiempo Promedio</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}