import {
  DreamAuthorizationError,
  privateJson,
  requireDreamReviewerContext,
} from '@/lib/dream-applications/security';
import { getDreamApplication } from '@/lib/dream-applications/store';
import type { DreamApplicationFile } from '@/lib/dream-applications/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  {params}: {params: Promise<{id: string}>},
): Promise<Response> {
  try {
    const reviewer = await requireDreamReviewerContext();
    const {id} = await params;
    const application = await getDreamApplication(id);
    if (
      !application ||
      application.status === 'draft' ||
      (!reviewer.isAdmin && application.status !== 'board_review')
    ) {
      return privateJson({error: 'Application not found.'}, {status: 404});
    }
    return privateJson({
      application: {
        ...application,
        boardVotes: application.boardVotes || [],
        files: application.files.map((file: DreamApplicationFile) => ({
          id: file.id,
          category: file.category,
          originalName: file.originalName,
          mimeType: file.mimeType,
          size: file.size,
          uploadedAt: file.uploadedAt,
        })),
      },
      viewer: {
        email: reviewer.email,
        isAdmin: reviewer.isAdmin,
        isBoardMember: reviewer.isBoardMember,
      },
    });
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    console.error('Unable to load Dream application', error);
    return privateJson({error: 'Unable to load this application.'}, {status: 503});
  }
}
