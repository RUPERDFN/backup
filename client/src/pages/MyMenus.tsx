import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Calendar, 
  Clock, 
  Users, 
  ChefHat, 
  ShoppingCart, 
  Utensils,
  ArrowLeft,
  Eye,
  Trash2,
  Plus,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface MenuPlan {
  id: string;
  name: string;
  weekStartDate: string;
  preferences: {
    budget: number;
    servings: number;
    daysToGenerate: number;
    mealsPerDay: number;
    dietaryRestrictions: string[];
    allergies: string[];
  };
  createdAt: string;
  recipeCount?: number;
}

export default function MyMenus() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Load user's menu plans using React Query
  const { data: menuPlans = [], isLoading } = useQuery({
    queryKey: ['/api/menu-plans'],
    enabled: !!user,
  });

  const deleteMenuMutation = useMutation({
    mutationFn: async (planId: string) => {
      await apiRequest(`/api/menu-plans/${planId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu-plans'] });
      toast({
        title: "Menú eliminado",
        description: "El menú se ha eliminado correctamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el menú. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const deleteMenuPlan = async (planId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este menú? Esta acción no se puede deshacer.')) {
      return;
    }
    deleteMenuMutation.mutate(planId);
  };

  const viewMenuPlan = (planId: string) => {
    // Store the plan ID and navigate to the menu viewer
    localStorage.setItem('viewingMenuPlanId', planId);
    setLocation('/menu-generated');
  };

  const filteredMenus = menuPlans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(plan.createdAt).toLocaleDateString('es-ES').includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDietaryRestrictionsText = (restrictions: string[]) => {
    if (!restrictions || restrictions.length === 0 || restrictions.includes('normal')) {
      return 'Sin restricciones';
    }
    return restrictions.join(', ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-green via-black to-dark-green pt-20 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation('/dashboard')}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-chalk" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-chalk-white mb-2">
                Mis Menús Generados
              </h1>
              <p className="text-chalk">
                Revisa el historial de todos tus menús semanales personalizados
              </p>
            </div>
          </div>
          
          <Button
            onClick={() => setLocation('/questionnaire')}
            className="bg-chalk-green text-black hover:bg-chalk-green/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Nuevo Menú
          </Button>
        </div>

        {/* Search */}
        <div className="glass-container mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-chalk/60" />
            <Input
              type="text"
              placeholder="Buscar menús por nombre o fecha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-chalk-green/30 text-chalk-white placeholder-chalk/60"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="glass-container text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-chalk-green border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-chalk">Cargando tus menús...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredMenus.length === 0 && (
          <div className="glass-container text-center py-12">
            <ChefHat className="w-16 h-16 text-chalk-green mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-chalk-white mb-2">
              {searchTerm ? 'No se encontraron menús' : 'Aún no tienes menús generados'}
            </h3>
            <p className="text-chalk mb-6">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda'
                : 'Crea tu primer menú personalizado respondiendo nuestro cuestionario'
              }
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setLocation('/questionnaire')}
                className="bg-chalk-green text-black hover:bg-chalk-green/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Mi Primer Menú
              </Button>
            )}
          </div>
        )}

        {/* Menu Plans Grid */}
        {!isLoading && filteredMenus.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenus.map((plan) => (
              <div key={plan.id} className="glass-container hover:bg-white/10 transition-all duration-300">
                <div className="p-6">
                  {/* Menu Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-chalk-white mb-1">
                        {plan.name}
                      </h3>
                      <p className="text-chalk/70 text-sm">
                        Creado el {formatDate(plan.createdAt)}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => viewMenuPlan(plan.id)}
                        className="p-2 rounded bg-chalk-green/20 hover:bg-chalk-green/30 transition-colors"
                        title="Ver menú"
                      >
                        <Eye className="w-4 h-4 text-chalk-green" />
                      </button>
                      <button
                        onClick={() => deleteMenuPlan(plan.id)}
                        className="p-2 rounded bg-red-500/20 hover:bg-red-500/30 transition-colors"
                        title="Eliminar menú"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>

                  {/* Menu Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-chalk">
                        <Calendar className="w-4 h-4" />
                        <span>Duración:</span>
                      </div>
                      <span className="text-chalk-white font-medium">
                        {plan.preferences?.daysToGenerate || 'N/A'} días
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-chalk">
                        <Utensils className="w-4 h-4" />
                        <span>Comidas por día:</span>
                      </div>
                      <span className="text-chalk-white font-medium">
                        {plan.preferences?.mealsPerDay || 'N/A'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-chalk">
                        <Users className="w-4 h-4" />
                        <span>Raciones:</span>
                      </div>
                      <span className="text-chalk-white font-medium">
                        {plan.preferences?.servings || 'N/A'} personas
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-chalk">
                        <span>💰</span>
                        <span>Presupuesto:</span>
                      </div>
                      <span className="text-chalk-white font-medium">
                        €{plan.preferences?.budget || 'N/A'}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-chalk-green/20">
                      <div className="text-sm">
                        <span className="text-chalk">Dieta:</span>
                        <span className="text-chalk-white font-medium ml-2">
                          {getDietaryRestrictionsText(plan.preferences?.dietaryRestrictions)}
                        </span>
                      </div>
                      {plan.preferences?.allergies && plan.preferences.allergies.length > 0 && 
                       !plan.preferences.allergies.includes('ninguna') && (
                        <div className="text-sm mt-1">
                          <span className="text-chalk">Alergias:</span>
                          <span className="text-chalk-white font-medium ml-2">
                            {plan.preferences.allergies.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 pt-4 border-t border-chalk-green/20">
                    <Button
                      onClick={() => viewMenuPlan(plan.id)}
                      className="w-full bg-chalk-green/20 hover:bg-chalk-green/30 text-chalk-green border border-chalk-green/30"
                      variant="outline"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Menú Completo
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics */}
        {!isLoading && menuPlans.length > 0 && (
          <div className="glass-container mt-8">
            <h3 className="text-xl font-semibold text-chalk-white mb-4">Estadísticas</h3>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-chalk-green">{menuPlans.length}</div>
                <div className="text-chalk text-sm">Menús Generados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-chalk-green">
                  {menuPlans.reduce((sum, plan) => sum + (plan.preferences?.daysToGenerate || 0), 0)}
                </div>
                <div className="text-chalk text-sm">Días Planificados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-chalk-green">
                  {menuPlans.reduce((sum, plan) => sum + ((plan.preferences?.daysToGenerate || 0) * (plan.preferences?.mealsPerDay || 0)), 0)}
                </div>
                <div className="text-chalk text-sm">Comidas Totales</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-chalk-green">
                  €{menuPlans.reduce((sum, plan) => sum + (plan.preferences?.budget || 0), 0)}
                </div>
                <div className="text-chalk text-sm">Presupuesto Total</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}