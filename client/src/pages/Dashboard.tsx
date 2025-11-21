import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { 
  User, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign,
  BookOpen,
  Settings,
  ChefHat,
  Calculator,
  Edit3
} from "lucide-react";
import { Link } from "wouter";
import GooglePlayStatus from "@/components/GooglePlayStatus";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [userPreferences, setUserPreferences] = useState<any>(null);

  // Load user preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('questionnaireData');
    if (savedPreferences) {
      try {
        setUserPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Error parsing user preferences:', error);
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-chalk text-xl">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <section className="seccion">
        <img src="/logo.PNG" alt="TheCookFlow - Dashboard de gestión de menús" className="logo" />
        
        <h1 className="text-chalk-white mb-8 text-6xl">
          Mi Dashboard
        </h1>
        
        <p className="text-3xl text-chalk mb-12 max-w-4xl mx-auto leading-relaxed">
          Gestiona tu información personal y preferencias culinarias
        </p>
        
        {/* Google Play Subscription Status */}
        <div className="max-w-4xl mx-auto mb-12">
          <GooglePlayStatus compact={false} />
        </div>

        {/* User Information Card */}
        <div className="p-16 bg-transparent max-w-6xl mx-auto mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Personal Info */}
            <div>
              <h3 className="text-4xl text-chalk-white mb-8 flex items-center gap-3">
                <User className="h-10 w-10 text-chalk-green" />
                Información Personal
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-chalk text-2xl">Nombre:</span>
                  <span className="text-chalk-white font-semibold text-2xl">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-chalk text-2xl">Email:</span>
                  <span className="text-chalk-white font-semibold text-2xl">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-chalk text-2xl">Registro:</span>
                  <span className="text-chalk-white font-semibold text-2xl">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Preferences Summary */}
            <div>
              <h3 className="text-4xl text-chalk-white mb-8 flex items-center gap-3">
                <Settings className="h-10 w-10 text-chalk-green" />
                Preferencias Culinarias
              </h3>
              {userPreferences ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-chalk text-2xl">Presupuesto semanal:</span>
                    <span className="text-chalk-white font-semibold text-2xl">
                      €{userPreferences.budget}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-chalk text-2xl">Personas:</span>
                    <span className="text-chalk-white font-semibold text-2xl">
                      {userPreferences.people}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-chalk text-2xl">Días a planificar:</span>
                    <span className="text-chalk-white font-semibold text-2xl">
                      {userPreferences.days}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-chalk text-2xl">Tipo de dieta:</span>
                    <span className="text-chalk-white font-semibold text-2xl capitalize">
                      {userPreferences.diet}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-chalk text-2xl">Comidas por día:</span>
                    <span className="text-chalk-white font-semibold text-2xl">
                      {userPreferences.meals}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-chalk mb-8 text-2xl">
                    No has completado tus preferencias aún
                  </p>
                  <Link href="/questionnaire">
                    <button className="btn-primary-chalk text-2xl px-12 py-6">
                      Completar Cuestionario
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-16 bg-transparent max-w-6xl mx-auto mb-12">
          <h3 className="text-5xl text-chalk-white mb-12 text-center">
            Acciones Rápidas
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/questionnaire">
              <div className="text-center p-12 border-0 bg-transparent rounded-lg hover:bg-chalk-green/20 transition-all cursor-pointer">
                <Edit3 className="h-20 w-20 text-chalk-green mx-auto mb-6" />
                <h4 className="text-3xl text-chalk-white mb-4">Editar Preferencias</h4>
                <p className="text-chalk text-xl">
                  Actualiza tu cuestionario y preferencias culinarias
                </p>
              </div>
            </Link>

            <Link href="/generator">
              <div className="text-center p-12 border-0 bg-transparent rounded-lg hover:bg-chalk-green/20 transition-all cursor-pointer">
                <ChefHat className="h-20 w-20 text-chalk-green mx-auto mb-6" />
                <h4 className="text-3xl text-chalk-white mb-4">Generar Menú</h4>
                <p className="text-chalk text-xl">
                  Crea un nuevo menú semanal personalizado con IA
                </p>
              </div>
            </Link>


          </div>
        </div>

        {/* Detailed Preferences (if available) */}
        {userPreferences && (
          <div className="p-16 bg-transparent max-w-6xl mx-auto">
            <h3 className="text-5xl text-chalk-white mb-12 text-center">
              Detalle de Preferencias
            </h3>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h4 className="text-3xl text-chalk-green mb-8">Restricciones Alimentarias</h4>
                <div className="space-y-6">
                  <div className="flex justify-between">
                    <span className="text-chalk text-2xl">Alergias:</span>
                    <span className="text-chalk-white text-2xl">
                      {userPreferences.allergies || 'Ninguna'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-chalk text-2xl">Restricciones:</span>
                    <span className="text-chalk-white text-2xl">
                      {userPreferences.restrictions || 'Ninguna'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-3xl text-chalk-green mb-8">Comidas Favoritas</h4>
                <div className="text-chalk-white text-2xl">
                  {userPreferences.favorites || 'No especificadas'}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}