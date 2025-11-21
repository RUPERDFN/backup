import { Router } from 'express';
import { authenticateToken } from '../auth';
import { nanoid } from 'nanoid';

const router = Router();

// Create shareable menu link
router.post('/share/menu', authenticateToken, async (req: any, res) => {
  try {
    const { menuPlanId, visibility = 'public' } = req.body;
    const userId = req.user?.claims?.sub;
    
    if (!menuPlanId) {
      return res.status(400).json({ error: 'Menu plan ID is required' });
    }
    
    // Generate unique share ID
    const shareId = nanoid(10);
    const shareUrl = `${req.protocol}://${req.get('host')}/m/${shareId}`;
    
    // In production, save to database
    const shareData = {
      id: shareId,
      type: 'menu',
      menuPlanId,
      userId,
      visibility,
      createdAt: new Date().toISOString(),
      expiresAt: visibility === 'temporary' ? 
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null,
      views: 0,
      clones: 0
    };
    
    // WhatsApp optimized text
    const whatsappText = encodeURIComponent(
      `🍽️ Mira mi menú semanal creado con IA:\n\n` +
      `✅ 7 días de comidas balanceadas\n` +
      `✅ Lista de compra automática\n` +
      `✅ Recetas paso a paso\n\n` +
      `👉 ${shareUrl}\n\n` +
      `#TheCookFlow #MenuIA #CocinaInteligente`
    );
    
    res.json({
      success: true,
      shareId,
      shareUrl,
      whatsappUrl: `https://wa.me/?text=${whatsappText}`,
      socialSharing: {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Mira mi menú semanal creado con IA 🍽️')}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Menú semanal con IA')}`
      },
      embedCode: `<iframe src="${shareUrl}?embed=true" width="100%" height="600" frameborder="0"></iframe>`,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`,
      shareData
    });
    
  } catch (error) {
    console.error('Share menu error:', error);
    res.status(500).json({
      error: 'Failed to create shareable link'
    });
  }
});

// Create shareable shopping list
router.post('/share/shopping-list', authenticateToken, async (req: any, res) => {
  try {
    const { shoppingListId } = req.body;
    const userId = req.user?.claims?.sub;
    
    if (!shoppingListId) {
      return res.status(400).json({ error: 'Shopping list ID is required' });
    }
    
    const shareId = nanoid(10);
    const shareUrl = `${req.protocol}://${req.get('host')}/l/${shareId}`;
    
    // Generate WhatsApp-optimized shopping list text
    const mockShoppingList = [
      '🥬 **Verduras:**',
      '• Tomates - 500g',
      '• Cebolla - 2 unidades', 
      '• Pimientos - 3 unidades',
      '',
      '🥩 **Carnes:**',
      '• Pollo - 1kg',
      '• Ternera - 500g',
      '',
      '🥛 **Lácteos:**',
      '• Leche - 1L',
      '• Queso mozzarella - 200g',
      '',
      '🌾 **Despensa:**',
      '• Arroz - 1kg',
      '• Pasta - 500g',
      '• Aceite oliva - 500ml'
    ];
    
    const whatsappList = encodeURIComponent(
      `🛒 **LISTA DE COMPRA SEMANAL**\n` +
      `Generada automáticamente por TheCookFlow\n\n` +
      mockShoppingList.join('\n') +
      `\n\n💰 **Coste estimado:** €45-52\n` +
      `📱 **Ver lista completa:** ${shareUrl}\n\n` +
      `#ListaCompra #TheCookFlow`
    );
    
    res.json({
      success: true,
      shareId,
      shareUrl,
      whatsappUrl: `https://wa.me/?text=${whatsappList}`,
      whatsappText: decodeURIComponent(whatsappList),
      printUrl: `${shareUrl}?print=true`,
      message: 'Shopping list shared successfully'
    });
    
  } catch (error) {
    console.error('Share shopping list error:', error);
    res.status(500).json({
      error: 'Failed to share shopping list'
    });
  }
});

