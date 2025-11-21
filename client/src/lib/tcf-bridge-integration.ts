import { queryClient } from '@/lib/queryClient';

/**
 * Integración del TCF Bridge (Android WebView) con React Query
 * 
 * Escucha eventos de billing y actualiza el estado de premium
 * en la aplicación automáticamente.
 */

// Declaración de tipos para window.tcf
declare global {
  interface Window {
    tcf?: {
      getUserId: () => string;
      status: () => Promise<any>;
      openSubscription: () => void;
      setPro: (active: boolean) => void;
    };
    Android?: {
      getUserId: () => string;
      openSubscription: (userId: string) => void;
      setPro: (active: boolean) => void;
    };
  }
}

/**
 * Inicializa la integración del TCF Bridge
 * Se debe llamar una vez en main.tsx
 */
export function initializeTCFBridge() {
  // Esperar a que tcf-bridge.js se cargue
  if (typeof window === 'undefined') return;

  // Escuchar evento de verificación de billing exitosa
  window.addEventListener('tcf:billing-verified', async (event: any) => {
    const { isPremium, userId } = event.detail || {};
    
    console.log('[TCF Bridge] Billing verified:', { isPremium, userId });
    
    if (isPremium) {
      // Actualizar estado premium en React Query
      await queryClient.invalidateQueries({ 
        queryKey: ['/api/subscription/status'] 
      });
      
      // Notificar a Android (si está disponible)
      window.tcf?.setPro(true);
      
      // Actualizar flag global para ads
      window.IS_PREMIUM = true;
    }
  });

  // Mejorar el deeplink listener original del tcf-bridge.js
  window.addEventListener('tcf:deeplink', async (event: any) => {
    const { userId, token } = event.detail || {};
    
    if (!token) {
      console.warn('[TCF Bridge] Deep link sin token de compra');
      return;
    }
    
    try {
      console.log('[TCF Bridge] Procesando deep link:', { userId });
      
      const response = await fetch('/api/billing/verify', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ userId, purchaseToken: token })
      });
      
      const result = await response.json();
      
      if (result.active || result.plan === 'pro') {
        // Disparar evento de verificación exitosa
        window.dispatchEvent(new CustomEvent('tcf:billing-verified', {
          detail: { isPremium: true, userId }
        }));
      }
    } catch (error) {
      console.error('[TCF Bridge] Error verificando compra:', error);
    }
  });

  console.log('[TCF Bridge] Integration initialized');
}

/**
 * Hook helper para obtener userId desde window.tcf
 */
export function getTCFUserId(): string {
  if (typeof window === 'undefined') return '';
  return window.tcf?.getUserId() || '';
}

/**
 * Hook helper para abrir suscripción
 */
export function openTCFSubscription() {
  if (typeof window === 'undefined') return;
  window.tcf?.openSubscription();
}

/**
 * Hook helper para obtener estado de suscripción
 */
export async function getTCFStatus() {
  if (typeof window === 'undefined') return null;
  return window.tcf?.status();
}
