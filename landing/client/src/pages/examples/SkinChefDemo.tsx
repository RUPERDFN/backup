import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { ChefHat, MessageCircle, Sparkles, Heart, Coffee, Send } from "lucide-react";

export default function SkinChefDemo() {
  return (
    <div className="min-h-screen">
      <section className="seccion">
        <img src="/logo.PNG" alt="TheCookFlow" className="logo" />
        
        <h1 className="text-chalk-white mb-4 text-5xl flex items-center justify-center gap-3">
          <ChefHat className="h-10 w-10 text-chalk-green" />
          SkinChef - Asistente Culinario IA
        </h1>
        
        <p className="text-xl text-chalk mb-8 max-w-3xl mx-auto leading-relaxed">
          Tu chef personal disponible 24/7 para resolver dudas culinarias y mejorar tus habilidades en la cocina
        </p>

        {/* Chat Demo Interface */}
        <div className="glass-container max-w-4xl mx-auto mb-8">
          <div className="border-b border-chalk-green/30 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <ChefHat className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg text-chalk-white">SkinChef</h3>
                <p className="text-chalk text-sm">Asistente Culinario IA</p>
              </div>
              <div className="ml-auto">
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">En línea</span>
              </div>
            </div>
          </div>

          {/* Sample Conversation */}
          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-chalk-green/20 rounded-lg p-3 max-w-xs">
                <p className="text-chalk text-sm">¿Cómo puedo hacer una paella perfecta?</p>
              </div>
            </div>

            {/* Bot Response */}
            <div className="flex justify-start">
              <div className="bg-black/30 rounded-lg p-3 max-w-md">
                <p className="text-chalk text-sm">
                  ¡Excelente pregunta! Para una paella perfecta necesitas: arroz bomba, azafrán real, 
                  caldo casero, y la técnica del socarrat. Te guío paso a paso...
                </p>
              </div>
            </div>

            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-chalk-green/20 rounded-lg p-3 max-w-xs">
                <p className="text-chalk text-sm">¿Qué es el socarrat?</p>
              </div>
            </div>

            {/* Bot Response */}
            <div className="flex justify-start">
              <div className="bg-black/30 rounded-lg p-3 max-w-md">
                <p className="text-chalk text-sm">
                  El socarrat es la capa dorada y crujiente que se forma en el fondo de la paellera. 
                  Es la clave del sabor auténtico...
                </p>
              </div>
            </div>
          </div>

          {/* Input Area (Demo) */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Pregunta algo sobre cocina..."
              disabled
              className="input-chalk flex-1 opacity-50"
            />
            <button disabled className="btn-primary-chalk opacity-50">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
          <div className="glass-container text-center">
            <Heart className="h-8 w-8 text-chalk-red mx-auto mb-4" />
            <h3 className="text-lg text-chalk-white mb-2">Consejos Personalizados</h3>
            <p className="text-chalk text-sm">
              Recibe recomendaciones adaptadas a tus gustos y nivel de cocina
            </p>
          </div>

          <div className="glass-container text-center">
            <Coffee className="h-8 w-8 text-chalk-green mx-auto mb-4" />
            <h3 className="text-lg text-chalk-white mb-2">Disponible 24/7</h3>
            <p className="text-chalk text-sm">
              Tu chef personal siempre listo para ayudarte en cualquier momento
            </p>
          </div>

          <div className="glass-container text-center">
            <Sparkles className="h-8 w-8 text-chalk-yellow mx-auto mb-4" />
            <h3 className="text-lg text-chalk-white mb-2">IA Avanzada</h3>
            <p className="text-chalk text-sm">
              Tecnología de última generación para respuestas precisas
            </p>
          </div>

          <div className="glass-container text-center">
            <MessageCircle className="h-8 w-8 text-chalk-blue mx-auto mb-4" />
            <h3 className="text-lg text-chalk-white mb-2">Conversación Natural</h3>
            <p className="text-chalk text-sm">
              Habla como si fuera un chef profesional en tu cocina
            </p>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="glass-container max-w-4xl mx-auto text-center">
          <h3 className="text-xl text-chalk-white mb-2">Chatea con SkinChef</h3>
          <p className="text-chalk mb-4">
            Regístrate para acceder al chat completo y resolver todas tus dudas culinarias
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