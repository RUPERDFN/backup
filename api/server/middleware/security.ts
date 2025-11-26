import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import crypto from 'crypto';
import { env } from '../env';

// Rate limiting for API routes
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Too many API requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for development
    return !env.isProd && req.ip === '127.0.0.1';
  }
});

// CORS configuration - usando env validado
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true); // curl/postman
    
    // En desarrollo, permitir localhost y 127.0.0.1 automáticamente
    if (!env.isProd) {
      if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('replit.dev'))) {
        return callback(null, true);
      }
    }
    
    if (env.ALLOWED_ORIGINS_ARRAY.includes(origin)) return callback(null, true);
    return callback(new Error(`Origen no permitido: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Generate nonce for CSP
export function generateNonce(): string {
  return crypto.randomBytes(16).toString('base64');
}

// Helmet configuration with CSP - usando env validado
export function getHelmetConfig(nonce: string) {
  return helmet({
    contentSecurityPolicy: env.isProd ? {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'"], // si usas nonces, añádelos aquí dinámicamente
        "connect-src": ["'self'", ...env.ALLOWED_ORIGINS_ARRAY, 'https://api.openai.com', 'https://api.perplexity.ai'],
        "img-src": ["'self'", "data:", "https:"],
        "style-src": ["'self'", "'unsafe-inline'"],
      },
    } : false,
  });
}

// Nonce middleware
export function nonceMiddleware(req: Request, res: Response, next: NextFunction) {
  const nonce = generateNonce();
  res.locals.nonce = nonce;
  next();
}

// Input sanitization middleware
export const sanitizeInput = [
  body('*').trim().escape(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Input validation failed',
        details: errors.array()
      });
    }
    next();
  }
];

// Global error handler
export function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Log error (in production, use proper logging service)
  console.error('Global Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  // Default error response
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate entry';
  }

  // Consistent error response format
  const errorResponse = {
    error: true,
    message: message,
    statusCode: statusCode,
    timestamp: new Date().toISOString(),
    ...(isDevelopment && {
      stack: err.stack,
      details: err
    })
  };

  res.status(statusCode).json(errorResponse);
}

// 404 handler
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: true,
    message: 'Route not found',
    statusCode: 404,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
}