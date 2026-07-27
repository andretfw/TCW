import fs from 'node:fs';

function replaceOnce(path, oldText, newText) {
  const text = fs.readFileSync(path, 'utf8');
  const first = text.indexOf(oldText);
  const last = text.lastIndexOf(oldText);
  if (first === -1 || first !== last) {
    throw new Error(`${path}: expected exactly one match`);
  }
  fs.writeFileSync(path, text.replace(oldText, newText));
}

fs.writeFileSync(
  'next.config.mjs',
  `/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
`,
);

if (!fs.existsSync('middleware.ts') || fs.existsSync('proxy.ts')) {
  throw new Error('Expected middleware.ts to exist and proxy.ts not to exist');
}
const middleware = fs.readFileSync('middleware.ts', 'utf8');
const proxy = middleware.replace(
  'export default function middleware(request: NextRequest)',
  'export default function proxy(request: NextRequest)',
);
if (proxy === middleware) {
  throw new Error('Could not rename middleware export to proxy');
}
fs.writeFileSync('proxy.ts', proxy);
fs.unlinkSync('middleware.ts');

replaceOnce(
  'app/[locale]/donar/page.tsx',
  "'use client';\nimport { useTranslations } from 'next-intl';",
  "'use client';\nimport Image from 'next/image';\nimport { useTranslations } from 'next-intl';",
);
replaceOnce(
  'app/[locale]/donar/page.tsx',
  '<img src="/logo.png" alt="Better Giving" className="w-20 h-20 rounded-2xl shadow-md mb-3" />',
  '<Image src="/logo.png" alt="Better Giving" width={80} height={80} className="mb-3 h-20 w-20 rounded-2xl shadow-md" />',
);
replaceOnce(
  'app/[locale]/donar/page.tsx',
  '<img src="/kraken-badge.jpg" alt="Kraken" className="w-6 h-6 rounded-full grayscale opacity-70" />',
  '<Image src="/kraken-badge.jpg" alt="Kraken" width={24} height={24} className="h-6 w-6 rounded-full grayscale opacity-70" />',
);

replaceOnce(
  'app/[locale]/page.tsx',
  "'use client';\nimport { useTranslations, useLocale } from 'next-intl';",
  "'use client';\nimport Image from 'next/image';\nimport { useTranslations, useLocale } from 'next-intl';",
);
replaceOnce(
  'app/[locale]/page.tsx',
  `<img
                    src={warrior.image}
                    alt={warrior.name}
                    className={\`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 \${
                      index === 0 ? 'object-[center_25%]' : index === 1 ? 'object-top' : 'object-center'
                    }\`}
                  />`,
  `<Image
                    src={warrior.image}
                    alt={warrior.name}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className={\`object-cover transition-transform duration-500 group-hover:scale-110 \${
                      index === 0 ? 'object-[center_25%]' : index === 1 ? 'object-top' : 'object-center'
                    }\`}
                  />`,
);

replaceOnce(
  'app/[locale]/support-dream/page.tsx',
  "'use client';\n\nimport {useCallback, useEffect, useMemo, useState} from 'react';",
  "'use client';\n\nimport Image from 'next/image';\nimport {useCallback, useEffect, useMemo, useState} from 'react';",
);
replaceOnce(
  'app/[locale]/support-dream/page.tsx',
  `<img
                    src={card.image}
                    alt={card.imageAlt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />`,
  `<Image
                    src={card.image}
                    alt={card.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />`,
);

replaceOnce(
  'app/[locale]/team/page.tsx',
  "'use client';\n\nimport Link from 'next/link';",
  "'use client';\n\nimport Image from 'next/image';\nimport Link from 'next/link';",
);
replaceOnce(
  'app/[locale]/team/page.tsx',
  '<img src={member.image} alt={member.name} className="h-full w-full object-cover object-center" />',
  '<Image src={member.image} alt={member.name} width={192} height={192} className="h-full w-full object-cover object-center" />',
);

replaceOnce(
  'app/[locale]/warriors/page.tsx',
  "'use client';\nimport { useTranslations, useLocale } from 'next-intl';",
  "'use client';\nimport Image from 'next/image';\nimport { useTranslations, useLocale } from 'next-intl';",
);
replaceOnce(
  'app/[locale]/warriors/page.tsx',
  '<img src={story.image} alt={story.name} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${story.position}`} />',
  `<Image
                  src={story.image}
                  alt={story.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className={\`object-cover transition-transform duration-700 group-hover:scale-105 \${story.position}\`}
                />`,
);
replaceOnce(
  'app/[locale]/warriors/page.tsx',
  '<img src={selectedStory.image} alt={selectedStory.name} className={`w-full h-full object-cover ${selectedStory.position}`} />',
  `<Image
                  src={selectedStory.image}
                  alt={selectedStory.name}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className={\`object-cover \${selectedStory.position}\`}
                />`,
);

const appFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) walk(path);
    else if (path.endsWith('.tsx')) appFiles.push(path);
  }
}
walk('app');
const rawImages = appFiles.filter((path) => fs.readFileSync(path, 'utf8').includes('<img'));
if (rawImages.length) {
  throw new Error(`Raw img elements remain: ${rawImages.join(', ')}`);
}

if (fs.existsSync('trigger-next16-cleanup.txt')) {
  fs.unlinkSync('trigger-next16-cleanup.txt');
}
