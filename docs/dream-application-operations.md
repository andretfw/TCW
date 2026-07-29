# Dream Support application operations

This runbook is for the private Dream Support application system at:

- Public application: `/en/dream-support-application`, `/ro/cerere-sprijin-vis`, `/es/solicitud-sueno`
- Private review: `/admin/dream-applications`

The public form stores applications and uploads in a private Netlify Blobs store. Answers and files are encrypted by the application with AES-256-GCM before they are written. No public Blob URL is created. The Netlify Forms notification contains only the reference, language and submission time.

## Local development

Use Node.js 20.12.2 or newer within the supported Node 20-22 range.

```bash
npm run dev
```

The default development command runs the site through the pinned Netlify CLI so Netlify Identity, Blobs and Functions are available to the Dream Support portal. On the first run, complete any Netlify login or site-linking prompt and make sure the local project is linked to the correct TCW Netlify site.

For public-page styling work that does not need Netlify services, plain Next.js remains available:

```bash
npm run dev:next
```

Do not use `npm run dev:next` to test the private admin login, application storage, uploads, reviewer APIs or retention function. Those features require the Netlify runtime.

## Required setup before the first production deployment

### 1. Add Netlify environment variables

In Netlify, open **Site configuration → Environment variables** and create:

| Variable | Purpose |
| --- | --- |
| `DREAM_APPLICATION_ENCRYPTION_KEY` | Encrypts application answers and files. Must decode to exactly 32 bytes. |
| `DREAM_RATE_LIMIT_SALT` | Separately hashes rate-limit identifiers. |
| `DREAM_ADMIN_EMAILS` | Comma-separated reviewer email allowlist. Start with `tcw@tutticancerwarriors.org`. |

Generate the first two values separately on a trusted computer:

```bash
openssl rand -base64 32
openssl rand -base64 32
```

Never paste these values into GitHub, a support ticket, chat, screenshots or a `NEXT_PUBLIC_*` variable. Keep a protected backup of the encryption key. Existing applications cannot be decrypted if it is lost or replaced.

Do not add `DREAM_APPLICATION_ENCRYPTION_KEY` or `DREAM_RATE_LIMIT_SALT` to Netlify’s secret-scan omit list. A build should fail if either value is ever found in public output.

### 2. Enable invite-only Netlify Identity

In Netlify:

1. Enable **Identity** for the site.
2. Set registration to **Invite only**.
3. Enable Google as an external provider if desired.
4. Invite `tcw@tutticancerwarriors.org`.
5. Require two-factor authentication on the underlying Google/email account.
6. Keep the account in `DREAM_ADMIN_EMAILS`, or assign the Identity role `dream-reviewer`.

The admin API checks authentication on every list, detail, status, note, delete and file-download request. Being signed in is not sufficient; the account must also have an approved role or email.

### 3. Enable the reference-only email notification

After the first deploy:

1. Open **Forms** in Netlify and confirm that `dream-application-alert` was detected.
2. Add an email notification for that form to `tcw@tutticancerwarriors.org`.
3. Submit one test application.
4. Confirm the email contains only:
   - application reference;
   - application language;
   - submission time.

Applicant names, contact details, answers, photographs and medical documents must never be added to the Netlify form or email notification.

## Reviewing applications

1. Open `https://tutticancerwarriors.org/admin/dream-applications`.
2. Sign in with the invited TCW account.
3. Search or filter the queue.
4. Open an application to review its answers and files.
5. Use private reviewer notes for internal board context.
6. Move the application through `New`, `Under review`, `More information`, `Board review`, `Approved`, `Declined` and `Closed`.

Downloaded files are decrypted only after reviewer authorization. Treat local downloads as confidential, store them only when necessary and delete them immediately after review.

Do not copy medical information into ordinary email, chat, shared spreadsheets or public board materials. Use the private application reference for coordination.

Uploads are restricted to small PDF/JPG/PNG files, but the system does not provide a malware-scanning service. Review files only on a supported, fully updated device; do not bypass operating-system or browser security warnings.

## Retention and deletion

- Incomplete drafts and their uploads are scheduled for deletion after 24 hours.
- Setting an application to `Declined` starts a 90-day deletion countdown.
- Setting an application or completed grant to `Closed` starts a 90-day deletion countdown.
- Moving it out of `Declined` or `Closed` before deletion cancels that countdown.
- A scheduled Netlify Function runs daily and permanently deletes expired application records and files.
- Reviewers can permanently delete an application sooner from the admin page.
- Pause deletion only when evidence is reasonably required for a dispute, safeguarding matter or legal obligation.

Before marking an approved grant `Closed`, record any limited accounting, payment, decision and consent information that TCW must keep under Romanian law in the appropriate restricted accounting or governance system. Do not keep the medical file merely because a financial record must be retained.

## Recovery and incident response

- If the encryption key is lost, existing encrypted records cannot be recovered.
- If a reviewer account may be compromised, remove it from `DREAM_ADMIN_EMAILS`/Identity roles, revoke its Identity session and rotate its login credentials.
- If the encryption key may be exposed, stop new applications, preserve required evidence, replace the key for new data and assess whether notification obligations apply. Replacing the key alone makes old records unreadable.
- Record any privacy incident, affected references, containment actions and decisions. Seek qualified GDPR/legal advice where required.

## Production verification checklist

- [ ] Required environment variables are configured in the production context.
- [ ] Identity registration is invite-only.
- [ ] The TCW reviewer account can sign in and an unapproved account is denied.
- [ ] EN, RO and ES public routes load and show the correct language.
- [ ] A PDF/JPG/PNG medical proof below 4 MB uploads.
- [ ] A disallowed or oversized file is rejected.
- [ ] Optional photographs work and publicity can be set to `None`.
- [ ] The success screen shows a TCW reference.
- [ ] The Netlify email contains reference-only data.
- [ ] The application appears in the private queue.
- [ ] A reviewer can download a file only while signed in and authorised.
- [ ] Status updates, notes and retention dates work.
- [ ] Public routes, page source, logs and notification emails contain no applicant data.

## Cost controls

This implementation does not use Supabase for Dream Support and does not require a paid Supabase plan. It uses the Netlify services attached to the existing site. Check Netlify usage monthly because Blobs, Functions, Identity and Forms remain subject to the site’s plan and usage limits.
