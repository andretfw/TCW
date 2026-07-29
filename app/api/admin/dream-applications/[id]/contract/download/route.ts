import {downloadDreamContractFromGoogleDrive} from '@/lib/dream-applications/contract-drive';
import {
  DreamAuthorizationError,
  privateJson,
  requireDreamAdmin,
} from '@/lib/dream-applications/security';
import {getDreamApplication} from '@/lib/dream-applications/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

function safeFilename(value: string): string {
  return value.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'TCW-Contract.docx';
}

function bufferToArrayBuffer(value: Buffer): ArrayBuffer {
  return value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength) as ArrayBuffer;
}

export async function GET(
  _request: Request,
  {params}: {params: Promise<{id: string}>},
): Promise<Response> {
  try {
    await requireDreamAdmin();
    const {id} = await params;
    const application = await getDreamApplication(id);
    if (!application || !application.contractDocument) {
      return privateJson({error: 'Generated contract not found.'}, {status: 404});
    }
    const file = await downloadDreamContractFromGoogleDrive(
      application.contractDocument.driveFileId,
    );
    return new Response(bufferToArrayBuffer(file), {
      headers: {
        'Cache-Control': 'no-store, private',
        'Content-Type': DOCX_MIME,
        'Content-Disposition': `attachment; filename="${safeFilename(application.contractDocument.filename)}"`,
        'Content-Length': String(file.byteLength),
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    console.error('Unable to download Dream contract', error);
    return privateJson({error: 'Unable to download this contract.'}, {status: 503});
  }
}
