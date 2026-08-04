import {readFileSync} from 'node:fs';

function source(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
}

function requireText(path, text, explanation) {
  const value = source(path);
  if (!value.includes(text)) {
    throw new Error(`${path}: ${explanation}`);
  }
}

requireText(
  'app/api/connect/portal/route.ts',
  "record.status = 'pending-review'",
  'survivor mentors must remain pending after email confirmation',
);
requireText(
  'lib/connect/service.ts',
  "profile.mentorReview?.status === 'approved'",
  'automatic matching must require an approved mentor review',
);
requireText(
  'lib/connect/service.ts',
  "currentSurvivor.mentorReview?.status !== 'approved'",
  'proposal acceptance must re-check mentor approval',
);
requireText(
  'lib/connect/survivor-matching.ts',
  "survivor.mentorReview?.status !== 'approved'",
  'survivor-initiated matching must reject unapproved mentors',
);
requireText(
  'app/api/connect/portal/route.ts',
  "body.safetyConfirmed === true",
  'acceptance must require a fresh safety confirmation',
);
requireText(
  'lib/connect/safeguarding.ts',
  "record.status = 'suspended'",
  'a reported profile must be suspended immediately',
);
requireText(
  'lib/connect/safeguarding.ts',
  'await cancelConnectMeeting(connection.meeting.eventId)',
  'safeguarding blocks must cancel linked calendar meetings',
);
requireText(
  'lib/connect/safeguarding.ts',
  "record.status = 'cancelled'",
  'open proposals for a reported profile must be cancelled',
);
requireText(
  'app/api/admin/connect-safety/route.ts',
  'await requireDreamAdmin()',
  'safety records must be restricted to the TCW administrator',
);
requireText(
  'app/api/admin/connect-safety/route.ts',
  'assertSameOrigin(request)',
  'admin safety mutations must enforce same-origin requests',
);
requireText(
  'lib/connect/google-calendar.ts',
  "method: 'DELETE'",
  'calendar cancellation must use the Google Calendar delete endpoint',
);

console.log('TCW Connect safeguarding regression checks passed.');
