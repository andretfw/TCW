'use client';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Heart, CreditCard, Building2, Bitcoin, ArrowRight, Check, FileText } from 'lucide-react';
import { useState } from 'react';

export default function DonatePageClient() {
  const t = useTranslations('donatePage'); // Usamos el hook de traducción
  const [copied, setCopied] = useState('');

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const cryptoAddresses = [
    { 
      name: 'Ethereum (ETH)', 
      address: '0x54b9694cebc596d8c712ab225347343e2a7bd7e6',
      icon: '⟠'
    },
    { 
      name: 'Bitcoin (BTC)', 
      address: '3BuBreK55MS2fF9MfzMTXL4cG6GQDot3aD',
      icon: '₿'
    },
    { 
      name: 'USD Coin (USDC - Ethereum)', 
      address: '0x54b9694cebc596d8c712ab225347343e2a7bd7e6',
      icon: '$'
    },
    { 
      name: 'Other (MetaMask) Wallet', 
      address: '0x66e4cFE637e73A4C5F34fdf6539c849c3366a0AB',
      icon: '🦊'
    },
  ];

  return (
    <div className="pt-20 min-h-screen bg-neutral-50">
      
      {/* Hero Section */}
      <section className="relative py-24 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-purple-50 to-white opacity-70" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-brand-100 rounded-full mb-8 animate-pulse">
            <Heart className="w-8 h-8 text-brand-600 fill-current" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 mb-6 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Better Giving Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-neutral-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full -mr-32 -mt-32 opacity-50 group-hover:scale-110 transition-transform" />
                
                <h2 className="text-3xl font-bold text-neutral-900 mb-6 relative z-10 text-center md:text-left">
                  {t('betterGivingTitle')}
                </h2>
                
                <div className="md:flex gap-8 items-center relative z-10">
                    <div className="flex-1">
                          <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
                            {t.rich('betterGivingDesc', {
                                link: (chunks) => <a href="https://better.giving/donate/1293778" target="_blank" rel="noopener noreferrer" className="text-brand-600 font-bold hover:underline decoration-2 underline-offset-2">{chunks}</a>,
                                strong: (chunks) => <strong>{chunks}</strong>
                            })}
                        </p>
                        <a
                            href="https://better.giving/donate/1293778"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-brand-600 text-white font-bold rounded-xl shadow-lg hover:bg-brand-700 hover:shadow-brand-200 hover:-translate-y-1 transition-all"
                        >
                            {t('btnBetterGiving')}
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>
                    <div className="hidden md:block w-px h-32 bg-neutral-200" />
                    <div className="mt-8 md:mt-0 flex flex-col items-center justify-center shrink-0">
                          <Image src="/logo.png" alt="Better Giving" width={80} height={80} className="mb-3 h-20 w-20 rounded-2xl shadow-md" />
                          <span className="font-bold text-neutral-900">{t('verified')}</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ NUEVO DISEÑO FORMULARIO 230 (Rumanía) */}
      <section className="py-10">
        <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
                {/* Tarjeta con diseño dividido */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                    
                    {/* Lado Izquierdo: Información */}
                    <div className="p-10 md:w-3/5 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider w-fit mb-4 border border-blue-100">
                           🇷🇴 {t('taxBadge')}
                        </div>
                        <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                            {t('taxTitle')}
                        </h2>
                        <p className="text-neutral-600 mb-8 leading-relaxed">
                            {t.rich('taxDesc', {
                                strong: (chunks) => <strong>{chunks}</strong>
                            })}
                        </p>
                        <a 
                            href="https://redirectioneaza.ro/tutticancerwarriors/"
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                        >
                            <span>{t('btnTax')}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>

                    {/* Lado Derecho: Visual Atractivo */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 md:w-2/5 flex flex-col items-center justify-center text-white relative overflow-hidden">
                        {/* Círculos decorativos de fondo */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-xl -ml-10 -mb-10 pointer-events-none"></div>
                        
                        <div className="relative z-10 text-center">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner border border-white/30">
                                <FileText className="w-10 h-10 text-white" />
                            </div>
                            <div className="text-6xl font-black tracking-tighter mb-1">230</div>
                            <div className="text-blue-100 font-medium tracking-widest uppercase text-sm">Form</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* PayPal & Bank Transfer Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            
            {/* PayPal Card */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-neutral-100 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-6 text-[#003087]">
                    <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-3">{t('paypalTitle')}</h3>
                <p className="text-neutral-600 mb-8 flex-grow">
                    {t('paypalDesc')}
                </p>
                <a
                href="https://www.paypal.com/donate/?hosted_button_id=6JXEDTNATW3PS"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-[#FFC439] hover:bg-[#F6B828] text-neutral-900 font-bold rounded-xl transition-colors shadow-sm"
                >
                    <span>{t('btnPaypal')}</span>
                </a>
            </div>

            {/* Bank Transfer Card - IBAN Updated */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-neutral-100 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-700">
                    <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-3">{t('bankTitle')}</h3>
                
                <div className="space-y-4 mb-6 flex-grow">
                    <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                        <div className="text-xs font-bold text-neutral-400 uppercase mb-1">{t('usdAccount')}</div>
                        <div className="flex justify-between items-center">
                            <span className="font-mono text-sm font-medium text-neutral-800 break-all mr-2">RO36BTRLUSDCRTOCS5281601</span>
                            <button onClick={() => copyToClipboard('RO36BTRLUSDCRTOCS5281601', 'usd')} className="text-blue-600 hover:bg-blue-50 p-1 rounded">
                                {copied === 'usd' ? <Check size={16} /> : <span className="text-xs font-bold">{t('copy')}</span>}
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                        <div className="text-xs font-bold text-neutral-400 uppercase mb-1">{t('eurAccount')}</div>
                        <div className="flex justify-between items-center">
                            <span className="font-mono text-sm font-medium text-neutral-800 break-all mr-2">RO24BTRLEURCRTOCS5281601</span>
                            <button onClick={() => copyToClipboard('RO24BTRLEURCRTOCS5281601', 'eur')} className="text-blue-600 hover:bg-blue-50 p-1 rounded">
                                {copied === 'eur' ? <Check size={16} /> : <span className="text-xs font-bold">{t('copy')}</span>}
                            </button>
                        </div>
                    </div>

                    <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                        <div className="text-xs font-bold text-neutral-400 uppercase mb-1">{t('swiftCode')}</div>
                        <div className="flex justify-between items-center">
                            <span className="font-mono text-sm font-medium text-neutral-800">BTRLRO22</span>
                            <button onClick={() => copyToClipboard('BTRLRO22', 'swift')} className="text-blue-600 hover:bg-blue-50 p-1 rounded">
                                {copied === 'swift' ? <Check size={16} /> : <span className="text-xs font-bold">{t('copy')}</span>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </section>

      {/* Crypto Section */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <div className="inline-block p-2 rounded-full border border-purple-500/30 bg-purple-500/10 mb-4">
                    <Bitcoin className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-4xl font-bold mb-4">{t('cryptoTitle')}</h2>
                <div className="flex items-center justify-center gap-2 text-neutral-400">
                    <Image src="/kraken-badge.jpg" alt="Kraken" width={24} height={24} className="h-6 w-6 rounded-full grayscale opacity-70" />
                    <span className="text-sm">{t('krakenVerified')}</span>
                </div>
            </div>

            <div className="grid gap-4">
              {cryptoAddresses.map((crypto, idx) => (
                <div 
                  key={idx} 
                  className="bg-white/5 hover:bg-white/10 rounded-xl p-5 border border-white/10 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-lg font-bold shrink-0">
                      {crypto.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-sm md:text-base truncate">{crypto.name}</h3>
                      <p className="text-neutral-400 font-mono text-xs md:text-sm truncate">{crypto.address}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(crypto.address, crypto.name)}
                    className="ml-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-colors shrink-0"
                  >
                    {copied === crypto.name ? <Check size={16} /> : t('copy')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
