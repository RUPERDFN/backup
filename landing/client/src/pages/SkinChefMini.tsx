import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Send, Sparkles, Clock, Utensils } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface QuickSuggestion {
  id: string;
  text: string;
  category: 'ingredient' | 'technique' | 'substitution' | 'timing';
  response: string;
}

const quickSuggestions: QuickSuggestion[] = [
  {
    id: 'sub-salt',
    text: '¿Sustituto para sal?',
    category: 'substitution',
    response: 'Puedes usar hierbas frescas como romero, tomillo o orégano. También sal de apio, limón o vinagre balsámico para dar sabor.'
  },
  {
    id: 'time-pasta',
    text: 'Tiempo pasta al dente',
    category: 'timing', 
    response: 'Resta 1-2 minutos al tiempo del paquete. Prueba frecuentemente. Debe estar firme al morder pero cocida por dentro.'
  },
  {
    id: 'tech-sofrito',
    text: '¿Cómo hacer sofrito?',
    category: 'technique',
    response: 'Pocha cebolla a fuego lento 10-15 min hasta transparente. Añade ajo 2 min. Incorpora tomate y cocina hasta concentrar.'
  },
  {
    id: 'ing-replace',
    text: 'No tengo mantequilla',
    category: 'ingredient',
    response: 'Puedes usar aceite de oliva (3/4 partes), aguacate maduro, yogur griego o margarina vegetal en la misma cantidad.'
  }
];

export default function SkinChefMini() {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [isMinimized, setIsMinimized] = useState(false);

  const askMutation = useMutation({
    mutationFn: (query: string) => apiRequest('/api/skinchef/quick-answer', {
      method: 'POST',
      body: { question: query }
    }),
    onSuccess: (response) => {
      setConversation(prev => [...prev, 
        { role: 'user', content: question },
        { role: 'assistant', content: response.answer || 'Te ayudo con eso. Para recetas específicas, usa el SkinChef completo.' }
      ]);
      setQuestion('');
    },
    onError: () => {
      setConversation(prev => [...prev,
        { role: 'user', content: question },
        { role: 'assistant', content: 'Perdón, no puedo responder ahora. ¿Probamos una sugerencia rápida?' }
      ]);
      setQuestion('');
    }
  });

  const handleQuickSuggestion = (suggestion: QuickSuggestion) => {
    setConversation(prev => [...prev,
      { role: 'user', content: suggestion.text },
      { role: 'assistant', content: suggestion.response }
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    askMutation.mutate(question);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ingredient': return <Utensils className="w-3 h-3" />;
      case 'technique': return <ChefHat className="w-3 h-3" />;
      case 'substitution': return <Sparkles className="w-3 h-3" />;
      case 'timing': return <Clock className="w-3 h-3" />;
      default: return <ChefHat className="w-3 h-3" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ingredient': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'technique': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'substitution': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'timing': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-14 h-14 bg-chalk-green text-dark-green hover:bg-chalk-green/80 shadow-lg"
        >
          <ChefHat className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="glass-container border-chalk-green/30 shadow-xl">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-chalk-green" />
              <span className="font-bold text-chalk-white">SkinChef Mini</span>
            </div>
            <div className="flex gap-1">
              <Button
                onClick={() => setIsMinimized(true)}
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 text-chalk/60 hover:text-chalk"
              >
                –
              </Button>
            </div>
          </div>

          {/* Quick Suggestions */}
          {conversation.length === 0 && (
            <div className="mb-4">
              <div className="text-xs text-chalk/60 mb-2">Dudas frecuentes:</div>
              <div className="grid grid-cols-2 gap-1">
                {quickSuggestions.map((suggestion) => (
                  <Button
                    key={suggestion.id}
                    onClick={() => handleQuickSuggestion(suggestion)}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-2 px-2 text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
                  >
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(suggestion.category)}
                      <span className="truncate">{suggestion.text}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Conversation */}
          {conversation.length > 0 && (
            <div className="mb-4 max-h-48 overflow-y-auto space-y-2">
              {conversation.slice(-4).map((message, index) => (
                <div key={index} className={`p-2 rounded text-xs ${
                  message.role === 'user' 
                    ? 'bg-chalk-green/20 text-chalk-white ml-4' 
                    : 'bg-black/20 text-chalk/80 mr-4'
                }`}>
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-1 mb-1">
                      <ChefHat className="w-3 h-3 text-chalk-green" />
                      <span className="text-chalk-green text-xs">SkinChef</span>
                    </div>
                  )}
                  {message.content}
                </div>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="¿Cómo cocino...?"
              className="text-chalk border-chalk-green/30 text-sm"
              disabled={askMutation.isPending}
            />
            <Button
              type="submit"
              disabled={askMutation.isPending || !question.trim()}
              className="bg-chalk-green text-dark-green hover:bg-chalk-green/80 px-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>

          {conversation.length > 0 && (
            <div className="mt-2 text-center">
              <Button
                onClick={() => setConversation([])}
                variant="ghost"
                size="sm"
                className="text-xs text-chalk/60 hover:text-chalk"
              >
                Limpiar chat
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}