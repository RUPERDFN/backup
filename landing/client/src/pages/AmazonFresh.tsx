import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ExternalLink, Clock, MapPin, Package } from 'lucide-react';

interface AmazonProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  brand?: string;
  rating?: number;
  availability: 'in-stock' | 'limited' | 'out-of-stock';
  deliveryTime: string;
  category: string;
}

export default function AmazonFresh() {
  const [selectedProducts, setSelectedProducts] = useState<AmazonProduct[]>([]);

  // Demo products for Amazon Fresh integration
  const demoProducts: AmazonProduct[] = [
    {
      id: 'af-001',
      name: 'Tomates Cherry Ecológicos 250g',
      price: 2.85,
      image: '/api/placeholder/150/150',
      brand: 'Bio Fresh',
      rating: 4.5,
      availability: 'in-stock',
      deliveryTime: '1-2 horas',
      category: 'Verduras'
    },
    {
      id: 'af-002', 
      name: 'Pechuga de Pollo Fresh 500g',
      price: 4.99,
      image: '/api/placeholder/150/150',
      brand: 'Amazon Fresh',
      rating: 4.7,
      availability: 'in-stock',
      deliveryTime: '1-2 horas',
      category: 'Carnes'
    },
    {
      id: 'af-003',
      name: 'Aceite Oliva Virgen Extra 500ml',
      price: 5.45,
      image: '/api/placeholder/150/150',
      brand: 'Olivar Premium',
      rating: 4.8,
      availability: 'limited',
      deliveryTime: '2-3 horas',
      category: 'Aceites'
    },
    {
      id: 'af-004',
      name: 'Arroz Bomba 1kg',
      price: 3.20,
      image: '/api/placeholder/150/150',
      brand: 'Valencia Rice',
      rating: 4.6,
      availability: 'in-stock',
      deliveryTime: '1-2 horas',
      category: 'Cereales'
    },
    {
      id: 'af-005',
      name: 'Queso Manchego Curado 200g',
      price: 8.90,
      image: '/api/placeholder/150/150',
      brand: 'La Mancha',
      rating: 4.9,
      availability: 'in-stock',
      deliveryTime: '1-2 horas',
      category: 'Lácteos'
    },
    {
      id: 'af-006',
      name: 'Salmón Noruego Fresco 400g',
      price: 12.50,
      image: '/api/placeholder/150/150',
      brand: 'Nordic Fish',
      rating: 4.4,
      availability: 'limited',
      deliveryTime: '2-3 horas',
      category: 'Pescados'
    }
  ];

  const addToCart = (product: AmazonProduct) => {
    setSelectedProducts(prev => [...prev, product]);
  };

  const removeFromCart = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const getTotalPrice = () => {
    return selectedProducts.reduce((total, product) => total + product.price, 0);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in-stock': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'limited': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'out-of-stock': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'in-stock': return 'En stock';
      case 'limited': return 'Stock limitado';
      case 'out-of-stock': return 'Sin stock';
      default: return 'Desconocido';
    }
  };

  const openAmazonFresh = () => {
    // This would redirect to Amazon Fresh with affiliate code
    const amazonUrl = `https://www.amazon.es/fresh?tag=thecookflow-21`;
    window.open(amazonUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-green via-black to-dark-green p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="w-10 h-10 text-chalk-green" />
            <h1 className="text-4xl font-bold text-chalk-white">Amazon Fresh</h1>
          </div>
          <p className="text-chalk/70 text-lg">
            Compra tus ingredientes directamente y recíbelos en 1-2 horas
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <MapPin className="w-4 h-4 text-chalk-green" />
            <span className="text-chalk/60">Madrid, Barcelona, Valencia disponibles</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Products Grid */}
          <div className="lg:col-span-2">
            <Card className="glass-container border-chalk-green/30 mb-6">
              <CardHeader>
                <CardTitle className="text-chalk-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Productos Recomendados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {demoProducts.map((product) => (
                    <div
                      key={product.id}
                      className="p-4 bg-black/20 rounded-lg border border-chalk-green/20"
                    >
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-chalk-green/10 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-chalk-green" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-chalk-white text-sm mb-1">
                            {product.name}
                          </h3>
                          <div className="text-xs text-chalk/60 mb-2">
                            {product.brand} • {product.category}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold text-chalk-green">
                              €{product.price.toFixed(2)}
                            </div>
                            <Badge className={`${getAvailabilityColor(product.availability)} border text-xs`}>
                              {getAvailabilityText(product.availability)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-chalk/60 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{product.deliveryTime}</span>
                          </div>
                          <Button
                            onClick={() => addToCart(product)}
                            disabled={product.availability === 'out-of-stock'}
                            className="w-full mt-2 bg-chalk-green text-dark-green hover:bg-chalk-green/80 text-xs py-1"
                            size="sm"
                          >
                            Añadir al carrito
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shopping Cart */}
          <div className="lg:col-span-1">
            <Card className="glass-container border-chalk-green/30 sticky top-4">
              <CardHeader>
                <CardTitle className="text-chalk-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Tu Carrito ({selectedProducts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-chalk/30 mx-auto mb-4" />
                    <p className="text-chalk/60">Tu carrito está vacío</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedProducts.map((product, index) => (
                      <div
                        key={`${product.id}-${index}`}
                        className="flex items-center justify-between p-2 bg-black/20 rounded border border-chalk-green/20"
                      >
                        <div className="flex-1">
                          <div className="text-sm font-medium text-chalk-white">
                            {product.name}
                          </div>
                          <div className="text-xs text-chalk/60">{product.brand}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-chalk-green">
                            €{product.price.toFixed(2)}
                          </div>
                          <Button
                            onClick={() => removeFromCart(product.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 text-xs p-1"
                          >
                            Quitar
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="border-t border-chalk-green/30 pt-3 mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-chalk font-medium">Total:</span>
                        <span className="text-xl font-bold text-chalk-green">
                          €{getTotalPrice().toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-xs text-chalk/60 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Entrega en 1-2 horas
                        </div>
                        <div className="text-xs text-chalk/60">
                          Envío gratis en pedidos &gt;€35
                        </div>
                      </div>

                      <Button
                        onClick={openAmazonFresh}
                        className="w-full mt-4 bg-chalk-green text-dark-green hover:bg-chalk-green/80"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Comprar en Amazon Fresh
                      </Button>
                      
                      <div className="text-xs text-chalk/60 text-center mt-2">
                        Código afiliado: thecookflow-21
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Card className="glass-container border-chalk-green/30">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-chalk-green mx-auto mb-2" />
              <h3 className="font-bold text-chalk-white mb-1">Entrega Rápida</h3>
              <p className="text-xs text-chalk/60">Recibe tu compra en 1-2 horas</p>
            </CardContent>
          </Card>
          
          <Card className="glass-container border-chalk-green/30">
            <CardContent className="p-4 text-center">
              <Package className="w-8 h-8 text-chalk-green mx-auto mb-2" />
              <h3 className="font-bold text-chalk-white mb-1">Productos Frescos</h3>
              <p className="text-xs text-chalk/60">Calidad garantizada</p>
            </CardContent>
          </Card>
          
          <Card className="glass-container border-chalk-green/30">
            <CardContent className="p-4 text-center">
              <MapPin className="w-8 h-8 text-chalk-green mx-auto mb-2" />
              <h3 className="font-bold text-chalk-white mb-1">Seguimiento</h3>
              <p className="text-xs text-chalk/60">Rastrea tu pedido en tiempo real</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}