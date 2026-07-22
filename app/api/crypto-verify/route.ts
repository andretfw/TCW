import {NextRequest, NextResponse} from 'next/server';
import {getCampaignById, isCampaignId} from '@/lib/campaigns';
import {recordVerifiedDonation} from '@/lib/donation-tracking';

export const dynamic = 'force-dynamic';

const ETH_KRAKEN_ADDRESS = '0x54b9694cebc596d8c712ab225347343e2a7bd7e6';
const ETH_METAMASK_ADDRESS = '0x66e4cfe637e73a4c5f34fdf6539c849c3366a0ab';
const BTC_ADDRESS = '3BuBreK55MS2fF9MfzMTXL4cG6GQDot3aD';
const TRANSFER_TOPIC =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
const EVM_TRANSACTION_HASH_PATTERN = /^0x[a-fA-F0-9]{64}$/;

type EvmNetwork = 'ethereum' | 'base';
type EvmAsset = 'eth' | 'usdc';
type Destination = 'kraken' | 'metamask';

function uniqueRpcUrls(...urls: Array<string | undefined>) {
  return Array.from(
    new Set(
      urls
        .map((url) => url?.trim())
        .filter((url): url is string => Boolean(url)),
    ),
  );
}

const EVM_NETWORKS: Record<
  EvmNetwork,
  {rpcUrls: string[]; usdcContract: string; label: string}
> = {
  ethereum: {
    rpcUrls: uniqueRpcUrls(
      process.env.ETH_RPC_URL,
      'https://ethereum-rpc.publicnode.com',
    ),
    usdcContract: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    label: 'Ethereum',
  },
  base: {
    rpcUrls: uniqueRpcUrls(
      process.env.BASE_RPC_URL,
      'https://mainnet.base.org',
    ),
    usdcContract: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    label: 'Base',
  },
};

async function evmRpc(
  network: EvmNetwork,
  method: string,
  params: unknown[],
) {
  const networkConfig = EVM_NETWORKS[network];
  let receivedValidResponse = false;

  for (const rpcUrl of networkConfig.rpcUrls) {
    try {
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({jsonrpc: '2.0', id: 1, method, params}),
        cache: 'no-store',
      });

      if (!response.ok) continue;

      const payload = await response.json();
      if (payload.error) continue;

      receivedValidResponse = true;
      if (payload.result !== null && payload.result !== undefined) {
        return payload.result;
      }
    } catch {
      // Try the next configured provider before failing the verification.
    }
  }

  if (receivedValidResponse) return null;
  throw new Error(`${networkConfig.label} RPC request failed.`);
}

async function getKrakenEurRate(asset: 'btc' | 'eth' | 'usdc') {
  const pair =
    asset === 'btc' ? 'XBTEUR' : asset === 'eth' ? 'ETHEUR' : 'USDCEUR';
  const response = await fetch(
    `https://api.kraken.com/0/public/Ticker?pair=${pair}`,
    {cache: 'no-store'},
  );

  if (!response.ok) throw new Error('Unable to load exchange rate.');
  const payload = await response.json();
  const ticker = Object.values(payload.result || {})[0] as
    | {c?: string[]}
    | undefined;
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

  if (satoshis <= 0) {
    throw new Error('No BTC payment to the TCW address was found.');
  }

  return satoshis / 100_000_000;
}

