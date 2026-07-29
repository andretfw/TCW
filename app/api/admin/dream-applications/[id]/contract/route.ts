import {randomUUID} from 'node:crypto';

import {reserveDreamContractNumber} from '@/lib/dream-applications/contract-sequence';
import {generateDreamContract} from '@/lib/dream-applications/contract-document';
import {upsertDreamContractInGoogleDrive} from '@/lib/dream-applications/contract-drive';
import {
  assertSameOrigin,
  DreamAuthorizationError,
  privateJson,
  requireDreamAdmin,
} from '@/lib/dream-applications/security';
import {
  getDreamApplication,
  mutateDreamApplication,
} from '@/lib/dream-applications/store';
import {
  DREAM_CONTRACT_LANGUAGES,
  DREAM_CONTRACT_PAYMENT_METHODS,
  type DreamContractDetails,
  type DreamContractLanguage,
  type DreamContractPaymentMethod,
} from '@/lib/dream-applications/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GENERATION_CLAIM_TTL_MS = 5 * 60 * 1000;

class ContractRequestError extends Error {
  constructor(
    message: string,
    public readonly status: 400 | 404 | 409,
  ) {
    super(message);
    this.name = 'ContractRequestError';
  }
}

function text(value: unknown, label: string, minimum: number, maximum: number): string {
  if (typeof value !== 'string') throw new ContractRequestError(`${label} is required.`, 400);
  const clean = value.trim().replace(/\s+/g, ' ');
  if (clean.length < minimum) throw new ContractRequestError(`${label} is required.`, 400);
  if (clean.length > maximum) {
    throw new ContractRequestError(`${label} must be ${maximum} characters or fewer.`, 400);
  }
  return clean;
}

function isoDate(value: unknown, label: string, allowFuture: boolean): string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new ContractRequestError(`${label} is required.`, 400);
  }
  const parsed = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new ContractRequestError(`${label} is invalid.`, 400);
  }
  if (!allowFuture && parsed > new Date()) {
    throw new ContractRequestError(`${label} cannot be in the future.`, 400);
  }
  return value;
}

function parseDetails(value: unknown): DreamContractDetails {
  if (!value || typeof value !== 'object') {
    throw new ContractRequestError('Contract details are required.', 400);
  }
  const input = value as Record<string, unknown>;
  if (
    typeof input.language !== 'string'
    || !DREAM_CONTRACT_LANGUAGES.includes(input.language as DreamContractLanguage)
  ) {
    throw new ContractRequestError('Choose Romanian or English for the contract.', 400);
  }
  if (
    typeof input.paymentMethod !== 'string'
    || !DREAM_CONTRACT_PAYMENT_METHODS.includes(input.paymentMethod as DreamContractPaymentMethod)
  ) {
    throw new ContractRequestError('Choose how the approved support will be provided.', 400);
  }
  const approvedAmountEur = Number(input.approvedAmountEur);
  if (!Number.isInteger(approvedAmountEur) || approvedAmountEur < 1 || approvedAmountEur > 500) {
    throw new ContractRequestError('The approved amount must be a whole number between 1 and 500 EUR.', 400);
  }

  return {
    language: input.language as DreamContractLanguage,
    fullAddress: text(input.fullAddress, 'Full address', 5, 500),
    birthDate: isoDate(input.birthDate, 'Birth date', false),
    nationality: text(input.nationality, 'Nationality', 2, 100),
    idDocumentType: text(input.idDocumentType, 'Identity document type', 2, 100),
    idSeriesNumber: text(input.idSeriesNumber, 'Identity document series and number', 2, 120),
    approvedAmountEur,
    approvedRequest: text(input.approvedRequest, 'Exact approved request', 5, 2_000),
    paymentMethod: input.paymentMethod as DreamContractPaymentMethod,
    contractDate: isoDate(input.contractDate, 'Contract date', true),
  };
}

function publicContractState(record: Awaited<ReturnType<typeof getDreamApplication>>) {
  if (!record) return null;
  return {
    contractDetails: record.contractDetails,
    contractNumber: record.contractNumber,
    contractDocument: record.contractDocument,
  };
}

