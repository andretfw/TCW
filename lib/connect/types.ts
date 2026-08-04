export const CONNECT_LOCALES = ['en', 'ro', 'es'] as const;
export type ConnectLocale = (typeof CONNECT_LOCALES)[number];

export const CONNECT_ROLES = ['survivor', 'warrior'] as const;
export type ConnectRole = (typeof CONNECT_ROLES)[number];

export const CONNECT_PROFILE_STATUSES = [
  'pending-verification',
  'pending-review',
  'review-rejected',
  'active',
  'paused',
  'matched',
  'suspended',
  'closed',
] as const;
export type ConnectProfileStatus = (typeof CONNECT_PROFILE_STATUSES)[number];

export const MENTOR_VERIFICATION_METHODS = [
  'video-call',
  'document-review',
  'trusted-referral',
  'other',
] as const;
export type MentorVerificationMethod =
  (typeof MENTOR_VERIFICATION_METHODS)[number];

export interface MentorReview {
  status: 'pending' | 'approved' | 'rejected';
  identityVerified: boolean;
  survivorExperienceVerified: boolean;
  verificationMethod?: MentorVerificationMethod;
  reviewedAt?: string;
  reviewedBy?: string;
  note?: string;
}

export const AGE_RANGES = [
  '18-24',
  '25-34',
  '35-44',
  '45-54',
  '55-64',
  '65+',
  'prefer-not',
] as const;
export type AgeRange = (typeof AGE_RANGES)[number];

export const GENDERS = [
  'woman',
  'man',
  'nonbinary',
  'self-described',
  'prefer-not',
] as const;
export type ConnectGender = (typeof GENDERS)[number];

export const MENTOR_GENDER_PREFERENCES = [
  'no-preference',
  'woman',
  'man',
  'nonbinary',
] as const;
export type MentorGenderPreference =
  (typeof MENTOR_GENDER_PREFERENCES)[number];

export const CANCER_PHASES = [
  'newly-diagnosed',
  'in-treatment',
  'post-treatment',
  'recurrence',
  'metastatic',
] as const;
export type CancerPhase = (typeof CANCER_PHASES)[number];

export const COMMUNICATION_METHODS = ['google-meet', 'email'] as const;
export type CommunicationMethod = (typeof COMMUNICATION_METHODS)[number];

