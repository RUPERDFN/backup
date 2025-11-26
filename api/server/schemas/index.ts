import { z } from 'zod';

/**
 * Schemas Zod para validación de entradas en todos los endpoints
 * TheCookFlow API - Backend validation schemas
 */

// ==================== AUTH ====================

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional()
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

// ==================== MENU ====================

export const generateMenuSchema = z.object({
  userId: z.string().uuid('userId debe ser un UUID válido'),
  personas: z.number().int().min(1).max(10).default(4),
  presupuesto: z.number().positive('El presupuesto debe ser positivo').default(100),
  tiempo: z.number().int().min(10).max(120).default(30), // minutos
  alergias: z.array(z.string()).optional().default([]),
  preferencias: z.array(z.string()).optional().default([]),
  dias: z.number().int().min(1).max(7).default(7),
  comidasPorDia: z.number().int().min(1).max(5).default(3)
});

export type GenerateMenuInput = z.infer<typeof generateMenuSchema>;

// ==================== CHEF (IA) ====================

export const chefSchema = z.object({
  userId: z.string().optional(), // Opcional para usuarios anónimos en demos
  prompt: z.string()
    .min(3, 'El prompt debe tener al menos 3 caracteres')
    .max(2500, 'El prompt no puede exceder 2500 caracteres'),
  alergias: z.array(z.string()).optional().default([]),
  presupuesto: z.number().positive().optional(),
  tiempo: z.number().int().min(5).max(240).optional(), // minutos
  imageUrl: z.string().url('La URL de imagen no es válida').optional()
});

export type ChefInput = z.infer<typeof chefSchema>;

// ==================== VISION (Reconocimiento de nevera) ====================

export const fridgeVisionSchema = z.object({
  userId: z.string().uuid('userId debe ser un UUID válido'),
  imageUrl: z.string().url('La URL de imagen no es válida')
});

export type FridgeVisionInput = z.infer<typeof fridgeVisionSchema>;

// ==================== BILLING ====================

export const verifyBillingSchema = z.object({
  userId: z.string().uuid('userId debe ser un UUID válido'),
  purchaseToken: z.string().min(1, 'El purchaseToken es requerido')
});

export const subscriptionStatusSchema = z.object({
  userId: z.string().uuid('userId debe ser un UUID válido')
});

export type VerifyBillingInput = z.infer<typeof verifyBillingSchema>;
export type SubscriptionStatusInput = z.infer<typeof subscriptionStatusSchema>;

// ==================== AMAZON FRESH ====================

export const amazonCartItemSchema = z.object({
  name: z.string().min(1, 'El nombre del producto es requerido'),
  qty: z.number().positive('La cantidad debe ser positiva'),
  unit: z.enum(['kg', 'g', 'l', 'ml', 'unidad', 'paquete']).default('unidad')
});

export const amazonCartSchema = z.object({
  userId: z.string().uuid('userId debe ser un UUID válido'),
  items: z.array(amazonCartItemSchema).min(1, 'Debe haber al menos un producto')
});

export type AmazonCartItem = z.infer<typeof amazonCartItemSchema>;
export type AmazonCartInput = z.infer<typeof amazonCartSchema>;

// ==================== QA ====================

export const smokeTestSchema = z.object({
  testName: z.string().optional(),
  verbose: z.boolean().default(false)
});

export type SmokeTestInput = z.infer<typeof smokeTestSchema>;

// ==================== UPLOAD ====================

export const uploadSchema = z.object({
  fileType: z.enum(['image/jpeg', 'image/png', 'image/webp']).optional(),
  maxSize: z.number().max(4 * 1024 * 1024).optional() // 4MB max
});

export type UploadInput = z.infer<typeof uploadSchema>;

// ==================== HELPERS ====================

/**
 * Helper para validar y parsear con Zod
 * Retorna { success: boolean, data?: T, errors?: ZodError }
 */
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { 
      success: false, 
      errors: result.error.flatten().fieldErrors 
    };
  }
}

/**
 * Middleware helper para validar request body
 */
export function validateRequestBody<T>(schema: z.ZodSchema<T>) {
  return (req: any, res: any, next: any) => {
    const validation = validateSchema(schema, req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validación fallida', 
        details: validation.errors 
      });
    }
    
    req.validatedBody = validation.data;
    next();
  };
}
