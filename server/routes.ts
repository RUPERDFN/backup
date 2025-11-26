import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import path from "path";
import { storage } from "./storage";
import { setupAuth as setupReplitAuth, isAuthenticated as replitAuthenticateToken } from "./replitAuth";
import { setupAuth as setupLocalAuth, authenticateToken } from "./auth";
import { Request, Response, NextFunction } from "express";
// Stripe integration removed - now a completely free app
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { ObjectPermission } from "./objectAcl";
import { openai, completeMenuPrompt, recognizeFoodFromImage, generateWeeklyMenuPlan, generateRecipeSuggestions, type MenuPreferences } from "./openai";
import { askPerplexity, enhanceMenuWithTrends, generateMenuPlanWithPerplexity, recognizeIngredientsWithPerplexity } from "./perplexity";
import { insertMenuPlanSchema, insertRecipeSchema, insertShoppingListSchema, insertFoodRecognitionSchema } from "/shared/schema";

import { analyzePromptTokens, calculateCost, calculateCostComparison, TokenUsage, EXAMPLE_PROMPT_ANALYSIS, API_COSTS_SONAR_BASIC, PERPLEXITY_SEARCH_COST } from './tokenAnalysis';
import * as googlePlayBilling from "./routes/googlePlayBilling";
import * as googlePlaySimple from "./routes/googlePlaySimple";
import { appCheckRouter } from "./routes/appCheck";
import planRoutes from "./routes/plan";
import savingsRoutes from "./routes/savings";
import fridgeRoutes from "./routes/fridge";
import demoRoutes from "./routes/demo";
// import qaRoutes from "./routes/qa"; // Using registerQARoutes instead
import screenshotsRoutes from "./routes/screenshots";
import healthRoutes from "./routes/health";
import monitoringRoutes from "./routes/monitoring";
import calendarRoutes from "./routes/calendar";
import sharingRoutes from "./routes/sharing";
import referralsRoutes from "./routes/referrals";
import packsRoutes from "./routes/packs";
import analyticsRoutes from "./routes/analytics";
import adminRoutes from "./routes/admin";
import stagingRoutes from "./routes/staging";
import { registerQARoutes } from "./routes/qa";
import freemiumRoutes from "./routes/freemium";
import gamificationRoutes from "./routes/gamification";
import { z } from "zod";

// Mock supermarket price data - in production this would come from external APIs
const MOCK_STORES = [
  { id: 'mercadona', name: 'Mercadona', distance: 0.8, closingTime: '21:30' },
  { id: 'carrefour', name: 'Carrefour', distance: 1.2, closingTime: '22:00' },
  { id: 'lidl', name: 'Lidl', distance: 1.5, closingTime: '21:00' },
];

// Premium app with subscription verification
interface AuthRequest extends Request {
  user?: any;
}

// Precios por kilogramo para cálculos precisos
const MOCK_PRICES = {
  'tomates': { mercadona: 2.85, carrefour: 3.10, lidl: 2.69 },
  'tomate': { mercadona: 2.85, carrefour: 3.10, lidl: 2.69 },
  'queso mozzarella': { mercadona: 12.95, carrefour: 11.85, lidl: 11.79 },
  'queso': { mercadona: 8.50, carrefour: 7.80, lidl: 8.20 },
  'mozzarella': { mercadona: 12.95, carrefour: 11.85, lidl: 11.79 },
  'albahaca': { mercadona: 24.00, carrefour: 26.00, lidl: 23.00 },
  'pollo': { mercadona: 4.50, carrefour: 4.20, lidl: 3.95 },
  'pechuga de pollo': { mercadona: 6.80, carrefour: 6.50, lidl: 6.20 },
  'arroz': { mercadona: 1.25, carrefour: 1.30, lidl: 1.10 },
  'pasta': { mercadona: 2.80, carrefour: 2.90, lidl: 2.50 },
  'aceite oliva': { mercadona: 7.60, carrefour: 8.20, lidl: 7.00 },
  'aceite': { mercadona: 7.60, carrefour: 8.20, lidl: 7.00 },
  'aceite de oliva': { mercadona: 7.60, carrefour: 8.20, lidl: 7.00 },
  'huevos': { mercadona: 8.50, carrefour: 8.80, lidl: 7.90 },
  'leche': { mercadona: 1.20, carrefour: 1.25, lidl: 1.15 },
  'pan': { mercadona: 3.20, carrefour: 3.50, lidl: 3.00 },
  'pan integral': { mercadona: 3.80, carrefour: 4.00, lidl: 3.60 },
  'cebolla': { mercadona: 1.50, carrefour: 1.60, lidl: 1.40 },
  'ajo': { mercadona: 8.50, carrefour: 9.00, lidl: 8.20 },
  'pimiento': { mercadona: 3.20, carrefour: 3.50, lidl: 3.00 },
  'zanahoria': { mercadona: 1.80, carrefour: 1.90, lidl: 1.70 },
  'patatas': { mercadona: 1.20, carrefour: 1.30, lidl: 1.10 },
  'ternera': { mercadona: 12.50, carrefour: 11.80, lidl: 11.20 },
  'carne picada': { mercadona: 8.50, carrefour: 8.20, lidl: 7.90 },
  'jamón serrano': { mercadona: 28.00, carrefour: 26.50, lidl: 25.80 },
  'jamón york': { mercadona: 12.50, carrefour: 11.90, lidl: 11.40 }
};

// Helper functions for ingredient calculations
function getIngredientAmount(ingredient: string, servings: number): string {
  // Base amounts per person in grams
  const baseAmounts: Record<string, number> = {
    // Proteínas
    'pollo': 150, 'pechuga de pollo': 150, 'ternera': 120, 'carne picada': 100,
    'jamón serrano': 50, 'jamón york': 60, 'huevos': 120, 'pescado blanco': 150,
    'salmón': 120, 'atún': 100, 'tofu': 100,
    
    // Carbohidratos
    'arroz': 80, 'pasta': 80, 'pan': 60, 'pan integral': 60, 'patatas': 200,
    'quinoa': 60, 'avena': 50, 'cereales': 40,
    
    // Verduras y hortalizas
    'tomate': 150, 'cebolla': 80, 'pimiento': 100, 'zanahoria': 100, 'brócoli': 150,
    'calabacín': 150, 'espinacas': 100, 'lechuga': 80, 'pepino': 100,
    
    // Frutas
    'manzana': 150, 'plátano': 120, 'naranjas': 200, 'fresas': 150, 'aguacate': 100,
    
    // Lácteos
    'leche': 250, 'yogur': 125, 'queso': 50, 'queso fresco': 60, 'mozzarella': 50,
    'mantequilla': 20, 'leche vegetal': 250, 'leche de almendra': 250,
    
    // Condimentos y aceites
    'aceite': 15, 'aceite de oliva': 15, 'sal': 2, 'pimienta': 1, 'limón': 30,
    'ajo': 5, 'perejil': 10, 'albahaca': 10, 'curry': 5,
    
    // Frutos secos
    'almendras': 30, 'nueces': 25, 'granola': 40,
    
    // Otros
    'café': 10, 'té': 2, 'galletas': 30, 'miel': 15
  };
  
  const baseAmount = baseAmounts[ingredient.toLowerCase()] || 100;
  return (baseAmount * servings).toString();
}

