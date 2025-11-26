import { useState, useEffect } from 'react';
import { usePremium } from '@/hooks/usePremium';
import { useAdManager } from '@/hooks/useAdManager';
import NativeCard from '@/components/ads/NativeCard';
import { Clock, Users, ChefHat, Heart } from 'lucide-react';

interface Recipe {
  id: string;
  name: string;
  description: string;
  cookingTime: number;
  servings: number;
  difficulty: string;
  imageUrl?: string;
}

interface RecipeFeedProps {
  recipes: Recipe[];
  className?: string;
}

export default function RecipeFeed({ recipes, className = '' }: RecipeFeedProps) {
  const { isPremium } = usePremium();
  const { canShowNativeAd } = useAdManager();
  const [feedItems, setFeedItems] = useState<(Recipe | 'ad')[]>([]);

  useEffect(() => {
    const items: (Recipe | 'ad')[] = [...recipes];
    
    // Native: 1 cada 6–8 tarjetas, no antes del ítem 3 en una vista
    // Expert specifications: After 6th item, then every 7 items (average of 6-8)
    if (!isPremium && recipes.length > 3) {
      const itemsWithAds: (Recipe | 'ad')[] = [];
      
      for (let i = 0; i < items.length; i++) {
        itemsWithAds.push(items[i]);
        
        // Use canShowNativeAd to check if we should show ad at this position
        if (canShowNativeAd(i, items.length)) {
          itemsWithAds.push('ad');
        }
      }
      
      setFeedItems(itemsWithAds);
    } else {
      setFeedItems(items);
    }
  }, [recipes, isPremium, canShowNativeAd]);

  return (
    <div className={`recipe-feed ${className}`}>
      <ul 
        id="feed-grid" 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {feedItems.map((item, index) => {
          if (item === 'ad') {
            return (
              <NativeCard 
                key={`ad-${index}`}
                slotId="feed-native"
              />
            );
          }

          const recipe = item as Recipe;
          return (
            <li 
              key={recipe.id}
              className="recipe-card bg-black/20 border border-chalk-green/30 rounded-lg overflow-hidden hover:border-chalk-green/50 transition-colors cursor-pointer"
              style={{ 
                marginBlock: '16px',
                // ESPACIADO: deja 12–16 px libres alrededor para evitar clics accidentales
                margin: '16px 12px'
              }}
            >
              {recipe.imageUrl && (
                <div className="aspect-video bg-black/30 overflow-hidden">
                  <img 
                    src={recipe.imageUrl} 
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-chalk-white mb-2">
                  {recipe.name}
                </h3>
                
                <p className="text-chalk text-sm mb-4 line-clamp-2">
                  {recipe.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-chalk/70">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.cookingTime} min</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{recipe.servings} personas</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <ChefHat className="w-4 h-4" />
                    <span className="capitalize">{recipe.difficulty}</span>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-chalk-green text-sm font-medium">
                    Ver receta
                  </span>
                  <Heart className="w-5 h-5 text-chalk/40 hover:text-chalk-green transition-colors" />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}