'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Activity, AlertCircle, AlignCenter, Anchor, ArrowLeft, Circle, Cloud, Cpu, Database,
  Droplet, Flower2, Gem, Hammer, Heart, Info, Layers, Mic, Mic2, Shield, Stethoscope,
  Sun, User, Wind, Zap,
} from 'lucide-react';
import { getCancerData } from '@/lib/cancer-data';
import { localizedPath } from '@/lib/routes';

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

const validIds = [
  'breast', 'lung', 'colorectal', 'prostate', 'skin', 'kidney', 'leukemia', 'liver',
  'pancreatic', 'ovarian', 'childhood', 'brain', 'bladder', 'cervical', 'stomach',
  'testicular', 'thyroid', 'uterine', 'lymphoma', 'myeloma', 'esophageal', 'head-neck',
  'bone', 'sarcoma', 'gallbladder', 'bile-duct', 'anal', 'penile', 'vaginal', 'vulvar',
  'eye', 'oral', 'throat', 'small-intestine', 'thymus',
];

export default function CancerDetailPage({ params }: { params: { id: string; locale: string } }) {
  if (!validIds.includes(params.id)) notFound();

  const cancerData = getCancerData(params.id);
  const t = useTranslations(`cancerDetails.${params.id}`);
  const tCommon = useTranslations('common');

  if (!cancerData) notFound();

  const HeroIcon = iconMap[cancerData.icon] || Activity;
  const contentImage = cancerData.contentImage || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800';

  return (
    <div className="min-h-screen bg-brand-50 pb-20">
      <div className="relative h-[50vh] w-full overflow-hidden md:h-[60vh]">
        <Image src={cancerData.image} alt={params.id} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 text-white md:p-16">
          <div className="container mx-auto">
            <Link
              href={localizedPath(params.locale, 'aboutCancer')}
              className="group mb-4 inline-flex items-center text-white/80 transition-all duration-300 hover:-translate-x-1 hover:text-white md:mb-6"
            >
              <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
              {tCommon('backToLibrary')}
            </Link>
            <div className="flex animate-fade-in-up items-end gap-4">
              <HeroIcon className="mb-1 hidden h-12 w-12 text-brand-300 sm:block md:h-16 md:w-16" />
              <h1 className="text-3xl font-bold capitalize leading-tight sm:text-4xl md:text-6xl">
                {t('title') === `cancerDetails.${params.id}.title` ? params.id.replace('-', ' ') : t('title')}
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
                <div className="relative aspect-video h-48 w-full shrink-0 overflow-hidden rounded-xl shadow-md md:h-auto md:w-1/3 md:aspect-square">
                  <Image src={contentImage} alt="Medical Detail" fill className="object-cover transition-transform duration-700 hover:scale-110" />
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
          </div>

          <div className="animate-fade-in-up space-y-6 delay-200">
            <div className="rounded-3xl border border-brand-100/50 bg-white p-6 shadow-xl lg:sticky lg:top-28">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-neutral-800">
                <Activity className="h-5 w-5 text-brand-500" />
                {t('statsTitle')}
              </h3>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 text-center transition-colors hover:border-brand-200">
                  <span className="mb-1 block text-2xl font-bold text-brand-600 md:text-3xl">{t('stat1.value')}</span>
                  <span className="text-xs font-medium text-neutral-500 md:text-sm">{t('stat1.label')}</span>
                </div>
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 text-center transition-colors hover:border-brand-200">
                  <span className="mb-1 block text-2xl font-bold text-brand-600 md:text-3xl">{t('stat2.value')}</span>
                  <span className="text-xs font-medium text-neutral-500 md:text-sm">{t('stat2.label')}</span>
                </div>
              </div>
              <div className="mt-8 border-t border-neutral-100 pt-6">
                <h4 className="mb-4 text-center font-semibold text-neutral-800">{t('ctaSidebarTitle')}</h4>
                <Link
                  href={localizedPath(params.locale, 'donate')}
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
