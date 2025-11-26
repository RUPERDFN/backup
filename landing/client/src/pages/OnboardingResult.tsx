import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChefHat, 
  Save, 
  Share2, 
  ShoppingCart, 
  Clock, 
  Users, 
  Euro,
  RefreshCw,
  DollarSign,
  Utensils
} from 'lucide-react';

interface QuickActions {
  changeRecipe: boolean;
  changeBudget: boolean;
  addLeftovers: boolean;
}

export default function OnboardingResult() {
  const [, setLocation] = useLocation();
  const [menuData, setMenuData] = useState<any>(null);
  const [generationTime, setGenerationTime] = useState<number>(0);
  const [quickActions, setQuickActions] = useState<QuickActions>({
    changeRecipe: false,
    changeBudget: false,
    addLeftovers: false
  });
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    // Load initial menu data
    const storedMenu = localStorage.getItem('initialMenu');
    const storedTime = localStorage.getItem('generationTime');
    
    if (storedMenu) {
      setMenuData(JSON.parse(storedMenu));
    }
    
    if (storedTime) {
      setGenerationTime(parseInt(storedTime));
    }
  }, []);

  const handleSaveAndCreateAccount = () => {
    // Trigger Google OAuth and account creation
    window.location.href = '/api/login?ref=onboarding';
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Mi Menú Semanal - TheCookFlow',
      text: `¡Mira mi menú semanal generado por IA! 🍽️`,
      url: window.location.origin + `/m/${menuData?.shareId || 'demo'}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(shareData.url);
      alert('Enlace copiado al portapapeles');
    }
  };

  const handleShoppingList = () => {
    setLocation('/shopping-list');
  };

  const handleQuickRegenerate = async (action: keyof QuickActions) => {
    setIsRegenerating(true);
    setQuickActions(prev => ({...prev, [action]: true}));

    try {
      const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
      
      const response = await fetch('/api/plan/quick-regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...onboardingData,
          action,
          currentMenu: menuData
        })
      });

      if (response.ok) {
        const newMenu = await response.json();
        setMenuData(newMenu);
        localStorage.setItem('initialMenu', JSON.stringify(newMenu));
      }
    } catch (error) {
      console.error('Error regenerating:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  if (!menuData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-green via-black to-dark-green flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="animate-spin mx-auto mb-4 text-chalk-green" size={48} />
          <p className="text-chalk">Generando tu menú...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-green via-black to-dark-green p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with performance metrics */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ChefHat className="w-8 h-8 text-chalk-green" />
            <h1 className="text-3xl font-bold text-chalk-white">¡Tu Menú Está Listo!</h1>
          </div>
          <Badge variant="secondary" className="bg-chalk-green/20 text-chalk-green">
            <Clock className="w-4 h-4 mr-1" />
            Generado en {(generationTime / 1000).toFixed(1)}s
          </Badge>
        </div>

        {/* Main CTAs */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Button
            onClick={handleSaveAndCreateAccount}
            className="bg-chalk-green text-dark-green hover:bg-chalk-green/80 h-16 text-lg"
          >
            <Save className="w-5 h-5 mr-2" />
            Guardar → Crear Cuenta
          </Button>
          
          <Button
            onClick={handleShare}
            variant="outline"
            className="border-chalk-green/30 text-chalk hover:bg-chalk-green/20 h-16 text-lg"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Compartir
          </Button>
          
          <Button
            onClick={handleShoppingList}
            variant="outline"
            className="border-chalk-green/30 text-chalk hover:bg-chalk-green/20 h-16 text-lg"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Lista de Compra
          </Button>
        </div>

        {/* Menu Preview */}
        <Card className="glass-container border-chalk-green/30 mb-6">
          <CardHeader>
            <CardTitle className="text-chalk-white flex items-center gap-2">
              <Utensils className="w-5 h-5" />
              Tu Menú Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuData.meals?.slice(0, 6).map((meal: any, index: number) => (
                <div key={index} className="bg-black/20 rounded-lg p-4 border border-chalk-green/20">
                  <h3 className="font-semibold text-chalk-white mb-2">{meal.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-chalk/60">
                    <Clock className="w-4 h-4" />
                    <span>{meal.cookingTime}min</span>
                    <Users className="w-4 h-4 ml-2" />
                    <span>{meal.servings}p</span>
                  </div>
                </div>
              ))}
            </div>
            
            {menuData.estimatedCost && (
              <div className="mt-4 p-3 bg-chalk-green/10 rounded-lg border border-chalk-green/30">
                <div className="flex items-center justify-between">
                  <span className="text-chalk">Coste estimado semanal:</span>
                  <span className="text-chalk-green font-bold text-lg">
                    <Euro className="w-4 h-4 inline" />
                    {menuData.estimatedCost}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions (Persistent) */}
        <Card className="glass-container border-chalk-green/30">
          <CardHeader>
            <CardTitle className="text-chalk-white">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button
                onClick={() => handleQuickRegenerate('changeRecipe')}
                disabled={isRegenerating}
                variant="outline"
                className="border-chalk-green/30 text-chalk hover:bg-chalk-green/20 h-12"
              >
                {isRegenerating && quickActions.changeRecipe ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Cambiar Receta
              </Button>
              
              <Button
                onClick={() => handleQuickRegenerate('changeBudget')}
                disabled={isRegenerating}
                variant="outline"
                className="border-chalk-green/30 text-chalk hover:bg-chalk-green/20 h-12"
              >
                {isRegenerating && quickActions.changeBudget ? (
                  <DollarSign className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <DollarSign className="w-4 h-4 mr-2" />
                )}
                Cambiar Presupuesto
              </Button>
              
              <Button
                onClick={() => handleQuickRegenerate('addLeftovers')}
                disabled={isRegenerating}
                variant="outline"
                className="border-chalk-green/30 text-chalk hover:bg-chalk-green/20 h-12"
              >
                {isRegenerating && quickActions.addLeftovers ? (
                  <Utensils className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Utensils className="w-4 h-4 mr-2" />
                )}
                Añadir Leftovers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}