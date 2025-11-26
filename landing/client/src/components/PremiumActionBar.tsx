import { useState } from 'react';
import { usePremium } from '@/hooks/usePremium';
import { useAdManager } from '@/hooks/useAdManager';
import { Download, FileText, BarChart3, Crown } from 'lucide-react';

interface PremiumActionBarProps {
  onExportPDF: () => void;
  onGenerateSecondMenu: () => void;
  onComparePrices: () => void;
  className?: string;
}

export default function PremiumActionBar({ 
  onExportPDF, 
  onGenerateSecondMenu, 
  onComparePrices,
  className = '' 
}: PremiumActionBarProps) {
  const { isPremium } = usePremium();
  const { showRewarded, sessionCounts } = useAdManager();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handlePremiumAction = async (actionType: string, callback: () => void) => {
    // Premium: si IS_PREMIUM === true → oculta TODO
    if (isPremium) {
      callback();
      return;
    }

    setLoadingAction(actionType);
    
    // Rewarded: ≤ 2 por sesión (reseteo al abrir app)
    const success = showRewarded(actionType, () => {
      callback();
      setLoadingAction(null);
    });

    if (!success) {
      setLoadingAction(null);
      // Show upgrade prompt instead
      alert('Has alcanzado el límite de acciones gratuitas por sesión (2 máximo). Hazte premium para acceso ilimitado.');
    }
  };

  const getButtonText = (actionType: string, defaultText: string) => {
    if (isPremium) return defaultText;
    
    // Rewarded: ≤ 2 por sesión total (not per action type)
    const totalRewarded = sessionCounts['REWARDED'] || 0;
    if (totalRewarded >= 2) return 'Límite alcanzado - Hazte Premium';
    
    return loadingAction === actionType ? 'Cargando anuncio...' : 'Ver anuncio para desbloquear';
  };

  const isDisabled = (actionType: string) => {
    // Check total rewarded count, not per action type
    return !isPremium && (sessionCounts['REWARDED'] || 0) >= 2;
  };

  return (
    <div 
      id="premium-action-bar" 
      className={`premium-action-bar bg-black/30 border border-chalk-green/30 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-chalk-white flex items-center gap-2">
          {isPremium ? (
            <>
              <Crown className="w-5 h-5 text-chalk-yellow" />
              Funciones Premium
            </>
          ) : (
            <>
              <BarChart3 className="w-5 h-5 text-chalk-green" />
              Funciones Avanzadas
            </>
          )}
        </h3>
        
        {!isPremium && (
          <span className="text-xs text-chalk/60 bg-chalk-green/10 px-2 py-1 rounded">
            {2 - (sessionCounts['REWARDED'] || 0)} usos restantes esta sesión
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={() => handlePremiumAction('EXPORT_PDF', onExportPDF)}
          disabled={isDisabled('EXPORT_PDF') || loadingAction === 'EXPORT_PDF'}
          className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-colors text-sm ${
            isPremium 
              ? 'bg-chalk-green text-black hover:bg-chalk-green/80' 
              : isDisabled('EXPORT_PDF')
                ? 'bg-chalk/20 text-chalk/40 cursor-not-allowed'
                : 'bg-chalk-green/20 text-chalk-green hover:bg-chalk-green/30 border border-chalk-green/30'
          }`}
        >
          <Download className="w-4 h-4" />
          <span className="text-xs">
            {getButtonText('EXPORT_PDF', 'Exportar PDF')}
          </span>
        </button>

        <button
          onClick={() => handlePremiumAction('SECOND_MENU', onGenerateSecondMenu)}
          disabled={isDisabled('SECOND_MENU') || loadingAction === 'SECOND_MENU'}
          className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-colors text-sm ${
            isPremium 
              ? 'bg-chalk-green text-black hover:bg-chalk-green/80' 
              : isDisabled('SECOND_MENU')
                ? 'bg-chalk/20 text-chalk/40 cursor-not-allowed'
                : 'bg-chalk-green/20 text-chalk-green hover:bg-chalk-green/30 border border-chalk-green/30'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="text-xs">
            {getButtonText('SECOND_MENU', '2º Menú del Día')}
          </span>
        </button>

        <button
          onClick={() => handlePremiumAction('COMPARE_PRICES', onComparePrices)}
          disabled={isDisabled('COMPARE_PRICES') || loadingAction === 'COMPARE_PRICES'}
          className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-colors text-sm ${
            isPremium 
              ? 'bg-chalk-green text-black hover:bg-chalk-green/80' 
              : isDisabled('COMPARE_PRICES')
                ? 'bg-chalk/20 text-chalk/40 cursor-not-allowed'
                : 'bg-chalk-green/20 text-chalk-green hover:bg-chalk-green/30 border border-chalk-green/30'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span className="text-xs">
            {getButtonText('COMPARE_PRICES', 'Comparar Precios')}
          </span>
        </button>
      </div>

      {!isPremium && (
        <div className="mt-4 pt-3 border-t border-chalk-green/30">
          <p className="text-xs text-chalk/60 text-center">
            Con Premium: acceso ilimitado a todas las funciones avanzadas
          </p>
        </div>
      )}
    </div>
  );
}