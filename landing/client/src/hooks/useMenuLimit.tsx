import { useState, useCallback, useEffect } from 'react';
import { usePlan } from './usePlan';
import { useToast } from '@/hooks/use-toast';

export interface MenuLimitState {
  canGenerate: boolean;
  remainingGenerations: number;
  showPaywall: boolean;
  isWatchingAd: boolean;
}

// Hook to manage menu generation limits and paywall
export function useMenuLimit() {
  const { toast } = useToast();
  const {
    isPremium,
    isFree,
    hasReachedLimit,
    canGenerateMenu,
    dailyMenusUsed,
    dailyMenusLimit,
    unlockAfterAd,
    isUnlockingAfterAd,
    startTrial,
    refetchPlan,
  } = usePlan();

  const [showPaywall, setShowPaywall] = useState(false);
  const [isWatchingAd, setIsWatchingAd] = useState(false);

  // Calculate remaining generations
  const remainingGenerations = Math.max(0, dailyMenusLimit - dailyMenusUsed);

  // Check if user can generate menu
  const checkCanGenerate = useCallback((): boolean => {
    if (isPremium) {
      return true; // Premium users have unlimited generations
    }

    if (isFree && hasReachedLimit) {
      setShowPaywall(true);
      return false;
    }

    return canGenerateMenu;
  }, [isPremium, isFree, hasReachedLimit, canGenerateMenu]);

  // Handle ad watching
  const watchAdToUnlock = useCallback(async () => {
    if (!hasReachedLimit) {
      toast({
        description: 'No necesitas ver un anuncio ahora',
      });
      return;
    }

    setIsWatchingAd(true);
    
    try {
      // Simulate ad watching (in real app, this would integrate with ad SDK)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Call API to unlock after ad
      await unlockAfterAd();
      
      // Refetch plan data
      await refetchPlan();
      
      setShowPaywall(false);
      setIsWatchingAd(false);
      
      toast({
        title: '✅ Desbloqueado',
        description: 'Has desbloqueado 1 generación adicional',
      });
    } catch (error) {
      console.error('Error watching ad:', error);
      toast({
        title: '❌ Error',
        description: 'No se pudo completar el anuncio',
        variant: 'destructive',
      });
      setIsWatchingAd(false);
    }
  }, [hasReachedLimit, unlockAfterAd, refetchPlan, toast]);

  // Handle paywall close
  const handlePaywallClose = useCallback(() => {
    setShowPaywall(false);
  }, []);

  // Handle trial start from paywall
  const handleStartTrial = useCallback(async () => {
    try {
      await startTrial();
      setShowPaywall(false);
      await refetchPlan();
    } catch (error) {
      console.error('Error starting trial:', error);
    }
  }, [startTrial, refetchPlan]);

  // Auto-show paywall when limit reached
  useEffect(() => {
    if (isFree && hasReachedLimit && !showPaywall) {
      // Don't auto-show on mount, only when actively trying to generate
    }
  }, [isFree, hasReachedLimit, showPaywall]);

  // Increment usage (should be called after successful menu generation)
  const incrementUsage = useCallback(async () => {
    if (!isPremium) {
      // Refetch to get updated usage count
      await refetchPlan();
      
      // Show remaining generations
      if (remainingGenerations > 1) {
        toast({
          description: `Te quedan ${remainingGenerations - 1} generaciones gratuitas hoy`,
        });
      } else if (remainingGenerations === 1) {
        toast({
          description: 'Esta es tu última generación gratuita de hoy',
          variant: 'default',
        });
      }
    }
  }, [isPremium, remainingGenerations, refetchPlan, toast]);

  // Get status message for UI
  const getStatusMessage = useCallback((): string => {
    if (isPremium) {
      return '♾️ Generaciones ilimitadas';
    }
    if (hasReachedLimit) {
      return '🔒 Límite diario alcanzado';
    }
    if (remainingGenerations === 1) {
      return `⚠️ Última generación gratuita de hoy`;
    }
    return `📊 ${remainingGenerations} generaciones restantes`;
  }, [isPremium, hasReachedLimit, remainingGenerations]);

  return {
    // State
    canGenerate: canGenerateMenu,
    remainingGenerations,
    showPaywall,
    isWatchingAd,
    
    // Flags
    isPremium,
    isFree,
    hasReachedLimit,
    
    // Usage info
    dailyMenusUsed,
    dailyMenusLimit,
    
    // Actions
    checkCanGenerate,
    watchAdToUnlock,
    handlePaywallClose,
    handleStartTrial,
    incrementUsage,
    setShowPaywall,
    
    // Helpers
    getStatusMessage,
    
    // Loading states
    isUnlockingAfterAd,
  };
}