async function verifyEvmTransaction(
  network: EvmNetwork,
  txHash: string,
  asset: EvmAsset,
  destination: Destination,
  startedAt: string,
) {
  const tx = await evmRpc(network, 'eth_getTransactionByHash', [txHash]);
  const receipt = await evmRpc(network, 'eth_getTransactionReceipt', [txHash]);

  if (!tx || !receipt) {
    throw new Error(`${EVM_NETWORKS[network].label} transaction was not found.`);
  }
  if (receipt.status !== '0x1') {
    throw new Error(`${EVM_NETWORKS[network].label} transaction failed.`);
  }

  const block = await evmRpc(network, 'eth_getBlockByNumber', [
    receipt.blockNumber,
    false,
  ]);
  if (!block?.timestamp) {
    throw new Error('Unable to confirm the transaction time.');
  }
  ensureCampaignStart(Number(BigInt(block.timestamp)) * 1000, startedAt);

  const target =
    destination === 'metamask' ? ETH_METAMASK_ADDRESS : ETH_KRAKEN_ADDRESS;

  if (asset === 'eth') {
    if ((tx.to || '').toLowerCase() !== target) {
      throw new Error(
        `ETH was not sent to the selected TCW address on ${EVM_NETWORKS[network].label}.`,
      );
    }

    const amount = Number(BigInt(tx.value || '0x0')) / 1e18;
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Invalid ETH amount.');
    }
    return amount;
  }

  const usdcContract = EVM_NETWORKS[network].usdcContract;
  const transferLogs = (receipt.logs || []).filter((log: any) => {
    const recipient = log.topics?.[2]?.slice(-40)?.toLowerCase();
    return (
      String(log.address).toLowerCase() === usdcContract &&
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
    throw new Error(
      `No USDC transfer to the selected TCW address was found on ${EVM_NETWORKS[network].label}.`,
    );
  }

  return amount;
}

async function verifyOnSelectedOrDetectedNetwork(
  txHash: string,
  asset: EvmAsset,
  destination: Destination,
  startedAt: string,
  requestedNetwork: string,
) {
  const networks: EvmNetwork[] =
    requestedNetwork === 'ethereum' || requestedNetwork === 'base'
      ? [requestedNetwork]
      : ['ethereum', 'base'];

  const errors: string[] = [];

  for (const network of networks) {
    try {
      const amountOriginal = await verifyEvmTransaction(
        network,
        txHash,
        asset,
        destination,
        startedAt,
      );
      return {amountOriginal, network};
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  throw new Error(
    errors.length > 0
      ? errors.join(' ')
      : 'The transaction could not be verified on a supported network.',
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const campaignId = String(body.campaignId || '');
    const asset = String(body.asset || '').toLowerCase();
    const txHash = String(body.txHash || '').trim();
    const destination: Destination =
      body.destination === 'metamask' ? 'metamask' : 'kraken';
    const requestedNetwork = String(body.network || '').toLowerCase();

    if (!isCampaignId(campaignId)) {
      return NextResponse.json({error: 'Invalid campaign.'}, {status: 400});
    }
    if (!['btc', 'eth', 'usdc'].includes(asset)) {
      return NextResponse.json(
        {error: 'Unsupported crypto asset.'},
        {status: 400},
      );
    }
    if (!txHash) {
      return NextResponse.json(
        {error: 'Transaction hash is required.'},
        {status: 400},
      );
    }
    if (asset !== 'btc' && !EVM_TRANSACTION_HASH_PATTERN.test(txHash)) {
      return NextResponse.json(
        {error: 'Enter a valid Ethereum transaction hash.'},
        {status: 400},
      );
    }

    const campaign = getCampaignById(campaignId);
    const typedAsset = asset as 'btc' | 'eth' | 'usdc';

    let amountOriginal: number;
    let network: 'bitcoin' | EvmNetwork;

    if (typedAsset === 'btc') {
      amountOriginal = await verifyBitcoin(txHash, campaign.startedAt);
      network = 'bitcoin';
    } else {
      const verified = await verifyOnSelectedOrDetectedNetwork(
        txHash.toLowerCase(),
        typedAsset,
        destination,
        campaign.startedAt,
        requestedNetwork,
      );
      amountOriginal = verified.amountOriginal;
      network = verified.network;
    }

    const rate = await getKrakenEurRate(typedAsset);
    const amountEur = Math.round(amountOriginal * rate * 100) / 100;
    const normalizedHash = txHash.toLowerCase();
    const transactionId =
      network === 'ethereum' || network === 'bitcoin'
        ? `${typedAsset}:${normalizedHash}`
        : `${network}:${typedAsset}:${normalizedHash}`;

    await recordVerifiedDonation({
      campaignId,
      provider: typedAsset,
      transactionId,
      amountOriginal,
      currency: typedAsset.toUpperCase(),
      amountEur,
      metadata: {destination, network},
    });

    return NextResponse.json({
      verified: true,
      campaignId,
      network,
      amountOriginal,
      currency: typedAsset.toUpperCase(),
      amountEur,
    });
  } catch (error) {
    console.error('Crypto verification failed:', error);
    const message =
      error instanceof Error ? error.message : 'Unable to verify transaction.';
    return NextResponse.json({error: message}, {status: 400});
  }
}
