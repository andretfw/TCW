'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Globe, ChevronDown, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations('nav'); // Usamos las traducciones del bloque "nav"
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const prefix = locale === 'es' ? '' : `/${locale}`;

  const isHomepage = pathname === '/' || pathname === '/es' || pathname === '/en' || pathname === '/ro';

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ro', name: 'Română', flag: '🇷🇴' },
  ];

  const currentLang = languages.find(lang => lang.code === locale) || languages[0];

  // ✅ LÓGICA DE CAMBIO DE IDIOMA (MANTENIDA)
  const switchLanguage = (newLocale: string) => {
    const segments = pathname.split('/');
    if (['es', 'en', 'ro'].includes(segments[1])) {
      segments.splice(1, 1);
    }
    const pathWithoutLocale = segments.join('/') || '/';
    const newPath = newLocale === 'es' 
      ? pathWithoutLocale 
      : `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.push(newPath);
    router.refresh();
    setIsLangOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

// ✅ MENÚ TRADUCIDO AL 100%
  // Ahora usamos t('clave') en lugar de texto en inglés
  const menuItems = [
    { href: `${prefix}/`, label: t('home'), dropdown: null },
    { href: `${prefix}/team`, label: t('team'), dropdown: null }, // ✨ ¡AQUÍ ESTÁ NUESTRO BOTÓN DE TEAM! ✨
    {
      label: t('aboutCancer'),
      dropdown: [
        { href: `${prefix}/sobre-cancer`, label: t('learnAboutCancer') },
        { href: `${prefix}/entender-diagnostico`, label: t('understandingDiagnosis') },
        { href: `${prefix}/preguntas-doctor`, label: t('questionsForDoctor') },
        { href: `${prefix}/bienestar-emocional`, label: t('emotionalWellBeing') },
        { href: `${prefix}/calendario-cancer`, label: t('awarenessCalendar') },
      ]
    },
    
    {
      label: t('getInvolved'), // Traducido
      dropdown: [
        { href: `${prefix}/involucrate`, label: t('getInvolved') },
        { href: `${prefix}/donar`, label: t('donate') },
        { href: `${prefix}/voluntarios`, label: t('volunteer') },
        { href: `${prefix}/peer-support`, label: t('peerSupport') },
        // { href: `${prefix}/support-dream`, label: t('supportDream') }, //
        { 
          href: 'https://paragraph.com/@tutticancerwarriors', 
          label: t('newsletter'), 
          external: true 
        },
      ]
    },
    {
      label: t('warriorsHub'), // Traducido
      dropdown: [
        { href: `${prefix}/connect-survivor`, label: t('connectSurvivor') },
        { href: `${prefix}/dream-application`, label: t('dreamApplication') },
        { href: `${prefix}/share-journey`, label: t('shareJourney') },
        { href: `${prefix}/warrior-mood-boost`, label: t('moodBoost') },
      ]
    },
    {
      label: t('events'), // Traducido
      dropdown: [
        { href: `${prefix}/mens-health-week`, label: t('mensHealth') },
        { href: `${prefix}/world-kidney-cancer-day`, label: t('kidneyCancer') },
        { href: `${prefix}/events/pilates-event`, label: t('pilates') },
      ]
    },
  ];

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white shadow-lg' 
        : isHomepage 
          ? 'bg-transparent' 
          : 'bg-white/95 backdrop-blur-sm shadow-md'
    }`}>
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between transition-all duration-500 ${
          isScrolled ? 'h-24' : 'h-36'
        }`}>
          
          <Link href={`${prefix}/`} className="flex items-center">
            <Image 
              src="/TCW_LOGO.png" 
              alt="Tutti Cancer Warriors" 
              width={isScrolled ? 280 : 380}
              height={isScrolled ? 84 : 114}
              className="transition-all duration-500 w-auto"
              priority
            />
          </Link>
          
          <nav className="hidden md:flex items-center gap-6" ref={dropdownRef}>
            {menuItems.map((item, idx) => (
              item.dropdown ? (
                <div key={idx} className="relative">
                  <button 
                    onClick={() => toggleDropdown(item.label)}
                    className={`flex items-center gap-1 font-medium transition-colors py-2 ${
                      isScrolled || !isHomepage
                        ? 'text-neutral-700 hover:text-brand-600'
                        : 'text-white hover:text-brand-200 drop-shadow-md'
                    }`}
                  >
                    {item.label}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                      openDropdown === item.label ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  <div className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-neutral-100 overflow-hidden transition-all duration-300 origin-top ${
                    openDropdown === item.label 
                      ? 'opacity-100 scale-y-100 translate-y-0' 
                      : 'opacity-0 scale-y-0 -translate-y-2 pointer-events-none'
                  }`}>
                    <div className="py-2">
                      {item.dropdown.map((subItem, subIdx) => (
                        subItem.external ? (
                          <a
                            key={subIdx}
                            href={subItem.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-3 text-neutral-700 hover:bg-brand-50 hover:text-brand-600 transition-all hover:pl-6 flex items-center justify-between"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {subItem.label}
                            <ExternalLink className="w-3 h-3 opacity-50" />
                          </a>
                        ) : (
                          <Link
                            key={subIdx}
                            href={subItem.href}
                            className="block px-4 py-3 text-neutral-700 hover:bg-brand-50 hover:text-brand-600 transition-all hover:pl-6"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {subItem.label}
                          </Link>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={idx}
                  href={item.href!}
                  className={`font-medium transition-colors ${
                    isScrolled || !isHomepage
                      ? 'text-neutral-700 hover:text-brand-600'
                      : 'text-white hover:text-brand-200 drop-shadow-md'
                  }`}
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {/* Right side (Idioma y Donar) */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isScrolled || !isHomepage
                    ? 'hover:bg-neutral-100'
                    : 'hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                <Globe className={`w-5 h-5 ${
                  isScrolled || !isHomepage ? 'text-neutral-600' : 'text-white'
                }`} />
                <span className="text-xl">{currentLang.flag}</span>
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 z-50 border border-neutral-100 animate-fadeIn">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => switchLanguage(lang.code)}
                      className={`w-full px-4 py-3 text-left hover:bg-brand-50 flex items-center gap-3 transition-all ${
                        lang.code === locale ? 'bg-brand-50' : ''
                      }`}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="font-medium text-neutral-700">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href={`${prefix}/donar`}
              className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-700 hover:shadow-lg hover:scale-105 transition-all"
            >
              {t('donate')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 ${
              isScrolled || !isHomepage ? 'text-neutral-900' : 'text-white'
            }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 bg-white rounded-b-2xl shadow-xl animate-slideDown">
            <nav className="flex flex-col gap-2">
              {menuItems.map((item, idx) => (
                item.dropdown ? (
                  <div key={idx}>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className="w-full px-4 py-2 text-left text-neutral-700 hover:bg-neutral-50 rounded-lg flex items-center justify-between"
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                        openDropdown === item.label ? 'rotate-180' : ''
                      }`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${
                      openDropdown === item.label ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="pl-4 mt-1 space-y-1">
                        {item.dropdown.map((subItem, subIdx) => (
                          subItem.external ? (
                            <a
                              key={subIdx}
                              href={subItem.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block px-4 py-2 text-sm text-neutral-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all flex items-center gap-2"
                            >
                              {subItem.label} <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <Link
                              key={subIdx}
                              href={subItem.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block px-4 py-2 text-sm text-neutral-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                            >
                              {subItem.label}
                            </Link>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={idx}
                    href={item.href!}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 text-neutral-700 hover:text-brand-600 hover:bg-neutral-50 rounded-lg"
                  >
                    {item.label}
                  </Link>
                )
              ))}
              
              <div className="px-4 py-2 border-t border-neutral-100 mt-2">
                <div className="flex gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { switchLanguage(lang.code); setIsMobileMenuOpen(false); }}
                      className={`px-3 py-2 rounded-lg transition-all ${
                        lang.code === locale ? 'bg-brand-100' : 'bg-neutral-100'
                      }`}
                    >
                      {lang.flag}
                    </button>
                  ))}
                </div>
              </div>
              
              <Link
                href={`${prefix}/donar`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="mx-4 mt-2 px-6 py-3 bg-brand-600 text-white font-semibold rounded-full text-center hover:bg-brand-700 transition-all"
              >
                {t('donate')}
              </Link>
            </nav>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
}