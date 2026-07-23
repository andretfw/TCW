# TCW code quality audit

Commit tested: 0d72b993d9f84bb74f59cce728e0e01b1a5383df
Node: v20.20.2
npm: 10.8.2

- npm ci exit code: 0
- TypeScript exit code: 2
- ESLint exit code: 1
- Production build exit code: 0

## npm ci — last 120 lines
```text
npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
npm warn deprecated next@14.2.15: This version has a security vulnerability. Please upgrade to a patched version. See https://nextjs.org/blog/security-update-2025-12-11 for more details.

added 418 packages, and audited 419 packages in 39s

156 packages are looking for funding
  run `npm fund` for details

14 vulnerabilities (4 moderate, 9 high, 1 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
```

## TypeScript — last 300 lines
```text

> tutti-cancer-warriors@1.0.0 typecheck
> tsc --noEmit

app/api/crypto-verify/route.ts(194,5): error TS2737: BigInt literals are not available when targeting lower than ES2020.
```

## ESLint — last 300 lines
```text

> tutti-cancer-warriors@1.0.0 lint
> next lint

? How would you like to configure ESLint? https://nextjs.org/docs/basic-features/eslint
[?25l❯  Strict (recommended)
   Base
   Cancel ⚠ If you set up ESLint yourself, we recommend adding the Next.js ESLint plugin. See https://nextjs.org/docs/basic-features/eslint#migrating-existing-config
```

