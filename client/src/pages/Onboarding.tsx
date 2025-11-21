import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { ChefHat, Users, Clock, Euro, ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingData {
  goal: string;
  people: number;
  cookingTime: string;
  skillLevel: string;
  budget: number;
  budgetType: 'weekly' | 'daily';
}

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    goal: '',
    people: 2,
    cookingTime: 'medium',
    skillLevel: 'beginner',
    budget: 50,
    budgetType: 'weekly'
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Generate initial menu and redirect
      generateInitialMenu();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateInitialMenu = async () => {
    try {
      // Store onboarding data
      localStorage.setItem('onboardingData', JSON.stringify(data));
      
      // Start timer for p95 < 10s requirement
      const startTime = Date.now();
      
      // Quick generate endpoint
      const response = await fetch('/api/plan/quick-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: data.goal,
          servings: data.people,
          cookingTime: data.cookingTime,
          skillLevel: data.skillLevel,
          weeklyBudget: data.budget,
          budgetType: data.budgetType,
          quickMode: true // Optimize for speed
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate menu');
      }

      const result = await response.json();
      const generationTime = Date.now() - startTime;
      
      // Log performance metric
      console.log(`Menu generation time: ${generationTime}ms`);
      
      // Store result and redirect to quick actions
      localStorage.setItem('initialMenu', JSON.stringify(result));
      localStorage.setItem('generationTime', generationTime.toString());
      
      setLocation('/onboarding/result');
    } catch (error) {
      console.error('Error generating initial menu:', error);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return data.goal.length > 0;
      case 2: return data.people > 0;
      case 3: return data.cookingTime && data.skillLevel;
      case 4: return data.budget > 0;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-green via-black to-dark-green flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-chalk/60 mb-2">
            <span>Paso {currentStep} de {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-chalk/20 rounded-full h-2">
            <div 
              className="bg-chalk-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <Card className="glass-container border-chalk-green/30">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <ChefHat className="w-12 h-12 text-chalk-green" />
            </div>
            <CardTitle className="text-2xl text-chalk-white">
              {currentStep === 1 && "¿Cuál es tu objetivo?"}
              {currentStep === 2 && "¿Para cuántas personas?"}
              {currentStep === 3 && "Tiempo y habilidades"}
              {currentStep === 4 && "Presupuesto semanal"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Goal */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <RadioGroup 
                  value={data.goal} 
                  onValueChange={(value) => setData({...data, goal: value})}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="save-money" id="save-money" />
                    <Label htmlFor="save-money" className="text-chalk cursor-pointer">
                      Ahorrar dinero en la compra
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="save-time" id="save-time" />
                    <Label htmlFor="save-time" className="text-chalk cursor-pointer">
                      Ahorrar tiempo cocinando
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="eat-healthy" id="eat-healthy" />
                    <Label htmlFor="eat-healthy" className="text-chalk cursor-pointer">
                      Comer más saludable
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="variety" id="variety" />
                    <Label htmlFor="variety" className="text-chalk cursor-pointer">
                      Más variedad en mis comidas
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Step 2: People */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setData({...data, people: Math.max(1, data.people - 1)})}
                    className="text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
                  >
                    -
                  </Button>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-chalk-green">{data.people}</div>
                    <div className="text-chalk/60">personas</div>
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setData({...data, people: data.people + 1})}
                    className="text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
                  >
                    +
                  </Button>
                </div>
                <div className="flex justify-center">
                  <Users className="w-8 h-8 text-chalk-green/60" />
                </div>
              </div>
            )}

            {/* Step 3: Time & Skills */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-chalk mb-3 block">Tiempo disponible para cocinar</Label>
                  <RadioGroup 
                    value={data.cookingTime} 
                    onValueChange={(value) => setData({...data, cookingTime: value})}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="quick" id="quick" />
                      <Label htmlFor="quick" className="text-chalk cursor-pointer">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Rápido (15-30 min)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium" className="text-chalk cursor-pointer">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Normal (30-60 min)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="long" id="long" />
                      <Label htmlFor="long" className="text-chalk cursor-pointer">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Elaborado (60+ min)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-chalk mb-3 block">Nivel de cocina</Label>
                  <RadioGroup 
                    value={data.skillLevel} 
                    onValueChange={(value) => setData({...data, skillLevel: value})}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="beginner" id="beginner" />
                      <Label htmlFor="beginner" className="text-chalk cursor-pointer">
                        Principiante
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="intermediate" id="intermediate" />
                      <Label htmlFor="intermediate" className="text-chalk cursor-pointer">
                        Intermedio
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="advanced" id="advanced" />
                      <Label htmlFor="advanced" className="text-chalk cursor-pointer">
                        Avanzado
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 4: Budget */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-chalk mb-3 block">Presupuesto por semana</Label>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-chalk-green">
                        <Euro className="w-6 h-6 inline" />
                        {data.budget}
                      </div>
                      <div className="text-chalk/60">por semana</div>
                    </div>
                    <Slider
                      value={[data.budget]}
                      onValueChange={(value) => setData({...data, budget: value[0]})}
                      max={200}
                      min={20}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-chalk/60">
                      <span>€20</span>
                      <span>€200</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-chalk-green text-dark-green hover:bg-chalk-green/80"
              >
                {currentStep === totalSteps ? (
                  <>
                    Generar Menú
                    <ChefHat className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Siguiente
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}