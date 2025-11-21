import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Eye, TestTube, Camera, ShoppingCart, MapPin, Euro } from 'lucide-react';

export default function TourShoppingList() {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const shoppingList = {
    name: "Lista Semanal Mediterránea",
    totalItems: 24,
    estimatedCost: 52.30,
    estimatedSavings: 8.40,
    categories: [
      {
        name: "Carnes y Pescados",
        icon: "🥩",
        items: [
          { id: "pollo", name: "Pollo troceado", quantity: "1kg", price: 6.50, unit: "kg", store: "Mercadona" },
          { id: "salmon", name: "Salmón fresco", quantity: "400g", price: 12.80, unit: "kg", store: "Carrefour" },
          { id: "jamon", name: "Jamón serrano", quantity: "100g", price: 3.20, unit: "kg", store: "Mercadona" }
        ]
      },
      {
        name: "Verduras y Frutas",
        icon: "🥬",
        items: [
          { id: "tomates", name: "Tomates", quantity: "1kg", price: 2.30, unit: "kg", store: "Lidl" },
          { id: "judias", name: "Judías verdes", quantity: "500g", price: 3.20, unit: "kg", store: "Mercadona" },
          { id: "pimientos", name: "Pimientos rojos", quantity: "3 unidades", price: 1.80, unit: "kg", store: "Lidl" },
          { id: "platanos", name: "Plátanos", quantity: "1kg", price: 1.50, unit: "kg", store: "Mercadona" },
          { id: "aguacates", name: "Aguacates", quantity: "2 unidades", price: 2.40, unit: "unidad", store: "Carrefour" }
        ]
      },
      {
        name: "Despensa",
        icon: "🏺",
        items: [
          { id: "arroz", name: "Arroz bomba", quantity: "1kg", price: 4.50, unit: "kg", store: "Mercadona" },
          { id: "aceite", name: "Aceite oliva virgen", quantity: "500ml", price: 6.80, unit: "l", store: "Lidl" },
          { id: "azafran", name: "Azafrán", quantity: "1g", price: 2.90, unit: "g", store: "Mercadona" },
          { id: "pasta", name: "Pasta", quantity: "500g", price: 1.20, unit: "kg", store: "Lidl" },
          { id: "yogur", name: "Yogur griego", quantity: "4 unidades", price: 3.60, unit: "pack", store: "Carrefour" }
        ]
      },
      {
        name: "Lácteos y Huevos",
        icon: "🥛",
        items: [
          { id: "huevos", name: "Huevos", quantity: "12 unidades", price: 2.80, unit: "docena", store: "Mercadona" },
          { id: "queso", name: "Queso parmesano", quantity: "200g", price: 4.50, unit: "kg", store: "Carrefour" },
          { id: "leche", name: "Leche entera", quantity: "1L", price: 1.10, unit: "l", store: "Lidl" }
        ]
      }
    ]
  };

  const toggleItem = (itemId: string) => {
    setCheckedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getCompletionStats = () => {
    const totalItems = shoppingList.categories.reduce((sum, cat) => sum + cat.items.length, 0);
    const completedItems = checkedItems.length;
    const percentage = Math.round((completedItems / totalItems) * 100);
    return { total: totalItems, completed: completedItems, percentage };
  };

  const stats = getCompletionStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-green via-black to-dark-green text-chalk-white">
      <head>
        <meta name="robots" content="noindex,nofollow" />
        <title>Tour Demo - Lista de Compra | TheCookFlow</title>
      </head>
      
      {/* Demo Banner */}
      <div className="bg-yellow-600/20 border-b border-yellow-500/30 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold text-yellow-400">Vista Demo (Read-Only)</span>
            <Badge variant="outline" className="border-yellow-500 text-yellow-400">
              TOUR 4/5
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
          <div className="text-center mb-8">
            <h1 className="text-4xl font-handwritten text-chalk-green mb-4">
              🛒 {shoppingList.name}
            </h1>
            
            <div className="flex justify-center items-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400">{shoppingList.totalItems} productos</span>
              </div>
              <div className="flex items-center space-x-2">
                <Euro className="w-5 h-5 text-green-400" />
                <span className="text-green-400">€{shoppingList.estimatedCost.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-purple-400" />
                <span className="text-purple-400">3 tiendas optimizadas</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-chalk/70">Progreso de compra</span>
                <span className="text-sm font-semibold text-chalk-green">{stats.completed}/{stats.total} ({stats.percentage}%)</span>
              </div>
              <div className="w-full bg-dark-green/30 rounded-full h-3">
                <div 
                  className="bg-chalk-green h-3 rounded-full transition-all duration-300"
                  style={{ width: `${stats.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Savings Alert */}
          <Card className="bg-green-900/20 border-green-400/30 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">💰</div>
                  <div>
                    <div className="font-semibold text-green-400">Ahorro detectado</div>
                    <div className="text-sm text-chalk/70">Modo Ahorro activado automáticamente</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">€{shoppingList.estimatedSavings.toFixed(2)}</div>
                  <div className="text-sm text-chalk/70">ahorrado esta semana</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shopping Categories */}
          <div className="space-y-6">
            {shoppingList.categories.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="bg-dark-green/20 border-chalk-green/30">
                <CardHeader className="pb-4">
                  <CardTitle className="text-chalk-green text-xl flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <span className="text-2xl">{category.icon}</span>
                      <span>{category.name}</span>
                    </span>
                    <Badge variant="outline" className="border-chalk-green text-chalk-green">
                      {category.items.length} productos
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <div 
                        key={item.id} 
                        className={`flex items-center justify-between p-3 rounded border transition-all ${
                          checkedItems.includes(item.id) 
                            ? 'bg-green-900/20 border-green-400/30' 
                            : 'bg-black/20 border-chalk-green/20 hover:border-chalk-green/40'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={checkedItems.includes(item.id)}
                            onCheckedChange={() => toggleItem(item.id)}
                            className="border-chalk-green data-[state=checked]:bg-chalk-green data-[state=checked]:border-chalk-green"
                          />
                          <div className={checkedItems.includes(item.id) ? 'line-through text-chalk/50' : ''}>
                            <div className="font-semibold text-chalk-white">{item.name}</div>
                            <div className="text-sm text-chalk/60">{item.quantity}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${checkedItems.includes(item.id) ? 'text-chalk/50 line-through' : 'text-chalk-green'}`}>
                            €{item.price.toFixed(2)}
                          </div>
                          <div className="text-xs text-chalk/50">{item.store}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Amazon Fresh Integration */}
          <Card className="bg-orange-900/20 border-orange-400/30 mt-6 mb-8">
            <CardHeader>
              <CardTitle className="text-orange-400 text-lg flex items-center">
                📦 Amazon Fresh Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-chalk/80 mb-2">
                    Compra directamente desde la app con entrega en 2 horas
                  </p>
                  <div className="flex space-x-4 text-sm">
                    <span className="text-green-400">✓ Entrega gratuita &gt;€35</span>
                    <span className="text-blue-400">✓ Precios actualizados</span>
                    <span className="text-purple-400">✓ Código: THECOOKFLOW-21</span>
                  </div>
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  Comprar en Amazon
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Button 
              variant="outline"
              className="border-chalk-green text-chalk-green hover:bg-chalk-green/10"
            >
              📱 Compartir Lista
            </Button>
            <Button 
              variant="outline"
              className="border-chalk-green text-chalk-green hover:bg-chalk-green/10"
            >
              🗺️ Optimizar Ruta
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => window.open('/tour/5-paywall', '_blank')}
            >
              ⭐ Ir a Premium
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost"
              onClick={() => window.open('/tour/3-recipe', '_blank')}
              className="text-chalk/60 hover:text-chalk-white"
            >
              ← Volver a Receta
            </Button>
            
            <Button 
              onClick={() => window.open('/tour/5-paywall', '_blank')}
              className="bg-chalk-green text-dark-green hover:bg-chalk-green/90"
            >
              Ver Premium Features
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
                onClick={() => window.open('/tour/3-recipe', '_blank')}
                className="border-chalk-green text-chalk-green hover:bg-chalk-green/10"
              >
                3. Receta
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-yellow-500 text-yellow-400 bg-yellow-500/10"
                disabled
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