'use client';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { UserPlus, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ConnectSurvivorPage() {
  const t = useTranslations('connectSurvivorPage'); // Asegúrate que coincida con tu JSON
  
  const locale = useLocale();
  const prefix = locale === 'es' ? '' : `/${locale}`;

  return (
    <div className="pt-20 min-h-screen bg-white">
      <section className="py-24 bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="container mx-auto px-4 text-center">
            <div className="inline-block p-4 bg-white rounded-full shadow-md mb-6">
                <UserPlus className="w-12 h-12 text-indigo-600" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 mb-6">{t('title')}</h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {[1, 2, 3].map((step) => (
                    <div key={step} className="text-center p-6 rounded-2xl bg-white border border-neutral-100 shadow-lg">
                        <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">{step}</div>
                        <h3 className="font-bold text-lg mb-2">{t(`step${step}Title`)}</h3>
                        <p className="text-sm text-neutral-500">{t(`step${step}Desc`)}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-xl border border-indigo-100 text-center">
                {/* AQUI ESTABA EL ERROR: Ahora usa traducción */}
                <h2 className="text-3xl font-bold text-neutral-900 mb-8">{t('readyTitle')}</h2>
                
                <div className="flex flex-col md:flex-row gap-6 justify-center">
                    {/* Botón externo al Google Form */}
                    <a 
                        href="https://docs.google.com/forms/d/e/1FAIpQLSdhawxJOOIIf4LW9ZPNXIOpG8-XzVwMCrJ_hYa4NQgDKGnjMQ/viewform"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
                    >
                        <span>{t('btnConnect')}</span>
                        <ArrowRight className="w-5 h-5" />
                    </a>
                    
                    {/* Botón interno a Peer Policy */}
                    <Link 
                        href={`${prefix}/peer-policy`}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-neutral-700 font-bold rounded-xl border-2 border-neutral-200 hover:border-indigo-600 hover:text-indigo-600 transition-all"
                    >
                        <ShieldCheck className="w-5 h-5" />
                        <span>{t('btnPolicy')}</span>
                    </Link>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}