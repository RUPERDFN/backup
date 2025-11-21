import { useState } from "react";
import SEO from "@/components/SEO";
import { ChevronDown, ChevronUp, Search, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    // General
    {
      question: "¿Qué es TheCookFlow y cómo funciona?",
      answer: "TheCookFlow es un planificador de menús inteligente que usa inteligencia artificial para crear menús semanales personalizados. Simplemente completas un cuestionario con tus preferencias alimentarias, presupuesto y restricciones, y nuestra IA genera menús adaptados a ti con recetas detalladas y listas de compra automáticas.",
      category: "General"
    },
    {
      question: "¿Es gratis TheCookFlow?",
      answer: "TheCookFlow ofrece una prueba gratuita de 7 días con acceso completo a todas las funciones premium. Después del periodo de prueba, la suscripción cuesta €1.99/mes. Los usuarios gratuitos pueden generar 1 menú por día con funcionalidades limitadas.",
      category: "General"
    },
    {
      question: "¿Cómo cancelo mi suscripción?",
      answer: "Puedes cancelar tu suscripción en cualquier momento desde tu cuenta en la sección 'Mi Cuenta'. La cancelación es inmediata y seguirás teniendo acceso premium hasta el final del período de facturación actual.",
      category: "General"
    },
    
    // Menús y Recetas
    {
      question: "¿Cómo genero mi primer menú semanal?",
      answer: "Para generar tu primer menú, ve al 'Generador de Menús' desde el menú principal. Completa el cuestionario con tus preferencias: número de personas, días a planificar, tipo de dieta, alergias y presupuesto. La IA generará un menú completo en menos de un minuto.",
      category: "Menús y Recetas"
    },
    {
      question: "¿Puedo personalizar los menús generados?",
      answer: "Sí, puedes regenerar menús con diferentes preferencias en cualquier momento. También puedes guardar tus recetas favoritas y la IA las tendrá en cuenta para futuros menús.",
      category: "Menús y Recetas"
    },
    {
      question: "¿Qué tipos de dietas soporta TheCookFlow?",
      answer: "TheCookFlow soporta múltiples tipos de dietas: vegetariana, vegana, sin gluten, sin lactosa, keto, diabética, mediterránea, paleo y más. También puedes especificar alergias y alimentos que no te gustan.",
      category: "Menús y Recetas"
    },
    {
      question: "¿Las recetas incluyen información nutricional?",
      answer: "Sí, cada receta incluye información nutricional detallada: calorías, proteínas, carbohidratos, grasas y micronutrientes principales. Esto te ayuda a mantener una dieta balanceada.",
      category: "Menús y Recetas"
    },
    
    // Reconocimiento Visual
    {
      question: "¿Cómo funciona el reconocimiento de alimentos por imagen?",
      answer: "Sube una foto de tu nevera, despensa o ingredientes, y nuestra IA con visión artificial identifica los alimentos automáticamente. Luego genera recetas basadas en los ingredientes detectados, ayudándote a aprovechar lo que ya tienes en casa.",
      category: "Reconocimiento Visual"
    },
    {
      question: "¿Qué precisión tiene el reconocimiento de alimentos?",
      answer: "Nuestro sistema tiene una precisión del 85-95% en ingredientes comunes. Cada ingrediente detectado incluye un porcentaje de confianza. Puedes editar manualmente los resultados si es necesario.",
      category: "Reconocimiento Visual"
    },
    
    // Lista de Compra
    {
      question: "¿Cómo funciona la lista de compra automática?",
      answer: "Cuando generas un menú, TheCookFlow crea automáticamente una lista de compra organizada por categorías (verduras, carnes, lácteos, etc.) con cantidades precisas en gramos o unidades. Puedes exportarla o usarla directamente desde la app.",
      category: "Lista de Compra"
    },
    {
      question: "¿Puedo comprar directamente desde TheCookFlow?",
      answer: "Sí, ofrecemos integración con Amazon Fresh para que puedas comprar los ingredientes de tu lista directamente. Esto te ahorra tiempo y garantiza que tienes todo lo necesario para tus recetas.",
      category: "Lista de Compra"
    },
    {
      question: "¿Se puede ajustar el presupuesto de la lista de compra?",
      answer: "Sí, cuando generas un menú puedes especificar tu presupuesto semanal. La IA optimiza las recetas para ajustarse a tu presupuesto, sugiriendo ingredientes más económicos cuando sea necesario.",
      category: "Lista de Compra"
    },
    
    // Modo Ahorro
    {
      question: "¿Qué es el modo ahorro de TheCookFlow?",
      answer: "El modo ahorro analiza tus menús y sugiere formas de reducir costos: ingredientes alternativos más económicos, aprovechamiento de ofertas, compra en formatos familiares y reducción de desperdicio de alimentos.",
      category: "Modo Ahorro"
    },
    
    // Técnico
    {
      question: "¿Funciona TheCookFlow en dispositivos móviles?",
      answer: "Sí, TheCookFlow está disponible como aplicación web responsive y como app nativa para Android en Google Play Store. Próximamente estará disponible para iOS.",
      category: "Técnico"
    },
    {
      question: "¿Necesito conexión a internet para usar TheCookFlow?",
      answer: "Sí, necesitas conexión a internet para generar menús y usar el reconocimiento visual de alimentos, ya que estas funciones requieren procesamiento en la nube con IA. Sin embargo, puedes ver menús guardados sin conexión.",
      category: "Técnico"
    },
    {
      question: "¿Mis datos están seguros?",
      answer: "Sí, todos tus datos están encriptados y almacenados de forma segura. No compartimos tu información personal con terceros. Puedes eliminar tu cuenta y todos tus datos en cualquier momento desde la configuración.",
      category: "Técnico"
    },
  ];

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const filteredFAQs = faqs.filter(faq =>
    searchQuery === "" ||
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const faqsByCategory = categories.reduce((acc, category) => {
    acc[category] = filteredFAQs.filter(faq => faq.category === category);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  // Schema.org structured data for FAQ
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title="Preguntas Frecuentes (FAQ) - TheCookFlow"
        description="Encuentra respuestas a las preguntas más frecuentes sobre TheCookFlow: cómo generar menús con IA, listas de compra automáticas, reconocimiento de alimentos, precios y más."
        keywords="FAQ TheCookFlow, preguntas frecuentes planificador menús, ayuda menús IA, dudas TheCookFlow, soporte planificador culinario"
      />

      {/* Add Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="seccion">
        <img 
          src="/logo.PNG" 
          alt="TheCookFlow - Preguntas frecuentes sobre planificador de menús con IA" 
          className="logo" 
        />
        
        <h1 className="text-chalk-white mb-4 text-5xl" data-testid="heading-faq">
          Preguntas Frecuentes
        </h1>
        
        <p className="text-xl text-chalk mb-12 max-w-3xl mx-auto leading-relaxed">
          Encuentra respuestas rápidas a las dudas más comunes sobre TheCookFlow
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-chalk/50" size={24} />
            <input
              type="text"
              placeholder="Busca tu pregunta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 input-chalk text-xl"
              data-testid="input-search-faq"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto space-y-12">
          {Object.entries(faqsByCategory).map(([category, categoryFAQs]) => (
            categoryFAQs.length > 0 && (
              <div key={category}>
                <h2 className="text-3xl text-chalk-green mb-6 flex items-center gap-3">
                  <HelpCircle className="h-8 w-8" />
                  {category}
                </h2>
                
                <div className="space-y-4">
                  {categoryFAQs.map((faq, index) => {
                    const faqId = faqs.indexOf(faq);
                    const isExpanded = expandedId === faqId;
                    
                    return (
                      <div
                        key={faqId}
                        className="glass-container"
                        data-testid={`faq-item-${faqId}`}
                      >
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : faqId)}
                          className="w-full flex justify-between items-start gap-4 text-left"
                          aria-expanded={isExpanded}
                          data-testid={`button-faq-${faqId}`}
                        >
                          <h3 className="text-xl text-chalk-white font-semibold flex-1">
                            {faq.question}
                          </h3>
                          {isExpanded ? (
                            <ChevronUp className="h-6 w-6 text-chalk-green flex-shrink-0 mt-1" />
                          ) : (
                            <ChevronDown className="h-6 w-6 text-chalk flex-shrink-0 mt-1" />
                          )}
                        </button>
                        
                        {isExpanded && (
                          <div 
                            className="mt-4 pt-4 border-t border-chalk/20"
                            data-testid={`answer-faq-${faqId}`}
                          >
                            <p className="text-chalk text-lg leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          ))}

          {filteredFAQs.length === 0 && (
            <div className="text-center glass-container py-12">
              <HelpCircle className="h-16 w-16 text-chalk/30 mx-auto mb-4" />
              <p className="text-chalk text-xl">
                No se encontraron preguntas que coincidan con tu búsqueda.
              </p>
              <p className="text-chalk/70 mt-2">
                Intenta con otras palabras clave o contacta con soporte.
              </p>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="max-w-2xl mx-auto mt-16 glass-container text-center">
          <h2 className="text-2xl text-chalk-white mb-4">
            ¿No encuentras tu respuesta?
          </h2>
          <p className="text-chalk text-lg mb-6">
            Nuestro equipo de soporte está aquí para ayudarte
          </p>
          <a 
            href="/contact"
            className="btn-primary-chalk inline-block"
            data-testid="link-contact-support"
          >
            Contactar Soporte
          </a>
        </div>
      </section>
    </div>
  );
}
