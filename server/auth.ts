import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";
import { z } from 'zod';

// JWT Secret - MUST be from environment variables (no fallback for security)
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("⚠️  JWT_SECRET environment variable is required");
  console.error("🔧 For development, add JWT_SECRET to your .env file");
  console.error("🔐 Generate with: openssl rand -base64 32");
  throw new Error("JWT_SECRET environment variable is required - check .env.example for setup");
}

// Type assertion since we've verified it exists
const JWT_SECRET_SAFE = JWT_SECRET as string;
const JWT_EXPIRES_IN = '7d';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
});

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

// Hash password utility
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Verify password utility
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET_SAFE, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT token
export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_SAFE);
    // Ensure the decoded token has the expected structure
    if (typeof decoded === 'object' && decoded && 'userId' in decoded) {
      return decoded as { userId: string };
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Authentication middleware
export const authenticateToken: RequestHandler = async (req: any, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: "Token de acceso requerido",
      code: "NO_TOKEN" 
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ 
      error: "Token inválido o expirado",
      code: "INVALID_TOKEN" 
    });
  }

  try {
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        error: "Usuario no encontrado",
        code: "USER_NOT_FOUND" 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error en middleware de autenticación:", error);
    return res.status(500).json({ 
      error: "Error interno del servidor",
      code: "INTERNAL_ERROR" 
    });
  }
};

// Setup authentication routes
export function setupAuth(app: Express): void {
  // Get current user route
  app.get('/api/auth/user', authenticateToken, async (req: any, res) => {
    try {
      res.json(req.user);
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ error: "Error al obtener información del usuario" });
    }
  });

  // Register endpoint
  app.post('/api/auth/register', async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const { email, password, firstName, lastName } = validatedData;

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          error: "Ya existe una cuenta con este email",
          code: "EMAIL_EXISTS"
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });

      // Generate token
      const token = generateToken(user.id);

      // Return user data (without password) and token
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(201).json({
        message: "Usuario registrado exitosamente",
        user: userWithoutPassword,
        token,
        jwt: token, // For frontend localStorage storage
        expiresIn: JWT_EXPIRES_IN
      });

    } catch (error) {
      console.error("Error en registro:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Datos de entrada inválidos",
          code: "VALIDATION_ERROR",
          details: error.errors
        });
      }

      res.status(500).json({
        error: "Error interno del servidor",
        code: "INTERNAL_ERROR"
      });
    }
  });

  // Login endpoint
  app.post('/api/auth/login', async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { email, password } = validatedData;

      // Demo mode for development - bypass database
      if (email === 'demo@thecookflow.com' && password === 'Demo1234!') {
        const demoUser = {
          id: 'demo-user-001',
          email: 'demo@thecookflow.com',
          firstName: 'Usuario',
          lastName: 'Demo',
          profileImageUrl: null,
          provider: 'email',
          providerId: null,
          isEmailVerified: true,
          isPremium: false,
          subscriptionStatus: 'trial',
          googlePlayPurchaseToken: null,
          subscriptionId: null,
          purchaseTime: null,
          expiryTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          autoRenewing: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Generate token
        const token = generateToken(demoUser.id);
        
        return res.json({
          success: true,
          message: "Demo login successful",
          user: demoUser,
          token,
          jwt: token,
          expiresIn: JWT_EXPIRES_IN,
          redirectTo: '/dashboard'
        });
      }

      // Normal login flow for production users
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          error: "Email o contraseña incorrectos",
          code: "INVALID_CREDENTIALS"
        });
      }

      // Verify password
      if (!user.password) {
        return res.status(401).json({
          error: "Email o contraseña incorrectos",
          code: "INVALID_CREDENTIALS"
        });
      }
      
      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: "Email o contraseña incorrectos",
          code: "INVALID_CREDENTIALS"
        });
      }

      // Generate token
      const token = generateToken(user.id);

      // Return user data (without password) and token
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        message: "Inicio de sesión exitoso",
        user: userWithoutPassword,
        token,
        jwt: token, // For frontend localStorage storage
        expiresIn: JWT_EXPIRES_IN
      });

    } catch (error) {
      console.error("Error en login:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Datos de entrada inválidos",
          code: "VALIDATION_ERROR",
          details: error.errors
        });
      }

      res.status(500).json({
        error: "Error interno del servidor",
        code: "INTERNAL_ERROR"
      });
    }
  });

  // Get current user endpoint
  app.get('/api/auth/user', authenticateToken, async (req: any, res) => {
    try {
      const { password: _, ...userWithoutPassword } = req.user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error obteniendo usuario:", error);
      res.status(500).json({
        error: "Error interno del servidor",
        code: "INTERNAL_ERROR"
      });
    }
  });

  // Logout endpoint (client-side token deletion)
  app.post('/api/auth/logout', authenticateToken, async (req, res) => {
    // In JWT authentication, logout is typically handled client-side by deleting the token
    // For server-side logout, you'd need a token blacklist which is more complex
    res.json({
      message: "Sesión cerrada exitosamente"
    });
  });

  // Password reset request endpoint (future implementation)
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      
      // Validate email
      if (!email || !z.string().email().safeParse(email).success) {
        return res.status(400).json({
          error: "Email válido requerido",
          code: "INVALID_EMAIL"
        });
      }

      // Check if user exists
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists for security
        return res.json({
          message: "Si el email existe, recibirás instrucciones para restablecer tu contraseña"
        });
      }

      // TODO: Implement password reset logic
      // - Generate reset token
      // - Store reset token with expiration
      // - Send email with reset link

      res.json({
        message: "Si el email existe, recibirás instrucciones para restablecer tu contraseña"
      });

    } catch (error) {
      console.error("Error en solicitud de restablecimiento:", error);
      res.status(500).json({
        error: "Error interno del servidor",
        code: "INTERNAL_ERROR"
      });
    }
  });

  // Future: Google OAuth endpoints
  // app.get('/api/auth/google', ...);
  // app.get('/api/auth/google/callback', ...);
}

// Type declarations
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}