export const WEEKDAYS = [
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export const DAY_PERIODS = ['morning', 'afternoon', 'evening'] as const;
export type DayPeriod = (typeof DAY_PERIODS)[number];
export type AvailabilityKey = `${Weekday}-${DayPeriod}`;

export const CONNECT_CONSENT_VERSION = '2026-08-04-v2';

export interface ConnectConsent {
  version: typeof CONNECT_CONSENT_VERSION;
  adultConfirmed: true;
  healthDataMatching: true;
  automatedMatching: true;
  limitedProfileSharing: true;
  mutualContactSharing: true;
  automatedMeetingScheduling: true;
  safetyAndReporting: true;
  programRules: true;
  acceptedAt: string;
}

export interface ConnectMeetingReservation {
  connectionId: string;
  claimId: string;
  startsAt: string;
  endsAt: string;
  createdAt: string;
}

export interface ConnectProfile {
  id: string;
  reference: string;
  portalToken: string;
  role: ConnectRole;
  locale: ConnectLocale;
  status: ConnectProfileStatus;
  firstName: string;
  email: string;
  country: string;
  timezone: string;
  ageRange: AgeRange;
  gender: ConnectGender;
  languages: string[];
  cancerType: string;
  cancerSubtype?: string;
  phase: CancerPhase;
  treatments: string[];
  topics: string[];
  communicationMethods: CommunicationMethod[];
  availability: AvailabilityKey[];
  shortIntro?: string;
  mentorGenderPreference?: MentorGenderPreference;
  maxConnections: number;
  activeConnections: number;
  emailVerifiedAt?: string;
  mentorReview?: MentorReview;
  suspendedAt?: string;
  suspensionIncidentId?: string;
  meetingReservations?: ConnectMeetingReservation[];
  consent: ConnectConsent;
  createdAt: string;
  updatedAt: string;
}

export const MATCH_PROPOSAL_STATUSES = [
  'pending-survivor',
  'pending-warrior',
  'accepted',
  'declined',
  'expired',
  'cancelled',
] as const;
export type MatchProposalStatus =
  (typeof MATCH_PROPOSAL_STATUSES)[number];

export interface MatchProposal {
  id: string;
  survivorId: string;
  warriorId: string;
  score: number;
  reasons: string[];
  status: MatchProposalStatus;
  survivorAcceptedAt?: string;
  warriorAcceptedAt?: string;
  survivorSafetyConfirmedAt?: string;
  warriorSafetyConfirmedAt?: string;
  declinedBy?: ConnectRole;
  cancelledForIncidentId?: string;
  reminderCount?: number;
  lastReminderAt?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export const CONNECTION_STATUSES = [
  'needs-scheduling',
  'scheduled',
  'active',
  'ended',
] as const;
export type ConnectionStatus = (typeof CONNECTION_STATUSES)[number];

export interface ConnectMeeting {
  eventId: string;
  startsAt: string;
  endsAt: string;
  meetUrl: string;
  calendarUrl?: string;
  createdAt: string;
}

export interface ConnectSchedulingOption {
  id: string;
  startsAt: string;
  endsAt: string;
}

export interface ConnectSchedulingSelection {
  optionId: string;
  selectedAt: string;
}

export interface ConnectSchedulingClaim {
  id: string;
  optionId: string;
  claimedAt: string;
}

export interface ConnectConnection {
  id: string;
  proposalId: string;
  survivorId: string;
  warriorId: string;
  status: ConnectionStatus;
  meeting?: ConnectMeeting;
  schedulingOptions?: ConnectSchedulingOption[];
  schedulingSelections?: Partial<Record<ConnectRole, ConnectSchedulingSelection>>;
  schedulingClaim?: ConnectSchedulingClaim;
  schedulingError?: string;
  firstCheckInSentAt?: string;
  monthCheckInSentAt?: string;
  createdAt: string;
  updatedAt: string;
  endedAt?: string;
  endedBy?: ConnectRole;
  endedReason?: 'participant-ended' | 'safety-block';
  incidentId?: string;
}

export const CONNECT_INCIDENT_CATEGORIES = [
  'safety-concern',
  'harassment',
  'medical-advice',
  'money-request',
  'privacy',
  'identity',
  'other',
] as const;
export type ConnectIncidentCategory =
  (typeof CONNECT_INCIDENT_CATEGORIES)[number];

export const CONNECT_INCIDENT_STATUSES = [
  'open',
  'reviewing',
  'resolved',
  'dismissed',
] as const;
export type ConnectIncidentStatus =
  (typeof CONNECT_INCIDENT_STATUSES)[number];

export interface ConnectIncidentHistoryEvent {
  id: string;
  action: string;
  actor: string;
  note?: string;
  createdAt: string;
}

export interface ConnectIncident {
  id: string;
  reference: string;
  reporterProfileId: string;
  reportedProfileId: string;
  reporterPreviousStatus: ConnectProfileStatus;
  reportedPreviousStatus: ConnectProfileStatus;
  sourceProposalId?: string;
  sourceConnectionId?: string;
  category: ConnectIncidentCategory;
  details?: string;
  status: ConnectIncidentStatus;
  affectedConnectionIds: string[];
  meetingCancellationFailures: string[];
  history: ConnectIncidentHistoryEvent[];
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicConnectProfile {
  id: string;
  role: ConnectRole;
  firstName: string;
  ageRange: AgeRange;
  gender: ConnectGender;
  country: string;
  timezone: string;
  languages: string[];
  cancerType: string;
  cancerSubtype?: string;
  phase: CancerPhase;
  treatments: string[];
  topics: string[];
  communicationMethods: CommunicationMethod[];
  shortIntro?: string;
}

export interface ConnectPortalState {
  profile: PublicConnectProfile & {
    reference: string;
    status: ConnectProfileStatus;
    availability: AvailabilityKey[];
  };
  proposal?: {
    id: string;
    status: MatchProposalStatus;
    score: number;
    reasons: string[];
    counterpart: PublicConnectProfile;
    expiresAt: string;
  };
  connection?: {
    id: string;
    status: ConnectionStatus;
    counterpart: PublicConnectProfile;
    meeting?: ConnectMeeting;
    schedulingOptions?: ConnectSchedulingOption[];
    selectedOptionId?: string;
    counterpartSelectedOptionId?: string;
    schedulingInProgress?: boolean;
    schedulingError?: boolean;
  };
}
