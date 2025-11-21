import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Crown, Clock, AlertTriangle, User, Mail, Calendar, CreditCard, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { SubscriptionStatus } from "@/components/SubscriptionStatus";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function Account() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCanceling, setIsCanceling] = useState(false);

  // Get subscription status
  const { data: subscriptionData, isLoading } = useQuery({
    queryKey: ['/api/subscription/status'],
    enabled: !!user,
  });

  // Cancel subscription mutation
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("/api/subscription/cancel", {
        method: "POST"
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Suscripción Cancelada",
        description: "Tu suscripción ha sido cancelada exitosamente. Mantendrás acceso premium hasta el final del período actual.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/subscription/status'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo cancelar la suscripción",
        variant: "destructive",
      });
    },
  });

  const handleCancelSubscription = async () => {
    setIsCanceling(true);
    try {
      await cancelSubscriptionMutation.mutateAsync();
    } finally {
      setIsCanceling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <section className="seccion">
          <img src="/logo.PNG" alt="TheCookFlow - Gestión de cuenta y suscripción" className="logo" />
          <div className="glass-container max-w-2xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-chalk/20 rounded w-1/3 mx-auto"></div>
              <div className="h-32 bg-chalk/20 rounded"></div>
              <div className="h-48 bg-chalk/20 rounded"></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const isPremium = subscriptionData?.subscriptionStatus === 'active';
  const isTrialActive = subscriptionData?.isTrialActive;
  
  return (
    <div className="min-h-screen">
      <section className="seccion">
        <img src="/logo.PNG" alt="TheCookFlow - Gestión de cuenta y suscripción" className="logo" />
        
        <h1 className="text-chalk-white mb-4 text-5xl">
          Mi Cuenta
        </h1>
        
        <p className="text-xl text-chalk mb-8 max-w-3xl mx-auto leading-relaxed">
          Gestiona tu perfil y suscripción premium
        </p>

        <div className="max-w-2xl mx-auto space-y-8">
          {/* User Profile */}
          <div className="glass-container">
            <h3 className="text-2xl text-chalk-white mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-chalk-green" />
              Información Personal
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3 text-chalk-green" />
                  <div>
                    <p className="font-medium text-chalk-white">{user?.email}</p>
                    <p className="text-sm text-chalk">Email</p>
                  </div>
                </div>
              </div>

              {(user?.firstName || user?.lastName) && (
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-3 text-chalk-green" />
                  <div>
                    <p className="font-medium text-chalk-white">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-chalk">Nombre completo</p>
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-3 text-chalk-green" />
                <div>
                  <p className="font-medium text-chalk-white">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'No disponible'}
                  </p>
                  <p className="text-sm text-chalk">Miembro desde</p>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Switcher */}
          <div className="glass-container">
            <ThemeSwitcher />
          </div>

          {/* Subscription Status */}
          <SubscriptionStatus
            subscriptionStatus={subscriptionData?.subscriptionStatus}
            trialEndsAt={subscriptionData?.trialEndsAt}
            subscriptionEndsAt={subscriptionData?.subscriptionEndsAt}
            limits={subscriptionData?.limits}
          />

          {/* Back to Dashboard */}
          <div className="text-center">
            <Link href="/dashboard">
              <button className="btn-primary-chalk">
                Volver al Panel
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}