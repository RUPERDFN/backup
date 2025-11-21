// server/perplexity.ts
import { env } from "./env";

export async function askPerplexity(query: string) {
  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sonar-small-online",
      messages: [{ role: "user", content: query }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Perplexity error ${res.status}: ${text}`);
  }

  const json = await res.json();
  return json?.choices?.[0]?.message?.content ?? "";
}

// Stubs temporales para compatibilidad
export async function enhanceMenuWithTrends(preferences?: any) {
  return { seasonalIngredients: [], trends: [], budgetTips: "" };
}

export async function generateMenuPlanWithPerplexity(preferences?: any) {
  return { name: "Menú Perplexity", days: [] };
}

export async function recognizeIngredientsWithPerplexity(image?: any) {
  return ['tomate', 'cebolla'];
}