import {NextRequest, NextResponse} from 'next/server';
import {getCampaignById, isCampaignId} from '@/lib/campaigns';
import {recordVerifiedDonation} from '@/lib/donation-tracking';

export const dynamic = 'force-dynamic';

const ETH_KRAKEN_ADDRESS = '0x54b9694cebc596d8c712ab225347343e2a7bd7e6';
const ETH_METAMASK_ADDRESS = '0x66e4cfe637e73a4c5f34fdf6539c849c3366a0ab';
const BTC_ADDRESS = '3BuBreK55MS2fF9MfzMTXL4cG6GQDot3aD';
const USDC_CONTRACT = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

async function ethereumRpc(method: string, params: unknown[]) {
  const response = await fetch(
    process.env.ETH_RPC_URL || 'https://cloudflare-eth.com',
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({jsonrpc: '2.0', id: 1, method, params}),
      cache: 'no-store',
    },
  );

  if (!response.ok) throw new Error('Ethereum RPC request failed.');
  const payload = await response.json();
  if (payload.error) throw new Error(payload.error.message || 'Ethereum RPC error.');
  return payload.result;
}

async function getKrakenEurRate(asset: 'btc' | 'eth' | 'usdc') {
  const pair = asset === 'btc' ? 'XBTEUR' : asset === 'eth' ? 'ETHEUR' : 'USDCEUR';
  const response = await fetch(`https://api.kraken.com/0/public/Ticker?pair=${pair}`, {
    cache: 'no-store',
  });

  if (!response.ok) throw new Error('Unable to load exchange rate.');
  const payload = await response.json();
  const ticker = Object.values(payload.result || {})[0] as {c?: string[]} | undefined;
  const rate = Number(ticker?.c?.[0]);

  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error('Invalid exchange rate.');
  }

  return rate;
}

function ensureCampaignStart(transactionTimeMs: number, startedAt: string) {
  if (transactionTimeMs < new Date(startedAt).getTime()) {
    throw new Error('This transaction predates the campaign.');
  }
}

async function verifyBitcoin(txHash: string, startedAt: string) {
  const response = await fetch(`https://blockstream.info/api/tx/${txHash}`, {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Bitcoin transaction was not found.');

  const tx = await response.json();
  if (!tx.status?.confirmed || !tx.status?.block_time) {
    throw new Error('Bitcoin transaction is not confirmed yet.');
  }

  ensureCampaignStart(Number(tx.status.block_time) * 1000, startedAt);

  const satoshis = (tx.vout || []).reduce((total: number, output: any) => {
    return output.scriptpubkey_address === BTC_ADDRESS
      ? total + Number(output.value || 0)
      : total;
  }, 0);

  if (satoshis <= 0) throw new Error('No BTC payment to the TCW address was found.');

  return satoshis / 100_000_000;
}

async function verifyEthereum(
  txHash: string,
  asset: 'eth' | 'usdc',
  destination: 'kraken' | 'metamask',
  startedAt: string,
) {
  const tx = await ethereumRpc('eth_getTransactionByHash', [txHash]);
  const receipt = await ethereumRpc('eth_getTransactionReceipt', [txHash]);

  if (!tx || !receipt) throw new Error('Ethereum transaction was not found.');
  if (receipt.status !== '0x1') throw new Error('Ethereum transaction failed.');

  const block = await ethereumRpc('eth_getBlockByNumber', [receipt.blockNumber, false]);
  ensureCampaignStart(Number(BigInt(block.timestamp)) * 1000, startedAt);

  const target = destination === 'metamask' ? ETH_METAMASK_ADDRESS : ETH_KRAKEN_ADDRESS;

  if (asset === 'eth') {
    if ((tx.to || '').toLowerCase() !== target) {
      throw new Error('ETH was not sent to the selected TCW address.');
    }

    const amount = Number(BigInt(tx.value)) / 1e18;
    if (!Number.isFinite(amount) || amount <= 0) throw new Error('Invalid ETH amount.');
    return amount;
  }

  const transferLogs = (receipt.logs || []).filter((log: any) => {
    const recipient = log.topics?.[2]?.slice(-40)?.toLowerCase();
    return (
      String(log.address).toLowerCase() === USDC_CONTRACT &&
      String(log.topics?.[0]).toLowerCase() === TRANSFER_TOPIC &&
      recipient === target.slice(2)
    );
  });

  const rawAmount = transferLogs.reduce(
    (total: bigint, log: any) => total + BigInt(log.data || '0x0'),
    0n,
  );
  const amount = Number(rawAmount) / 1e6;

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('No USDC transfer to the selected TCW address was found.');
  }

  return amount;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const campaignId = String(body.campaignId || '');
    const asset = String(body.asset || '').toLowerCase();
    const txHash = String(body.txHash || '').trim();
    const destination = body.destination === 'metamask' ? 'metamask' : 'kraken';

    if (!isCampaignId(campaignId)) {
      return NextResponse.json({error: 'Invalid campaign.'}, {status: 400});
    }
    if (!['btc', 'eth', 'usdc'].includes(asset)) {
      return NextResponse.json({error: 'Unsupported crypto asset.'}, {status: 400});
    }
    if (!txHash) {
      return NextResponse.json({error: 'Transaction hash is required.'}, {status: 400});
    }

    const campaign = getCampaignById(campaignId);
    const typedAsset = asset as 'btc' | 'eth' | 'usdc';
    const amountOriginal =
      typedAsset === 'btc'
        ? await verifyBitcoin(txHash, campaign.startedAt)
        : await verifyEthereum(txHash, typedAsset, destination, campaign.startedAt);
    const rate = await getKrakenEurRate(typedAsset);
    const amountEur = Math.round(amountOriginal * rate * 100) / 100;

    await recordVerifiedDonation({
      campaignId,
      provider: typedAsset,
      transactionId: `${typedAsset}:${txHash.toLowerCase()}`,
      amountOriginal,
      currency: typedAsset.toUpperCase(),
      amountEur,
      metadata: {destination},
    });

    return NextResponse.json({
      verified: true,
      campaignId,
      amountOriginal,
      currency: typedAsset.toUpperCase(),
      amountEur,
    });
  } catch (error) {
    console.error('Crypto verification failed:', error);
    const message = error instanceof Error ? error.message : 'Unable to verify transaction.';
    return NextResponse.json({error: message}, {status: 400});
  }
}
