import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Upload, Clock, AlertTriangle, CheckCircle, ChefHat, Calendar } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface DetectedIngredient {
  name: string;
  confidence: number;
  estimatedWeight: string;
  estimatedExpiryDate: string;
  expiryDays: number;
  condition: 'fresh' | 'good' | 'near_expiry' | 'expired';
  category: string;
}

interface AntiWasteRecipe {
  id: string;
  name: string;
  description: string;
  ingredients: Array<{
    name: string;
    amount: string;
    isFromFridge: boolean;
    priority: 'high' | 'medium' | 'low';
  }>;
  instructions: string[];
  cookingTime: number;
  difficulty: string;
  expiryScore: number;
  wasteReduction: string;
}

export default function FridgeVision() {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const visionMutation = useMutation({
    mutationFn: (imageBase64: string) => apiRequest('/api/fridge/vision', {
      method: 'POST',
      body: {
        imageBase64,
        detectionMode: 'detailed'
      }
    }),
    onSuccess: () => {
      toast({
        title: "Análisis Completado",
        description: "Tu nevera ha sido analizada. ¡Revisa las recetas anti-desperdicio!",
      });
    },
    onError: () => {
      toast({
        title: "Error en el Análisis",
        description: "No se pudo procesar la imagen. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  });

  const weeklyRescueMutation = useMutation({
    mutationFn: (detectedIngredients: DetectedIngredient[]) => apiRequest('/api/fridge/weekly-rescue', {
      method: 'POST',
      body: {
        detectedIngredients,
        servings: 2,
        daysToGenerate: 7
      }
    }),
    onSuccess: () => {
      toast({
        title: "Plan Semanal Creado",
        description: "Tu plan anti-desperdicio para toda la semana está listo.",
      });
    }
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setSelectedImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    
    // Convert to base64 without data URL prefix
    const base64 = selectedImage.split(',')[1];
    visionMutation.mutate(base64);
  };

  const handleWeeklyRescue = () => {
    if (visionMutation.data?.detection?.ingredients) {
      weeklyRescueMutation.mutate(visionMutation.data.detection.ingredients);
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'fresh': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'good': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'near_expiry': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'expired': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'fresh': return <CheckCircle className="w-4 h-4" />;
      case 'good': return <Clock className="w-4 h-4" />;
      case 'near_expiry': return <AlertTriangle className="w-4 h-4" />;
      case 'expired': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-green via-black to-dark-green p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Camera className="w-10 h-10 text-chalk-green" />
            <h1 className="text-4xl font-bold text-chalk-white">Vision Nevera 2.0</h1>
          </div>
          <p className="text-chalk/70 text-lg">
            Detecta ingredientes, fechas de caducidad y genera recetas anti-desperdicio
          </p>
        </div>

        {/* Upload Section */}
        <Card className="glass-container border-chalk-green/30 mb-6">
          <CardHeader>
            <CardTitle className="text-chalk-white flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Analizar Tu Nevera
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="image-upload" className="text-chalk mb-2 block">
                Sube una foto de tu nevera o despensa
              </Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-chalk border-chalk-green/30"
              />
            </div>

            {selectedImage && (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Imagen de nevera"
                    className="w-full max-h-64 object-cover rounded-lg border border-chalk-green/30"
                  />
                </div>
                <Button
                  onClick={handleAnalyze}
                  disabled={visionMutation.isPending}
                  className="w-full bg-chalk-green text-dark-green hover:bg-chalk-green/80"
                >
                  {visionMutation.isPending ? 'Analizando...' : 'Analizar Ingredientes'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {visionMutation.data && (
          <>
            {/* Detection Summary */}
            <Card className="glass-container border-chalk-green/30 mb-6">
              <CardHeader>
                <CardTitle className="text-chalk-white">Ingredientes Detectados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-black/20 rounded-lg border border-chalk-green/20">
                    <div className="text-2xl font-bold text-chalk-green">
                      {visionMutation.data.detection.totalDetected}
                    </div>
                    <div className="text-chalk/60">Total detectados</div>
                  </div>
                  <div className="text-center p-4 bg-black/20 rounded-lg border border-chalk-green/20">
                    <div className="text-2xl font-bold text-yellow-400">
                      {visionMutation.data.detection.expiringCount}
                    </div>
                    <div className="text-chalk/60">Por caducar</div>
                  </div>
                  <div className="text-center p-4 bg-black/20 rounded-lg border border-chalk-green/20">
                    <div className="text-2xl font-bold text-chalk-green">
                      {visionMutation.data.recipes.totalRecipes}
                    </div>
                    <div className="text-chalk/60">Recetas sugeridas</div>
                  </div>
                  <div className="text-center p-4 bg-black/20 rounded-lg border border-chalk-green/20">
                    <div className="text-sm font-bold text-chalk-green">
                      {visionMutation.data.detection.processingTime}
                    </div>
                    <div className="text-chalk/60">Tiempo análisis</div>
                  </div>
                </div>

                {/* Ingredients List */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {visionMutation.data.detection.ingredients.map((ingredient: DetectedIngredient, index: number) => (
                    <div
                      key={index}
                      className="p-4 bg-black/20 rounded-lg border border-chalk-green/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-chalk-white">{ingredient.name}</h3>
                        <Badge className={`${getConditionColor(ingredient.condition)} border`}>
                          {getConditionIcon(ingredient.condition)}
                          <span className="ml-1 capitalize">{ingredient.condition}</span>
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-chalk/60">
                        <div>Peso: {ingredient.estimatedWeight}</div>
                        <div>Caduca: {ingredient.estimatedExpiryDate}</div>
                        <div>En {ingredient.expiryDays} días</div>
                        <div>Confianza: {ingredient.confidence.toFixed(0)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Anti-Waste Recipes */}
            {visionMutation.data.recipes.antiWaste.length > 0 && (
              <Card className="glass-container border-chalk-green/30 mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-chalk-white flex items-center gap-2">
                      <ChefHat className="w-5 h-5" />
                      Recetas Anti-Desperdicio
                    </CardTitle>
                    <Badge className="bg-chalk-green text-dark-green">
                      5 recetas generadas
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {visionMutation.data.recipes.antiWaste.map((recipe: AntiWasteRecipe, index: number) => (
                      <div
                        key={index}
                        className="p-4 bg-black/20 rounded-lg border border-chalk-green/20"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-chalk-white">{recipe.name}</h3>
                          <Badge variant="outline" className="text-chalk-green border-chalk-green/30">
                            {recipe.cookingTime}min
                          </Badge>
                        </div>
                        <p className="text-sm text-chalk/60 mb-3">{recipe.description}</p>
                        <div className="text-xs text-chalk-green mb-2">{recipe.wasteReduction}</div>
                        <div className="flex items-center gap-2 text-xs text-chalk/60">
                          <span>Dificultad: {recipe.difficulty}</span>
                          <span>•</span>
                          <span>Score: {recipe.expiryScore}/5</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Weekly Rescue Plan */}
            <Card className="glass-container border-chalk-green/30">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="w-8 h-8 text-chalk-green" />
                    <h2 className="text-2xl font-bold text-chalk-white">
                      Plan Semanal Anti-Desperdicio
                    </h2>
                  </div>
                  <p className="text-chalk/60">
                    Usa todos estos ingredientes durante toda la semana con un plan personalizado
                  </p>
                  <Button
                    onClick={handleWeeklyRescue}
                    disabled={weeklyRescueMutation.isPending}
                    className="bg-chalk-green text-dark-green hover:bg-chalk-green/80 px-8 py-6 text-lg"
                  >
                    {weeklyRescueMutation.isPending ? 'Generando...' : 'Usar Restos Toda la Semana'}
                  </Button>
                  
                  {weeklyRescueMutation.data && (
                    <div className="mt-4 p-4 bg-black/20 rounded-lg border border-chalk-green/20">
                      <div className="text-chalk-green font-medium">Plan Semanal Creado</div>
                      <div className="text-sm text-chalk/60 mt-1">
                        {weeklyRescueMutation.data.plan}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}