// Get share statistics
router.get('/share/stats/:shareId', authenticateToken, async (req: any, res) => {
  try {
    const { shareId } = req.params;
    const userId = req.user?.claims?.sub;
    
    // Mock share statistics
    const stats = {
      shareId,
      type: shareId.startsWith('m') ? 'menu' : 'shopping-list',
      totalViews: Math.floor(Math.random() * 100 + 10),
      uniqueViews: Math.floor(Math.random() * 80 + 8),
      clones: Math.floor(Math.random() * 15 + 2),
      shares: Math.floor(Math.random() * 25 + 5),
      conversionRate: Math.random() * 20 + 5, // 5-25%
      topReferrers: [
        { source: 'WhatsApp', visits: Math.floor(Math.random() * 30 + 10) },
        { source: 'Direct', visits: Math.floor(Math.random() * 20 + 5) },
        { source: 'Facebook', visits: Math.floor(Math.random() * 15 + 3) },
        { source: 'Telegram', visits: Math.floor(Math.random() * 10 + 2) }
      ],
      dailyViews: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        views: Math.floor(Math.random() * 20 + 2)
      })).reverse(),
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    res.json(stats);
    
  } catch (error) {
    console.error('Share stats error:', error);
    res.status(500).json({
      error: 'Failed to get share statistics'
    });
  }
});

// Public menu view (no auth required)
router.get('/public/menu/:shareId', async (req, res) => {
  try {
    const { shareId } = req.params;
    
    // Mock shared menu data
    const sharedMenu = {
      id: shareId,
      title: 'Menú Semanal Mediterráneo',
      description: 'Menú equilibrado para 2 personas, coste aprox. €48/semana',
      author: 'Usuario TheCookFlow',
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      days: [
        {
          dayName: 'Lunes',
          meals: [
            { type: 'Desayuno', name: 'Tostadas con tomate', time: '10 min' },
            { type: 'Comida', name: 'Paella Valenciana', time: '35 min' },
            { type: 'Cena', name: 'Ensalada César', time: '15 min' }
          ]
        },
        {
          dayName: 'Martes',
          meals: [
            { type: 'Desayuno', name: 'Yogur con frutas', time: '5 min' },
            { type: 'Comida', name: 'Pasta Carbonara', time: '20 min' },
            { type: 'Cena', name: 'Salmón a la plancha', time: '25 min' }
          ]
        }
      ],
      nutrition: {
        calories: 2100,
        protein: 85,
        carbs: 280,
        fat: 70
      },
      cost: {
        total: 48.50,
        perPerson: 24.25,
        perDay: 6.93
      },
      views: Math.floor(Math.random() * 100 + 20),
      clones: Math.floor(Math.random() * 10 + 1)
    };
    
    res.json({
      menu: sharedMenu,
      cloneUrl: `/api/share/clone/${shareId}`,
      ctaText: 'Clona este menú gratis',
      referralCode: shareId.substring(0, 6).toUpperCase()
    });
    
  } catch (error) {
    console.error('Public menu view error:', error);
    res.status(500).json({
      error: 'Failed to load shared menu'
    });
  }
});

// Clone shared menu (requires auth)
router.post('/share/clone/:shareId', authenticateToken, async (req: any, res) => {
  try {
    const { shareId } = req.params;
    const userId = req.user?.claims?.sub;
    
    // In production, clone the actual menu plan
    const clonedMenu = {
      id: nanoid(),
      originalShareId: shareId,
      userId,
      name: 'Menú Clonado - Mediterráneo',
      clonedAt: new Date().toISOString(),
      customizations: req.body.customizations || {}
    };
    
    res.json({
      success: true,
      menuPlan: clonedMenu,
      message: 'Menu cloned successfully',
      redirectUrl: `/menu/${clonedMenu.id}`
    });
    
  } catch (error) {
    console.error('Clone menu error:', error);
    res.status(500).json({
      error: 'Failed to clone menu'
    });
  }
});

export default router;