function getIngredientCategory(ingredient: string): string {
  const categories: Record<string, string> = {
    // Proteínas
    'pollo': 'Carnes y Pescados', 'pechuga de pollo': 'Carnes y Pescados', 
    'ternera': 'Carnes y Pescados', 'carne picada': 'Carnes y Pescados',
    'jamón serrano': 'Carnes y Pescados', 'jamón york': 'Carnes y Pescados',
    'pescado blanco': 'Carnes y Pescados', 'salmón': 'Carnes y Pescados', 'atún': 'Carnes y Pescados',
    
    // Lácteos y huevos
    'huevos': 'Lácteos y Huevos', 'leche': 'Lácteos y Huevos', 'yogur': 'Lácteos y Huevos',
    'queso': 'Lácteos y Huevos', 'queso fresco': 'Lácteos y Huevos', 'mozzarella': 'Lácteos y Huevos',
    'mantequilla': 'Lácteos y Huevos', 'leche vegetal': 'Lácteos y Huevos', 'leche de almendra': 'Lácteos y Huevos',
    
    // Verduras y frutas
    'tomate': 'Productos Frescos', 'cebolla': 'Productos Frescos', 'pimiento': 'Productos Frescos',
    'zanahoria': 'Productos Frescos', 'brócoli': 'Productos Frescos', 'calabacín': 'Productos Frescos',
    'espinacas': 'Productos Frescos', 'lechuga': 'Productos Frescos', 'pepino': 'Productos Frescos',
    'manzana': 'Productos Frescos', 'plátano': 'Productos Frescos', 'naranjas': 'Productos Frescos',
    'fresas': 'Productos Frescos', 'aguacate': 'Productos Frescos',
    
    // Despensa
    'arroz': 'Despensa', 'pasta': 'Despensa', 'pan': 'Despensa', 'pan integral': 'Despensa',
    'patatas': 'Despensa', 'quinoa': 'Despensa', 'avena': 'Despensa', 'cereales': 'Despensa',
    'aceite': 'Despensa', 'aceite de oliva': 'Despensa', 'sal': 'Despensa', 'pimienta': 'Despensa',
    'ajo': 'Despensa', 'limón': 'Despensa', 'perejil': 'Despensa', 'albahaca': 'Despensa',
    'curry': 'Despensa', 'café': 'Despensa', 'té': 'Despensa', 'galletas': 'Despensa', 'miel': 'Despensa',
    
    // Frutos secos
    'almendras': 'Frutos Secos', 'nueces': 'Frutos Secos', 'granola': 'Frutos Secos'
  };
  
  return categories[ingredient.toLowerCase()] || 'Otros';
}