export async function POST(
  request: Request,
  {params}: {params: Promise<{id: string}>},
): Promise<Response> {
  try {
    assertSameOrigin(request);
    const {email: adminEmail} = await requireDreamAdmin();
    const {id} = await params;
    const body = await request.json() as {mode?: unknown; details?: unknown};
    const mode = body.mode === 'save' ? 'save' : body.mode === 'generate' ? 'generate' : null;
    if (!mode) throw new ContractRequestError('A valid contract action is required.', 400);
    const details = parseDetails(body.details);
    const existing = await getDreamApplication(id);
    if (!existing || existing.status === 'draft') {
      throw new ContractRequestError('Application not found.', 404);
    }
    if (existing.status !== 'approved') {
      throw new ContractRequestError('Contracts can be prepared only for approved applications.', 409);
    }

    if (mode === 'save') {
      const saved = await mutateDreamApplication(id, (application) => {
        if (application.status !== 'approved') {
          throw new ContractRequestError('The application is no longer approved.', 409);
        }
        application.contractDetails = details;
        application.updatedAt = new Date().toISOString();
        return true;
      });
      if (!saved) throw new ContractRequestError('Application not found.', 404);
      return privateJson({saved: true, ...publicContractState(saved.record)});
    }

    const candidateNumber = existing.contractNumber || await reserveDreamContractNumber(id);
    const claimTime = new Date().toISOString();
    const claimed = await mutateDreamApplication(id, (application) => {
      if (application.status !== 'approved') {
        throw new ContractRequestError('The application is no longer approved.', 409);
      }
      if (application.contractGenerationClaimedAt) {
        const claimedAt = new Date(application.contractGenerationClaimedAt).getTime();
        if (Number.isFinite(claimedAt) && Date.now() - claimedAt < GENERATION_CLAIM_TTL_MS) {
          throw new ContractRequestError('A contract is already being generated for this application.', 409);
        }
      }
      application.contractDetails = details;
      application.contractNumber = application.contractNumber || candidateNumber;
      application.contractGenerationClaimedAt = claimTime;
      application.updatedAt = claimTime;
      return {
        contractNumber: application.contractNumber,
        existingDriveFileId: application.contractDocument?.driveFileId,
      };
    });
    if (!claimed) throw new ContractRequestError('Application not found.', 404);

    try {
      const generated = await generateDreamContract({
        application: claimed.record,
        details,
        contractNumber: claimed.result.contractNumber,
      });
      const driveFileId = await upsertDreamContractInGoogleDrive({
        buffer: generated.buffer,
        filename: generated.filename,
        reference: claimed.record.reference,
        contractNumber: claimed.result.contractNumber,
        language: details.language,
        existingDriveFileId: claimed.result.existingDriveFileId,
      });
      const generatedAt = new Date().toISOString();
      const completed = await mutateDreamApplication(id, (application) => {
        if (application.contractGenerationClaimedAt !== claimTime) {
          throw new ContractRequestError('The contract generation session expired.', 409);
        }
        application.contractDetails = details;
        application.contractDocument = {
          contractNumber: claimed.result.contractNumber,
          language: details.language,
          contractDate: details.contractDate,
          filename: generated.filename,
          driveFileId,
          generatedAt,
          generatedBy: adminEmail,
          sha256: generated.sha256,
        };
        application.contractGenerationClaimedAt = undefined;
        application.updatedAt = generatedAt;
        application.history.push({
          id: randomUUID(),
          type: 'contract_generated',
          actor: adminEmail,
          createdAt: generatedAt,
        });
        return true;
      });
      if (!completed) throw new ContractRequestError('Application not found.', 404);
      return privateJson({
        generated: true,
        downloadUrl: `/api/admin/dream-applications/${encodeURIComponent(id)}/contract/download`,
        ...publicContractState(completed.record),
      });
    } catch (generationError) {
      await mutateDreamApplication(id, (application) => {
        if (application.contractGenerationClaimedAt === claimTime) {
          application.contractGenerationClaimedAt = undefined;
          application.updatedAt = new Date().toISOString();
        }
        return true;
      }).catch(() => undefined);
      throw generationError;
    }
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    if (error instanceof ContractRequestError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    console.error('Unable to prepare Dream contract', error);
    return privateJson({error: 'Unable to prepare this contract.'}, {status: 503});
  }
}
