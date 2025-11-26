import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <section className="seccion">
        <img src="/logo.PNG" alt="TheCookFlow - Planificador de menús con IA" className="logo" />
        
        <div className="glass-container max-w-md mx-auto text-center">
          <div className="flex justify-center mb-6">
            <AlertCircle className="h-16 w-16 text-chalk-red" />
          </div>
          
          <h1 className="text-4xl font-bold text-chalk-white mb-4">
            404
          </h1>
          
          <h2 className="text-2xl text-chalk-green mb-6">
            Página no encontrada
          </h2>

          <p className="text-chalk mb-8">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>

          <Link href="/">
            <button className="btn-primary-chalk flex items-center gap-2 mx-auto">
              <Home className="h-4 w-4" />
              Volver al Inicio
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
