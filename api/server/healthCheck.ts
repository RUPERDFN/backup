import { db } from './db';
import { logger } from './logger';
import { checkAIKeys } from './env';

// Cache para pruebas de APIs externas (60 segundos)
interface ApiHealthCache {
  timestamp: number;
  openai: { status: boolean; responseTime: number; error?: string };
  perplexity: { status: boolean; responseTime: number; error?: string };
}

let apiHealthCache: ApiHealthCache | null = null;
const CACHE_DURATION = 60 * 1000; // 60 segundos

/**
 * Realiza un chequeo real de la base de datos
 */
async function checkDatabase(): Promise<{ status: boolean; responseTime: number; error?: string }> {
  const startTime = Date.now();
  
  try {
    // Ejecutar SELECT 1 simple para verificar conectividad
    await db.execute('SELECT 1 as health_check');
    const responseTime = Date.now() - startTime;
    
    logger.debug({ responseTime }, 'Database health check successful');
    return { status: true, responseTime };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    
    logger.error({ error: errorMessage, responseTime }, 'Database health check failed');
    return { status: false, responseTime, error: errorMessage };
  }
}

/**
 * Realiza una prueba mínima a OpenAI API
 */
async function checkOpenAI(): Promise<{ status: boolean; responseTime: number; error?: string }> {
  const startTime = Date.now();
  
  try {
    // Hacer una request mínima a OpenAI para verificar conectividad
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'HEAD',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'User-Agent': 'TheCookFlow-HealthCheck/1.0'
      },
      signal: AbortSignal.timeout(5000) // 5 segundos timeout
    });
    
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      logger.debug({ responseTime, status: response.status }, 'OpenAI health check successful');
      return { status: true, responseTime };
    } else {
      const error = `HTTP ${response.status}`;
      logger.warn({ responseTime, status: response.status }, 'OpenAI health check failed');
      return { status: false, responseTime, error };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown OpenAI error';
    
    logger.error({ error: errorMessage, responseTime }, 'OpenAI health check failed');
    return { status: false, responseTime, error: errorMessage };
  }
}

/**
 * Realiza una prueba mínima a Perplexity API
 */
async function checkPerplexity(): Promise<{ status: boolean; responseTime: number; error?: string }> {
  const startTime = Date.now();
  
  try {
    // Hacer una request mínima a Perplexity para verificar conectividad
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'TheCookFlow-HealthCheck/1.0'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1
      }),
      signal: AbortSignal.timeout(5000) // 5 segundos timeout
    });
    
    const responseTime = Date.now() - startTime;
    
    if (response.ok || response.status === 400) { // 400 es OK para test inválido
      logger.debug({ responseTime, status: response.status }, 'Perplexity health check successful');
      return { status: true, responseTime };
    } else {
      const error = `HTTP ${response.status}`;
      logger.warn({ responseTime, status: response.status }, 'Perplexity health check failed');
      return { status: false, responseTime, error };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown Perplexity error';
    
    logger.error({ error: errorMessage, responseTime }, 'Perplexity health check failed');
    return { status: false, responseTime, error: errorMessage };
  }
}

/**
 * Obtiene el estado de las APIs externas (con caché de 60s)
 */
async function getExternalApisHealth(): Promise<{
  openai: { status: boolean; responseTime: number; error?: string };
  perplexity: { status: boolean; responseTime: number; error?: string };
  cached: boolean;
}> {
  const now = Date.now();
  
  // Verificar si tenemos cache válido
  if (apiHealthCache && (now - apiHealthCache.timestamp) < CACHE_DURATION) {
    logger.debug('Using cached API health check results');
    return {
      openai: apiHealthCache.openai,
      perplexity: apiHealthCache.perplexity,
      cached: true
    };
  }
  
  logger.debug('Performing fresh API health checks');
  
  // Realizar chequeos en paralelo
  const [openaiResult, perplexityResult] = await Promise.all([
    checkOpenAI(),
    checkPerplexity()
  ]);
  
  // Actualizar cache
  apiHealthCache = {
    timestamp: now,
    openai: openaiResult,
    perplexity: perplexityResult
  };
  
  return {
    openai: openaiResult,
    perplexity: perplexityResult,
    cached: false
  };
}

/**
 * Realiza un chequeo completo de salud del sistema
 */
export async function performDetailedHealthCheck() {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  logger.info('Starting detailed health check');
  
  try {
    // Ejecutar chequeos en paralelo
    const [dbHealth, apiHealth, aiKeysStatus] = await Promise.all([
      checkDatabase(),
      getExternalApisHealth(),
      Promise.resolve(checkAIKeys())
    ]);
    
    const totalTime = Date.now() - startTime;
    
    const healthReport = {
      timestamp,
      status: dbHealth.status && apiHealth.openai.status && apiHealth.perplexity.status ? 'healthy' : 'unhealthy',
      totalResponseTime: totalTime,
      components: {
        database: {
          status: dbHealth.status ? 'up' : 'down',
          responseTime: dbHealth.responseTime,
          ...(dbHealth.error && { error: dbHealth.error })
        },
        apis: {
          cached: apiHealth.cached,
          ...(apiHealth.cached && { cacheAge: Date.now() - (apiHealthCache?.timestamp || 0) }),
          openai: {
            status: apiHealth.openai.status ? 'up' : 'down',
            responseTime: apiHealth.openai.responseTime,
            configured: aiKeysStatus.openai,
            ...(apiHealth.openai.error && { error: apiHealth.openai.error })
          },
          perplexity: {
            status: apiHealth.perplexity.status ? 'up' : 'down',
            responseTime: apiHealth.perplexity.responseTime,
            configured: aiKeysStatus.perplexity,
            ...(apiHealth.perplexity.error && { error: apiHealth.perplexity.error })
          }
        }
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        version: process.env.npm_package_version || 'unknown'
      }
    };
    
    logger.info(
      { 
        totalTime, 
        dbStatus: dbHealth.status,
        openaiStatus: apiHealth.openai.status,
        perplexityStatus: apiHealth.perplexity.status,
        cached: apiHealth.cached
      },
      'Detailed health check completed'
    );
    
    return healthReport;
    
  } catch (error) {
    const totalTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    logger.error({ error: errorMessage, totalTime }, 'Health check failed with exception');
    
    return {
      timestamp,
      status: 'error',
      totalResponseTime: totalTime,
      error: errorMessage,
      components: {
        database: { status: 'unknown' },
        apis: { 
          openai: { status: 'unknown' },
          perplexity: { status: 'unknown' }
        }
      }
    };
  }
}