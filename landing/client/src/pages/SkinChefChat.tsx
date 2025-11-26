import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUsageLimit } from "@/hooks/useUsageLimit";
import { PaywallDialog } from "@/components/PaywallDialog";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Send, ChefHat, User, Bot, Sparkles, Heart, Coffee, Star } from "lucide-react";
import { Link } from "wouter";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'skinchef';
  timestamp: Date;
}

export default function SkinChefChat() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '¡Hola! 👨‍🍳 Soy SkinChef, tu asistente culinario especializado solo en temas de cocina. Puedo ayudarte con recetas, técnicas culinarias, consejos sobre ingredientes y planificación general de menús. Ten en cuenta que no tengo acceso a tus datos personales ni información de la aplicación. ¿En qué tema culinario te puedo ayudar? 🍳✨',
      sender: 'skinchef',
      timestamp: new Date()
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [quickSuggestions] = useState([
    "¿Qué puedo cocinar con pollo?",
    "Receta rápida para cenar",
    "Menú saludable para la semana",
    "Cómo conservar alimentos",
    "Técnicas básicas de cocina"
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  
  // Sistema de límite freemium: 3 consultas/día para FREE
  const { usageCount, dailyLimit, canUse, incrementUsage, isPremium } = useUsageLimit({ 
    dailyLimit: 3, 
    feature: 'chef' 
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      // Sanitizar mensaje en frontend también
      const sanitizedMessage = message.trim().substring(0, 500);
      
      const response = await apiRequest('/api/skinchef/chat', {
        method: 'POST',
        body: { message: sanitizedMessage }
      });
      return response;
    },
    onSuccess: (response) => {
      setIsTyping(false);
      const newMessage: Message = {
        id: Date.now().toString() + '_skinchef',
        content: response.response,
        sender: 'skinchef',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
    },
    onError: (error) => {
      setIsTyping(false);
      console.error('Error en chat con SkinChef:', error);
      const errorMessage: Message = {
        id: Date.now().toString() + '_error',
        content: '¡Ups! 😅 Algo salió mal en la cocina. Por favor intenta de nuevo.',
        sender: 'skinchef',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || chatMutation.isPending) return;

    // Verificar límite freemium
    if (!canUse) {
      setShowPaywall(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString() + '_user',
      content: currentMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Incrementar contador y enviar mensaje
    if (incrementUsage()) {
      chatMutation.mutate(currentMessage.trim());
      setCurrentMessage('');
    } else {
      setShowPaywall(true);
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    // Verificar límite freemium
    if (!canUse) {
      setShowPaywall(true);
      return;
    }

    setCurrentMessage(suggestion);
    const userMessage: Message = {
      id: Date.now().toString() + '_user',
      content: suggestion,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Incrementar contador y enviar
    if (incrementUsage()) {
      chatMutation.mutate(suggestion);
    } else {
      setShowPaywall(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-chalk text-xl">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-16 bg-transparent max-w-2xl mx-auto text-center">
          <h2 className="text-5xl text-chalk-white mb-8">Acceso Requerido</h2>
          <p className="text-chalk mb-12 text-2xl">
            Necesitas iniciar sesión para chatear con SkinChef
          </p>
          <Link href="/login">
            <button className="btn-primary-chalk text-2xl px-12 py-6">
              Iniciar Sesión
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="glass-container m-4 mb-0 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-4 text-4xl">🍳</div>
          <div className="absolute bottom-2 left-4 text-2xl">👨‍🍳</div>
          <div className="absolute top-1/2 right-1/4 text-xl">✨</div>
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-chalk-green to-emerald-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl text-chalk-white flex items-center gap-2">
                SkinChef 
                <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
              </h1>
              <p className="text-chalk text-sm">Tu Asistente Culinario Personal</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">En línea</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-chalk-white font-semibold flex items-center gap-2">
              {user?.firstName}
              <Heart className="h-4 w-4 text-red-400" />
            </p>
            <p className="text-chalk text-sm">Chef en Entrenamiento</p>
            <div className="flex gap-1 mt-1">
              {[...Array(3)].map((_, i) => (
                <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Suggestions */}
      {messages.length === 1 && (
        <div className="p-4 pb-2">
          <p className="text-chalk text-sm mb-3 text-center">💡 Sugerencias rápidas:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQuickSuggestion(suggestion)}
                className="px-3 py-2 bg-chalk-green/20 text-chalk text-xs rounded-full hover:bg-chalk-green/30 transition-all duration-200 transform hover:scale-105 border border-chalk-green/30"
                disabled={chatMutation.isPending}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {message.sender === 'skinchef' && (
              <div className="w-8 h-8 bg-gradient-to-r from-chalk-green to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg animate-bounce-slow">
                <ChefHat className="h-4 w-4 text-white" />
              </div>
            )}
            
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none'
                  : 'glass-container rounded-bl-none border border-chalk-green/30'
              }`}
            >
              <p className={`text-sm leading-relaxed ${message.sender === 'user' ? 'text-white' : 'text-chalk'}`}>
                {message.content}
              </p>
              <div className="flex items-center justify-between mt-2">
                <p className={`text-xs ${
                  message.sender === 'user' ? 'text-white/70' : 'text-chalk/60'
                }`}>
                  {message.timestamp.toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
                {message.sender === 'skinchef' && (
                  <Coffee className="h-3 w-3 text-chalk-green opacity-50" />
                )}
              </div>
            </div>

            {message.sender === 'user' && (
              <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3 justify-start animate-fadeIn">
            <div className="w-8 h-8 bg-gradient-to-r from-chalk-green to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse shadow-lg">
              <ChefHat className="h-4 w-4 text-white" />
            </div>
            <div className="glass-container max-w-xs lg:max-w-md px-4 py-3 rounded-2xl rounded-bl-none border border-chalk-green/30">
              <p className="text-chalk text-sm mb-2">🍳 SkinChef está cocinando una respuesta...</p>
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-chalk-green rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-chalk-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-chalk-green rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="glass-container border border-chalk-green/30 shadow-xl">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="🍳 Solo temas de cocina: recetas, ingredientes, técnicas..."
                className="input-chalk rounded-xl border-2 border-chalk-green/20 focus:border-chalk-green/50 transition-all duration-300"
                disabled={chatMutation.isPending}
              />
            </div>
            <button
              type="submit"
              disabled={!currentMessage.trim() || chatMutation.isPending}
              className="btn-primary-chalk px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          
          {/* Fun stats */}
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-chalk-green/20">
            <div className="flex items-center gap-4 text-xs text-chalk/60">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {messages.length - 1} conversaciones
              </span>
              <span className="flex items-center gap-1">
                <Coffee className="h-3 w-3" />
                Siempre disponible
              </span>
            </div>
            <div className="text-xs text-chalk/40">
              Powered by AI 🤖
            </div>
          </div>
        </form>
      </div>
      
      {/* Paywall Dialog para límite freemium */}
      <PaywallDialog 
        open={showPaywall} 
        onOpenChange={setShowPaywall}
        reason="usage_limit"
        usageCount={usageCount}
        maxUsage={dailyLimit}
      />
    </div>
  );
}