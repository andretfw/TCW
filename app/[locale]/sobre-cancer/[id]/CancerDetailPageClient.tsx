'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Activity, AlertCircle, AlignCenter, Anchor, ArrowLeft, BookOpen, Circle, Cloud, Cpu, Database,
  Droplet, ExternalLink, Flower2, Gem, Hammer, Heart, Info, Layers, Mic, Mic2, Shield, Stethoscope,
  Sun, User, Wind, Zap,
} from 'lucide-react';
import { getCancerData } from '@/lib/cancer-data';
import { getCancerGuideTrustContent } from '@/lib/cancer-guide-trust';
import { getMelanomaGuideTrustContent } from '@/lib/melanoma-guide-trust';
import { cancerIdFromSlug, localizedPath } from '@/lib/routes';

const iconMap: Record<string, any> = {
  ribbon: Gem,
  lungs: Wind,
  activity: Activity,
  user: User,
  sun: Sun,
  droplet: Droplet,
  shield: Shield,
  'user-check': User,
  zap: Zap,
  feather: Mic2,
  'git-commit': AlignCenter,
  coffee: Layers,
  layers: Layers,
  circle: Circle,
  heart: Heart,
  cpu: Cpu,
  anchor: Anchor,
  database: Database,
  flower: Flower2,
  'brain-circuit': Cpu,
  bone: Hammer,
  'arrow-up': Activity,
  'stop-circle': Circle,
  'zap-off': Zap,
  eye: Activity,
  mic: Mic,
  wind: Wind,
  hammer: Hammer,
  cloud: Cloud,
  'align-center': AlignCenter,
  'flower-2': Flower2,
  'mic-2': Mic2,
};

