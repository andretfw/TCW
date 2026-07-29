import 'server-only';

import {getStore} from '@netlify/blobs';

import {DREAM_FIRST_PORTAL_CONTRACT_NUMBER} from './types';

const STORE_NAME = 'tcw-dream-applications';
const COUNTER_KEY = 'config/dream-contract-sequence.json';
const CONDITIONAL_WRITE_ATTEMPTS = 8;

interface DreamContractSequence {
  nextNumber: number;
  assignments: Record<string, number>;
  updatedAt: string;
}

function store() {
  return getStore({name: STORE_NAME, consistency: 'strong'});
}

function normaliseSequence(value: unknown): DreamContractSequence {
  const input = value && typeof value === 'object' ? value as Partial<DreamContractSequence> : {};
  const assignments = input.assignments && typeof input.assignments === 'object'
    ? Object.fromEntries(
        Object.entries(input.assignments)
          .filter(([applicationId, number]) => (
            Boolean(applicationId)
            && Number.isInteger(number)
            && Number(number) >= DREAM_FIRST_PORTAL_CONTRACT_NUMBER
          ))
          .map(([applicationId, number]) => [applicationId, Number(number)]),
      )
    : {};
  const highestAssigned = Math.max(
    DREAM_FIRST_PORTAL_CONTRACT_NUMBER - 1,
    ...Object.values(assignments),
  );
  const requestedNext = Number.isInteger(input.nextNumber) ? Number(input.nextNumber) : 0;
  return {
    nextNumber: Math.max(
      DREAM_FIRST_PORTAL_CONTRACT_NUMBER,
      highestAssigned + 1,
      requestedNext,
    ),
    assignments,
    updatedAt: typeof input.updatedAt === 'string' ? input.updatedAt : new Date(0).toISOString(),
  };
}

export async function reserveDreamContractNumber(applicationId: string): Promise<number> {
  const cleanApplicationId = applicationId.trim();
  if (!cleanApplicationId) throw new Error('Application ID is required for contract numbering.');

  for (let attempt = 0; attempt < CONDITIONAL_WRITE_ATTEMPTS; attempt += 1) {
    const existing = await store().getWithMetadata(COUNTER_KEY, {
      type: 'text',
      consistency: 'strong',
    });
    const sequence = normaliseSequence(
      existing?.data ? JSON.parse(existing.data) as unknown : undefined,
    );
    const existingAssignment = sequence.assignments[cleanApplicationId];
    if (existingAssignment) return existingAssignment;

    const assigned = sequence.nextNumber;
    sequence.assignments[cleanApplicationId] = assigned;
    sequence.nextNumber = assigned + 1;
    sequence.updatedAt = new Date().toISOString();
    const metadata = {
      kind: 'dream-contract-sequence',
      nextNumber: sequence.nextNumber,
      updatedAt: sequence.updatedAt,
    };
    const write = existing
      ? existing.etag
        ? await store().set(COUNTER_KEY, JSON.stringify(sequence), {
            metadata,
            onlyIfMatch: existing.etag,
          })
        : {modified: false}
      : await store().set(COUNTER_KEY, JSON.stringify(sequence), {
          metadata,
          onlyIfNew: true,
        });

    if (write.modified) return assigned;
  }

  throw new Error('Unable to reserve a unique contract number. Please try again.');
}
