import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen">
      <SEO 
        title="TheCookFlow - Planificador de Menús con IA para Cocinas Españolas"
        description="Crea menús semanales personalizados con inteligencia artificial. Reconocimiento de alimentos, listas de compra automáticas y recetas adaptadas a tu presupuesto. Prueba gratuita 7 días."
        keywords="planificador culinario España, menús IA cocinas españolas, generador menús semanales, lista compra inteligente, reconocimiento alimentos IA, recetas personalizadas, ahorro supermercado, TheCookFlow"
        ogTitle="TheCookFlow - Tu Asistente Culinario Inteligente con IA"
        ogDescription="Transforma la planificación de menús con IA. Reconocimiento de alimentos, listas automáticas y recetas personalizadas para cocinas españolas."
      />
      {/* Hero Section */}
      <section className="seccion">
        <img src="/logo-new.PNG" alt="TheCookFlow - Planificador de menús con inteligencia artificial" className="logo" />
        
        <h1 className="text-chalk-white mb-4 text-5xl">
          ¿Qué quieres comer esta semana?
        </h1>
        
        <p className="text-xl text-chalk mb-8 max-w-3xl mx-auto leading-relaxed">
          Tu asistente culinario inteligente que transforma la planificación de menús en una experiencia mágica. 
          IA + Cocina = Perfección
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            className="btn-red-chalk-outline text-2xl px-12 py-6"
            onClick={() => setLocation("/register")}
          >
            Crear Mi Primer Menú
          </button>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center items-center gap-6 mb-8">
          {/* Facebook Icon */}
          <a 
            href="https://www.facebook.com/profile.php?id=61576738162565" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group"
          >
            <div className="w-12 h-12 rounded-full border-2 border-chalk hover:border-chalk-green bg-blackboard hover:bg-chalk-green/10 flex items-center justify-center transition-all duration-300 transform hover:scale-110">
              <svg 
                className="w-6 h-6 text-chalk group-hover:text-chalk-green transition-colors" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
          </a>

          {/* Instagram Icon */}
          <a 
            href="https://www.instagram.com/thecookflow_app/profilecard/?igsh=NndraDhwem11aHU3" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group"
          >
            <div className="w-12 h-12 rounded-full border-2 border-chalk hover:border-chalk-green bg-blackboard hover:bg-chalk-green/10 flex items-center justify-center transition-all duration-300 transform hover:scale-110">
              <svg 
                className="w-6 h-6 text-chalk group-hover:text-chalk-green transition-colors" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
          </a>

          {/* YouTube Icon */}
          <a 
            href="https://youtube.com/@thecookflow_app?si=9jZ2QUgyHQogSe2F" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group"
          >
            <div className="w-12 h-12 rounded-full border-2 border-chalk hover:border-chalk-green bg-blackboard hover:bg-chalk-green/10 flex items-center justify-center transition-all duration-300 transform hover:scale-110">
              <svg 
                className="w-6 h-6 text-chalk group-hover:text-chalk-green transition-colors" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
          </a>
        </div>

        {/* Navigation Demo Bar */}
        <div className="max-w-7xl mx-auto px-4 mb-12">
          <div className="p-16 bg-transparent">
            <h3 className="text-5xl text-chalk-white mb-12 text-center">🚀 Prueba nuestras funciones</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <button
                onClick={() => setLocation("/demo/questionnaire")}
                className="w-full h-48 flex flex-col items-center justify-center gap-6 bg-transparent hover:bg-chalk-green/20 border-0 text-chalk hover:text-chalk-white transition-all duration-200 rounded-lg"
                data-testid="button-demo-questionnaire"
              >
                <img src="/lista.png" alt="Cuestionario de preferencias alimentarias - Define tu menú ideal" className="h-20 w-20" />
                <span className="text-3xl font-semibold">Cuestionario</span>
              </button>
              
              <button
                onClick={() => setLocation("/demo/generator")}
                className="w-full h-48 flex flex-col items-center justify-center gap-6 bg-transparent hover:bg-chalk-green/20 border-0 text-chalk hover:text-chalk-white transition-all duration-200 rounded-lg"
                data-testid="button-demo-generator"
              >
                <img src="/menu.png" alt="Generador de menús con inteligencia artificial" className="h-20 w-20" />
                <span className="text-3xl font-semibold">Generador IA</span>
              </button>
              
              <button
                onClick={() => setLocation("/demo/skinchef")}
                className="w-full h-48 flex flex-col items-center justify-center gap-6 bg-transparent hover:bg-chalk-green/20 border-0 text-chalk hover:text-chalk-white transition-all duration-200 rounded-lg"
                data-testid="button-demo-skinchef"
              >
                <img src="/chef.png" alt="SkinChef - Asistente culinario con inteligencia artificial" className="h-20 w-20" />
                <span className="text-3xl font-semibold">SkinChef IA</span>
              </button>
            </div>
          </div>
        </div>

        {/* Features Icons */}
        <div className="flex justify-center">
          <div className="max-w-6xl w-full p-16 bg-transparent">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 justify-items-center">
              <div className="text-center">
                <img src="/menu.png" alt="Generador de menús semanales con inteligencia artificial" className="decoraciones w-28 h-28 mb-6 mx-auto" />
                <p className="text-chalk text-2xl font-medium">Generador IA</p>
              </div>
              <div className="text-center">
                <img src="/recetas.png" alt="Reconocimiento visual de alimentos con IA para generar recetas" className="decoraciones w-28 h-28 mb-6 mx-auto" />
                <p className="text-chalk text-2xl font-medium">Reconocimiento Visual</p>
              </div>
              <div className="text-center">
                <img src="/lista.png" alt="Listas de compra automáticas e inteligentes" className="decoraciones w-28 h-28 mb-6 mx-auto" />
                <p className="text-chalk text-2xl font-medium">Listas Inteligentes</p>
              </div>
              <div className="text-center">
                <img src="/chef.png" alt="Planificación semanal de menús personalizados con SkinChef IA" className="decoraciones w-28 h-28 mb-6 mx-auto" />
                <p className="text-chalk text-2xl font-medium">Planificación Semanal</p>
              </div>
              <div className="text-center col-span-2 md:col-span-1">
                <img src="/auto.png" alt="Panel de control personal para gestión de menús y recetas" className="decoraciones w-28 h-28 mb-6 mx-auto" />
                <p className="text-chalk text-2xl font-medium">Panel Personal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="seccion">
        <h2 className="text-chalk-white mb-12">¿Cómo Funciona?</h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-12 bg-transparent">
            <div className="text-8xl text-chalk-green mb-6">1</div>
            <h3 className="text-3xl text-chalk-white mb-6 leading-tight">Configura tus Preferencias</h3>
            <p className="text-chalk text-xl leading-relaxed">
              Dinos qué te gusta, qué no puedes comer, tu presupuesto y objetivos nutricionales.
            </p>
          </div>
          
          <div className="text-center p-12 bg-transparent">
            <div className="text-8xl text-chalk-green mb-6">2</div>
            <h3 className="text-3xl text-chalk-white mb-6 leading-tight">IA Crea tu Menú</h3>
            <p className="text-chalk text-xl leading-relaxed">
              Nuestra IA genera un menú semanal personalizado con recetas deliciosas y balanceadas.
            </p>
          </div>
          
          <div className="text-center p-12 bg-transparent">
            <div className="text-8xl text-chalk-green mb-6">3</div>
            <h3 className="text-3xl text-chalk-white mb-6 leading-tight">Compra y Cocina</h3>
            <p className="text-chalk text-xl leading-relaxed">
              Recibe tu lista de compras optimizada y sigue las recetas paso a paso. ¡A disfrutar!
            </p>
          </div>
        </div>
      </section>

      {/* Food Recognition Demo */}
      <section className="seccion">
        <h2 className="text-chalk-white mb-12">Reconocimiento Visual de Alimentos</h2>
        
        <div className="max-w-4xl mx-auto p-12 bg-transparent mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl text-chalk-white mb-8">Sube una foto de tu nevera</h3>
              
              <div className="border-2 border-dashed border-chalk-green rounded-lg p-12 text-center mb-8">
                <div className="text-8xl text-chalk-green mb-6">📸</div>
                <p className="text-chalk mb-6 text-xl">Arrastra y suelta una foto aquí o haz clic para seleccionar</p>
                <button className="btn-chalk text-xl px-8 py-4">
                  Subir Foto de la Nevera
                </button>
              </div>
              
              <div className="text-lg text-chalk space-y-3">
                <p>• Reconocimiento automático con IA</p>
                <p>• Detecta ingredientes y fechas de caducidad</p>
                <p>• Sugiere recetas basadas en lo que tienes</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-4xl text-chalk-white mb-10">Ingredientes Detectados</h3>
              
              <div className="space-y-6">
                <div className="p-8 bg-transparent border-0 rounded-lg flex justify-between items-center">
                  <div>
                    <span className="text-chalk-white font-semibold text-3xl">Tomates cherry</span>
                    <div className="text-2xl text-chalk">Confianza: 95%</div>
                  </div>
                  <span className="text-chalk-green text-4xl">✓</span>
                </div>
                
                <div className="p-8 bg-transparent border-0 rounded-lg flex justify-between items-center">
                  <div>
                    <span className="text-chalk-white font-semibold text-3xl">Queso mozzarella</span>
                    <div className="text-2xl text-chalk">Confianza: 88%</div>
                  </div>
                  <span className="text-chalk-green text-4xl">✓</span>
                </div>
                
                <div className="p-8 bg-transparent border-0 rounded-lg flex justify-between items-center">
                  <div>
                    <span className="text-chalk-white font-semibold text-3xl">Albahaca fresca</span>
                    <div className="text-2xl text-chalk">Confianza: 92%</div>
                  </div>
                  <span className="text-chalk-green text-4xl">✓</span>
                </div>
                
                <div className="p-8 bg-transparent border-0 rounded-lg flex justify-between items-center">
                  <div>
                    <span className="text-chalk-white font-semibold text-3xl">Aceite de oliva</span>
                    <div className="text-2xl text-chalk">Confianza: 87%</div>
                  </div>
                  <span className="text-chalk-green text-4xl">✓</span>
                </div>
              </div>
              
              <div className="mt-10 p-8 bg-transparent rounded-lg border-0">
                <h4 className="text-chalk-white font-semibold mb-6 text-3xl">Receta Sugerida:</h4>
                <p className="text-chalk text-2xl">Ensalada Caprese con tomates cherry, mozzarella fresca y albahaca</p>
                <div className="text-xl text-chalk mt-6">⏱️ 15 min • 🍽️ 2 personas • 🔥 380 kcal</div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Final CTA Section */}
      <section className="seccion p-12 bg-transparent">
        <div className="text-center">
          <h2 className="text-5xl text-chalk-white font-handwritten mb-8">
            ¿Listo para transformar tu forma de cocinar?
          </h2>
          <p className="text-2xl text-chalk mb-12 max-w-4xl mx-auto leading-relaxed">
            Únete a miles de usuarios que ya disfrutan de menús personalizados y ahorro en sus compras
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <button
              className="btn-red-chalk-outline text-3xl px-16 py-8"
              onClick={() => setLocation("/register")}
            >
              ¡Empezar Gratis Ahora!
            </button>
            <Button
              size="lg"
              variant="outline"
              className="border-chalk-green text-chalk-green hover:bg-chalk-green hover:text-gray-900 font-bold font-handwritten text-3xl px-16 py-8 transition-all duration-300 transform hover:scale-105"
              onClick={() => setLocation("/login")}
            >
              Ya tengo cuenta
            </Button>
          </div>
          
          <div className="text-xl text-chalk opacity-80">
            ✓ Registro gratuito • ✓ Sin compromiso • ✓ Resultados inmediatos
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="seccion p-12 bg-transparent">
        <div className="text-center">
          <p className="text-chalk mb-6 text-xl">
            © 2025 TheCookFlow. Transformando la cocina con inteligencia artificial.
          </p>
          
          <div className="space-x-6">
            <a href="/legal" className="text-chalk hover:text-chalk-green transition-colors text-lg">Política de Privacidad</a>
            <span className="text-chalk/50 text-lg">•</span>
            <a href="/legal" className="text-chalk hover:text-chalk-green transition-colors text-lg">Términos de Uso</a>
            <span className="text-chalk/50 text-lg">•</span>
            <a href="/help" className="text-chalk hover:text-chalk-green transition-colors text-lg">Ayuda</a>
            <a href="mailto:hola@thecookflow.com" className="text-chalk hover:text-chalk-green transition-colors text-lg">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}