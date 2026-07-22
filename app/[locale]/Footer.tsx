'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Award, Facebook, FileText, Heart, Instagram, Mail, MapPin, Star, Twitter } from 'lucide-react';
import { localizedPath } from '@/lib/routes';

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();

  return (
    <footer className="bg-gradient-to-b from-neutral-900 to-black pb-10 pt-20 text-white">
      <div className="container mx-auto px-4">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <Link href={localizedPath(locale, 'home')} className="block">
              <div className="relative -ml-4 h-64 w-full max-w-md">
                <Image
                  src="/TCW_LOGO.png"
                  alt="Tutti Cancer Warriors"
                  fill
                  className="object-contain brightness-0 invert transition-transform duration-300 hover:scale-105"
                  priority
                />
              </div>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-neutral-400">{t('description')}</p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://www.facebook.com/people/Tutti-Cancer-Warriors/61574889407716/#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 transition-all hover:-translate-y-1 hover:bg-[#1877F2]"
              >
                <Facebook className="h-5 w-5 fill-current" />
              </a>
              <a
                href="https://www.instagram.com/tutticancerwarriors/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 transition-all hover:-translate-y-1 hover:bg-[#E4405F]"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/NGOTCW"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 transition-all hover:-translate-y-1 hover:bg-black"
              >
                <Twitter className="h-5 w-5 fill-current" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-6 inline-block border-b border-brand-600 pb-1 text-lg font-bold text-white">{t('quickLinks')}</h3>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>
                <Link href={localizedPath(locale, 'team')} className="flex items-center gap-2 transition-colors hover:text-brand-400">
                  <span className="h-1 w-1 rounded-full bg-brand-500" />
                  {tNav('team')}
                </Link>
              </li>
              <li>
                <Link href={localizedPath(locale, 'aboutCancer')} className="flex items-center gap-2 transition-colors hover:text-brand-400">
                  <span className="h-1 w-1 rounded-full bg-brand-500" />
                  {tNav('aboutCancer')}
                </Link>
              </li>
              <li>
                <Link href={localizedPath(locale, 'warriors')} className="flex items-center gap-2 transition-colors hover:text-brand-400">
                  <span className="h-1 w-1 rounded-full bg-brand-500" />
                  {tNav('warriors')}
                </Link>
              </li>
              <li>
                <Link href={localizedPath(locale, 'volunteers')} className="flex items-center gap-2 transition-colors hover:text-brand-400">
                  <span className="h-1 w-1 rounded-full bg-brand-500" />
                  {tNav('volunteers')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 inline-block border-b border-brand-600 pb-1 text-lg font-bold text-white">{t('contact')}</h3>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="flex items-start gap-3">
                <div className="shrink-0 rounded-lg bg-neutral-800 p-2 text-brand-500"><Mail className="h-4 w-4" /></div>
                <a href="mailto:tcw@tutticancerwarriors.org" className="mt-1 break-all transition-colors hover:text-white">
                  tcw@tutticancerwarriors.org
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="shrink-0 rounded-lg bg-neutral-800 p-2 text-brand-500"><MapPin className="h-4 w-4" /></div>
                <div className="mt-1">
                  <span className="block">{t('address')}</span>
                  <span className="mt-1 block text-xs text-neutral-500">CIF: 50156252</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="h-fit rounded-2xl border border-neutral-700 bg-neutral-800/50 p-5">
            <h3 className="mb-2 text-lg font-bold text-white">{t('supportTitle')}</h3>
            <p className="mb-4 text-sm leading-relaxed text-neutral-400">{t('supportText')}</p>
            <Link
              href={localizedPath(locale, 'donate')}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-center font-bold text-white shadow-lg transition-all hover:bg-brand-500 hover:shadow-brand-900/50"
            >
              <Heart className="h-4 w-4 fill-current transition-transform group-hover:scale-110" />
              {tNav('donate')}
            </Link>
          </div>
        </div>

        <div className="mb-8 mt-8 border-t border-neutral-800 pb-8 pt-12">
          <div className="flex flex-col items-center justify-center gap-10 md:flex-row md:gap-20">
            <a href="/reward.jpg" target="_blank" rel="noopener noreferrer" className="group flex cursor-pointer flex-col items-center text-center md:items-end md:text-right">
              <p className="mb-5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 transition-colors group-hover:text-brand-500 md:justify-end">
                <Award className="h-4 w-4 text-brand-500" />
                {t('recentAwards')}
              </p>
              <div className="relative h-32 w-56 opacity-90 drop-shadow-2xl transition-transform group-hover:scale-105 group-hover:opacity-100">
                <Image src="/reward.jpg" alt="Recent Award" fill className="object-contain" />
              </div>
            </a>

            <div className="hidden h-20 w-px bg-neutral-800 md:block" />

            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <p className="mb-5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 md:justify-start">
                <Star className="h-4 w-4 text-brand-500" />
                {t('partnersTitle')}
              </p>
              <div className="flex items-center gap-10">
                <a
                  href="https://www.gtracemarbella.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative h-20 w-32 cursor-pointer opacity-80 transition-all hover:scale-110 hover:opacity-100"
                >
                  <Image src="/gt-logo.jpg" alt="GT Race Sponsor" fill className="object-contain" />
                </a>
                <a
                  href="https://www.tuttifruttiwomen.art/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative h-20 w-32 cursor-pointer opacity-80 transition-all hover:scale-110 hover:opacity-100"
                >
                  <Image src="/tfw-logo.png" alt="Tutti Frutti Women" fill className="object-contain" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-neutral-500 md:flex-row">
            <p>&copy; {new Date().getFullYear()} Tutti Cancer Warriors. {t('copyright')}</p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link href={localizedPath(locale, 'privacy')} className="transition-colors hover:text-white">{t('privacy')}</Link>
              <Link href={localizedPath(locale, 'terms')} className="transition-colors hover:text-white">{t('terms')}</Link>
              <Link href={localizedPath(locale, 'peerPolicy')} className="transition-colors hover:text-white">{t('peerPolicy')}</Link>
              <span className="hidden text-neutral-700 md:inline">|</span>
              <Link
                href={localizedPath(locale, 'financials')}
                className="flex items-center gap-1 font-semibold text-neutral-400 transition-colors hover:text-brand-400"
              >
                <FileText className="h-3 w-3" />
                {t('financials')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
