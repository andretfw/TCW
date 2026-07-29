import { googleDrivePreviewUrl } from '@/lib/dream-applications/google-drive';
import {
  DreamAuthorizationError,
  privateJson,
  requireDreamReviewer,
} from '@/lib/dream-applications/security';
import { getDreamApplication } from '@/lib/dream-applications/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  {params}: {params: Promise<{id: string; fileId: string}>},
): Promise<Response> {
  try {
    await requireDreamReviewer();
    const {id, fileId} = await params;
    const application = await getDreamApplication(id);
    if (!application || application.status === 'draft') {
      return privateJson({error: 'Application not found.'}, {status: 404});
    }

    const file = application.files.find((entry) => entry.id === fileId);
    if (!file) return privateJson({error: 'File not found.'}, {status: 404});

    return new Response(null, {
      status: 302,
      headers: {
        'Cache-Control': 'no-store, private',
        Location: googleDrivePreviewUrl(file.driveFileId),
        'Referrer-Policy': 'no-referrer',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    console.error('Unable to open Dream application file', error);
    return privateJson({error: 'Unable to open this file.'}, {status: 503});
  }
}
