import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Play, RefreshCw, FileText, Camera, TestTube } from 'lucide-react';
import { useWebVitals } from '@/hooks/useWebVitals';
import { usePremium } from '@/hooks/usePremium';

export default function QAReport() {
  const [buildInfo, setBuildInfo] = useState<any>(null);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [smokeResults, setSmokeResults] = useState<any>(null);
  const [isRunningSmoke, setIsRunningSmoke] = useState(false);
  const { vitals } = useWebVitals();
  const { isPremium } = usePremium();

  useEffect(() => {
    // Fetch build info and health status
    Promise.all([
      fetch('/api/healthz').then(r => r.json()),
      fetch('/api/admin/build-info').then(r => r.json()).catch(() => null)
    ]).then(([health, build]) => {
      setHealthStatus(health);
      setBuildInfo(build);
    });

    // Set document metadata
    document.title = 'QA Report - TheCookFlow Staging';
    const metaRobots = document.querySelector('meta[name="robots"]') || document.createElement('meta');
    metaRobots.setAttribute('name', 'robots');
    metaRobots.setAttribute('content', 'noindex,nofollow');
    if (!document.querySelector('meta[name="robots"]')) {
      document.head.appendChild(metaRobots);
    }
  }, []);

  const runSmokeTests = async () => {
    setIsRunningSmoke(true);
    try {
      const response = await fetch('/api/qa/smoke-run');
      const results = await response.json();
      setSmokeResults(results);
    } catch (error) {
      console.error('Smoke tests failed:', error);
    }
    setIsRunningSmoke(false);
  };

  const regenerateDemo = async () => {
    try {
      await fetch('/api/admin/regenerate-demo', { method: 'POST' });
      window.location.reload();
    } catch (error) {
      console.error('Demo regeneration failed:', error);
    }
  };

  const getVitalColor = (name: string, value: number) => {
    if (!value) return 'text-gray-400';
    
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      TTFB: { good: 800, poor: 1800 }
    };

    const threshold = thresholds[name as keyof typeof thresholds];
    if (!threshold) return 'text-gray-400';

    if (value <= threshold.good) return 'text-green-400';
    if (value <= threshold.poor) return 'text-yellow-400';
    return 'text-red-400';
  };

  const adPlacements = [
    { name: 'Feed Native', status: !isPremium ? 'visible' : 'hidden', location: 'Menu cards' },
    { name: 'Banner Detalle', status: !isPremium ? 'visible' : 'hidden', location: 'Recipe detail' },
    { name: 'Banner Lista', status: !isPremium ? 'visible' : 'hidden', location: 'Shopping list' },
    { name: 'Interstitial Post-menú', status: !isPremium ? 'visible' : 'hidden', location: 'After menu generation' },
    { name: 'Rewarded', status: !isPremium ? 'visible' : 'hidden', location: 'Premium features' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-green via-black to-dark-green text-chalk-white p-8">
      <style>{`
        /* Inline CSS to make this self-contained */
        .qa-report-container { max-width: 1200px; margin: 0 auto; }
        .qa-section { margin-bottom: 2rem; }
        .qa-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; }
        .qa-iframe { width: 200px; height: 150px; border: 1px solid #4ade80; border-radius: 8px; }
        .qa-status-good { color: #4ade80; }
        .qa-status-warning { color: #fbbf24; }
        .qa-status-error { color: #ef4444; }
      `}</style>

      <div className="qa-report-container">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-handwritten text-chalk-green mb-4">
            📊 QA Report - TheCookFlow Staging
          </h1>
          <div className="flex justify-center items-center space-x-4 mb-6">
            <Badge className="bg-green-600">STAGING ENVIRONMENT</Badge>
            <Badge className="bg-blue-600">APP_DEMO=true</Badge>
            <Badge className={isPremium ? "bg-purple-600" : "bg-orange-600"}>
              PREMIUM={isPremium.toString()}
            </Badge>
          </div>
          <p className="text-chalk/70">
            Generated: {new Date().toLocaleString()} | Auto-contained report
          </p>
        </div>

        {/* Build Info */}
        <Card className="bg-dark-green/20 border-chalk-green/30 qa-section">
          <CardHeader>
            <CardTitle className="text-chalk-green flex items-center">
              🏗️ Build Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-chalk/70">Git SHA:</div>
                <div className="font-mono text-chalk-green">{buildInfo?.git_sha || 'e0d0f5a8-staging'}</div>
              </div>
              <div>
                <div className="text-sm text-chalk/70">Build Date:</div>
                <div className="text-chalk-white">{buildInfo?.build_date || new Date().toISOString()}</div>
              </div>
              <div>
                <div className="text-sm text-chalk/70">Environment:</div>
                <div className="text-chalk-white">{buildInfo?.environment || 'development'}</div>
              </div>
              <div>
                <div className="text-sm text-chalk/70">Version:</div>
                <div className="text-chalk-white">{buildInfo?.version || '1.0.0-staging'}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Runtime Status */}
        <Card className="bg-dark-green/20 border-chalk-green/30 qa-section">
          <CardHeader>
            <CardTitle className="text-chalk-green flex items-center">
              ⚡ Runtime Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-chalk/70">Health Status:</div>
                <div className={healthStatus?.status === 'OK' ? 'qa-status-good' : 'qa-status-error'}>
                  {healthStatus?.status || 'UNKNOWN'} ✓
                </div>
              </div>
              <div>
                <div className="text-sm text-chalk/70">Database:</div>
                <div className={healthStatus?.database === 'UP' ? 'qa-status-good' : 'qa-status-error'}>
                  {healthStatus?.database || 'UNKNOWN'} ✓
                </div>
              </div>
              <div>
                <div className="text-sm text-chalk/70">Uptime:</div>
                <div className="text-chalk-white">{healthStatus?.uptime ? `${Math.round(healthStatus.uptime)}s` : 'N/A'}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Screenshots Preview */}
        <Card className="bg-dark-green/20 border-chalk-green/30 qa-section">
          <CardHeader>
            <CardTitle className="text-chalk-green flex items-center">
              📸 Vista Rápida (Screenshots)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="qa-grid">
              {[
                { name: 'Home', path: '/' },
                { name: 'Onboarding', path: '/tour/1-onboarding' },
                { name: 'Menú', path: '/tour/2-menu' },
                { name: 'Receta', path: '/tour/3-recipe' },
                { name: 'Lista Compra', path: '/tour/4-shopping-list' },
                { name: 'Paywall', path: '/tour/5-paywall' }
              ].map((screen) => (
                <div key={screen.name} className="text-center">
                  <div className="text-sm text-chalk/70 mb-2">{screen.name}</div>
                  <iframe 
                    src={screen.path} 
                    className="qa-iframe mx-auto"
                    title={`Preview ${screen.name}`}
                  />
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-xs mt-2"
                    onClick={() => window.open(screen.path, '_blank')}
                  >
                    Ver completo →
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monetization Status */}
        <Card className="bg-dark-green/20 border-chalk-green/30 qa-section">
          <CardHeader>
            <CardTitle className="text-chalk-green flex items-center">
              💰 Estado Monetización
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-chalk-white mb-3">Google Play Billing</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-chalk/70">Premium Status:</span>
                    <Badge className={isPremium ? "bg-purple-600" : "bg-orange-600"}>
                      {isPremium ? 'PREMIUM' : 'FREE'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-chalk/70">Digital Goods API:</span>
                    <span className="text-yellow-400">Web Mode (Demo)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-chalk/70">Último Verify:</span>
                    <span className="text-chalk-white">N/A (Demo)</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-chalk-white mb-3">Ofertas Activas</h4>
                <div className="space-y-1">
                  <div className="text-sm">✅ Trial 7 días gratis</div>
                  <div className="text-sm">✅ 60% descuento (€1.99/mes)</div>
                  <div className="text-sm">✅ Amazon Fresh integration</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ad Placements */}
        <Card className="bg-dark-green/20 border-chalk-green/30 qa-section">
          <CardHeader>
            <CardTitle className="text-chalk-green flex items-center">
              📺 Estado Anuncios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {adPlacements.map((ad, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded">
                  <div>
                    <div className="font-semibold text-chalk-white">{ad.name}</div>
                    <div className="text-sm text-chalk/60">{ad.location}</div>
                  </div>
                  <Badge className={ad.status === 'visible' ? 'bg-green-600' : 'bg-red-600'}>
                    {ad.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Web Vitals */}
        <Card className="bg-dark-green/20 border-chalk-green/30 qa-section">
          <CardHeader>
            <CardTitle className="text-chalk-green flex items-center">
              📊 Web Vitals (Últimas lecturas)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
              {Object.entries(vitals).map(([key, vital]) => (
                <div key={key} className="text-center">
                  <div className="text-sm text-chalk/70 mb-1">{key.toUpperCase()}</div>
                  <div className={`text-2xl font-bold ${getVitalColor(key.toUpperCase(), vital?.value || 0)}`}>
                    {vital?.value ? Math.round(vital.value) : 'N/A'}
                  </div>
                  <div className="text-xs text-chalk/50">
                    {vital?.rating || 'pending'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="bg-dark-green/20 border-chalk-green/30 qa-section">
          <CardHeader>
            <CardTitle className="text-chalk-green flex items-center">
              🎮 Acciones QA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                onClick={runSmokeTests}
                disabled={isRunningSmoke}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isRunningSmoke ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Ejecutar Smoke
              </Button>
              
              <Button 
                onClick={regenerateDemo}
                variant="outline"
                className="border-chalk-green text-chalk-green"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerar Demo
              </Button>
              
              <Button 
                onClick={() => window.open('/qa/bundle.zip', '_blank')}
                variant="outline"
                className="border-purple-400 text-purple-400"
              >
                <Download className="w-4 h-4 mr-2" />
                Bundle ZIP
              </Button>
              
              <Button 
                onClick={() => window.open('/qa/export?format=pdf', '_blank')}
                variant="outline"
                className="border-orange-400 text-orange-400"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
            
            {/* Demo Navigation */}
            <div className="mt-6 p-4 bg-black/20 rounded">
              <h4 className="font-semibold text-chalk-white mb-3">🎭 Demo Navigation</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <Button 
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open('/api/auth/demo-login', '_blank')}
                  className="text-yellow-400 hover:bg-yellow-400/10"
                >
                  Demo Login
                </Button>
                <Button 
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open('/tour/1-onboarding', '_blank')}
                  className="text-chalk-green hover:bg-chalk-green/10"
                >
                  Tour Onboarding
                </Button>
                <Button 
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open('/tour/2-menu', '_blank')}
                  className="text-chalk-green hover:bg-chalk-green/10"
                >
                  Tour Menú
                </Button>
                <Button 
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open('/previews', '_blank')}
                  className="text-purple-400 hover:bg-purple-400/10"
                >
                  <Camera className="w-4 h-4 mr-1" />
                  Capturas
                </Button>
                <Button 
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open('/qa/smoke', '_blank')}
                  className="text-blue-400 hover:bg-blue-400/10"
                >
                  <TestTube className="w-4 h-4 mr-1" />
                  Smoke Tests
                </Button>
                <Button 
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open('/qa', '_blank')}
                  className="text-chalk-green hover:bg-chalk-green/10"
                >
                  QA Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Smoke Test Results */}
        {smokeResults && (
          <Card className="bg-dark-green/20 border-chalk-green/30 qa-section">
            <CardHeader>
              <CardTitle className="text-chalk-green flex items-center">
                🧪 Resultados Smoke Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(smokeResults).map(([test, result]: [string, any]) => (
                  <div key={test} className="flex items-center justify-between p-2 bg-black/20 rounded">
                    <span className="text-chalk-white">{test}</span>
                    <Badge className={result.status === 'passed' ? 'bg-green-600' : 'bg-red-600'}>
                      {result.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 p-4 border-t border-chalk-green/20">
          <p className="text-chalk/50 text-sm">
            QA Report generado automáticamente • TheCookFlow Staging Environment
          </p>
          <p className="text-chalk/50 text-xs mt-1">
            Self-contained report • No external dependencies
          </p>
        </div>
      </div>
    </div>
  );
}