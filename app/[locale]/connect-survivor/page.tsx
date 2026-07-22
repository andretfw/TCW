'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, ShieldCheck, UserPlus } from 'lucide-react';
import { localizedPath } from '@/lib/routes';

export default function ConnectSurvivorPage() {
  const t = useTranslations('connectSurvivorPage');
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-white pt-20">
      <section className="bg-gradient-to-br from-indigo-50 to-blue-100 py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6 inline-block rounded-full bg-white p-4 shadow-md">
            <UserPlus className="h-12 w-12 text-indigo-600" />
          </div>
          <h1 className="mb-6 text-5xl font-bold text-neutral-900 md:text-7xl">{t('title')}</h1>
          <p className="mx-auto max-w-2xl text-xl text-neutral-600">{t('subtitle')}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[1, 2, 3].map((step) => (
              <div key={step} className="rounded-2xl border border-neutral-100 bg-white p-6 text-center shadow-lg">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
                  {step}
                </div>
                <h3 className="mb-2 text-lg font-bold">{t(`step${step}Title`)}</h3>
                <p className="text-sm text-neutral-500">{t(`step${step}Desc`)}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-indigo-100 bg-white p-10 text-center shadow-xl">
            <h2 className="mb-8 text-3xl font-bold text-neutral-900">{t('readyTitle')}</h2>
            <div className="flex flex-col justify-center gap-6 md:flex-row">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdhawxJOOIIf4LW9ZPNXIOpG8-XzVwMCrJ_hYa4NQgDKGnjMQ/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-indigo-200"
              >
                <span>{t('btnConnect')}</span>
                <ArrowRight className="h-5 w-5" />
              </a>
              <Link
                href={localizedPath(locale, 'peerPolicy')}
                className="flex items-center justify-center gap-3 rounded-xl border-2 border-neutral-200 bg-white px-8 py-4 font-bold text-neutral-700 transition-all hover:border-indigo-600 hover:text-indigo-600"
              >
                <ShieldCheck className="h-5 w-5" />
                <span>{t('btnPolicy')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
