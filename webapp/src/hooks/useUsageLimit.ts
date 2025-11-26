import { useState, useEffect } from 'react';
import { usePremium } from './usePremium';

interface UsageLimitOptions {
  dailyLimit: number;
  feature: string; // 'chef', 'menu', 'vision', etc.
}

export function useUsageLimit({ dailyLimit, feature }: UsageLimitOptions) {
  const { isPremium } = usePremium();
  const [usageCount, setUsageCount] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);

  // Obtener fecha actual en formato YYYYMMDD
  const getToday = () => {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  };

  // Cargar contador del día actual desde localStorage
  useEffect(() => {
    if (isPremium) {
      // Premium: sin límites
      setUsageCount(0);
      setIsLimitReached(false);
      return;
    }

    const today = getToday();
    const storageKey = `${feature}_count_${today}`;
    const stored = localStorage.getItem(storageKey);
    const count = stored ? parseInt(stored, 10) : 0;
    
    setUsageCount(count);
    setIsLimitReached(count >= dailyLimit);

    // Limpiar contadores de días anteriores
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (key.startsWith(`${feature}_count_`) && key !== storageKey) {
        localStorage.removeItem(key);
      }
    });
  }, [isPremium, feature, dailyLimit]);

  // Incrementar contador
  const incrementUsage = () => {
    if (isPremium) return true; // Premium: siempre permitido

    const today = getToday();
    const storageKey = `${feature}_count_${today}`;
    const newCount = usageCount + 1;

    if (newCount > dailyLimit) {
      setIsLimitReached(true);
      return false; // Límite alcanzado
    }

    localStorage.setItem(storageKey, String(newCount));
    setUsageCount(newCount);
    setIsLimitReached(newCount >= dailyLimit);
    return true; // Operación permitida
  };

  // Resetear contador (para testing)
  const resetUsage = () => {
    const today = getToday();
    const storageKey = `${feature}_count_${today}`;
    localStorage.removeItem(storageKey);
    setUsageCount(0);
    setIsLimitReached(false);
  };

  return {
    usageCount,
    dailyLimit,
    isLimitReached,
    remainingUsage: Math.max(0, dailyLimit - usageCount),
    isPremium,
    canUse: isPremium || !isLimitReached,
    incrementUsage,
    resetUsage,
  };
}
