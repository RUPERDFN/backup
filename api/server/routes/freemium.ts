import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { 
  getSubscriptionStatus, 
  startTrial, 
  cancelSubscription,
  verifyGooglePlayPurchase 
} from '../services/billingService';
import { 
  canGenerateMenu, 
  recordMenuGeneration,
  unlockAfterAd,
  getLimitStatus 
} from '../services/menuLimiterService';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Validation schemas
const startTrialSchema = z.object({
  userId: z.string().optional() // Optional because we can get from req.user
});

const unlockAfterAdSchema = z.object({
  userId: z.string().optional()
});

const cancelSubscriptionSchema = z.object({
  userId: z.string().optional()
});

const verifyPurchaseSchema = z.object({
  userId: z.string().optional(),
  purchaseToken: z.string(),
  productId: z.string().optional(),
  subscriptionId: z.string().optional()
});

/**
 * GET /api/freemium/status
 * Get freemium subscription status for a user  
 */
router.get('/freemium/status', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || req.query.userId as string;
    
    if (!userId) {
      return res.status(401).json({ 
        error: 'Usuario no autenticado',
        plan: 'free',
        trialActive: false,
        active: false,
        dailyMenusUsed: 0,
        dailyMenusLimit: 1,
        canGenerateMenu: false
      });
    }

    const subscriptionStatus = await getSubscriptionStatus(userId);
    const limitStatus = await getLimitStatus(userId);
    
    res.json({
      ...subscriptionStatus,
      ...limitStatus
    });
  } catch (error) {
    console.error('Error getting freemium status:', error);
    res.status(500).json({ 
      error: 'Error al obtener estado freemium',
      plan: 'free',
      trialActive: false,
      active: false
    });
  }
});

/**
 * GET /api/subscription/status
 * Get subscription status for a user (legacy endpoint)
 */
router.get('/subscription/status', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || req.query.userId as string;
    
    if (!userId) {
      return res.status(401).json({ 
        error: 'Usuario no autenticado',
        isPremium: false,
        subscriptionStatus: 'free'
      });
    }

    const status = await getSubscriptionStatus(userId);
    res.json(status);
  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({ 
      error: 'Error al obtener estado de suscripción',
      plan: 'free',
      trialActive: false,
      active: false
    });
  }
});

/**
 * POST /api/freemium/start-trial
 * Start a 7-day trial for a user (primary endpoint)
 */
router.post('/freemium/start-trial', async (req: Request, res: Response) => {
  try {
    const { userId } = startTrialSchema.parse(req.body);
    const finalUserId = userId || req.user?.id;

    if (!finalUserId) {
      return res.status(401).json({ error: 'Usuario no autenticado', success: false });
    }

    const status = await startTrial(finalUserId);
    res.json({
      success: true,
      ...status
    });
  } catch (error) {
    console.error('Error starting trial:', error);
    const message = error instanceof Error ? error.message : 'Error al iniciar prueba';
    res.status(400).json({ 
      error: message,
      success: false
    });
  }
});

/**
 * POST /api/start-trial
 * Start a 7-day trial for a user (legacy endpoint)
 */
