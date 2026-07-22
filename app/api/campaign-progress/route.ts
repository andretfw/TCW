import {NextRequest, NextResponse} from 'next/server';
import {getCampaignTotalEur} from '@/lib/donation-tracking';
import {getCampaignById, isCampaignId} from '@/lib/campaigns';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Netlify-CDN-Cache-Control': 'no-store',
  Pragma: 'no-cache',
  Expires: '0',
};

export async function GET(request: NextRequest) {
  const campaignId = request.nextUrl.searchParams.get('campaignId');

  if (!isCampaignId(campaignId)) {
    return NextResponse.json(
      {error: 'Invalid campaign.'},
      {status: 400, headers: NO_CACHE_HEADERS},
    );
  }

  try {
    const campaign = getCampaignById(campaignId);
    const raisedEur = await getCampaignTotalEur(campaignId);

    return NextResponse.json(
      {
        campaignId,
        raisedEur: Math.round(raisedEur * 100) / 100,
        goalEur: campaign.goalEur,
        updatedAt: new Date().toISOString(),
      },
      {headers: NO_CACHE_HEADERS},
    );
  } catch (error) {
    console.error('Unable to load campaign progress:', error);
    return NextResponse.json(
      {error: 'Unable to load campaign progress.'},
      {status: 500, headers: NO_CACHE_HEADERS},
    );
  }
}
