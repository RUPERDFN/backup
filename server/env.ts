// server/env.ts
import { z } from "zod";

const RawEnv = z.object({
  JWT_SECRET: z.string().min(32, "JWT_SECRET debe tener al menos 32 caracteres"),
  OPENAI_API_KEY: z.string().min(1, "Falta OPENAI_API_KEY").optional(),
  PERPLEXITY_API_KEY: z.string().min(1, "Falta PERPLEXITY_API_KEY").optional(),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET debe tener al menos 32 caracteres").optional(),
  GOOGLE_PLAY_PUBLIC_KEY: z.string().min(20, "Falta GOOGLE_PLAY_PUBLIC_KEY").optional(),
  ALLOWED_ORIGINS: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const parsed = RawEnv.safeParse(process.env);
if (!parsed.success) {
  const msg = parsed.error.errors.map(e => `• ${e.message}`).join("\n");
  // Fallo rápido y claro al arrancar
  throw new Error(`Config env inválida:\n${msg}`);
}

function normalizePemOrBase64(input: string): string {
  // Convierte \n literales a saltos reales y recorta
  const s = input.replace(/\\n/g, "\n").trim();

  // Si ya viene en PEM, úsalo
  if (s.includes("BEGIN PUBLIC KEY")) return s;

  // Si viene base64 crudo, envuélvelo como PEM con líneas de 64 chars
  const b64 = s.replace(/-----.*-----/g, "").replace(/\s+/g, "");
  const lines = (b64.match(/.{1,64}/g) || [b64]).join("\n");
  return `-----BEGIN PUBLIC KEY-----\n${lines}\n-----END PUBLIC KEY-----`;
}

export const env = {
  ...parsed.data,
  GOOGLE_PLAY_PUBLIC_KEY_PEM: parsed.data.GOOGLE_PLAY_PUBLIC_KEY 
    ? normalizePemOrBase64(parsed.data.GOOGLE_PLAY_PUBLIC_KEY) 
    : undefined,
  ALLOWED_ORIGINS_ARRAY:
    parsed.data.ALLOWED_ORIGINS?.split(",").map(s => s.trim()).filter(Boolean) ?? [],
  isProd: parsed.data.NODE_ENV === "production",
  isDev: parsed.data.NODE_ENV !== "production",
};

// Función auxiliar para verificar el formato de la clave pública
function validateGooglePlayKey(key: string): boolean {
  // Verificar que sea PEM o base64
  const pemPattern = /-----BEGIN PUBLIC KEY-----[\s\S]*-----END PUBLIC KEY-----/;
  const base64Pattern = /^[A-Za-z0-9+\/]+=*$/;
  
  if (pemPattern.test(key.trim())) {
    return true;
  }
  
  // Si no es PEM, verificar si es base64 válido
  const cleanKey = key.replace(/\s/g, '').replace(/\\n/g, '');
  return base64Pattern.test(cleanKey) && cleanKey.length > 200;
}

// Para compatibilidad hacia atrás
export function validateEnv() {
  return env;
}

// Función para registrar la configuración (sin mostrar secretos)
export function logEnvConfig() {
  console.log('🔧 Configuración del entorno:');
  console.log(`  - NODE_ENV: ${env.NODE_ENV}`);
  console.log(`  - PORT: ${process.env.PORT || '5000'}`);
  console.log(`  - DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Configurada' : '❌ No configurada'}`);
  console.log(`  - JWT_SECRET: ${env.JWT_SECRET ? '✅ Configurada' : '❌ No configurada'}`);
  console.log(`  - OPENAI_API_KEY: ${env.OPENAI_API_KEY ? '✅ Configurada' : '❌ No configurada'}`);
  console.log(`  - PERPLEXITY_API_KEY: ${env.PERPLEXITY_API_KEY ? '✅ Configurada' : '❌ No configurada'}`);
  
  // Validación especial para Google Play Key
  if (env.GOOGLE_PLAY_PUBLIC_KEY) {
    const isValidFormat = validateGooglePlayKey(env.GOOGLE_PLAY_PUBLIC_KEY);
    if (!isValidFormat) {
      console.log('  - GOOGLE_PLAY_PUBLIC_KEY: ⚠️  Configurada pero formato no reconocido como PEM/base64');
    } else {
      console.log('  - GOOGLE_PLAY_PUBLIC_KEY: ✅ Configurada');
    }
  } else {
    console.log('  - GOOGLE_PLAY_PUBLIC_KEY: ❌ No configurada (opcional para desarrollo)');
  }
  
  console.log(`  - SESSION_SECRET: ${env.SESSION_SECRET ? '✅ Configurada' : '❌ No configurada (opcional para desarrollo)'}`);
  console.log(`  - ALLOWED_ORIGINS: ${env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5000'}`);
}

// Helper para obtener la clave pública de Google Play normalizada
export function getGooglePlayPublicKey(): string {
  return env.GOOGLE_PLAY_PUBLIC_KEY_PEM;
}

// Helper para verificar si las APIs están configuradas
export function checkAIKeys(): { openai: boolean; perplexity: boolean } {
  return {
    openai: !!env.OPENAI_API_KEY,
    perplexity: !!env.PERPLEXITY_API_KEY
  };
}