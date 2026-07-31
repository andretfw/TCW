'use client';

import {useEffect} from 'react';

const CAMPAIGN_IDS = [
  'peaceful-weekend',
  'memories-with-grandchildren',
  'everyday-comfort',
] as const;

type CampaignId = (typeof CAMPAIGN_IDS)[number];

function isCampaignId(value: string | null): value is CampaignId {
  return Boolean(value && CAMPAIGN_IDS.includes(value as CampaignId));
}

function requestedCampaign(): CampaignId | null {
  const params = new URLSearchParams(window.location.search);
  const queryCampaign = params.get('campaign');
  if (isCampaignId(queryCampaign)) return queryCampaign;

  const hashCampaign = window.location.hash.replace(/^#/, '');
  return isCampaignId(hashCampaign) ? hashCampaign : null;
}

export default function DreamCampaignDeepLinks() {
  useEffect(() => {
    const prepareCampaignCards = () => {
      const cards = Array.from(
        document.querySelectorAll<HTMLElement>('main article'),
      ).slice(0, CAMPAIGN_IDS.length);

      if (cards.length !== CAMPAIGN_IDS.length) return false;

      cards.forEach((card, index) => {
        card.id = CAMPAIGN_IDS[index];
        card.style.scrollMarginTop = '8rem';
      });

      const campaignId = requestedCampaign();
      if (campaignId) {
        document.getElementById(campaignId)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }

      return true;
    };

    if (prepareCampaignCards()) return;

    const animationFrame = window.requestAnimationFrame(prepareCampaignCards);
    const timeout = window.setTimeout(prepareCampaignCards, 250);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(timeout);
    };
  }, []);

  return null;
}
