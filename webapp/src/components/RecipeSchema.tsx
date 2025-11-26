import { Helmet } from "react-helmet-async";

interface Ingredient {
  name: string;
  amount: string;
  unit?: string;
  category?: string;
}

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sodium?: number;
}

interface RecipeSchemaProps {
  name: string;
  description: string;
  image?: string;
  prepTime?: number; // minutes for preparation
  cookTime?: number; // minutes for cooking
  cookingTime?: number; // total minutes (fallback if prepTime/cookTime not provided)
  servings: number;
  difficulty?: string;
  cuisine?: string;
  mealType?: string;
  ingredients: Ingredient[] | string[];
  instructions: string[] | Array<{ step: number; title?: string; description: string; time?: string; tip?: string }>;
  nutritionInfo?: NutritionInfo;
  allergens?: string[];
  dietaryTags?: string[];
  rating?: number;
  totalRatings?: number;
  author?: string;
  datePublished?: string;
  keywords?: string[];
}

export default function RecipeSchema({
  name,
  description,
  image,
  prepTime,
  cookTime,
  cookingTime,
  servings,
  difficulty,
  cuisine,
  mealType,
  ingredients,
  instructions,
  nutritionInfo,
  allergens,
  dietaryTags,
  rating,
  totalRatings,
  author = "TheCookFlow",
  datePublished,
  keywords = []
}: RecipeSchemaProps) {
  // Calculate times - use specific prep/cook if provided, otherwise split cookingTime
  const actualPrepTime = prepTime || (cookingTime ? Math.floor(cookingTime * 0.3) : 0);
  const actualCookTime = cookTime || (cookingTime ? Math.ceil(cookingTime * 0.7) : 0);
  const actualTotalTime = prepTime && cookTime ? prepTime + cookTime : (cookingTime || 0);
  
  // Convert to ISO 8601 duration (e.g., "PT30M")
  const prepTimeISO = actualPrepTime > 0 ? `PT${actualPrepTime}M` : undefined;
  const cookTimeISO = actualCookTime > 0 ? `PT${actualCookTime}M` : undefined;
  const totalTimeISO = actualTotalTime > 0 ? `PT${actualTotalTime}M` : undefined;

  // Convert ingredients to string array if they're objects
  const ingredientStrings = ingredients.map(ing => {
    if (typeof ing === 'string') return ing;
    const unit = ing.unit || '';
    return `${ing.amount}${unit ? ' ' + unit : ''} ${ing.name}`.trim();
  });

  // Convert instructions to HowToStep format with optional tips
  const recipeInstructions = instructions.map((inst, index) => {
    if (typeof inst === 'string') {
      return {
        "@type": "HowToStep",
        "position": index + 1,
        "text": inst
      };
    }
    
    const step: any = {
      "@type": "HowToStep",
      "position": inst.step || index + 1,
      "text": inst.description
    };
    
    if (inst.title) step.name = inst.title;
    if (inst.tip) step.tip = inst.tip;
    
    return step;
  });

  // Build keywords array
  const allKeywords = [
    ...keywords,
    difficulty && `receta ${difficulty}`,
    cuisine,
    mealType,
    ...(dietaryTags || []),
    ...(allergens?.map(a => `sin ${a}`) || [])
  ].filter(Boolean);

  // Build recipe schema
  const recipeSchema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": name,
    "description": description,
    "image": image ? [image] : undefined,
    "author": {
      "@type": "Organization",
      "name": author
    },
    "datePublished": datePublished || new Date().toISOString().split('T')[0],
    "prepTime": prepTimeISO,
    "cookTime": cookTimeISO,
    "totalTime": totalTimeISO,
    "recipeYield": `${servings} porciones`,
    "recipeCategory": mealType || "Main dish",
    "recipeCuisine": cuisine || "Española",
    "keywords": allKeywords.join(", "),
    "recipeIngredient": ingredientStrings,
    "recipeInstructions": recipeInstructions,
    "nutrition": nutritionInfo ? {
      "@type": "NutritionInformation",
      "calories": `${nutritionInfo.calories} calorías`,
      "proteinContent": `${nutritionInfo.protein}g`,
      "carbohydrateContent": `${nutritionInfo.carbs}g`,
      "fatContent": `${nutritionInfo.fat}g`,
      "fiberContent": nutritionInfo.fiber ? `${nutritionInfo.fiber}g` : undefined,
      "sodiumContent": nutritionInfo.sodium ? `${nutritionInfo.sodium}mg` : undefined
    } : undefined,
    "suitableForDiet": dietaryTags ? dietaryTags.map(tag => {
      const dietMap: Record<string, string> = {
        "Vegano": "https://schema.org/VeganDiet",
        "Vegetariano": "https://schema.org/VegetarianDiet",
        "Sin gluten": "https://schema.org/GlutenFreeDiet",
        "Keto": "https://schema.org/KetogenicDiet",
        "Diabética": "https://schema.org/DiabeticDiet",
        "Baja en grasa": "https://schema.org/LowFatDiet",
        "Baja en lactosa": "https://schema.org/LowLactoseDiet"
      };
      return dietMap[tag] || undefined;
    }).filter(Boolean) : undefined,
    "aggregateRating": rating && totalRatings ? {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "ratingCount": totalRatings,
      "bestRating": 5,
      "worstRating": 1
    } : undefined
  };

  // Remove undefined fields
  const cleanedSchema = JSON.parse(JSON.stringify(recipeSchema));

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(cleanedSchema)}
      </script>
    </Helmet>
  );
}
