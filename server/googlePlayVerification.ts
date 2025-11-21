// server/googlePlayVerification.ts
import crypto from "crypto";
import { env } from "./env";

/**
 * Verifica la firma de Google Play Billing v3.
 * Acepta public key en PEM (BEGIN/END) o base64 crudo vía env (convertido en env.ts).
 * Intenta primero RSA-SHA256 y, si falla, RSA-SHA1 (compatibilidad).
 */
export function verifyPlaySignature(signedData: string, signatureBase64: string): boolean {
  const sig = Buffer.from(signatureBase64, "base64");

  for (const algo of ["RSA-SHA256", "RSA-SHA1"] as const) {
    try {
      const verifier = crypto.createVerify(algo);
      verifier.update(signedData, "utf8");
      verifier.end();
      if (verifier.verify(env.GOOGLE_PLAY_PUBLIC_KEY_PEM, sig)) return true;
    } catch {
      // continúa con el siguiente algoritmo
    }
  }
  return false;
}

interface GooglePlayPurchaseData {
  orderId: string;
  packageName: string;
  productId: string;
  purchaseTime: number;
  purchaseState: number;
  purchaseToken: string;
  quantity?: number;
  acknowledged?: boolean;
  autoRenewing?: boolean;
  subscriptionId?: string;
}

/**
 * Procesa y verifica una compra de Google Play completa
 */
export function processGooglePlayPurchase(
  signedData: string,
  signature: string
): { isValid: boolean; purchaseData?: GooglePlayPurchaseData } {
  try {
    // Verificar la firma primero
    const isSignatureValid = verifyPlaySignature(signedData, signature);
    
    if (!isSignatureValid) {
      console.log('🔐 Google Play signature verification: INVALID');
      return { isValid: false };
    }

    // Parsear los datos de compra
    const purchaseData = JSON.parse(signedData) as GooglePlayPurchaseData;
    
    // Validaciones básicas
    if (!purchaseData.orderId || !purchaseData.purchaseToken) {
      console.log('❌ Invalid purchase data: missing required fields');
      return { isValid: false };
    }

    console.log('✅ Google Play purchase verified successfully:', purchaseData.orderId);
    return { isValid: true, purchaseData };

  } catch (error) {
    console.error('❌ Error processing Google Play purchase:', error);
    return { isValid: false };
  }
}

// Uso esperado: signedData es el JSON/cadena que devuelve la compra; signatureBase64 la firma base64 de Google Play.