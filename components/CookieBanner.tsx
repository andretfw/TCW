'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function CookieBanner() {
  const t = useTranslations('cookies');
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Estado para los interruptores de personalización
  const [options, setOptions] = useState({
    essential: true, // Siempre true por ley
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    // Solo mostramos si no hay un consentimiento previo guardado
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setIsVisible(true);
  }, []);

  const handleSave = (type: 'all' | 'custom' | 'reject') => {
    let consentValue;
    
    if (type === 'all') {
      consentValue = { essential: true, analytics: true, marketing: true };
    } else if (type === 'reject') {
      consentValue = { essential: true, analytics: false, marketing: false };
    } else {
      consentValue = options;
    }
    
    localStorage.setItem('cookie-consent', JSON.stringify(consentValue));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[9999] md:inset-x-4 md:bottom-4">
      <div className="mx-auto max-h-[calc(100dvh-1.5rem)] max-w-2xl overscroll-contain overflow-y-auto rounded-2xl border border-purple-100 bg-white/95 p-4 shadow-2xl backdrop-blur-md md:max-h-[calc(100dvh-2rem)] md:p-6">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          
          {/* SVG Animado de Galleta */}
          <div className="h-14 w-14 flex-shrink-0 animate-spin-slow text-purple-600 md:h-16 md:w-16">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#F3E8FF" stroke="currentColor" strokeWidth="2"/>
              <circle cx="8" cy="8" r="1.5" fill="#7E22CE"/>
              <circle cx="15" cy="10" r="1" fill="#7E22CE"/>
              <circle cx="10" cy="14" r="1" fill="#7E22CE"/>
              <circle cx="15" cy="16" r="1.5" fill="#7E22CE"/>
            </svg>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-purple-900">{t('title')}</h3>
            <p className="text-sm leading-relaxed text-gray-600">{t('description')}</p>
          </div>

          <div className="flex w-full flex-wrap justify-center gap-2 md:w-auto">
            {/* Botón RECHAZAR (Novedad) */}
            <button 
              onClick={() => handleSave('reject')} 
              className="min-h-11 rounded-lg border border-red-100 px-4 py-2 text-xs font-medium text-red-600 transition-all hover:bg-red-50"
            >
              {t('reject')}
            </button>

            <button 
              onClick={() => setShowSettings(!showSettings)} 
              className="min-h-11 rounded-lg border border-purple-200 px-4 py-2 text-xs font-medium text-purple-600 transition-all hover:bg-purple-50"
              aria-expanded={showSettings}
            >
              {t('settings')}
            </button>
            
            <button 
              onClick={() => handleSave('all')} 
              className="min-h-11 rounded-lg bg-purple-600 px-6 py-2 text-xs font-bold text-white shadow-lg transition-all hover:bg-purple-700 active:scale-95"
            >
              {t('accept')}
            </button>
          </div>
        </div>

        {/* Panel de Personalización que se despliega */}
        {showSettings && (
          <div className="mt-6 space-y-4 border-t border-purple-100 pt-6 animate-fade-in-up">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-gray-700">{t('essential')}</span>
              <div className="relative h-7 w-12 shrink-0 cursor-not-allowed rounded-full bg-purple-200 opacity-50">
                <div className="absolute right-1 top-1 h-5 w-5 rounded-full bg-purple-600" />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-gray-700">{t('analytics')}</span>
              <button 
                type="button"
                onClick={() => setOptions({...options, analytics: !options.analytics})}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${options.analytics ? 'bg-purple-600' : 'bg-gray-300'}`}
                aria-pressed={options.analytics}
                aria-label={t('analytics')}
              >
                <div className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${options.analytics ? 'right-1' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-gray-700">{t('marketing')}</span>
              <button 
                type="button"
                onClick={() => setOptions({...options, marketing: !options.marketing})}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${options.marketing ? 'bg-purple-600' : 'bg-gray-300'}`}
                aria-pressed={options.marketing}
                aria-label={t('marketing')}
              >
                <div className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${options.marketing ? 'right-1' : 'left-1'}`} />
              </button>
            </div>

            <button 
              onClick={() => handleSave('custom')}
              className="mt-4 min-h-11 w-full rounded-lg border border-purple-100 bg-purple-50 py-2 text-xs font-bold text-purple-700 transition-all hover:bg-purple-100"
            >
              {t('save')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}