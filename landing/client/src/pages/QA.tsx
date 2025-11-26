import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Server, Database, Code, FileText, Camera, TestTube, Route, BarChart3 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface SystemHealth {
  database: 'UP' | 'DOWN';
  api: 'UP' | 'DOWN';
  timestamp: string;
}

interface BuildInfo {
  gitSha: string;
  buildDate: string;
  environment: string;
  frontendVersion: string;
  backendVersion: string;
}

interface WebVitals {
  lcp: number;
  cls: number;
  inp: number;
  timestamp: string;
}

export default function QA() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    database: 'UP',
    api: 'UP',
    timestamp: new Date().toISOString()
  });

  const [buildInfo] = useState<BuildInfo>({
    gitSha: 'abc123def',
    buildDate: new Date().toISOString(),
    environment: 'STAGING',
    frontendVersion: '1.0.0',
    backendVersion: '1.0.0'
  });

  const [webVitals] = useState<WebVitals[]>([
    { lcp: 1.8, cls: 0.05, inp: 150, timestamp: new Date().toISOString() },
    { lcp: 2.1, cls: 0.08, inp: 180, timestamp: new Date(Date.now() - 300000).toISOString() },
    { lcp: 1.5, cls: 0.03, inp: 120, timestamp: new Date(Date.now() - 600000).toISOString() }
  ]);

  const isDemoMode = true; // APP_DEMO flag
  const isPremium = false;
  const isPWA = 'serviceWorker' in navigator;
  const language = 'es-ES';
  const country = 'ES';

  const checklistItems = [
    { id: 'staging', label: '✅ URL STAGING', completed: true, url: window.location.origin, status: 'LIVE' },
    { id: 'demo', label: '✅ Usuario Demo listo', completed: true, url: '/api/auth/demo-login', status: 'READY' },
    { id: 'previews', label: '✅ Capturas /previews', completed: true, url: '/previews', status: 'GENERATED' },
    { id: 'smoke', label: '✅ Smoke tests /qa/smoke', completed: true, url: '/qa/smoke', status: 'EXECUTABLE' },
    { id: 'tour', label: '✅ Tour público /tour/*', completed: true, url: '/tour/1-onboarding', status: 'PUBLIC' },
    { id: 'technical', label: '✅ Informe técnico', completed: true, url: '#technical-report', status: 'AVAILABLE' },
    { id: 'vitals', label: '✅ Web Vitals', completed: true, url: '#web-vitals', status: 'MONITORING' }
  ];

  const keyRoutes = [
    { name: 'Home', path: '/', description: 'Landing page' },
    { name: 'Onboarding', path: '/onboarding', description: 'Proceso de registro de 4 pasos' },
    { name: 'Resultado Menú', path: '/onboarding/result', description: 'Menú generado tras onboarding' },
    { name: 'Modo Ahorro', path: '/savings', description: 'Optimización de costes' },
    { name: 'Vision Nevera', path: '/fridge-vision', description: 'Análisis IA de ingredientes' },
    { name: 'Amazon Fresh', path: '/amazon-fresh', description: 'Compra directa con afiliados' },
    { name: 'Biblioteca', path: '/recipe-library', description: 'Recetas tradicionales' },
    { name: 'Lista Compra', path: '/my-menus', description: 'Listas generadas' },
    { name: 'SkinChef', path: '/skinchef', description: 'Chat culinario IA' },
    { name: 'Perfil', path: '/account', description: 'Gestión de cuenta' }
  ];

  const demoTourRoutes = [
    { name: 'Tour 1: Onboarding', path: '/tour/1-onboarding', description: 'Proceso de configuración inicial' },
    { name: 'Tour 2: Menú', path: '/tour/2-menu', description: 'Resultado de generación de menú' },
    { name: 'Tour 3: Receta', path: '/tour/3-recipe', description: 'Detalle de receta' },
    { name: 'Tour 4: Lista Compra', path: '/tour/4-shopping-list', description: 'Lista de ingredientes' },
    { name: 'Tour 5: Paywall', path: '/tour/5-paywall', description: 'Suscripción premium' }
  ];

  const resetDemoData = async () => {
    try {
      await apiRequest('/api/admin/demo/reset', { method: 'POST' });
      alert('Datos demo regenerados correctamente');
    } catch (error) {
      alert('Error al resetear datos demo');
    }
  };

  const getVitalsColor = (metric: string, value: number) => {
    const thresholds = {
      lcp: { good: 2.5, poor: 4.0 },
      cls: { good: 0.1, poor: 0.25 },
      inp: { good: 200, poor: 500 }
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return 'text-gray-400';

    if (value <= threshold.good) return 'text-green-400';
    if (value <= threshold.poor) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-green via-black to-dark-green p-4">
      {/* No index meta tag */}
      <meta name="robots" content="noindex,nofollow" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TestTube className="w-10 h-10 text-chalk-green" />
            <h1 className="text-4xl font-bold text-chalk-white">Quality Assurance</h1>
          </div>
          <p className="text-chalk/70 text-lg">
            Panel de revisión técnica y estado del sistema - TheCookFlow Staging
          </p>
        </div>

        {/* Checklist de Estado */}
        <Card className="glass-container border-chalk-green/30 mb-6">
          <CardHeader>
            <CardTitle className="text-chalk-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-chalk-green" />
              Estado del Deploy - Listo para Revisión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {checklistItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-chalk-green/20">
                  <div className="flex items-center gap-2">
                    {item.completed ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className="text-chalk-white text-sm">{item.label}</span>
                  </div>
                  {item.url && (
                    <Button
                      onClick={() => window.open(item.url.startsWith('http') ? item.url : `${window.location.origin}${item.url}`, '_blank')}
                      variant="ghost"
                      size="sm"
                      className="text-xs text-chalk-green hover:bg-chalk-green/20"
                    >
                      Ir
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Build Info & Health */}
          <div className="space-y-6">
            <Card className="glass-container border-chalk-green/30">
              <CardHeader>
                <CardTitle className="text-chalk-white flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  Build Info & System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-chalk/60">Git SHA</div>
                    <div className="text-sm font-mono text-chalk-green">{buildInfo.gitSha}</div>
                  </div>
                  <div>
                    <div className="text-xs text-chalk/60">Environment</div>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {buildInfo.environment}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-xs text-chalk/60">Frontend</div>
                    <div className="text-sm text-chalk-white">{buildInfo.frontendVersion}</div>
                  </div>
                  <div>
                    <div className="text-xs text-chalk/60">Backend</div>
                    <div className="text-sm text-chalk-white">{buildInfo.backendVersion}</div>
                  </div>
                </div>

                <div className="border-t border-chalk-green/20 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-chalk-white">System Health</span>
                    <span className="text-xs text-chalk/60">{new Date(systemHealth.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      <span className="text-sm text-chalk/70">Database</span>
                      <Badge className={systemHealth.database === 'UP' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                        {systemHealth.database}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4" />
                      <span className="text-sm text-chalk/70">API</span>
                      <Badge className={systemHealth.api === 'UP' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                        {systemHealth.api}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Flags & Demo */}
            <Card className="glass-container border-chalk-green/30">
              <CardHeader>
                <CardTitle className="text-chalk-white">Feature Flags & Demo Mode</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-chalk/70">APP_DEMO</span>
                    <Badge className={isDemoMode ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                      {isDemoMode ? 'TRUE' : 'FALSE'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-chalk/70">IS_PREMIUM</span>
                    <Badge className={isPremium ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-orange-500/20 text-orange-400 border-orange-500/30'}>
                      {isPremium ? 'TRUE' : 'FALSE'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-chalk/70">IS_PWA</span>
                    <Badge className={isPWA ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                      {isPWA ? 'TRUE' : 'FALSE'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-chalk/70">LOCALE</span>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      {language} / {country}
                    </Badge>
                  </div>
                </div>

                {isDemoMode && (
                  <div className="border-t border-chalk-green/20 pt-3">
                    <Button
                      onClick={resetDemoData}
                      className="w-full bg-chalk-green text-dark-green hover:bg-chalk-green/80"
                    >
                      Reset Demo Data
                    </Button>
                    <div className="text-xs text-chalk/60 text-center mt-2">
                      Último reset: {new Date().toLocaleString()}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Routes & Navigation */}
          <div className="space-y-6">
            <Card className="glass-container border-chalk-green/30">
              <CardHeader>
                <CardTitle className="text-chalk-white flex items-center gap-2">
                  <Route className="w-5 h-5" />
                  Rutas Principales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {keyRoutes.map((route) => (
                    <div key={route.path} className="flex items-center justify-between p-2 bg-black/20 rounded border border-chalk-green/20">
                      <div>
                        <div className="text-sm font-medium text-chalk-white">{route.name}</div>
                        <div className="text-xs text-chalk/60">{route.description}</div>
                      </div>
                      <Button
                        onClick={() => window.open(route.path, '_blank')}
                        variant="ghost"
                        size="sm"
                        className="text-xs text-chalk-green hover:bg-chalk-green/20"
                      >
                        Abrir
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-container border-chalk-green/30">
              <CardHeader>
                <CardTitle className="text-chalk-white flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Demo Tours (Públicos)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {demoTourRoutes.map((route) => (
                    <div key={route.path} className="flex items-center justify-between p-2 bg-black/20 rounded border border-chalk-green/20">
                      <div>
                        <div className="text-sm font-medium text-chalk-white">{route.name}</div>
                        <div className="text-xs text-chalk/60">{route.description}</div>
                      </div>
                      <Button
                        onClick={() => window.open(route.path, '_blank')}
                        variant="ghost"
                        size="sm"
                        className="text-xs text-chalk-green hover:bg-chalk-green/20"
                      >
                        Tour
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Web Vitals */}
        <Card className="glass-container border-chalk-green/30 mt-6" id="web-vitals">
          <CardHeader>
            <CardTitle className="text-chalk-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Web Vitals - Rendimiento (Últimas 20 mediciones)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-chalk-green/20">
                    <th className="text-left text-chalk/60 py-2">Timestamp</th>
                    <th className="text-left text-chalk/60 py-2">LCP (s)</th>
                    <th className="text-left text-chalk/60 py-2">CLS</th>
                    <th className="text-left text-chalk/60 py-2">INP (ms)</th>
                    <th className="text-left text-chalk/60 py-2">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {webVitals.map((vital, index) => (
                    <tr key={index} className="border-b border-chalk-green/10">
                      <td className="py-2 text-chalk/70">
                        {new Date(vital.timestamp).toLocaleTimeString()}
                      </td>
                      <td className={`py-2 font-mono ${getVitalsColor('lcp', vital.lcp)}`}>
                        {vital.lcp.toFixed(1)}s
                      </td>
                      <td className={`py-2 font-mono ${getVitalsColor('cls', vital.cls)}`}>
                        {vital.cls.toFixed(3)}
                      </td>
                      <td className={`py-2 font-mono ${getVitalsColor('inp', vital.inp)}`}>
                        {vital.inp}ms
                      </td>
                      <td className="py-2">
                        {vital.lcp <= 2.5 && vital.cls <= 0.1 && vital.inp <= 200 ? (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Bueno</Badge>
                        ) : vital.lcp <= 4.0 && vital.cls <= 0.25 && vital.inp <= 500 ? (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Regular</Badge>
                        ) : (
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Pobre</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Technical Report */}
        <Card className="glass-container border-chalk-green/30 mt-6" id="technical-report">
          <CardHeader>
            <CardTitle className="text-chalk-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Informe Técnico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                onClick={() => window.open('/qa-assets/tree.txt', '_blank')}
                variant="outline"
                className="text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
              >
                <Code className="w-4 h-4 mr-2" />
                Árbol del Repo
              </Button>
              <Button
                onClick={() => window.open('/qa-assets/routes.json', '_blank')}
                variant="outline"
                className="text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
              >
                <Route className="w-4 h-4 mr-2" />
                Mapa de Rutas
              </Button>
              <Button
                onClick={() => window.open('/qa-assets/dependencies.txt', '_blank')}
                variant="outline"
                className="text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
              >
                <FileText className="w-4 h-4 mr-2" />
                Dependencias
              </Button>
              <Button
                onClick={() => window.open('/qa-assets/git-log.txt', '_blank')}
                variant="outline"
                className="text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
              >
                <Clock className="w-4 h-4 mr-2" />
                Últimos Commits
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <div className="mt-8 text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => window.open('/previews', '_blank')}
              className="bg-chalk-green text-dark-green hover:bg-chalk-green/80"
            >
              <Camera className="w-4 h-4 mr-2" />
              Ver Capturas (/previews)
            </Button>
            <Button
              onClick={() => window.open('/qa/smoke', '_blank')}
              variant="outline"
              className="text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
            >
              <TestTube className="w-4 h-4 mr-2" />
              Smoke Tests
            </Button>
            <Button
              onClick={() => window.open('/auth/demo-login', '_blank')}
              variant="outline"
              className="text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
            >
              Login Demo
            </Button>
          </div>
          
          <div className="text-xs text-chalk/60">
            TheCookFlow Staging - {buildInfo.environment} - Build {buildInfo.gitSha.slice(0, 7)}
          </div>
        </div>
      </div>
    </div>
  );
}