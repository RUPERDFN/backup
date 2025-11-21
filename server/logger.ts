import pino from 'pino';

// Crear logger con configuración que oculta secretos
const logger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  transport: process.env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname'
    }
  } : undefined,
  redact: {
    paths: [
      'headers.authorization',
      'headers.cookie',
      'headers["x-api-key"]',
      'body.password',
      'body.token',
      'body.secret',
      'env.OPENAI_API_KEY',
      'env.PERPLEXITY_API_KEY',
      'env.SESSION_SECRET',
      'env.GOOGLE_PLAY_PUBLIC_KEY',
      'env.DATABASE_URL',
      '*.password',
      '*.secret',
      '*.token',
      '*.key'
    ],
    censor: '[REDACTED]'
  },
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    }
  }
});

export { logger };