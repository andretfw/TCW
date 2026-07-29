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

Never paste these values into GitHub, a support ticket, chat, screenshots or a `NEXT_PUBLIC_*` variable. Keep a protected offline backup of the encryption key. Existing applications cannot be decrypted if it is lost or replaced.

Do not add `DREAM_APPLICATION_ENCRYPTION_KEY` or `DREAM_RATE_LIMIT_SALT` to Netlify’s secret-scan omit list. A build should fail if either value is ever found in public output.

### 2. Enable invite-only reviewer identity

In Netlify:

1. Enable **Identity** for the site.
2. Set registration to **Invite only**.
3. Enable Google as an external provider if desired.
4. Invite `tcw@tutticancerwarriors.org`.
5. Keep the account in `DREAM_ADMIN_EMAILS`, or assign the Identity role `dream-reviewer`.

The generic `admin` Identity role does not grant Dream Support access. This is intentional so unrelated site administrators cannot automatically access health information.

The admin API checks authentication on every list, detail, status, note, delete and file-download request. Being signed in is not sufficient; the account must also have the `dream-reviewer` role or an approved email.

### 3. Enforce multi-factor authentication

Use MFA at both account layers:

1. On the Google account behind `tcw@tutticancerwarriors.org`, enable Google two-step verification.
2. In Netlify, open **User settings → Security → Two-factor authentication** and enable 2FA for every Netlify owner or developer account.
3. As a Netlify Team Owner, open **Team settings → Access → Two-factor authentication**, select **Enforced**, and save.
4. Remove any Netlify team member who does not need production or environment-variable access.

Do not rely only on the Google login button in the private reviewer page. The Netlify project account itself controls deployments, environment variables and stored data, so it also requires MFA.

### 4. Enable reference-only email notifications

After the first deploy:

1. Open **Forms** in Netlify and confirm that `dream-application-server-alert` was detected.
2. Add an email notification for that form to `tcw@tutticancerwarriors.org`.
3. Confirm that `dream-retention-alert` was also detected.
4. Add an email notification for `dream-retention-alert` to `tcw@tutticancerwarriors.org`.
5. Submit one test application.
6. Confirm the application email contains only:
   - application reference;
   - application language;
   - submission time.
7. Invoke the retention function in a safe test context and confirm a simulated failure generates an alert containing only a generic event, time and error code.

The final application API sends its alert from the server after the encrypted application has been saved. It retries transient failures three times and records a server error if all attempts fail. The applicant's browser is not responsible for notifying TCW.

The daily retention function also retries its reference-free failure alert three times. It never places an applicant name, reference, diagnosis or file information in the alert.

Applicant names, contact details, answers, photographs and medical documents must never be added to a Netlify form or email notification.

## Reviewing applications

1. Open `https://tutticancerwarriors.org/admin/dream-applications`.
2. Sign in with the invited TCW account.
3. Search or filter the queue.
4. Open an application to review its answers and files.
5. Use private reviewer notes for internal board context.
6. Move the application through `New`, `Under review`, `More information`, `Board review`, `Approved`, `Declined` and `Closed`.

Downloaded files are decrypted only after reviewer authorization. Treat local downloads as confidential, store them only when necessary and delete them immediately after review.

Do not copy medical information into ordinary email, chat, shared spreadsheets or public board materials. Use the private application reference for coordination.

Uploads are restricted to small PDF/JPG/PNG files. PDFs containing common active-content markers such as embedded JavaScript, launch actions, attachments, XFA or interactive forms are rejected. This lowers risk but is not a complete malware scan.

Until TCW contracts a GDPR-appropriate malware-scanning processor or operates a private scanner:

- open files only on a supported and fully updated device;
- keep endpoint protection enabled;
- never upload medical documents to public or free online virus-scanning websites;
- do not bypass operating-system, browser or PDF-reader warnings;
- prefer flattened PDFs or clear JPG/PNG photographs of the relevant page.

