'use client';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function TeamPage() {
  const t = useTranslations('teamPage');
  
  // Añadimos esto para saber en qué idioma estamos y poner bien el enlace
  const locale = useLocale();
  const prefix = locale === 'es' ? '' : `/${locale}`;

  // Cargamos los 3 miembros
  const teamMembers = [
    { id: '1', name: t('members.1.name'), role: t('members.1.role'), image: t('members.1.image'), description: t('members.1.description') },
    { id: '2', name: t('members.2.name'), role: t('members.2.role'), image: t('members.2.image'), description: t('members.2.description') },
    { id: '3', name: t('members.3.name'), role: t('members.3.role'), image: t('members.3.image'), description: t('members.3.description') }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center pb-24">
      
      {/* --- 1. SECCIÓN HERO --- */}
      <section className="relative w-full pt-32 pb-20 bg-white overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-40">
          <svg className="absolute left-0 top-0 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 transform text-purple-50" fill="currentColor" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg className="absolute right-0 bottom-0 h-[30rem] w-[30rem] translate-x-1/3 translate-y-1/3 transform text-brand-50" fill="currentColor" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <span className="text-brand-600 font-bold tracking-wider uppercase text-sm mb-4 block">Tutti Cancer Warriors</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-neutral-900 mb-6 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* --- 2. SECCIÓN DE TARJETAS 3D --- */}
      <section className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {teamMembers.map((member) => (
            <div key={member.id} className="group h-[480px] w-full [perspective:1000px]">
              
              <div className="relative h-full w-full rounded-2xl shadow-xl transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] cursor-pointer">
                
                {/* --- CARA FRONTAL --- */}
                <div className="absolute inset-0 h-full w-full rounded-2xl bg-white [backface-visibility:hidden] border border-neutral-100 flex flex-col items-center justify-center p-8">
                  <div className="w-48 h-48 rounded-full overflow-hidden mb-8 border-4 border-purple-50 shadow-inner">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover object-center" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2 text-center">{member.name}</h3>
                  <div className="w-12 h-1 bg-brand-500 rounded-full mb-3"></div>
                  <p className="text-brand-600 font-semibold uppercase tracking-wide text-sm text-center">
                    {member.role}
                  </p>
                  {/* ✨ AQUÍ ESTÁ EL TEXTO TRADUCIDO ✨ */}
                  <p className="text-xs text-neutral-400 mt-6 font-medium tracking-wide">{t('hoverHint')}</p>
                </div>

                {/* --- CARA TRASERA --- */}
                <div className="absolute inset-0 h-full w-full rounded-2xl bg-gradient-to-br from-brand-600 to-purple-800 px-8 py-10 text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-2xl flex flex-col justify-between items-center">
                  <div className="flex flex-col items-center w-full">
                    <svg className="w-10 h-10 text-brand-300 mb-6 opacity-40" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-brand-200 text-sm mb-6 uppercase tracking-wider font-medium">{member.role}</p>
                    <p className="text-base leading-relaxed text-white/90 font-light max-w-sm">
                      {member.description}
                    </p>
                  </div>
                  <div className="flex space-x-4 mt-6">
                    <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:-translate-y-1 transition-all duration-300">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:-translate-y-1 transition-all duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- 3. SECCIÓN CALL TO ACTION (AHORA 100% TRADUCIDA) --- */}
      <section className="mt-32 w-full max-w-4xl mx-auto px-4 text-center">
        <div className="bg-brand-50 rounded-3xl p-10 md:p-16 border border-brand-100 relative overflow-hidden">
          <svg className="absolute top-0 right-0 text-brand-200 opacity-50 transform translate-x-1/2 -translate-y-1/2" width="200" height="200" fill="currentColor" viewBox="0 0 100 100">
             <path d="M50 0 L100 50 L50 100 L0 50 Z" />
          </svg>
          
          <div className="relative z-10 flex flex-col items-center">
            {/* ✨ Títulos y textos traducidos ✨ */}
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">{t('cta.title')}</h2>
            <p className="text-lg text-neutral-600 mb-8 max-w-xl mx-auto leading-relaxed">
              {t('cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href={`${prefix}/involucrate`} 
                className="px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-300"
              >
                {t('cta.buttonInvolved')}
              </Link>
              <Link 
                href={`${prefix}/donar`} 
                className="px-8 py-4 bg-white text-brand-600 font-bold rounded-xl border-2 border-brand-600 hover:bg-brand-50 transition-colors duration-300"
              >
                {t('cta.buttonDonate')}
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}