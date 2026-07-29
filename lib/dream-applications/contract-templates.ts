import 'server-only';

import {getStore} from '@netlify/blobs';

import type {DreamContractLanguage} from './types';

const STORE_NAME = 'tcw-dream-applications';
const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const TEMPLATE_KEYS: Record<DreamContractLanguage, string> = {
  ro: 'config/contract-template-ro.docx',
  en: 'config/contract-template-en.docx',
};

function store() {
  return getStore({name: STORE_NAME, consistency: 'strong'});
}

function bufferToArrayBuffer(value: Buffer): ArrayBuffer {
  return value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength) as ArrayBuffer;
}

export async function saveDreamContractTemplate(input: {
  language: DreamContractLanguage;
  buffer: Buffer;
  originalName: string;
  uploadedBy: string;
}): Promise<void> {
  const uploadedAt = new Date().toISOString();
  await store().set(TEMPLATE_KEYS[input.language], bufferToArrayBuffer(input.buffer), {
    metadata: {
      kind: 'dream-contract-template',
      language: input.language,
      originalName: input.originalName,
      uploadedBy: input.uploadedBy,
      uploadedAt,
      mimeType: DOCX_MIME,
      size: input.buffer.byteLength,
    },
  });
}

export async function getDreamContractTemplate(language: DreamContractLanguage): Promise<Buffer> {
  const value = await store().get(TEMPLATE_KEYS[language], {
    type: 'arrayBuffer',
    consistency: 'strong',
  });
  if (!value) {
    throw new Error(`The ${language === 'ro' ? 'Romanian' : 'English'} contract template has not been uploaded.`);
  }
  return Buffer.from(value);
}

export async function getDreamContractTemplateStatus(): Promise<Record<DreamContractLanguage, boolean>> {
  const [ro, en] = await Promise.all(
    (['ro', 'en'] as const).map(async (language) => Boolean(await store().get(
      TEMPLATE_KEYS[language],
      {type: 'arrayBuffer', consistency: 'strong'},
    ))),
  );
  return {ro, en};
}
