import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

interface QuickGenerateRequest {
  goal: string;
  servings: number;
  cookingTime: string;
  skillLevel: string;
  weeklyBudget: number;
  budgetType: 'weekly' | 'daily';
  quickMode?: boolean;
}

interface QuickRegenerateRequest extends QuickGenerateRequest {
  action: 'changeRecipe' | 'changeBudget' | 'addLeftovers';
  currentMenu: any;
}

// Quick generate endpoint for onboarding (optimized for <10s)
router.post('/quick-generate', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    const data: QuickGenerateRequest = req.body;

    // Simplified menu generation for speed
    const quickMenu = {
      id: `quick_${Date.now()}`,
      shareId: generateShareId(),
      meals: generateQuickMeals(data),
      estimatedCost: calculateEstimatedCost(data),
      generatedAt: new Date().toISOString(),
      parameters: data
    };

    const generationTime = Date.now() - startTime;
    console.log(`Quick generation completed in ${generationTime}ms`);

    // Performance check - should be < 10s (10000ms)
    if (generationTime > 10000) {
      console.warn(`Generation time exceeded target: ${generationTime}ms`);
    }

    res.json({
      ...quickMenu,
      generationTime,
      performance: {
        target: 10000,
        actual: generationTime,
        withinTarget: generationTime <= 10000
      }
    });

  } catch (error) {
    console.error('Quick generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate menu',
      fallback: generateFallbackMenu(req.body)
    });
  }
});

// Quick regenerate for actions
router.post('/quick-regenerate', async (req: Request, res: Response) => {
  try {
    const data: QuickRegenerateRequest = req.body;
    const { action, currentMenu } = data;

    let updatedMenu = { ...currentMenu };

    switch (action) {
      case 'changeRecipe':
        // Replace one random recipe
        const randomIndex = Math.floor(Math.random() * updatedMenu.meals.length);
        updatedMenu.meals[randomIndex] = generateRandomMeal(data);
        break;

      case 'changeBudget':
        // Adjust recipes based on new budget constraints
        updatedMenu.meals = adjustMealsForBudget(updatedMenu.meals, data.weeklyBudget);
        updatedMenu.estimatedCost = calculateEstimatedCost(data);
        break;

      case 'addLeftovers':
        // Add leftover-based recipes
        const leftoverMeals = generateLeftoverMeals(updatedMenu.meals);
        updatedMenu.meals = [...updatedMenu.meals.slice(0, 5), ...leftoverMeals];
        break;
    }

    updatedMenu.lastModified = new Date().toISOString();
    updatedMenu.modifications = (updatedMenu.modifications || 0) + 1;

    res.json(updatedMenu);

  } catch (error) {
    console.error('Quick regeneration error:', error);
    res.status(500).json({ error: 'Failed to regenerate menu' });
  }
});

// Helper functions
function generateShareId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateQuickMeals(data: QuickGenerateRequest) {
  const meals = [];
  const mealTypes = ['Desayuno', 'Comida', 'Cena'];
  const days = 7;

  // Base recipes optimized for quick generation
  const baseRecipes = [
    {
      name: 'Tortilla Española',
      cookingTime: data.cookingTime === 'quick' ? 15 : 25,
      difficulty: 'fácil',
      cost: 3.50
    },
    {
      name: 'Pasta con Tomate',
      cookingTime: data.cookingTime === 'quick' ? 12 : 20,
      difficulty: 'fácil',
      cost: 2.80
    },
    {
      name: 'Pollo al Horno',
      cookingTime: data.cookingTime === 'quick' ? 20 : 45,
      difficulty: data.skillLevel === 'beginner' ? 'fácil' : 'intermedio',
      cost: 6.20
    },
    {
      name: 'Ensalada Mixta',
      cookingTime: 10,
      difficulty: 'fácil',
      cost: 4.50
    },
    {
      name: 'Sopa de Verduras',
      cookingTime: data.cookingTime === 'quick' ? 15 : 30,
      difficulty: 'fácil',
      cost: 3.20
    }
  ];

  // Generate meals for the week
  for (let day = 0; day < Math.min(days, 21); day++) {
    const recipe = baseRecipes[day % baseRecipes.length];
    meals.push({
      id: `meal_${day}`,
      name: recipe.name,
      day: Math.floor(day / 3) + 1,
      mealType: mealTypes[day % 3],
      cookingTime: recipe.cookingTime,
      servings: data.servings,
      difficulty: recipe.difficulty,
      estimatedCost: recipe.cost,
      ingredients: generateIngredients(recipe.name, data.servings),
      instructions: generateInstructions(recipe.name)
    });
  }

  return meals;
}

