import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, ArrowLeft, Eye, ShoppingCart, CheckCircle, DollarSign, Package, Smartphone } from 'lucide-react';

export default function TourShoppingList() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const shoppingList = {
    totalItems: 24,
    totalCost: 58.50,
    estimatedTime: 45,
    stores: 2,
    categories: [
      {
        name: 'Carnes y Pescados',
        icon: '🥩',
        items: [
          { id: 'meat-1', name: 'Pollo troceado', amount: '800g', price: 5.60, store: 'Mercadona' },
          { id: 'meat-2', name: 'Pescado blanco', amount: '400g', price: 9.20, store: 'Pescadería' },
          { id: 'meat-3', name: 'Chorizo', amount: '150g', price: 2.80, store: 'Mercadona' }
        ]
      },
      {
        name: 'Verduras y Hortalizas',
        icon: '🥕',
        items: [
          { id: 'veg-1', name: 'Tomates', amount: '1kg', price: 1.80, store: 'Mercadona' },
          { id: 'veg-2', name: 'Cebolla', amount: '500g', price: 0.90, store: 'Mercadona' },
          { id: 'veg-3', name: 'Pimiento rojo', amount: '3 unidades', price: 1.50, store: 'Mercadona' },
          { id: 'veg-4', name: 'Judías verdes', amount: '300g', price: 1.80, store: 'Mercadona' },
          { id: 'veg-5', name: 'Calabaza', amount: '800g', price: 2.40, store: 'Mercadona' }
        ]
      },
      {
        name: 'Cereales y Legumbres',
        icon: '🌾',
        items: [
          { id: 'grain-1', name: 'Arroz bomba', amount: '500g', price: 3.20, store: 'Mercadona' },
          { id: 'grain-2', name: 'Pasta', amount: '500g', price: 1.40, store: 'Mercadona' },
          { id: 'grain-3', name: 'Lentejas', amount: '400g', price: 1.80, store: 'Mercadona' },
          { id: 'grain-4', name: 'Garrofón', amount: '200g', price: 1.80, store: 'Mercadona' }
        ]
      },
      {
        name: 'Lácteos y Huevos',
        icon: '🥛',
        items: [
          { id: 'dairy-1', name: 'Huevos', amount: '12 unidades', price: 2.50, store: 'Mercadona' },
          { id: 'dairy-2', name: 'Leche', amount: '1L', price: 1.20, store: 'Mercadona' },
          { id: 'dairy-3', name: 'Queso manchego', amount: '200g', price: 4.80, store: 'Mercadona' }
        ]
      },
      {
        name: 'Aceites y Condimentos',
        icon: '🫒',
        items: [
          { id: 'oil-1', name: 'Aceite oliva virgen extra', amount: '500ml', price: 5.40, store: 'Mercadona' },
          { id: 'oil-2', name: 'Azafrán', amount: '1g', price: 3.00, store: 'Mercadona' },
          { id: 'oil-3', name: 'Sal marina', amount: '1kg', price: 0.80, store: 'Mercadona' },
          { id: 'oil-4', name: 'Vinagre de Jerez', amount: '250ml', price: 2.50, store: 'Mercadona' }
        ]
      },
      {
        name: 'Otros',
        icon: '🛒',
        items: [
          { id: 'other-1', name: 'Pan del día anterior', amount: '1 barra', price: 0.90, store: 'Panadería' },
          { id: 'other-2', name: 'Ajo', amount: '1 ristra', price: 1.20, store: 'Mercadona' }
        ]
      }
    ]
  };

  const toggleItem = (itemId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
  };

  const getTotalCheckedPrice = () => {
    let total = 0;
    shoppingList.categories.forEach(category => {
      category.items.forEach(item => {
        if (checkedItems.has(item.id)) {
          total += item.price;
        }
      });
    });
    return total;
  };

  const getTotalItems = () => {
    return shoppingList.categories.reduce((total, category) => total + category.items.length, 0);
  };

  const getCheckedCount = () => checkedItems.size;

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
            <ShoppingCart className="w-10 h-10 text-chalk-green" />
            <h1 className="text-4xl font-bold text-chalk-white">Tour 4: Lista de Compra</h1>
          </div>
          <p className="text-chalk/70 text-lg">
            Lista organizada por categorías con precios y optimización de rutas
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Shopping List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Summary */}
            <Card className="glass-container border-chalk-green/30">
              <CardContent className="p-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-black/20 rounded-lg border border-chalk-green/20">
                    <div className="text-2xl font-bold text-chalk-green">{getCheckedCount()}/{getTotalItems()}</div>
                    <div className="text-chalk/60 text-sm">Completado</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-lg border border-chalk-green/20">
                    <div className="text-2xl font-bold text-chalk-green">€{getTotalCheckedPrice().toFixed(2)}</div>
                    <div className="text-chalk/60 text-sm">Gastado</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-lg border border-chalk-green/20">
                    <div className="text-2xl font-bold text-chalk-green">{shoppingList.estimatedTime}</div>
                    <div className="text-chalk/60 text-sm">Minutos</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-lg border border-chalk-green/20">
                    <div className="text-2xl font-bold text-chalk-green">{shoppingList.stores}</div>
                    <div className="text-chalk/60 text-sm">Tiendas</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            {shoppingList.categories.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="glass-container border-chalk-green/30">
                <CardHeader>
                  <CardTitle className="text-chalk-white flex items-center gap-2">
                    <span className="text-2xl">{category.icon}</span>
                    {category.name}
                    <Badge className="bg-chalk-green/20 text-chalk-green border-chalk-green/30 ml-auto">
                      {category.items.length} items
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-chalk-green/20">
                        <Checkbox
                          checked={checkedItems.has(item.id)}
                          onCheckedChange={() => toggleItem(item.id)}
                          className="border-chalk-green/30 data-[state=checked]:bg-chalk-green data-[state=checked]:border-chalk-green"
                        />
                        <div className="flex-1">
                          <div className={`font-medium ${checkedItems.has(item.id) ? 'line-through text-chalk/50' : 'text-chalk-white'}`}>
                            {item.name}
                          </div>
                          <div className="text-chalk/60 text-sm flex items-center gap-2">
                            <span>{item.amount}</span>
                            <span>•</span>
                            <span>{item.store}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${checkedItems.has(item.id) ? 'line-through text-chalk/50' : 'text-chalk-green'}`}>
                            €{item.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Total & Progress */}
            <Card className="glass-container border-chalk-green/30">
              <CardHeader>
                <CardTitle className="text-chalk-white">Resumen Total</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-chalk-green mb-2">
                    €{shoppingList.totalCost.toFixed(2)}
                  </div>
                  <div className="text-chalk/60">Presupuesto semanal</div>
                  
                  <div className="mt-4 w-full bg-black/20 rounded-full h-2">
                    <div 
                      className="bg-chalk-green h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(getTotalCheckedPrice() / shoppingList.totalCost) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-chalk/60 mt-2">
                    {Math.round((getTotalCheckedPrice() / shoppingList.totalCost) * 100)}% completado
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-chalk/70">Restante:</span>
                    <span className="text-chalk-white">€{(shoppingList.totalCost - getTotalCheckedPrice()).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-chalk/70">Items restantes:</span>
                    <span className="text-chalk-white">{getTotalItems() - getCheckedCount()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shopping Route */}
            <Card className="glass-container border-chalk-green/30">
              <CardHeader>
                <CardTitle className="text-chalk-white">Ruta Optimizada</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-chalk-green/20">
                  <div className="w-8 h-8 bg-chalk-green rounded-full flex items-center justify-center">
                    <span className="text-dark-green font-bold text-sm">1</span>
                  </div>
                  <div>
                    <div className="font-medium text-chalk-white">Mercadona</div>
                    <div className="text-chalk/60 text-sm">20 items • €45.90</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-chalk-green/20">
                  <div className="w-8 h-8 bg-chalk-green rounded-full flex items-center justify-center">
                    <span className="text-dark-green font-bold text-sm">2</span>
                  </div>
                  <div>
                    <div className="font-medium text-chalk-white">Pescadería</div>
                    <div className="text-chalk/60 text-sm">1 item • €9.20</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-chalk-green/20">
                  <div className="w-8 h-8 bg-chalk-green rounded-full flex items-center justify-center">
                    <span className="text-dark-green font-bold text-sm">3</span>
                  </div>
                  <div>
                    <div className="font-medium text-chalk-white">Panadería</div>
                    <div className="text-chalk/60 text-sm">1 item • €0.90</div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <div className="text-chalk/60 text-sm">Tiempo estimado total</div>
                  <div className="font-bold text-chalk-green">{shoppingList.estimatedTime} minutos</div>
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
                  <Smartphone className="w-4 h-4 mr-2" />
                  Abrir en Móvil
                </Button>
                <Button variant="outline" className="w-full text-chalk border-chalk-green/30 hover:bg-chalk-green/20">
                  <Package className="w-4 h-4 mr-2" />
                  Amazon Fresh
                </Button>
                <Button variant="outline" className="w-full text-chalk border-chalk-green/30 hover:bg-chalk-green/20">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Comparar Precios
                </Button>
                <Button variant="outline" className="w-full text-chalk border-chalk-green/30 hover:bg-chalk-green/20">
                  Compartir Lista
                </Button>
              </CardContent>
            </Card>

            {/* Smart Features */}
            <Card className="glass-container border-chalk-green/30">
              <CardHeader>
                <CardTitle className="text-chalk-white">Características Inteligentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-chalk/70">Ruta optimizada por distancia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-chalk/70">Precios actualizados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-chalk/70">Agrupado por categorías</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-chalk/70">Cantidades exactas calculadas</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            onClick={() => window.open('/tour/3-recipe', '_blank')}
            variant="outline"
            className="text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior: Detalle Receta
          </Button>
          
          <Button
            onClick={() => window.open('/tour/5-paywall', '_blank')}
            className="bg-chalk-green text-dark-green hover:bg-chalk-green/80"
          >
            Siguiente: Suscripción Premium
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Tour Navigation */}
        <div className="mt-8 text-center">
          <div className="flex justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-chalk/30 rounded-full"></div>
            <div className="w-3 h-3 bg-chalk/30 rounded-full"></div>
            <div className="w-3 h-3 bg-chalk/30 rounded-full"></div>
            <div className="w-3 h-3 bg-chalk-green rounded-full"></div>
            <div className="w-3 h-3 bg-chalk/30 rounded-full"></div>
          </div>
          <div className="text-xs text-chalk/60">
            Tour 4 de 5: Lista de Compra Inteligente
          </div>
        </div>
      </div>
    </div>
  );
}