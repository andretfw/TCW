import type { Config, Context } from '@netlify/functions';

import { purgeExpiredDreamApplications } from '../../lib/dream-applications/store';

export default async function handler(_request: Request, _context: Context) {
  try {
    const result = await purgeExpiredDreamApplications();
    console.log('Dream application retention cleanup complete', result);
    return Response.json(result);
  } catch (error) {
    console.error('Dream application retention cleanup failed', error);
    return Response.json({error: 'Cleanup failed'}, {status: 500});
  }
}

export const config: Config = {
  schedule: '@daily',
};