function generateRandomMeal(data: QuickGenerateRequest) {
  const recipes = [
    'Paella Valenciana', 'Gazpacho', 'Croquetas', 'Fabada', 'Pulpo a la Gallega',
    'Jamón Ibérico', 'Churros', 'Empanadas', 'Migas', 'Salmorejo'
  ];
  
  const randomName = recipes[Math.floor(Math.random() * recipes.length)];
  
  return {
    id: `meal_${Date.now()}`,
    name: randomName,
    cookingTime: data.cookingTime === 'quick' ? 15 : 30,
    servings: data.servings,
    difficulty: data.skillLevel === 'beginner' ? 'fácil' : 'intermedio',
    estimatedCost: Math.random() * 8 + 2,
    ingredients: generateIngredients(randomName, data.servings),
    instructions: generateInstructions(randomName)
  };
}

function adjustMealsForBudget(meals: any[], newBudget: number) {
  const costPerMeal = newBudget / meals.length;
  
  return meals.map(meal => ({
    ...meal,
    estimatedCost: Math.min(meal.estimatedCost, costPerMeal),
    budgetOptimized: meal.estimatedCost > costPerMeal
  }));
}

function generateLeftoverMeals(existingMeals: any[]) {
  return [
    {
      id: `leftover_${Date.now()}`,
      name: 'Arroz con Sobras',
      cookingTime: 15,
      servings: existingMeals[0]?.servings || 2,
      difficulty: 'fácil',
      estimatedCost: 2.50,
      isLeftover: true,
      ingredients: generateIngredients('Arroz con Sobras', 2),
      instructions: ['Calentar sobras', 'Mezclar con arroz', 'Servir caliente']
    }
  ];
}

function calculateEstimatedCost(data: QuickGenerateRequest): number {
  // Simplified cost calculation
  const baseCostPerPerson = data.weeklyBudget / data.servings;
  const adjustmentFactor = data.cookingTime === 'quick' ? 0.8 : 1.2;
  
  return Math.round(baseCostPerPerson * adjustmentFactor * 100) / 100;
}

function generateIngredients(recipeName: string, servings: number) {
  // Basic ingredient generation
  const baseIngredients = [
    { name: 'Aceite de oliva', amount: '2 cucharadas', category: 'Aceites' },
    { name: 'Sal', amount: '1 pizca', category: 'Condimentos' },
    { name: 'Ajo', amount: '2 dientes', category: 'Verduras' }
  ];
  
  return baseIngredients.map(ing => ({
    ...ing,
    amount: adjustAmountForServings(ing.amount, servings)
  }));
}

function generateInstructions(recipeName: string) {
  return [
    `Preparar los ingredientes para ${recipeName}`,
    'Calentar aceite en la sartén',
    'Cocinar según la receta tradicional',
    'Servir caliente'
  ];
}

function adjustAmountForServings(amount: string, servings: number): string {
  // Basic amount adjustment logic
  if (servings === 2) return amount;
  
  const multiplier = servings / 2;
  if (amount.includes('cucharadas')) {
    const num = parseInt(amount) * multiplier;
    return `${num} cucharadas`;
  }
  
  return amount;
}

function generateFallbackMenu(data: any) {
  return {
    id: 'fallback',
    meals: [
      {
        name: 'Pasta Simple',
        cookingTime: 15,
        servings: data.servings || 2,
        estimatedCost: 3.00
      }
    ],
    estimatedCost: 25,
    isFallback: true
  };
}

export default router;