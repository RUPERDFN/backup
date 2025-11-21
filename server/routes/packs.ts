import { Router } from 'express';
import { authenticateToken } from '../auth';

const router = Router();

// Get available premium packs catalog
router.get('/packs/catalog', async (req, res) => {
  try {
    const premiumPacks = [
      {
        id: 'batch_cooking_7',
        name: 'Batch Cooking 7 días',
        description: 'Cocina una vez, come toda la semana. Recetas optimizadas para preparar y conservar.',
        price: 4.99,
        currency: 'EUR',
        type: 'one_time',
        category: 'cooking_method',
        features: [
          '21 recetas batch cooking',
          'Técnicas de conservación',
          'Planificación de preparación',
          'Contenedores recomendados',
          'Calendario de preparación'
        ],
        recipes: 21,
        difficulty: 'intermedio',
        timePerSession: '2-3 horas',
        savings: 'Hasta 70% tiempo semanal',
        preview: {
          recipeNames: ['Curry de lentejas (6 porciones)', 'Lasaña vegetal (8 porciones)', 'Chili con carne (10 porciones)'],
          sampleWeek: 'Domingo: 3h preparación → Lunes-Domingo: 15min calentado'
        },
        rating: 4.8,
        purchases: 1247,
        productId: 'com.thecookflow.pack.batch_cooking_7'
      },
      {
        id: 'vegetarian_pro',
        name: 'Vegetariano PRO',
        description: 'Proteínas vegetales completas y recetas gourmet sin carne.',
        price: 3.99,
        currency: 'EUR',
        type: 'one_time',
        category: 'diet',
        features: [
          '50+ recetas vegetarianas',
          'Guía proteínas vegetales',
          'Sustitutos de carne',
          'Recetas internacionales',
          'Valores nutricionales detallados'
        ],
        recipes: 52,
        difficulty: 'principiante-avanzado',
        cuisines: ['Mediterránea', 'Asiática', 'India', 'Mexicana'],
        nutritionFocus: 'Proteínas completas',
        preview: {
          recipeNames: ['Buddha bowl proteico', 'Hamburguesa de garbanzos', 'Risotto de setas'],
          proteinSources: ['Legumbres', 'Quinoa', 'Tofu', 'Tempeh', 'Frutos secos']
        },
        rating: 4.9,
        purchases: 892,
        productId: 'com.thecookflow.pack.vegetarian_pro'
      },
      {
        id: 'express_15min',
        name: 'Express 15 min',
        description: 'Comidas completas en máximo 15 minutos. Perfecto para vida ocupada.',
        price: 2.99,
        currency: 'EUR',
        type: 'one_time',
        category: 'time_saving',
        features: [
          '30 recetas ultra-rápidas',
          'Técnicas de cocción rápida',
          'Ingredientes pre-preparados',
          'One-pot meals',
          'Desayunos 5 minutos'
        ],
        recipes: 30,
        difficulty: 'principiante',
        maxTime: '15 minutos',
        equipment: 'Básico (sartén, microondas)',
        preview: {
          recipeNames: ['Pasta aglio e olio', 'Wrap de pollo', 'Smoothie bowl'],
          techniques: ['Salteado rápido', 'Cocción simultánea', 'Pre-cortado']
        },
        rating: 4.7,
        purchases: 2156,
        productId: 'com.thecookflow.pack.express_15min'
      },
      {
        id: 'gourmet_weekend',
        name: 'Gourmet Weekend',
        description: 'Recetas especiales para impresionar en fin de semana y ocasiones especiales.',
        price: 6.99,
        currency: 'EUR',
        type: 'one_time',
        category: 'special_occasion',
        features: [
          '25 recetas gourmet',
          'Técnicas avanzadas',
          'Presentación profesional',
          'Maridajes recomendados',
          'Videos paso a paso'
        ],
        recipes: 25,
        difficulty: 'avanzado',
        timeRange: '45-120 minutos',
        specialEquipment: 'Opcional (termómetro, mandolina)',
        preview: {
          recipeNames: ['Beef Wellington', 'Risotto de trufa', 'Tarta tatin'],
          techniques: ['Hojaldre casero', 'Reducción de vinos', 'Caramelización']
        },
        rating: 4.9,
        purchases: 445,
        productId: 'com.thecookflow.pack.gourmet_weekend'
      }
    ];
    
    res.json({
      packs: premiumPacks,
      categories: [
        { id: 'cooking_method', name: 'Métodos de Cocina', count: 1 },
        { id: 'diet', name: 'Dietas Especiales', count: 1 },
        { id: 'time_saving', name: 'Ahorro de Tiempo', count: 1 },
        { id: 'special_occasion', name: 'Ocasiones Especiales', count: 1 }
      ],
      totalPacks: premiumPacks.length,
      mostPopular: 'express_15min',
      newReleases: ['gourmet_weekend'],
      onSale: [], // No current sales
      userPurchases: [] // Would be filled for authenticated users
    });
    
  } catch (error) {
    console.error('Packs catalog error:', error);
    res.status(500).json({
      error: 'Failed to load packs catalog'
    });
  }
});

