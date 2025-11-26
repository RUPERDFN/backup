import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';

const PACKAGE_NAME = process.env.GOOGLE_PLAY_PACKAGE_NAME || 'com.cookflow.app';
const PRODUCT_ID   = process.env.GOOGLE_PLAY_PRODUCT_ID   || 'suscripcion';

// Decodifica Service Account JSON desde base64 (Replit Secret)
function getServiceAccountCredentials() {
  const b64 = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON_BASE64;
  if (!b64) throw new Error('Falta GOOGLE_PLAY_SERVICE_ACCOUNT_JSON_BASE64');
  const json = Buffer.from(b64, 'base64').toString('utf8');
  return JSON.parse(json);
}

export async function getAndroidPublisher() {
  const credentials = getServiceAccountCredentials();
  const auth = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/androidpublisher'],
  });
  const authClient = await auth.getClient();
  const androidpublisher = google.androidpublisher({ version: 'v3', auth: authClient });
  return androidpublisher;
}

/**
 * Verifica una suscripción por token. Intenta `subscriptionsv2.get` (nuevo)
 * y hace fallback a `purchases.subscriptions.get` (legacy).
 */
export async function verifySubscription({ purchaseToken, packageName = PACKAGE_NAME, productId = PRODUCT_ID }) {
  const androidpublisher = await getAndroidPublisher();

  // 1) Nuevo endpoint (v2)
  try {
    const { data } = await androidpublisher.purchases.subscriptionsv2.get({
      packageName,
      token: purchaseToken,
    });
    // Normaliza (v2 devuelve `data.lineItems[0].expiryTime` en ms, etc.)
    const line = data?.lineItems?.[0];
    const expiryMs = line?.expiryTime;
    const autoRenewing = data?.autoRenewing;
    const expired = expiryMs ? Date.now() > Number(expiryMs) : true;
    return {
      active: !expired && !!autoRenewing,
      expiryTimeMillis: expiryMs ? String(expiryMs) : undefined,
      orderId: data?.latestOrderId,
      source: 'v2'
    };
  } catch (e) {
    // continua con fallback
  }

  // 2) Legacy (v1)
  try {
    const { data } = await androidpublisher.purchases.subscriptions.get({
      packageName,
      subscriptionId: productId,
      token: purchaseToken,
    });
    const expiryMs = data?.expiryTimeMillis;
    const autoRenewing = data?.autoRenewing;
    const expired = expiryMs ? Date.now() > Number(expiryMs) : true;
    return {
      active: !expired && !!autoRenewing,
      expiryTimeMillis: expiryMs,
      orderId: data?.orderId,
      source: 'v1'
    };
  } catch (err) {
    return { active: false, error: 'INVALID_TOKEN_OR_PERMISSION', source: 'none' };
  }
}