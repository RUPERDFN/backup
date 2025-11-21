import { Router } from 'express';
import { z } from 'zod';
import { verifySubscription } from '../googlePlayBilling.js';
import { getCache, setCache } from '../cache.js';

export const router = Router();

const verifySchema = z.object({
  productId: z.string().min(1),
  purchaseToken: z.string().min(1),
});

// POST /api/verify  { productId, purchaseToken }
router.post('/verify', async (req, res) => {
  try {
    const body = verifySchema.parse(req.body);

    // Fuerza el productId esperado
    if (body.productId !== (process.env.GOOGLE_PLAY_PRODUCT_ID || 'suscripcion')) {
      return res.status(400).json({ ok:false, error:'WRONG_PRODUCT_ID' });
    }

    // Handle test token
    if (body.purchaseToken === 'TEST') {
      return res.json({ 
        ok: true, 
        active: false, 
        message: 'Test token - verification not performed',
        source: 'test'
      });
    }

    // Check cache first
    const cacheKey = `verify:${body.purchaseToken}`;
    const cached = getCache(cacheKey);
    if (cached) {
      return res.json({ ok: true, ...cached, cached: true });
    }

    const result = await verifySubscription({
      purchaseToken: body.purchaseToken,
      productId: body.productId,
    });

    // Cache successful results
    if (result.active) {
      setCache(cacheKey, result, 300000); // 5 min cache
    }

    res.json({ ok: true, ...result });
  } catch (err) {
    res.status(400).json({ ok:false, error: err.message || 'BAD_REQUEST' });
  }
});

// GET /api/subscription-status?purchaseToken=...
router.get('/subscription-status', async (req, res) => {
  const purchaseToken = String(req.query.purchaseToken || '');
  if (!purchaseToken) return res.status(400).json({ ok:false, error:'MISSING_TOKEN' });

  // Handle test token
  if (purchaseToken === 'TEST') {
    return res.json({ 
      ok: true, 
      active: false, 
      message: 'Test token - verification not performed',
      source: 'test'
    });
  }

  // Check cache first
  const cacheKey = `status:${purchaseToken}`;
  const cached = getCache(cacheKey);
  if (cached) {
    return res.json({ ok: true, ...cached, cached: true });
  }

  const result = await verifySubscription({ purchaseToken });

  // Cache successful results
  if (result.active) {
    setCache(cacheKey, result, 300000); // 5 min cache
  }

  res.json({ ok: true, ...result });
});