router.post('/start-trial', async (req: Request, res: Response) => {
  try {
    const { userId } = startTrialSchema.parse(req.body);
    const finalUserId = userId || req.user?.id;

    if (!finalUserId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const status = await startTrial(finalUserId);
    res.json({
      success: true,
      ...status
    });
  } catch (error) {
    console.error('Error starting trial:', error);
    const message = error instanceof Error ? error.message : 'Error al iniciar prueba';
    res.status(400).json({ 
      error: message,
      success: false
    });
  }
});

/**
 * POST /api/freemium/unlock-after-ad
 * Unlock menu generation after watching an ad (primary endpoint)
 */
router.post('/freemium/unlock-after-ad', async (req: Request, res: Response) => {
  try {
    const { userId } = unlockAfterAdSchema.parse(req.body);
    const finalUserId = userId || req.user?.id;

    if (!finalUserId) {
      return res.status(401).json({ error: 'Usuario no autenticado', success: false });
    }

    const success = await unlockAfterAd(finalUserId);
    
    if (!success) {
      return res.status(403).json({ 
        error: 'Límite de anuncios alcanzado hoy',
        success: false 
      });
    }

    res.json({ 
      success: true,
      canGenerateMenu: true,
      message: 'Menú desbloqueado tras ver anuncio'
    });
  } catch (error) {
    console.error('Error unlocking after ad:', error);
    res.status(500).json({ 
      error: 'Error al desbloquear con anuncio',
      success: false
    });
  }
});

/**
 * POST /api/unlock-after-ad
 * Unlock menu generation after watching an ad (legacy endpoint)
 */
router.post('/unlock-after-ad', async (req: Request, res: Response) => {
  try {
    const { userId } = unlockAfterAdSchema.parse(req.body);
    const finalUserId = userId || req.user?.id;

    if (!finalUserId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const success = await unlockAfterAd(finalUserId);
    
    if (!success) {
      return res.status(403).json({ 
        error: 'Límite de anuncios alcanzado hoy',
        ok: false 
      });
    }

    res.json({ 
      ok: true,
      message: 'Menú desbloqueado tras ver anuncio'
    });
  } catch (error) {
    console.error('Error unlocking after ad:', error);
    res.status(500).json({ 
      error: 'Error al desbloquear con anuncio',
      ok: false
    });
  }
});

/**
 * POST /api/freemium/cancel
 * Cancel a user's subscription (primary endpoint)
 */
router.post('/freemium/cancel', async (req: Request, res: Response) => {
  try {
    const { userId } = cancelSubscriptionSchema.parse(req.body);
    const finalUserId = userId || req.user?.id;

    if (!finalUserId) {
      return res.status(401).json({ error: 'Usuario no autenticado', success: false });
    }

    const success = await cancelSubscription(finalUserId);
    
    if (!success) {
      return res.status(500).json({ 
        error: 'Error al cancelar suscripción',
        success: false 
      });
    }

    res.json({ 
      success: true,
      message: 'Suscripción cancelada correctamente'
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ 
      error: 'Error al cancelar suscripción',
      success: false
    });
  }
});

/**
 * POST /api/billing/cancel
 * Cancel a user's subscription (legacy endpoint)
 */
router.post('/billing/cancel', async (req: Request, res: Response) => {
  try {
    const { userId } = cancelSubscriptionSchema.parse(req.body);
    const finalUserId = userId || req.user?.id;

    if (!finalUserId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const success = await cancelSubscription(finalUserId);
    
    if (!success) {
      return res.status(500).json({ 
        error: 'Error al cancelar suscripción',
        ok: false 
      });
    }

    res.json({ 
      ok: true,
      message: 'Suscripción cancelada correctamente'
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ 
      error: 'Error al cancelar suscripción',
      ok: false
    });
  }
});

/**
 * POST /api/freemium/verify-google-play-purchase
 * Verify a Google Play purchase (primary endpoint)
 */
router.post('/freemium/verify-google-play-purchase', async (req: Request, res: Response) => {
  try {
    const { userId, purchaseToken, productId, subscriptionId } = verifyPurchaseSchema.parse(req.body);
    const finalUserId = userId || req.user?.id;

    if (!finalUserId) {
      return res.status(401).json({ error: 'Usuario no autenticado', success: false });
    }

    const result = await verifyGooglePlayPurchase(finalUserId, purchaseToken, productId, subscriptionId);
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error verifying purchase:', error);
    res.status(500).json({ 
      error: 'Error al verificar compra',
      success: false,
      active: false,
      plan: 'free'
    });
  }
});

/**
 * POST /api/billing/verify
 * Verify a Google Play purchase (legacy endpoint)
 */
router.post('/billing/verify', async (req: Request, res: Response) => {
  try {
    const { userId, purchaseToken, productId, subscriptionId } = verifyPurchaseSchema.parse(req.body);
    const finalUserId = userId || req.user?.id;

    if (!finalUserId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const result = await verifyGooglePlayPurchase(finalUserId, purchaseToken, productId, subscriptionId);
    res.json(result);
  } catch (error) {
    console.error('Error verifying purchase:', error);
    res.status(500).json({ 
      error: 'Error al verificar compra',
      active: false,
      plan: 'free'
    });
  }
});

/**
 * GET /api/menu-limits
 * Get detailed menu generation limits for a user
 */
router.get('/menu-limits', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || req.query.userId as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const status = await getLimitStatus(userId);
    res.json(status);
  } catch (error) {
    console.error('Error getting menu limits:', error);
    res.status(500).json({ 
      error: 'Error al obtener límites',
      canGenerate: true // Allow on error to avoid blocking
    });
  }
});

/**
 * POST /api/check-menu-limit
 * Check if user can generate a menu (dry run)
 */
router.post('/check-menu-limit', async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const check = await canGenerateMenu(userId);
    res.json(check);
  } catch (error) {
    console.error('Error checking menu limit:', error);
    res.status(500).json({ 
      allowed: true, // Allow on error to avoid blocking
      reason: 'first_menu_free'
    });
  }
});

/**
 * POST /api/record-menu-generation
 * Record that a menu was generated (should be called after successful generation)
 */
router.post('/record-menu-generation', async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    await recordMenuGeneration(userId);
    res.json({ 
      ok: true,
      message: 'Generación de menú registrada'
    });
  } catch (error) {
    console.error('Error recording menu generation:', error);
    res.status(500).json({ 
      ok: false,
      error: 'Error al registrar generación'
    });
  }
});

export default router;