## Production build — last 300 lines
```text

> tutti-cancer-warriors@1.0.0 build
> node scripts/audit-build.mjs

TypeScript exit code: 1
ESLint exit code: 1
Audit output written to /audit-results.txt
⚠ No build cache found. Please configure build caching for faster rebuilds. Read more: https://nextjs.org/docs/messages/no-cache
Attention: Next.js now collects completely anonymous telemetry regarding usage.
This information is used to shape Next.js' roadmap and prioritize features.
You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
https://nextjs.org/telemetry

  ▲ Next.js 14.2.15

   Creating an optimized production build ...
Browserslist: browsers data (caniuse-lite) is 7 months old. Please run:
  npx update-browserslist-db@latest
  Why you should do it regularly: https://github.com/browserslist/update-db#readme
Browserslist: caniuse-lite is outdated. Please run:
  npx update-browserslist-db@latest
  Why you should do it regularly: https://github.com/browserslist/update-db#readme
 ✓ Compiled successfully
   Skipping validation of types
   Skipping linting
   Collecting page data ...
   Generating static pages (0/83) ...
u [Error]: ENVIRONMENT_FALLBACK
    at /home/runner/work/TCW/TCW/.next/server/chunks/973.js:1:91195
    at t.useTranslations (/home/runner/work/TCW/TCW/.next/server/chunks/973.js:1:91453)
    at /home/runner/work/TCW/TCW/.next/server/chunks/973.js:1:46144
    at b (/home/runner/work/TCW/TCW/.next/server/chunks/267.js:1:9249)
    at nj (/home/runner/work/TCW/TCW/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:46251)
    at nM (/home/runner/work/TCW/TCW/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:47571)
    at nM (/home/runner/work/TCW/TCW/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:61546)
    at nN (/home/runner/work/TCW/TCW/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:64546)
    at nB (/home/runner/work/TCW/TCW/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:67538)
    at nD (/home/runner/work/TCW/TCW/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:66680) {
  code: 'ENVIRONMENT_FALLBACK',
  originalMessage: undefined
}
u [Error]: ENVIRONMENT_FALLBACK
    at /home/runner/work/TCW/TCW/.next/server/chunks/973.js:1:91195
    at t.useTranslations (/home/runner/work/TCW/TCW/.next/server/chunks/973.js:1:91453)
    at /home/runner/work/TCW/TCW/.next/server/chunks/973.js:1:46144
    at b (/home/runner/work/TCW/TCW/.next/server/chunks/267.js:1:9249)
    at nj (/home/runner/work/TCW/TCW/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:46251)
    at nM (/home/runner/work/TCW/TCW/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:47571)
    at nM (/home/runner/work/TCW/TCW/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:61546)
    at nN (/home/runner/work/TCW/TCW/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:64546)
    at nB (/home/runner/work/TCW/TCW/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:67538)
    at nD (/home/runner/work/TCW/TCW/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:66680) {
  code: 'ENVIRONMENT_FALLBACK',
  originalMessage: undefined
}
u [Error]: ENVIRONMENT_FALLBACK
    at /home/runner/work/TCW/TCW/.next/server/chunks/973.js:1:91195
    at t.useTranslations (/home/runner/work/TCW/TCW/.next/server/chunks/973.js:1:91453)
    at /home/runner/work/TCW/TCW/.next/server/chunks/973.js:1:46144
    at b (/home/runner/work/TCW/TCW/.next/server/chunks/267.js:1:9249)
    at nj (/home/runner/work/TCW/TCW/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:46251)
    at nM (/home/runner/work/TCW/TCW/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:47571)
    at nM (/home/runner/work/TCW/TCW/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:61546)
    at nN (/home/runner/work/TCW/TCW/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:64546)
    at nB (/home/runner/work/TCW/TCW/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:67538)
    at nD (/home/runner/work/TCW/TCW/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:66680) {
  code: 'ENVIRONMENT_FALLBACK',
  originalMessage: undefined
}
   Generating static pages (20/83) 
   Generating static pages (41/83) 
   Generating static pages (62/83) 
 ✓ Generating static pages (83/83)
   Finalizing page optimization ...
   Collecting build traces ...

Route (app)                              Size     First Load JS
┌ ○ /_not-found                          873 B          88.1 kB
├ ● /[locale]                            5.29 kB         115 kB
├   ├ /es
├   ├ /en
├   └ /ro
├ ● /[locale]/bienestar-emocional        2.7 kB          106 kB
├   ├ /es/bienestar-emocional
├   ├ /en/bienestar-emocional
├   └ /ro/bienestar-emocional
├ ● /[locale]/calendario-cancer          2.41 kB         106 kB
├   ├ /es/calendario-cancer
├   ├ /en/calendario-cancer
├   └ /ro/calendario-cancer
├ ● /[locale]/connect-survivor           3.77 kB         114 kB
├   ├ /es/connect-survivor
├   ├ /en/connect-survivor
├   └ /ro/connect-survivor
├ ● /[locale]/donar                      4.01 kB         107 kB
├   ├ /es/donar
├   ├ /en/donar
├   └ /ro/donar
├ ● /[locale]/dream-application          3.46 kB         110 kB
├   ├ /es/dream-application
├   ├ /en/dream-application
├   └ /ro/dream-application
├ ● /[locale]/entender-diagnostico       4.04 kB         114 kB
├   ├ /es/entender-diagnostico
├   ├ /en/entender-diagnostico
├   └ /ro/entender-diagnostico
├ ● /[locale]/events/kidney-cancer-day   1.25 kB        95.3 kB
├   ├ /es/events/kidney-cancer-day
├   ├ /en/events/kidney-cancer-day
├   └ /ro/events/kidney-cancer-day
├ ● /[locale]/events/mens-health-week    1.28 kB        95.3 kB
├   ├ /es/events/mens-health-week
├   ├ /en/events/mens-health-week
├   └ /ro/events/mens-health-week
├ ● /[locale]/events/pilates-event       5.04 kB         124 kB
├   ├ /es/events/pilates-event
├   ├ /en/events/pilates-event
├   └ /ro/events/pilates-event
├ ● /[locale]/financials                 1.75 kB         105 kB
├   ├ /es/financials
├   ├ /en/financials
├   └ /ro/financials
├ ● /[locale]/involucrate                4.65 kB         115 kB
├   ├ /es/involucrate
├   ├ /en/involucrate
├   └ /ro/involucrate
├ ● /[locale]/mens-health-week           4.78 kB         120 kB
├   ├ /es/mens-health-week
├   ├ /en/mens-health-week
├   └ /ro/mens-health-week
├ ● /[locale]/peer-policy                1.28 kB         104 kB
├   ├ /es/peer-policy
├   ├ /en/peer-policy
├   └ /ro/peer-policy
├ ● /[locale]/peer-support               2.23 kB         105 kB
├   ├ /es/peer-support
├   ├ /en/peer-support
├   └ /ro/peer-support
├ ● /[locale]/preguntas-doctor           2.27 kB         105 kB
├   ├ /es/preguntas-doctor
├   ├ /en/preguntas-doctor
├   └ /ro/preguntas-doctor
├ ● /[locale]/privacy                    1.13 kB         104 kB
├   ├ /es/privacy
├   ├ /en/privacy
├   └ /ro/privacy
├ ● /[locale]/share-journey              1.88 kB         105 kB
├   ├ /es/share-journey
├   ├ /en/share-journey
├   └ /ro/share-journey
├ ● /[locale]/sobre-cancer               4.1 kB          120 kB
├   ├ /es/sobre-cancer
├   ├ /en/sobre-cancer
├   └ /ro/sobre-cancer
├ ƒ /[locale]/sobre-cancer/[id]          7.16 kB         123 kB
├ ● /[locale]/support-dream              9.65 kB         113 kB
├   ├ /es/support-dream
├   ├ /en/support-dream
├   └ /ro/support-dream
├ ● /[locale]/team                       3.85 kB         114 kB
├   ├ /es/team
├   ├ /en/team
├   └ /ro/team
├ ● /[locale]/terms                      989 B           104 kB
├   ├ /es/terms
├   ├ /en/terms
├   └ /ro/terms
├ ● /[locale]/voluntarios                2.52 kB         106 kB
├   ├ /es/voluntarios
├   ├ /en/voluntarios
├   └ /ro/voluntarios
├ ● /[locale]/warrior-mood-boost         4.68 kB         108 kB
├   ├ /es/warrior-mood-boost
├   ├ /en/warrior-mood-boost
├   └ /ro/warrior-mood-boost
├ ● /[locale]/warriors                   5.66 kB         116 kB
├   ├ /es/warriors
├   ├ /en/warriors
├   └ /ro/warriors
├ ● /[locale]/world-kidney-cancer-day    4.19 kB         120 kB
├   ├ /es/world-kidney-cancer-day
├   ├ /en/world-kidney-cancer-day
├   └ /ro/world-kidney-cancer-day
├ ƒ /api/campaign-progress               0 B                0 B
├ ƒ /api/crypto-verify                   0 B                0 B
├ ƒ /api/paypal-ipn                      0 B                0 B
├ ○ /robots.txt                          0 B                0 B
└ ○ /sitemap.xml                         0 B                0 B
+ First Load JS shared by all            87.2 kB
  ├ chunks/117-120f1c2e725e3573.js       31.6 kB
  ├ chunks/fd9d1056-abdf57793bb1db61.js  53.6 kB
  └ other shared chunks (total)          1.95 kB


ƒ Middleware                             41.6 kB

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses getStaticProps)
ƒ  (Dynamic)  server-rendered on demand

```
