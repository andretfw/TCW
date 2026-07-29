'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Activity, ArrowRight } from 'lucide-react';
import { getAdditionalCancerGuideContent, getCancerGuideCountLabel } from '@/lib/additional-cancer-guides';
import { getAdditionalCancerGuideBatch2Content } from '@/lib/additional-cancer-guides-2';
import { getAdditionalCancerGuideBatch3Content } from '@/lib/additional-cancer-guides-3';
import { getCancerGuideImageAlt } from '@/lib/cancer-image-seo';
import { CANCER_GUIDE_IDS, CANCER_GUIDE_IMAGES } from '@/lib/cancer-images';
import { localizedCancerPath } from '@/lib/routes';

export default function AboutCancerPageClient({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations('aboutCancerPage');

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 pt-24">
      <section className="container mx-auto mb-16 px-4 text-center">
        <span className="mb-6 inline-block rounded-full bg-brand-100 px-4 py-1.5 text-sm font-bold text-brand-700">{t('heroTag')}</span>
        <h1 className="mb-6 text-5xl font-bold text-neutral-900 md:text-6xl">
          {t.rich('title', { highlight: (chunks) => <span className="text-brand-600">{chunks}</span> })}
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-neutral-600">{t('subtitle')}</p>
        <p className="mt-4 font-medium text-brand-600">{getCancerGuideCountLabel(locale, CANCER_GUIDE_IDS.length)}</p>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {CANCER_GUIDE_IDS.map((id) => {
            const image = CANCER_GUIDE_IMAGES[id].card;
            const additionalGuide = getAdditionalCancerGuideContent(id, locale)
              ?? getAdditionalCancerGuideBatch2Content(id, locale)
              ?? getAdditionalCancerGuideBatch3Content(id, locale);
            const title = additionalGuide?.title ?? (t.has(`types.${id}.title`) ? t(`types.${id}.title`) : id);
            const shortDescription = additionalGuide?.shortDescription
              ?? (t.has(`types.${id}.shortDesc`) ? t(`types.${id}.shortDesc`) : '');

            return (
              <Link
                href={localizedCancerPath(locale, id)}
                key={id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-100">
                  <Image
                    src={image.src}
                    alt={getCancerGuideImageAlt(title, locale, 'card', image.presentation)}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className={
                      image.presentation === 'illustration'
                        ? 'object-contain p-4 transition-transform duration-700 group-hover:scale-105'
                        : 'object-cover transition-transform duration-700 group-hover:scale-110'
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">{t('infoGuide')}</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center gap-2 text-brand-600">
                    <Activity className="h-5 w-5" />
                    <span className="text-sm font-bold uppercase tracking-wide">{t('medicalInfo')}</span>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold capitalize text-neutral-900 transition-colors group-hover:text-brand-600">
                    {title}
                  </h3>
                  <p className="mb-6 line-clamp-3 flex-1 text-neutral-500">{shortDescription}</p>
                  <div className="flex items-center font-bold text-brand-600 transition-all group-hover:gap-2">
                    {t('readMore')} <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
