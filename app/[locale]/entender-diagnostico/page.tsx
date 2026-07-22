'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { BookOpen, Download, Users } from 'lucide-react';
import { localizedPath } from '@/lib/routes';

export default function UnderstandingDiagnosisPage() {
  const t = useTranslations('diagnosisPage');
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-white pt-20">
      <section className="bg-gradient-to-br from-brand-50 to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-bold text-neutral-900">{t('title')}</h1>
            <p className="text-xl leading-relaxed text-neutral-600">{t('heroDesc')}</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-white to-brand-50 p-8 transition-all duration-300 hover:shadow-xl">
              <div className="mb-6 flex items-start gap-6">
                <div className="flex h-16 w-16 flex-shrink-0 animate-pulse items-center justify-center rounded-xl bg-brand-100">
                  <BookOpen className="h-8 w-8 text-brand-600" />
                </div>
                <div>
                  <h2 className="mb-4 text-3xl font-bold text-neutral-900">{t('whatIsCancerTitle')}</h2>
                  <p className="text-lg leading-relaxed text-neutral-600">{t('whatIsCancerDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-white to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-4 text-center text-4xl font-bold text-neutral-900">{t('stagingTitle')}</h2>
            <h3 className="mb-6 text-center text-2xl font-semibold text-purple-600">{t('stagingSub')}</h3>
            <p className="mx-auto mb-8 max-w-3xl text-center text-lg leading-relaxed text-neutral-600">{t('stagingDesc')}</p>
            <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-5">
              {[
                { stage: '0', label: t('stages.0'), color: 'from-green-400 to-green-600' },
                { stage: 'I', label: t('stages.I'), color: 'from-blue-400 to-blue-600' },
                { stage: 'II', label: t('stages.II'), color: 'from-yellow-400 to-yellow-600' },
                { stage: 'III', label: t('stages.III'), color: 'from-orange-400 to-orange-600' },
                { stage: 'IV', label: t('stages.IV'), color: 'from-red-400 to-red-600' },
              ].map((item) => (
                <div key={item.stage} className="group cursor-pointer rounded-xl border-2 border-purple-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <div className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${item.color} text-2xl font-bold text-white transition-transform group-hover:scale-110`}>
                    {item.stage}
                  </div>
                  <div className="text-sm font-semibold text-neutral-700">Stage {item.stage}</div>
                  <div className="mt-1 text-xs text-neutral-500">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50 to-purple-50 p-8">
              <h3 className="mb-4 text-2xl font-semibold text-pink-600">{t('gradingTitle')}</h3>
              <p className="text-lg leading-relaxed text-neutral-600">{t('gradingDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-brand-600 to-purple-600 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-white">
            <div className="mb-8 flex items-start gap-6">
              <div className="flex h-16 w-16 flex-shrink-0 animate-bounce items-center justify-center rounded-xl bg-white/20">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="mb-4 text-4xl font-bold">{t('aloneTitle')}</h2>
                <p className="mb-6 text-xl leading-relaxed text-white/90">{t('aloneDesc')}</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={localizedPath(locale, 'volunteers')}
                className="rounded-full bg-white px-8 py-4 font-bold text-brand-600 transition-all hover:scale-105 hover:shadow-2xl"
              >
                {t('btnSupport')}
              </Link>
              <a
                href="/understanding-your-diagnosis.pdf"
                download
                className="flex items-center gap-2 rounded-full border-2 border-white bg-white/20 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all hover:bg-white/30"
              >
                <Download className="h-5 w-5" />
                {t('btnDownload')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
