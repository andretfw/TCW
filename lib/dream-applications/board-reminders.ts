import 'server-only';

import {sendDreamBoardReminderEmail} from './email';
import {listDreamApplications, mutateDreamApplication} from './store';
import {
  DREAM_BOARD_REMINDER_DELAY_HOURS,
  type DreamApplicationRecord,
} from './types';

const REMINDER_DELAY_MS = DREAM_BOARD_REMINDER_DELAY_HOURS * 60 * 60 * 1000;
const CLAIM_TTL_MS = 15 * 60 * 1000;

export interface DreamBoardReminderResult {
  sent: Array<{reference: string; email: string}>;
  failed: Array<{reference: string; email: string; error: string}>;
  skipped: number;
}

function normalizedEmail(value: string): string {
  return value.trim().toLowerCase();
}

function hasVoted(application: DreamApplicationRecord, email: string): boolean {
  return (application.boardVotes || []).some(
    (vote) => normalizedEmail(vote.voterEmail) === email,
  );
}

function reminderIsDue(notifiedAt: string, now: Date): boolean {
  const deliveredAt = Date.parse(notifiedAt);
  return Number.isFinite(deliveredAt) && deliveredAt + REMINDER_DELAY_MS <= now.getTime();
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Reminder delivery failed.';
}

export async function processDreamBoardReminders(
  now = new Date(),
): Promise<DreamBoardReminderResult> {
  const result: DreamBoardReminderResult = {sent: [], failed: [], skipped: 0};
  const records = await listDreamApplications();
  const nowIso = now.toISOString();

  for (const record of records) {
    if (record.status !== 'board_review') continue;

    for (const [rawEmail, notifiedAt] of Object.entries(record.boardReviewNotifiedAt || {})) {
      const email = normalizedEmail(rawEmail);
      if (
        !email ||
        hasVoted(record, email) ||
        Boolean(record.boardReminderSentAt?.[email]) ||
        !reminderIsDue(notifiedAt, now)
      ) {
        result.skipped += 1;
        continue;
      }

      const claimToken = nowIso;
      const claim = await mutateDreamApplication(record.id, (application) => {
        const currentNotifiedAt = application.boardReviewNotifiedAt?.[email];
        const currentClaim = application.boardReminderClaimedAt?.[email];
        const currentClaimTime = currentClaim ? Date.parse(currentClaim) : Number.NaN;
        const claimIsFresh = Number.isFinite(currentClaimTime) &&
          currentClaimTime + CLAIM_TTL_MS > now.getTime();

        if (
          application.status !== 'board_review' ||
          hasVoted(application, email) ||
          Boolean(application.boardReminderSentAt?.[email]) ||
          !currentNotifiedAt ||
          !reminderIsDue(currentNotifiedAt, now) ||
          claimIsFresh
        ) {
          return false;
        }

        application.boardReminderClaimedAt = {
          ...(application.boardReminderClaimedAt || {}),
          [email]: claimToken,
        };
        application.updatedAt = nowIso;
        return true;
      });

      if (!claim?.result) {
        result.skipped += 1;
        continue;
      }

      try {
        await sendDreamBoardReminderEmail({
          application: claim.record,
          recipient: email,
        });

        const sentAt = new Date().toISOString();
        await mutateDreamApplication(record.id, (application) => {
          const claims = {...(application.boardReminderClaimedAt || {})};
          if (claims[email] !== claimToken) return false;

          delete claims[email];
          application.boardReminderClaimedAt = claims;
          application.boardReminderSentAt = {
            ...(application.boardReminderSentAt || {}),
            [email]: sentAt,
          };
          application.updatedAt = sentAt;
          return true;
        });
        result.sent.push({reference: record.reference, email});
      } catch (error) {
        await mutateDreamApplication(record.id, (application) => {
          const claims = {...(application.boardReminderClaimedAt || {})};
          if (claims[email] !== claimToken) return false;

          delete claims[email];
          application.boardReminderClaimedAt = claims;
          application.updatedAt = new Date().toISOString();
          return true;
        }).catch((claimError) => {
          console.error(`Unable to release board reminder claim for ${record.reference}.`, claimError);
        });

        result.failed.push({
          reference: record.reference,
          email,
          error: errorMessage(error),
        });
      }
    }
  }

  return result;
}
