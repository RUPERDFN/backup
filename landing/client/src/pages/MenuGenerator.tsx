import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ObjectUploader } from "@/components/ObjectUploader";
import { HelpTooltip } from "@/components/HelpTooltip";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useUsageLimit } from "@/hooks/useUsageLimit";
import { PaywallDialog } from "@/components/PaywallDialog";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useLocation} from "wouter";
import { 
  Sparkles, 
  Camera, 
  Clock, 
  Users, 
  DollarSign, 
  ChefHat, 
  Calendar,
  ShoppingCart,
  Utensils,
  Heart,
  Loader2,
  Check,
  X
} from "lucide-react";

const menuPreferencesSchema = z.object({
  dietaryRestrictions: z.array(z.string()).default([]),
  budget: z.string().min(1, "Selecciona un presupuesto"),
  cookingTime: z.string().min(1, "Selecciona tiempo de cocina"),
  servings: z.number().min(1).max(10).default(4),
  cuisine: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  availableIngredients: z.array(z.string()).optional(),
  favorites: z.array(z.string()).optional(),
  dislikes: z.array(z.string()).optional(),
  daysToGenerate: z.number().min(1).max(7).default(7),
  mealsPerDay: z.number().min(3).max(5).default(3),
});

type MenuPreferences = z.infer<typeof menuPreferencesSchema>;

const dietaryOptions = [
  { id: "vegetarian", label: "Vegetariano" },
  { id: "vegan", label: "Vegano" },
  { id: "glutenFree", label: "Sin Gluten" },
  { id: "keto", label: "Keto" },
  { id: "paleo", label: "Paleo" },
  { id: "lowCarb", label: "Bajo en Carbohidratos" },
];

const cuisineOptions = [
  { id: "mediterranean", label: "Mediterránea" },
  { id: "asian", label: "Asiática" },
  { id: "mexican", label: "Mexicana" },
  { id: "italian", label: "Italiana" },
  { id: "indian", label: "India" },
  { id: "american", label: "Americana" },
];

const allergyOptions = [
  { id: "nuts", label: "Frutos secos" },
  { id: "dairy", label: "Lácteos" },
  { id: "eggs", label: "Huevos" },
  { id: "soy", label: "Soja" },
  { id: "shellfish", label: "Mariscos" },
  { id: "fish", label: "Pescado" },
];

