import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import cors from "cors";
import session from "express-session";
import path from "path";
import { validateEnv, logEnvConfig } from './env.js';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import {
  apiRateLimit,
  corsOptions,
  getHelmetConfig,
  nonceMiddleware,
  globalErrorHandler,
  notFoundHandler
} from "./middleware/security";

// Validar variables de entorno al inicio
validateEnv();
logEnvConfig();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// Fix for production environment path resolution
if (isProduction && !process.env.INIT_CWD) {
  process.env.INIT_CWD = process.cwd();
}

// Trust proxy for production (behind reverse proxy/load balancer)
if (isProduction) {
  app.set('trust proxy', 1);
}

// Security middleware
app.use(cors(corsOptions));
app.use(compression());

// Nonce generation for CSP
app.use(nonceMiddleware);

// Dynamic helmet configuration with nonce
app.use((req: Request, res: Response, next: NextFunction) => {
  const helmetMiddleware = getHelmetConfig(res.locals.nonce);
  helmetMiddleware(req, res, next);
});

// Rate limiting for API routes
app.use('/api/', apiRateLimit);

// Session configuration - usando env validado
const envConfig = validateEnv();
app.use(session({
  name: "tcf.sid",
  secret: envConfig.SESSION_SECRET || envConfig.JWT_SECRET, // Fallback to JWT_SECRET if SESSION_SECRET not provided
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
  },
}));

// Basic middleware
app.use(express.json({ 
  limit: "10mb",
  verify: (req: any, res, buf) => {
    // Store raw body for webhook verification if needed
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// Add nonce to locals for templates
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.cspNonce = res.locals.nonce;
  next();
});

// App Links assetlinks.json will be configured in routes.ts

// Health check endpoints
app.get('/healthz', (_req, res) => {
  res.status(200).json({ ok: true, timestamp: new Date().toISOString() });
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({ ok: true, env: 'replit', timestamp: new Date().toISOString() });
});

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Setup Vite or static serving BEFORE 404 handler
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // 404 handler (after Vite setup)
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use(globalErrorHandler);

  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    log(`Security mode: ${isProduction ? 'Production' : 'Development'}`);
    log(`CORS origins: ${process.env.ALLOWED_ORIGINS || 'localhost'}`);
  });
})();