Any future external scanning provider must be assessed as a processor, covered by a data-processing agreement, listed in the privacy documentation and reviewed for international-transfer safeguards before real medical files are sent to it.

## Retention and deletion

- Incomplete drafts and their uploads are scheduled for deletion after 24 hours.
- Setting an application to `Declined` starts a 90-day deletion countdown.
- Setting an application or completed grant to `Closed` starts a 90-day deletion countdown.
- Moving it out of `Declined` or `Closed` before deletion cancels that countdown.
- A scheduled Netlify Function runs daily and permanently deletes expired application records and files.
- If cleanup fails, the function logs the failure and sends the generic `dream-retention-alert` notification.
- Reviewers can permanently delete an application sooner from the admin page.
- Pause deletion only when evidence is reasonably required for a dispute, safeguarding matter or legal obligation.

Check the retention function logs and alert delivery at least monthly. Record the date checked, the last successful run and any remedial action in TCW’s restricted compliance register.

Before marking an approved grant `Closed`, record any limited accounting, payment, decision and consent information that TCW must keep under Romanian law in the appropriate restricted accounting or governance system. Do not keep the medical file merely because a financial record must be retained.

## Repository security monitoring

The repository contains:

- weekly Dependabot version checks for npm and GitHub Actions;
- a pull-request dependency review that rejects newly introduced high or critical vulnerabilities;
- a production dependency audit that blocks critical known vulnerabilities;
- CodeQL JavaScript/TypeScript analysis using the `security-extended` query suite.

In GitHub **Settings → Security → Code security and analysis**, confirm the dependency graph, Dependabot alerts and Dependabot security updates are enabled. Review security alerts promptly; do not auto-merge security updates without CI and application review.

## Recovery and incident response

- If the encryption key is lost, existing encrypted records cannot be recovered.
- If a reviewer account may be compromised, remove it from `DREAM_ADMIN_EMAILS`/Identity roles, revoke its Identity session and rotate its login credentials.
- If a Netlify owner account may be compromised, revoke its sessions and tokens, remove unnecessary access, review environment-variable access and deploy history, and rotate affected secrets.
- If the encryption key may be exposed, stop new applications, preserve required evidence, replace the key for new data and assess whether notification obligations apply. Replacing the key alone makes old records unreadable.
- Record any privacy incident, affected references, containment actions and decisions. Seek qualified GDPR/legal advice where required.

## Production verification checklist

- [ ] Required environment variables are configured in the production context.
- [ ] Identity registration is invite-only.
- [ ] Google two-step verification is enabled on the reviewer account.
- [ ] Netlify 2FA is enabled and enforced for the team.
- [ ] The TCW reviewer account can sign in and an unapproved account is denied.
- [ ] An account with only the generic `admin` role is denied.
- [ ] EN, RO and ES public routes load and show the correct language.
- [ ] A flattened PDF/JPG/PNG medical proof below 4 MB uploads.
- [ ] An interactive or active-content PDF is rejected.
- [ ] A disallowed or oversized file is rejected.
- [ ] Optional photographs work and publicity can be set to `None`.
- [ ] The success screen shows a TCW reference.
- [ ] The server-side Netlify application email contains reference-only data and arrives once.
- [ ] A simulated retention failure produces a generic retention alert without applicant data.
- [ ] The application appears in the private queue.
- [ ] A reviewer can download a file only while signed in and authorised.
- [ ] Status updates, notes and retention dates work.
- [ ] CSP, HSTS and no-cache headers are present on the deployed site.
- [ ] GitHub CI, dependency review and CodeQL pass.
- [ ] Public routes, page source, logs and notification emails contain no applicant data.

## Cost controls

This implementation does not use Supabase for Dream Support and does not require a paid Supabase plan. It uses the Netlify services attached to the existing site. Check Netlify usage monthly because Blobs, Functions, Identity and Forms remain subject to the site’s plan and usage limits.
