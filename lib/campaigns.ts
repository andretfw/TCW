export const ACTIVE_DREAM_CAMPAIGNS = {
  peacefulWeekend: {
    id: 'peaceful-weekend',
    code: 'PW-2026',
    goalEur: 500,
    startedAt: '2026-07-22T00:00:00.000Z',
  },
  memoriesWithGrandchildren: {
    id: 'memories-with-grandchildren',
    code: 'MG-2026',
    goalEur: 500,
    startedAt: '2026-07-22T00:00:00.000Z',
  },
  everydayComfort: {
    id: 'everyday-comfort',
    code: 'EC-2026',
    goalEur: 500,
    startedAt: '2026-07-22T00:00:00.000Z',
  },
} as const;

export type ActiveDreamCampaign =
  (typeof ACTIVE_DREAM_CAMPAIGNS)[keyof typeof ACTIVE_DREAM_CAMPAIGNS];

export type CampaignId = ActiveDreamCampaign['id'];

export const CAMPAIGN_IDS = Object.values(ACTIVE_DREAM_CAMPAIGNS).map(
  (campaign) => campaign.id,
) as CampaignId[];

export function isCampaignId(value: string | null | undefined): value is CampaignId {
  return Boolean(value && CAMPAIGN_IDS.includes(value as CampaignId));
}

export function getCampaignById(id: CampaignId): ActiveDreamCampaign {
  const campaign = Object.values(ACTIVE_DREAM_CAMPAIGNS).find(
    (entry) => entry.id === id,
  );

  if (!campaign) {
    throw new Error(`Unknown campaign: ${id}`);
  }

  return campaign;
}
