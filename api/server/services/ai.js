import OpenAI from 'openai';

const USE_OPENAI = !!process.env.OPENAI_API_KEY;
const USE_PERPLEXITY = !!process.env.PERPLEXITY_API_KEY;

let openai = null;
if (USE_OPENAI) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

/**
 * Servicio IA unificado para TheCookFlow
 * Punto central para todas las operaciones de IA
 */

// ========== 1. GENERATE MENU (Menú Semanal) ==========

export async function generateMenu({ userId, personas = 4, presupuesto = 100, tiempo = 30, alergias = [], preferencias = [], dias = 7, comidasPorDia = 3 }) {
  const prompt = `Genera un menú semanal en español para ${personas} personas con:
- Presupuesto: ${presupuesto}€/semana
- Tiempo de cocina: ${tiempo} min/comida
- Alergias: ${alergias.length > 0 ? alergias.join(', ') : 'ninguna'}
- Preferencias: ${preferencias.length > 0 ? preferencias.join(', ') : 'ninguna'}
- ${dias} días con ${comidasPorDia} comidas/día

Responde en formato JSON con estructura:
{
  "semana": [
    { "dia": "Lunes", "comidas": [{"tipo": "Desayuno", "nombre": "...", "ingredientes": [...], "tiempo": 15}] }
  ],
  "costoTotal": ${presupuesto},
  "consejosAhorro": "..."
}`;

  if (USE_OPENAI) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1500
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('[AI] OpenAI error, fallback a mock:', error.message);
    }
  }

  // Mock fallback
  return generateMenuMock({ personas, presupuesto, dias, comidasPorDia });
}

// ========== 2. CHEF (Recetas / Chat) ==========

export async function chef({ prompt, alergias = [], presupuesto, tiempo, imageUrl }) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt requerido para chef');
  }

  // Sanitizar prompt (máximo 2500 caracteres)
  const sanitizedPrompt = prompt.trim().substring(0, 2500);

  const systemMessage = `Eres SkinChef, un asistente culinario experto. Solo respondes preguntas sobre cocina, recetas, ingredientes y técnicas culinarias. Siempre en español castellano.`;

  const userMessage = `${sanitizedPrompt}
${alergias.length > 0 ? `\nAlergias: ${alergias.join(', ')}` : ''}
${presupuesto ? `\nPresupuesto: ${presupuesto}€` : ''}
${tiempo ? `\nTiempo disponible: ${tiempo} min` : ''}
${imageUrl ? `\nImagen de referencia: ${imageUrl}` : ''}`;

  if (USE_OPENAI) {
    try {
      const messages = [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage }
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.8,
        max_tokens: 800
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('[AI] OpenAI chef error, fallback a mock:', error.message);
    }
  }

  // Mock fallback
  return chefMock({ prompt: sanitizedPrompt, alergias, presupuesto, tiempo });
}

// ========== 3. ANALYZE FRIDGE (Visión Nevera) ==========

export async function analyzeFridge({ userId, imageUrl }) {
  if (!imageUrl) {
    throw new Error('imageUrl requerida para analyzeFridge');
  }

  if (USE_OPENAI) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Identifica todos los ingredientes visibles en esta imagen. Lista en español: nombre, frescura (buena/regular/mala), cantidad estimada.'
              },
              {
                type: 'image_url',
                image_url: { url: imageUrl }
              }
            ]
          }
        ],
        max_tokens: 500
      });

      const content = response.choices[0].message.content;
      const items = parseIngredientsFromText(content);

      return {
        items,
        tips: generateFridgeTips(items),
        budgetImpact: calculateBudgetImpact(items)
      };
    } catch (error) {
      console.error('[AI] OpenAI vision error, fallback a mock:', error.message);
    }
  }

  // Mock fallback
  return analyzeFridgeMock();
}

// ========== HELPERS & MOCKS ==========

function generateMenuMock({ personas, presupuesto, dias, comidasPorDia }) {
  return JSON.stringify({
    semana: Array.from({ length: dias }, (_, i) => ({
      dia: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][i],
      comidas: Array.from({ length: comidasPorDia }, (_, j) => ({
        tipo: ['Desayuno', 'Comida', 'Cena'][j],
        nombre: j === 0 ? 'Tostadas con aguacate' : j === 1 ? 'Pasta con tomate' : 'Tortilla española',
        ingredientes: ['pan', 'aguacate', 'tomate', 'huevos'],
        tiempo: 20
      }))
    })),
    costoTotal: presupuesto,
    consejosAhorro: `Compra ingredientes de temporada para ${personas} personas`
  });
}

function chefMock({ prompt, alergias, presupuesto, tiempo }) {
  return `🍽️ Receta sugerida (MOCK):
  
**${prompt.includes('rápid') ? 'Pasta rápida con verduras' : 'Pollo al horno con patatas'}**

Ingredientes:
- Pasta o pollo (200g por persona)
- Verduras de temporada
- AOVE, ajo, sal, pimienta

Pasos:
1. Sofríe las verduras con ajo
2. Cocina el ingrediente principal
3. Mezcla y sazona al gusto

Tiempo: ${tiempo || 25} min
Presupuesto: ${presupuesto || 4}€ aprox.
${alergias.length > 0 ? `\n⚠️ Sin: ${alergias.join(', ')}` : ''}`;
}

function analyzeFridgeMock() {
  return {
    items: [
      { name: 'huevos', freshness: 'buena', quantity: '6 unidades' },
      { name: 'leche', freshness: 'regular', quantity: '1L' },
      { name: 'tomates', freshness: 'buena', quantity: '4 unidades' }
    ],
    tips: ['Los huevos duran 2 semanas más', 'Usa la leche pronto'],
    budgetImpact: 2.5
  };
}

function parseIngredientsFromText(text) {
  const lines = text.split('\n').filter(l => l.trim());
  return lines.slice(0, 10).map(line => ({
    name: line.split(',')[0]?.trim() || 'ingrediente',
    freshness: 'buena',
    quantity: 'cantidad estimada'
  }));
}

function generateFridgeTips(items) {
  return items.length > 0 
    ? [`Tienes ${items.length} ingredientes`, 'Revisa fechas de caducidad']
    : ['Nevera vacía, hora de comprar'];
}

function calculateBudgetImpact(items) {
  return Math.min(items.length * 1.5, 15);
}

// Mantener compatibilidad con función original
export async function generate(params) {
  return chef(params);
}
