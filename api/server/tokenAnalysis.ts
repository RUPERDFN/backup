// Token analysis utility for monitoring API usage and costs
export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
  apiProvider: 'openai' | 'perplexity' | 'offline';
  timestamp: Date;
}

export interface ApiCosts {
  openai: {
    input: number;  // per 1K tokens
    output: number; // per 1K tokens
  };
  perplexity: {
    input: number;
    output: number;
  };
}

// Current API pricing (per 1K tokens in USD)
export const API_COSTS: ApiCosts = {
  openai: {
    input: 0.00025,   // GPT-4o input
    output: 0.00125   // GPT-4o output
  },
  perplexity: {
    input: 0.0002,    // Perplexity sonar-pro (legacy pricing)
    output: 0.0008    // Perplexity sonar-pro (legacy pricing)
  }
};

export const API_COSTS_GPT35: ApiCosts = {
  openai: {
    input: 0.0005,    // GPT-3.5 Turbo input
    output: 0.0015    // GPT-3.5 Turbo output
  },
  perplexity: {
    input: 0.0002,    // Perplexity sonar-pro
    output: 0.0008    // Perplexity sonar-pro
  }
};

// New Sonar Basic Model (Most Economical)
export const API_COSTS_SONAR_BASIC: ApiCosts = {
  perplexity: {
    input: 0.001333,  // $1 per 750K words ≈ $1.33 per 1M tokens
    output: 0.001333  // Same for output (unified pricing)
  },
  openai: {
    input: 0.00025,   // GPT-4o for comparison
    output: 0.00125   
  }
};

// Fixed search cost for Perplexity (per API call, not per token)
export const PERPLEXITY_SEARCH_COST = 0.005; // $5 per 1,000 searches = $0.005 per search

export function calculateCost(tokens: TokenUsage, model: 'gpt-4o' | 'gpt-3.5-turbo' = 'gpt-4o'): number {
  const costsTable = model === 'gpt-3.5-turbo' ? API_COSTS_GPT35 : API_COSTS;
  const costs = costsTable[tokens.apiProvider as keyof typeof costsTable];
  if (!costs) return 0;
  
  const inputCost = (tokens.promptTokens / 1000) * costs.input;
  const outputCost = (tokens.completionTokens / 1000) * costs.output;
  
  return Math.round((inputCost + outputCost) * 10000) / 10000; // Round to 4 decimals
}

export function calculateCostComparison(promptTokens: number, completionTokens: number) {
  const gpt4oCost = calculateCost({ promptTokens, completionTokens, totalTokens: promptTokens + completionTokens, estimatedCost: 0, apiProvider: 'openai', timestamp: new Date() }, 'gpt-4o');
  const gpt35Cost = calculateCost({ promptTokens, completionTokens, totalTokens: promptTokens + completionTokens, estimatedCost: 0, apiProvider: 'openai', timestamp: new Date() }, 'gpt-3.5-turbo');
  
  // Calculate Perplexity costs (token cost + search cost)
  const perplexityTokenCost = ((promptTokens + completionTokens) / 1000) * API_COSTS_SONAR_BASIC.perplexity.input;
  const perplexityTotalCost = perplexityTokenCost + PERPLEXITY_SEARCH_COST;
  
  return {
    gpt4o: gpt4oCost,
    gpt35: gpt35Cost,
    perplexityBasic: perplexityTotalCost,
    savings: {
      gpt35VsGpt4o: gpt4oCost - gpt35Cost,
      perplexityVsGpt4o: gpt4oCost - perplexityTotalCost,
      perplexityVsGpt35: gpt35Cost - perplexityTotalCost
    },
    percentageSavings: {
      gpt35VsGpt4o: Math.round(((gpt4oCost - gpt35Cost) / gpt4oCost) * 100),
      perplexityVsGpt4o: Math.round(((gpt4oCost - perplexityTotalCost) / gpt4oCost) * 100),
      perplexityVsGpt35: Math.round(((gpt35Cost - perplexityTotalCost) / gpt35Cost) * 100)
    }
  };
}

export function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters for Spanish text
  return Math.ceil(text.length / 4);
}

export function analyzePromptTokens(prompt: string): {
  estimatedTokens: number;
  characterCount: number;
  compressionRatio: number;
} {
  const characterCount = prompt.length;
  const estimatedTokens = estimateTokens(prompt);
  
  // Compare against unoptimized prompt length (~2400 chars)
  const originalLength = 2400;
  const compressionRatio = Math.round(((originalLength - characterCount) / originalLength) * 100);
  
  return {
    estimatedTokens,
    characterCount,
    compressionRatio
  };
}

