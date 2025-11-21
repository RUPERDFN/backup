import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export interface UserPlan {
  plan: 'free' | 'trial' | 'pro';
  trialActive: boolean;
  trialDaysLeft: number;
  trialEndDate?: string;
  subscriptionStatus?: string;
  autoRenewing: boolean;
  dailyMenusUsed: number;
  dailyMenusLimit: number;
  canGenerateMenu: boolean;
}

// Hook to get current user plan status
export function usePlan() {
  const { toast } = useToast();
  
  // Query subscription status
  const { data: planData, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/freemium/status'],
    retry: 2,
    refetchInterval: 60000, // Refetch every minute to update trial days
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  // Start trial mutation
  const startTrialMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/freemium/start-trial', {
        method: 'POST',
      });
    },
    onSuccess: () => {
      toast({
        title: '✅ Prueba activada',
        description: 'Disfruta de TheCookFlow PRO durante 7 días gratis',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/freemium/status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/subscription/status'] });
    },
    onError: (error) => {
      toast({
        title: '❌ Error',
        description: 'No se pudo activar la prueba gratuita',
        variant: 'destructive',
      });
      console.error('Error starting trial:', error);
    },
  });

  // Cancel subscription mutation
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/freemium/cancel', {
        method: 'POST',
      });
    },
    onSuccess: () => {
      toast({
        title: '✅ Suscripción cancelada',
        description: 'Tu suscripción se cancelará al final del período actual',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/freemium/status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/subscription/status'] });
    },
    onError: (error) => {
      toast({
        title: '❌ Error',
        description: 'No se pudo cancelar la suscripción',
        variant: 'destructive',
      });
      console.error('Error canceling subscription:', error);
    },
  });

  // Unlock after ad mutation
  const unlockAfterAdMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/freemium/unlock-after-ad', {
        method: 'POST',
      });
    },
    onSuccess: () => {
      toast({
        title: '🎉 Desbloqueado',
        description: 'Has desbloqueado 1 generación adicional',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/freemium/status'] });
    },
    onError: (error) => {
      toast({
        title: '❌ Error',
        description: 'No se pudo desbloquear la generación',
        variant: 'destructive',
      });
      console.error('Error unlocking after ad:', error);
    },
  });

  // Helper functions
  const isPremium = planData?.plan === 'pro' || planData?.trialActive;
  const isFree = planData?.plan === 'free' && !planData?.trialActive;
  const hasReachedLimit = planData?.dailyMenusUsed >= planData?.dailyMenusLimit;
  const canStartTrial = planData?.plan === 'free' && !planData?.trialActive;

  return {
    // Plan data
    plan: planData?.plan || 'free',
    planData,
    isLoading,
    error,
    
    // Status flags
    isPremium,
    isFree,
    hasReachedLimit,
    canStartTrial,
    canGenerateMenu: planData?.canGenerateMenu || false,
    
    // Trial info
    trialActive: planData?.trialActive || false,
    trialDaysLeft: planData?.trialDaysLeft || 0,
    trialEndDate: planData?.trialEndDate,
    
    // Usage info
    dailyMenusUsed: planData?.dailyMenusUsed || 0,
    dailyMenusLimit: planData?.dailyMenusLimit || 1,
    
    // Actions
    startTrial: startTrialMutation.mutate,
    cancelSubscription: cancelSubscriptionMutation.mutate,
    unlockAfterAd: unlockAfterAdMutation.mutate,
    refetchPlan: refetch,
    
    // Mutation states
    isStartingTrial: startTrialMutation.isPending,
    isCancelingSubscription: cancelSubscriptionMutation.isPending,
    isUnlockingAfterAd: unlockAfterAdMutation.isPending,
  };
}