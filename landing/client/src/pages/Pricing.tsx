import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Heart, Clock, Users, Calendar, ChefHat, Star, Gift } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import SEO from "@/components/SEO";

export default function Pricing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <SEO 
        title="Planes y Precios - TheCookFlow Premium | €1.99/mes"
        description="Planificación culinaria con IA desde €1.99/mes. Prueba gratuita de 7 días. Menús ilimitados, reconocimiento de alimentos y listas de compra automáticas."
        keywords="precio TheCookFlow, suscripción premium menús IA, prueba gratuita planificador menús, 1.99 euros mes, app cocina premium"
        ogTitle="TheCookFlow Premium - Planificador de Menús IA | 7 Días Gratis"
        ogDescription="Prueba 7 días gratis. Luego €1.99/mes. Menús ilimitados con IA, reconocimiento de alimentos y ahorro en compras."
      />
      <section className="seccion">
        <img src="/logo.PNG" alt="TheCookFlow Premium - Planificador de menús con IA" className="logo" />
        
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-chalk-green/20 text-chalk-green border-chalk-green/30">
            <Gift className="w-4 h-4 mr-2" />
            ¡Descarga desde Google Play!
          </Badge>
          <h1 className="text-5xl text-chalk-white mb-4">
            TheCookFlow Premium
          </h1>
          <p className="text-xl text-chalk mb-8 max-w-3xl mx-auto leading-relaxed">
            Planificación culinaria inteligente con IA avanzada. Disponible en Android.
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* Trial Plan */}
          <Card className="glass-card border-2 border-chalk/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-chalk-white mb-2">Prueba Gratuita</CardTitle>
              <CardDescription className="text-chalk">
                7 días gratis, luego €1.99/mes
              </CardDescription>
              <div className="text-4xl font-bold text-chalk-white mt-4">
                €0
                <span className="text-lg font-normal text-chalk">/7 días</span>
              </div>
              <p className="text-xs text-chalk/70 mt-2">
                Suscripción automática. Cancela cuando quieras.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-chalk-green mr-3 flex-shrink-0" />
                  <span className="text-chalk">3 menús por semana</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-chalk-green mr-3 flex-shrink-0" />
                  <span className="text-chalk">Hasta 2 personas</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-chalk-green mr-3 flex-shrink-0" />
                  <span className="text-chalk">Lunes a viernes</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-chalk-green mr-3 flex-shrink-0" />
                  <span className="text-chalk">3 comidas diarias</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-chalk-green mr-3 flex-shrink-0" />
                  <span className="text-chalk">Dieta normal únicamente</span>
                </div>
              </div>
              
              {user ? (
                <Link href="/dashboard">
                  <Button className="w-full bg-chalk-green hover:bg-chalk-green/80 text-dark font-semibold">
                    Iniciar Prueba (7 días gratis)
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button className="w-full bg-chalk-green hover:bg-chalk-green/80 text-dark font-semibold">
                    Comenzar Prueba Gratis
                  </Button>
                </Link>
              )}
              
              <p className="text-xs text-chalk/60 text-center mt-2">
                Al registrarte, aceptas que se te cobre €1.99/mes después de 7 días si no cancelas.
              </p>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="glass-card border-2 border-chalk-green relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-chalk-green text-dark px-4 py-1">
                ¡Más Popular!
              </Badge>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-chalk-white mb-2">Premium</CardTitle>
              <CardDescription className="text-chalk">
                Para familias y entusiastas culinarios
              </CardDescription>
              <div className="text-4xl font-bold text-chalk-green mt-4">
                €1.99
                <span className="text-lg font-normal text-chalk">/mes</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-chalk-green mr-3 flex-shrink-0" />
                  <span className="text-chalk">5 menús por semana</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-chalk-green mr-3 flex-shrink-0" />
                  <span className="text-chalk">Hasta 10 personas</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-chalk-green mr-3 flex-shrink-0" />
                  <span className="text-chalk">Planificación completa (7 días)</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-chalk-green mr-3 flex-shrink-0" />
                  <span className="text-chalk">Todas las dietas disponibles</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-chalk-green mr-3 flex-shrink-0" />
                  <span className="text-chalk">IA avanzada (GPT-4o)</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-chalk-green mr-3 flex-shrink-0" />
                  <span className="text-chalk">Reconocimiento de alimentos</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-chalk-green mr-3 flex-shrink-0" />
                  <span className="text-chalk">Comparación de precios</span>
                </div>
              </div>
              
              <Button className="w-full bg-chalk-green hover:bg-chalk-green/80 text-dark font-semibold">
                Suscribirse en Google Play
              </Button>
              
              <p className="text-xs text-chalk/60 text-center">
                Disponible exclusivamente en la app de Android
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Google Play Store CTA */}
        <div className="glass-container max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl text-chalk-white mb-4">Descarga desde Google Play</h2>
          <p className="text-chalk text-lg mb-6">
            La suscripción Premium está disponible exclusivamente en nuestra app de Android
          </p>
          <Button size="lg" className="bg-chalk-green hover:bg-chalk-green/80 text-dark font-semibold">
            Descargar en Google Play
          </Button>
        </div>

        {/* Features Showcase */}
        <div className="glass-container max-w-4xl mx-auto mb-12">
          <div className="text-center mb-8">
            <Star className="w-12 h-12 text-chalk-green mx-auto mb-4" />
            <h2 className="text-3xl text-chalk-white mb-4">Funciones Premium</h2>
            <p className="text-chalk text-lg">
              Experimenta la planificación culinaria del futuro
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <ChefHat className="w-8 h-8 text-chalk-green mx-auto mb-3" />
              <h3 className="text-chalk-white font-semibold mb-2">IA Avanzada</h3>
              <p className="text-chalk text-sm">GPT-4o y Perplexity para resultados óptimos</p>
            </div>
            
            <div className="text-center p-4">
              <Users className="w-8 h-8 text-chalk-green mx-auto mb-3" />
              <h3 className="text-chalk-white font-semibold mb-2">Hasta 10 Personas</h3>
              <p className="text-chalk text-sm">Planifica para familias grandes</p>
            </div>
            
            <div className="text-center p-4">
              <Calendar className="w-8 h-8 text-chalk-green mx-auto mb-3" />
              <h3 className="text-chalk-white font-semibold mb-2">Planificación Completa</h3>
              <p className="text-chalk text-sm">Organiza hasta 7 días, 5 comidas diarias</p>
            </div>
            
            <div className="text-center p-4">
              <Heart className="w-8 h-8 text-chalk-green mx-auto mb-3" />
              <h3 className="text-chalk-white font-semibold mb-2">Reconocimiento Visual</h3>
              <p className="text-chalk text-sm">Identifica alimentos con tu cámara</p>
            </div>
            
            <div className="text-center p-4">
              <Clock className="w-8 h-8 text-chalk-green mx-auto mb-3" />
              <h3 className="text-chalk-white font-semibold mb-2">Comparación Precios</h3>
              <p className="text-chalk text-sm">Encuentra las mejores ofertas automáticamente</p>
            </div>
            
            <div className="text-center p-4">
              <Check className="w-8 h-8 text-chalk-green mx-auto mb-3" />
              <h3 className="text-chalk-white font-semibold mb-2">Mayor Capacidad</h3>
              <p className="text-chalk text-sm">5 menús semanales vs 3 en plan gratuito</p>
            </div>
          </div>
        </div>

        {/* What's Included */}
        <div className="glass-container max-w-3xl mx-auto mb-12">
          <h3 className="text-2xl text-chalk-white mb-6 text-center">¿Qué Incluye?</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-chalk-green flex-shrink-0" />
              <span className="text-chalk">Generación ilimitada de menús personalizados</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-chalk-green flex-shrink-0" />
              <span className="text-chalk">Reconocimiento de alimentos con IA (GPT-4o Vision)</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-chalk-green flex-shrink-0" />
              <span className="text-chalk">Listas de compra automáticas y organizadas</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-chalk-green flex-shrink-0" />
              <span className="text-chalk">Comparación de precios en 5 supermercados</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-chalk-green flex-shrink-0" />
              <span className="text-chalk">Chat inteligente SkinChef para consultas</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-chalk-green flex-shrink-0" />
              <span className="text-chalk">Gestión de restricciones dietéticas y alergias</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-chalk-green flex-shrink-0" />
              <span className="text-chalk">Integración con Amazon Fresh para compras</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        {!user ? (
          <div className="text-center">
            <p className="text-chalk mb-6 text-lg">
              ¡Empieza a planificar tus comidas ahora mismo!
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-chalk-green hover:bg-chalk-green/80 text-black font-semibold px-8 py-4 text-lg">
                Crear Cuenta Gratuita
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-chalk mb-6 text-lg">
              ¡Perfecto! Ya tienes acceso a todas las funciones
            </p>
            <Link href="/menu-generator">
              <Button size="lg" className="bg-chalk-green hover:bg-chalk-green/80 text-black font-semibold px-8 py-4 text-lg">
                Generar Mi Primer Menú
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}