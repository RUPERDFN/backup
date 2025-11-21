import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

// Tabla de precios medios para cálculos de ahorro (€/kg)
const PRICE_INDEX = {
  // Proteínas
  'pollo': { normal: 6.50, economico: 4.20, ahorro: 2.30 },
  'ternera': { normal: 12.80, economico: 8.90, ahorro: 3.90 },
  'pescado': { normal: 8.20, economico: 5.50, ahorro: 2.70 },
  'huevos': { normal: 2.40, economico: 1.80, ahorro: 0.60 },
  'legumbres': { normal: 3.20, economico: 2.10, ahorro: 1.10 },
  
  // Carbohidratos
  'arroz': { normal: 2.10, economico: 1.20, ahorro: 0.90 },
  'pasta': { normal: 1.80, economico: 1.00, ahorro: 0.80 },
  'patatas': { normal: 1.20, economico: 0.85, ahorro: 0.35 },
  'pan': { normal: 2.50, economico: 1.40, ahorro: 1.10 },
  
  // Verduras
  'tomates': { normal: 3.20, economico: 2.40, ahorro: 0.80 },
  'cebollas': { normal: 1.50, economico: 1.10, ahorro: 0.40 },
  'zanahorias': { normal: 1.80, economico: 1.30, ahorro: 0.50 },
  'apio': { normal: 2.20, economico: 1.60, ahorro: 0.60 },
  
  // Lácteos
  'leche': { normal: 1.10, economico: 0.85, ahorro: 0.25 },
  'queso': { normal: 8.50, economico: 6.20, ahorro: 2.30 },
  'yogur': { normal: 3.40, economico: 2.10, ahorro: 1.30 }
};

// Equivalencias para ingredientes caros
const INGREDIENT_SUBSTITUTIONS = {
  'salmón': { substitute: 'caballa', reason: 'Pescado azul más económico con similar valor nutricional' },
  'ternera': { substitute: 'pollo', reason: 'Proteína más económica y versátil' },
  'jamón ibérico': { substitute: 'jamón serrano', reason: 'Alternativa más económica con buen sabor' },
  'queso manchego': { substitute: 'queso curado', reason: 'Queso curado genérico más económico' },
  'espárragos': { substitute: 'judías verdes', reason: 'Verdura más económica y disponible todo el año' },
  'langostinos': { substitute: 'merluza', reason: 'Pescado blanco más económico' },
  'rape': { substitute: 'bacalao', reason: 'Pescado blanco tradicional y económico' },
  'aceite de oliva virgen extra': { substitute: 'aceite de oliva', reason: 'Mantiene calidad con menor coste' }
};

// Agrupación por formatos de compra
const PURCHASE_FORMATS = {
  'arroz': { format: 'saco 5kg', multiplier: 0.85, savings: 'Compra en formato grande' },
  'pasta': { format: 'pack 3 unidades', multiplier: 0.90, savings: 'Pack ahorro' },
  'legumbres': { format: 'a granel', multiplier: 0.80, savings: 'Compra a granel sin envase' },
  'aceite': { format: 'garrafa 5L', multiplier: 0.75, savings: 'Formato familiar' },
  'tomate_frito': { format: 'brick 3x400g', multiplier: 0.85, savings: 'Pack múltiple' },
  'atún': { format: 'pack 8 latas', multiplier: 0.80, savings: 'Conservas en pack' }
};

interface SavingsRequest {
  menuPlan: any;
  currentBudget: number;
  savingsLevel: 'moderate' | 'aggressive';
}