export default function CancerDetailPageClient({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = use(params);
  const cancerId = cancerIdFromSlug(locale, id);
  if (!cancerId) notFound();

  const cancerData = getCancerData(cancerId);
  const t = useTranslations(`cancerDetails.${cancerId}`);
  const tCommon = useTranslations('common');
  const trustContent = getCancerGuideTrustContent(cancerId, locale)
    ?? getMelanomaGuideTrustContent(cancerId, locale);

  if (!cancerData) notFound();

  const HeroIcon = iconMap[cancerData.icon] || Activity;
  const guideTitle = t('title') === `cancerDetails.${cancerId}.title`
    ? cancerId.replace('-', ' ')
    : t('title');
  const stat1 = trustContent?.stats[0] ?? { value: t('stat1.value'), label: t('stat1.label') };
  const stat2 = trustContent?.stats[1] ?? { value: t('stat2.value'), label: t('stat2.label') };

  return (
    <div className="min-h-screen bg-brand-50 pb-20">
      <div className="relative h-[32rem] w-full overflow-hidden md:h-[60vh]">
        {cancerData.imagePresentation === 'illustration' ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-brand-800 to-brand-600" />
            <Image
              src={cancerData.image}
              alt=""
              fill
              className="scale-110 object-cover opacity-20 blur-2xl"
              aria-hidden="true"
              sizes="100vw"
            />
            <div className="absolute inset-x-6 bottom-44 top-6 overflow-hidden rounded-3xl border border-white/40 bg-white/95 shadow-2xl md:inset-y-10 md:left-[48%] md:right-12">
              <Image
                src={cancerData.image}
                alt={`${guideTitle} anatomy`}
                fill
                className="object-contain p-3"
                priority
                sizes="(min-width: 768px) 48vw, 90vw"
              />
            </div>
          </>
        ) : (
          <Image src={cancerData.image} alt={guideTitle} fill className="object-cover" priority sizes="100vw" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 text-white md:p-16">
          <div className="container mx-auto">
            <Link
              href={localizedPath(locale, 'aboutCancer')}
              className="group mb-4 inline-flex items-center text-white/80 transition-all duration-300 hover:-translate-x-1 hover:text-white md:mb-6"
            >
              <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
              {tCommon('backToLibrary')}
            </Link>
            <div className="flex animate-fade-in-up items-end gap-4">
              <HeroIcon className="mb-1 hidden h-12 w-12 text-brand-300 sm:block md:h-16 md:w-16" />
              <h1 className="text-3xl font-bold capitalize leading-tight sm:text-4xl md:text-6xl">
                {guideTitle}
              </h1>
            </div>
            <div className="mt-4 max-w-2xl animate-fade-in-up text-lg leading-relaxed text-brand-100 delay-100 md:text-2xl">
              <div>{t('shortDescription')}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container relative z-10 mx-auto -mt-8 px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 md:space-y-8 lg:col-span-2">
            <div className="animate-fade-in-up overflow-hidden rounded-3xl border border-brand-100/50 bg-white p-6 shadow-xl delay-200 md:p-8">
              <div className="mb-4 flex items-center gap-3 md:mb-6">
                <div className="rounded-xl bg-brand-100 p-3 text-brand-600 shadow-sm"><Info className="h-6 w-6" /></div>
                <h2 className="text-xl font-bold text-neutral-800 md:text-2xl">{t('overviewTitle')}</h2>
              </div>
              <div className="flex flex-col items-start gap-6 md:flex-row">
                <div className="flex-1 text-base leading-relaxed text-neutral-600 md:text-lg">{t('overviewText')}</div>
                <div className="relative aspect-video h-48 w-full shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-brand-50 via-white to-brand-100 shadow-md md:h-auto md:w-1/3 md:aspect-square">
                  <Image
                    src={cancerData.contentImage}
                    alt={`${guideTitle} overview`}
                    fill
                    className={
                      cancerData.contentImagePresentation === 'illustration'
                        ? 'object-contain p-3'
                        : 'object-cover transition-transform duration-700 hover:scale-110'
                    }
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                </div>
              </div>
            </div>

            <div className="animate-fade-in-up rounded-3xl border border-brand-100/50 bg-white p-6 shadow-xl delay-300 md:p-8">
              <div className="mb-4 flex items-center gap-3 md:mb-6">
                <div className="rounded-xl bg-red-100 p-3 text-red-500 shadow-sm"><AlertCircle className="h-6 w-6" /></div>
                <h2 className="text-xl font-bold text-neutral-800 md:text-2xl">{t('symptomsTitle')}</h2>
              </div>
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <li key={index} className="group flex items-start gap-3 rounded-xl bg-neutral-50 p-4 transition-colors duration-300 hover:bg-brand-50">
                    <div className="mt-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-200 transition-colors group-hover:bg-brand-300">
                      <div className="h-2 w-2 rounded-full bg-brand-600" />
                    </div>
                    <div className="text-sm font-medium text-neutral-700 md:text-base">{t(`symptoms.symptom${index}`)}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="animate-fade-in-up rounded-3xl border border-brand-100/50 bg-white p-6 shadow-xl delay-400 md:p-8">
              <div className="mb-4 flex items-center gap-3 md:mb-6">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600 shadow-sm"><Stethoscope className="h-6 w-6" /></div>
                <h2 className="text-xl font-bold text-neutral-800 md:text-2xl">{t('treatmentsTitle')}</h2>
              </div>
              <div className="space-y-4">
                <div className="mb-6 text-base text-neutral-600 md:text-lg">{t('treatmentsIntro')}</div>
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="flex-1 rounded-r-xl border-l-4 border-brand-500 bg-brand-50 p-5 transition-shadow hover:shadow-md">
                    <h3 className="mb-2 text-lg font-bold text-brand-800">{t('treatment1.title')}</h3>
                    <div className="text-sm leading-relaxed text-brand-700">{t('treatment1.desc')}</div>
                  </div>
                  <div className="flex-1 rounded-r-xl border-l-4 border-blue-500 bg-blue-50 p-5 transition-shadow hover:shadow-md">
                    <h3 className="mb-2 text-lg font-bold text-blue-800">{t('treatment2.title')}</h3>
                    <div className="text-sm leading-relaxed text-blue-700">{t('treatment2.desc')}</div>
                  </div>
                </div>
              </div>
            </div>

            {trustContent && (
              <section className="animate-fade-in-up rounded-3xl border border-brand-100/50 bg-white p-6 shadow-xl md:p-8" aria-labelledby="medical-sources-heading">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-xl bg-purple-100 p-3 text-purple-700 shadow-sm"><BookOpen className="h-6 w-6" /></div>
                  <div>
                    <h2 id="medical-sources-heading" className="text-xl font-bold text-neutral-800 md:text-2xl">{trustContent.heading}</h2>
                    <p className="mt-1 text-sm font-medium text-neutral-500">{trustContent.checkedLabel}: {trustContent.checkedDate}</p>
                  </div>
                </div>

                <p className="rounded-2xl border border-purple-100 bg-purple-50 p-4 text-sm leading-relaxed text-neutral-700 md:text-base">
                  {trustContent.disclaimer}
                </p>

                <h3 className="mb-3 mt-6 font-bold text-neutral-800">{trustContent.sourcesHeading}</h3>
                <ul className="space-y-3">
                  {trustContent.sources.map((source) => (
                    <li key={source.href}>
                      <a
                        href={source.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-4 text-sm font-medium text-neutral-700 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800"
                      >
                        <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
                        <span>{source.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div className="animate-fade-in-up space-y-6 delay-200">
            <div className="rounded-3xl border border-brand-100/50 bg-white p-6 shadow-xl lg:sticky lg:top-28">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-neutral-800">
                <Activity className="h-5 w-5 text-brand-500" />
                {t('statsTitle')}
              </h3>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 text-center transition-colors hover:border-brand-200">
                  <span className="mb-1 block text-2xl font-bold text-brand-600 md:text-3xl">{stat1.value}</span>
                  <span className="text-xs font-medium text-neutral-500 md:text-sm">{stat1.label}</span>
                </div>
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 text-center transition-colors hover:border-brand-200">
                  <span className="mb-1 block text-2xl font-bold text-brand-600 md:text-3xl">{stat2.value}</span>
                  <span className="text-xs font-medium text-neutral-500 md:text-sm">{stat2.label}</span>
                </div>
              </div>
              <div className="mt-8 border-t border-neutral-100 pt-6">
                <h4 className="mb-4 text-center font-semibold text-neutral-800">{tCommon('supportWarriorWish')}</h4>
                <Link
                  href={localizedPath(locale, 'donate')}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-4 font-bold text-white shadow-lg shadow-brand-200 transition-all hover:scale-[1.02] hover:bg-brand-700 active:scale-95"
                >
                  <Heart className="h-5 w-5 animate-pulse fill-current" />
                  {tCommon('donateNow')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
