import { useState } from "react";
import { 
  ChefHat, 
  Camera, 
  BarChart3, 
  Search, 
  Book, 
  Video, 
  MessageCircle, 
  Mail,
  HelpCircle,
  User,
  Settings,
  Star,
  Clock,
  Target
} from "lucide-react";

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      id: "getting-started",
      title: "Primeros pasos",
      icon: ChefHat,
      questions: [
        {
          question: "¿Cómo creo mi primer menú semanal?",
          answer: "Para crear tu primer menú, ve a la sección 'Generador' desde el menú principal. Completa tus preferencias dietéticas, presupuesto y tiempo de cocina. Nuestra IA generará un menú personalizado en menos de un minuto."
        },
        {
          question: "¿Qué información necesito proporcionar?",
          answer: "Solo necesitamos conocer tus restricciones dietéticas (vegetariano, vegano, sin gluten, etc.), tu presupuesto semanal aproximado, el tiempo que prefieres dedicar a cocinar, y el número de porciones por comida."
        },
        {
          question: "¿Puedo modificar un menú después de generarlo?",
          answer: "Sí, puedes ver todos tus menús en el Panel de Usuario y generar nuevas versiones con diferentes preferencias. Cada menú se guarda automáticamente en tu cuenta."
        }
      ]
    },
    {
      id: "food-recognition",
      title: "Reconocimiento de alimentos",
      icon: Camera,
      questions: [
        {
          question: "¿Qué tipos de imágenes puedo subir?",
          answer: "Puedes subir fotos de ingredientes frescos, despensa, nevera, o cualquier alimento. Las imágenes deben ser claras y bien iluminadas. Formatos compatibles: JPG, PNG, hasta 10MB."
        },
        {
          question: "¿Qué tan preciso es el reconocimiento?",
          answer: "Nuestro sistema de IA tiene una precisión del 85-95% en ingredientes comunes. Los resultados incluyen un porcentaje de confianza para cada ingrediente detectado."
        },
        {
          question: "¿Qué hago si no reconoce un ingrediente?",
          answer: "Puedes tomar una foto más clara o desde otro ángulo. También puedes agregar ingredientes manualmente en el generador de menús para obtener recetas personalizadas."
        }
      ]
    },

  ];

  const tutorials = [
    {
      title: "Crear tu primer menú semanal",
      description: "Aprende a generar un menú personalizado paso a paso",
      duration: "5 min",
      difficulty: "Principiante",
      icon: ChefHat,
      steps: [
        "Accede al Generador de Menús",
        "Completa tus preferencias dietéticas",
        "Establece tu presupuesto semanal",
        "Selecciona el tiempo de cocina preferido",
        "Genera tu menú con IA"
      ]
    },
    {
      title: "Reconocimiento de ingredientes",
      description: "Usa la cámara para identificar alimentos y obtener recetas",
      duration: "3 min",
      difficulty: "Principiante",
      icon: Camera,
      steps: [
        "Ve a la pestaña 'Reconocer Alimentos'",
        "Toma una foto clara de tus ingredientes",
        "Revisa los ingredientes detectados",
        "Explora las recetas sugeridas",
        "Guarda tus favoritas"
      ]
    },

  ];

  const supportOptions = [
    {
      title: "Centro de Ayuda",
      description: "Encuentra respuestas a las preguntas más frecuentes",
      icon: Book,
      href: "#faq"
    },
    {
      title: "Video Tutoriales",
      description: "Aprende con nuestros tutoriales paso a paso",
      icon: Video,
      href: "#tutorials"
    },
    {
      title: "Chat en Vivo",
      description: "Habla con nuestro equipo de soporte",
      icon: MessageCircle,
      href: "/contact"
    },
    {
      title: "Email de Soporte",
      description: "Envíanos un email y te responderemos pronto",
      icon: Mail,
      href: "/contact"
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="seccion">
        <img src="/logo.PNG" alt="TheCookFlow - Centro de ayuda y tutoriales" className="logo" />
        
        <h1 className="text-chalk-white mb-4 text-5xl">
          Centro de Ayuda
        </h1>
        
        <p className="text-xl text-chalk mb-8 max-w-3xl mx-auto leading-relaxed">
          Todo lo que necesitas saber para aprovechar al máximo TheCookFlow
        </p>
      </section>

      <section className="seccion">
        {/* Quick Search */}
        <div className="glass-container max-w-4xl mx-auto mb-8">
          <div className="flex items-center space-x-4">
            <Search className="text-chalk/50" size={24} />
            <div className="flex-1">
              <input
                type="text"
                placeholder="Busca en la ayuda... ej: cómo crear menú, reconocer alimentos"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-chalk placeholder-chalk/50 text-lg input-chalk"
              />
            </div>
            <button className="btn-primary-chalk">
              <Search size={16} />
            </button>
          </div>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {supportOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <div key={index} className="glass-container text-center hover:bg-white/10 transition-all">
                <div className="w-16 h-16 bg-chalk-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-black" size={24} />
                </div>
                <h3 className="text-lg text-chalk-white mb-2">{option.title}</h3>
                <p className="text-chalk text-sm mb-4">{option.description}</p>
                <a href={option.href} className="text-chalk-green hover:text-chalk-yellow text-sm">
                  Explorar →
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="seccion" id="faq">
        <h2 className="text-4xl text-chalk-white mb-8">Preguntas Frecuentes</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {faqCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.id} className="glass-container">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-chalk-green rounded-lg flex items-center justify-center mr-4">
                    <Icon className="text-black" size={20} />
                  </div>
                  <h3 className="text-xl text-chalk-white">{category.title}</h3>
                </div>
                
                <div className="space-y-4">
                  {category.questions.map((q, index) => (
                    <div key={index}>
                      <h4 className="text-chalk-white font-semibold mb-2">{q.question}</h4>
                      <p className="text-chalk text-sm">{q.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tutorials Section */}
      <section className="seccion" id="tutorials">
        <h2 className="text-4xl text-chalk-white mb-8">Tutoriales</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tutorials.map((tutorial, index) => {
            const Icon = tutorial.icon;
            return (
              <div key={index} className="glass-container">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-chalk-yellow rounded-lg flex items-center justify-center mr-4">
                    <Icon className="text-black" size={20} />
                  </div>
                  <div>
                    <span className="bg-chalk-green text-black px-2 py-1 rounded text-xs">
                      {tutorial.difficulty}
                    </span>
                    <div className="text-chalk text-sm mt-1">{tutorial.duration}</div>
                  </div>
                </div>
                
                <h3 className="text-xl text-chalk-white mb-2">{tutorial.title}</h3>
                <p className="text-chalk mb-4">{tutorial.description}</p>
                
                <div className="space-y-2">
                  {tutorial.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-center text-sm text-chalk">
                      <div className="w-6 h-6 bg-chalk-green/20 rounded-full flex items-center justify-center mr-3 text-chalk-green">
                        {stepIndex + 1}
                      </div>
                      {step}
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-4 btn-secondary-chalk">
                  Ver Tutorial
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}