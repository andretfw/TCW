'use client';
import { useTranslations } from 'next-intl';
import { Sparkles, ShieldCheck, Scale, Gavel, AlertCircle, Info } from 'lucide-react';
import DreamApplicationForm from '@/components/DreamApplicationForm';

export default function DreamApplicationPage() {
  const t = useTranslations('dreamApp');
  const tGrant = useTranslations('grantPolicy');

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero Section - Animada */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-brand-600 to-purple-900 text-white overflow-hidden">
        <div className="container mx-auto px-4 text-center animate-fade-in">
          <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-brand-300 mx-auto mb-6 animate-bounce-subtle" />
          <h1 className="text-3xl md:text-5xl font-bold mb-6">{t('title')}</h1>
          <p className="text-lg md:text-xl text-brand-100 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto animate-fade-in-up">
                <DreamApplicationForm />

                {/* --- SECCIÓN POLÍTICA INTEGRAL (TEXTO COMPLETO PDF) --- */}
                <div id="grant-policy" className="mt-16 rounded-[2rem] border border-neutral-100 bg-white p-6 shadow-xl scroll-mt-28 md:p-12">
                    <div className="text-center mb-12">
                        <ShieldCheck className="w-12 h-12 text-brand-600 mx-auto mb-4" />
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">{tGrant('title')}</h2>
                        <div className="flex justify-center gap-4 text-[10px] md:text-xs text-neutral-400 uppercase tracking-widest font-semibold">
                            <span>{tGrant('header.effectiveDate')}</span>
                            <span>•</span>
                            <span>{tGrant('header.version')}</span>
                        </div>
                    </div>

                    <div className="space-y-12 text-neutral-700 leading-relaxed text-sm md:text-base">
                        {/* Misión */}
                        <div className="bg-neutral-50 p-6 md:p-8 rounded-3xl border border-neutral-100 hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-brand-500" /> {tGrant('sections.mission')}
                            </h3>
                            <p>{tGrant('fullContent.missionText')}</p>
                        </div>

                        {/* Alcance */}
                        <div className="px-2">
                            <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                                <Info className="w-5 h-5 text-brand-500" /> {tGrant('sections.scope')}
                            </h3>
                            <p className="mb-4">{tGrant('fullContent.scopeIntro')}</p>
                            <p className="font-bold text-neutral-900 mb-2">{tGrant('fullContent.wishesTitle')}</p>
                            <p>{tGrant('fullContent.wishesText')}</p>
                        </div>

                        {/* Administración Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-white border border-neutral-100 rounded-2xl">
                                <h4 className="font-bold text-neutral-900 mb-3 border-b pb-2">{tGrant('fullContent.nonTransferableTitle')}</h4>
                                <p className="text-sm">{tGrant('fullContent.nonTransferableText')}</p>
                            </div>
                            <div className="p-6 bg-white border border-neutral-100 rounded-2xl">
                                <h4 className="font-bold text-neutral-900 mb-3 border-b pb-2">{tGrant('fullContent.adminCostsTitle')}</h4>
                                <p className="text-sm">{tGrant('fullContent.adminCostsText')}</p>
                            </div>
                        </div>

                        {/* Legislación Rumana Completa */}
                        <div className="p-6 md:p-8 bg-neutral-50 rounded-3xl border border-neutral-100">
                            <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
                                <Scale className="w-6 h-6 text-brand-600" /> {tGrant('sections.legislation')}
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="font-bold text-sm text-neutral-900 mb-1">{tGrant('fullContent.legalBasisTitle')}</p>
                                    <p className="text-sm">{tGrant('fullContent.legalBasisText')}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-neutral-900 mb-1">{tGrant('fullContent.financeTitle')}</p>
                                    <p className="text-sm">{tGrant('fullContent.financeText')}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-neutral-900 mb-1">{tGrant('fullContent.auditTitle')}</p>
                                    <p className="text-sm">{tGrant('fullContent.auditText')}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                    <div>
                                        <p className="font-bold text-sm text-neutral-900 mb-1">{tGrant('fullContent.gdprTitle')}</p>
                                        <p className="text-sm">{tGrant('fullContent.gdprText')}</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-neutral-900 mb-1">{tGrant('fullContent.crossBorderTitle')}</p>
                                        <p className="text-sm">{tGrant('fullContent.crossBorderText')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Litigios (Bloque Oscuro) */}
                        <div className="p-6 md:p-8 bg-neutral-900 text-neutral-300 rounded-3xl shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Gavel className="w-6 h-6 text-brand-400" /> {tGrant('sections.disputes')}
                            </h3>
                            <div className="space-y-6 text-sm opacity-90 leading-relaxed">
                                <p>{tGrant('fullContent.disputesText')}</p>
                                <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    <p>{tGrant('fullContent.terminationText')}</p>
                                </div>
                                <div className="pt-6 border-t border-white/10">
                                    <p className="font-bold text-white mb-2">{tGrant('fullContent.forceMajeureTitle')}</p>
                                    <p className="italic">{tGrant('fullContent.forceMajeureText')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
          </div>
        </div>
      </section>

      {/* Estilos para las animaciones */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
        .animate-bounce-subtle { animation: bounceSubtle 4s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
