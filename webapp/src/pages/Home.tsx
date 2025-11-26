import { useAuth } from "@/hooks/useAuth";
import { usePremium } from "@/hooks/usePremium";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import NativeFeed from "@/components/ads/NativeFeed";
import { 
  ChefHat, 
  Camera, 
  BarChart3, 
  Clock, 
  Users,
  Star,
  Zap,
  Brain,
  Heart,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useEffect } from "react";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { isPremium } = usePremium();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/login";
      return;
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="animate-spin mx-auto mb-4 text-chalk-green" size={48} />
          <p className="text-chalk/70">Cargando...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      title: "Planificación Inteligente",
      description: "Crea menús semanales personalizados basados en tus preferencias, restricciones alimentarias y presupuesto",
      icon: Brain,
      color: "text-chalk-green",
    },
    {
      title: "Reconocimiento Visual",
      description: "Identifica ingredientes y obtén recetas instantáneas simplemente subiendo una foto de tu comida",
      icon: Camera,
      color: "text-chalk-yellow",
    },

    {
      title: "Ahorro de Tiempo",
      description: "Automatiza la planificación de comidas y reduce el tiempo de preparación con recetas eficientes",
      icon: Clock,
      color: "text-chalk-green",
    },
  ];

  const benefits = [
    "Planificación automática de menús semanales",
    "Reconocimiento de alimentos por imagen",

    "Gestión de restricciones alimentarias",
    "Optimización nutricional personalizada",
    "Lista de compras inteligente",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="seccion relative overflow-hidden">
        <img src="/logo.PNG" alt="TheCookFlow - Planificador de menús semanales con IA" className="logo" />
        
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-chalk-green mr-3" />
            <h1 className="text-6xl md:text-8xl text-chalk-white">
              SkinChef
            </h1>
            <Sparkles className="h-8 w-8 text-chalk-green ml-3" />
          </div>
          <p className="text-2xl md:text-3xl text-chalk-white mb-4">
            Tu Asistente de Cocina Inteligente
          </p>
          <p className="text-lg text-chalk max-w-3xl mx-auto mb-8 leading-relaxed">
            Revoluciona tu forma de cocinar con inteligencia artificial avanzada. 
            Planifica menús, reconoce ingredientes y optimiza tus compras automáticamente.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/questionnaire">
              <button className="btn-primary-chalk">
                <Zap className="mr-2 h-5 w-5" />
                Comenzar Ahora
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="btn-secondary-chalk">
                <ArrowRight className="mr-2 h-5 w-5" />
                Mi Dashboard
              </button>
            </Link>
          </div>
        </div>

        {/* Welcome Message for Authenticated Users */}
        {user && (
          <div className="glass-container max-w-2xl mx-auto mb-8 text-center">
            <h2 className="text-2xl text-chalk-white mb-2">
              ¡Bienvenido de vuelta, {user.firstName}!
            </h2>
            <p className="text-chalk">
              Tu asistente culinario está listo para ayudarte a crear menús increíbles
            </p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="seccion">
        <h2 className="text-4xl md:text-5xl text-chalk-white mb-8">
          Capacidades Avanzadas
        </h2>
        <p className="text-xl text-chalk max-w-3xl mx-auto mb-12">
          Descubre cómo SkinChef transforma tu experiencia culinaria
        </p>

        <div className="iconos" id="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index}>
                <Icon className={`h-16 w-16 mx-auto mb-4 ${feature.color}`} />
                <h3 className="text-xl text-chalk-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-chalk text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
        
        {/* Native feed ads for non-premium users */}
        {!isPremium && (
          <NativeFeed 
            targetSelector="#features-grid" 
            frequency={3} 
            maxAds={2} 
          />
        )}
      </section>

      {/* Benefits Section */}
      <section className="seccion">
        <h2 className="text-4xl md:text-5xl text-chalk-white mb-8">
          Todo lo que Necesitas
        </h2>
        <p className="text-xl text-chalk mb-12">
          Una solución completa para la planificación culinaria moderna
        </p>

        <div className="glass-container max-w-4xl mx-auto">
          <h3 className="text-2xl text-chalk-green mb-6 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 mr-2" />
            Características Principales
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center text-chalk">
                <CheckCircle className="h-5 w-5 text-chalk-green mr-3 flex-shrink-0" />
                {benefit}
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-8 border-t border-chalk-green/30">
            <h4 className="text-xl text-chalk-green mb-4 text-center">Para Quién es SkinChef</h4>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <Users className="h-8 w-8 text-chalk-green mx-auto mb-2" />
                <p className="text-chalk-white font-semibold">Familias Ocupadas</p>
                <p className="text-chalk text-sm">Planifica comidas saludables sin estrés</p>
              </div>
              <div>
                <ChefHat className="h-8 w-8 text-chalk-green mx-auto mb-2" />
                <p className="text-chalk-white font-semibold">Entusiastas Culinarios</p>
                <p className="text-chalk text-sm">Descubre nuevas recetas y técnicas</p>
              </div>
              <div>
                <Star className="h-8 w-8 text-chalk-green mx-auto mb-2" />
                <p className="text-chalk-white font-semibold">Conscientes del Presupuesto</p>
                <p className="text-chalk text-sm">Optimiza gastos y reduce desperdicios</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="seccion">
        <div className="glass-container max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl text-chalk-white mb-4">
            ¿Listo para Revolucionar tu Cocina?
          </h2>
          <p className="text-lg text-chalk mb-8">
            Únete a miles de usuarios que ya están cocinando de forma más inteligente con SkinChef
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/questionnaire">
              <button className="btn-primary-chalk">
                <Zap className="mr-2 h-5 w-5" />
                Empezar Gratis
              </button>
            </Link>
            <Link href="/skinchef">
              <button className="btn-secondary-chalk">
                <ChefHat className="mr-2 h-5 w-5" />
                Chat con SkinChef
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
