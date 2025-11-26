import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Calculator, Calendar, Utensils, Clock, Users, Sparkles, ChefHat } from "lucide-react";

export default function GeneratorDemo() {
  return (
    <div className="min-h-screen">
      <section className="seccion">
        <img src="/logo.PNG" alt="TheCookFlow" className="logo" />
        
        <h1 className="text-chalk-white mb-4 text-5xl flex items-center justify-center gap-3">
          <Calculator className="h-10 w-10 text-chalk-green" />
          Generador de Menús IA
        </h1>
        
        <p className="text-xl text-chalk mb-8 max-w-3xl mx-auto leading-relaxed">
          Crea menús semanales personalizados con inteligencia artificial en segundos
        </p>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="glass-container">
            <h3 className="text-2xl text-chalk-white mb-6 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-chalk-green" />
              Configuración del Menú
            </h3>
            <div className="space-y-6">
              {/* Time Range */}
              <div>
                <label className="block text-chalk mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Duración del Menú
                </label>
                <select disabled className="input-chalk opacity-50">
                  <option>7 días (1 semana)</option>
                  <option>14 días (2 semanas)</option>
                  <option>30 días (1 mes)</option>
                </select>
              </div>

              {/* People Count */}
              <div>
                <label className="block text-chalk mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Número de Personas
                </label>
                <input
                  type="number"
                  value="4"
                  disabled
                  className="input-chalk opacity-50"
                />
              </div>

              {/* Meal Types */}
              <div>
                <label className="block text-chalk mb-2">Comidas a Incluir</label>
                <div className="space-y-2">
                  {['Desayuno', 'Almuerzo', 'Cena', 'Snacks'].map((meal) => (
                    <div key={meal} className="flex items-center space-x-2">
                      <input type="checkbox" checked disabled className="opacity-50" />
                      <label className="text-chalk text-sm">{meal}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Preferences */}
              <div>
                <label className="block text-chalk mb-2">Estilo de Cocina</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Mediterránea', 'Asiática', 'Mexicana', 'Italiana', 'Saludable', 'Comfort Food'].map((style) => (
                    <div key={style} className="flex items-center space-x-2">
                      <input type="checkbox" disabled className="opacity-50" />
                      <label className="text-chalk text-sm">{style}</label>
                    </div>
                  ))}
                </div>
              </div>

              <button disabled className="btn-primary-chalk opacity-50 w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Generar Menú con IA
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="glass-container">
            <h3 className="text-2xl text-chalk-white mb-6 flex items-center gap-2">
              <Utensils className="h-6 w-6 text-chalk-green" />
              Vista Previa del Menú
            </h3>
            <div className="space-y-4">
              {/* Sample Menu Days */}
              {['Lunes', 'Martes', 'Miércoles'].map((day, index) => (
                <div key={day} className="bg-black/30 rounded-lg p-4 border border-chalk-green/20">
                  <h3 className="text-lg text-chalk-white mb-3">{day}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-chalk text-sm">Desayuno:</span>
                      <span className="text-chalk-green text-sm">Tostadas con aguacate</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-chalk text-sm">Almuerzo:</span>
                      <span className="text-chalk-green text-sm">Ensalada mediterránea</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-chalk text-sm">Cena:</span>
                      <span className="text-chalk-green text-sm">Pollo al horno con verduras</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="text-center text-chalk/60 text-sm pt-4">
                + 4 días más...
              </div>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="glass-container max-w-4xl mx-auto mt-8 text-center">
          <h3 className="text-xl text-chalk-white mb-2">Menús Completos Disponibles</h3>
          <p className="text-chalk mb-4">
            Inicia sesión para generar menús semanales completos con lista de compras incluida
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
      </section>
    </div>
  );
}