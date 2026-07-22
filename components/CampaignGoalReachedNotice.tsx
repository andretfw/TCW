'use client';

import {useCallback, useEffect, useState} from 'react';
import {CheckCircle2} from 'lucide-react';
import {useLocale} from 'next-intl';
import {
  ACTIVE_DREAM_CAMPAIGNS,
  type CampaignId,
} from '@/lib/campaigns';

type Locale = 'en' | 'ro' | 'es';

const copy = {
  en: {
    title: 'Fundraising goal reached 💜',
    description:
      'This dream is fully funded. Thank you for helping make it possible.',
  },
  ro: {
    title: 'Obiectivul de strângere a fost atins 💜',
    description:
      'Acest vis este finanțat integral. Îți mulțumim că l-ai făcut posibil.',
  },
  es: {
    title: 'Objetivo de recaudación alcanzado 💜',
    description:
      'Este sueño está totalmente financiado. Gracias por hacerlo posible.',
  },
} as const;

const campaignTitles: Record<Locale, Record<CampaignId, string>> = {
  en: {
    'peaceful-weekend': 'A peaceful weekend together',
    'memories-with-grandchildren': 'Memories with her twin grandchildren',
    'everyday-comfort': 'Everyday comfort during breast cancer',
  },
  ro: {
    'peaceful-weekend': 'Un weekend liniștit împreună',
    'memories-with-grandchildren': 'Amintiri alături de nepoții gemeni',
    'everyday-comfort': 'Confort în viața de zi cu zi în timpul cancerului mamar',
  },
  es: {
    'peaceful-weekend': 'Un fin de semana tranquilo juntos',
    'memories-with-grandchildren': 'Recuerdos con sus nietos gemelos',
    'everyday-comfort': 'Comodidad diaria durante el cáncer de mama',
  },
};

const campaigns = Object.values(ACTIVE_DREAM_CAMPAIGNS);

export default function CampaignGoalReachedNotice() {
  const locale = useLocale() as Locale;
  const text = copy[locale] ?? copy.en;
  const titles = campaignTitles[locale] ?? campaignTitles.en;
  const [reachedCampaigns, setReachedCampaigns] = useState<CampaignId[]>([]);

  const loadCampaignStatus = useCallback(async () => {
    const results = await Promise.all(
      campaigns.map(async (campaign) => {
        try {
          const response = await fetch(
            `/api/campaign-progress?campaignId=${encodeURIComponent(campaign.id)}`,
            {cache: 'no-store'},
          );

          if (!response.ok) return null;

          const result = await response.json();
          const raisedEur = Number(result.raisedEur || 0);

          return Number.isFinite(raisedEur) && raisedEur >= campaign.goalEur
            ? campaign.id
            : null;
        } catch {
          return null;
        }
      }),
    );

    setReachedCampaigns(
      results.filter((campaignId): campaignId is CampaignId => campaignId !== null),
    );
  }, []);

  useEffect(() => {
    loadCampaignStatus();
    const interval = window.setInterval(loadCampaignStatus, 15_000);
    return () => window.clearInterval(interval);
  }, [loadCampaignStatus]);

  if (reachedCampaigns.length === 0) return null;

  return (
    <div
      className="fixed left-4 right-4 top-28 z-[80] space-y-3 sm:left-auto sm:max-w-md"
      role="status"
      aria-live="polite"
    >
      {reachedCampaigns.map((campaignId) => (
        <div
          key={campaignId}
          className="rounded-2xl border border-green-200 bg-white/95 p-4 shadow-xl backdrop-blur"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-green-600" />
            <div>
              <p className="font-bold text-green-800">{text.title}</p>
              <p className="mt-1 text-sm font-semibold text-neutral-800">
                {titles[campaignId]}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                {text.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
