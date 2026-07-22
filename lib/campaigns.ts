export const ACTIVE_DREAM_CAMPAIGNS = {
  peacefulWeekend: {
    id: 'peaceful-weekend',
    goalEur: 500,
    raised: {
      paypalEur: 0,
      cryptoEur: 0,
    },
  },
} as const;

export function getCampaignRaisedEur(
  campaign: (typeof ACTIVE_DREAM_CAMPAIGNS)[keyof typeof ACTIVE_DREAM_CAMPAIGNS],
) {
  return campaign.raised.paypalEur + campaign.raised.cryptoEur;
}
