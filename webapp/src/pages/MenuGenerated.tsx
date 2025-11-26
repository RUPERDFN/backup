import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { usePremium } from "@/hooks/usePremium";
import { useAdManager } from "@/hooks/useAdManager";
import BannerBottom from "@/components/ads/BannerBottom";
import BannerShopping from "@/components/ads/BannerShopping";
import InterstitialAd from "@/components/ads/InterstitialAd";
import { 
  Calendar, 
  Clock, 
  Users, 
  ChefHat, 
  ShoppingCart, 
  Utensils,
  ArrowLeft,
  Download,
  Share2,
  Loader2,
  Eye,
  X,
  Info,
  Check,
  Square
} from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";

export default function MenuGenerated() {
  const [, setLocation] = useLocation();
  const { isPremium } = usePremium();
  const { showInterstitial, interstitialVisible, closeInterstitial } = useAdManager();
  const [menuPlan, setMenuPlan] = useState<any>(null);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [shoppingList, setShoppingList] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [aiProvider, setAiProvider] = useState<string>('');
  const [usingFallback, setUsingFallback] = useState<boolean>(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});


  // Get questionnaire data to determine days to show
  const getQuestionnaireData = () => {
    const questionnaireData = localStorage.getItem('questionnaireData');
    return questionnaireData ? JSON.parse(questionnaireData) : { days: 7 };
  };
  
  const questionnaireData = getQuestionnaireData();
  const allDaysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const daysOfWeek = questionnaireData.days === 5 ? allDaysOfWeek.slice(0, 5) : allDaysOfWeek;
  // Dynamic meal types based on number of meals selected
  const getMealTypes = (mealsPerDay: number) => {
    switch(mealsPerDay) {
      case 3:
        return { breakfast: 'Desayuno', lunch: 'Comida', dinner: 'Cena' };
      case 4:
        return { breakfast: 'Desayuno', lunch: 'Comida', snack: 'Merienda', dinner: 'Cena' };
      case 5:
        return { breakfast: 'Desayuno', midmorning: 'Almuerzo', lunch: 'Comida', snack: 'Merienda', dinner: 'Cena' };
      default:
        return { breakfast: 'Desayuno', lunch: 'Comida', snack: 'Merienda', dinner: 'Cena' };
    }
  };
  
  const mealTypes = getMealTypes(questionnaireData.mealsPerDay || 4);

  // Generate menu on component mount with questionnaire data
  useEffect(() => {
    const questionnaireData = localStorage.getItem('questionnaireData');
    if (questionnaireData) {
      try {
        const data = JSON.parse(questionnaireData);
        // Auto-start menu generation with questionnaire data
        generateMenu();
      } catch (error) {
        console.error('Error loading questionnaire data:', error);
        generateMenu();
      }
    } else {
      generateMenu();
    }
  }, []);

  // Load saved checkbox state on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('checkedIngredients');
    if (savedState) {
      try {
        setCheckedIngredients(JSON.parse(savedState));
      } catch (error) {
        console.error('Error loading saved checkbox state:', error);
      }
    }
  }, []);

  // Mark recognized ingredients when shopping list is first generated (only once)
  useEffect(() => {
    if (shoppingList && questionnaireData.recognizedIngredients) {
      // Check if we already have saved state
      const savedState = localStorage.getItem('checkedIngredients');
      if (savedState) {
        return; // Don't override saved state
      }
      
      const recognizedIngredients = questionnaireData.recognizedIngredients;
      const ingredientsToMark: Record<string, boolean> = {};
      
      // Find matching ingredients in the shopping list
      const shoppingListCategories = Array.isArray(shoppingList?.items) ? shoppingList.items : shoppingList || [];
      shoppingListCategories.forEach((category: any) => {
        category.items?.forEach((item: any) => {
          const ingredientKey = `${item.name}-${item.amount}`;
          // Check if this ingredient matches any recognized ingredient
          const isRecognized = recognizedIngredients.some((recognized: string) => 
            item.name.toLowerCase().includes(recognized.toLowerCase()) ||
            recognized.toLowerCase().includes(item.name.toLowerCase())
          );
          
          if (isRecognized) {
            ingredientsToMark[ingredientKey] = true;
          }
        });
      });
      
      setCheckedIngredients(ingredientsToMark);
      localStorage.setItem('checkedIngredients', JSON.stringify(ingredientsToMark));
    }
  }, [shoppingList, questionnaireData.recognizedIngredients]);

  const generateMenu = async () => {
    try {
      setIsGenerating(true);
      
      // Get questionnaire data
      const questionnaireData = localStorage.getItem('questionnaireData');
      if (!questionnaireData) {
        setLocation('/questionnaire');
        return;
      }

      const data = JSON.parse(questionnaireData);
      
      // Transform questionnaire data to menu preferences
      const preferences = {
        budget: data.budget,
        servings: data.people,
        daysToGenerate: data.days || 7,
        mealsPerDay: data.mealsPerDay || 4,
        dietaryRestrictions: data.dietType ? [data.dietType] : [],
        allergies: data.allergies ? data.allergies.split(',').map((a: string) => a.trim()) : [],
        cookingTime: data.mealsPerDay > 2 ? 'medium' : 'quick',
        availableIngredients: data.recognizedIngredients || [],
        favorites: data.favorites ? data.favorites.split(',').map((f: string) => f.trim()) : [],
        dislikes: data.dislikes ? data.dislikes.split(',').map((d: string) => d.trim()) : []
      };

      // Call generate menu API
      const response = await fetch('/api/generate-menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(preferences)
      });

      if (!response.ok) {
        throw new Error('Error al generar el menú');
      }

      const result = await response.json();
      console.log('Menu generation result:', result);
      setMenuPlan(result.menuPlan);
      setRecipes(result.recipes);
      setShoppingList(result.shoppingList);
      setAiProvider(result.aiProvider || 'OpenAI');
      setUsingFallback(result.usingFallback || false);
      
      // Show interstitial ad after menu generation (expert specification #4)
      // Only for non-premium users, with cooldown ≥ 120s, not in first session
      setTimeout(() => {
        showInterstitial('POST_MENU');
      }, 1000); // Small delay to ensure menu is displayed
    } catch (error) {
      console.error('Error generating menu:', error);
      alert('Error al generar el menú. Por favor, intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-green via-black to-dark-green flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          {/* Logo animado */}
          <AnimatedLogo className="mb-12" />
          
          {/* Indicador de progreso */}
          <div className="glass-container max-w-lg mx-auto p-8">
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3 text-chalk">
                <div className="w-6 h-6 rounded-full border-2 border-chalk-green relative">
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-chalk-green animate-spin"></div>
                </div>
                <span className="text-lg">Analizando tus preferencias culinarias</span>
              </div>
              <div className="flex items-center gap-3 text-chalk">
                <Utensils className="w-6 h-6 text-chalk-green animate-pulse" />
                <span className="text-lg">Seleccionando recetas perfectas</span>
              </div>
              <div className="flex items-center gap-3 text-chalk">
                <ShoppingCart className="w-6 h-6 text-chalk-green animate-bounce" />
                <span className="text-lg">Optimizando tu lista de compras</span>
              </div>
            </div>
            
            {/* Barra de progreso animada */}
            <div className="mt-6">
              <div className="bg-chalk/20 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-chalk-green to-chalk-green/70 h-full rounded-full animate-pulse" 
                     style={{ width: '70%', animation: 'progress 3s ease-in-out infinite' }}>
                </div>
              </div>
            </div>
            
            <p className="text-chalk/70 text-sm mt-4 italic">
              Nuestro chef virtual está trabajando en tu menú perfecto...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const groupedRecipes = recipes.reduce((acc, recipe) => {
    const day = recipe.dayOfWeek - 1; // Convert 1-based to 0-based indexing
    if (!acc[day]) acc[day] = {};
    acc[day][recipe.mealType] = recipe;
    return acc;
  }, {});

  console.log('Grouped recipes:', groupedRecipes);
  console.log('Total recipes:', recipes.length);
  console.log('Days with recipes:', Object.keys(groupedRecipes));

  const openRecipeModal = (recipe: any) => {
    setSelectedRecipe(recipe);
    setShowRecipeModal(true);
  };

  const closeRecipeModal = () => {
    setSelectedRecipe(null);
    setShowRecipeModal(false);
  };

  const toggleIngredient = (ingredientKey: string) => {
    setCheckedIngredients(prev => {
      const newState = {
        ...prev,
        [ingredientKey]: !prev[ingredientKey]
      };
      // Save state to localStorage to persist across renders
      localStorage.setItem('checkedIngredients', JSON.stringify(newState));
      return newState;
    });
  };

  const getCheckedCount = (categoryItems: any[]) => {
    return categoryItems.filter(item => 
      checkedIngredients[`${item.name}-${item.amount}`]
    ).length;
  };

  const buyOnAmazonFresh = () => {
    if (!shoppingList) return;
    
    // Extract all ingredient names and quantities from shopping list
    const ingredients: { name: string, amount: string, unit: string }[] = [];
    const shoppingListCategories = Array.isArray(shoppingList?.items) ? shoppingList.items : shoppingList || [];
    
    shoppingListCategories.forEach((category: any) => {
      category.items?.forEach((item: any) => {
        ingredients.push({
          name: item.name,
          amount: item.amount || '1',
          unit: item.unit || 'unidad'
        });
      });
    });

    // Create shopping list data to copy to clipboard
    const shoppingListText = ingredients.map(item => 
      `${item.amount} ${item.unit} de ${item.name}`
    ).join('\n');

    // Copy shopping list to clipboard
    navigator.clipboard.writeText(shoppingListText).then(() => {
      console.log('Lista de compras copiada al portapapeles');
    }).catch(err => {
      console.error('Error al copiar al portapapeles:', err);
    });

    // Create Amazon Fresh URL with referral code and search parameters
    const amazonReferralCode = 'thecookflow-21';
    
    // Try different approaches for Amazon Fresh integration
    // 1. First try with specific Fresh storefront
    const amazonFreshUrl = `https://www.amazon.es/alm/storefront?almBrandId=QW1hem9uIEZyZXNo&ref_=${amazonReferralCode}&tag=${amazonReferralCode}`;
    
    // 2. Alternative: Create multiple search URLs for key ingredients
    const keyIngredients = ingredients.slice(0, 5); // Take first 5 ingredients
    const searchUrls = keyIngredients.map(ingredient => 
      `https://www.amazon.es/s?k=${encodeURIComponent(ingredient.name)}&i=amazon-fresh&ref=sr_pg_1&tag=${amazonReferralCode}`
    );

    // Open Amazon Fresh main page
    const newWindow = window.open(amazonFreshUrl, '_blank');
    
    // Show user notification with instructions
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed; 
        top: 20px; 
        right: 20px; 
        background: #2d4d3a; 
        color: #a8d5ba; 
        padding: 20px; 
        border-radius: 10px; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 350px;
        border: 2px solid #a8d5ba;
      ">
        <h4 style="margin: 0 0 10px 0; color: #a8d5ba;">✅ ¡Lista copiada!</h4>
        <p style="margin: 0 0 10px 0; font-size: 14px;">
          Tu lista de compras se ha copiado al portapapeles. En Amazon Fresh:
        </p>
        <ol style="margin: 0; padding-left: 20px; font-size: 13px;">
          <li>Busca cada ingrediente individualmente</li>
          <li>O pega la lista completa (Ctrl+V) en cualquier campo de búsqueda</li>
          <li>Añade los productos a tu carrito</li>
        </ol>
        <button onclick="this.parentElement.parentElement.remove()" 
                style="
                  background: #a8d5ba; 
                  color: #2d4d3a; 
                  border: none; 
                  padding: 8px 16px; 
                  border-radius: 5px; 
                  margin-top: 10px; 
                  cursor: pointer;
                  font-weight: bold;
                ">
          Entendido
        </button>
      </div>
    `;
    document.body.appendChild(notification);
    
    // Auto-remove notification after 15 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.parentElement.removeChild(notification);
      }
    }, 15000);

    // Also try to open specific ingredient searches in background (commented out to avoid popup blocker)
    // keyIngredients.forEach((ingredient, index) => {
    //   setTimeout(() => {
    //     window.open(searchUrls[index], '_blank');
    //   }, (index + 1) * 2000);
    // });
  };

  return (
    <div className="min-h-screen">
      <section className="seccion">
        <img src="/logo.PNG" alt="TheCookFlow - Menú semanal personalizado generado con IA" className="logo" />
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => setLocation('/dashboard')}
            className="btn-chalk flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Dashboard
          </button>
          
          <h1 className="text-5xl text-chalk-white">
            Tu Menú Semanal Personalizado
          </h1>
          
          <div className="flex gap-2">
            <button className="btn-primary-chalk flex items-center gap-2">
              <Download className="w-5 h-5" />
              Descargar PDF
            </button>
            <button className="btn-chalk flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Compartir
            </button>
          </div>
        </div>

        {/* Menu Overview */}
        <div className="glass-container max-w-6xl mx-auto mb-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <Calendar className="w-8 h-8 text-chalk-green" />
              <div>
                <div className="text-2xl font-bold text-chalk-white">{daysOfWeek.length} días</div>
                <div className="text-chalk">{daysOfWeek.length === 5 ? 'Lunes a viernes' : 'Menú completo'}</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Users className="w-8 h-8 text-chalk-green" />
              <div>
                <div className="text-2xl font-bold text-chalk-white">{menuPlan?.preferences?.servings || 4} personas</div>
                <div className="text-chalk">Por comida</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <ShoppingCart className="w-8 h-8 text-chalk-green" />
              <div>
                <div className="text-2xl font-bold text-chalk-white">€{shoppingList?.totalEstimatedCost?.toFixed(2) || '0.00'}</div>
                <div className="text-chalk">Costo estimado</div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Menu Grid */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {daysOfWeek.map((day, dayIndex) => (
              <div key={day} className="min-h-[800px] px-4">
                <h3 className="text-3xl font-bold text-chalk-white mb-8 text-center font-handwritten">{day}</h3>
                <div className="space-y-6">
                  {Object.entries(mealTypes).map(([mealType, mealName], mealIndex) => {
                    const recipe = groupedRecipes[dayIndex]?.[mealType];
                    return (
                      <div key={mealType}>
                        {/* Separador de tiza entre comidas */}
                        {mealIndex > 0 && <div className="chalk-divider"></div>}
                        
                        <div className="py-4 chalk-decorative">
                          <div className="flex items-center gap-3 mb-4">
                            <Utensils className="w-6 h-6 text-chalk-green" />
                            <span className="text-xl font-bold text-chalk-green uppercase tracking-wide font-handwritten">{mealName}</span>
                          </div>
                          
                          {recipe ? (
                            <div>
                              <div className="mb-4">
                                <h4 className="font-bold text-chalk-white text-2xl mb-2 leading-tight font-handwritten">
                                  {recipe.name}
                                </h4>
                                <p className="text-lg text-chalk/90 leading-relaxed">
                                  {recipe.description}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-5 h-5 text-chalk-green" />
                                  <span className="text-lg text-chalk-white font-medium">{recipe.cookingTime} min</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="w-5 h-5 text-chalk-green" />
                                  <span className="text-lg text-chalk-white font-medium">{recipe.servings} pers.</span>
                                </div>
                              </div>
                              
                              <div className="flex gap-3">
                                <button
                                  onClick={() => openRecipeModal(recipe)}
                                  className="flex-1 bg-chalk-green hover:bg-chalk-green/80 text-white text-lg font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 font-handwritten"
                                  title="Ver receta completa"
                                >
                                  <Eye className="w-5 h-5" />
                                  Ver Receta
                                </button>
                                <button
                                  onClick={() => openRecipeModal(recipe)}
                                  className="bg-chalk/20 hover:bg-chalk/30 text-chalk-white text-lg font-bold py-3 px-4 rounded-lg transition-colors"
                                  title="Información nutricional"
                                >
                                  <Info className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-6">
                              <p className="text-lg text-chalk/60 italic">Sin receta disponible</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shopping List */}
        {shoppingList && (
          <div className="glass-container max-w-6xl mx-auto">
            <h2 className="text-3xl text-chalk-white mb-6 flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-chalk-green" />
              Lista de Compras Completa
            </h2>
            <p className="text-chalk mb-6">
              Todos los ingredientes de tu menú organizados por categorías con precios estimados.
              {questionnaireData.recognizedIngredients?.length > 0 && (
                <span className="block mt-2 text-chalk-green text-sm">
                  ✓ Los ingredientes detectados en tu foto se han marcado automáticamente
                </span>
              )}
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(Array.isArray(shoppingList?.items) ? shoppingList.items : shoppingList || [])?.map((category: any, index: number) => {
                const checkedCount = getCheckedCount(category.items || []);
                const totalItems = category.items?.length || 0;
                
                return (
                  <div key={index} className="border border-chalk-green/30 rounded-lg p-5 bg-chalk-green/5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-chalk-green flex items-center gap-2">
                        <div className="w-3 h-3 bg-chalk-green rounded-full"></div>
                        {category.category}
                      </h3>
                      <span className="text-chalk text-sm">
                        {checkedCount}/{totalItems}
                      </span>
                    </div>
                    
                    <ul className="space-y-2">
                      {category.items?.map((item: any, itemIndex: number) => {
                        const ingredientKey = `${item.name}-${item.amount}`;
                        const isChecked = checkedIngredients[ingredientKey] || false;
                        
                        return (
                          <li key={itemIndex} className={`bg-white/5 p-3 rounded-lg border transition-all ${
                            isChecked 
                              ? 'border-chalk-green/50 bg-chalk-green/10' 
                              : 'border-transparent hover:border-chalk-green/30'
                          }`}>
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => toggleIngredient(ingredientKey)}
                                className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
                                  isChecked
                                    ? 'bg-chalk-green border-chalk-green text-dark-green'
                                    : 'border-chalk-green/50 hover:border-chalk-green'
                                }`}
                                title={isChecked ? 'Desmarcar ingrediente' : 'Marcar como comprado/disponible'}
                                type="button"
                              >
                                {isChecked && <Check className="w-3 h-3" />}
                              </button>
                              
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div className={`transition-opacity ${isChecked ? 'opacity-60' : ''}`}>
                                    <span className={`text-chalk-white font-medium block ${
                                      isChecked ? 'line-through' : ''
                                    }`}>
                                      {item.name}
                                      {questionnaireData.recognizedIngredients?.some((recognized: string) => 
                                        item.name.toLowerCase().includes(recognized.toLowerCase()) ||
                                        recognized.toLowerCase().includes(item.name.toLowerCase())
                                      ) && (
                                        <span className="ml-2 text-xs bg-chalk-green/20 text-chalk-green px-2 py-0.5 rounded">
                                          Detectado en foto
                                        </span>
                                      )}
                                    </span>
                                    <span className="text-chalk/70 text-sm">
                                      Cantidad: {item.amount} {item.unit}
                                    </span>
                                  </div>
                                  <span className={`text-chalk-green font-bold ${
                                    isChecked ? 'opacity-60 line-through' : ''
                                  }`}>
                                    €{item.estimatedPrice?.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    
                    <div className="mt-4 pt-3 border-t border-chalk-green/20">
                      <div className="flex justify-between items-center">
                        <span className="text-chalk font-medium">Subtotal:</span>
                        <span className="text-chalk-green font-bold">
                          €{category.items?.reduce((sum: number, item: any) => sum + (item.estimatedPrice || 0), 0).toFixed(2)}
                        </span>
                      </div>
                      {checkedCount > 0 && (
                        <div className="flex justify-between items-center text-sm mt-1">
                          <span className="text-chalk/70">Marcados:</span>
                          <span className="text-chalk-green/70">
                            €{category.items?.reduce((sum: number, item: any) => {
                              const ingredientKey = `${item.name}-${item.amount}`;
                              return sum + (checkedIngredients[ingredientKey] ? (item.estimatedPrice || 0) : 0);
                            }, 0).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="bg-chalk-green/10 border border-chalk-green/30 rounded-lg p-6 mt-8">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex justify-between items-center text-xl mb-2">
                    <span className="text-chalk-white font-bold">Total Lista:</span>
                    <span className="text-chalk-green font-bold">
                      €{(() => {
                        if (!shoppingList) return '0.00';
                        const shoppingData = Array.isArray(shoppingList?.items) ? shoppingList.items : shoppingList || [];
                        const total = shoppingData.reduce((total: number, category: any) => 
                          total + (category.items?.reduce((sum: number, item: any) => sum + (item.estimatedPrice || 0), 0) || 0), 0
                        );
                        return total.toFixed(2);
                      })()}
                    </span>
                  </div>
                  <div className="text-sm text-chalk/70">
                    Total de ingredientes marcados: €{(() => {
                      if (!shoppingList) return '0.00';
                      const shoppingData = Array.isArray(shoppingList?.items) ? shoppingList.items : shoppingList || [];
                      const total = shoppingData.reduce((total: number, category: any) => 
                        total + (category.items?.reduce((sum: number, item: any) => {
                          const ingredientKey = `${item.name}-${item.amount}`;
                          return sum + (checkedIngredients[ingredientKey] ? (item.estimatedPrice || 0) : 0);
                        }, 0) || 0), 0
                      );
                      return total.toFixed(2);
                    })()}
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center text-xl mb-2">
                    <span className="text-chalk-white font-bold">Marcados:</span>
                    <span className="text-chalk-green font-bold">
                      €{(() => {
                        if (!shoppingList) return '0.00';
                        const shoppingData = Array.isArray(shoppingList?.items) ? shoppingList.items : shoppingList || [];
                        const total = shoppingData.reduce((total: number, category: any) => 
                          total + (category.items?.reduce((sum: number, item: any) => {
                            const ingredientKey = `${item.name}-${item.amount}`;
                            return sum + (checkedIngredients[ingredientKey] ? (item.estimatedPrice || 0) : 0);
                          }, 0) || 0), 0
                        );
                        return total.toFixed(2);
                      })()}
                    </span>
                  </div>
                  <div className="text-sm text-chalk/70">
                    {Object.values(checkedIngredients).filter(Boolean).length} ingredientes seleccionados
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => {
                    console.log('Desmarcando todos los ingredientes...');
                    setCheckedIngredients({});
                    localStorage.setItem('checkedIngredients', JSON.stringify({}));
                  }}
                  className="btn-chalk hover:bg-chalk-green/20 transition-colors"
                  disabled={Object.keys(checkedIngredients).length === 0}
                >
                  Desmarcar Todo
                </button>
                <button
                  onClick={() => {
                    console.log('Marcando todos los ingredientes...');
                    const allIngredients: Record<string, boolean> = {};
                    if (shoppingList) {
                      const shoppingData = Array.isArray(shoppingList?.items) ? shoppingList.items : shoppingList || [];
                      shoppingData.forEach((category: any) => {
                        category.items?.forEach((item: any) => {
                          const ingredientKey = `${item.name}-${item.amount}`;
                          allIngredients[ingredientKey] = true;
                        });
                      });
                      console.log('Ingredientes a marcar:', Object.keys(allIngredients).length);
                    }
                    setCheckedIngredients(allIngredients);
                    localStorage.setItem('checkedIngredients', JSON.stringify(allIngredients));
                  }}
                  className="btn-primary-chalk hover:bg-chalk-green transition-colors"
                  disabled={!shoppingList}
                >
                  Marcar Todo
                </button>
              </div>
              
              <button
                onClick={buyOnAmazonFresh}
                className="w-full btn-primary-chalk flex items-center justify-center gap-2"
              >
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Comprar en Amazon Fresh + Copiar Lista
                </>
              </button>
              
              <p className="text-chalk text-sm mt-4">
                Al hacer clic, se abrirá Amazon Fresh y tu lista de compras se copiará automáticamente al portapapeles. 
                Simplemente pega la lista (Ctrl+V) en Amazon para agregar todos los ingredientes a tu carrito.
                Al comprar a través de nuestro enlace, ayudas a mantener TheCookFlow gratuito.
              </p>
            </div>
            
            {/* Shopping banner ad for non-premium users (expert specification #3) */}
            <div id="shopping-list">
              <BannerShopping slotId="shopping-banner" />
            </div>
          </div>
        )}

        {/* Amazon Fresh Information */}
        <div className="glass-container max-w-6xl mx-auto mt-8">
          <h2 className="text-3xl text-chalk-white mb-6 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-chalk-green" />
            Amazon Fresh - Entrega Rápida
          </h2>
          <p className="text-chalk mb-6">
            Haz clic en "Comprar en Amazon Fresh + Copiar Lista" para abrir Amazon Fresh automáticamente. 
            Tu lista de ingredientes se copiará al portapapeles para que puedas agregarlos fácilmente a tu carrito.
            Tu compra a través de nuestro enlace de afiliado ayuda a mantener TheCookFlow gratuito.
          </p>
          
          <div className="bg-chalk-green/10 border border-chalk-green/30 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-chalk-green mb-4">Ventajas de Amazon Fresh</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-chalk-green/20 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-chalk-green" />
                </div>
                <div>
                  <h4 className="font-semibold text-chalk-white">Entrega Rápida</h4>
                  <p className="text-chalk text-sm">En 2-4 horas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-chalk-green/20 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-chalk-green" />
                </div>
                <div>
                  <h4 className="font-semibold text-chalk-white">Productos Frescos</h4>
                  <p className="text-chalk text-sm">Calidad garantizada</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-chalk-green/20 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-chalk-green" />
                </div>
                <div>
                  <h4 className="font-semibold text-chalk-white">Sin Mínimo</h4>
                  <p className="text-chalk text-sm">Para miembros Prime</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Banner ad for shopping list - shown to non-premium users */}
        {!isPremium && (
          <BannerBottom slotId="1234567891" className="mt-8" />
        )}

        {/* Action Buttons */}
        <div className="text-center mt-8 space-x-4">
          <button 
            onClick={() => setLocation('/menu-generator')}
            className="btn-chalk"
          >
            Generar Nuevo Menú
          </button>
          <button 
            onClick={() => setLocation('/dashboard')}
            className="btn-primary-chalk"
          >
            Guardar Menú
          </button>
        </div>
      </section>

      {/* Recipe Detail Modal */}
      {showRecipeModal && selectedRecipe && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="glass-container max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-chalk-white">{selectedRecipe.name}</h2>
              <button
                onClick={closeRecipeModal}
                className="p-2 rounded-lg hover:bg-chalk-green/20 transition-colors"
              >
                <X className="w-6 h-6 text-chalk" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-chalk-green mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Información
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-chalk">{selectedRecipe.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-chalk-green" />
                      <span className="text-chalk">{selectedRecipe.cookingTime} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-chalk-green" />
                      <span className="text-chalk">{selectedRecipe.servings} personas</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-chalk-green mb-3">Información Nutricional</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-chalk-green/10 p-2 rounded">
                    <span className="text-chalk">Calorías</span>
                    <div className="font-semibold text-chalk-white">{selectedRecipe.nutritionInfo?.calories || 0}</div>
                  </div>
                  <div className="bg-chalk-green/10 p-2 rounded">
                    <span className="text-chalk">Proteínas</span>
                    <div className="font-semibold text-chalk-white">{selectedRecipe.nutritionInfo?.protein || 0}g</div>
                  </div>
                  <div className="bg-chalk-green/10 p-2 rounded">
                    <span className="text-chalk">Carbohidratos</span>
                    <div className="font-semibold text-chalk-white">{selectedRecipe.nutritionInfo?.carbs || 0}g</div>
                  </div>
                  <div className="bg-chalk-green/10 p-2 rounded">
                    <span className="text-chalk">Grasas</span>
                    <div className="font-semibold text-chalk-white">{selectedRecipe.nutritionInfo?.fat || 0}g</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-chalk-green mb-3">Ingredientes</h3>
                <ul className="space-y-2">
                  {selectedRecipe.ingredients?.map((ingredient: any, index: number) => (
                    <li key={index} className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-chalk-green rounded-full"></div>
                      <span className="text-chalk">
                        {ingredient.amount} {ingredient.unit} de {ingredient.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-chalk-green mb-3">Instrucciones</h3>
                <ol className="space-y-3">
                  {selectedRecipe.instructions?.map((instruction: string, index: number) => (
                    <li key={index} className="flex gap-3 text-sm">
                      <span className="bg-chalk-green text-dark-green w-6 h-6 rounded-full flex items-center justify-center font-semibold text-xs">
                        {index + 1}
                      </span>
                      <span className="text-chalk">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-chalk-green/30">
              <button
                onClick={closeRecipeModal}
                className="btn-primary-chalk w-full"
              >
                Cerrar Receta
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Interstitial ad after menu generation */}
      <InterstitialAd 
        isVisible={interstitialVisible}
        onClose={closeInterstitial}
        slotId="post-menu-interstitial"
      />
    </div>
  );
}

