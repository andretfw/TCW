export const DREAM_APPLICATION_STATUSES = [
  'draft',
  'new',
  'under_review',
  'more_info_requested',
  'board_review',
  'approved',
  'declined',
  'closed',
] as const;

export type DreamApplicationStatus = (typeof DREAM_APPLICATION_STATUSES)[number];

export const TREATMENT_STATUSES = [
  'active_treatment',
  'post_surgery_recovery',
  'remission',
  'palliative_care',
  'other',
] as const;

export type TreatmentStatus = (typeof TREATMENT_STATUSES)[number];

export const PUBLICITY_CHOICES = ['full', 'anonymous', 'none'] as const;

export type PublicityChoice = (typeof PUBLICITY_CHOICES)[number];

export const PREFERRED_CONTACT_METHODS = ['email', 'phone', 'whatsapp'] as const;

export type PreferredContactMethod = (typeof PREFERRED_CONTACT_METHODS)[number];

export const DREAM_FILE_CATEGORIES = ['medical', 'identity', 'photo'] as const;

export type DreamFileCategory = (typeof DREAM_FILE_CATEGORIES)[number];

export const DREAM_BOARD_DECISIONS = ['approve', 'reject'] as const;

export type DreamBoardDecision = (typeof DREAM_BOARD_DECISIONS)[number];

export interface DreamApplicationInput {
  locale: 'en' | 'ro' | 'es';
  fullName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  socialProfile?: string;
  preferredContact: PreferredContactMethod;
  diagnosis: string;
  cancerStage?: string;
  diagnosisDate: string;
  treatmentStatus: TreatmentStatus;
  treatmentStatusOther?: string;
  story: string;
  dream: string;
  emotionalImpact: string;
  estimatedCost: string;
  requestedAmountEur: number;
  supplierLink?: string;
  differencePlan?: string;
  publicityChoice: PublicityChoice;
  confirmsAdult: boolean;
  confirmsSelfApplication: boolean;
  confirmsNonMedical: boolean;
  confirmsAccuracy: boolean;
  confirmsProofOfUse: boolean;
  acceptsGrantPolicy: boolean;
  acceptsPrivacyNotice: boolean;
  consentsHealthData: boolean;
}

export interface DreamApplicationStartPayload extends DreamApplicationInput {
  website?: string;
}

export interface DreamApplicationFile {
  id: string;
  category: DreamFileCategory;
  originalName: string;
  mimeType: 'application/pdf' | 'image/jpeg' | 'image/png';
  size: number;
  provider: 'google-drive';
  driveFileId: string;
  uploadedAt: string;
}

export interface DreamApplicationNote {
  id: string;
  body: string;
  author: string;
  createdAt: string;
}

export interface DreamBoardVote {
  id: string;
  voterEmail: string;
  decision: DreamBoardDecision;
  createdAt: string;
  updatedAt: string;
}

export interface DreamApplicationEvent {
  id: string;
  type: 'submitted' | 'status_changed' | 'note_added' | 'board_vote_cast';
  fromStatus?: DreamApplicationStatus;
  toStatus?: DreamApplicationStatus;
  decision?: DreamBoardDecision;
  actor: string;
  createdAt: string;
}

export interface DreamApplicationRecord extends DreamApplicationInput {
  id: string;
  reference: string;
  status: DreamApplicationStatus;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  draftExpiresAt?: string;
  /** Used only for unsuccessful applications scheduled for deletion. */
  retentionDeleteAt?: string;
  uploadTokenHash?: string;
  files: DreamApplicationFile[];
  reviewerNotes: DreamApplicationNote[];
  boardVotes?: DreamBoardVote[];
  /** Successful initial board-review email delivery time, keyed by board email. */
  boardReviewNotifiedAt?: Record<string, string>;
  /** Successful one-time reminder delivery time, keyed by board email. */
  boardReminderSentAt?: Record<string, string>;
  /** Short-lived delivery claims prevent overlapping reminder jobs from duplicating mail. */
  boardReminderClaimedAt?: Record<string, string>;
  history: DreamApplicationEvent[];
  consentVersion: 'dream-application-v1';
  grantPolicyVersion: '3.1';
  privacyNoticeVersion: '2026-07-29';
}

export interface DreamApplicationListItem {
  id: string;
  reference: string;
  status: DreamApplicationStatus;
  fullName: string;
  country: string;
  diagnosis: string;
  dream: string;
  estimatedCost: string;
  requestedAmountEur: number;
  locale: DreamApplicationInput['locale'];
  submittedAt?: string;
  updatedAt: string;
  fileCount: number;
}

export const MAX_DREAM_FILE_BYTES = 4 * 1024 * 1024;
export const MAX_DREAM_PHOTOS = 3;
export const DRAFT_RETENTION_HOURS = 24;
export const DECLINED_APPLICATION_RETENTION_DAYS = 365;
export const DREAM_BOARD_APPROVAL_THRESHOLD = 2;
export const DREAM_BOARD_REMINDER_DELAY_HOURS = 72;
