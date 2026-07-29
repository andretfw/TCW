import type {Config} from '@netlify/functions';

import {createDreamMaintenanceSignature} from '../../lib/dream-applications/maintenance-auth';

const DEFAULT_SITE_URL = 'https://tutticancerwarriors.org';

export default async function dreamBoardReminders(_request: Request): Promise<void> {
  const timestamp = Date.now().toString();
  const signature = createDreamMaintenanceSignature(timestamp);
  const siteUrl = process.env.URL?.trim() || DEFAULT_SITE_URL;
  const endpoint = new URL('/api/internal/dream-maintenance', siteUrl);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'x-tcw-maintenance-timestamp': timestamp,
      'x-tcw-maintenance-signature': signature,
    },
    signal: AbortSignal.timeout(25_000),
  });
  const payload = await response.text();
  if (!response.ok) {
    throw new Error(`Dream reminder maintenance returned ${response.status}: ${payload.slice(0, 300)}`);
  }

  console.log('Dream board reminder maintenance completed.', payload);
}

export const config: Config = {
  schedule: '0 * * * *',
};
