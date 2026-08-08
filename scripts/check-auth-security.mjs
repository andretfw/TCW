import {readFileSync} from 'node:fs';

function read(path) {
  return readFileSync(path, 'utf8');
}

function requireText(path, pattern, message) {
  const source = read(path);
  if (!source.includes(pattern)) {
    throw new Error(`${message} (${path})`);
  }
}

function forbidText(path, pattern, message) {
  const source = read(path);
  if (source.includes(pattern)) {
    throw new Error(`${message} (${path})`);
  }
}

requireText(
  'lib/connect/session.ts',
  'const ACCESS_TTL_MS = 15 * 60 * 1000;',
  'TCW Connect access links must expire after 15 minutes',
);
requireText(
  'lib/connect/session.ts',
  'record.usedAt = new Date().toISOString();',
  'TCW Connect access links must become single-use',
);
requireText(
  'lib/connect/session.ts',
  "const STORE_NAME = 'tcw-connect-auth';",
  'TCW Connect sessions must be tracked server-side',
);
requireText(
  'lib/connect/session.ts',
  'revokeAllConnectSessions',
  'TCW Connect must support revoking every device session',
);
requireText(
  'lib/connect/access-email.ts',
  '{invalidatePrevious: true}',
  'Requesting a new TCW Connect access email must invalidate older unused access links',
);
requireText(
  'app/api/connect/portal/route.ts',
  "profile.status !== 'pending-verification'",
  'The permanent enrollment token must only work during initial email verification',
);
requireText(
  'lib/connect/safeguarding.ts',
  'revokeAllConnectSessions(reported.id)',
  'Safety blocking must revoke the reported participant sessions',
);
requireText(
  'lib/connect/email.ts',
  'connectAccessPortalUrl',
  'Ongoing TCW Connect emails must use expiring access links',
);
requireText(
  'lib/connect/automation-email.ts',
  'connectAccessPortalUrl',
  'Automated TCW Connect emails must use expiring access links',
);

requireText(
  'lib/dream-applications/reviewer-session.ts',
  'const CODE_TTL_MS = 10 * 60 * 1000;',
  'Reviewer security codes must expire after 10 minutes',
);
requireText(
  'lib/dream-applications/reviewer-session.ts',
  'const SESSION_TTL_SECONDS = 12 * 60 * 60;',
  'Reviewer trusted sessions must expire after 12 hours',
);
requireText(
  'lib/dream-applications/reviewer-session.ts',
  'const MAX_CODE_ATTEMPTS = 5;',
  'Reviewer security codes must have an attempt limit',
);
requireText(
  'lib/dream-applications/security.ts',
  'hasReviewerSecuritySession(context.email)',
  'Confidential reviewer APIs must require the TCW second step',
);
requireText(
  'lib/dream-applications/security.ts',
  'requireDreamReviewerIdentityContext',
  'The security-code endpoint must have a base-identity-only authorization boundary',
);
forbidText(
  'lib/dream-applications/security.ts',
  'hasLegacyReviewerRole',
  'A legacy role must not bypass the current admin/Board allowlist',
);
requireText(
  'app/admin/layout.tsx',
  '<ReviewerSecurityGate>{children}</ReviewerSecurityGate>',
  'Every admin page must pass through the TCW second-step gate',
);
requireText(
  'app/api/admin/security/session/route.ts',
  "body.action === 'request'",
  'Reviewer security route must issue one-time codes',
);
requireText(
  'app/api/admin/security/session/route.ts',
  'verifyReviewerSecurityCode',
  'Reviewer security route must verify one-time codes server-side',
);
requireText(
  'components/admin/ReviewerSecurityGate.tsx',
  'Log out all devices',
  'Reviewer UI must expose global session revocation',
);

for (const path of [
  'components/admin/AdminDreamApplications.tsx',
  'components/admin/DreamBoardReview.tsx',
  'components/admin/AdminConnectSafety.tsx',
]) {
  requireText(
    path,
    "fetch('/api/admin/security/session', {method: 'DELETE'})",
    'Normal reviewer logout must revoke the current TCW security session',
  );
}

console.log('Authentication security regression checks passed.');
