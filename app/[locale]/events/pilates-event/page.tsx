'use client';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Flower2, Quote, Sparkles, ArrowRight, Users, Target, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PilatesEventPage() {
  const t = useTranslations('pilatesEvent');
  const locale = useLocale();
  const prefix = locale === 'es' ? '' : `/${locale}`;

  // Lista de fotos para el carrusel
  const carouselImages = [
    '/pilates-1.jpg',
    '/pilates-3.jpg',
    '/pilates-2.jpg',
    '/pilates-4.jpg'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden font-sans">
      
      {/* --- 1. HERO SECTION ANIMADO --- */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Fondo con animación de zoom lento (Ken Burns effect) */}
        <div className="absolute inset-0 z-0 animate-slow-zoom">
          <Image 
            src="/pilates-hero.jpg" 
            alt="Pilates Event GT Race" 
            fill 
            className="object-cover object-center brightness-[0.4]"
            priority
          />
        </div>
        
        {/* Degradado sobre la imagen para dar dramatismo */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent z-10 opacity-90" />

        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto flex flex-col items-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white backdrop-blur-md rounded-full text-sm font-bold mb-8 border border-white/20 shadow-xl">
            <Flower2 className="w-5 h-5 text-brand-300" />
            <span className="tracking-widest uppercase">{t('badge')}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-brand-300 mb-8 drop-shadow-2xl leading-tight">
            {t('title')}
          </h1>
          
          <div className="w-24 h-1.5 bg-brand-500 rounded-full mb-8 shadow-[0_0_15px_rgba(236,72,153,0.5)]" />
        </div>

        {/* Decoración SVG inferior curvada */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 translate-y-[1px]">
          <svg className="relative block w-full h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.06,155.32,120.4,242,100.8,269.8,94.49,297.6,85.2,321.39,56.44Z" fill="#f8fafc"></path>
          </svg>
        </div>
      </section>

      {/* --- 2. THE STORY / IMPACT SECTION --- */}
      <section className="py-24 relative bg-slate-50 z-30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            <div className="lg:col-span-5 relative">
              <div className="absolute -top-10 -left-10 text-brand-200/50">
                <Quote className="w-32 h-32 rotate-180" />
              </div>
              <h2 className="relative z-10 text-3xl md:text-5xl font-bold text-neutral-800 leading-tight">
                "{t('quote')}"
              </h2>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-600">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-neutral-900">Tutti Cancer Warriors</p>
                  <p className="text-brand-600 text-sm font-semibold uppercase tracking-wider">& GT Race Marbella</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 prose prose-lg md:prose-xl text-neutral-700">
              <p className="font-medium text-neutral-800 leading-relaxed mb-6">
                {t('p1')}
              </p>
              <p className="leading-relaxed border-l-4 border-brand-200 pl-6 my-8 italic">
                {t('p2')}
              </p>
            </div>

          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-neutral-200/30 border border-neutral-100 flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-brand-100/50">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-6"><Users className="w-8 h-8" /></div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-2">{t('stats.women')}</h3>
              <div className="w-10 h-1 bg-neutral-200 rounded-full" />
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-neutral-200/30 border border-neutral-100 flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-purple-100/50">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 mb-6"><Target className="w-8 h-8" /></div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-2">{t('stats.purpose')}</h3>
              <div className="w-10 h-1 bg-neutral-200 rounded-full" />
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-neutral-200/30 border border-neutral-100 flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-brand-100/50">
              <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-500 mb-6"><Heart className="w-8 h-8" /></div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-2">{t('stats.impact')}</h3>
              <div className="w-10 h-1 bg-neutral-200 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. GALERÍA CARRUSEL PREMIUM --- */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">{t('galleryTitle')}</h2>
            <p className="text-xl text-neutral-600">{t('gallerySubtitle')}</p>
          </div>

          {/* Contenedor del Carrusel */}
          <div className="relative w-full h-[500px] md:h-[700px] rounded-3xl overflow-hidden shadow-2xl bg-neutral-900 group">
            
            {/* Imágenes con transición */}
            {carouselImages.map((src, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  currentIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                {/* Fondo borroso mágico */}
                <Image src={src} alt="Background Blur" fill className="object-cover opacity-40 blur-2xl scale-110" />
                
                {/* Imagen real entera (object-contain evita recortes) */}
                <Image src={src} alt={`Pilates Event ${index + 1}`} fill className="object-contain p-4 md:p-8" />
              </div>
            ))}

            {/* Controles: Flecha Izquierda */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 bg-white/10 hover:bg-white/90 text-white hover:text-brand-600 backdrop-blur-md rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Controles: Flecha Derecha */}
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 bg-white/10 hover:bg-white/90 text-white hover:text-brand-600 backdrop-blur-md rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Controles: Puntos inferiores */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    currentIndex === index ? 'w-10 h-3 bg-brand-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]' : 'w-3 h-3 bg-white/50 hover:bg-white'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
            
          </div>
        </div>
      </section>

      {/* --- 4. CALL TO ACTION (DONAR) --- */}
      <section className="py-32 bg-neutral-950 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="49" stroke="white" strokeWidth="2"/>
            <circle cx="50" cy="50" r="35" stroke="white" strokeWidth="2" strokeDasharray="4 4"/>
          </svg>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <Heart className="w-16 h-16 text-brand-500 mx-auto mb-8 animate-pulse" fill="currentColor" />
          {/* ✨ AQUÍ ESTÁ EL CAMBIO ✨ */}
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-10 max-w-3xl mx-auto leading-tight">
            {t('ctaTitle')}
          </h2>
          <Link 
            href={`${prefix}/donar`}
            className="group inline-flex items-center justify-center gap-3 px-12 py-5 bg-brand-600 text-white text-xl font-bold rounded-full hover:bg-brand-500 transition-all shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:shadow-[0_0_40px_rgba(236,72,153,0.5)] hover:-translate-y-1"
          >
            {t('button')}
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>

      {/* --- ESTILOS PERSONALIZADOS --- */}
      <style jsx global>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s ease-in-out infinite alternate;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}