'use client';
import { useLocale, useTranslations } from 'next-intl';
import {PRIVACY_NOTICE_CONTENT} from '@/lib/privacy-notice-content';
import {normalizeLocale} from '@/lib/routes';

export default function PrivacyPage() {
  const t = useTranslations('legal.privacy');
  const locale = normalizeLocale(useLocale());

  return (
    <div className="pt-24 pb-20 min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header con Icono SVG Personalizado (Shield Lock) */}
        <div className="bg-white rounded-3xl p-10 shadow-xl mb-8 border border-neutral-100 text-center relative overflow-hidden">
            {/* Decoración de fondo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-100 rounded-tr-full opacity-50"></div>
            
            <div className="relative z-10">
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                    {/* SVG Icon: Data Protection */}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="fill-blue-100/50" />
                        <rect x="10" y="8" width="4" height="6" rx="1" stroke="currentColor" fill="none" />
                        <path d="M10 8V6a2 2 0 1 1 4 0v2" stroke="currentColor" />
                    </svg>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight">
                    {t('title')}
                </h1>
                <p className="text-neutral-500 font-medium bg-neutral-100 inline-block px-4 py-2 rounded-full text-sm border border-neutral-200">
                    {t('lastUpdated')}
                </p>
            </div>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl p-10 md:p-16 shadow-lg border border-neutral-100">
            <article 
                className="prose prose-lg max-w-none text-neutral-600 
                /* Estilos para Títulos */
                prose-headings:text-blue-900 prose-headings:font-bold prose-headings:mt-12 prose-headings:mb-4
                prose-h3:text-2xl prose-h3:border-b prose-h3:border-blue-100 prose-h3:pb-2
                
                /* Estilos para Párrafos y Listas */
                prose-p:leading-relaxed prose-p:mb-4
                prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-ul:mb-6
                prose-li:text-neutral-700
                
                /* Estilos para Negritas y Enlaces */
                prose-strong:text-blue-800 prose-strong:font-bold
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-blue-800 transition-colors"
                dangerouslySetInnerHTML={{__html: PRIVACY_NOTICE_CONTENT[locale]}}
            />
        </div>
      </div>
    </div>
  );
}