// Intelligent offline menu generator using questionnaire data and recipe library
async function generateOfflineMenu(preferences: MenuPreferences): Promise<any> {
  const budget = parseInt(preferences.budget) || 50;
  const servings = preferences.servings || 2;
  const mealsPerDay = preferences.mealsPerDay || 4;
  const isVegetarian = preferences.dietaryRestrictions?.includes('vegetarian') || preferences.dietaryRestrictions?.includes('vegetariano') || false;
  const isVegan = preferences.dietaryRestrictions?.includes('vegan') || preferences.dietaryRestrictions?.includes('vegano') || false;
  const isKeto = preferences.dietaryRestrictions?.includes('keto') || false;
  const isGlutenFree = preferences.dietaryRestrictions?.includes('glutenFree') || preferences.dietaryRestrictions?.includes('sin gluten') || false;
  
  // Process available ingredients from fridge photo
  const availableIngredients = preferences.availableIngredients?.filter(ing => 
    ing !== 'no hay ingredientes disponibles'
  ) || [];
  
  // Process user preferences
  const favorites = preferences.favorites?.filter(fav => fav !== 'ninguno especificado') || [];
  const dislikes = preferences.dislikes?.filter(dis => dis !== 'ninguno') || [];
  const allergies = preferences.allergies?.filter(all => all !== 'ninguna') || [];
  
  // Generate recipe options based on dietary restrictions and preferences
  const getPersonalizedRecipes = () => {
    let breakfastOptions = [];
    let lunchOptions = [];
    let dinnerOptions = [];
    
    // Filter function to check if recipe contains disliked ingredients
    const filterByDislikes = (recipe: any) => {
      return !dislikes.some(dislike => 
        recipe.ingredients.some((ing: string) => 
          ing.toLowerCase().includes(dislike.toLowerCase()) || 
          dislike.toLowerCase().includes(ing.toLowerCase())
        )
      );
    };
    
    // Breakfast options based on diet
    if (isVegan) {
      breakfastOptions = [
        { name: "Tostadas de aguacate", ingredients: ["pan integral", "aguacate", "tomate"], time: 10 },
        { name: "Batido de avena", ingredients: ["avena", "plátano", "leche vegetal"], time: 5 },
        { name: "Porridge con frutos rojos", ingredients: ["avena", "arándanos", "leche de almendra"], time: 15 }
      ];
    } else if (isVegetarian) {
      breakfastOptions = [
        { name: "Tortilla francesa", ingredients: ["huevos", "sal", "aceite"], time: 10 },
        { name: "Tostadas con queso", ingredients: ["pan", "queso fresco", "tomate"], time: 5 },
        { name: "Yogur con granola", ingredients: ["yogur natural", "granola", "miel"], time: 5 }
      ];
    } else if (isKeto) {
      breakfastOptions = [
        { name: "Huevos con aguacate", ingredients: ["huevos", "aguacate", "aceite de oliva"], time: 8 },
        { name: "Tortilla de queso", ingredients: ["huevos", "queso", "mantequilla"], time: 10 },
        { name: "Café bullet", ingredients: ["café", "mantequilla", "aceite coco"], time: 5 }
      ];
    } else {
      breakfastOptions = [
        { name: "Tostadas con jamón", ingredients: ["pan", "jamón serrano", "tomate"], time: 5 },
        { name: "Huevos revueltos", ingredients: ["huevos", "sal", "mantequilla"], time: 10 },
        { name: "Cereales con leche", ingredients: ["cereales", "leche", "plátano"], time: 3 }
      ];
    }
    
    // Lunch options based on diet
    if (isVegan) {
      lunchOptions = [
        { name: "Quinoa con verduras", ingredients: ["quinoa", "brócoli", "zanahoria", "aceite de oliva"], time: 25 },
        { name: "Ensalada mediterránea", ingredients: ["tomate", "pepino", "cebolla", "aceitunas"], time: 15 },
        { name: "Pasta con pesto vegano", ingredients: ["pasta", "albahaca", "piñones", "aceite"], time: 20 }
      ];
    } else if (isVegetarian) {
      lunchOptions = [
        { name: "Pasta con queso", ingredients: ["pasta", "queso", "tomate", "albahaca"], time: 20 },
        { name: "Ensalada caprese", ingredients: ["tomate", "mozzarella", "albahaca", "aceite"], time: 10 },
        { name: "Risotto de setas", ingredients: ["arroz", "setas", "cebolla", "queso"], time: 30 }
      ];
    } else if (isKeto) {
      lunchOptions = [
        { name: "Salmón con aguacate", ingredients: ["salmón", "aguacate", "espinacas", "aceite"], time: 15 },
        { name: "Pollo con brócoli", ingredients: ["pollo", "brócoli", "mantequilla", "queso"], time: 20 },
        { name: "Ensalada de atún", ingredients: ["atún", "huevos", "aceitunas", "aceite"], time: 10 }
      ];
    } else {
      lunchOptions = [
        { name: "Pollo a la plancha", ingredients: ["pechuga de pollo", "limón", "aceite"], time: 20 },
        { name: "Pasta boloñesa", ingredients: ["pasta", "carne picada", "tomate"], time: 30 },
        { name: "Arroz con pollo", ingredients: ["arroz", "pollo", "pimiento"], time: 30 }
      ];
    }
    
    // Dinner options based on diet
    if (isVegan) {
      dinnerOptions = [
        { name: "Verduras al vapor", ingredients: ["brócoli", "zanahoria", "calabacín"], time: 15 },
        { name: "Sopa de lentejas", ingredients: ["lentejas", "zanahoria", "apio"], time: 30 },
        { name: "Tofu salteado", ingredients: ["tofu", "verduras", "salsa soja"], time: 15 }
      ];
    } else if (isVegetarian) {
      dinnerOptions = [
        { name: "Tortilla de patatas", ingredients: ["huevos", "patatas", "cebolla"], time: 20 },
        { name: "Crema de verduras", ingredients: ["calabacín", "puerro", "queso"], time: 25 },
        { name: "Pizza margarita", ingredients: ["masa", "tomate", "mozzarella"], time: 20 }
      ];
    } else if (isKeto) {
      dinnerOptions = [
        { name: "Pescado al papillote", ingredients: ["pescado blanco", "mantequilla", "hierbas"], time: 20 },
        { name: "Pollo al curry", ingredients: ["pollo", "leche de coco", "curry"], time: 25 },
        { name: "Carne con ensalada", ingredients: ["ternera", "lechuga", "aceite"], time: 15 }
      ];
    } else {
      dinnerOptions = [
        { name: "Pollo al curry", ingredients: ["pollo", "curry", "leche de coco"], time: 25 },
        { name: "Tortilla de jamón", ingredients: ["huevos", "jamón york", "queso"], time: 15 },
        { name: "Carne guisada", ingredients: ["ternera", "patatas", "zanahoria"], time: 35 }
      ];
    }
    
    // Apply dislike filtering to all meal options
    const filteredBreakfast = breakfastOptions.filter(filterByDislikes);
    const filteredLunch = lunchOptions.filter(filterByDislikes);
    const filteredDinner = dinnerOptions.filter(filterByDislikes);
    
    // Ensure we have at least one option for each meal
    return { 
      breakfast: filteredBreakfast.length > 0 ? filteredBreakfast : breakfastOptions.slice(0, 1), 
      lunch: filteredLunch.length > 0 ? filteredLunch : lunchOptions.slice(0, 1), 
      dinner: filteredDinner.length > 0 ? filteredDinner : dinnerOptions.slice(0, 1) 
    };
  };
  
  const recipes = getPersonalizedRecipes();
  
  // Add snack and midmorning options
  const midmorningOptions = [
    { name: "Tostada con tomate", ingredients: ["pan", "tomate", "aceite"], time: 5 },
    { name: "Café con leche", ingredients: ["café", "leche"], time: 3 },
    { name: "Zumo de naranja", ingredients: ["naranjas"], time: 5 },
    { name: "Té con galletas", ingredients: ["té", "galletas"], time: 3 }
  ];
  
  const snackOptions = [
    { name: "Frutas de temporada", ingredients: ["manzana", "plátano"], time: 2 },
    { name: "Yogur natural", ingredients: ["yogur", "nueces"], time: 3 },
    { name: "Tostada integral", ingredients: ["pan integral", "aceite de oliva"], time: 5 },
    { name: "Frutos secos", ingredients: ["almendras", "nueces"], time: 1 },
    { name: "Batido de frutas", ingredients: ["fresas", "leche"], time: 5 }
  ];

  // Complete recipes object
  const completeRecipes = {
    ...recipes,
    midmorning: midmorningOptions,
    snack: snackOptions
  };

  const allDays = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  const days = preferences.daysToGenerate === 5 ? allDays.slice(0, 5) : allDays;
  const allIngredients: string[] = [];

  console.log('Generating offline menu for days:', days);
  console.log('Days to generate:', preferences.daysToGenerate);

  // Generate comprehensive shopping list from all recipes
  function generateShoppingList(allIngredients: string[], budget: number) {
    // Count ingredient occurrences
    const ingredientCounts = allIngredients.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Categorize ingredients
    const categories = {
      "Productos Frescos": ['tomate', 'cebolla', 'ajo', 'pimiento', 'zanahoria', 'apio', 'perejil', 'cilantro', 'espinacas', 'lechuga', 'manzana', 'plátano', 'naranjas', 'fresas', 'aguacate', 'brócoli', 'coliflor', 'calabacín', 'berenjena'],
      "Carnes y Pescados": ['pollo', 'ternera', 'cerdo', 'pescado', 'salmón', 'atún', 'jamón serrano', 'pechuga de pollo'],
      "Lácteos y Huevos": ['leche', 'queso', 'yogur', 'mantequilla', 'queso fresco', 'leche vegetal', 'leche de almendra', 'huevos'],
      "Despensa": ['arroz', 'pasta', 'aceite', 'sal', 'pimienta', 'azúcar', 'harina', 'avena', 'cereales', 'pan', 'pan integral', 'aceite de oliva', 'café', 'té', 'galletas'],
      "Frutos Secos": ['almendras', 'nueces', 'granola', 'frutos secos']
    };

    const shoppingListCategories: any[] = [];

    // Create shopping list by category
    Object.entries(categories).forEach(([categoryName, items]) => {
      const categoryItems: any[] = [];
      
      Object.entries(ingredientCounts).forEach(([ingredient, count]) => {
        if (items.includes(ingredient)) {
          const totalGrams = parseInt(getIngredientAmount(ingredient, 1)) * count;
          const pricePerKg = (MOCK_PRICES as any)[ingredient]?.mercadona || 2.50;
          const estimatedPrice = Math.round((pricePerKg * totalGrams / 1000) * 100) / 100;
          
          categoryItems.push({
            name: ingredient,
            amount: totalGrams.toString(),
            unit: "gramos",
            estimatedPrice: estimatedPrice
          });
        }
      });

      if (categoryItems.length > 0) {
        shoppingListCategories.push({
          category: categoryName,
          items: categoryItems
        });
      }
    });

    // Add uncategorized items
    const categorizedIngredients = Object.values(categories).flat();
    const uncategorizedItems: any[] = [];
    
    Object.entries(ingredientCounts).forEach(([ingredient, count]) => {
      if (!categorizedIngredients.includes(ingredient)) {
        const totalGrams = parseInt(getIngredientAmount(ingredient, 1)) * count;
        const estimatedPrice = Math.round((2.50 * totalGrams / 1000) * 100) / 100;
        
        uncategorizedItems.push({
          name: ingredient,
          amount: totalGrams.toString(),
          unit: "gramos",
          estimatedPrice: estimatedPrice
        });
      }
    });

    if (uncategorizedItems.length > 0) {
      shoppingListCategories.push({
        category: "Otros",
        items: uncategorizedItems
      });
    }

    return shoppingListCategories;
  }



  return {
    name: preferences.daysToGenerate === 5 ? "Menú Semanal (Lunes a Viernes)" : "Menú Semanal Personalizado",
    days: days.map((dayName, index) => {
      const breakfast = completeRecipes.breakfast[index % completeRecipes.breakfast.length];
      const midmorning = completeRecipes.midmorning[index % completeRecipes.midmorning.length];
      const snack = completeRecipes.snack[index % completeRecipes.snack.length];
      const lunch = completeRecipes.lunch[index % completeRecipes.lunch.length];
      const dinner = completeRecipes.dinner[index % completeRecipes.dinner.length];

      const dayMeals: any = { breakfast, lunch, dinner };
      if (mealsPerDay >= 4) dayMeals['snack'] = snack;
      if (mealsPerDay >= 5) dayMeals['midmorning'] = midmorning;

      console.log(`Generating day ${index + 1} (${dayName}):`, dayMeals);

      const dayIngredients = [breakfast.ingredients, lunch.ingredients, dinner.ingredients];
      if (mealsPerDay >= 4) dayIngredients.push(snack.ingredients);
      if (mealsPerDay >= 5) dayIngredients.push(midmorning.ingredients);
      
      allIngredients.push(...dayIngredients.flat());

      return {
        dayOfWeek: index + 1,
        dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        meals: (() => {
          const meals = [
            {
              mealType: 'breakfast',
              name: breakfast.name,
              description: `Desayuno nutritivo para ${servings} personas`,
              ingredients: breakfast.ingredients.map((ing: string) => ({
                name: ing,
                amount: getIngredientAmount(ing, servings),
                unit: "gramos",
                category: getIngredientCategory(ing)
              })),
              instructions: [`Preparar ${breakfast.name} según ingredientes`],
              nutritionInfo: { calories: 350, protein: 15, carbs: 45, fat: 12, fiber: 5 },
              cookingTime: breakfast.time,
              servings: servings
            }
          ];

          if (mealsPerDay >= 5) {
            meals.push({
              mealType: 'midmorning',
              name: midmorning.name,
              description: `Almuerzo ligero para ${servings} personas`,
              ingredients: midmorning.ingredients.map((ing: string) => ({
                name: ing,
                amount: getIngredientAmount(ing, servings),
                unit: "gramos",
                category: getIngredientCategory(ing)
              })),
              instructions: [`Preparar ${midmorning.name} según ingredientes`],
              nutritionInfo: { calories: 200, protein: 8, carbs: 25, fat: 8, fiber: 3 },
              cookingTime: midmorning.time,
              servings: servings
            });
          }

          meals.push({
            mealType: 'lunch',
            name: lunch.name,
            description: `Comida principal para ${servings} personas`,
            ingredients: lunch.ingredients.map((ing: string) => ({
              name: ing,
              amount: getIngredientAmount(ing, servings),
              unit: "gramos",
              category: getIngredientCategory(ing)
            })),
            instructions: [`Preparar ${lunch.name} según ingredientes`],
            nutritionInfo: { calories: 550, protein: 25, carbs: 65, fat: 18, fiber: 8 },
            cookingTime: lunch.time,
            servings: servings
          });

          if (mealsPerDay >= 4) {
            meals.push({
              mealType: 'snack',
              name: snack.name,
              description: `Merienda saludable para ${servings} personas`,
              ingredients: snack.ingredients.map((ing: string) => ({
                name: ing,
                amount: getIngredientAmount(ing, servings),
                unit: "gramos",
                category: getIngredientCategory(ing)
              })),
              instructions: [`Preparar ${snack.name} según ingredientes`],
              nutritionInfo: { calories: 150, protein: 5, carbs: 20, fat: 6, fiber: 3 },
              cookingTime: snack.time,
              servings: servings
            });
          }

          meals.push({
            mealType: 'dinner',
            name: dinner.name,
            description: `Cena ligera para ${servings} personas`,
            ingredients: dinner.ingredients.map((ing: string) => ({
              name: ing,
              amount: getIngredientAmount(ing, servings),
              unit: "gramos",
              category: getIngredientCategory(ing)
            })),
            instructions: [`Preparar ${dinner.name} según ingredientes`],
            nutritionInfo: { calories: 450, protein: 20, carbs: 35, fat: 15, fiber: 6 },
            cookingTime: dinner.time,
            servings: servings
          });

          return meals;
        })()
      };
    }),
    totalEstimatedCost: Math.min(budget, 45),
    shoppingList: generateShoppingList(allIngredients, budget)
  };
}

