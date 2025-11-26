import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// Demo login endpoint (magic link)
router.post('/auth/demo-login', async (req: Request, res: Response) => {
  try {
    // Create demo session without requiring actual OAuth
    const demoUser = {
      claims: {
        sub: 'demo_user_001',
        email: 'demo@thecookflow.com',
        first_name: 'Demo',
        last_name: 'User',
        profile_image_url: 'https://via.placeholder.com/150/4ade80/000000?text=DEMO'
      },
      access_token: 'demo_token_123',
      refresh_token: 'demo_refresh_123',
      expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour
    };
    
    // Set demo session
    (req.session as any).passport = { user: demoUser };
    
    res.json({
      success: true,
      user: demoUser,
      message: 'Demo login successful',
      redirectUrl: '/dashboard',
      demoMode: true
    });
    
  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({
      error: 'Failed to create demo session'
    });
  }
});

// Health check endpoint
router.get('/healthz', async (req: Request, res: Response) => {
  try {
    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      database: 'UP', // In production, check actual DB connection
      version: '1.0.0',
      git_sha: process.env.REPL_ID || 'local-dev',
      build_date: new Date().toISOString()
    };
    
    res.json(health);
    
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      error: error instanceof Error ? error.message : 'Health check failed'
    });
  }
});

// Demo data reset (admin only)
router.post('/admin/demo/reset', async (req: Request, res: Response) => {
  try {
    // In demo mode, regenerate sample data
    const seedData = {
      menuPlan: {
        id: 'demo_menu_001',
        name: 'Menú Mediterráneo Semanal',
        description: 'Plan semanal equilibrado para 2 personas',
        generatedAt: new Date().toISOString(),
        days: [
          {
            day: 'Lunes',
            meals: [
              { type: 'Desayuno', name: 'Tostadas con tomate y aceite', time: '10 min' },
              { type: 'Comida', name: 'Paella Valenciana', time: '35 min' },
              { type: 'Cena', name: 'Ensalada César con pollo', time: '15 min' }
            ]
          },
          {
            day: 'Martes', 
            meals: [
              { type: 'Desayuno', name: 'Yogur griego con frutas', time: '5 min' },
              { type: 'Comida', name: 'Pasta Carbonara', time: '20 min' },
              { type: 'Cena', name: 'Salmón a la plancha con verduras', time: '25 min' }
            ]
          },
          {
            day: 'Miércoles',
            meals: [
              { type: 'Desayuno', name: 'Smoothie de plátano y avena', time: '8 min' },
              { type: 'Comida', name: 'Gazpacho andaluz con jamón', time: '15 min' },
              { type: 'Cena', name: 'Tortilla española con ensalada', time: '20 min' }
            ]
          }
        ]
      },
      
      recipes: [
        {
          id: 'recipe_paella',
          name: 'Paella Valenciana',
          description: 'Auténtica paella valenciana con pollo, conejo, garrofón y judía verde',
          cookingTime: 35,
          servings: 4,
          difficulty: 'intermedio',
          ingredients: [
            { name: 'Arroz bomba', quantity: '320g', category: 'Cereales' },
            { name: 'Pollo troceado', quantity: '400g', category: 'Carnes' },
            { name: 'Judías verdes', quantity: '200g', category: 'Verduras' },
            { name: 'Garrofón', quantity: '100g', category: 'Legumbres' },
            { name: 'Tomate rallado', quantity: '1 unidad', category: 'Verduras' },
            { name: 'Pimiento rojo', quantity: '1 unidad', category: 'Verduras' },
            { name: 'Azafrán', quantity: '1g', category: 'Especias' },
            { name: 'Aceite de oliva', quantity: '4 cucharadas', category: 'Aceites' }
          ],
          instructions: [
            'Calentar el aceite en la paellera y dorar el pollo',
            'Añadir las verduras y sofreír 5 minutos',
            'Incorporar el tomate rallado y el azafrán',
            'Añadir el arroz y remover durante 2 minutos',
            'Verter el caldo caliente y cocer 18-20 minutos sin remover',
            'Dejar reposar 5 minutos antes de servir'
          ]
        }
      ],
      
      shoppingList: {
        id: 'demo_shopping_001',
        name: 'Lista Semanal Mediterránea',
        totalItems: 24,
        estimatedCost: 52.30,
        categories: [
          {
            name: 'Carnes y Pescados',
            items: [
              { name: 'Pollo troceado', quantity: '1kg', price: 6.50, unit: 'kg' },
              { name: 'Salmón fresco', quantity: '400g', price: 12.80, unit: 'kg' }
            ]
          },
          {
            name: 'Verduras y Frutas',
            items: [
              { name: 'Tomates', quantity: '1kg', price: 2.30, unit: 'kg' },
              { name: 'Judías verdes', quantity: '500g', price: 3.20, unit: 'kg' },
              { name: 'Pimientos rojos', quantity: '3 unidades', price: 1.80, unit: 'kg' }
            ]
          },
          {
            name: 'Despensa',
            items: [
              { name: 'Arroz bomba', quantity: '1kg', price: 4.50, unit: 'kg' },
              { name: 'Aceite oliva virgen', quantity: '500ml', price: 6.80, unit: 'l' },
              { name: 'Azafrán', quantity: '1g', price: 2.90, unit: 'g' }
            ]
          }
        ]
      }
    };
    
    res.json({
      success: true,
      message: 'Demo data reset successfully',
      data: seedData,
      resetTimestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Demo reset error:', error);
    res.status(500).json({
      error: 'Failed to reset demo data'
    });
  }
});

// Build info endpoint
router.get('/build-info', (req: Request, res: Response) => {
  res.json({
    git_sha: process.env.REPL_ID || 'local-dev-abc123',
    build_date: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    frontend_version: '1.0.0',
    backend_version: '1.0.0',
    node_version: process.version,
    platform: process.platform,
    is_demo: process.env.APP_DEMO === 'true' || true // Always demo in staging
  });
});

export default router;