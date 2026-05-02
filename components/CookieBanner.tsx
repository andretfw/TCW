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
    <div className="fixed bottom-4 left-4 right-4 z-[9999] animate-bounce-subtle">
      <div className="bg-white/95 backdrop-blur-md border border-purple-100 shadow-2xl rounded-2xl p-6 max-w-2xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-6">
          
          {/* SVG Animado de Galleta */}
          <div className="w-16 h-16 flex-shrink-0 animate-spin-slow text-purple-600">
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
            <p className="text-sm text-gray-600 leading-relaxed">{t('description')}</p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {/* Botón RECHAZAR (Novedad) */}
            <button 
              onClick={() => handleSave('reject')} 
              className="px-4 py-2 text-xs font-medium text-red-600 border border-red-100 rounded-lg hover:bg-red-50 transition-all"
            >
              {t('reject')}
            </button>

            <button 
              onClick={() => setShowSettings(!showSettings)} 
              className="px-4 py-2 text-xs font-medium text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-all"
            >
              {t('settings')}
            </button>
            
            <button 
              onClick={() => handleSave('all')} 
              className="px-6 py-2 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 shadow-lg active:scale-95 transition-all"
            >
              {t('accept')}
            </button>
          </div>
        </div>

        {/* Panel de Personalización que se despliega */}
        {showSettings && (
          <div className="mt-6 pt-6 border-t border-purple-100 space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{t('essential')}</span>
              <div className="w-10 h-5 bg-purple-200 rounded-full relative opacity-50 cursor-not-allowed">
                <div className="absolute right-1 top-1 w-3 h-3 bg-purple-600 rounded-full" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{t('analytics')}</span>
              <button 
                onClick={() => setOptions({...options, analytics: !options.analytics})}
                className={`w-10 h-5 rounded-full relative transition-colors ${options.analytics ? 'bg-purple-600' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${options.analytics ? 'right-1' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{t('marketing')}</span>
              <button 
                onClick={() => setOptions({...options, marketing: !options.marketing})}
                className={`w-10 h-5 rounded-full relative transition-colors ${options.marketing ? 'bg-purple-600' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${options.marketing ? 'right-1' : 'left-1'}`} />
              </button>
            </div>

            <button 
              onClick={() => handleSave('custom')}
              className="w-full mt-4 py-2 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg hover:bg-purple-100 transition-all border border-purple-100"
            >
              {t('save')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}