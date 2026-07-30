import {readFile} from 'node:fs/promises';

const pageUrl = new URL(
  '../app/[locale]/entender-diagnostico/page.tsx',
  import.meta.url,
);
const source = await readFile(pageUrl, 'utf8');

if (!source.includes("localizedPath(locale, 'dreamApplication')")) {
  throw new Error(
    'Understanding Diagnosis support CTA must link to the Dream Support application.',
  );
}

if (source.includes("localizedPath(locale, 'volunteers')")) {
  throw new Error(
    'Understanding Diagnosis support CTA must not link to the volunteer page.',
  );
}

console.log('Diagnosis support CTA regression check passed.');
