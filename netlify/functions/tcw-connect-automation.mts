import type {Config} from '@netlify/functions';

import {runConnectAutomation} from '../../lib/connect/automation';

export default async function handler(): Promise<Response> {
  try {
    const result = await runConnectAutomation();
    console.log('TCW Connect automation completed.', result);
    return new Response(null, {status: 204});
  } catch {
    console.error('TCW Connect automation failed.');
    return new Response(null, {status: 500});
  }
}

export const config: Config = {
  schedule: '@hourly',
};
