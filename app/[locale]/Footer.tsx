'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Facebook, Instagram, Twitter, Mail, MapPin, Heart, FileText } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  
  const locale = useLocale();
  const prefix = locale === 'es' ? '' : `/${locale}`;

  return (
    <footer className="bg-gradient-to-b from-neutral-900 to-black text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. Brand & Social & PARTNERS */}
          <div className="space-y-6">
            <Link href={`${prefix}/`} className="block">
                {/* Contenedor del Logo */}
                <div className="relative h-48 w-full max-w-md"> 
                    <Image 
                    src="/TCW_LOGO.png" 
                    alt="Tutti Cancer Warriors" 
                    fill
                    className="object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                    />
                </div>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              {t('description')}
            </p>
                        
            {/* Social Icons */}
            <div className="flex gap-4 pt-2">
              <a href="https://www.facebook.com/people/Tutti-Cancer-Warriors/61574889407716/#" target="_blank" rel="noopener noreferrer" 
                className="w-10 h-10 bg-neutral-800 hover:bg-[#1877F2] rounded-full flex items-center justify-center transition-all hover:-translate-y-1">
                <Facebook className="w-5 h-5 fill-current" />
              </a>
              <a href="https://www.instagram.com/tutticancerwarriors/" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 hover:bg-[#E4405F] rounded-full flex items-center justify-center transition-all hover:-translate-y-1">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://x.com/NGOTCW" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 hover:bg-black rounded-full flex items-center justify-center transition-all hover:-translate-y-1">
                <Twitter className="w-5 h-5 fill-current" />
              </a>
            </div>

            {/* PARTNERS / CERTIFICACIONES */}
            <div className="pt-6 border-t border-neutral-800 mt-6">
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-3">
                    {t('verified')}
                </p>
                <div className="flex items-center gap-4">
                    <a href="https://www.kraken.com/" target="_blank" rel="noopener noreferrer" className="block transition-transform hover:scale-105">
                        <div className="relative h-14 w-14 rounded-full overflow-hidden border border-neutral-700 bg-white">
                            <Image src="/kraken-badge.jpg" alt="Kraken Verified" fill className="object-cover" />
                        </div>
                    </a>
                    <a href="https://www.worldpatientsalliance.org/" target="_blank" rel="noopener noreferrer" className="block transition-transform hover:scale-105">
                        <div className="relative h-14 w-14">
                            <Image src="/wpa-logo.png" alt="WPA Member" fill className="object-contain" />
                        </div>
                    </a>
                </div>
            </div>
          </div>

{/* 2. Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white border-b border-brand-600 inline-block pb-1">
                {t('quickLinks')}
            </h3>
            <ul className="space-y-3 text-neutral-400 text-sm">
              {/* ✨ NUESTRO ENLACE AL TEAM ✨ */}
              <li><Link href={`${prefix}/team`} className="hover:text-brand-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-brand-500 rounded-full"></span>{tNav('team')}</Link></li>
              
              <li><Link href={`${prefix}/sobre-cancer`} className="hover:text-brand-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-brand-500 rounded-full"></span>{tNav('aboutCancer')}</Link></li>
              <li><Link href={`${prefix}/warriors`} className="hover:text-brand-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-brand-500 rounded-full"></span>{tNav('warriors')}</Link></li>
              <li><Link href={`${prefix}/voluntarios`} className="hover:text-brand-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-brand-500 rounded-full"></span>{tNav('volunteers')}</Link></li>
            </ul>
          </div>
          
          {/* 3. Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white border-b border-brand-600 inline-block pb-1">
                {t('contact')}
            </h3>
            <ul className="space-y-4 text-neutral-400 text-sm">
              <li className="flex items-start gap-3">
                <div className="p-2 bg-neutral-800 rounded-lg text-brand-500 shrink-0"><Mail className="w-4 h-4" /></div>
                <a href="mailto:tcw@tutticancerwarriors.org" className="hover:text-white transition-colors mt-1 break-all">tcw@tutticancerwarriors.org</a>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 bg-neutral-800 rounded-lg text-brand-500 shrink-0"><MapPin className="w-4 h-4" /></div>
                <div className="mt-1">
                    <span className="block">{t('address')}</span>
                    <span className="text-xs text-neutral-500 mt-1 block">CIF: 50156252</span>
                </div>
              </li>
              {/* ELIMINADO EL BLOQUE DE TELÉFONO */}
            </ul>
          </div>

          {/* 4. CTA Box */}
          <div className="bg-neutral-800/50 rounded-2xl p-5 border border-neutral-700 h-fit">
            <h3 className="font-bold text-lg mb-2 text-white">{t('supportTitle')}</h3>
            <p className="text-neutral-400 text-sm mb-4 leading-relaxed">
              {t('supportText')}
            </p>
            <Link
              href={`${prefix}/donar`}
              className="group flex items-center justify-center gap-2 w-full px-5 py-3 bg-brand-600 text-white font-bold rounded-xl text-center hover:bg-brand-500 transition-all shadow-lg hover:shadow-brand-900/50"
            >
              <Heart className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
              {tNav('donate')}
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
            <p>&copy; {new Date().getFullYear()} Tutti Cancer Warriors. {t('copyright')}</p>
            
            {/* Lista de enlaces legales + Financials */}
            <div className="flex flex-wrap justify-center gap-6 items-center">
              <Link href={`${prefix}/privacy`} className="hover:text-white transition-colors">{t('privacy')}</Link>
              <Link href={`${prefix}/terms`} className="hover:text-white transition-colors">{t('terms')}</Link>
              <Link href={`${prefix}/peer-policy`} className="hover:text-white transition-colors">{t('peerPolicy')}</Link>
              
              {/* Separador visual */}
              <span className="hidden md:inline text-neutral-700">|</span>
              
              {/* ✅ ENLACE A FINANCIALS (Activo) */}
              <Link 
                href={`${prefix}/financials`} 
                className="hover:text-brand-400 transition-colors flex items-center gap-1 font-semibold text-neutral-400"
              >
                <FileText className="w-3 h-3" />
                {t('financials')}
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    </footer>
  );
}