import 'server-only';

import { getUser, type User } from '@netlify/identity';

export class DreamAuthorizationError extends Error {
  constructor(
    message: string,
    public readonly status: 401 | 403,
  ) {
    super(message);
    this.name = 'DreamAuthorizationError';
  }
}

export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get('origin');
  if (!origin) throw new DreamAuthorizationError('Missing request origin.', 403);

  const requestUrl = new URL(request.url);
  if (origin !== requestUrl.origin) {
    throw new DreamAuthorizationError('Cross-origin request rejected.', 403);
  }
}

export async function requireDreamReviewer(): Promise<User> {
  const user = await getUser();
  if (!user) throw new DreamAuthorizationError('Authentication required.', 401);

  const allowedEmails = (process.env.DREAM_ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const roles = user.roles || [];
  const isRoleAllowed = roles.includes('dream-reviewer') || roles.includes('admin');
  const isEmailAllowed = Boolean(user.email && allowedEmails.includes(user.email.toLowerCase()));

  if (!isRoleAllowed && !isEmailAllowed) {
    throw new DreamAuthorizationError('Reviewer access required.', 403);
  }

  return user;
}

export function privateJson(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set('Cache-Control', 'no-store, private');
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(JSON.stringify(data), {...init, headers});
}

