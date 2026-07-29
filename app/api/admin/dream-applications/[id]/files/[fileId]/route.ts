import {
  DreamAuthorizationError,
  privateJson,
  requireDreamReviewer,
} from '@/lib/dream-applications/security';
import { getDreamApplication, getDreamFile } from '@/lib/dream-applications/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function contentDispositionFilename(value: string): string {
  const ascii = value.replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '_');
  return ascii || 'tcw-document';
}

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

    const decrypted = await getDreamFile(file.storageKey);
    if (!decrypted) return privateJson({error: 'File not found.'}, {status: 404});
    const responseBody = decrypted.buffer.slice(
      decrypted.byteOffset,
      decrypted.byteOffset + decrypted.byteLength,
    ) as ArrayBuffer;

    return new Response(responseBody, {
      headers: {
        'Cache-Control': 'no-store, private',
        'Content-Disposition': `attachment; filename="${contentDispositionFilename(file.originalName)}"`,
        'Content-Length': String(decrypted.byteLength),
        'Content-Type': file.mimeType,
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    console.error('Unable to download Dream application file', error);
    return privateJson({error: 'Unable to download this file.'}, {status: 503});
  }
}
