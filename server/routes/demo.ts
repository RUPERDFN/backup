import { Router } from 'express';

const router = Router();

// Demo login endpoint (magic login)
router.get('/auth/demo-login', (req, res) => {
  // In a real implementation, this would create a session
  // For demo purposes, we just redirect to home with demo session
  res.json({
    success: true,
    message: 'Demo login successful',
    user: {
      id: 'demo-user-001',
      email: 'demo@thecookflow.com',
      name: 'Usuario Demo',
      isPremium: false,
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    redirectTo: '/'
  });
});

// Demo data reset endpoint
router.post('/admin/demo/reset', (req, res) => {
  try {
    // Simulate demo data regeneration
    const demoData = {
      menuPlan: {
        id: 'demo-plan-001',
        userId: 'demo-user-001',
        weekStart: new Date().toISOString(),
        days: 7,
        totalRecipes: 21,
        estimatedCost: 58.50,
        generatedAt: new Date().toISOString()
      },
      recipes: [
        {
          id: 'demo-recipe-001',
          name: 'Paella Valenciana',
          cookingTime: 35,
          difficulty: 'intermedio',
          cost: 8.50
        },
        {
          id: 'demo-recipe-002', 
          name: 'Gazpacho Andaluz',
          cookingTime: 15,
          difficulty: 'fácil',
          cost: 4.20
        },
        {
          id: 'demo-recipe-003',
          name: 'Tortilla Española',
          cookingTime: 30,
          difficulty: 'intermedio',
          cost: 6.80
        }
      ],
      shoppingList: {
        id: 'demo-shopping-001',
        userId: 'demo-user-001',
        totalItems: 24,
        totalCost: 58.50,
        categories: 6,
        generatedAt: new Date().toISOString()
      },
      preferences: {
        servings: 2,
        budget: 60,
        diet: 'omnívoro',
        cookingTime: 'normal',
        skillLevel: 'principiante'
      }
    };

    res.json({
      success: true,
      message: 'Demo data reset successfully',
      data: demoData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resetting demo data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'TheCookFlow API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: 'UP', // In real implementation, check actual DB connection
    uptime: process.uptime()
  });
});

// Get system info for QA
router.get('/qa/system-info', (req, res) => {
  res.json({
    buildInfo: {
      gitSha: process.env.GIT_SHA || 'abc123def456',
      buildDate: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      frontendVersion: '1.0.0',
      backendVersion: '1.0.0'
    },
    flags: {
      appDemo: process.env.APP_DEMO === 'true' || true, // Default true for staging
      isPremium: false, // Demo user is not premium
      isPWA: false, // Detected on frontend
      digitalGoods: false // Not available in demo
    },
    performance: {
      nodeVersion: process.version,
      platform: process.platform,
      memory: process.memoryUsage(),
      uptime: process.uptime()
    }
  });
});

// SkinChef quick answer for mini chat
router.post('/skinchef/quick-answer', (req, res) => {
  const { question } = req.body;
  
  // Simple rule-based responses for demo
  const quickResponses = {
    'sal': 'Puedes sustituir la sal con hierbas frescas como romero, tomillo o orégano. También sal de apio, limón o vinagre balsámico.',
    'pasta': 'Para pasta al dente, resta 1-2 minutos al tiempo del paquete. Prueba frecuentemente hasta que esté firme al morder.',
    'sofrito': 'Pocha cebolla a fuego lento 10-15 min hasta transparente. Añade ajo 2 min. Incorpora tomate y cocina hasta concentrar.',
    'mantequilla': 'Puedes usar aceite de oliva (3/4 partes), aguacate maduro, yogur griego o margarina vegetal.',
    'tiempo': 'Depende del plato. ¿Qué estás cocinando? Puedo darte tiempos específicos.',
    'temperatura': 'Horno medio: 180°C. Alto: 200°C. Bajo: 160°C. ¿Para qué plato?'
  };

  // Find matching response
  let answer = 'Te ayudo con eso. Para preguntas más específicas, prueba el SkinChef completo.';
  
  for (const [key, response] of Object.entries(quickResponses)) {
    if (question.toLowerCase().includes(key)) {
      answer = response;
      break;
    }
  }

  res.json({
    answer,
    timestamp: new Date().toISOString(),
    source: 'SkinChef Mini'
  });
});

export default router;