export default function MenuGenerator() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [generatedMenu, setGeneratedMenu] = useState(null);
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [activeTab, setActiveTab] = useState("generator");
  const [, setLocation] = useLocation();
  const [showPaywall, setShowPaywall] = useState(false);
  
  // Sistema de límite freemium: 3 generaciones/día para FREE
  const { usageCount, dailyLimit, canUse, incrementUsage, isPremium } = useUsageLimit({ 
    dailyLimit: 3, 
    feature: 'menu' 
  });
  
  // Check if coming from questionnaire completion with auto-generate
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const autoGenerate = urlParams.get('autoGenerate');
    const questionnaireData = localStorage.getItem('questionnaireData');
    
    if (autoGenerate === 'true' && questionnaireData) {
      try {
        const data = JSON.parse(questionnaireData);
        console.log('Auto-generating menu from questionnaire data:', data);
        autoGenerateFromQuestionnaire(data);
        
        // Clear URL parameter but keep questionnaire data for now
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error('Error parsing questionnaire data:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del cuestionario.",
          variant: "destructive",
        });
      }
    }
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const form = useForm<MenuPreferences>({
    resolver: zodResolver(menuPreferencesSchema),
    defaultValues: {
      dietaryRestrictions: [],
      budget: "",
      cookingTime: "",
      servings: 4,
      cuisine: [],
      allergies: [],
    },
  });

  const generateMenuMutation = useMutation({
    mutationFn: async (preferences: MenuPreferences) => {
      const response = await apiRequest("/api/generate-menu", {
        method: "POST",
        body: JSON.stringify(preferences),
        headers: { "Content-Type": "application/json" }
      });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedMenu(data);
      queryClient.invalidateQueries({ queryKey: ["/api/menu-plans"] });
      toast({
        title: "¡Menú generado!",
        description: "Tu menú semanal personalizado está listo.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "No se pudo generar el menú. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const recognizeFoodMutation = useMutation({
    mutationFn: async (imageUrl: string) => {
      const response = await apiRequest("/api/recognize-food", {
        method: "POST",
        body: { imageUrl }
      });
      return response;
    },
    onSuccess: (data) => {
      setRecognitionResult(data);
      toast({
        title: "¡Ingredientes reconocidos!",
        description: "Hemos identificado los alimentos en tu imagen.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "No se pudieron reconocer los ingredientes. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const setFoodImageMutation = useMutation({
    mutationFn: async (imageURL: string) => {
      const response = await apiRequest("/api/food-images", {
        method: "PUT",
        body: { imageURL }
      });
      return response;
    },
    onSuccess: (data) => {
      // After setting the image ACL, proceed with recognition
      recognizeFoodMutation.mutate(data.objectPath);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo procesar la imagen. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const getUploadParameters = async () => {
    const data = await apiRequest("/api/objects/upload", {
      method: "POST"
    });
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = (result: any) => {
    if (result.successful && result.successful.length > 0) {
      const uploadURL = result.successful[0].uploadURL;
      setFoodImageMutation.mutate(uploadURL);
    }
  };

  const autoGenerateFromQuestionnaire = (questionnaireData: any) => {
    const preferences: MenuPreferences = {
      budget: questionnaireData.budget?.toString() || "100",
      servings: questionnaireData.people || 4,
      dietaryRestrictions: questionnaireData.dietType ? [questionnaireData.dietType] : [],
      allergies: questionnaireData.allergies && questionnaireData.allergies !== 'ninguna' 
        ? questionnaireData.allergies.split(',').map((a: string) => a.trim()).filter(Boolean)
        : [],
      cookingTime: questionnaireData.mealsPerDay > 2 ? 'medium' : 'quick',
      cuisine: ['mediterranean'],
      availableIngredients: questionnaireData.recognizedIngredients && 
        !questionnaireData.recognizedIngredients.includes('no hay ingredientes disponibles')
        ? questionnaireData.recognizedIngredients 
        : [],
      favorites: questionnaireData.favorites && questionnaireData.favorites !== 'ninguno especificado'
        ? questionnaireData.favorites.split(',').map((f: string) => f.trim()).filter(Boolean)
        : [],
      dislikes: questionnaireData.dislikes && questionnaireData.dislikes !== 'ninguno'
        ? questionnaireData.dislikes.split(',').map((d: string) => d.trim()).filter(Boolean)
        : [],
      daysToGenerate: questionnaireData.days || 7,
      mealsPerDay: questionnaireData.mealsPerDay || 3
    };
    
    console.log('Generating menu with questionnaire preferences:', preferences);
    
    // Verificar límite antes de auto-generar
    if (!canUse) {
      setShowPaywall(true);
      return;
    }
    
    if (incrementUsage()) {
      generateMenuMutation.mutate(preferences);
    } else {
      setShowPaywall(true);
    }
  };

  const onSubmit = (data: MenuPreferences) => {
    // Verificar límite freemium antes de generar
    if (!canUse) {
      setShowPaywall(true);
      return;
    }
    
    // Incrementar contador y generar
    if (incrementUsage()) {
      generateMenuMutation.mutate(data);
    } else {
      setShowPaywall(true);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <ChefHat className="animate-spin mx-auto mb-4 text-chalk-green" size={48} />
            <p className="text-chalk/70">Cargando generador de menús...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-handwritten text-4xl md:text-6xl font-bold text-chalk-yellow mb-4">
              Generador de Menús IA
            </h1>
            <p className="text-lg text-chalk/80">
              Crea menús personalizados o reconoce ingredientes con IA
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-blackboard-light border border-chalk/20">
              <TabsTrigger 
                value="generator" 
                className="data-[state=active]:bg-chalk-green data-[state=active]:text-blackboard text-chalk"
              >
                <Sparkles className="mr-2" size={16} />
                Generar Menú
              </TabsTrigger>
              <TabsTrigger 
                value="photo" 
                className="data-[state=active]:bg-chalk-yellow data-[state=active]:text-blackboard text-chalk"
              >
                <Camera className="mr-2" size={16} />
                Reconocer Alimentos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generator">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <Card className="recipe-card">
                  <CardHeader>
                    <CardTitle className="text-chalk-yellow font-handwritten text-2xl">
                      Preferencias del Menú
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Dietary Restrictions */}
                        <FormField
                          control={form.control}
                          name="dietaryRestrictions"
                          render={() => (
                            <FormItem>
                              <FormLabel className="text-chalk font-semibold">Restricciones Dietéticas</FormLabel>
                              <div className="grid grid-cols-2 gap-3">
                                {dietaryOptions.map((option) => (
                                  <FormField
                                    key={option.id}
                                    control={form.control}
                                    name="dietaryRestrictions"
                                    render={({ field }) => (
                                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(option.id)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, option.id])
                                                : field.onChange(
                                                    field.value?.filter((value) => value !== option.id)
                                                  );
                                            }}
                                            className="border-chalk data-[state=checked]:bg-chalk-green"
                                          />
                                        </FormControl>
                                        <FormLabel className="text-sm text-chalk">
                                          {option.label}
                                        </FormLabel>
                                      </FormItem>
                                    )}
                                  />
                                ))}
                              </div>
                            </FormItem>
                          )}
                        />

                        {/* Budget */}
                        <FormField
                          control={form.control}
                          name="budget"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="text-chalk font-semibold">Presupuesto Semanal</FormLabel>
                                <HelpTooltip content="Selecciona tu presupuesto semanal aproximado para ingredientes. Esto nos ayudará a sugerir recetas que se ajusten a tu economía." />
                              </div>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-blackboard border-chalk/30 text-chalk">
                                    <SelectValue placeholder="Selecciona tu rango" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-blackboard border-chalk/30">
                                  <SelectItem value="50">€50 - €75</SelectItem>
                                  <SelectItem value="75">€75 - €100</SelectItem>
                                  <SelectItem value="100">€100 - €150</SelectItem>
                                  <SelectItem value="150">€150+</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Cooking Time */}
                        <FormField
                          control={form.control}
                          name="cookingTime"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="text-chalk font-semibold">Tiempo de Cocina</FormLabel>
                                <HelpTooltip content="¿Cuánto tiempo puedes dedicar a cocinar cada día? Recetas rápidas (<30 min), medias (30-60 min), o elaboradas (>60 min)." />
                              </div>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="grid grid-cols-3 gap-3"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="quick" id="quick" className="border-chalk text-chalk-green" />
                                    <label htmlFor="quick" className="text-sm text-chalk">&lt; 30 min</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="medium" id="medium" className="border-chalk text-chalk-green" />
                                    <label htmlFor="medium" className="text-sm text-chalk">30-60 min</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="elaborate" id="elaborate" className="border-chalk text-chalk-green" />
                                    <label htmlFor="elaborate" className="text-sm text-chalk">&gt; 60 min</label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Servings */}
                        <FormField
                          control={form.control}
                          name="servings"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="text-chalk font-semibold">Número de Porciones</FormLabel>
                                <HelpTooltip content="¿Para cuántas personas cocinas? Las recetas se ajustarán automáticamente a la cantidad de porciones." />
                              </div>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  max={10}
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  className="bg-blackboard border-chalk/30 text-chalk"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Cuisine Preferences */}
                        <FormField
                          control={form.control}
                          name="cuisine"
                          render={() => (
                            <FormItem>
                              <FormLabel className="text-chalk font-semibold">Preferencias de Cocina</FormLabel>
                              <div className="grid grid-cols-2 gap-3">
                                {cuisineOptions.map((option) => (
                                  <FormField
                                    key={option.id}
                                    control={form.control}
                                    name="cuisine"
                                    render={({ field }) => (
                                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(option.id)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, option.id])
                                                : field.onChange(
                                                    field.value?.filter((value) => value !== option.id)
                                                  );
                                            }}
                                            className="border-chalk data-[state=checked]:bg-chalk-yellow"
                                          />
                                        </FormControl>
                                        <FormLabel className="text-sm text-chalk">
                                          {option.label}
                                        </FormLabel>
                                      </FormItem>
                                    )}
                                  />
                                ))}
                              </div>
                            </FormItem>
                          )}
                        />

                        {/* Allergies */}
                        <FormField
                          control={form.control}
                          name="allergies"
                          render={() => (
                            <FormItem>
                              <FormLabel className="text-chalk font-semibold">Alergias</FormLabel>
                              <div className="grid grid-cols-2 gap-3">
                                {allergyOptions.map((option) => (
                                  <FormField
                                    key={option.id}
                                    control={form.control}
                                    name="allergies"
                                    render={({ field }) => (
                                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(option.id)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, option.id])
                                                : field.onChange(
                                                    field.value?.filter((value) => value !== option.id)
                                                  );
                                            }}
                                            className="border-chalk data-[state=checked]:bg-chalk-red"
                                          />
                                        </FormControl>
                                        <FormLabel className="text-sm text-chalk">
                                          {option.label}
                                        </FormLabel>
                                      </FormItem>
                                    )}
                                  />
                                ))}
                              </div>
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          className="w-full bg-chalk-green text-blackboard hover:bg-opacity-80 transition-all duration-200"
                          disabled={generateMenuMutation.isPending}
                        >
                          {generateMenuMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 animate-spin" size={16} />
                              Generando Menú...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2" size={16} />
                              Generar Mi Menú Semanal
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                {/* Results Section */}
                <Card className="recipe-card">
                  <CardHeader>
                    <CardTitle className="text-chalk-yellow font-handwritten text-2xl">
                      {generatedMenu ? "Tu Menú Semanal" : "Vista Previa"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {generateMenuMutation.isPending ? (
                      <div className="text-center py-12">
                        <Loader2 className="animate-spin mx-auto mb-4 text-chalk-green" size={48} />
                        <p className="text-chalk/70">Generando tu menú personalizado...</p>
                        <p className="text-chalk/50 text-sm mt-2">Esto puede tomar unos momentos</p>
                      </div>
                    ) : generatedMenu ? (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-chalk">{(generatedMenu as any).menuPlan?.name || 'Menú Personalizado'}</h3>
                          <Badge className="bg-chalk-green text-blackboard">
                            €{(generatedMenu as any).shoppingList?.totalEstimatedCost?.toFixed(2) || '0.00'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {((generatedMenu as any).recipes || []).map((recipe: any, index: number) => (
                            <div key={index} className="p-4 bg-blackboard rounded-lg border border-chalk/20">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-semibold text-chalk-yellow">
                                    {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"][recipe.dayOfWeek]} - {recipe.mealType}
                                  </h4>
                                  <p className="text-chalk font-medium">{recipe.name}</p>
                                </div>
                                <div className="text-right text-sm text-chalk/60">
                                  <div className="flex items-center">
                                    <Clock size={12} className="mr-1" />
                                    {recipe.cookingTime} min
                                  </div>
                                  <div className="flex items-center mt-1">
                                    <Users size={12} className="mr-1" />
                                    {recipe.servings} porciones
                                  </div>
                                </div>
                              </div>
                              <p className="text-chalk/80 text-sm mb-3">{recipe.description}</p>
                              <div className="flex justify-between text-xs">
                                <span className="text-chalk-green">
                                  {recipe.nutritionInfo?.calories} kcal
                                </span>
                                <span className="text-chalk/60">
                                  P: {recipe.nutritionInfo?.protein}g | C: {recipe.nutritionInfo?.carbs}g | G: {recipe.nutritionInfo?.fat}g
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <Separator className="bg-chalk/20" />

                        <div className="text-center">
                          <Button 
                            onClick={() => window.location.href = `/dashboard?menu=${(generatedMenu as any).menuPlan?.id || ''}`}
                            className="bg-chalk-yellow text-blackboard hover:bg-opacity-80"
                          >
                            <Calendar className="mr-2" size={16} />
                            Ver Menú Completo
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <ChefHat className="mx-auto mb-4 text-chalk/40" size={48} />
                        <p className="text-chalk/60 mb-4">Completa el formulario para generar tu menú</p>
                        <p className="text-chalk/50 text-sm">La IA creará un plan personalizado basado en tus preferencias</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="photo">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Section */}
                <Card className="recipe-card">
                  <CardHeader>
                    <CardTitle className="text-chalk-yellow font-handwritten text-2xl">
                      Reconocimiento de Alimentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="border-2 border-dashed border-chalk/30 rounded-xl p-8 hover:border-chalk-green transition-colors duration-200 mb-6">
                        <Camera className="mx-auto mb-4 text-chalk/50" size={64} />
                        <h3 className="font-handwritten text-xl font-bold text-chalk-yellow mb-2">
                          Sube una Foto
                        </h3>
                        <p className="text-chalk/80 mb-4">
                          Sube una imagen de ingredientes y nuestra IA los identificará
                        </p>
                        <ObjectUploader
                          maxNumberOfFiles={1}
                          maxFileSize={10485760}
                          onGetUploadParameters={getUploadParameters}
                          onComplete={handleUploadComplete}
                        >
                          <Camera className="mr-2" size={16} />
                          Seleccionar Imagen
                        </ObjectUploader>
                      </div>
                      
                      {(recognizeFoodMutation.isPending || setFoodImageMutation.isPending) && (
                        <div className="text-center py-4">
                          <Loader2 className="animate-spin mx-auto mb-2 text-chalk-green" size={32} />
                          <p className="text-chalk/70 text-sm">
                            {setFoodImageMutation.isPending ? "Procesando imagen..." : "Reconociendo ingredientes..."}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Results Section */}
                <Card className="recipe-card">
                  <CardHeader>
                    <CardTitle className="text-chalk-yellow font-handwritten text-2xl">
                      Ingredientes Detectados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recognitionResult ? (
                      <div className="space-y-6">
                        <div className="space-y-3">
                          {((recognitionResult as any).recognizedItems || []).map((item: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-blackboard rounded-lg border border-chalk/20">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-chalk-green rounded-full flex items-center justify-center">
                                  <Check className="text-blackboard" size={16} />
                                </div>
                                <span className="text-chalk font-medium">{item.name}</span>
                                <Badge variant="outline" className="text-xs border-chalk/30 text-chalk/70">
                                  {item.category}
                                </Badge>
                              </div>
                              <span className="text-chalk-green text-sm font-semibold">
                                {Math.round(item.confidence * 100)}% confianza
                              </span>
                            </div>
                          ))}
                        </div>

                        <Separator className="bg-chalk/20" />

                        <div>
                          <h4 className="font-semibold text-chalk-green mb-4">Recetas Sugeridas:</h4>
                          <div className="space-y-3">
                            {((recognitionResult as any).suggestedRecipes || []).map((recipe: any, index: number) => (
                              <div key={index} className="p-4 bg-chalk-green/10 rounded-lg border border-chalk-green/30">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-semibold text-chalk">{recipe.name}</h5>
                                  <div className="flex items-center text-xs text-chalk/60">
                                    <Clock size={12} className="mr-1" />
                                    {recipe.cookingTime} min
                                  </div>
                                </div>
                                <p className="text-chalk/80 text-sm mb-3">{recipe.description}</p>
                                <div className="flex items-center justify-between">
                                  <Badge className="bg-chalk-yellow text-blackboard text-xs">
                                    {recipe.difficulty}
                                  </Badge>
                                  <div className="flex flex-wrap gap-1">
                                    {(recipe.mainIngredients || []).slice(0, 3).map((ingredient: string, i: number) => (
                                      <span key={i} className="text-xs text-chalk-green">
                                        {ingredient}{i < 2 && i < recipe.mainIngredients.length - 1 ? ", " : ""}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Camera className="mx-auto mb-4 text-chalk/40" size={48} />
                        <p className="text-chalk/60 mb-4">Sube una imagen para comenzar</p>
                        <p className="text-chalk/50 text-sm">
                          Identificaremos automáticamente los ingredientes y sugeriremos recetas
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Paywall Dialog para límite freemium */}
      <PaywallDialog 
        open={showPaywall} 
        onOpenChange={setShowPaywall}
        reason="usage_limit"
        usageCount={usageCount}
        maxUsage={dailyLimit}
      />
    </Layout>
  );
}