// Get user's purchased packs
router.get('/packs/my-packs', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    
    // Mock user purchases
    const userPacks = [
      {
        packId: 'express_15min',
        purchaseId: 'pur_001',
        purchasedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        platform: 'google_play',
        status: 'active',
        accessLevel: 'full',
        usage: {
          recipesViewed: 18,
          recipesCooked: 12,
          favoriteRecipes: 6,
          lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    ];
    
    res.json({
      userPacks,
      totalPurchased: userPacks.length,
      totalSpent: userPacks.reduce((sum, pack) => sum + (pack.packId === 'express_15min' ? 2.99 : 0), 0),
      recommendations: [
        {
          packId: 'batch_cooking_7',
          reason: 'Basado en tu uso de Express 15min',
          confidence: 0.85
        },
        {
          packId: 'vegetarian_pro',
          reason: 'Complementa tu estilo de cocina',
          confidence: 0.72
        }
      ]
    });
    
  } catch (error) {
    console.error('My packs error:', error);
    res.status(500).json({
      error: 'Failed to load user packs'
    });
  }
});

// Get pack details
router.get('/packs/:packId', async (req, res) => {
  try {
    const { packId } = req.params;
    
    // Mock detailed pack info
    const packDetails = {
      id: packId,
      name: packId === 'batch_cooking_7' ? 'Batch Cooking 7 días' : 'Pack Details',
      fullDescription: 'Descripción completa del pack con todos los detalles, técnicas incluidas, y beneficios específicos.',
      whatYouGet: [
        'Acceso permanente a todas las recetas',
        'Guías técnicas descargables en PDF',
        'Videos explicativos paso a paso',
        'Lista de ingredientes optimizada',
        'Soporte por email incluido'
      ],
      sampleRecipes: [
        {
          id: 'recipe_001',
          name: 'Curry de lentejas (6 porciones)',
          description: 'Curry aromático perfecto para preparar el domingo y disfrutar toda la semana',
          cookingTime: 45,
          servings: 6,
          difficulty: 'intermedio',
          ingredients: ['Lentejas rojas', 'Leche de coco', 'Especias curry', 'Verduras'],
          preview: true
        },
        {
          id: 'recipe_002',
          name: 'Lasaña vegetal (8 porciones)',
          description: 'Lasaña cargada de verduras, perfecta para congelar en porciones',
          cookingTime: 90,
          servings: 8,
          difficulty: 'intermedio',
          ingredients: ['Pasta', 'Verduras mixtas', 'Bechamel', 'Queso'],
          preview: true
        }
      ],
      reviews: [
        {
          user: 'María C.',
          rating: 5,
          comment: 'Increíble pack. He ahorrado muchísimo tiempo y las recetas están buenísimas.',
          date: '2025-01-01',
          verified: true
        },
        {
          user: 'Carlos R.',
          rating: 5,
          comment: 'Perfecto para familias ocupadas. Los domingos cocino para toda la semana.',
          date: '2024-12-28',
          verified: true
        }
      ],
      faq: [
        {
          question: '¿Tengo acceso para siempre?',
          answer: 'Sí, la compra es única y tendrás acceso permanente a todas las recetas y contenido del pack.'
        },
        {
          question: '¿Puedo usar las recetas sin internet?',
          answer: 'Sí, una vez descargadas las recetas están disponibles offline en tu dispositivo.'
        }
      ],
      relatedPacks: ['vegetarian_pro', 'express_15min']
    };
    
    res.json(packDetails);
    
  } catch (error) {
    console.error('Pack details error:', error);
    res.status(500).json({
      error: 'Failed to load pack details'
    });
  }
});

