import {
  DREAM_APPLICATION_STATUSES,
  PREFERRED_CONTACT_METHODS,
  PUBLICITY_CHOICES,
  TREATMENT_STATUSES,
  type DreamApplicationInput,
  type DreamApplicationStartPayload,
  type DreamApplicationStatus,
} from './types';

export class DreamValidationError extends Error {
  constructor(
    message: string,
    public readonly field?: string,
  ) {
    super(message);
    this.name = 'DreamValidationError';
  }
}

function requiredString(
  value: unknown,
  field: string,
  minLength: number,
  maxLength: number,
): string {
  if (typeof value !== 'string') {
    throw new DreamValidationError('This field is required.', field);
  }

  const normalized = value.trim().replace(/\u0000/g, '');
  if (normalized.length < minLength) {
    throw new DreamValidationError('Please provide a little more detail.', field);
  }
  if (normalized.length > maxLength) {
    throw new DreamValidationError('This answer is too long.', field);
  }
  return normalized;
}

function optionalString(value: unknown, field: string, maxLength: number): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  return requiredString(value, field, 1, maxLength);
}

function requiredBoolean(value: unknown, field: string): true {
  if (value !== true) {
    throw new DreamValidationError('This confirmation is required.', field);
  }
  return true;
}

function requiredEnum<T extends readonly string[]>(
  value: unknown,
  field: string,
  allowed: T,
): T[number] {
  if (typeof value !== 'string' || !allowed.includes(value)) {
    throw new DreamValidationError('Please select a valid option.', field);
  }
  return value as T[number];
}

function optionalUrl(value: unknown, field: string): string | undefined {
  const candidate = optionalString(value, field, 500);
  if (!candidate) return undefined;

  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported protocol');
    return url.toString();
  } catch {
    throw new DreamValidationError('Please enter a complete web address.', field);
  }
}

export function validateDreamApplicationInput(
  value: unknown,
): DreamApplicationStartPayload {
  if (!value || typeof value !== 'object') {
    throw new DreamValidationError('Invalid application.');
  }

  const input = value as Record<string, unknown>;
  const email = requiredString(input.email, 'email', 5, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new DreamValidationError('Please enter a valid email address.', 'email');
  }

  const phone = requiredString(input.phone, 'phone', 7, 50);
  const normalizedPhone = phone.replace(/[()\s.\-]/g, '');
  const phoneDigits = normalizedPhone.replace(/\D/g, '');
  if (!/^\+?\d{7,15}$/.test(normalizedPhone) || /^(\d)\1+$/.test(phoneDigits)) {
    throw new DreamValidationError('Please enter a valid phone number.', 'phone');
  }

  const diagnosisDate = requiredString(input.diagnosisDate, 'diagnosisDate', 4, 10);
  if (!/^\d{4}-(?:0[1-9]|1[0-2])$/.test(diagnosisDate)) {
    throw new DreamValidationError('Please provide a valid diagnosis date.', 'diagnosisDate');
  }
  const currentMonth = new Date().toISOString().slice(0, 7);
  if (diagnosisDate > currentMonth) {
    throw new DreamValidationError('The diagnosis date cannot be in the future.', 'diagnosisDate');
  }

  const requestedAmountEur = Number(input.requestedAmountEur);
  if (!Number.isFinite(requestedAmountEur) || requestedAmountEur <= 0 || requestedAmountEur > 500) {
    throw new DreamValidationError(
      'The requested amount must be between €1 and €500.',
      'requestedAmountEur',
    );
  }

  const treatmentStatus = requiredEnum(
    input.treatmentStatus,
    'treatmentStatus',
    TREATMENT_STATUSES,
  );
  const treatmentStatusOther = optionalString(
    input.treatmentStatusOther,
    'treatmentStatusOther',
    160,
  );
  if (treatmentStatus === 'other' && !treatmentStatusOther) {
    throw new DreamValidationError('Please describe your current status.', 'treatmentStatusOther');
  }

  const locale = requiredEnum(input.locale, 'locale', ['en', 'ro', 'es'] as const);

  return {
    locale,
    fullName: requiredString(input.fullName, 'fullName', 2, 160),
    email,
    phone,
    city: requiredString(input.city, 'city', 2, 120),
    country: requiredString(input.country, 'country', 2, 120),
    socialProfile: optionalUrl(input.socialProfile, 'socialProfile'),
    preferredContact: requiredEnum(
      input.preferredContact,
      'preferredContact',
      PREFERRED_CONTACT_METHODS,
    ),
    diagnosis: requiredString(input.diagnosis, 'diagnosis', 2, 240),
    cancerStage: optionalString(input.cancerStage, 'cancerStage', 80),
    diagnosisDate,
    treatmentStatus,
    treatmentStatusOther,
    story: requiredString(input.story, 'story', 30, 3000),
    dream: requiredString(input.dream, 'dream', 20, 2000),
    emotionalImpact: requiredString(input.emotionalImpact, 'emotionalImpact', 20, 1500),
    estimatedCost: requiredString(input.estimatedCost, 'estimatedCost', 1, 300),
    requestedAmountEur: Math.round(requestedAmountEur * 100) / 100,
    supplierLink: optionalUrl(input.supplierLink, 'supplierLink'),
    differencePlan: optionalString(input.differencePlan, 'differencePlan', 800),
    publicityChoice: requiredEnum(
      input.publicityChoice,
      'publicityChoice',
      PUBLICITY_CHOICES,
    ),
    confirmsAdult: requiredBoolean(input.confirmsAdult, 'confirmsAdult'),
    confirmsSelfApplication: requiredBoolean(
      input.confirmsSelfApplication,
      'confirmsSelfApplication',
    ),
    confirmsNonMedical: requiredBoolean(input.confirmsNonMedical, 'confirmsNonMedical'),
    confirmsAccuracy: requiredBoolean(input.confirmsAccuracy, 'confirmsAccuracy'),
    confirmsProofOfUse: requiredBoolean(input.confirmsProofOfUse, 'confirmsProofOfUse'),
    acceptsGrantPolicy: requiredBoolean(input.acceptsGrantPolicy, 'acceptsGrantPolicy'),
    acceptsPrivacyNotice: requiredBoolean(input.acceptsPrivacyNotice, 'acceptsPrivacyNotice'),
    consentsHealthData: requiredBoolean(input.consentsHealthData, 'consentsHealthData'),
    website: optionalString(input.website, 'website', 200),
  };
}

export function validateDreamStatus(value: unknown): DreamApplicationStatus {
  return requiredEnum(value, 'status', DREAM_APPLICATION_STATUSES);
}

export function validateReviewerNote(value: unknown): string | undefined {
  return optionalString(value, 'reviewerNote', 3000);
}
