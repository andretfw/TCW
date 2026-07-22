'use client';

import Link from 'next/link';
import {useLocale} from 'next-intl';
import {Heart, Sparkles, WalletCards, Bitcoin} from 'lucide-react';
import {
  ACTIVE_DREAM_CAMPAIGNS,
  getCampaignRaisedEur,
} from '@/lib/campaigns';
import {localizedPath} from '@/lib/routes';

const copy = {
  en: {
    pageTitle: 'Support a Dream',
    pageSubtitle:
      'Help fund meaningful moments for cancer warriors whose dreams are still waiting to be fulfilled.',
    title: 'Fund a Weekend of Peace for a Grandmother Facing Cancer',
    description:
      'After almost 40 years of work and caring for her family, a routine check in March 2026 changed her life with a cancer diagnosis. She dreams of one peaceful weekend away with her husband—to rest, breathe and make a memory beyond cancer.',
    privacy: 'Her name and image are being kept private for now.',
    goal: 'Goal',
    raised: 'raised',
    of: 'of',
    paypal: 'Donate with PayPal',
    crypto: 'Donate with crypto',
    attribution: 'Donations attributed to this campaign support her €500 dream.',
  },
  ro: {
    pageTitle: 'Susține un vis',
    pageSubtitle:
      'Ajută-ne să transformăm în realitate momente importante pentru warriorii ale căror vise încă așteaptă să fie împlinite.',
    title: 'Oferă un weekend de liniște unei bunici care înfruntă cancerul',
    description:
      'După aproape 40 de ani de muncă și grijă pentru familie, un control de rutină din martie 2026 i-a schimbat viața printr-un diagnostic oncologic. Își dorește un weekend liniștit alături de soțul ei—să se odihnească, să respire și să creeze o amintire dincolo de cancer.',
    privacy: 'Numele și imaginea ei sunt păstrate confidențiale pentru moment.',
    goal: 'Obiectiv',
    raised: 'strânși',
    of: 'din',
    paypal: 'Donează prin PayPal',
    crypto: 'Donează în crypto',
    attribution: 'Donațiile atribuite acestei campanii susțin visul ei de €500.',
  },
  es: {
    pageTitle: 'Apoya un sueño',
    pageSubtitle:
      'Ayúdanos a crear momentos importantes para warriors cuyos sueños todavía esperan hacerse realidad.',
    title: 'Regala un fin de semana de paz a una abuela que enfrenta el cáncer',
    description:
      'Después de casi 40 años de trabajo y cuidado de su familia, una revisión rutinaria en marzo de 2026 cambió su vida con un diagnóstico de cáncer. Sueña con pasar un fin de semana tranquilo junto a su marido—descansar, respirar y crear un recuerdo más allá del cáncer.',
    privacy: 'Por ahora, su nombre y su imagen se mantienen en privado.',
    goal: 'Objetivo',
    raised: 'recaudados',
    of: 'de',
    paypal: 'Donar con PayPal',
    crypto: 'Donar con cripto',
    attribution: 'Las donaciones atribuidas a esta campaña apoyan su sueño de €500.',
  },
} as const;

export default function SupportDreamPage() {
  const locale = useLocale() as keyof typeof copy;
  const text = copy[locale] ?? copy.en;
  const campaign = ACTIVE_DREAM_CAMPAIGNS.peacefulWeekend;
  const raisedEur = getCampaignRaisedEur(campaign);
  const progress = Math.min(100, Math.round((raisedEur / campaign.goalEur) * 100));
  const donatePath = localizedPath(locale, 'donate');

  return (
    <section className="pt-32 pb-24 bg-neutral-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-sm font-bold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Tutti Cancer Warriors</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            {text.pageTitle}
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed">
            {text.pageSubtitle}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <article className="bg-white rounded-3xl overflow-hidden shadow-xl border border-neutral-100">
            <div className="h-72 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop"
                alt="Peaceful countryside landscape"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              <div className="absolute top-5 right-5 bg-white/95 backdrop-blur px-5 py-2.5 rounded-full text-base font-bold text-brand-600 shadow-sm">
                {text.goal}: €{campaign.goalEur}
              </div>
            </div>

            <div className="p-7 md:p-9">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                {text.title}
              </h2>
              <p className="text-neutral-600 leading-relaxed mb-3">
                {text.description}
              </p>
              <p className="text-sm text-neutral-500 mb-7">{text.privacy}</p>

              <div className="mb-7" aria-label={`${raisedEur} euros raised of ${campaign.goalEur}`}>
                <div className="flex items-center justify-between gap-4 mb-2 text-sm font-semibold">
                  <span className="text-brand-600">
                    €{raisedEur} {text.raised}
                  </span>
                  <span className="text-neutral-500">
                    {text.of} €{campaign.goalEur}
                  </span>
                </div>
                <div className="h-3 w-full bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-600 to-purple-500 rounded-full transition-all duration-500"
                    style={{width: `${progress}%`}}
                  />
                </div>
                <div className="text-right text-xs text-neutral-500 mt-2">{progress}%</div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <a
                  href="https://www.paypal.com/donate/?hosted_button_id=6JXEDTNATW3PS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-4 px-5 bg-[#FFC439] hover:bg-[#F6B828] text-neutral-900 font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <WalletCards className="w-5 h-5" />
                  {text.paypal}
                </a>
                <Link
                  href={`${donatePath}#crypto`}
                  className="py-4 px-5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <Bitcoin className="w-5 h-5" />
                  {text.crypto}
                </Link>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-sm text-neutral-500 text-center">
                <Heart className="w-4 h-4 text-brand-500 shrink-0" fill="currentColor" />
                <span>{text.attribution}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
