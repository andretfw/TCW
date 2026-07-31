import {randomBytes, randomUUID} from 'node:crypto';

import {assertSameOrigin, DreamAuthorizationError} from '@/lib/dream-applications/security';
import {sendConnectExceptionAlert} from '@/lib/connect/email';
import {cleanText, createPortalToken, normalizeEmail, privateJson} from '@/lib/connect/security';
import {
  enforceConnectRateLimit,
  listConnectProfiles,
  saveConnectProfile,
} from '@/lib/connect/store';
import {
  AGE_RANGES,
  CANCER_PHASES,
  COMMUNICATION_METHODS,
  CONNECT_CONSENT_VERSION,
  CONNECT_LOCALES,
  CONNECT_ROLES,
  DAY_PERIODS,
  GENDERS,
  MENTOR_GENDER_PREFERENCES,
  WEEKDAYS,
  type AgeRange,
  type AvailabilityKey,
  type CancerPhase,
  type CommunicationMethod,
  type ConnectGender,
  type ConnectLocale,
  type ConnectProfile,
  type ConnectRole,
  type MentorGenderPreference,
} from '@/lib/connect/types';
import {sendConnectVerificationEmail} from '@/lib/connect/verification-email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isAllowed<T extends readonly string[]>(
  value: unknown,
  options: T,
): value is T[number] {
  return typeof value === 'string' && options.includes(value);
}

function stringArray(value: unknown, maxItems: number, maxLength = 60): string[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > maxItems) {
    throw new Error('INVALID_LIST');
  }
  return [...new Set(value.map((item) => cleanText(item, {min: 1, max: maxLength})))];
}

function availabilityArray(value: unknown): AvailabilityKey[] {
  const entries = stringArray(value, 21, 20);
  for (const entry of entries) {
    const [weekday, period, extra] = entry.split('-');
    if (
      extra ||
      !WEEKDAYS.includes(weekday as (typeof WEEKDAYS)[number]) ||
      !DAY_PERIODS.includes(period as (typeof DAY_PERIODS)[number])
    ) {
      throw new Error('INVALID_AVAILABILITY');
    }
  }
  return entries as AvailabilityKey[];
}

function validTimezone(value: unknown): string {
  const timezone = cleanText(value, {min: 1, max: 80, required: true});
  try {
    new Intl.DateTimeFormat('en-US', {timeZone: timezone}).format();
    return timezone;
  } catch {
    throw new Error('INVALID_TIMEZONE');
  }
}

function clientIdentifier(request: Request, email: string): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const address = forwarded || request.headers.get('x-nf-client-connection-ip') || 'unknown';
  return `${address}:${email}`;
}

function reference(): string {
  const suffix = randomBytes(4).toString('hex').toUpperCase();
  return `TCWC-${new Date().getUTCFullYear()}-${suffix}`;
}

function consentAccepted(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const consent = value as Record<string, unknown>;
  return [
    'adultConfirmed',
    'healthDataMatching',
    'automatedMatching',
    'limitedProfileSharing',
    'mutualContactSharing',
    'automatedMeetingScheduling',
    'programRules',
  ].every((field) => consent[field] === true);
}

export async function POST(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    const body = await request.json().catch(() => null) as Record<string, unknown> | null;
    if (!body) return privateJson({error: 'Invalid request.'}, {status: 400});

    if (!isAllowed(body.role, CONNECT_ROLES)) throw new Error('INVALID_ROLE');
    if (!isAllowed(body.locale, CONNECT_LOCALES)) throw new Error('INVALID_LOCALE');
    if (!isAllowed(body.ageRange, AGE_RANGES)) throw new Error('INVALID_AGE');
    if (!isAllowed(body.gender, GENDERS)) throw new Error('INVALID_GENDER');
    if (!isAllowed(body.phase, CANCER_PHASES)) throw new Error('INVALID_PHASE');
    if (!consentAccepted(body.consent)) throw new Error('CONSENT_REQUIRED');

    const role = body.role as ConnectRole;
    const locale = body.locale as ConnectLocale;
    const email = normalizeEmail(cleanText(body.email, {min: 3, max: 254, required: true}));
    await enforceConnectRateLimit(clientIdentifier(request, email));

    const profiles = await listConnectProfiles();
    const existing = profiles.find((profile) => (
      profile.email === email && profile.role === role && profile.status !== 'closed'
    ));
    if (existing) {
      await sendConnectVerificationEmail(existing).catch(() => undefined);
      return privateJson({ok: true, alreadyRegistered: true}, {status: 202});
    }

    const communicationMethods = stringArray(body.communicationMethods, 2, 30);
    if (!communicationMethods.every((method) => (
      COMMUNICATION_METHODS.includes(method as CommunicationMethod)
    ))) {
      throw new Error('INVALID_COMMUNICATION');
    }

    let mentorGenderPreference: MentorGenderPreference | undefined;
    if (role === 'warrior') {
      if (!isAllowed(body.mentorGenderPreference, MENTOR_GENDER_PREFERENCES)) {
        throw new Error('INVALID_PREFERENCE');
      }
      mentorGenderPreference = body.mentorGenderPreference as MentorGenderPreference;
    }

    const now = new Date().toISOString();
    const requestedCapacity = Math.trunc(Number(body.maxConnections) || 1);
    const maxConnections = role === 'survivor'
      ? Math.min(3, Math.max(1, requestedCapacity))
      : 1;
    const profile: ConnectProfile = {
      id: randomUUID(),
      reference: reference(),
      portalToken: createPortalToken(),
      role,
      locale,
      status: 'pending-verification',
      firstName: cleanText(body.firstName, {min: 1, max: 60, required: true}),
      email,
      country: cleanText(body.country, {min: 2, max: 80, required: true}),
      timezone: validTimezone(body.timezone),
      ageRange: body.ageRange as AgeRange,
      gender: body.gender as ConnectGender,
      languages: stringArray(body.languages, 6, 40),
      cancerType: cleanText(body.cancerType, {min: 2, max: 100, required: true}),
      cancerSubtype: cleanText(body.cancerSubtype, {max: 100}) || undefined,
      phase: body.phase as CancerPhase,
      treatments: stringArray(body.treatments, 12, 80),
      topics: stringArray(body.topics, 12, 80),
      communicationMethods: communicationMethods as CommunicationMethod[],
      availability: availabilityArray(body.availability),
      shortIntro: cleanText(body.shortIntro, {max: 500}) || undefined,
      mentorGenderPreference,
      maxConnections,
      activeConnections: 0,
      consent: {
        version: CONNECT_CONSENT_VERSION,
        adultConfirmed: true,
        healthDataMatching: true,
        automatedMatching: true,
        limitedProfileSharing: true,
        mutualContactSharing: true,
        automatedMeetingScheduling: true,
        programRules: true,
        acceptedAt: now,
      },
      createdAt: now,
      updatedAt: now,
    };

    await saveConnectProfile(profile);
    try {
      await sendConnectVerificationEmail(profile);
    } catch {
      await sendConnectExceptionAlert({
        reference: profile.reference,
        reason: 'VERIFICATION_EMAIL_FAILED',
      }).catch(() => undefined);
    }

    return privateJson({ok: true, reference: profile.reference}, {status: 201});
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    if (error instanceof Error && error.message === 'RATE_LIMITED') {
      return privateJson(
        {error: 'Too many applications were submitted. Please try again tomorrow.'},
        {status: 429},
      );
    }
    console.error('TCW Connect application could not be processed.');
    return privateJson(
      {error: 'Please check the form and try again.'},
      {status: 400},
    );
  }
}
