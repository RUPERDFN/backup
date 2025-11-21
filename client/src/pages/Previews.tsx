import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Download, ExternalLink, Eye, Smartphone, Monitor } from 'lucide-react';

interface Screenshot {
  id: string;
  name: string;
  description: string;
  filename: string;
  format: '9:20' | '16:9' | '1:1';
  width: number;
  height: number;
  category: 'mobile' | 'banner' | 'icon';
  useCase: string;
}

export default function Previews() {
  const screenshots: Screenshot[] = [
    {
      id: 'home',
      name: 'Home / Landing',
      description: 'Página principal con onboarding inteligente',
      filename: 'home-1080x2400.png',
      format: '9:20',
      width: 1080,
      height: 2400,
      category: 'mobile',
      useCase: 'Play Store screenshot #1'
    },
    {
      id: 'onboarding',
      name: 'Onboarding',
      description: 'Proceso de configuración de 4 pasos',
      filename: 'onboarding-1080x2400.png',
      format: '9:20',
      width: 1080,
      height: 2400,
      category: 'mobile',
      useCase: 'Play Store screenshot #2'
    },
    {
      id: 'menu-result',
      name: 'Resultado Menú',
      description: 'Menú semanal generado con IA',
      filename: 'menu-result-1080x2400.png',
      format: '9:20',
      width: 1080,
      height: 2400,
      category: 'mobile',
      useCase: 'Play Store screenshot #3'
    },
    {
      id: 'recipe-detail',
      name: 'Detalle Receta',
      description: 'Vista completa de receta con ingredientes',
      filename: 'recipe-detail-1080x2400.png',
      format: '9:20',
      width: 1080,
      height: 2400,
      category: 'mobile',
      useCase: 'Play Store screenshot #4'
    },
    {
      id: 'shopping-list',
      name: 'Lista Compra',
      description: 'Lista organizada por categorías',
      filename: 'shopping-list-1080x2400.png',
      format: '9:20',
      width: 1080,
      height: 2400,
      category: 'mobile',
      useCase: 'Play Store screenshot #5'
    },
    {
      id: 'paywall',
      name: 'Paywall',
      description: 'Suscripción premium con beneficios',
      filename: 'paywall-1080x2400.png',
      format: '9:20',
      width: 1080,
      height: 2400,
      category: 'mobile',
      useCase: 'Play Store screenshot #6'
    },
    {
      id: 'banner',
      name: 'Banner Hero',
      description: 'Banner principal para landing page',
      filename: 'banner-hero-1024x500.png',
      format: '16:9',
      width: 1024,
      height: 500,
      category: 'banner',
      useCase: 'Web marketing banner'
    },
    {
      id: 'icon',
      name: 'App Icon',
      description: 'Icono de aplicación high-res',
      filename: 'app-icon-512x512.png',
      format: '1:1',
      width: 512,
      height: 512,
      category: 'icon',
      useCase: 'Play Store app icon'
    }
  ];

  const getFormatColor = (format: string) => {
    switch (format) {
      case '9:20': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case '16:9': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case '1:1': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'banner': return <Monitor className="w-4 h-4" />;
      case 'icon': return <Camera className="w-4 h-4" />;
      default: return <Camera className="w-4 h-4" />;
    }
  };

  const openFullscreen = (screenshot: Screenshot) => {
    // Open screenshot in new tab for full viewing
    window.open(`/previews/images/${screenshot.filename}`, '_blank');
  };

  const downloadScreenshot = (screenshot: Screenshot) => {
    // Trigger download
    const link = document.createElement('a');
    link.href = `/previews/images/${screenshot.filename}`;
    link.download = screenshot.filename;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-green via-black to-dark-green p-4">
      <meta name="robots" content="noindex,nofollow" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Camera className="w-10 h-10 text-chalk-green" />
            <h1 className="text-4xl font-bold text-chalk-white">Capturas & Assets</h1>
          </div>
          <p className="text-chalk/70 text-lg">
            Galería de capturas de pantalla y assets para Play Store y marketing
          </p>
        </div>

        {/* Summary Stats */}
        <Card className="glass-container border-chalk-green/30 mb-6">
          <CardContent className="p-4">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-black/20 rounded-lg border border-chalk-green/20">
                <div className="text-xl font-bold text-chalk-green">
                  {screenshots.filter(s => s.category === 'mobile').length}
                </div>
                <div className="text-chalk/60 text-sm">Móvil (9:20)</div>
              </div>
              <div className="text-center p-3 bg-black/20 rounded-lg border border-chalk-green/20">
                <div className="text-xl font-bold text-chalk-green">
                  {screenshots.filter(s => s.category === 'banner').length}
                </div>
                <div className="text-chalk/60 text-sm">Banners</div>
              </div>
              <div className="text-center p-3 bg-black/20 rounded-lg border border-chalk-green/20">
                <div className="text-xl font-bold text-chalk-green">
                  {screenshots.filter(s => s.category === 'icon').length}
                </div>
                <div className="text-chalk/60 text-sm">Iconos</div>
              </div>
              <div className="text-center p-3 bg-black/20 rounded-lg border border-chalk-green/20">
                <div className="text-xl font-bold text-chalk-green">{screenshots.length}</div>
                <div className="text-chalk/60 text-sm">Total Assets</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Screenshots (Play Store) */}
        <Card className="glass-container border-chalk-green/30 mb-6">
          <CardHeader>
            <CardTitle className="text-chalk-white flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Screenshots Móvil (Play Store) - 1080x2400
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {screenshots.filter(s => s.category === 'mobile').map((screenshot) => (
                <div key={screenshot.id} className="bg-black/20 rounded-lg border border-chalk-green/20 overflow-hidden">
                  <div className="aspect-[9/20] bg-gradient-to-br from-chalk-green/10 to-chalk-green/5 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-chalk-green/50 mx-auto mb-2" />
                      <div className="text-sm text-chalk/60">{screenshot.name}</div>
                      <div className="text-xs text-chalk/40">{screenshot.width}x{screenshot.height}</div>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-chalk-white text-sm">{screenshot.name}</h3>
                      <Badge className={`${getFormatColor(screenshot.format)} border text-xs`}>
                        {screenshot.format}
                      </Badge>
                    </div>
                    <p className="text-xs text-chalk/60 mb-3">{screenshot.description}</p>
                    <div className="text-xs text-chalk-green mb-3">{screenshot.useCase}</div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => openFullscreen(screenshot)}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Ver
                      </Button>
                      <Button
                        onClick={() => downloadScreenshot(screenshot)}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Descargar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Banners & Icons */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Banners */}
          <Card className="glass-container border-chalk-green/30">
            <CardHeader>
              <CardTitle className="text-chalk-white flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Banners Marketing
              </CardTitle>
            </CardHeader>
            <CardContent>
              {screenshots.filter(s => s.category === 'banner').map((screenshot) => (
                <div key={screenshot.id} className="bg-black/20 rounded-lg border border-chalk-green/20 overflow-hidden">
                  <div className="aspect-[16/9] bg-gradient-to-r from-chalk-green/10 to-chalk-green/5 flex items-center justify-center">
                    <div className="text-center">
                      <Monitor className="w-8 h-8 text-chalk-green/50 mx-auto mb-2" />
                      <div className="text-sm text-chalk/60">{screenshot.name}</div>
                      <div className="text-xs text-chalk/40">{screenshot.width}x{screenshot.height}</div>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-chalk-white">{screenshot.name}</h3>
                      <Badge className={`${getFormatColor(screenshot.format)} border text-xs`}>
                        {screenshot.format}
                      </Badge>
                    </div>
                    <p className="text-xs text-chalk/60 mb-2">{screenshot.description}</p>
                    <div className="text-xs text-chalk-green mb-3">{screenshot.useCase}</div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => openFullscreen(screenshot)}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Ver
                      </Button>
                      <Button
                        onClick={() => downloadScreenshot(screenshot)}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Descargar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Icons */}
          <Card className="glass-container border-chalk-green/30">
            <CardHeader>
              <CardTitle className="text-chalk-white flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Iconos de Aplicación
              </CardTitle>
            </CardHeader>
            <CardContent>
              {screenshots.filter(s => s.category === 'icon').map((screenshot) => (
                <div key={screenshot.id} className="bg-black/20 rounded-lg border border-chalk-green/20 overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-chalk-green/10 to-chalk-green/5 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-8 h-8 text-chalk-green/50 mx-auto mb-2" />
                      <div className="text-sm text-chalk/60">{screenshot.name}</div>
                      <div className="text-xs text-chalk/40">{screenshot.width}x{screenshot.height}</div>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-chalk-white">{screenshot.name}</h3>
                      <Badge className={`${getFormatColor(screenshot.format)} border text-xs`}>
                        {screenshot.format}
                      </Badge>
                    </div>
                    <p className="text-xs text-chalk/60 mb-2">{screenshot.description}</p>
                    <div className="text-xs text-chalk-green mb-3">{screenshot.useCase}</div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => openFullscreen(screenshot)}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Ver
                      </Button>
                      <Button
                        onClick={() => downloadScreenshot(screenshot)}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Descargar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Technical Info */}
        <Card className="glass-container border-chalk-green/30 mt-6">
          <CardHeader>
            <CardTitle className="text-chalk-white">Información Técnica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-chalk-white mb-2">Especificaciones Play Store:</h4>
                <ul className="space-y-1 text-chalk/60">
                  <li>• Screenshots: 1080x2400 (9:20 ratio)</li>
                  <li>• Máximo 8 screenshots por dispositivo</li>
                  <li>• Formato: PNG o JPEG de alta calidad</li>
                  <li>• Tamaño máximo: 8MB por imagen</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-chalk-white mb-2">Assets adicionales:</h4>
                <ul className="space-y-1 text-chalk/60">
                  <li>• Feature Graphic: 1024x500</li>
                  <li>• App Icon: 512x512</li>
                  <li>• Marketing banners: 1024x500</li>
                  <li>• Todos optimizados para web</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
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
              onClick={() => {
                const zip = screenshots.map(s => `/previews/images/${s.filename}`).join('\n');
                navigator.clipboard.writeText(zip);
                alert('URLs copiadas al portapapeles');
              }}
              className="bg-chalk-green text-dark-green hover:bg-chalk-green/80"
            >
              Copiar URLs
            </Button>
          </div>
          
          <div className="text-xs text-chalk/60">
            Generado automáticamente por Playwright • Optimizado para Play Store y Web
          </div>
        </div>
      </div>
    </div>
  );
}