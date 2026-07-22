'use client';

import Image from 'next/image';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';
import {ChevronDown, ExternalLink, Globe, Menu, X} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {localizedPath, switchLocalePath} from '@/lib/routes';

type MenuLink = {
  href: string;
  label: string;
  external?: boolean;
};

type MenuItem =
  | {href: string; label: string; dropdown?: never}
  | {label: string; dropdown: MenuLink[]; href?: never};

const FUNDRAISER_URL = 'https://better.giving/donate/1293778';

const extraNavCopy = {
  en: {
    supportDream: 'Support a Dream',
    startFundraiser: 'Start a Fundraiser for TCW',
  },
  ro: {
    supportDream: 'Susține un vis',
    startFundraiser: 'Creează o strângere de fonduri pentru TCW',
  },
  es: {
    supportDream: 'Apoya un sueño',
    startFundraiser: 'Inicia una recaudación para TCW',
  },
} as const;

export default function Header({locale}: {locale: string}) {
  const t = useTranslations('nav');
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const languages = [
    {code: 'es', name: 'Español', flag: '🇪🇸'},
    {code: 'en', name: 'English', flag: '🇬🇧'},
    {code: 'ro', name: 'Română', flag: '🇷🇴'},
  ];

  const currentLang =
    languages.find((language) => language.code === locale) ?? languages[0];
  const currentExtraCopy =
    extraNavCopy[locale as keyof typeof extraNavCopy] ?? extraNavCopy.en;
  const isHomepage = ['/es', '/en', '/ro', '/'].includes(pathname);

  const menuItems: MenuItem[] = [
    {href: localizedPath(locale, 'home'), label: t('home')},
    {href: localizedPath(locale, 'team'), label: t('team')},
    {
      label: t('aboutCancer'),
      dropdown: [
        {
          href: localizedPath(locale, 'aboutCancer'),
          label: t('learnAboutCancer'),
        },
        {
          href: localizedPath(locale, 'understandingDiagnosis'),
          label: t('understandingDiagnosis'),
        },
        {
          href: localizedPath(locale, 'questionsForDoctor'),
          label: t('questionsForDoctor'),
        },
        {
          href: localizedPath(locale, 'emotionalWellBeing'),
          label: t('emotionalWellBeing'),
        },
        {
          href: localizedPath(locale, 'awarenessCalendar'),
          label: t('awarenessCalendar'),
        },
      ],
    },
    {
      label: t('getInvolved'),
      dropdown: [
        {
          href: localizedPath(locale, 'getInvolved'),
          label: t('getInvolved'),
        },
        {href: localizedPath(locale, 'donate'), label: t('donate')},
        {
          href: localizedPath(locale, 'supportDream'),
          label: currentExtraCopy.supportDream,
        },
        {href: localizedPath(locale, 'volunteers'), label: t('volunteer')},
        {
          href: localizedPath(locale, 'peerSupport'),
          label: t('peerSupport'),
        },
        {
          href: FUNDRAISER_URL,
          label: currentExtraCopy.startFundraiser,
          external: true,
        },
        {
          href: 'https://paragraph.com/@tutticancerwarriors',
          label: t('newsletter'),
          external: true,
        },
      ],
    },
    {
      label: t('warriorsHub'),
      dropdown: [
        {
          href: localizedPath(locale, 'connectSurvivor'),
          label: t('connectSurvivor'),
        },
        {
          href: localizedPath(locale, 'dreamApplication'),
          label: t('dreamApplication'),
        },
        {
          href: localizedPath(locale, 'shareJourney'),
          label: t('shareJourney'),
        },
        {
          href: localizedPath(locale, 'moodBoost'),
          label: t('moodBoost'),
        },
      ],
    },
    {
      label: t('events'),
      dropdown: [
        {
          href: localizedPath(locale, 'mensHealth'),
          label: t('mensHealth'),
        },
        {
          href: localizedPath(locale, 'kidneyCancer'),
          label: t('kidneyCancer'),
        },
        {href: localizedPath(locale, 'pilates'), label: t('pilates')},
      ],
    },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.push(switchLocalePath(pathname, newLocale));
    router.refresh();
    setIsLangOpen(false);
    setIsMobileMenuOpen(false);
  };

  const closeMenus = () => {
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const navTextClass =
    isScrolled || !isHomepage
      ? 'text-neutral-700 hover:text-brand-600'
      : 'text-white hover:text-brand-200 drop-shadow-md';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white shadow-lg'
          : isHomepage
            ? 'bg-transparent'
            : 'bg-white/95 shadow-md backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div
          className={`flex items-center justify-between transition-all duration-500 ${
            isScrolled ? 'h-24' : 'h-36'
          }`}
        >
          <Link
            href={localizedPath(locale, 'home')}
            className="flex items-center"
            onClick={closeMenus}
          >
            <Image
              src="/TCW_LOGO.png"
              alt="Tutti Cancer Warriors"
              width={isScrolled ? 280 : 380}
              height={isScrolled ? 84 : 114}
              className="w-auto transition-all duration-500"
              priority
            />
          </Link>

          <nav
            className="hidden items-center gap-6 md:flex"
            ref={dropdownRef}
          >
            {menuItems.map((item) => {
              if (!item.dropdown) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`font-medium transition-colors ${navTextClass}`}
                  >
                    {item.label}
                  </Link>
                );
              }

              const isOpen = openDropdown === item.label;

              return (
                <div key={item.label} className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDropdown(isOpen ? null : item.label)
                    }
                    className={`flex items-center gap-1 py-2 font-medium transition-colors ${navTextClass}`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`absolute left-0 top-full mt-2 w-72 origin-top overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-xl transition-all duration-200 ${
                      isOpen
                        ? 'translate-y-0 scale-y-100 opacity-100'
                        : 'pointer-events-none -translate-y-2 scale-y-0 opacity-0'
                    }`}
                  >
                    <div className="py-2">
                      {item.dropdown.map((subItem) =>
                        subItem.external ? (
                          <a
                            key={subItem.href}
                            href={subItem.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between px-4 py-3 text-neutral-700 transition-all hover:bg-brand-50 hover:pl-6 hover:text-brand-600"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {subItem.label}
                            <ExternalLink className="h-3 w-3 opacity-50" />
                          </a>
                        ) : (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block px-4 py-3 text-neutral-700 transition-all hover:bg-brand-50 hover:pl-6 hover:text-brand-600"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {subItem.label}
                          </Link>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangOpen((open) => !open)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                  isScrolled || !isHomepage
                    ? 'hover:bg-neutral-100'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
                aria-label="Change language"
              >
                <Globe
                  className={`h-5 w-5 ${
                    isScrolled || !isHomepage
                      ? 'text-neutral-600'
                      : 'text-white'
                  }`}
                />
                <span className="text-xl">{currentLang.flag}</span>
              </button>

              {isLangOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-neutral-100 bg-white py-2 shadow-xl">
                  {languages.map((language) => (
                    <button
                      type="button"
                      key={language.code}
                      onClick={() => changeLanguage(language.code)}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-brand-50 ${
                        language.code === locale ? 'bg-brand-50' : ''
                      }`}
                    >
                      <span className="text-2xl">{language.flag}</span>
                      <span className="font-medium text-neutral-700">
                        {language.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href={localizedPath(locale, 'donate')}
              className="rounded-full bg-brand-600 px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:bg-brand-700 hover:shadow-lg"
            >
              {t('donate')}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className={`p-2 md:hidden ${
              isScrolled || !isHomepage ? 'text-neutral-900' : 'text-white'
            }`}
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="max-h-[calc(100vh-6rem)] overflow-y-auto rounded-b-2xl bg-white py-4 shadow-xl md:hidden">
            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => {
                if (!item.dropdown) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={closeMenus}
                      className="rounded-lg px-4 py-2 text-neutral-700 hover:bg-neutral-50 hover:text-brand-600"
                    >
                      {item.label}
                    </Link>
                  );
                }

                const isOpen = openDropdown === item.label;

                return (
                  <div key={item.label}>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdown(isOpen ? null : item.label)
                      }
                      className="flex w-full items-center justify-between rounded-lg px-4 py-2 text-left text-neutral-700 hover:bg-neutral-50"
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="space-y-1 pl-4">
                        {item.dropdown.map((subItem) =>
                          subItem.external ? (
                            <a
                              key={subItem.href}
                              href={subItem.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={closeMenus}
                              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-neutral-600 hover:bg-brand-50 hover:text-brand-600"
                            >
                              {subItem.label}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={closeMenus}
                              className="block rounded-lg px-4 py-2 text-sm text-neutral-600 hover:bg-brand-50 hover:text-brand-600"
                            >
                              {subItem.label}
                            </Link>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="mt-2 border-t border-neutral-100 px-4 py-3">
                <div className="flex gap-2">
                  {languages.map((language) => (
                    <button
                      type="button"
                      key={language.code}
                      onClick={() => changeLanguage(language.code)}
                      className={`rounded-lg px-3 py-2 ${
                        language.code === locale
                          ? 'bg-brand-100'
                          : 'bg-neutral-100'
                      }`}
                    >
                      {language.flag}
                    </button>
                  ))}
                </div>
              </div>

              <Link
                href={localizedPath(locale, 'donate')}
                onClick={closeMenus}
                className="mx-4 mt-2 rounded-full bg-brand-600 px-6 py-3 text-center font-semibold text-white hover:bg-brand-700"
              >
                {t('donate')}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
