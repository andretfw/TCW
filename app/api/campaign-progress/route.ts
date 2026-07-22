import {NextRequest, NextResponse} from 'next/server';
import {getCampaignTotalEur} from '@/lib/donation-tracking';
import {getCampaignById, isCampaignId} from '@/lib/campaigns';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const campaignId = request.nextUrl.searchParams.get('campaignId');

  if (!isCampaignId(campaignId)) {
    return NextResponse.json({error: 'Invalid campaign.'}, {status: 400});
  }

  try {
    const campaign = getCampaignById(campaignId);
    const raisedEur = await getCampaignTotalEur(campaignId);

    return NextResponse.json(
      {
        campaignId,
        raisedEur: Math.round(raisedEur * 100) / 100,
        goalEur: campaign.goalEur,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  } catch (error) {
    console.error('Unable to load campaign progress:', error);
    return NextResponse.json({error: 'Unable to load campaign progress.'}, {status: 500});
  }
}
