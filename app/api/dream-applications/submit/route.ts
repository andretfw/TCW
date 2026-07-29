import { randomUUID } from 'node:crypto';

import { uploadTokensMatch } from '@/lib/dream-applications/crypto';
import { assertSameOrigin, DreamAuthorizationError, privateJson } from '@/lib/dream-applications/security';
import { getDreamApplication, saveDreamApplication } from '@/lib/dream-applications/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    const body = await request.json() as {
      applicationId?: string;
      uploadToken?: string;
    };

    if (!body.applicationId || !body.uploadToken) {
      return privateJson({error: 'Invalid submission session.'}, {status: 400});
    }

    const application = await getDreamApplication(body.applicationId);
    if (
      !application ||
      application.status !== 'draft' ||
      !uploadTokensMatch(body.uploadToken, application.uploadTokenHash) ||
      !application.draftExpiresAt ||
      new Date(application.draftExpiresAt) <= new Date()
    ) {
      return privateJson({error: 'This submission session has expired.'}, {status: 410});
    }
    if (!application.files.some((file) => file.category === 'medical')) {
      return privateJson({error: 'A diagnosis-verification document is required.'}, {status: 400});
    }

    const now = new Date().toISOString();
    application.status = 'new';
    application.submittedAt = now;
    application.updatedAt = now;
    application.draftExpiresAt = undefined;
    application.uploadTokenHash = undefined;
    application.history.push({
      id: randomUUID(),
      type: 'submitted',
      toStatus: 'new',
      actor: 'applicant',
      createdAt: now,
    });
    await saveDreamApplication(application);

    return privateJson({
      ok: true,
      reference: application.reference,
      submittedAt: now,
    });
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }

    console.error('Unable to finalize Dream Support application', error);
    return privateJson(
      {error: 'The application could not be finalized. Your uploads have not been made public.'},
      {status: 503},
    );
  }
}

