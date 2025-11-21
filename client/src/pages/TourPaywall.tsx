import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, TestTube, Camera, Crown, Check, Zap, Gift } from 'lucide-react';

export default function TourPaywall() {
  const premiumFeatures = [
    { name: "Menús ilimitados", description: "Genera tantos menús como quieras", icon: "🍽️" },
    { name: "5 menús por semana", description: "vs 3 menús en versión gratuita", icon: "📅" },
    { name: "Todas las dietas", description: "Keto, paleo, vegana, sin gluten...", icon: "🥗" },
    { name: "Vision Nevera 2.0", description: "Análisis IA de ingredientes", icon: "📱" },
    { name: "Modo Ahorro PRO", description: "Optimización avanzada de costes", icon: "💰" },
    { name: "Sin anuncios", description: "Experiencia limpia y rápida", icon: "🚫" },
    { name: "Packs Premium", description: "Batch Cooking, Express, Vegetariano PRO", icon: "📦" },
    { name: "Sync calendario", description: "Google Calendar automático", icon: "📊" },
    { name: "Compartir avanzado", description: "Enlaces personalizados", icon: "🔗" },
    { name: "Soporte prioritario", description: "Respuesta en menos de 24h", icon: "⚡" }
  ];

  const pricingPlans = [
    {
      name: "Gratuito",
      price: "€0",
      period: "siempre",
      features: ["3 menús/semana", "Dieta normal", "Con anuncios", "Soporte básico"],
      limitations: true,
      current: true
    },
    {
      name: "Premium",
      price: "€1.99",
      period: "/mes",
      originalPrice: "€4.99",
      discount: "60% OFF",
      features: ["Menús ilimitados", "Todas las dietas", "Sin anuncios", "Vision Nevera 2.0", "Modo Ahorro PRO", "Packs Premium"],
      popular: true,
      trial: "7 días gratis"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-green via-black to-dark-green text-chalk-white">
      <head>
        <meta name="robots" content="noindex,nofollow" />
        <title>Tour Demo - Premium | TheCookFlow</title>
      </head>
      
      {/* Demo Banner */}
      <div className="bg-yellow-600/20 border-b border-yellow-500/30 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold text-yellow-400">Vista Demo (Read-Only)</span>
            <Badge variant="outline" className="border-yellow-500 text-yellow-400">
              TOUR 5/5
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <Crown className="w-10 h-10 text-yellow-400" />
              <h1 className="text-5xl font-handwritten text-chalk-green">
                Desbloquea TheCookFlow Premium
              </h1>
            </div>
            <p className="text-xl text-chalk/80 mb-6">
              La experiencia culinaria definitiva con IA avanzada
            </p>
            
            {/* Trial Banner */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <Gift className="w-6 h-6 text-purple-400" />
                <span className="text-2xl font-bold text-purple-400">7 DÍAS GRATIS</span>
                <Gift className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-chalk/80">
                Prueba todas las funciones Premium sin compromiso. Cancela cuando quieras.
              </p>
              <Badge className="bg-purple-600 text-white mt-2">
                Sin compromiso • Cancela en cualquier momento
              </Badge>
            </div>
          </div>

          {/* Pricing Comparison */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-400/50 scale-105' 
                    : plan.current
                    ? 'bg-yellow-900/20 border-yellow-400/30'
                    : 'bg-dark-green/20 border-chalk-green/30'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-600 text-white px-4 py-1">
                      ⭐ MÁS POPULAR
                    </Badge>
                  </div>
                )}
                {plan.current && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-yellow-600 text-white px-4 py-1">
                      📍 PLAN ACTUAL
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl text-chalk-green mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    {plan.originalPrice && (
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <span className="text-lg text-chalk/50 line-through">{plan.originalPrice}</span>
                        <Badge className="bg-red-600 text-white">{plan.discount}</Badge>
                      </div>
                    )}
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-chalk-white">{plan.price}</span>
                      <span className="text-chalk/60 ml-1">{plan.period}</span>
                    </div>
                    {plan.trial && (
                      <div className="text-green-400 font-semibold mt-2">{plan.trial}</div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className={`w-4 h-4 ${plan.limitations ? 'text-yellow-400' : 'text-green-400'}`} />
                        <span className="text-chalk/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                        : plan.current
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'border-chalk-green text-chalk-green hover:bg-chalk-green/10'
                    }`}
                    variant={plan.popular || plan.current ? 'default' : 'outline'}
                    disabled={plan.current}
                  >
                    {plan.current ? '✓ Plan Actual' : plan.popular ? '🚀 Comenzar Trial Gratis' : 'Continuar Gratis'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Premium Features Grid */}
          <div className="mb-12">
            <h2 className="text-3xl font-handwritten text-chalk-green text-center mb-8">
              🌟 Funciones Premium Exclusivas
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumFeatures.map((feature, index) => (
                <Card key={index} className="bg-dark-green/20 border-chalk-green/30 hover:border-chalk-green/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{feature.icon}</div>
                      <div>
                        <h3 className="font-semibold text-chalk-white mb-2">{feature.name}</h3>
                        <p className="text-chalk/70 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Digital Goods API Demo */}
          <Card className="bg-blue-900/20 border-blue-400/30 mb-8">
            <CardHeader>
              <CardTitle className="text-blue-400 text-lg flex items-center">
                📱 Google Play Billing Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-chalk-white mb-2">🔒 Compra Segura</h4>
                  <ul className="text-sm text-chalk/80 space-y-1">
                    <li>• Facturación a través de Google Play</li>
                    <li>• Sin datos de tarjeta en la app</li>
                    <li>• Política de reembolso de Google</li>
                    <li>• Gestión de suscripciones centralizada</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-chalk-white mb-2">⚡ Digital Goods API</h4>
                  <ul className="text-sm text-chalk/80 space-y-1">
                    <li>• Detección automática del estado</li>
                    <li>• Sincronización en tiempo real</li>
                    <li>• Soporte para PWA/TWA</li>
                    <li>• Premium detectado: <Badge className="bg-red-600 text-white text-xs">false</Badge></li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Proof */}
          <Card className="bg-green-900/20 border-green-400/30 mb-8">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-chalk-green font-semibold mb-4">🎉 Únete a miles de usuarios satisfechos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-green-400">15,000+</div>
                    <div className="text-chalk/70">Menús generados</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-400">4.8⭐</div>
                    <div className="text-chalk/70">Valoración media</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-400">€480</div>
                    <div className="text-chalk/70">Ahorro medio anual</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Final */}
          <div className="text-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg">
              <Zap className="w-5 h-5 mr-2" />
              Comenzar 7 Días Gratis
            </Button>
            <p className="text-chalk/60 text-sm mt-4">
              Sin compromiso • Cancela en cualquier momento • €1.99/mes después del trial
            </p>
          </div>

          {/* Quick Tour Navigation */}
          <div className="mt-12 p-4 bg-black/20 rounded-lg border border-chalk-green/20">
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
                onClick={() => window.open('/tour/4-shopping-list', '_blank')}
                className="border-chalk-green text-chalk-green hover:bg-chalk-green/10"
              >
                4. Lista Compra
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-yellow-500 text-yellow-400 bg-yellow-500/10"
                disabled
              >
                5. Premium
              </Button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-chalk/60 text-sm mb-3">🎭 Tour demo completado</p>
              <div className="flex justify-center space-x-4">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('/qa', '_blank')}
                  className="border-blue-400 text-blue-400 hover:bg-blue-400/10"
                >
                  🔧 QA Dashboard
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('/previews', '_blank')}
                  className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
                >
                  📸 Ver Capturas
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('/', '_blank')}
                  className="border-chalk-green text-chalk-green hover:bg-chalk-green/10"
                >
                  🏠 Landing Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}