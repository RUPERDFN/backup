// server/openai.ts
import OpenAI from "openai";
import { env } from "./env";

export const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

// ejemplo de helper
export async function completeMenuPrompt(prompt: string) {
  // Ajusta al modelo que uses realmente
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });
  return res.choices[0]?.message?.content ?? "";
}

// Helper temporal para compatibilidad
export async function recognizeFoodFromImage(base64Image: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Lista ingredientes visibles en español:"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      max_tokens: 300,
    });

    const content = response.choices[0].message.content || '';
    const ingredients = content
      .split(/[,\n\-\*]/)
      .map(ingredient => ingredient.trim().toLowerCase())
      .filter(ingredient => ingredient.length > 2)
      .slice(0, 15);

    return ingredients.length > 0 ? ingredients : ['tomate', 'cebolla', 'ajo'];
  } catch (error) {
    console.error("Error recognizing food:", error);
    return ['tomate', 'cebolla', 'ajo'];
  }
}

// Stubs temporales para compatibilidad
export interface MenuPreferences {
  dietaryRestrictions: string[];
  budget: string;
  cookingTime: string;
  servings: number;
  daysToGenerate?: number;
  mealsPerDay?: number;
  availableIngredients?: string[];
  favorites?: string[];
  dislikes?: string[];
  allergies?: string[];
}

export async function generateWeeklyMenuPlan(preferences: MenuPreferences, enhancementData?: any) {
  const daysToGenerate = preferences.daysToGenerate || 7;
  const mealsPerDay = preferences.mealsPerDay || 3;
  
  // Optimized prompt
  const prompt = `JSON menú ${daysToGenerate}d ${mealsPerDay}com/d esp:
D:${preferences.dietaryRestrictions.join(',')} A:${preferences.allergies?.join(',') || ''} €${preferences.budget} T:${preferences.cookingTime} ${preferences.servings}p
G:${preferences.favorites?.join(',') || ''} X:${preferences.dislikes?.join(',') || ''}
IMPORTANTE: unit="gramos" amount=cantidades reales en gramos
{name,days:[{dayOfWeek,dayName,meals:[{mealType,name,description,ingredients:[{name,amount,unit:"gramos",category}],instructions[],nutritionInfo:{calories,protein,carbs,fat,fiber},cookingTime,servings}]}],totalEstimatedCost,shoppingList:[{category,items:[{name,amount,unit:"gramos",estimatedPrice}]}]}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Eres un chef experto que crea menús semanales personalizados en español. Respondes SOLO con JSON válido, sin texto adicional."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 4000,
    });

    const content = response.choices[0].message.content || '{}';
    const menuData = JSON.parse(content);
    
    // Ensure shoppingList exists
    if (!menuData.shoppingList || !Array.isArray(menuData.shoppingList)) {
      menuData.shoppingList = [];
    }
    
    return menuData;
  } catch (error) {
    console.error("Error generating menu with OpenAI:", error);
    throw error;
  }
}

export async function generateRecipeSuggestions(ingredients: string[]) {
  return { recipes: [{ name: "Receta con " + ingredients[0], description: "Básica", difficulty: "fácil", cookingTime: 30, ingredients, instructions: [] }] };
}