// Endpoint principal del Modo Ahorro
router.post('/savings', async (req: Request, res: Response) => {
  try {
    const { menuPlan, currentBudget, savingsLevel = 'moderate' }: SavingsRequest = req.body;

    if (!menuPlan || !currentBudget) {
      return res.status(400).json({ error: 'menuPlan y currentBudget son requeridos' });
    }

    // Analizar ingredientes del menú actual
    const analysis = analyzeMenuIngredients(menuPlan);
    
    // Aplicar sustituciones según nivel de ahorro
    const optimizedMenu = optimizeMenuForSavings(menuPlan, savingsLevel);
    
    // Calcular costes y ahorros
    const costCalculation = calculateSavings(analysis, optimizedMenu, currentBudget);
    
    // Agrupar por formatos de compra
    const purchaseOptimization = optimizePurchaseFormats(optimizedMenu.ingredients);

    const response = {
      analysis: {
        originalCost: costCalculation.originalCost,
        optimizedCost: costCalculation.optimizedCost,
        weeklysavings: costCalculation.weeklysavings,
        savingsPercentage: costCalculation.savingsPercentage,
        annualSavings: costCalculation.weeklysavings * 52
      },
      optimizedMenu,
      substitutions: costCalculation.substitutions,
      purchaseOptimization,
      recommendations: generateSavingsRecommendations(costCalculation),
      badge: {
        text: `-€${costCalculation.weeklysavings.toFixed(2)}`,
        description: `Ahorro semanal estimado`
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Error calculating savings:', error);
    res.status(500).json({ error: 'Error calculando ahorros' });
  }
});

// Activar modo ahorro por defecto para usuario
router.post('/activate-default-savings', async (req: Request, res: Response) => {
  try {
    const { userId, savingsLevel = 'moderate' } = req.body;

    // En una implementación real, esto se guardaría en la base de datos
    // Para el demo, devolvemos confirmación
    res.json({
      success: true,
      message: 'Modo Ahorro activado por defecto',
      settings: {
        savingsLevel,
        autoSubstitutions: true,
        purchaseOptimization: true,
        weeklyBudgetReduction: savingsLevel === 'aggressive' ? 0.25 : 0.15
      }
    });

  } catch (error) {
    console.error('Error activating savings mode:', error);
    res.status(500).json({ error: 'Error activando modo ahorro' });
  }
});

// Funciones auxiliares
function analyzeMenuIngredients(menuPlan: any) {
  const ingredients = [];
  
  if (menuPlan.days) {
    for (const day of menuPlan.days) {
      for (const meal of day.meals) {
        if (meal.ingredients) {
          ingredients.push(...meal.ingredients);
        }
      }
    }
  }

  return {
    totalIngredients: ingredients.length,
    expensiveIngredients: ingredients.filter(ing => 
      Object.keys(INGREDIENT_SUBSTITUTIONS).some(expensive => 
        ing.name.toLowerCase().includes(expensive.toLowerCase())
      )
    ),
    substitutableIngredients: ingredients.filter(ing =>
      Object.keys(INGREDIENT_SUBSTITUTIONS).includes(ing.name.toLowerCase())
    )
  };
}

function optimizeMenuForSavings(menuPlan: any, savingsLevel: string) {
  const optimizedMenu = JSON.parse(JSON.stringify(menuPlan));
  const substitutions: any[] = [];
  
  if (optimizedMenu.days) {
    for (const day of optimizedMenu.days) {
      for (const meal of day.meals) {
        if (meal.ingredients) {
          meal.ingredients = meal.ingredients.map((ingredient: any) => {
            const substitution = findSubstitution(ingredient.name, savingsLevel);
            if (substitution) {
              substitutions.push({
                original: ingredient.name,
                substitute: substitution.substitute,
                reason: substitution.reason,
                savings: calculateIngredientSavings(ingredient.name, substitution.substitute)
              });
              
              return {
                ...ingredient,
                name: substitution.substitute,
                isSubstitution: true,
                originalName: ingredient.name
              };
            }
            return ingredient;
          });
        }
      }
    }
  }

  return {
    ...optimizedMenu,
    substitutions,
    optimizationLevel: savingsLevel
  };
}

function findSubstitution(ingredientName: string, savingsLevel: string) {
  const lowerName = ingredientName.toLowerCase();
  
  for (const [expensive, substitution] of Object.entries(INGREDIENT_SUBSTITUTIONS)) {
    if (lowerName.includes(expensive.toLowerCase())) {
      // En modo agresivo, sustituimos más ingredientes
      if (savingsLevel === 'aggressive' || isPrimaryExpensiveIngredient(expensive)) {
        return substitution;
      }
    }
  }
  
  return null;
}

function isPrimaryExpensiveIngredient(ingredient: string): boolean {
  const primaryExpensive = ['salmón', 'ternera', 'jamón ibérico', 'langostinos'];
  return primaryExpensive.includes(ingredient);
}

function calculateSavings(analysis: any, optimizedMenu: any, currentBudget: number) {
  let originalCost = currentBudget;
  let totalSavings = 0;
  const substitutions = optimizedMenu.substitutions || [];

  // Calcular ahorros por sustituciones
  for (const substitution of substitutions) {
    totalSavings += substitution.savings;
  }

  // Aplicar descuentos por formato de compra (5-20% adicional)
  const formatSavings = originalCost * 0.12; // 12% promedio
  totalSavings += formatSavings;

  const optimizedCost = Math.max(originalCost - totalSavings, originalCost * 0.6); // Mínimo 40% de ahorro
  const weeklysavings = originalCost - optimizedCost;
  const savingsPercentage = (weeklysavings / originalCost) * 100;

  return {
    originalCost,
    optimizedCost,
    weeklysavings,
    savingsPercentage,
    substitutions,
    formatSavings
  };
}

function calculateIngredientSavings(original: string, substitute: string): number {
  const originalPrice = PRICE_INDEX[original.toLowerCase()]?.normal || 5.0;
  const substitutePrice = PRICE_INDEX[substitute.toLowerCase()]?.economico || 3.0;
  
  return Math.max(0, originalPrice - substitutePrice);
}

function optimizePurchaseFormats(ingredients: any[]) {
  const optimizations = [];
  
  for (const ingredient of ingredients) {
    const format = PURCHASE_FORMATS[ingredient.name.toLowerCase()];
    if (format) {
      optimizations.push({
        ingredient: ingredient.name,
        recommendation: format.format,
        savings: format.savings,
        estimatedDiscount: `${((1 - format.multiplier) * 100).toFixed(0)}%`
      });
    }
  }

  return optimizations;
}

function generateSavingsRecommendations(costCalculation: any) {
  const recommendations = [];

  if (costCalculation.savingsPercentage > 20) {
    recommendations.push({
      type: 'high-savings',
      title: 'Excelente ahorro potencial',
      description: `Puedes ahorrar más del ${costCalculation.savingsPercentage.toFixed(0)}% semanal`
    });
  }

  if (costCalculation.substitutions.length > 0) {
    recommendations.push({
      type: 'substitutions',
      title: 'Sustituciones inteligentes',
      description: `${costCalculation.substitutions.length} ingredientes optimizados para ahorro`
    });
  }

  recommendations.push({
    type: 'annual-impact',
    title: 'Impacto anual',
    description: `Ahorro proyectado: €${(costCalculation.weeklysavings * 52).toFixed(2)}/año`
  });

  return recommendations;
}

export default router;