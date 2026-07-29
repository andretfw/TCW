import {
  getDreamContractTemplateStatus,
  saveDreamContractTemplate,
} from '@/lib/dream-applications/contract-templates';
import {
  assertSameOrigin,
  DreamAuthorizationError,
  privateJson,
  requireDreamAdmin,
} from '@/lib/dream-applications/security';
import {
  DREAM_CONTRACT_LANGUAGES,
  type DreamContractLanguage,
} from '@/lib/dream-applications/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_TEMPLATE_BYTES = 2 * 1024 * 1024;

export async function GET(): Promise<Response> {
  try {
    await requireDreamAdmin();
    return privateJson({templates: await getDreamContractTemplateStatus()});
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    console.error('Unable to read contract template status', error);
    return privateJson({error: 'Unable to load contract template status.'}, {status: 503});
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    const {email} = await requireDreamAdmin();
    const form = await request.formData();
    const languageValue = form.get('language');
    const fileValue = form.get('file');
    if (
      typeof languageValue !== 'string'
      || !DREAM_CONTRACT_LANGUAGES.includes(languageValue as DreamContractLanguage)
    ) {
      return privateJson({error: 'Choose Romanian or English for this template.'}, {status: 400});
    }
    if (!(fileValue instanceof File)) {
      return privateJson({error: 'Choose a Word .docx template.'}, {status: 400});
    }
    if (!fileValue.name.toLowerCase().endsWith('.docx')) {
      return privateJson({error: 'The contract template must be a .docx file.'}, {status: 400});
    }
    if (fileValue.size < 1_000 || fileValue.size > MAX_TEMPLATE_BYTES) {
      return privateJson({error: 'The contract template must be between 1 KB and 2 MB.'}, {status: 400});
    }
    const buffer = Buffer.from(await fileValue.arrayBuffer());
    if (buffer[0] !== 0x50 || buffer[1] !== 0x4b) {
      return privateJson({error: 'The selected file is not a valid Word document.'}, {status: 400});
    }
    const language = languageValue as DreamContractLanguage;
    await saveDreamContractTemplate({
      language,
      buffer,
      originalName: fileValue.name,
      uploadedBy: email,
    });
    return privateJson({
      uploaded: true,
      templates: await getDreamContractTemplateStatus(),
    });
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    console.error('Unable to upload contract template', error);
    return privateJson({error: 'Unable to upload this contract template.'}, {status: 503});
  }
}
