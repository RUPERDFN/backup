import { useTheme, type ThemeVariant } from '@/contexts/ThemeContext';
import { Palette, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

const themes: { id: ThemeVariant; name: string; description: string; colors: { bg: string; text: string; accent: string } }[] = [
  {
    id: 'classic',
    name: 'Pizarra Clásica',
    description: 'Negro profundo con tiza blanca y verde',
    colors: { bg: '#0f0f0f', text: '#e8e8e8', accent: '#4a9b8e' }
  },
  {
    id: 'modern',
    name: 'Pizarra Moderna',
    description: 'Gris oscuro con tiza azul',
    colors: { bg: '#1a1a2e', text: '#e0e7ff', accent: '#60a5fa' }
  },
  {
    id: 'digital',
    name: 'Pizarra Digital',
    description: 'Terminal verde neón',
    colors: { bg: '#000000', text: '#00ff00', accent: '#00ff41' }
  }
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-chalk-white mb-6">
        <Palette className="h-5 w-5" />
        <h3 className="text-xl font-semibold">Estilo de Pizarra</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((themeOption) => (
          <Card
            key={themeOption.id}
            className={`
              relative cursor-pointer transition-all duration-300 p-4 border-2
              ${theme === themeOption.id 
                ? 'border-chalk-green bg-blackboard-hover' 
                : 'border-chalk-light hover:border-chalk bg-blackboard'
              }
            `}
            onClick={() => setTheme(themeOption.id)}
            data-testid={`theme-option-${themeOption.id}`}
          >
            {theme === themeOption.id && (
              <div className="absolute top-2 right-2">
                <CheckCircle2 className="h-5 w-5 text-chalk-green" data-testid="theme-selected-indicator" />
              </div>
            )}

            <div className="mb-3">
              <h4 className="text-lg font-semibold text-chalk-white mb-1">
                {themeOption.name}
              </h4>
              <p className="text-sm text-chalk opacity-80">
                {themeOption.description}
              </p>
            </div>

            <div className="flex gap-2 mt-4">
              <div 
                className="w-8 h-8 rounded border border-chalk-light" 
                style={{ backgroundColor: themeOption.colors.bg }}
                title="Color de fondo"
              />
              <div 
                className="w-8 h-8 rounded border border-chalk-light" 
                style={{ backgroundColor: themeOption.colors.text }}
                title="Color de texto"
              />
              <div 
                className="w-8 h-8 rounded border border-chalk-light" 
                style={{ backgroundColor: themeOption.colors.accent }}
                title="Color de acento"
              />
            </div>
          </Card>
        ))}
      </div>

      <p className="text-sm text-chalk opacity-70 mt-4">
        El tema se aplicará inmediatamente y se guardará para tus futuras visitas.
      </p>
    </div>
  );
}
