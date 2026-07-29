import {processDreamBoardReminders} from '@/lib/dream-applications/board-reminders';
import {verifyDreamMaintenanceSignature} from '@/lib/dream-applications/maintenance-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function privateJson(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set('Cache-Control', 'no-store, private');
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return new Response(JSON.stringify(data), {...init, headers});
}

export async function POST(request: Request): Promise<Response> {
  try {
    const validSignature = verifyDreamMaintenanceSignature({
      timestamp: request.headers.get('x-tcw-maintenance-timestamp'),
      signature: request.headers.get('x-tcw-maintenance-signature'),
    });
    if (!validSignature) {
      return privateJson({error: 'Not found.'}, {status: 404});
    }

    const result = await processDreamBoardReminders();
    if (result.failed.length > 0) {
      console.error('Some Dream board reminders could not be delivered.', result.failed);
    }

    return privateJson({
      sent: result.sent.length,
      failed: result.failed.length,
      skipped: result.skipped,
    });
  } catch (error) {
    console.error('Dream reminder maintenance failed.', error);
    return privateJson({error: 'Maintenance failed.'}, {status: 503});
  }
}
