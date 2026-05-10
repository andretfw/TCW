'use client';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Heart, Users, Handshake, Star, ArrowRight, Gift, Receipt } from 'lucide-react';

export default function GetInvolvedPage() {
  const t = useTranslations('getInvolved');
  const locale = useLocale();
  const prefix = locale === 'es' ? '' : `/${locale}`;

  const ways = [
    {
      icon: Heart,
      title: t('donateTitle'),
      description: t('donateDesc'),
      link: `${prefix}/donar`,
      gradient: 'from-rose-400 to-red-500',
      shadow: 'shadow-rose-100',
      external: false
    },
    {
      icon: Users,
      title: t('volunteerTitle'),
      description: t('volunteerDesc'),
      link: `${prefix}/voluntarios`,
      gradient: 'from-violet-400 to-purple-500',
      shadow: 'shadow-purple-100',
      external: false
    },
    {
      icon: Handshake,
      title: t('peerTitle'),
      description: t('peerDesc'),
      link: `${prefix}/peer-support`,
      gradient: 'from-cyan-400 to-blue-500',
      shadow: 'shadow-cyan-100',
      external: false
    },
    {
      icon: Star,
      title: t('dreamTitle'),
      description: t('dreamDesc'),
      link: `${prefix}/support-dream`,
      gradient: 'from-amber-400 to-orange-500',
      shadow: 'shadow-orange-100',
      external: false
    },
    // ✨ NUEVO: Fundraise via Better Giving
    {
      icon: Gift,
      title: t('fundraiseTitle'),
      description: t('fundraiseDesc'),
      link: 'https://better.giving/donate/1293778', // Reemplaza con el link real de Better Giving si es otro
      gradient: 'from-emerald-400 to-green-500',
      shadow: 'shadow-emerald-100',
      external: true
    },
    // Redirección del 3.5%
    {
      icon: Receipt,
      title: t('taxTitle'),
      description: t('taxDesc'),
      link: `https://redirectioneaza.ro/tutticancerwarriors/`, // Enlace arreglado
      gradient: 'from-blue-400 to-indigo-500',
      shadow: 'shadow-blue-100',
      external: false
    }
  ];

  return (
    <div className="pt-20 min-h-screen bg-white">
      <section className="py-24 bg-gradient-to-br from-brand-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block p-4 rounded-full bg-brand-100 mb-6 animate-pulse">
             <Heart className="w-12 h-12 text-brand-600" fill="currentColor" />
          </div>
          <h1 className="text-6xl font-bold text-neutral-900 mb-6">
            {t('title')}
          </h1>
          <p className="text-2xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ways.map((way, idx) => {
              const Icon = way.icon;
              
              const CardContent = (
                <>
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${way.gradient} opacity-10 rounded-bl-full group-hover:scale-150 transition-transform duration-500`} />
                  
                  <div className={`w-16 h-16 bg-gradient-to-br ${way.gradient} rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-3xl font-bold text-neutral-900 mb-4 group-hover:text-brand-600 transition-colors">
                    {way.title}
                  </h3>
                  <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                    {way.description}
                  </p>
                  
                  <div className="flex items-center gap-3 font-bold text-lg group-hover:gap-5 transition-all mt-auto">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600 group-hover:from-brand-600 group-hover:to-purple-600">
                        {t('learnMore')}
                    </span>
                    <div className={`p-2 rounded-full bg-neutral-100 group-hover:bg-brand-100 text-neutral-900 group-hover:text-brand-600`}>
                        <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </>
              );

              const cardClasses = `group h-full flex flex-col relative overflow-hidden bg-white rounded-3xl p-10 border border-neutral-100 shadow-xl ${way.shadow} hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`;

              return way.external ? (
                <a key={idx} href={way.link} target="_blank" rel="noopener noreferrer" className={cardClasses}>
                  {CardContent}
                </a>
              ) : (
                <Link key={idx} href={way.link} className={cardClasses}>
                  {CardContent}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}