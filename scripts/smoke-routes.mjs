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
      html,
    };
  }

  throw new Error(`more than ${MAX_REDIRECTS} redirects`);
}

function assertDocument(pathname, result) {
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

  const failures = [...sitemapFailures, ...redirectFailures];
  if (failures.length > 0) {
    throw new Error(
      `Route smoke test found ${failures.length} failure(s):\n${failures
        .map((failure) => `- ${failure}`)
        .join('\n')}`,
    );
  }

  console.log(
    `Route and SEO smoke test passed: ${sitemapUrls.length} sitemap URLs and ${redirectCases.length} redirect cases.`,
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
