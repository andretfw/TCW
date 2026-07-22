# Tutti Cancer Warriors

Official multilingual website for Tutti Cancer Warriors NGO.

## Languages

The website keeps three language versions through `next-intl`:

- English: `/en`
- Romanian: `/ro`
- Spanish: `/es` and the default locale

Translation content is stored in `messages/en.json`, `messages/ro.json`, and `messages/es.json`.

## Technology

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- `next-intl` multilingual routing
- Netlify deployment

## Local development

Use Node.js 20.

```bash
npm install
npm run dev
```

Run a clean production build with:

```bash
npm run clean
npm run build
```

## Deployment

Netlify reads the deployment settings from `netlify.toml` and builds the site using Node.js 20.

Work intended for the Netlify migration should be prepared on the `netlify-migration` branch and reviewed before it is merged into `main`.

## Important ownership note

The GitHub repository, Netlify site, DNS records, forms, donation accounts, analytics, and any external services used by the website should remain under accounts controlled by Tutti Cancer Warriors.