export function generateUsageReport(tokenUsages: TokenUsage[]): {
  totalCost: number;
  averageCostPerMenu: number;
  totalMenus: number;
  apiBreakdown: {
    openai: { menus: number; cost: number; successRate: number };
    perplexity: { menus: number; cost: number; successRate: number };
    offline: { menus: number; cost: number; successRate: number };
  };
  monthlyProjection: number;
} {
  const totalCost = tokenUsages.reduce((sum, usage) => sum + usage.estimatedCost, 0);
  const totalMenus = tokenUsages.length;
  const averageCostPerMenu = totalMenus > 0 ? totalCost / totalMenus : 0;
  
  const apiBreakdown = {
    openai: {
      menus: tokenUsages.filter(u => u.apiProvider === 'openai').length,
      cost: tokenUsages.filter(u => u.apiProvider === 'openai').reduce((sum, u) => sum + u.estimatedCost, 0),
      successRate: 0
    },
    perplexity: {
      menus: tokenUsages.filter(u => u.apiProvider === 'perplexity').length,
      cost: tokenUsages.filter(u => u.apiProvider === 'perplexity').reduce((sum, u) => sum + u.estimatedCost, 0),
      successRate: 0
    },
    offline: {
      menus: tokenUsages.filter(u => u.apiProvider === 'offline').length,
      cost: 0, // Offline has no API cost
      successRate: 100
    }
  };
  
  // Calculate success rates (assuming offline is always successful)
  const totalApiAttempts = apiBreakdown.openai.menus + apiBreakdown.perplexity.menus;
  if (totalApiAttempts > 0) {
    apiBreakdown.openai.successRate = Math.round((apiBreakdown.openai.menus / totalApiAttempts) * 100);
    apiBreakdown.perplexity.successRate = Math.round((apiBreakdown.perplexity.menus / totalApiAttempts) * 100);
  }
  
  // Project monthly cost (assuming 4 menus per user per month)
  const monthlyProjection = averageCostPerMenu * 4;
  
  return {
    totalCost: Math.round(totalCost * 10000) / 10000,
    averageCostPerMenu: Math.round(averageCostPerMenu * 10000) / 10000,
    totalMenus,
    apiBreakdown,
    monthlyProjection: Math.round(monthlyProjection * 10000) / 10000
  };
}

// Example usage data for demonstration
export const EXAMPLE_PROMPT_ANALYSIS = {
  originalPrompt: {
    text: `Genera un menú semanal personalizado en español para 2 personas con las siguientes preferencias: restricciones dietéticas: normal, alergias: mariscos, presupuesto: 30 euros, tiempo de cocción: medio, ingredientes disponibles: ninguno, favoritos: arroz, pasta, pizza, no me gusta: coliflor. El menú debe incluir 5 días (lunes a viernes) con 5 comidas por día (desayuno, media mañana, comida, merienda, cena). Proporciona el resultado en formato JSON con la siguiente estructura: {name, days: [{dayOfWeek, dayName, meals: [{mealType, name, description, ingredients: [{name, amount, unit, category}], instructions, nutritionInfo: {calories, protein, carbs, fat, fiber}, cookingTime, servings}]}], totalEstimatedCost, shoppingList: [{category, items: [{name, amount, unit, estimatedPrice}]}]}`,
    tokens: 412,
    cost: 0.000103
  },
  optimizedPrompt: {
    text: `JSON menú 5d 5com/d esp: D:normal A:Mariscos €30 T:medium 2p F: G:Arroz,Pasta,Pizza X:Coliflor IMPORTANTE: unit="gramos" amount=cantidades reales en gramos {name,days:[{dayOfWeek,dayName,meals:[{mealType,name,description,ingredients:[{name,amount,unit:"gramos",category}],instructions[],nutritionInfo:{calories,protein,carbs,fat,fiber},cookingTime,servings}]}],totalEstimatedCost,shoppingList:[{category,items:[{name,amount,unit:"gramos",estimatedPrice}]}]}`,
    tokens: 118,
    cost: 0.0000295
  },
  savings: {
    tokenReduction: 294,
    percentageReduction: 71.4,
    costSavings: 0.0000735,
    annualSavingsAt1000MenusPerMonth: 882 // USD
  }
};