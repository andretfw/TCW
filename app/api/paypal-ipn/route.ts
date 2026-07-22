import {NextRequest, NextResponse} from 'next/server';
import {isCampaignId} from '@/lib/campaigns';
import {recordVerifiedDonation} from '@/lib/donation-tracking';

export const dynamic = 'force-dynamic';

function normalizeEmail(value: string | null | undefined) {
  return (value || '').trim().toLowerCase();
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const verificationBody = `cmd=_notify-validate&${rawBody}`;

  try {
    const verificationResponse = await fetch(
      'https://ipnpb.paypal.com/cgi-bin/webscr',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Tutti-Cancer-Warriors-PayPal-IPN/1.0',
        },
        body: verificationBody,
        cache: 'no-store',
      },
    );

    const verificationResult = await verificationResponse.text();

    if (verificationResult.trim() !== 'VERIFIED') {
      console.error('PayPal IPN rejected by PayPal verification.');
      return new NextResponse('Invalid IPN.', {status: 400});
    }

    const values = new URLSearchParams(rawBody);
    const campaignId = values.get('item_number') || values.get('custom');
    const paymentStatus = values.get('payment_status');
    const transactionId = values.get('txn_id');
    const currency = values.get('mc_currency');
    const amount = Number(values.get('mc_gross'));
    const receiverEmail = normalizeEmail(values.get('receiver_email'));
    const businessEmail = normalizeEmail(values.get('business'));
    const expectedReceiver = normalizeEmail(process.env.PAYPAL_RECEIVER_EMAIL);

    if (!isCampaignId(campaignId)) {
      console.error('PayPal IPN contained an unknown campaign.', {campaignId});
      return new NextResponse('Unknown campaign.', {status: 400});
    }

    if (
      paymentStatus !== 'Completed' ||
      !transactionId ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return new NextResponse('Payment is not complete.', {status: 200});
    }

    if (currency !== 'EUR') {
      console.error('PayPal IPN used an unsupported currency.', {currency});
      return new NextResponse('Only EUR campaign donations are tracked.', {status: 400});
    }

    if (!expectedReceiver) {
      console.error('PAYPAL_RECEIVER_EMAIL is not configured.');
      return new NextResponse('PayPal receiver is not configured.', {status: 500});
    }

    const receiverMatches =
      receiverEmail === expectedReceiver || businessEmail === expectedReceiver;

    if (!receiverMatches) {
      console.error('Unexpected PayPal receiver.', {
        hasReceiverEmail: Boolean(receiverEmail),
        hasBusinessEmail: Boolean(businessEmail),
      });
      return new NextResponse('Unexpected PayPal receiver.', {status: 400});
    }

    await recordVerifiedDonation({
      campaignId,
      provider: 'paypal',
      transactionId,
      amountOriginal: amount,
      currency,
      amountEur: amount,
      metadata: {
        payerEmail: values.get('payer_email'),
        itemName: values.get('item_name'),
      },
    });

    return new NextResponse('OK');
  } catch (error) {
    console.error('PayPal IPN processing failed:', error);
    return new NextResponse('Unable to process IPN.', {status: 500});
  }
}
