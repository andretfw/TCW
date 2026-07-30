import {createHash, randomUUID} from 'node:crypto';

import {
  DreamAuthorizationError,
  privateJson,
  requireDreamAdmin,
  assertSameOrigin,
} from '@/lib/dream-applications/security';
import {listDreamApplications, saveDreamApplication} from '@/lib/dream-applications/store';
import type {DreamApplicationRecord} from '@/lib/dream-applications/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_ROWS = 250;
const MAX_FIELD_LENGTH = 20_000;

type CsvRow = Record<string, unknown>;

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalized(value: string): string {
  return value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function valueFor(row: Record<string, string>, terms: string[]): string {
  const entry = Object.entries(row).find(([key]) => {
    const header = normalized(key);
    return terms.some((term) => header.includes(term));
  });
  return entry?.[1] || '';
}

function dateFrom(row: Record<string, string>, fallback: string): string {
  const raw = valueFor(row, ['timestamp', 'marca temporala', 'data']);
  const parsed = raw ? new Date(raw) : null;
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : fallback;
}

function fingerprint(row: Record<string, string>): string {
  return createHash('sha256').update(JSON.stringify(Object.entries(row).sort(([a], [b]) => a.localeCompare(b)))).digest('hex');
}

function toRecord(row: Record<string, string>, locale: 'en' | 'ro', adminEmail: string, now: string): DreamApplicationRecord {
  const submittedAt = dateFrom(row, now);
  const fullName = valueFor(row, ['full name', 'name', 'nume complet', 'nume']) || 'Name not supplied in original form';
  const email = valueFor(row, ['email', 'e-mail', 'adresa de email']);
  const phone = valueFor(row, ['phone', 'telefon', 'whatsapp']);
  const diagnosis = valueFor(row, ['diagnosis', 'diagnostic', 'cancer type', 'tipul de cancer']) || 'See original Google Form fields';
  const dream = valueFor(row, ['dream', 'wish', 'dorin', 'visul']) || 'See original Google Form fields';
  const story = valueFor(row, ['story', 'poveste', 'about yourself', 'despre tine']) || 'See original Google Form fields';
  const id = randomUUID();
  const sourceRowFingerprint = fingerprint(row);

  return {
    id,
    reference: `TCW-LEGACY-${submittedAt.slice(0, 10).replaceAll('-', '')}-${id.slice(0, 8).toUpperCase()}`,
    status: 'closed',
    createdAt: submittedAt,
    updatedAt: now,
    submittedAt,
    locale,
    fullName,
    email,
    phone,
    city: valueFor(row, ['city', 'oras', 'oraș', 'localitate']),
    country: valueFor(row, ['country', 'tara', 'țara']) || (locale === 'ro' ? 'Romania' : ''),
    socialProfile: valueFor(row, ['instagram', 'facebook', 'social media', 'profil social']) || undefined,
    preferredContact: email ? 'email' : phone ? 'phone' : 'email',
    diagnosis,
    cancerStage: valueFor(row, ['stage', 'stadiu']) || undefined,
    diagnosisDate: valueFor(row, ['diagnosis date', 'data diagnosticului', 'data diagnostic']) || '',
    treatmentStatus: 'other',
    treatmentStatusOther: valueFor(row, ['treatment status', 'current status', 'tratament', 'stare actuala']) || 'Historical Google Form import',
    story,
    dream,
    emotionalImpact: valueFor(row, ['emotional', 'important', 'inseamna', 'înseamnă']) || 'See original Google Form fields',
    estimatedCost: valueFor(row, ['estimated cost', 'cost estimat', 'cost']) || '',
    requestedAmountEur: 0,
    supplierLink: undefined,
    differencePlan: undefined,
    publicityChoice: 'none',
    confirmsAdult: false,
    confirmsSelfApplication: false,
    confirmsNonMedical: false,
    confirmsAccuracy: false,
    confirmsProofOfUse: false,
    acceptsGrantPolicy: false,
    acceptsPrivacyNotice: false,
    consentsHealthData: false,
    files: [],
    reviewerNotes: [],
    boardVotes: [],
    history: [{id: randomUUID(), type: 'status_changed', toStatus: 'closed', actor: adminEmail, createdAt: now}],
    consentVersion: 'dream-application-v1',
    grantPolicyVersion: '3.1',
    privacyNoticeVersion: '2026-07-29',
    legacyImport: {source: 'google-forms-csv', locale, importedAt: now, importedBy: adminEmail, sourceRowFingerprint, originalFields: row},
  };
}

export async function POST(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    const admin = await requireDreamAdmin();
    const body = await request.json() as {locale?: unknown; rows?: unknown};
    if ((body.locale !== 'en' && body.locale !== 'ro') || !Array.isArray(body.rows) || body.rows.length === 0 || body.rows.length > MAX_ROWS) {
      return privateJson({error: `Upload 1 to ${MAX_ROWS} English or Romanian CSV rows.`}, {status: 400});
    }
    const rows = body.rows.map((source: CsvRow) => Object.fromEntries(
      Object.entries(source || {}).map(([key, value]) => [text(key).slice(0, 300), text(value).slice(0, MAX_FIELD_LENGTH)]).filter(([key]) => key),
    )).filter((row) => Object.values(row).some(Boolean));
    if (!rows.length) return privateJson({error: 'The CSV has no data rows.'}, {status: 400});

    const existing = await listDreamApplications();
    const fingerprints = new Set(existing.map((record) => record.legacyImport?.sourceRowFingerprint).filter(Boolean));
    const now = new Date().toISOString();
    const imported: string[] = [];
    let skipped = 0;
    for (const row of rows) {
      const hash = fingerprint(row);
      if (fingerprints.has(hash)) { skipped += 1; continue; }
      const record = toRecord(row, body.locale, admin.email, now);
      await saveDreamApplication(record);
      fingerprints.add(hash);
      imported.push(record.reference);
    }
    return privateJson({ok: true, imported: imported.length, skipped, references: imported});
  } catch (error) {
    if (error instanceof DreamAuthorizationError) return privateJson({error: error.message}, {status: error.status});
    console.error('Unable to import historical Dream applications', error);
    return privateJson({error: 'Unable to import the CSV.'}, {status: 503});
  }
}
