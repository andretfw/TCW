import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url));
const PORT = Number(process.env.SMOKE_PORT || 3199);
const PROVIDED_BASE_URL = process.env.SMOKE_BASE_URL;
const BASE_URL = PROVIDED_BASE_URL || `http://127.0.0.1:${PORT}`;
const MAX_REDIRECTS = 10;

let server;
let serverLogs = '';

function appendServerLog(chunk) {
  serverLogs += chunk.toString();
  if (serverLogs.length > 20_000) {
    serverLogs = serverLogs.slice(-20_000);
  }
}

async function waitForServer() {
  const deadline = Date.now() + 20_000;

  while (Date.now() < deadline) {
    if (server && server.exitCode !== null) {
      throw new Error(`Next.js exited before the smoke test started:\n${serverLogs}`);
    }

    try {
      const response = await fetch(`${BASE_URL}/robots.txt`, {redirect: 'manual'});
      if (response.status < 500) return;
    } catch {
      // The server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`Next.js did not become ready:\n${serverLogs}`);
}

async function inspectPath(pathname) {
  const visited = new Set();
  const hops = [];
  let currentUrl = new URL(pathname, BASE_URL);

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const visitKey = `${currentUrl.pathname}${currentUrl.search}`;
    if (visited.has(visitKey)) {
      throw new Error(`redirect loop at ${visitKey}`);
    }
    visited.add(visitKey);

    const response = await fetch(currentUrl, {redirect: 'manual'});
    const location = response.headers.get('location');
    hops.push({
      status: response.status,
      path: visitKey,
      location: location || '',
    });

    if (response.status >= 300 && response.status < 400) {
      if (!location) {
        throw new Error(`${visitKey} returned ${response.status} without a Location header`);
      }

      const destination = new URL(location, currentUrl);
      currentUrl = new URL(`${destination.pathname}${destination.search}`, BASE_URL);
      continue;
    }

    const html = await response.text();
    return {
      finalPath: currentUrl.pathname,
      finalStatus: response.status,
      hops,
      headers: response.headers,
      html,
    };
  }

  throw new Error(`more than ${MAX_REDIRECTS} redirects`);
}


function assertHeader(headers, name, expected) {
  const actual = headers.get(name) || '';
  if (actual !== expected) {
    throw new Error(
      `returned ${name}="${actual}" instead of "${expected}"`,
    );
  }
}

function assertSecurityHeaders(headers) {
  const expected = {
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'x-frame-options': 'SAMEORIGIN',
    'permissions-policy': 'camera=(), microphone=(), geolocation=()',
    'strict-transport-security': 'max-age=31536000; includeSubDomains',
  };
  for (const [name, value] of Object.entries(expected)) {
    assertHeader(headers, name, value);
  }

  const policy = headers.get('content-security-policy') || '';
  const requiredDirectives = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "form-action 'self' https://www.paypal.com",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-src 'self' https:",
    "media-src 'self' blob:",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    'upgrade-insecure-requests',
  ];
  for (const directive of requiredDirectives) {
    if (!policy.split(';').map((value) => value.trim()).includes(directive)) {
      throw new Error(
        `Content-Security-Policy is missing "${directive}"`,
      );
    }
  }
}

function assertPrivateHeaders(headers) {
  const cacheControl = headers.get('cache-control') || '';
  if (!cacheControl.includes('no-store') || !cacheControl.includes('private')) {
    throw new Error(
      `returned Cache-Control="${cacheControl}" without private no-store protection`,
    );
  }
  assertHeader(
    headers,
    'x-robots-tag',
    'noindex, nofollow, noarchive',
  );
}

function assertDocument(pathname, result) {
  assertSecurityHeaders(result.headers);
  if (result.finalStatus !== 200) {
    throw new Error(`finished with HTTP ${result.finalStatus} at ${result.finalPath}`);
  }

  const htmlCount = (result.html.match(/<html(?:\s|>)/gi) || []).length;
  if (htmlCount !== 1) {
    throw new Error(`rendered ${htmlCount} <html> elements`);
  }

  const localeMatch = result.finalPath.match(/^\/(en|ro|es)(?:\/|$)/);
  if (!localeMatch) {
    throw new Error(`finished without a supported locale prefix at ${result.finalPath}`);
  }

  const htmlLang = result.html.match(/<html[^>]*\slang="([^"]+)"/i)?.[1];
  if (htmlLang !== localeMatch[1]) {
    throw new Error(`rendered lang="${htmlLang || ''}" instead of "${localeMatch[1]}"`);
  }

  if (!/<title>[^<]+<\/title>/i.test(result.html)) {
    throw new Error('rendered without a page title');
  }
}

