// Generador de menús con IA Perplexity y base de datos Replit
class MenuGenerator {
  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY;
    this.dbUrl = process.env.REPLIT_DB_URL;
  }

  // Generar ID único para cada usuario
  generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Llamada a la API de Perplexity
  async generateMenuWithPerplexity(userResponses) {
    const prompt = this.buildPrompt(userResponses);

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1500,
          temperature: 0.7
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error al generar menú con Perplexity:', error);
      return this.generateFallbackMenu(userResponses);
    }
  }

  // Construir prompt para Perplexity
  buildPrompt(responses) {
    return `
    Eres un chef experto en nutrición. Genera un menú semanal personalizado basado en estos datos:

    - Presupuesto semanal: ${responses.presupuesto}€
    - Número de comensales: ${responses.comensales}
    - Días de la semana: ${responses.dias}
    - Comidas por día: ${responses.comidas}
    - Tipo de dieta: ${responses.dieta}
    - Alergias: ${responses.alergias || 'Ninguna'}
    - Alimentos que no desea: ${responses.noDeseados || 'Ninguno'}
    - Alimentos en casa: ${responses.alimentosEnCasa || 'Por determinar'}
    - Alimentos preferidos: ${responses.preferidos || 'Sin preferencias específicas'}

    Genera un menú detallado en formato JSON con:
    1. Menú semanal (desayuno, comida, cena según corresponda)
    2. Lista de compra organizada por categorías
    3. Estimación de costos
    4. 3 recetas destacadas con ingredientes y pasos

    Asegúrate de que se ajuste al presupuesto y restricciones alimentarias.
    `;
  }

  // Menú de respaldo en caso de error
  generateFallbackMenu(responses) {
    return {
      mensaje: "Menú generado localmente",
      menu_semanal: {
        lunes: {
          desayuno: "Tostadas con aguacate",
          comida: "Ensalada mediterránea",
          cena: "Pollo al horno con verduras"
        },
        martes: {
          desayuno: "Yogur con frutas",
          comida: "Pasta con tomate",
          cena: "Salmón a la plancha"
        }
      },
      lista_compra: ["Aguacate", "Pan integral", "Lechuga", "Tomate", "Pollo", "Salmón"],
      costo_estimado: responses.presupuesto || 50
    };
  }

  // Guardar menú en base de datos Replit
  async saveMenuToDatabase(userId, menuData, userResponses) {
    try {
      const menuRecord = {
        id: userId,
        timestamp: new Date().toISOString(),
        user_responses: userResponses,
        generated_menu: menuData,
        created_at: Date.now()
      };

      const response = await fetch(`${this.dbUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `menu_${userId}=${encodeURIComponent(JSON.stringify(menuRecord))}`
      });

      if (response.ok) {
        console.log('Menú guardado exitosamente');
        return true;
      } else {
        throw new Error('Error al guardar en base de datos');
      }
    } catch (error) {
      console.error('Error guardando menú:', error);
      return false;
    }
  }

  // Recuperar menú de la base de datos
  async getMenuFromDatabase(userId) {
    try {
      const response = await fetch(`${this.dbUrl}/menu_${userId}`);
      if (response.ok) {
        const data = await response.text();
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('Error recuperando menú:', error);
      return null;
    }
  }

  // Proceso completo: generar y guardar menú
  async processUserResponses(userResponses) {
    const userId = this.generateUserId();

    // Generar menú con Perplexity
    const menuData = await this.generateMenuWithPerplexity(userResponses);

    // Guardar en base de datos
    const saved = await this.saveMenuToDatabase(userId, menuData, userResponses);

    return {
      userId: userId,
      menu: menuData,
      saved: saved,
      timestamp: new Date().toISOString()
    };
  }
}

// Exportar para uso en el navegador
if (typeof window !== 'undefined') {
  window.MenuGenerator = MenuGenerator;
}