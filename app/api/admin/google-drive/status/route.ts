import {
  disconnectGoogleDrive,
  getGoogleDriveConnectionStatus,
} from '@/lib/dream-applications/google-drive';
import {
  assertSameOrigin,
  DreamAuthorizationError,
  privateJson,
  requireDreamAdmin,
} from '@/lib/dream-applications/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  try {
    await requireDreamAdmin();
    return privateJson(await getGoogleDriveConnectionStatus());
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    console.error('Unable to read Google Drive connection status', error);
    return privateJson({error: 'Unable to check Google Drive.'}, {status: 503});
  }
}

export async function DELETE(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    await requireDreamAdmin();
    await disconnectGoogleDrive();
    return privateJson({ok: true});
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    console.error('Unable to disconnect Google Drive', error);
    return privateJson({error: 'Unable to disconnect Google Drive.'}, {status: 503});
  }
}
