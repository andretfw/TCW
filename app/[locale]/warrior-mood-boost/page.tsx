'use client';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { 
  CloudRain, Sun, Zap, BatteryLow, HeartHandshake, 
  ShieldAlert, Ghost, Frown, Coffee, Feather, 
  Smile, Flame, BookOpen, CheckCircle, Quote, Heart, ArrowDown
} from 'lucide-react';

export default function MoodBoostPage() {
  const locale = useLocale();
  const t = useTranslations('moodBoost');
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [triedTips, setTriedTips] = useState<string[]>([]);

  // Mapa de iconos SVG personalizados y colores vibrantes
  const moods = [
    { id: 'anxious', icon: CloudRain, color: 'bg-indigo-100 text-indigo-600', border: 'hover:border-indigo-400' },
    { id: 'sad', icon: Frown, color: 'bg-blue-100 text-blue-600', border: 'hover:border-blue-400' },
    { id: 'overwhelmed', icon: Zap, color: 'bg-purple-100 text-purple-600', border: 'hover:border-purple-400' },
    { id: 'tired', icon: BatteryLow, color: 'bg-gray-100 text-gray-600', border: 'hover:border-gray-400' },
    { id: 'angry', icon: Flame, color: 'bg-red-100 text-red-600', border: 'hover:border-red-400' },
    { id: 'lonely', icon: Ghost, color: 'bg-sky-100 text-sky-600', border: 'hover:border-sky-400' },
    { id: 'hopeful', icon: Sun, color: 'bg-yellow-100 text-yellow-600', border: 'hover:border-yellow-400' },
    { id: 'scared', icon: ShieldAlert, color: 'bg-orange-100 text-orange-600', border: 'hover:border-orange-400' },
    { id: 'numb', icon: Feather, color: 'bg-stone-100 text-stone-600', border: 'hover:border-stone-400' },
    { id: 'guilty', icon: HeartHandshake, color: 'bg-rose-100 text-rose-600', border: 'hover:border-rose-400' },
    { id: 'grateful', icon: Heart, color: 'bg-teal-100 text-teal-600', border: 'hover:border-teal-400' },
    { id: 'motivated', icon: Coffee, color: 'bg-emerald-100 text-emerald-600', border: 'hover:border-emerald-400' },
  ];

  const handleTried = (id: string) => {
    if (!triedTips.includes(id)) {
      setTriedTips([...triedTips, id]);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-neutral-50 pb-20">
      
      {/* Hero Section con Animación Suave */}
      <section className="py-20 bg-gradient-to-b from-brand-50 to-white text-center rounded-b-[3rem] shadow-sm mb-12">
        <div className="container mx-auto px-4">
          <div className="inline-block p-5 rounded-full bg-brand-100 mb-6 animate-pulse shadow-lg shadow-brand-100/50">
             <Sun className="w-16 h-16 text-brand-600" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 mb-6 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 max-w-2xl mx-auto font-medium">
            {t('subtitle')}
          </p>
          <p className="mt-6 text-neutral-500 max-w-xl mx-auto leading-relaxed bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-neutral-100">
            {t('intro')}
          </p>
        </div>
      </section>

      {/* Mood Grid Interactivo */}
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="grid grid-cols-1 gap-6">
          {moods.map((mood) => {
            const isActive = activeMood === mood.id;
            const isTried = triedTips.includes(mood.id);
            const Icon = mood.icon;

            return (
              <div 
                key={mood.id} 
                className={`group overflow-hidden rounded-[2rem] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] border-2 ${
                    isActive 
                    ? 'bg-white shadow-2xl border-brand-200 scale-[1.02] ring-4 ring-brand-50 z-10' 
                    : `bg-white border-neutral-100 ${mood.border} hover:shadow-xl hover:-translate-y-1`
                }`}
              >
                {/* Header (Clicable) */}
                <button 
                  onClick={() => setActiveMood(isActive ? null : mood.id)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left outline-none"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-inner ${mood.color}`}>
                        <Icon className="w-8 h-8" />
                    </div>
                    <div>
                        <span className={`text-xl md:text-2xl font-bold block mb-1 transition-colors ${isActive ? 'text-brand-900' : 'text-neutral-700 group-hover:text-neutral-900'}`}>
                          {t(`moods.${mood.id}.label`)}
                        </span>
                        {!isActive && (
                            <span className="text-sm text-neutral-400 font-medium hidden md:inline-block animate-fadeIn">
                                Click to reveal your message...
                            </span>
                        )}
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-brand-100 rotate-180 text-brand-600' : 'bg-neutral-100 text-neutral-400 group-hover:bg-brand-50 group-hover:text-brand-500'}`}>
                    <ArrowDown className="w-5 h-5" />
                  </div>
                </button>

                {/* Content (Desplegable) */}
                <div 
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${isActive ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="p-8 pt-0 space-y-8">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent mb-8"></div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* TCW Support Message */}
                        <div className="bg-brand-50/60 rounded-3xl p-6 border border-brand-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white rounded-xl shadow-sm text-brand-600">
                                    <Heart className="w-5 h-5 fill-current" />
                                </div>
                                <h4 className="font-bold text-brand-900 text-lg">TCW Support</h4>
                            </div>
                            <p className="text-neutral-700 leading-relaxed font-medium">
                                {t(`moods.${mood.id}.support`)}
                            </p>
                        </div>

                        {/* Tip */}
                        <div className="bg-blue-50/60 rounded-3xl p-6 border border-blue-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white rounded-xl shadow-sm text-blue-600">
                                    <Smile className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-blue-900 text-lg">Gentle Tip</h4>
                            </div>
                            <p className="text-neutral-700 leading-relaxed font-medium">
                                {t(`moods.${mood.id}.tip`)}
                            </p>
                        </div>
                    </div>

                    {/* Quote */}
                    <div className="relative p-10 bg-neutral-900 rounded-[2rem] text-white overflow-hidden shadow-2xl">
                      {/* Efectos de fondo animados */}
                      <div className="absolute top-0 right-0 p-40 bg-brand-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 animate-pulse"></div>
                      <div className="absolute bottom-0 left-0 p-32 bg-blue-500 rounded-full blur-[80px] opacity-20 -ml-16 -mb-16"></div>
                      
                      <Quote className="w-10 h-10 text-brand-400 mb-6 opacity-80" />
                      <p className="relative z-10 font-serif text-2xl md:text-3xl leading-relaxed text-center mb-8 font-light italic">
                        {t(`moods.${mood.id}.quote`)}
                      </p>
                      <div className="flex justify-center">
                          <span className="bg-white/10 backdrop-blur-md px-4 py-1 rounded-full text-xs text-neutral-300 uppercase tracking-widest font-bold border border-white/10">
                            {locale === 'ro' ? 'Cuvinte de la un luptător' : 'Words from a Warrior'}
                          </span>
                      </div>
                    </div>

                    {/* "I tried this" Button */}
                    <div className="flex justify-center pt-4">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleTried(mood.id); }}
                        disabled={isTried}
                        className={`flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg transition-all transform active:scale-95 shadow-xl ${
                          isTried 
                            ? 'bg-green-100 text-green-700 cursor-default ring-2 ring-green-200 shadow-none' 
                            : 'bg-gradient-to-r from-neutral-900 to-neutral-800 text-white hover:from-brand-600 hover:to-brand-700 hover:shadow-brand-200/50 hover:-translate-y-1'
                        }`}
                      >
                        {isTried ? (
                          <>
                            <CheckCircle className="w-6 h-6 animate-bounce" />
                            {t('triedSuccess')}
                          </>
                        ) : (
                          t('triedButton')
                        )}
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Book Promo Footer */}
        <div className="mt-20 bg-white rounded-[2.5rem] p-12 shadow-xl border border-neutral-100 flex flex-col md:flex-row items-center gap-12 text-center md:text-left relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative z-10 w-28 h-28 bg-white rounded-full flex items-center justify-center shrink-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-brand-100 group-hover:scale-110 transition-transform duration-500">
                <BookOpen className="w-12 h-12 text-brand-600" />
            </div>
            <div className="relative z-10 flex-1">
                <p className="text-xl text-neutral-600 mb-6 leading-relaxed max-w-2xl font-light">
                    {t('bookFooter')}
                </p>
                <a 
                    href="https://www.amazon.com/One-Mission-Tutti-Frutti-Women/dp/B0CFCYW6NH" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg hover:shadow-brand-200 hover:-translate-y-1"
                >
                    {t('bookLinkText')} 
                    <span className="text-xl">→</span>
                </a>
            </div>
        </div>

      </div>
    </div>
  );
}
