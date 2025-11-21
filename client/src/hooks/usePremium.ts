import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

interface PremiumStatus {
  isPremium: boolean;
  subscriptionStatus: string;
  expiryTime?: string;
  provider?: string;
}

export function usePremium() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useQuery<PremiumStatus>({
    queryKey: ["/api/subscription/status"],
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });

  const refreshPremiumStatus = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/subscription/status"] });
  };

  // Set global flag for ads system
  if (typeof window !== 'undefined') {
    window.IS_PREMIUM = data?.isPremium || false;
  }

  return {
    isPremium: data?.isPremium || false,
    subscriptionStatus: data?.subscriptionStatus || 'free',
    expiryTime: data?.expiryTime,
    provider: data?.provider,
    isLoading,
    error,
    refreshPremiumStatus,
  };
}

// Global type declaration for TypeScript
declare global {
  interface Window {
    IS_PREMIUM: boolean;
    __tcfapi?: any;
  }
}