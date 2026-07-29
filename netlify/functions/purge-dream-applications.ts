import type { Config, Context } from '@netlify/functions';

import { purgeExpiredDreamApplications } from '../../lib/dream-applications/store';

const ALERT_FORM_NAME = 'dream-retention-alert';
const ALERT_ATTEMPTS = 3;

async function sendRetentionFailureAlert(): Promise<void> {
  const trustedBaseUrl =
    process.env.DEPLOY_PRIME_URL ||
    process.env.URL ||
    process.env.NEXT_PUBLIC_SITE_URL;
  if (!trustedBaseUrl) {
    throw new Error('RETENTION_ALERT_URL_UNAVAILABLE');
  }

  const body = new URLSearchParams({
    'form-name': ALERT_FORM_NAME,
    event: 'dream_retention_cleanup_failed',
    'occurred-at': new Date().toISOString(),
    'error-code': 'cleanup_failed',
    'bot-field': '',
  });
  const alertUrl = new URL('/dream-retention-notification.html', trustedBaseUrl);
  let lastError: unknown;

  for (let attempt = 1; attempt <= ALERT_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(alertUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: body.toString(),
        signal: AbortSignal.timeout(5_000),
      });
      if (!response.ok) {
        throw new Error(`RETENTION_ALERT_HTTP_${response.status}`);
      }
      return;
    } catch (error) {
      lastError = error;
      if (attempt < ALERT_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 200));
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error('RETENTION_ALERT_FAILED');
}

export default async function handler(_request: Request, _context: Context) {
  try {
    const result = await purgeExpiredDreamApplications();
    console.log('Dream application retention cleanup complete', result);
    return Response.json(result);
  } catch (error) {
    console.error('Dream application retention cleanup failed', error);
    try {
      await sendRetentionFailureAlert();
    } catch (alertError) {
      console.error('Dream application retention failure alert also failed', alertError);
    }
    return Response.json({error: 'Cleanup failed'}, {status: 500});
  }
}

export const config: Config = {
  schedule: '@daily',
};