function getAttribute(tag, attribute) {
  return tag.match(new RegExp(`\\s${attribute}="([^"]*)"`, 'i'))?.[1] || '';
}

function assertSeo(result, expectedCanonical) {
  const title = result.html.match(/<title>([^<]+)<\/title>/i)?.[1] || '';
  if (title === 'Tutti Cancer Warriors - Born to Thrive') {
    throw new Error('still uses the generic site title');
  }

  const metaTags = [
    ...result.html.matchAll(/<meta\b[^>]*>/gi),
  ].map((match) => match[0]);
  const description = metaTags.find(
    (tag) => getAttribute(tag, 'name').toLowerCase() === 'description',
  );
  if (!description || !getAttribute(description, 'content')) {
    throw new Error('rendered without a meta description');
  }

  const linkTags = [
    ...result.html.matchAll(/<link\b[^>]*>/gi),
  ].map((match) => match[0]);
  const canonicalTag = linkTags.find(
    (tag) => getAttribute(tag, 'rel').toLowerCase() === 'canonical',
  );
  const canonical = canonicalTag ? getAttribute(canonicalTag, 'href') : '';
  if (canonical !== expectedCanonical) {
    throw new Error(
      `rendered canonical "${canonical}" instead of "${expectedCanonical}"`,
    );
  }

  const alternateLanguages = new Set(
    linkTags
      .filter((tag) => getAttribute(tag, 'rel').toLowerCase() === 'alternate')
      .map((tag) => getAttribute(tag, 'hreflang')),
  );
  for (const language of ['en', 'ro', 'es', 'x-default']) {
    if (!alternateLanguages.has(language)) {
      throw new Error(`rendered without hreflang="${language}"`);
    }
  }

  const openGraphUrlTag = metaTags.find(
    (tag) => getAttribute(tag, 'property').toLowerCase() === 'og:url',
  );
  const openGraphUrl = openGraphUrlTag
    ? getAttribute(openGraphUrlTag, 'content')
    : '';
  if (openGraphUrl !== expectedCanonical) {
    throw new Error(
      `rendered og:url "${openGraphUrl}" instead of "${expectedCanonical}"`,
    );
  }
}

async function mapLimit(items, limit, callback) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await callback(items[index]);
    }
  }

  await Promise.all(Array.from({length: limit}, worker));
  return results;
}

