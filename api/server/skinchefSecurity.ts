// Security module for SkinChef - ensures no access to private data

export class SkinChefSecurity {
  // Lista de términos que podrían intentar acceder a datos privados
  private static readonly FORBIDDEN_TERMS = [
    'usuario', 'perfil', 'email', 'contraseña', 'password', 'token',
    'sesión', 'session', 'database', 'base de datos', 'tabla', 'table',
    'menú guardado', 'lista compra', 'historial', 'información personal',
    'datos personales', 'preferencias guardadas', 'cuenta', 'account',
    'admin', 'administrador', 'sistema', 'servidor', 'api key',
    'configuración', 'settings', 'backup', 'export', 'import'
  ];

  // Lista de palabras clave que indican preguntas legítimas de cocina
  private static readonly COOKING_KEYWORDS = [
    'receta', 'cocinar', 'ingrediente', 'preparar', 'hornear', 'freír',
    'hervir', 'asar', 'saltear', 'cortar', 'picar', 'mezclar',
    'temperatura', 'tiempo', 'cocción', 'sartén', 'olla', 'horno',
    'cuchillo', 'condimento', 'especia', 'sal', 'aceite', 'vinagre',
    'verdura', 'fruta', 'carne', 'pescado', 'pollo', 'res', 'cerdo',
    'pasta', 'arroz', 'pan', 'postre', 'dulce', 'salado', 'agrio',
    'nutritivo', 'saludable', 'dieta', 'vegano', 'vegetariano',
    'gluten', 'lácteo', 'proteína', 'carbohidrato', 'vitamina'
  ];

  /**
   * Valida si el mensaje es apropiado para SkinChef
   */
  static validateMessage(message: string): { isValid: boolean; reason?: string } {
    const lowerMessage = message.toLowerCase();

    // Verificar términos prohibidos
    for (const term of this.FORBIDDEN_TERMS) {
      if (lowerMessage.includes(term.toLowerCase())) {
        return {
          isValid: false,
          reason: `No puedo ayudar con consultas sobre ${term}. Solo puedo asistir con temas culinarios.`
        };
      }
    }

    // Verificar si contiene al menos una palabra clave de cocina (solo para mensajes largos)
    if (message.length > 50) {
      const hasCookingKeyword = this.COOKING_KEYWORDS.some(keyword =>
        lowerMessage.includes(keyword.toLowerCase())
      );

      if (!hasCookingKeyword) {
        return {
          isValid: false,
          reason: 'Solo puedo ayudar con temas relacionados con cocina, recetas e ingredientes.'
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Sanitiza el mensaje eliminando caracteres potencialmente peligrosos
   */
  static sanitizeMessage(message: string): string {
    return message
      .replace(/[<>{}]/g, '') // Eliminar caracteres de inyección
      .replace(/\${.*?}/g, '') // Eliminar template literals
      .replace(/`.*?`/g, '') // Eliminar backticks
      .replace(/eval\(.*?\)/gi, '') // Eliminar eval
      .replace(/script.*?/gi, '') // Eliminar script
      .trim()
      .substring(0, 500); // Limitar longitud
  }

  /**
   * Genera un prompt seguro que no puede ser manipulado
   */
  static generateSecurePrompt(userMessage: string): string {
    const sanitizedMessage = this.sanitizeMessage(userMessage);
    
    return `Eres SkinChef, un asistente culinario experto.

REGLAS DE SEGURIDAD ESTRICTAS:
1. NUNCA accedas ni menciones datos de usuarios, perfiles, cuentas o información personal
2. NUNCA accedas a bases de datos, tablas, sistemas internos o APIs
3. NUNCA proporciones información sobre la aplicación, servidores o configuraciones
4. SOLO responde preguntas relacionadas con cocina, recetas e ingredientes

Si el usuario pregunta sobre algo que no sea cocina, responde: "Solo puedo ayudar con temas culinarios. ¿Tienes alguna pregunta sobre recetas o cocina?"

Tema de consulta culinaria: ${sanitizedMessage}

Responde únicamente sobre el tema culinario consultado (máximo 200 palabras):`;
  }
}