// Purchase pack (Google Play Billing)
router.post('/packs/purchase', authenticateToken, async (req: any, res) => {
  try {
    const { packId, purchaseToken, platform = 'google_play' } = req.body;
    const userId = req.user?.claims?.sub;
    
    if (!packId || !purchaseToken) {
      return res.status(400).json({
        error: 'Pack ID and purchase token are required'
      });
    }
    
    // In production, verify with Google Play Billing
    const verificationResult = {
      valid: true,
      purchaseToken,
      productId: `com.thecookflow.pack.${packId}`,
      purchaseTime: Date.now(),
      orderID: `GPA.order.${Date.now()}`,
      packageName: 'com.thecookflow.app'
    };
    
    if (!verificationResult.valid) {
      return res.status(400).json({
        error: 'Invalid purchase token'
      });
    }
    
    // Create purchase record
    const purchase = {
      id: `pur_${Date.now()}`,
      userId,
      packId,
      purchaseToken,
      platform,
      orderId: verificationResult.orderID,
      purchasedAt: new Date().toISOString(),
      status: 'completed',
      verificationData: verificationResult
    };
    
    res.json({
      success: true,
      purchase,
      packAccess: {
        packId,
        accessLevel: 'full',
        activatedAt: new Date().toISOString(),
        features: ['recipes', 'guides', 'videos', 'support']
      },
      message: 'Pack purchased successfully!',
      nextSteps: {
        downloadContent: `/api/packs/${packId}/download`,
        viewRecipes: `/packs/${packId}/recipes`,
        getSupport: '/support'
      }
    });
    
  } catch (error) {
    console.error('Pack purchase error:', error);
    res.status(500).json({
      error: 'Failed to process pack purchase'
    });
  }
});

// Download pack content
router.get('/packs/:packId/download', authenticateToken, async (req: any, res) => {
  try {
    const { packId } = req.params;
    const userId = req.user?.claims?.sub;
    
    // Verify user owns this pack
    // In production, check database for purchase
    
    const downloadContent = {
      packId,
      recipes: [
        {
          id: 'recipe_001',
          name: 'Curry de lentejas',
          ingredients: '...',
          instructions: '...',
          downloadUrl: `/api/packs/${packId}/recipes/recipe_001.pdf`
        }
      ],
      guides: [
        {
          name: 'Guía Batch Cooking',
          type: 'pdf',
          downloadUrl: `/api/packs/${packId}/guides/batch_cooking_guide.pdf`
        }
      ],
      videos: [
        {
          title: 'Técnicas básicas batch cooking',
          duration: 180, // seconds
          streamUrl: `/api/packs/${packId}/videos/techniques.mp4`
        }
      ],
      totalSize: '45.2 MB',
      downloadExpires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    
    res.json({
      content: downloadContent,
      downloadToken: `dl_${Date.now()}`,
      expiresAt: downloadContent.downloadExpires,
      instructions: 'Use the download URLs to access your content. Links expire in 24 hours.'
    });
    
  } catch (error) {
    console.error('Pack download error:', error);
    res.status(500).json({
      error: 'Failed to prepare pack download'
    });
  }
});

export default router;