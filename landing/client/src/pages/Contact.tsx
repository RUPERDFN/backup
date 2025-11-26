import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle,
  HelpCircle,
  Bug,
  Lightbulb,
  Heart,
  Send
} from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  subject: z.string().min(5, "El asunto debe tener al menos 5 caracteres"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

type ContactForm = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "¡Mensaje enviado!",
        description: "Hemos recibido tu mensaje. Te responderemos pronto.",
      });
      
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "hola@thecookflow.com",
      description: "Respuesta en 24 horas",
      color: "chalk-green"
    },
    {
      icon: Phone,
      title: "Teléfono",
      value: "+34 900 123 456",
      description: "Lun-Vie 9:00-18:00",
      color: "chalk-yellow"
    },
    {
      icon: MapPin,
      title: "Dirección",
      value: "Madrid, España",
      description: "Oficina principal",
      color: "chalk-red"
    },
    {
      icon: Clock,
      title: "Horario",
      value: "24/7 Online",
      description: "Soporte siempre disponible",
      color: "chalk-green"
    }
  ];

  const supportTypes = [
    {
      icon: HelpCircle,
      title: "Ayuda General",
      description: "Preguntas sobre cómo usar TheCookFlow"
    },
    {
      icon: Bug,
      title: "Reportar Bug",
      description: "Problemas técnicos o errores en la aplicación"
    },
    {
      icon: Lightbulb,
      title: "Sugerencia",
      description: "Ideas para mejorar la plataforma"
    },
    {
      icon: Heart,
      title: "Colaboración",
      description: "Propuestas de partnership o colaboración"
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="seccion">
        <img src="/logo.PNG" alt="TheCookFlow - Contacto y soporte" className="logo" />
        
        <h1 className="text-chalk-white mb-4 text-5xl">
          Contacto
        </h1>
        
        <p className="text-xl text-chalk mb-8 max-w-3xl mx-auto leading-relaxed">
          Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
        </p>
      </section>

      <section className="seccion">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="glass-container">
            <div className="flex items-center mb-6">
              <MessageCircle className="mr-3 text-chalk-green" size={24} />
              <h2 className="text-2xl text-chalk-white">Envíanos un Mensaje</h2>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-chalk font-semibold mb-2">Nombre completo</label>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    {...register("name")}
                    className="w-full input-chalk"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-chalk font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    {...register("email")}
                    className="w-full input-chalk"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-chalk font-semibold mb-2">Asunto</label>
                <input
                  type="text"
                  placeholder="¿En qué podemos ayudarte?"
                  {...register("subject")}
                  className="w-full input-chalk"
                />
                {errors.subject && (
                  <p className="text-red-400 text-sm mt-1">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-chalk font-semibold mb-2">Mensaje</label>
                <textarea
                  rows={5}
                  placeholder="Describe tu consulta o comentario..."
                  {...register("message")}
                  className="w-full input-chalk resize-none"
                />
                {errors.message && (
                  <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary-chalk"
              >
                {isSubmitting ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send className="mr-2" size={16} />
                    Enviar Mensaje
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="glass-container">
              <h2 className="text-2xl text-chalk-white mb-6">Información de Contacto</h2>
              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-${info.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="text-black" size={20} />
                      </div>
                      <div>
                        <h3 className="text-chalk-white font-semibold">{info.title}</h3>
                        <p className="text-chalk">{info.value}</p>
                        <p className="text-chalk text-sm opacity-75">{info.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-container">
              <h2 className="text-2xl text-chalk-white mb-6">Tipos de Consulta</h2>
              <div className="space-y-4">
                {supportTypes.map((type, index) => {
                  const Icon = type.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-chalk-green/20 rounded-lg flex items-center justify-center">
                        <Icon className="text-chalk-green" size={18} />
                      </div>
                      <div>
                        <h3 className="text-chalk-white font-semibold">{type.title}</h3>
                        <p className="text-chalk text-sm">{type.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="seccion">
        <h2 className="text-4xl text-chalk-white mb-8">Preguntas Frecuentes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-container">
            <h3 className="text-xl text-chalk-white mb-3">¿Es gratuito usar TheCookFlow?</h3>
            <p className="text-chalk">Sí, todas las funciones básicas son completamente gratuitas.</p>
          </div>
          
          <div className="glass-container">
            <h3 className="text-xl text-chalk-white mb-3">¿Cómo puedo cambiar mis preferencias?</h3>
            <p className="text-chalk">Puedes actualizar tus preferencias cada vez que generes un nuevo menú.</p>
          </div>
          
          <div className="glass-container">
            <h3 className="text-xl text-chalk-white mb-3">¿Qué hago si la IA no reconoce ingredientes?</h3>
            <p className="text-chalk">Intenta con una foto más clara o agrega los ingredientes manualmente.</p>
          </div>
          
          <div className="glass-container">
            <h3 className="text-xl text-chalk-white mb-3">¿Con qué frecuencia se actualizan los precios?</h3>
            <p className="text-chalk">Los precios se actualizan diariamente de forma automática.</p>
          </div>
        </div>
      </section>
    </div>
  );
}