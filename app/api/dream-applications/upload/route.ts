import { randomUUID } from 'node:crypto';

import { uploadTokensMatch } from '@/lib/dream-applications/crypto';
import { assertSameOrigin, DreamAuthorizationError, privateJson } from '@/lib/dream-applications/security';
import {
  createDreamFileKey,
  deleteDreamFile,
  getDreamApplication,
  saveDreamApplication,
  saveDreamFile,
} from '@/lib/dream-applications/store';
import {
  DREAM_FILE_CATEGORIES,
  MAX_DREAM_FILE_BYTES,
  MAX_DREAM_PHOTOS,
  type DreamApplicationFile,
  type DreamFileCategory,
} from '@/lib/dream-applications/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function detectMimeType(value: Buffer): DreamApplicationFile['mimeType'] | null {
  if (value.subarray(0, 5).toString('ascii') === '%PDF-') return 'application/pdf';
  if (value[0] === 0xff && value[1] === 0xd8 && value[2] === 0xff) return 'image/jpeg';
  if (
    value.length >= 8 &&
    value[0] === 0x89 &&
    value.subarray(1, 4).toString('ascii') === 'PNG' &&
    value[4] === 0x0d &&
    value[5] === 0x0a &&
    value[6] === 0x1a &&
    value[7] === 0x0a
  ) {
    return 'image/png';
  }
  return null;
}

function cleanFilename(value: string): string {
  const basename = value.split(/[\\/]/).pop() || 'document';
  return basename
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/[^\p{L}\p{N}._ -]/gu, '_')
    .slice(0, 120) || 'document';
}

export async function POST(request: Request): Promise<Response> {
  let storedKey: string | undefined;

  try {
    assertSameOrigin(request);
    const form = await request.formData();
    const applicationId = String(form.get('applicationId') || '');
    const uploadToken = String(form.get('uploadToken') || '');
    const category = String(form.get('category') || '') as DreamFileCategory;
    const file = form.get('file');

    if (!/^[0-9a-f-]{36}$/i.test(applicationId) || !uploadToken) {
      return privateJson({error: 'Invalid upload session.'}, {status: 400});
    }
    if (!DREAM_FILE_CATEGORIES.includes(category)) {
      return privateJson({error: 'Invalid file category.'}, {status: 400});
    }
    if (!(file instanceof File)) {
      return privateJson({error: 'Please select a file.'}, {status: 400});
    }
    if (file.size <= 0 || file.size > MAX_DREAM_FILE_BYTES) {
      return privateJson({error: 'Each file must be smaller than 4 MB.'}, {status: 413});
    }

    const application = await getDreamApplication(applicationId);
    if (
      !application ||
      application.status !== 'draft' ||
      !uploadTokensMatch(uploadToken, application.uploadTokenHash) ||
      !application.draftExpiresAt ||
      new Date(application.draftExpiresAt) <= new Date()
    ) {
      return privateJson({error: 'This upload session has expired.'}, {status: 410});
    }

    const categoryFiles = application.files.filter((entry) => entry.category === category);
    if (category === 'medical' && categoryFiles.length >= 1) {
      return privateJson({error: 'Only one diagnosis document is requested.'}, {status: 400});
    }
    if (category === 'photo' && categoryFiles.length >= MAX_DREAM_PHOTOS) {
      return privateJson({error: `You can upload up to ${MAX_DREAM_PHOTOS} photographs.`}, {status: 400});
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = detectMimeType(buffer);
    if (!mimeType || (category === 'photo' && mimeType === 'application/pdf')) {
      return privateJson(
        {error: category === 'photo' ? 'Photographs must be JPG or PNG.' : 'Use a PDF, JPG or PNG file.'},
        {status: 415},
      );
    }

    const fileId = randomUUID();
    storedKey = createDreamFileKey(application.id, fileId);
    await saveDreamFile(storedKey, buffer);

    const uploadedAt = new Date().toISOString();
    const fileRecord: DreamApplicationFile = {
      id: fileId,
      category,
      originalName: cleanFilename(file.name),
      mimeType,
      size: file.size,
      storageKey: storedKey,
      uploadedAt,
    };

    application.files.push(fileRecord);
    application.updatedAt = uploadedAt;
    await saveDreamApplication(application);

    return privateJson(
      {
        file: {
          id: fileRecord.id,
          category: fileRecord.category,
          originalName: fileRecord.originalName,
          mimeType: fileRecord.mimeType,
          size: fileRecord.size,
        },
      },
      {status: 201},
    );
  } catch (error) {
    if (storedKey) {
      try {
        await deleteDreamFile(storedKey);
      } catch (cleanupError) {
        console.error('Unable to clean up incomplete Dream file', cleanupError);
      }
    }
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }

    console.error('Unable to upload Dream Support file', error);
    return privateJson({error: 'The secure upload failed. Please try again.'}, {status: 503});
  }
}

