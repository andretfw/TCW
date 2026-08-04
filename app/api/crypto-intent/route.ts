import {NextRequest, NextResponse} from 'next/server';

import {isCampaignId} from '@/lib/campaigns';
import {
  createCryptoDonationIntent,
  type CryptoDonationAsset,
  type CryptoDonationDestination,
} from '@/lib/crypto-donation-intent';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isAsset(value: string): value is CryptoDonationAsset {
  return value === 'btc' || value === 'eth' || value === 'usdc';
}

function isDestination(value: string): value is CryptoDonationDestination {
  return value === 'kraken' || value === 'metamask';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const campaignId = String(body.campaignId || '');
    const asset = String(body.asset || '').toLowerCase();
    const destination = String(body.destination || '').toLowerCase();

    if (!isCampaignId(campaignId)) {
      return NextResponse.json({error: 'Invalid campaign.'}, {status: 400});
    }
    if (!isAsset(asset)) {
      return NextResponse.json(
        {error: 'Unsupported crypto asset.'},
        {status: 400},
      );
    }
    if (!isDestination(destination)) {
      return NextResponse.json(
        {error: 'Invalid crypto destination.'},
        {status: 400},
      );
    }

    const {token, intent} = createCryptoDonationIntent({
      campaignId,
      asset,
      destination,
    });

    return NextResponse.json(
      {
        intentToken: token,
        campaignId: intent.campaignId,
        asset: intent.asset,
        destination: intent.destination,
        issuedAt: intent.issuedAt,
        expiresAt: intent.expiresAt,
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  } catch {
    console.error('Crypto donation intent creation failed.');
    return NextResponse.json(
      {error: 'Unable to start the crypto donation. Please try again.'},
      {status: 400},
    );
  }
}