export async function registerRoutes(app: Express): Promise<Server> {

  // Auth setup
  // Setup both authentication systems: OIDC for main flow, JWT for local forms
  await setupReplitAuth(app);
  setupLocalAuth(app);

  // Auth routes are handled in setupAuth function

  // Object storage routes for image uploads
  const objectStorageService = new ObjectStorageService();

  // Token analysis endpoint
  app.get("/api/token-analysis", authenticateToken, async (req: any, res) => {
    try {
      // Get example prompt analysis
      const examplePreferences: MenuPreferences = {
        dietaryRestrictions: ['normal'],
        allergies: ['Mariscos'],
        budget: '30',
        cookingTime: 'medium',
        servings: 2,
        daysToGenerate: 5,
        mealsPerDay: 5,
        availableIngredients: [],
        favorites: ['Arroz', 'Pasta', 'Pizza'],
        dislikes: ['Coliflor']
      };

      // Generate actual prompt
      const optimizedPrompt = `JSON menú ${examplePreferences.daysToGenerate}d ${examplePreferences.mealsPerDay}com/d esp:
D:${examplePreferences.dietaryRestrictions.join(',')} A:${examplePreferences.allergies?.join(',') || ''} €${examplePreferences.budget} T:${examplePreferences.cookingTime} ${examplePreferences.servings}p
G:${examplePreferences.favorites?.join(',')} X:${examplePreferences.dislikes?.join(',')}
IMPORTANTE: unit="gramos" amount=cantidades reales en gramos
{name,days:[{dayOfWeek,dayName,meals:[{mealType,name,description,ingredients:[{name,amount,unit:"gramos",category}],instructions[],nutritionInfo:{calories,protein,carbs,fat,fiber},cookingTime,servings}]}],totalEstimatedCost,shoppingList:[{category,items:[{name,amount,unit:"gramos",estimatedPrice}]}]}`;

      const promptAnalysis = analyzePromptTokens(optimizedPrompt);
      
      // Example response token estimation (complete menu for 5 days)
      const estimatedResponseTokens = 2800;
      
      // Calculate costs for both models
      const costComparison = calculateCostComparison(promptAnalysis.estimatedTokens, estimatedResponseTokens);
      
      const gpt4oInputCost = (promptAnalysis.estimatedTokens / 1000) * 0.00025;
      const gpt4oOutputCost = (estimatedResponseTokens / 1000) * 0.00125;
      const totalGpt4oCost = gpt4oInputCost + gpt4oOutputCost;
      
      const gpt35InputCost = (promptAnalysis.estimatedTokens / 1000) * 0.0005;
      const gpt35OutputCost = (estimatedResponseTokens / 1000) * 0.0015;
      const totalGpt35Cost = gpt35InputCost + gpt35OutputCost;
      
      // Calculate Perplexity Sonar Basic costs
      const perplexityTokenCost = ((promptAnalysis.estimatedTokens + estimatedResponseTokens) / 1000) * API_COSTS_SONAR_BASIC.perplexity.input;
      const totalPerplexityCost = perplexityTokenCost + PERPLEXITY_SEARCH_COST;

      res.json({
        prompt: {
          text: optimizedPrompt,
          analysis: promptAnalysis,
          inputCostGPT4o: gpt4oInputCost,
          inputCostGPT35: gpt35InputCost
        },
        response: {
          estimatedTokens: estimatedResponseTokens,
          outputCostGPT4o: gpt4oOutputCost,
          outputCostGPT35: gpt35OutputCost
        },
        total: {
          estimatedTokens: promptAnalysis.estimatedTokens + estimatedResponseTokens,
          gpt4o: {
            totalCostUSD: totalGpt4oCost,
            costPerMenu: totalGpt4oCost,
            monthlyCostPerUser: totalGpt4oCost * 4,
            annualCostAt1000Users: totalGpt4oCost * 4 * 1000 * 12
          },
          gpt35: {
            totalCostUSD: totalGpt35Cost,
            costPerMenu: totalGpt35Cost,
            monthlyCostPerUser: totalGpt35Cost * 4,
            annualCostAt1000Users: totalGpt35Cost * 4 * 1000 * 12
          },
          perplexityBasic: {
            totalCostUSD: totalPerplexityCost,
            costPerMenu: totalPerplexityCost,
            monthlyCostPerUser: totalPerplexityCost * 4,
            annualCostAt1000Users: totalPerplexityCost * 4 * 1000 * 12,
            breakdown: {
              tokenCost: perplexityTokenCost,
              searchCost: PERPLEXITY_SEARCH_COST
            }
          },
          savings: {
            gpt35VsGpt4o: {
              costDifference: totalGpt4oCost - totalGpt35Cost,
              percentageSavings: Math.round(((totalGpt4oCost - totalGpt35Cost) / totalGpt4oCost) * 100),
              annualSavingsAt1000Users: (totalGpt4oCost - totalGpt35Cost) * 4 * 1000 * 12
            },
            perplexityVsGpt4o: {
              costDifference: totalGpt4oCost - totalPerplexityCost,
              percentageSavings: Math.round(((totalGpt4oCost - totalPerplexityCost) / totalGpt4oCost) * 100),
              annualSavingsAt1000Users: (totalGpt4oCost - totalPerplexityCost) * 4 * 1000 * 12
            },
            perplexityVsGpt35: {
              costDifference: totalGpt35Cost - totalPerplexityCost,
              percentageSavings: Math.round(((totalGpt35Cost - totalPerplexityCost) / totalGpt35Cost) * 100),
              annualSavingsAt1000Users: (totalGpt35Cost - totalPerplexityCost) * 4 * 1000 * 12
            }
          }
        },
        modelComparison: {
          gpt4o: {
            pros: ["Mejor calidad de respuestas", "Mejor comprensión del contexto", "Respuestas más precisas"],
            cons: ["Mayor costo por token", "Puede ser excesivo para casos simples"],
            recommendedFor: ["Usuarios premium", "Menús complejos", "Múltiples restricciones dietéticas"]
          },
          gpt35: {
            pros: ["Muy económico", "Suficiente calidad para menús básicos", "Respuestas rápidas"],
            cons: ["Menor precisión en casos complejos", "Menos comprensión del contexto"],
            recommendedFor: ["Usuarios gratuitos", "Menús simples", "Pruebas y desarrollo"]
          },
          perplexityBasic: {
            pros: ["Más económico que GPT-3.5", "Datos en tiempo real", "Búsqueda web integrada", "Respuestas actualizadas"],
            cons: ["Costo fijo por búsqueda", "Depende de conexión a internet", "Menos control sobre el contenido"],
            recommendedFor: ["Menús con tendencias actuales", "Ingredientes de temporada", "Precios actualizados"]
          }
        },
        optimization: {
          characterSaved: EXAMPLE_PROMPT_ANALYSIS.savings.tokenReduction * 4,
          tokenReduction: EXAMPLE_PROMPT_ANALYSIS.savings.tokenReduction,
          percentageReduction: EXAMPLE_PROMPT_ANALYSIS.savings.percentageReduction,
          costSavingsPerMenu: EXAMPLE_PROMPT_ANALYSIS.savings.costSavings
        },
        recommendations: {
          currentStrategy: "Solo GPT-3.5 Turbo y Perplexity Sonar Basic",
          forFreeTier: "Usar Perplexity Sonar Basic con límite de 3 menús/mes (más económico + datos actuales)",
          forBasicTier: "Usar GPT-3.5 Turbo con límite de 8 menús/mes (mejor calidad)",
          fallbackStrategy: "GPT-3.5 Turbo → Perplexity Sonar Basic → Offline",
          costOptimized: "Sistema dual: GPT-3.5 (principal) + Perplexity Basic (fallback con datos reales)",
          imageRecognition: "GPT-4o solo para reconocimiento de imágenes (capacidad multimodal)"
        }
      });
    } catch (error) {
      console.error("Error generating token analysis:", error);
      res.status(500).json({ message: "Failed to generate token analysis" });
    }
  });

  app.get("/objects/:objectPath(*)", authenticateToken, async (req, res) => {
    const userId = req.user?.id;
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId: userId,
        requestedPermission: ObjectPermission.READ,
      });
      if (!canAccess) {
        return res.sendStatus(401);
      }
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  app.post("/api/objects/upload", authenticateToken, async (req, res) => {
    try {
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Menu planning routes - now free for all authenticated users
  app.post("/api/menu-plans", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      const menuPlanData = insertMenuPlanSchema.parse({ ...req.body, userId });
      
      const menuPlan = await storage.createMenuPlan(menuPlanData);
      res.json(menuPlan);
    } catch (error) {
      console.error("Error creating menu plan:", error);
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get("/api/menu-plans", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      const menuPlans = await storage.getUserMenuPlans(userId);
      res.json(menuPlans);
    } catch (error) {
      console.error("Error fetching menu plans:", error);
      res.status(500).json({ error: "Failed to fetch menu plans" });
    }
  });

  app.get("/api/menu-plans/:id", authenticateToken, async (req, res) => {
    try {
      const menuPlan = await storage.getMenuPlan(req.params.id);
      if (!menuPlan) {
        return res.status(404).json({ error: "Menu plan not found" });
      }
      
      // Check if user owns this menu plan
      const userId = req.user?.claims?.sub;
      if (menuPlan.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const recipes = await storage.getMenuPlanRecipes(menuPlan.id);
      res.json({ ...menuPlan, recipes });
    } catch (error) {
      console.error("Error fetching menu plan:", error);
      res.status(500).json({ error: "Failed to fetch menu plan" });
    }
  });

  app.delete("/api/menu-plans/:id", authenticateToken, async (req, res) => {
    try {
      const menuPlan = await storage.getMenuPlan(req.params.id);
      if (!menuPlan) {
        return res.status(404).json({ error: "Menu plan not found" });
      }
      
      // Check if user owns this menu plan
      const userId = req.user?.claims?.sub;
      if (menuPlan.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      await storage.deleteMenuPlan(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting menu plan:", error);
      res.status(500).json({ error: "Failed to delete menu plan" });
    }
  });

  // AI Menu Generation with Fallback System - now free for all users
  app.post("/api/generate-menu", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const preferences: MenuPreferences = req.body;
      
      console.log('User ID for menu generation:', userId);
      console.log('Menu preferences:', preferences);
      
      let generatedMenu;
      let enhancementData;
      let usingFallback = false;

      try {
        // Try GPT-3.5 Turbo first (cost-optimized primary)
        enhancementData = await enhanceMenuWithTrends(preferences);
        generatedMenu = await generateWeeklyMenuPlan(preferences, enhancementData);
        console.log('Menu generated successfully with GPT-3.5 Turbo');
      } catch (openaiError) {
        console.log('GPT-3.5 Turbo failed, switching to Perplexity Sonar Basic fallback:', openaiError);
        try {
          // Fallback to Perplexity Sonar Basic (real-time data)
          generatedMenu = await generateMenuPlanWithPerplexity(preferences);
          enhancementData = await enhanceMenuWithTrends(preferences); // Still try to get trends
          console.log('Menu generated successfully with Perplexity Sonar Basic fallback');
          usingFallback = true;
        } catch (perplexityError) {
          console.log('Perplexity also failed, using offline fallback:', perplexityError);
          // Use intelligent offline fallback with database recipes
          generatedMenu = await generateOfflineMenu(preferences);
          enhancementData = null; // No enhancement data available
          usingFallback = true;
          console.log('Menu generated successfully with offline fallback');
        }
      }
      
      // Ensure userId is available
      if (!userId) {
        return res.status(401).json({ error: "User authentication required" });
      }

      // Save the generated menu plan with enhancement data
      const menuPlan = await storage.createMenuPlan({
        userId: userId,
        name: generatedMenu.name || "Menú Semanal Personalizado",
        weekStartDate: new Date(),
        preferences: {
          ...preferences,
          enhancementData: enhancementData
        },
      });
      
      // Save recipes
      const recipes = [];
      for (const day of generatedMenu.days) {
        for (const meal of day.meals) {
          const recipe = await storage.createRecipe({
            menuPlanId: menuPlan.id,
            dayOfWeek: day.dayOfWeek,
            mealType: meal.mealType,
            name: meal.name,
            description: meal.description,
            ingredients: meal.ingredients,
            instructions: meal.instructions,
            nutritionInfo: meal.nutritionInfo,
            cookingTime: meal.cookingTime,
            servings: meal.servings,
          });
          recipes.push(recipe);
        }
      }
      
      // Save shopping list
      const shoppingList = await storage.createShoppingList({
        menuPlanId: menuPlan.id,
        items: generatedMenu.shoppingList || [],
        totalEstimatedCost: generatedMenu.totalEstimatedCost || 0,
      });
      
      res.json({ 
        menuPlan, 
        recipes, 
        shoppingList,
        enhancementData: enhancementData,
        usingFallback: usingFallback,
        aiProvider: usingFallback ? 'Perplexity Sonar Basic' : 'GPT-3.5 Turbo'
      });
    } catch (error) {
      console.error("Error generating menu:", error);
      res.status(500).json({ error: "Failed to generate menu: " + (error as Error).message });
    }
  });

  // Food recognition by photo route with fallback
  app.post("/api/analyze-food", authenticateToken, async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ error: "Image is required" });
      }

      let ingredients;
      let usingFallback = false;

      try {
        // Try GPT-4o first (image recognition requires multimodal capabilities)
        ingredients = await recognizeFoodFromImage(image);
        console.log('Food recognition successful with GPT-4o');
      } catch (openaiError) {
        console.log('OpenAI failed for food recognition, using Perplexity fallback:', openaiError);
        usingFallback = true;
        
        // Fallback to Perplexity (limited functionality)
        ingredients = await recognizeIngredientsWithPerplexity(image);
        console.log('Food recognition completed with Perplexity fallback');
      }

      res.json({ 
        ingredients,
        usingFallback: usingFallback,
        aiProvider: usingFallback ? 'Perplexity' : 'GPT-4o (Image Recognition)'
      });
    } catch (error) {
      console.error("Error analyzing food image:", error);
      res.status(500).json({ error: "Failed to analyze food image" });
    }
  });



  // Food recognition routes
  app.post("/api/recognize-food", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const { imageUrl } = req.body;
      
      if (!imageUrl) {
        return res.status(400).json({ error: "Image URL is required" });
      }

      // Extract base64 data from data URL or fetch from object storage
      let base64Image: string;
      if (imageUrl.startsWith('data:image/')) {
        base64Image = imageUrl.split(',')[1];
      } else {
        // For now, return error - in production we'd fetch the image from object storage
        return res.status(400).json({ error: "Only data URLs supported for now" });
      }
      
      let recognition;
      let usingFallback = false;

      try {
        // Try GPT-4o first (image recognition requires multimodal capabilities)
        recognition = await recognizeFoodFromImage(base64Image);
        console.log('Food recognition successful with GPT-4o');
      } catch (openaiError) {
        console.log('OpenAI failed for food recognition, using Perplexity fallback:', openaiError);
        usingFallback = true;
        
        // Fallback to Perplexity (limited functionality)
        const ingredients = await recognizeIngredientsWithPerplexity(base64Image);
        recognition = {
          recognizedItems: ingredients,
          suggestedRecipes: []
        };
        console.log('Food recognition completed with Perplexity fallback');
      }
      
      // Save recognition result
      const savedRecognition = await storage.createFoodRecognition({
        userId,
        imageUrl,
        recognizedItems: Array.isArray(recognition) ? recognition : recognition.recognizedItems,
        suggestedRecipes: Array.isArray(recognition) ? [] : recognition.suggestedRecipes,
      });
      
      res.json({
        ...savedRecognition,
        usingFallback: usingFallback,
        aiProvider: usingFallback ? 'Perplexity' : 'GPT-4o (Image Recognition)'
      });
    } catch (error) {
      console.error("Error recognizing food:", error);
      res.status(500).json({ error: "Failed to recognize food: " + (error as Error).message });
    }
  });

  app.post("/api/food-images", authenticateToken, async (req, res) => {
    if (!req.body.imageURL) {
      return res.status(400).json({ error: "imageURL is required" });
    }

    const userId = req.user?.claims?.sub;

    try {
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.imageURL,
        {
          owner: userId,
          visibility: "private", // Food images should be private
        },
      );

      res.status(200).json({ objectPath });
    } catch (error) {
      console.error("Error setting food image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/food-recognitions", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const recognitions = await storage.getUserFoodRecognitions(userId);
      res.json(recognitions);
    } catch (error) {
      console.error("Error fetching food recognitions:", error);
      res.status(500).json({ error: "Failed to fetch food recognitions" });
    }
  });

  // Menu plans management routes
  app.get("/api/menu-plans", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const menuPlans = await storage.getUserMenuPlans(userId);
      res.json(menuPlans);
    } catch (error) {
      console.error("Error fetching menu plans:", error);
      res.status(500).json({ error: "Failed to fetch menu plans" });
    }
  });

  app.get("/api/menu-plans/:id", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const menuPlanId = req.params.id;
      
      const menuPlan = await storage.getMenuPlan(menuPlanId);
      if (!menuPlan || menuPlan.userId !== userId) {
        return res.status(404).json({ error: "Menu plan not found" });
      }

      const recipes = await storage.getMenuPlanRecipes(menuPlanId);
      const shoppingList = await storage.getMenuPlanShoppingList(menuPlanId);

      res.json({
        menuPlan,
        recipes,
        shoppingList
      });
    } catch (error) {
      console.error("Error fetching menu plan details:", error);
      res.status(500).json({ error: "Failed to fetch menu plan details" });
    }
  });

  app.delete("/api/menu-plans/:id", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const menuPlanId = req.params.id;
      
      const menuPlan = await storage.getMenuPlan(menuPlanId);
      if (!menuPlan || menuPlan.userId !== userId) {
        return res.status(404).json({ error: "Menu plan not found" });
      }

      await storage.deleteMenuPlan(menuPlanId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting menu plan:", error);
      res.status(500).json({ error: "Failed to delete menu plan" });
    }
  });

  // Recipe suggestion routes
  app.post("/api/suggest-recipes", authenticateToken, async (req, res) => {
    try {
      const { ingredients } = req.body;
      
      if (!ingredients || !Array.isArray(ingredients)) {
        return res.status(400).json({ error: "Ingredients array is required" });
      }
      
      const suggestions = await generateRecipeSuggestions(ingredients);
      res.json(suggestions);
    } catch (error) {
      console.error("Error generating recipe suggestions:", error);
      res.status(500).json({ error: "Failed to generate recipe suggestions: " + (error as Error).message });
    }
  });



  app.get("/api/price-comparisons", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const comparisons = await storage.getUserPriceComparisons(userId);
      res.json(comparisons);
    } catch (error) {
      console.error("Error fetching price comparisons:", error);
      res.status(500).json({ error: "Failed to fetch price comparisons" });
    }
  });

  // Shopping list routes
  app.get("/api/menu-plans/:id/shopping-list", authenticateToken, async (req, res) => {
    try {
      const menuPlan = await storage.getMenuPlan(req.params.id);
      if (!menuPlan) {
        return res.status(404).json({ error: "Menu plan not found" });
      }
      
      // Check if user owns this menu plan
      const userId = req.user?.claims?.sub;
      if (menuPlan.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const shoppingList = await storage.getMenuPlanShoppingList(menuPlan.id);
      res.json(shoppingList);
    } catch (error) {
      console.error("Error fetching shopping list:", error);
      res.status(500).json({ error: "Failed to fetch shopping list" });
    }
  });

  // SkinChef chat endpoint
  app.post('/api/skinchef/chat', authenticateToken, async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Importar módulo de seguridad
      const { SkinChefSecurity } = await import('./skinchefSecurity');

      // Validar el mensaje antes de procesarlo
      const validation = SkinChefSecurity.validateMessage(message);
      if (!validation.isValid) {
        return res.json({
          response: validation.reason || 'Solo puedo ayudar con temas culinarios.',
          provider: 'security_filter'
        });
      }

      // Generar prompt seguro
      const securePrompt = SkinChefSecurity.generateSecurePrompt(message);

      // Try OpenAI first
      try {
        const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: securePrompt
              }
            ],
            max_tokens: 300,
            temperature: 0.7,
          }),
        });

        if (openAIResponse.ok) {
          const data = await openAIResponse.json();
          const response = data.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta.';
          return res.json({ response, provider: 'openai' });
        }
      } catch (openAIError) {
        console.error('OpenAI API error:', openAIError);
      }

      // Fallback to Perplexity
      try {
        const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-sonar-small-128k-online',
            messages: [
              {
                role: 'system',
                content: securePrompt
              }
            ],
            max_tokens: 300,
            temperature: 0.7,
          }),
        });

        if (perplexityResponse.ok) {
          const data = await perplexityResponse.json();
          const response = data.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta.';
          return res.json({ response, provider: 'perplexity' });
        }
      } catch (perplexityError) {
        console.error('Perplexity API error:', perplexityError);
      }

      // Fallback response
      res.json({ 
        response: 'Lo siento, temporalmente no puedo procesar tu consulta. Por favor intenta de nuevo en unos momentos.', 
        provider: 'fallback' 
      });

    } catch (error) {
      console.error('SkinChef chat error:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  // Google Play Billing routes
  // Plan generation routes (onboarding)
  app.use('/api/plan', planRoutes);
  
  // Savings mode routes
  app.use('/api/savings', savingsRoutes);
  
  // Fridge vision routes
  app.use('/api/fridge', fridgeRoutes);

  // App Check routes (Firebase App Check enforcement)
  app.use('/api/app-check', appCheckRouter);

  app.post("/api/google-play/verify-purchase", authenticateToken, googlePlayBilling.verifyPurchase);
  app.post("/api/google-play/verify-purchase-rsa", authenticateToken, googlePlayBilling.verifyPurchaseRSA);
  app.get("/api/google-play/purchases", authenticateToken, googlePlayBilling.getUserPurchases);
  app.post("/api/google-play/webhook", googlePlayBilling.handleWebhook);
  app.get("/api/google-play/subscription-status", authenticateToken, googlePlayBilling.getSubscriptionStatus);

  // Backwards compatibility route for subscription status
  app.get("/api/subscription/status", authenticateToken, googlePlayBilling.getSubscriptionStatus);

  // Feature flags and configuration endpoint for ads
  app.get("/api/config", (req, res) => {
    const config = {
      ads: {
        enabled: true,
        banner_enabled: true,
        interstitial_enabled: true,
        rewarded_enabled: true,
        cap_interstitial: 5, // Show interstitial every 5 actions
        cap_rewarded: 3, // Allow 3 rewarded ads per session
        show_ads_free_users: true,
        hide_ads_premium_users: true
      },
      paywall: {
        nudge_after_actions: 5, // Show paywall after 5 actions
        trial_days: 7,
        price_monthly: "1.99",
        currency: "EUR"
      },
      app: {
        version: "1.1.0",
        force_update: false,
        maintenance_mode: false
      }
    };
    
    res.json({
      success: true,
      config
    });
  });

  // Simplified Google Play Billing routes (as per requirements)
  app.post("/api/verify", googlePlaySimple.verify);
  app.get("/api/subscription-status", googlePlaySimple.subscriptionStatus);
  app.post("/api/googleplay/webhook", googlePlaySimple.webhook);

  // Serve privacy policy and terms for Play Store compliance
  app.get("/privacy-policy", (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Política de Privacidad - TheCookFlow</title>
</head>
<body>
    <h1>Política de Privacidad - TheCookFlow</h1>
    <p><strong>Última actualización: 12 de agosto de 2025</strong></p>
    
    <h2>1. Información que recopilamos</h2>
    <p>TheCookFlow recopila la siguiente información:</p>
    <ul>
        <li>Información de registro (email, nombre)</li>
        <li>Preferencias dietéticas y restricciones alimentarias</li>
        <li>Imágenes de alimentos para reconocimiento automático</li>
        <li>Información de suscripción y pagos a través de Google Play</li>
    </ul>
    
    <h2>2. Cómo utilizamos tu información</h2>
    <p>Utilizamos tu información para:</p>
    <ul>
        <li>Generar menús personalizados usando inteligencia artificial</li>
        <li>Procesar pagos de suscripciones</li>
        <li>Mejorar nuestros servicios</li>
        <li>Enviar actualizaciones importantes del servicio</li>
    </ul>
    
    <h2>3. Servicios de terceros</h2>
    <p>Utilizamos los siguientes servicios:</p>
    <ul>
        <li>OpenAI para generación de contenido</li>
        <li>Google Play Billing para pagos</li>
        <li>Replit para hosting</li>
    </ul>
    
    <h2>4. Contacto</h2>
    <p>Para cualquier consulta sobre privacidad, contacta: privacy@thecookflow.com</p>
</body>
</html>`);
  });

  app.get("/terms-of-service", (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Términos de Servicio - TheCookFlow</title>
</head>
<body>
    <h1>Términos de Servicio - TheCookFlow</h1>
    <p><strong>Última actualización: 12 de agosto de 2025</strong></p>
    
    <h2>1. Aceptación de términos</h2>
    <p>Al usar TheCookFlow, aceptas estos términos de servicio.</p>
    
    <h2>2. Descripción del servicio</h2>
    <p>TheCookFlow es una aplicación de planificación de menús que utiliza inteligencia artificial para generar menús personalizados y listas de compras.</p>
    
    <h2>3. Suscripciones y pagos</h2>
    <ul>
        <li>Período de prueba gratuita: 7 días</li>
        <li>Suscripción Premium: €1.99/mes o €19.99/año</li>
        <li>Los pagos se procesan a través de Google Play</li>
        <li>Puedes cancelar en cualquier momento desde Google Play</li>
    </ul>
    
    <h2>4. Uso aceptable</h2>
    <p>Te comprometes a usar la aplicación solo para fines legales y personales.</p>
    
    <h2>5. Contacto</h2>
    <p>Para soporte técnico, contacta: support@thecookflow.com</p>
</body>
</html>`);
  });

  // Demo and QA routes
  app.use("/api", demoRoutes);
  // app.use("/api", qaRoutes); // Using registerQARoutes instead
  app.use("/api", screenshotsRoutes);
  app.use("/api", healthRoutes);
  app.use("/api", monitoringRoutes);
  app.use("/api", calendarRoutes);
  app.use("/api", sharingRoutes);
  app.use("/api", referralsRoutes);
  app.use("/api", packsRoutes);
  app.use("/api", analyticsRoutes);
  app.use("/api", adminRoutes);
  app.use("/api", stagingRoutes);
  app.use("/api", freemiumRoutes);
  app.use("/api/gamification", gamificationRoutes);
  
  // Create demo user for QA testing
  app.post("/api/auth/create-demo-user", async (req, res) => {
    try {
      // Import auth functions
      const { hashPassword } = await import('./auth');
      
      // Check if demo user already exists
      const existingUser = await storage.getUserByEmail("demo@thecookflow.com");
      if (existingUser) {
        return res.json({ 
          success: true, 
          message: "Usuario demo ya existe",
          credentials: {
            email: "demo@thecookflow.com",
            password: "demo123"
          }
        });
      }

      // Create demo user with hashed password
      const hashedPassword = await hashPassword("demo123");
      const demoUser = await storage.createUser({
        id: "demo-user-qa-testing",
        email: "demo@thecookflow.com",
        password: hashedPassword,
        firstName: "Usuario",
        lastName: "Demo",
        profileImageUrl: null,
        isPremium: false,
        subscriptionStatus: 'trial',
        googlePlayPurchaseToken: null,
        subscriptionId: null,
        purchaseTime: null,
        expiryTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days trial
        autoRenewing: false
      });

      res.json({ 
        success: true, 
        message: "Usuario demo creado exitosamente",
        user: {
          id: demoUser.id,
          email: demoUser.email,
          firstName: demoUser.firstName,
          lastName: demoUser.lastName
        },
        credentials: {
          email: "demo@thecookflow.com",
          password: "demo123"
        }
      });
    } catch (error) {
      console.error("Error creating demo user:", error);
      res.status(500).json({ 
        error: "Error al crear usuario demo",
        details: (error as Error).message 
      });
    }
  });

  // Register QA routes for autocontained report
  registerQARoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
