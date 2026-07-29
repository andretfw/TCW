import { randomUUID } from 'node:crypto';

import { uploadTokensMatch } from '@/lib/dream-applications/crypto';
import {
  deleteGoogleDriveFile,
  uploadDreamFileToGoogleDrive,
} from '@/lib/dream-applications/google-drive';
import { assertSameOrigin, DreamAuthorizationError, privateJson } from '@/lib/dream-applications/security';
import {
  getDreamApplication,
  mutateDreamApplication,
} from '@/lib/dream-applications/store';
import {
  DREAM_FILE_CATEGORIES,
  MAX_DREAM_FILE_BYTES,
  MAX_DREAM_PHOTOS,
  type DreamApplicationFile,
  type DreamApplicationRecord,
  type DreamFileCategory,
} from '@/lib/dream-applications/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SUSPICIOUS_PDF_TOKENS = [
  '/JavaScript',
  '/JS',
  '/Launch',
  '/EmbeddedFile',
  '/OpenAction',
  '/AA',
  '/RichMedia',
  '/AcroForm',
  '/XFA',
] as const;

class DreamUploadError extends Error {
  constructor(
    message: string,
    public readonly status: 400 | 410,
  ) {
    super(message);
    this.name = 'DreamUploadError';
  }
}

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

function containsActivePdfContent(value: Buffer): boolean {
  const source = value.toString('latin1');
  return SUSPICIOUS_PDF_TOKENS.some((token) => source.includes(token));
}

function cleanFilename(value: string): string {
  const basename = value.split(/[\\/]/).pop() || 'document';
  return basename
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/[^\p{L}\p{N}._ -]/gu, '_')
    .slice(0, 120) || 'document';
}

function assertUploadSession(
  application: DreamApplicationRecord | null,
  uploadToken: string,
): asserts application is DreamApplicationRecord {
  if (
    !application ||
    application.status !== 'draft' ||
    !uploadTokensMatch(uploadToken, application.uploadTokenHash) ||
    !application.draftExpiresAt ||
    new Date(application.draftExpiresAt) <= new Date()
  ) {
    throw new DreamUploadError('This upload session has expired.', 410);
  }
}

function assertCategoryCapacity(
  application: DreamApplicationRecord,
  category: DreamFileCategory,
): void {
  const categoryFiles = application.files.filter((entry) => entry.category === category);
  if (category === 'medical' && categoryFiles.length >= 1) {
    throw new DreamUploadError('Only one diagnosis document is requested.', 400);
  }
  if (category === 'photo' && categoryFiles.length >= MAX_DREAM_PHOTOS) {
    throw new DreamUploadError(`You can upload up to ${MAX_DREAM_PHOTOS} photographs.`, 400);
  }
}

export async function POST(request: Request): Promise<Response> {
  let uploadedDriveFileId: string | undefined;

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
    assertUploadSession(application, uploadToken);
    assertCategoryCapacity(application, category);

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = detectMimeType(buffer);
    if (!mimeType || (category === 'photo' && mimeType === 'application/pdf')) {
      return privateJson(
        {error: category === 'photo' ? 'Photographs must be JPG or PNG.' : 'Use a PDF, JPG or PNG file.'},
        {status: 415},
      );
    }
    if (mimeType === 'application/pdf' && containsActivePdfContent(buffer)) {
      return privateJson(
        {error: 'For security, interactive PDFs, embedded attachments and PDFs containing scripts are not accepted. Please upload a flattened PDF, JPG or PNG.'},
        {status: 415},
      );
    }

    const fileId = randomUUID();
    const uploaded = await uploadDreamFileToGoogleDrive({
      buffer,
      applicationReference: application.reference,
      fileId,
      category,
      mimeType,
    });
    uploadedDriveFileId = uploaded.driveFileId;

    const uploadedAt = new Date().toISOString();
    const fileRecord: DreamApplicationFile = {
      id: fileId,
      category,
      originalName: cleanFilename(file.name),
      mimeType,
      size: file.size,
      provider: 'google-drive',
      driveFileId: uploaded.driveFileId,
      uploadedAt,
    };

    const mutation = await mutateDreamApplication(applicationId, (current) => {
      assertUploadSession(current, uploadToken);
      assertCategoryCapacity(current, category);
      current.files.push(fileRecord);
      current.updatedAt = uploadedAt;
    });
    if (!mutation) {
      throw new DreamUploadError('This upload session has expired.', 410);
    }

    uploadedDriveFileId = undefined;
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
    if (uploadedDriveFileId) {
      try {
        await deleteGoogleDriveFile(uploadedDriveFileId);
      } catch (cleanupError) {
        console.error('Unable to clean up incomplete Google Drive upload', cleanupError);
      }
    }
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    if (error instanceof DreamUploadError) {
      return privateJson({error: error.message}, {status: error.status});
    }

    console.error('Unable to upload Dream Support file', error);
    return privateJson({error: 'The secure upload failed. Please try again.'}, {status: 503});
  }
}
