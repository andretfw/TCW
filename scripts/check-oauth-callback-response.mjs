import {readFile} from 'node:fs/promises';

const routeUrl = new URL('../app/api/google-drive/oauth/callback/route.ts', import.meta.url);
const routeSource = await readFile(routeUrl, 'utf8');

if (!routeSource.includes('const headers = new Headers(response.headers);')) {
  throw new Error('OAuth callback must clone response headers before setting the state cookie.');
}

if (!routeSource.includes('return new Response(response.body')) {
  throw new Error('OAuth callback must return a mutable response clone.');
}

if (/response\.headers\.(append|set)\(/.test(routeSource)) {
  throw new Error('OAuth callback must not mutate response headers directly.');
}

const redirect = Response.redirect('https://example.com/admin', 303);
let immutableHeadersConfirmed = false;
try {
  redirect.headers.append('Set-Cookie', 'test=1');
} catch (error) {
  immutableHeadersConfirmed = error instanceof TypeError;
}

if (!immutableHeadersConfirmed) {
  throw new Error('The runtime no longer exposes immutable redirect headers; review this regression check.');
}

const headers = new Headers(redirect.headers);
headers.append('Set-Cookie', 'test=; Max-Age=0; HttpOnly; Secure; SameSite=Lax');
const mutableClone = new Response(redirect.body, {
  status: redirect.status,
  statusText: redirect.statusText,
  headers,
});

if (mutableClone.status !== 303) {
  throw new Error('Mutable redirect clone did not preserve the redirect status.');
}
if (mutableClone.headers.get('location') !== 'https://example.com/admin') {
  throw new Error('Mutable redirect clone did not preserve the Location header.');
}
if (!mutableClone.headers.get('set-cookie')?.includes('Max-Age=0')) {
  throw new Error('Mutable redirect clone did not accept the cleared state cookie.');
}

console.log('OAuth callback response regression check passed.');
