import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Lock, CheckCircle, ArrowRight, TestTube } from 'lucide-react';

export default function DemoLogin() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const demoCredentials = {
    email: 'demo@thecookflow.com',
    password: 'Demo1234!',
    userId: 'demo-user-001'
  };

  const handleMagicLogin = async () => {
    setIsLoggingIn(true);
    
    // Simulate login process
    setTimeout(() => {
      // In a real implementation, this would set the session
      localStorage.setItem('demo-session', JSON.stringify({
        user: demoCredentials,
        timestamp: Date.now(),
        expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      }));
      
      // Redirect to home
      window.location.href = '/';
    }, 2000);
  };

  const seedData = {
    menuPlan: {
      days: 7,
      recipes: 21,
      lastGenerated: new Date().toISOString()
    },
    recipes: {
      saved: 6,
      categories: ['Española', 'Mediterránea', 'Internacional']
    },
    shoppingList: {
      items: 24,
      categories: 8,
      estimatedCost: 67.50
    },
    preferences: {
      servings: 2,
      budget: 'moderate',
      diet: 'omnívoro',
      cookingTime: 'normal'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-green via-black to-dark-green p-4">
      <meta name="robots" content="noindex,nofollow" />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TestTube className="w-10 h-10 text-chalk-green" />
            <h1 className="text-4xl font-bold text-chalk-white">Demo Login</h1>
          </div>
          <p className="text-chalk/70 text-lg">
            Acceso rápido con datos de demostración para revisión
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Magic Login */}
          <Card className="glass-container border-chalk-green/30">
            <CardHeader>
              <CardTitle className="text-chalk-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Acceso Directo (Magic Link)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-chalk-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-chalk-green" />
                </div>
                <h3 className="text-xl font-bold text-chalk-white mb-2">Usuario Demo</h3>
                <p className="text-chalk/60 mb-4">
                  Accede instantáneamente con datos de ejemplo
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-chalk/70">Plan semanal generado</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-chalk/70">6 recetas guardadas</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-chalk/70">Lista de compra activa</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-chalk/70">Preferencias configuradas</span>
                </div>
              </div>

              <Button
                onClick={handleMagicLogin}
                disabled={isLoggingIn}
                className="w-full bg-chalk-green text-dark-green hover:bg-chalk-green/80 py-6 text-lg"
              >
                {isLoggingIn ? (
                  <>
                    <Lock className="w-5 h-5 mr-2 animate-pulse" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Entrar como Demo
                  </>
                )}
              </Button>

              <div className="text-center">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Sin contraseña requerida
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Manual Credentials */}
          <Card className="glass-container border-chalk-green/30">
            <CardHeader>
              <CardTitle className="text-chalk-white flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Credenciales Manuales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-chalk/60 mb-4">
                Para testing manual o integración con herramientas externas:
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-black/20 rounded-lg border border-chalk-green/20">
                  <div className="text-xs text-chalk/60 mb-1">Email:</div>
                  <div className="font-mono text-chalk-white">{demoCredentials.email}</div>
                </div>
                
                <div className="p-3 bg-black/20 rounded-lg border border-chalk-green/20">
                  <div className="text-xs text-chalk/60 mb-1">Password:</div>
                  <div className="font-mono text-chalk-white">{demoCredentials.password}</div>
                </div>
                
                <div className="p-3 bg-black/20 rounded-lg border border-chalk-green/20">
                  <div className="text-xs text-chalk/60 mb-1">User ID:</div>
                  <div className="font-mono text-chalk-white">{demoCredentials.userId}</div>
                </div>
              </div>

              <Button
                onClick={() => {
                  const credentials = `Email: ${demoCredentials.email}\nPassword: ${demoCredentials.password}\nUser ID: ${demoCredentials.userId}`;
                  navigator.clipboard.writeText(credentials);
                  alert('Credenciales copiadas al portapapeles');
                }}
                variant="outline"
                className="w-full text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
              >
                Copiar Credenciales
              </Button>

              <Button
                onClick={() => window.open('/login', '_blank')}
                variant="outline"
                className="w-full text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
              >
                Ir a Login Manual
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Seed Data Info */}
        <Card className="glass-container border-chalk-green/30 mt-6">
          <CardHeader>
            <CardTitle className="text-chalk-white">Datos de Ejemplo Incluidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-black/20 rounded-lg border border-chalk-green/20">
                <div className="text-2xl font-bold text-chalk-green">{seedData.menuPlan.days}</div>
                <div className="text-chalk/60 text-sm">días de menús</div>
                <div className="text-xs text-chalk/40 mt-1">{seedData.menuPlan.recipes} recetas</div>
              </div>
              
              <div className="text-center p-4 bg-black/20 rounded-lg border border-chalk-green/20">
                <div className="text-2xl font-bold text-chalk-green">{seedData.recipes.saved}</div>
                <div className="text-chalk/60 text-sm">recetas guardadas</div>
                <div className="text-xs text-chalk/40 mt-1">{seedData.recipes.categories.length} categorías</div>
              </div>
              
              <div className="text-center p-4 bg-black/20 rounded-lg border border-chalk-green/20">
                <div className="text-2xl font-bold text-chalk-green">{seedData.shoppingList.items}</div>
                <div className="text-chalk/60 text-sm">items en lista</div>
                <div className="text-xs text-chalk/40 mt-1">€{seedData.shoppingList.estimatedCost}</div>
              </div>
              
              <div className="text-center p-4 bg-black/20 rounded-lg border border-chalk-green/20">
                <div className="text-2xl font-bold text-chalk-green">{seedData.preferences.servings}</div>
                <div className="text-chalk/60 text-sm">personas</div>
                <div className="text-xs text-chalk/40 mt-1">{seedData.preferences.diet}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="glass-container border-yellow-500/30 mt-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <TestTube className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-400 mb-1">Entorno de Demo</h3>
                <p className="text-sm text-chalk/70">
                  Este es un entorno de staging con datos ficticios. No se envían emails reales, 
                  no hay transacciones monetarias y los datos se resetean periódicamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Navigation */}
        <div className="mt-8 text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => window.open('/qa', '_blank')}
              variant="outline"
              className="text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
            >
              ← Volver a QA
            </Button>
            <Button
              onClick={() => window.open('/tour/2-menu', '_blank')}
              variant="outline"
              className="text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
            >
              Ver Demo Tour
            </Button>
          </div>
          
          <div className="text-xs text-chalk/60">
            Demo credentials válidas por 24 horas • Datos se resetean automáticamente
          </div>
        </div>
      </div>
    </div>
  );
}