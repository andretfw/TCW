import 'server-only';

import { getUser, type User } from '@netlify/identity';

const DEFAULT_ADMIN_EMAIL = 'tcw@tutticancerwarriors.org';
const BOARD_SIZE = 3;

export class DreamAuthorizationError extends Error {
  constructor(
    message: string,
    public readonly status: 401 | 403,
  ) {
    super(message);
    this.name = 'DreamAuthorizationError';
  }
}

export interface DreamReviewerContext {
  user: User;
  email: string;
  isAdmin: boolean;
  isBoardMember: boolean;
}

function configuredEmails(value?: string): string[] {
  return [...new Set(
    (value || '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  )];
}

export function dreamAdminEmails(): string[] {
  const configured = configuredEmails(process.env.DREAM_ADMIN_EMAILS);
  return configured.length > 0 ? configured : [DEFAULT_ADMIN_EMAIL];
}

export function dreamBoardEmails(): string[] {
  return configuredEmails(process.env.DREAM_BOARD_EMAILS);
}

export function requireConfiguredDreamBoard(): string[] {
  const emails = dreamBoardEmails();
  if (emails.length !== BOARD_SIZE) {
    throw new Error(`DREAM_BOARD_EMAILS must contain exactly ${BOARD_SIZE} unique email addresses.`);
  }
  return emails;
}

export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get('origin');
  if (!origin) throw new DreamAuthorizationError('Missing request origin.', 403);

  const requestUrl = new URL(request.url);
  if (origin !== requestUrl.origin) {
    throw new DreamAuthorizationError('Cross-origin request rejected.', 403);
  }
}

export async function requireDreamReviewerContext(): Promise<DreamReviewerContext> {
  const user = await getUser();
  if (!user) throw new DreamAuthorizationError('Authentication required.', 401);

  const email = user.email?.trim().toLowerCase();
  if (!email) throw new DreamAuthorizationError('A verified email address is required.', 403);

  const roles = user.roles || [];
  const isAdmin = dreamAdminEmails().includes(email);
  const isBoardMember = dreamBoardEmails().includes(email);
  const hasLegacyReviewerRole = roles.includes('dream-reviewer');

  if (!isAdmin && !isBoardMember && !hasLegacyReviewerRole) {
    throw new DreamAuthorizationError('Reviewer access required.', 403);
  }

  return {user, email, isAdmin, isBoardMember};
}

export async function requireDreamReviewer(): Promise<User> {
  return (await requireDreamReviewerContext()).user;
}

export async function requireDreamAdmin(): Promise<DreamReviewerContext> {
  const context = await requireDreamReviewerContext();
  if (!context.isAdmin) {
    throw new DreamAuthorizationError('Dream administrator access required.', 403);
  }
  return context;
}

export async function requireDreamBoardMember(): Promise<DreamReviewerContext> {
  const context = await requireDreamReviewerContext();
  if (!context.isBoardMember) {
    throw new DreamAuthorizationError('TCW board member access required.', 403);
  }
  return context;
}

export function privateJson(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set('Cache-Control', 'no-store, private');
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(JSON.stringify(data), {...init, headers});
}