async function main() {
  if (!PROVIDED_BASE_URL) {
    const nextBin = fileURLToPath(
      new URL('../node_modules/next/dist/bin/next', import.meta.url),
    );
    server = spawn(
      process.execPath,
      [nextBin, 'start', '--hostname', '127.0.0.1', '--port', String(PORT)],
      {
        cwd: PROJECT_ROOT,
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    server.stdout.on('data', appendServerLog);
    server.stderr.on('data', appendServerLog);
  }

  await waitForServer();

  const sitemapResponse = await fetch(`${BASE_URL}/sitemap.xml`);
  if (!sitemapResponse.ok) {
    throw new Error(`/sitemap.xml returned HTTP ${sitemapResponse.status}`);
  }

  const sitemapXml = await sitemapResponse.text();
  const sitemapUrls = [
    ...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g),
  ].map((match) => match[1]);
  const sitemapEntries = sitemapUrls.map((url) => ({
    url,
    pathname: new URL(url).pathname,
  }));
  const uniqueSitemapUrls = [...new Set(sitemapUrls)];

  if (sitemapUrls.length === 0) {
    throw new Error('The sitemap does not contain any URLs');
  }
  if (uniqueSitemapUrls.length !== sitemapUrls.length) {
    throw new Error('The sitemap contains duplicate URLs');
  }

  const sitemapFailures = [];
  await mapLimit(sitemapEntries, 12, async ({pathname, url}) => {
    try {
      const result = await inspectPath(pathname);
      assertDocument(pathname, result);
      assertSeo(result, url);
      if (result.hops.length !== 1) {
        throw new Error(
          `sitemap URL is not canonical: ${result.hops
            .map((hop) => `${hop.status} ${hop.path}`)
            .join(' -> ')}`,
        );
      }
    } catch (error) {
      sitemapFailures.push(`${pathname}: ${error.message}`);
    }
  });

  const redirectCases = [
    {source: '/', destination: '/es'},
    {
      source: '/en/dream-application',
      destination: '/en/dream-support-application',
    },
    {source: '/en/support-dream', destination: '/en/support-a-dream'},
    {source: '/en/sobre-cancer', destination: '/en/about-cancer'},
    {
      source: '/peer-support-program/',
      destination: '/es/apoyo-entre-pares',
    },
    {
      source: '/donate-to-tutti-cancer-warriors/',
      destination: '/es/donar',
    },
    {source: '/en/team', destination: '/en/about-us'},
    {source: '/ro/echipa', destination: '/ro/despre-noi'},
    {source: '/es/equipo', destination: '/es/sobre-nosotros'},
  ];
  const redirectFailures = [];

  for (const {source, destination} of redirectCases) {
    try {
      const result = await inspectPath(source);
      assertDocument(source, result);
      if (result.finalPath !== destination) {
        throw new Error(`finished at ${result.finalPath}, expected ${destination}`);
      }
      if (result.hops.length < 2) {
        throw new Error('did not redirect');
      }
    } catch (error) {
      redirectFailures.push(`${source}: ${error.message}`);
    }
  }

  const featureFailures = [];
  const localizedDreamChecks = [
    {
      path: '/en/dream-support-application',
      formText: 'Tell us about the dream waiting for you',
      privacyPath: '/en/privacy',
      privacyText: 'Dream Support applications and medical evidence',
    },
    {
      path: '/ro/cerere-sprijin-vis',
      formText: 'Povestește-ne despre visul care te așteaptă',
      privacyPath: '/ro/confidentialitate',
      privacyText: 'Cererile Dream Support și documentele medicale',
    },
    {
      path: '/es/solicitud-sueno',
      formText: 'Cuéntanos sobre el sueño que te espera',
      privacyPath: '/es/privacidad',
      privacyText: 'Solicitudes de Dream Support y documentación médica',
    },
  ];

  for (const check of localizedDreamChecks) {
    try {
      const application = await inspectPath(check.path);
      assertDocument(check.path, application);
      if (!application.html.includes(check.formText)) {
        throw new Error(`missing localized application text: ${check.formText}`);
      }

      const privacy = await inspectPath(check.privacyPath);
      assertDocument(check.privacyPath, privacy);
      if (!privacy.html.includes(check.privacyText)) {
        throw new Error(`missing native privacy wording: ${check.privacyText}`);
      }
    } catch (error) {
      featureFailures.push(`${check.path}: ${error.message}`);
    }
  }

  try {
    const admin = await inspectPath('/admin/dream-applications');
    if (admin.finalStatus !== 200) {
      throw new Error(`finished with HTTP ${admin.finalStatus}`);
    }
    assertSecurityHeaders(admin.headers);
    assertPrivateHeaders(admin.headers);
    if (!admin.html.includes('Dream applications')) {
      throw new Error('rendered without the private review login');
    }
    if (!/name="robots" content="noindex/i.test(admin.html)) {
      throw new Error('rendered without noindex protection');
    }

    const unauthorisedApi = await fetch(
      `${BASE_URL}/api/admin/dream-applications`,
      {redirect: 'manual'},
    );
    assertSecurityHeaders(unauthorisedApi.headers);
    assertPrivateHeaders(unauthorisedApi.headers);
    if (unauthorisedApi.status !== 401) {
      throw new Error(
        `private API returned HTTP ${unauthorisedApi.status} without a reviewer session`,
      );
    }
  } catch (error) {
    featureFailures.push(`/admin/dream-applications: ${error.message}`);
  }

  const failures = [
    ...sitemapFailures,
    ...redirectFailures,
    ...featureFailures,
  ];
  if (failures.length > 0) {
    throw new Error(
      `Route smoke test found ${failures.length} failure(s):\n${failures
        .map((failure) => `- ${failure}`)
        .join('\n')}`,
    );
  }

  console.log(
    `Route and SEO smoke test passed: ${sitemapUrls.length} sitemap URLs, ${redirectCases.length} redirect cases and ${localizedDreamChecks.length + 1} Dream Support feature checks.`,
  );
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  server?.kill('SIGTERM');
}

