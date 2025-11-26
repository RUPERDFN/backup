import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight, Camera, Upload, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionnaireData {
  budget: number;
  people: number;
  days: number;
  mealsPerDay: number;
  dietType: string;
  allergies: string;
  dislikes: string;
  favorites: string;
  recognizedIngredients: string[];
}

const TOTAL_STEPS = 9;

export default function Questionnaire() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<QuestionnaireData>({
    budget: 0,
    people: 0,
    days: 0,
    mealsPerDay: 0,
    dietType: '',
    allergies: '',
    dislikes: '',
    favorites: '',
    recognizedIngredients: []
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setLocation('/login');
    }
  }, [setLocation]);

  const updateData = (field: keyof QuestionnaireData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const analyzePhoto = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      // Optimize image for AI analysis: OpenAI Vision works best with images up to 1024x1024
      // but smaller sizes (512x512) are faster and still effective for food recognition
      const resizedFile = await resizeImage(file, 768, 768, 0.85);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(resizedFile);

      // Convert to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
        };
        reader.readAsDataURL(resizedFile);
      });

      // Call API to recognize ingredients
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ image: base64 })
      });

      if (!response.ok) {
        throw new Error('Error al analizar la imagen');
      }

      const result = await response.json();
      updateData('recognizedIngredients', result.ingredients || []);
    } catch (error) {
      console.error('Error analyzing photo:', error);
      
      // More informative error messages
      let errorMessage = 'Error al analizar la imagen.';
      if (error instanceof Error) {
        if (error.message.includes('Failed to load image')) {
          errorMessage = 'No se pudo cargar la imagen. Verifica que sea un archivo de imagen válido.';
        } else if (error.message.includes('Failed to compress image')) {
          errorMessage = 'Error al procesar la imagen. Intenta con una imagen diferente.';
        } else if (error.message.includes('Error al analizar')) {
          errorMessage = 'La IA no pudo analizar la imagen. Intenta con una foto más clara de los alimentos.';
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Function to resize images optimized for AI analysis
  const resizeImage = (file: File, maxWidth: number, maxHeight: number, quality: number): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = img;
        const aspectRatio = width / height;
        
        // Optimize for AI: prefer square-ish images for better recognition
        if (width > height) {
          if (width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
          }
        } else {
          if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }

        // Ensure minimum size for AI recognition (at least 224x224)
        const minSize = 224;
        if (width < minSize || height < minSize) {
          const scale = minSize / Math.min(width, height);
          width *= scale;
          height *= scale;
        }

        canvas.width = Math.round(width);
        canvas.height = Math.round(height);

        // Enable high-quality image scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image with high quality
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }
          
          const resizedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          
          // Log compression results
          console.log(`Image optimized: ${file.size} → ${resizedFile.size} bytes (${Math.round((1 - resizedFile.size / file.size) * 100)}% smaller)`);
          console.log(`Dimensions: ${img.width}x${img.height} → ${canvas.width}x${canvas.height}`);
          
          resolve(resizedFile);
        }, 'image/jpeg', quality);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      analyzePhoto(file);
    }
  };

  const removeIngredient = (ingredient: string) => {
    const updated = data.recognizedIngredients.filter(i => i !== ingredient);
    updateData('recognizedIngredients', updated);
  };

  const addCustomIngredient = (ingredient: string) => {
    if (ingredient.trim() && !data.recognizedIngredients.includes(ingredient.trim())) {
      updateData('recognizedIngredients', [...data.recognizedIngredients, ingredient.trim()]);
    }
  };

  const nextStep = () => {
    // Check if current step is valid before proceeding
    if (!canProceed()) {
      return; // Don't advance if current step is invalid
    }
    
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete questionnaire and generate menu directly from answers
      localStorage.setItem('questionnaireCompleted', 'true');
      
      // Sanitize data: set empty optionals to default values
      const cleanedData = {
        ...data,
        allergies: data.allergies.trim() || 'ninguna',
        dislikes: data.dislikes.trim() || 'ninguno',
        favorites: data.favorites.trim() || 'ninguno especificado',
        recognizedIngredients: data.recognizedIngredients.length > 0 
          ? data.recognizedIngredients 
          : ['no hay ingredientes disponibles']
      };
      
      localStorage.setItem('questionnaireData', JSON.stringify(cleanedData));
      
      // Redirect directly to menu generation page (showing loading state)
      setLocation('/menu-generated');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return data.budget > 0; // Obligatorio
      case 2: return data.people > 0; // Obligatorio
      case 3: return data.days > 0; // Obligatorio
      case 4: return data.mealsPerDay > 0; // Obligatorio
      case 5: return data.dietType !== ''; // Obligatorio
      case 6: return true; // Opcional: alergias
      case 7: return true; // Opcional: alimentos no deseados
      case 8: return true; // Opcional: alimentos favoritos
      case 9: return true; // Opcional: foto de nevera
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="glass-container max-w-2xl mx-auto">
            <h2 className="text-3xl text-chalk-white mb-6">
              ¿Cuál es tu presupuesto semanal para alimentación?
            </h2>
            <p className="text-chalk mb-8">
              Esto nos ayudará a sugerir opciones que se ajusten a tu economía
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[30, 50, 75, 100, 150, 200, 300, 500].map((amount) => (
                <button
                  key={amount}
                  onClick={() => updateData('budget', amount)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    data.budget === amount
                      ? 'border-chalk-green bg-chalk-green/20 text-chalk-white'
                      : 'border-chalk-green/30 text-chalk hover:border-chalk-green hover:bg-chalk-green/10'
                  }`}
                >
                  €{amount}
                </button>
              ))}
            </div>
            <div className="custom-amount">
              <label className="block text-chalk mb-2">O introduce tu cantidad:</label>
              <input
                type="number"
                value={data.budget || ''}
                onChange={(e) => updateData('budget', Number(e.target.value))}
                className="w-32 p-3 rounded-lg bg-black/30 border border-chalk-green/30 text-chalk-white text-center"
                placeholder="€"
                min="1"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="glass-container max-w-2xl mx-auto">
            <h2 className="text-3xl text-chalk-white mb-6">
              ¿Para cuántas personas vas a cocinar?
            </h2>
            <p className="text-chalk mb-8">
              Esto determinará las porciones y cantidades de ingredientes
            </p>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
                <button
                  key={count}
                  onClick={() => updateData('people', count)}
                  className={`p-4 rounded-lg border-2 transition-all aspect-square ${
                    data.people === count
                      ? 'border-chalk-green bg-chalk-green/20 text-chalk-white'
                      : 'border-chalk-green/30 text-chalk hover:border-chalk-green hover:bg-chalk-green/10'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
            <div className="custom-amount">
              <label className="block text-chalk mb-2">Más de 8 personas:</label>
              <input
                type="number"
                value={data.people > 8 ? data.people : ''}
                onChange={(e) => updateData('people', Number(e.target.value))}
                className="w-32 p-3 rounded-lg bg-black/30 border border-chalk-green/30 text-chalk-white text-center"
                placeholder="Número"
                min="1"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="glass-container max-w-2xl mx-auto">
            <h2 className="text-3xl text-chalk-white mb-6">
              ¿Para cuántos días quieres planificar?
            </h2>
            <p className="text-chalk mb-8">
              Elige entre planificar solo días laborables o toda la semana
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => updateData('days', 5)}
                className={`p-8 rounded-lg border-2 transition-all ${
                  data.days === 5
                    ? 'border-chalk-green bg-chalk-green/20 text-chalk-white'
                    : 'border-chalk-green/30 text-chalk hover:border-chalk-green hover:bg-chalk-green/10'
                }`}
              >
                <div className="text-3xl font-bold mb-2">Lunes a Viernes</div>
                <div className="text-lg">5 días laborables</div>
                <div className="text-sm text-chalk mt-2">
                  Perfecto para planificar la semana de trabajo
                </div>
              </button>
              
              <button
                onClick={() => updateData('days', 7)}
                className={`p-8 rounded-lg border-2 transition-all ${
                  data.days === 7
                    ? 'border-chalk-green bg-chalk-green/20 text-chalk-white'
                    : 'border-chalk-green/30 text-chalk hover:border-chalk-green hover:bg-chalk-green/10'
                }`}
              >
                <div className="text-3xl font-bold mb-2">Toda la Semana</div>
                <div className="text-lg">7 días completos</div>
                <div className="text-sm text-chalk mt-2">
                  Incluye fines de semana para planificación completa
                </div>
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="glass-container max-w-2xl mx-auto">
            <h2 className="text-3xl text-chalk-white mb-6">
              ¿Cuántas comidas principales al día?
            </h2>
            <p className="text-chalk mb-8">
              Selecciona cuántas comidas principales quieres incluir en tu planificación
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { 
                  value: 3, 
                  label: '3 Comidas', 
                  desc: 'Desayuno, Comida y Cena',
                  details: 'Plan básico con las comidas principales'
                },
                { 
                  value: 4, 
                  label: '4 Comidas', 
                  desc: 'Desayuno, Comida, Merienda y Cena',
                  details: 'Incluye merienda de tarde'
                },
                { 
                  value: 5, 
                  label: '5 Comidas', 
                  desc: 'Desayuno, Almuerzo, Comida, Merienda y Cena',
                  details: 'Plan completo con almuerzo y merienda'
                }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateData('mealsPerDay', option.value)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    data.mealsPerDay === option.value
                      ? 'border-chalk-green bg-chalk-green/20 text-chalk-white'
                      : 'border-chalk-green/30 text-chalk hover:border-chalk-green hover:bg-chalk-green/10'
                  }`}
                >
                  <div className="text-xl font-bold mb-2">{option.label}</div>
                  <div className="text-sm font-medium mb-1">{option.desc}</div>
                  <div className="text-xs opacity-70">{option.details}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="glass-container max-w-2xl mx-auto">
            <h2 className="text-3xl text-chalk-white mb-6">
              ¿Sigues algún tipo de dieta específica?
            </h2>
            <p className="text-chalk mb-8">
              Esto nos ayudará a personalizar tus recetas y sugerencias
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'normal', label: 'Dieta Normal', desc: 'Sin restricciones especiales' },
                { value: 'vegetariana', label: 'Vegetariana', desc: 'Sin carne ni pescado' },
                { value: 'vegana', label: 'Vegana', desc: 'Sin productos de origen animal' },
                { value: 'mediterranea', label: 'Mediterránea', desc: 'Rica en pescado, verduras y aceite de oliva' },
                { value: 'keto', label: 'Cetogénica', desc: 'Baja en carbohidratos, alta en grasas' },
                { value: 'paleo', label: 'Paleo', desc: 'Basada en alimentos no procesados' }
              ].map((diet) => (
                <button
                  key={diet.value}
                  onClick={() => updateData('dietType', diet.value)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    data.dietType === diet.value
                      ? 'border-chalk-green bg-chalk-green/20 text-chalk-white'
                      : 'border-chalk-green/30 text-chalk hover:border-chalk-green hover:bg-chalk-green/10'
                  }`}
                >
                  <div className="font-bold mb-1">{diet.label}</div>
                  <div className="text-sm opacity-80">{diet.desc}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="glass-container max-w-2xl mx-auto">
            <div className="text-center mb-4">
              <span className="inline-block bg-blue-500/20 text-blue-300 text-sm px-3 py-1 rounded-full mb-2">
                📝 Pregunta opcional
              </span>
            </div>
            <h2 className="text-3xl text-chalk-white mb-6">
              ¿Tienes alguna alergia alimentaria?
            </h2>
            <p className="text-chalk mb-8">
              Es importante que sepamos esto para evitar ingredientes peligrosos. Si no tienes alergias, puedes continuar sin responder.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                'Gluten', 'Lácteos', 'Frutos secos', 'Huevos', 
                'Mariscos', 'Pescado', 'Soja', 'Ninguna'
              ].map((allergy) => (
                <button
                  key={allergy}
                  onClick={() => {
                    const current = data.allergies.split(',').filter(a => a.trim());
                    if (allergy === 'Ninguna') {
                      updateData('allergies', 'Ninguna');
                    } else {
                      const index = current.indexOf(allergy);
                      if (index > -1) {
                        current.splice(index, 1);
                      } else {
                        current.push(allergy);
                        // Remove "Ninguna" if selecting a specific allergy
                        const ningunaIndex = current.indexOf('Ninguna');
                        if (ningunaIndex > -1) current.splice(ningunaIndex, 1);
                      }
                      updateData('allergies', current.join(', '));
                    }
                  }}
                  className={`p-3 rounded-lg border-2 transition-all text-sm ${
                    data.allergies.includes(allergy)
                      ? 'border-chalk-green bg-chalk-green/20 text-chalk-white'
                      : 'border-chalk-green/30 text-chalk hover:border-chalk-green hover:bg-chalk-green/10'
                  }`}
                >
                  {allergy}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-chalk mb-2">Otras alergias:</label>
              <textarea
                value={data.allergies.includes('Ninguna') ? '' : data.allergies}
                onChange={(e) => updateData('allergies', e.target.value)}
                className="w-full p-3 rounded-lg bg-black/30 border border-chalk-green/30 text-chalk-white"
                placeholder="Describe otras alergias..."
                rows={3}
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="glass-container max-w-2xl mx-auto">
            <div className="text-center mb-4">
              <span className="inline-block bg-blue-500/20 text-blue-300 text-sm px-3 py-1 rounded-full mb-2">
                📝 Pregunta opcional
              </span>
            </div>
            <h2 className="text-3xl text-chalk-white mb-6">
              ¿Hay algún alimento que no te guste?
            </h2>
            <p className="text-chalk mb-8">
              Evitaremos incluir estos ingredientes en tus menús. Si no tienes preferencias específicas, puedes continuar.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                'Pescado', 'Brócoli', 'Coliflor', 'Espinacas',
                'Champiñones', 'Cebolla', 'Ajo', 'Picante'
              ].map((dislike) => (
                <button
                  key={dislike}
                  onClick={() => {
                    const current = data.dislikes.split(',').filter(d => d.trim());
                    const index = current.indexOf(dislike);
                    if (index > -1) {
                      current.splice(index, 1);
                    } else {
                      current.push(dislike);
                    }
                    updateData('dislikes', current.join(', '));
                  }}
                  className={`p-3 rounded-lg border-2 transition-all text-sm ${
                    data.dislikes.includes(dislike)
                      ? 'border-chalk-green bg-chalk-green/20 text-chalk-white'
                      : 'border-chalk-green/30 text-chalk hover:border-chalk-green hover:bg-chalk-green/10'
                  }`}
                >
                  {dislike}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-chalk mb-2">Otros alimentos que no te gustan:</label>
              <textarea
                value={data.dislikes}
                onChange={(e) => updateData('dislikes', e.target.value)}
                className="w-full p-3 rounded-lg bg-black/30 border border-chalk-green/30 text-chalk-white"
                placeholder="Escribe otros alimentos que prefieres evitar..."
                rows={3}
              />
            </div>
          </div>
        );

      case 8:
        return (
          <div className="glass-container max-w-2xl mx-auto">
            <div className="text-center mb-4">
              <span className="inline-block bg-blue-500/20 text-blue-300 text-sm px-3 py-1 rounded-full mb-2">
                📝 Pregunta opcional
              </span>
            </div>
            <h2 className="text-3xl text-chalk-white mb-6">
              ¿Cuáles son tus comidas favoritas?
            </h2>
            <p className="text-chalk mb-8">
              Nos ayudará a priorizar recetas que realmente te gusten. Si no tienes preferencias específicas, puedes continuar.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {[
                'Pasta', 'Arroz', 'Pollo', 'Carne roja', 'Pescado', 'Ensaladas',
                'Sopas', 'Pizza', 'Tacos', 'Curry', 'Estofados', 'Parrilladas'
              ].map((favorite) => (
                <button
                  key={favorite}
                  onClick={() => {
                    const current = data.favorites.split(',').filter(f => f.trim());
                    const index = current.indexOf(favorite);
                    if (index > -1) {
                      current.splice(index, 1);
                    } else {
                      current.push(favorite);
                    }
                    updateData('favorites', current.join(', '));
                  }}
                  className={`p-3 rounded-lg border-2 transition-all text-sm ${
                    data.favorites.includes(favorite)
                      ? 'border-chalk-green bg-chalk-green/20 text-chalk-white'
                      : 'border-chalk-green/30 text-chalk hover:border-chalk-green hover:bg-chalk-green/10'
                  }`}
                >
                  {favorite}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-chalk mb-2">Otras comidas favoritas:</label>
              <textarea
                value={data.favorites}
                onChange={(e) => updateData('favorites', e.target.value)}
                className="w-full p-3 rounded-lg bg-black/30 border border-chalk-green/30 text-chalk-white"
                placeholder="Describe otras comidas que te encantan..."
                rows={3}
              />
            </div>
          </div>
        );

      case 9:
        return (
          <div className="glass-container max-w-2xl mx-auto">
            <div className="text-center mb-4">
              <span className="inline-block bg-blue-500/20 text-blue-300 text-sm px-3 py-1 rounded-full mb-2">
                📝 Pregunta opcional
              </span>
            </div>
            <h2 className="text-3xl text-chalk-white mb-6">
              Reconocimiento de ingredientes por foto
            </h2>
            <p className="text-chalk mb-4">
              Toma una foto de tu nevera o despensa para identificar automáticamente los ingredientes disponibles. Si no tienes ingredientes disponibles o prefieres no usar esta función, puedes continuar.
            </p>
            <div className="bg-chalk-green/10 border border-chalk-green/30 rounded-lg p-4 mb-6">
              <h3 className="text-chalk-green font-semibold mb-2">📸 Consejos para mejor reconocimiento:</h3>
              <ul className="text-chalk text-sm space-y-1">
                <li>• Asegúrate de que haya buena iluminación</li>
                <li>• Los ingredientes deben estar visibles y claros</li>
                <li>• La imagen se optimizará automáticamente para la IA</li>
                <li>• Tamaño recomendado: cualquier resolución (se ajustará automáticamente)</li>
              </ul>
            </div>
            
            {!photoPreview ? (
              <div className="space-y-6">
                <div 
                  className="border-2 border-dashed border-chalk-green/30 rounded-lg p-8 text-center hover:border-chalk-green/60 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-16 h-16 mx-auto mb-4 text-chalk-green" />
                  <p className="text-chalk text-lg mb-2">
                    Arrastra una imagen aquí o haz clic para seleccionar
                  </p>
                  <p className="text-chalk text-sm opacity-70">
                    Formatos soportados: JPG, PNG (máximo 10MB)
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-chalk mb-4">O</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-primary-chalk flex items-center gap-2 mx-auto"
                  >
                    <Camera className="w-5 h-5" />
                    Tomar Foto
                  </button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative">
                  <img 
                    src={photoPreview} 
                    alt="Ingredientes detectados" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setPhotoPreview(null);
                      updateData('recognizedIngredients', []);
                    }}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {isAnalyzing ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-chalk-green border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-chalk">Analizando ingredientes...</p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl text-chalk-white mb-4">Ingredientes detectados:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                      {data.recognizedIngredients.map((ingredient, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-chalk-green/20 border border-chalk-green/30 rounded-lg p-3"
                        >
                          <span className="text-chalk-white text-sm">{ingredient}</span>
                          <button
                            onClick={() => removeIngredient(ingredient)}
                            className="text-red-400 hover:text-red-300 ml-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Añadir ingrediente manualmente..."
                        className="flex-1 p-3 rounded-lg bg-black/30 border border-chalk-green/30 text-chalk-white"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addCustomIngredient(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-chalk"
                      >
                        Nueva Foto
                      </button>
                    </div>
                    
                    <p className="text-chalk text-sm mt-4 opacity-70">
                      Puedes eliminar ingredientes incorrectos o añadir otros manualmente
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderProgressBar = () => {
    const progressPercent = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;
    
    return (
      <div className="max-w-3xl mx-auto mb-12">
        {/* Progress Text */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-chalk text-sm font-medium">Paso {currentStep} de {TOTAL_STEPS}</span>
          <span className="text-chalk-green text-sm font-bold">{Math.round(progressPercent)}% Completado</span>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-3 bg-blackboard-light rounded-full overflow-hidden border border-chalk/20">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-chalk-green to-chalk-yellow rounded-full shadow-lg"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        
        {/* Progress Dots */}
        <div className="flex justify-between mt-4 px-1">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <motion.div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i + 1 < currentStep 
                    ? 'bg-chalk-green' 
                    : i + 1 === currentStep 
                      ? 'bg-chalk-yellow ring-2 ring-chalk-yellow/50' 
                      : 'bg-chalk/20'
                }`}
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: i + 1 === currentStep ? 1.2 : i + 1 < currentStep ? 1 : 0.8 
                }}
                transition={{ duration: 0.3 }}
              >
                {i + 1 < currentStep && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-center h-full"
                  >
                    <Check className="w-2 h-2 text-blackboard" />
                  </motion.div>
                )}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <section className="seccion">
        <img src="/logo.PNG" alt="TheCookFlow - Cuestionario de preferencias culinarias" className="logo" />
        
        {renderProgressBar()}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 max-w-2xl mx-auto">
          {currentStep > 1 ? (
            <button
              onClick={prevStep}
              className="btn-chalk flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Anterior
            </button>
          ) : (
            <div></div>
          )}
          
          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className={`flex items-center gap-2 ${
              currentStep === TOTAL_STEPS ? 'btn-red-chalk' : 'btn-primary-chalk'
            } ${!canProceed() ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={!canProceed() && currentStep <= 5 ? 'Debes responder esta pregunta para continuar' : ''}
          >
            {currentStep === TOTAL_STEPS ? 'Completar Cuestionario' : 'Siguiente'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}