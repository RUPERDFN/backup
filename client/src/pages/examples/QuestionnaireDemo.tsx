import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link } from "wouter";
import { ClipboardList, User, Utensils, Clock, DollarSign, Camera, Upload } from "lucide-react";

export default function QuestionnaireDemo() {
  return (
    <div className="min-h-screen">
      <section className="seccion">
        <img src="/logo.PNG" alt="TheCookFlow" className="logo" />
        
        <h1 className="text-chalk-white mb-4 text-5xl flex items-center justify-center gap-3">
          <ClipboardList className="h-10 w-10 text-chalk-green" />
          Cuestionario de Preferencias
        </h1>
        
        <p className="text-xl text-chalk mb-8 max-w-3xl mx-auto leading-relaxed">
          Personaliza tu experiencia culinaria completando nuestro cuestionario inteligente
        </p>

        {/* Demo Form */}
        <div className="glass-container max-w-4xl mx-auto">
          <h2 className="text-2xl text-chalk-white mb-8 text-center">Vista Previa del Cuestionario</h2>
          <div className="space-y-8">
            {/* Section 1: Personal Info */}
            <div className="space-y-4">
              <h2 className="text-2xl text-chalk-white flex items-center gap-2">
                <User className="h-6 w-6 text-chalk-green" />
                Información Personal
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-chalk mb-2">Nombre</label>
                  <input
                    type="text"
                    value="Usuario Demo"
                    disabled
                    className="input-chalk opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-chalk mb-2">Nivel de Cocina</label>
                  <select disabled className="input-chalk opacity-50">
                    <option>Principiante</option>
                    <option>Intermedio</option>
                    <option>Avanzado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Dietary Preferences */}
            <div className="space-y-4">
              <h2 className="text-2xl text-chalk-white flex items-center gap-2">
                <Utensils className="h-6 w-6 text-chalk-green" />
                Preferencias Alimentarias
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Vegetariano', 'Vegano', 'Sin Gluten', 'Sin Lactosa', 'Keto', 'Mediterránea'].map((diet) => (
                  <label key={diet} className="flex items-center gap-2 text-chalk">
                    <input type="checkbox" disabled className="opacity-50" />
                    {diet}
                  </label>
                ))}
              </div>
            </div>

            {/* Section 3: Time & Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-xl text-chalk-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-chalk-green" />
                  Tiempo de Cocina
                </h2>
                <div className="space-y-2">
                  {['15-30 min', '30-45 min', '45-60 min', 'Más de 1 hora'].map((time) => (
                    <label key={time} className="flex items-center gap-2 text-chalk">
                      <input type="radio" name="time" disabled className="opacity-50" />
                      {time}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl text-chalk-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-chalk-green" />
                  Presupuesto Semanal
                </h2>
                <div className="space-y-2">
                  {['Menos de 50€', '50-100€', '100-150€', 'Más de 150€'].map((budget) => (
                    <label key={budget} className="flex items-center gap-2 text-chalk">
                      <input type="radio" name="budget" disabled className="opacity-50" />
                      {budget}
                    </label>
                  ))}
                </div>
              </div>
            </div>

              {/* Demo Notice */}
              <div className="bg-chalk-green/20 border border-chalk-green/50 rounded-lg p-6 text-center">
                <h3 className="text-xl text-chalk-white mb-2">Esta es una Vista Previa</h3>
                <p className="text-chalk mb-4">
                  Regístrate para completar tu cuestionario personalizado y acceder a todas las funciones
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/login">
                    <button className="btn-primary-chalk">
                      Iniciar Sesión
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="btn-secondary-chalk">
                      Registrarse
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
}