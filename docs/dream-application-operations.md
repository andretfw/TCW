# Dream Support application operations

This runbook is for the private Dream Support application system at:

- Public application: `/en/dream-support-application`, `/ro/cerere-sprijin-vis`, `/es/solicitud-sueno`
- Private review: `/admin/dream-applications`

Application answers and reviewer records are encrypted with AES-256-GCM and stored in private Netlify Blobs. Uploaded medical documents and optional photographs are stored in the private Google Workspace Shared Drive `TCW Dream Medical Documents`, inside `Dream Application Uploads`. Netlify stores only the encrypted application record and the private Google Drive file ID. No public Drive or Blob URL is created.

## Local development

Use Node.js 20.12.2 or newer within the supported Node 20-22 range.

```bash
npm run dev
```

The default development command runs the site through the pinned Netlify CLI so Netlify Identity, Blobs and Functions are available. Google OAuth must use a redirect URI registered in Google Auth Platform; production authorisation uses:

```text
https://tutticancerwarriors.org/api/google-drive/oauth/callback
```

For public-page styling work that does not need Netlify services, plain Next.js remains available:

```bash
npm run dev:next
```

Do not use `npm run dev:next` to test reviewer login, application storage, uploads, Google Drive authorisation, reviewer APIs or retention.

## Required setup before production deployment

### 1. Netlify environment variables

In Netlify, open **Project configuration → Environment variables** and create:

| Variable | Purpose |
| --- | --- |
| `DREAM_APPLICATION_ENCRYPTION_KEY` | Encrypts application records and the stored Google refresh token. Must decode to exactly 32 bytes. |
| `DREAM_RATE_LIMIT_SALT` | Separately hashes rate-limit identifiers. |
| `DREAM_ADMIN_EMAILS` | Comma-separated reviewer email allowlist. Start with `tcw@tutticancerwarriors.org`. |
| `GOOGLE_DRIVE_CLIENT_ID` | OAuth web-client ID from Google Auth Platform. |
| `GOOGLE_DRIVE_CLIENT_SECRET` | OAuth web-client secret. Never expose it to browser code. |
| `GOOGLE_DRIVE_UPLOAD_FOLDER_ID` | Folder ID for `Dream Application Uploads` in the private Shared Drive. |
| `GOOGLE_DRIVE_ACCOUNT_EMAIL` | Optional. Defaults to `tcw@tutticancerwarriors.org`. |
| `GOOGLE_DRIVE_OAUTH_REDIRECT_URI` | Optional. Defaults to the production callback URL above. |

Generate the first two random secrets separately on a trusted computer:

```bash
openssl rand -base64 32
openssl rand -base64 32
```

Never paste secrets into GitHub, support tickets, chat, screenshots or `NEXT_PUBLIC_*` variables. Keep a protected offline backup of the application encryption key. Existing encrypted records and the stored Drive connection cannot be decrypted if it is lost or replaced.

To obtain `GOOGLE_DRIVE_UPLOAD_FOLDER_ID`, open the `Dream Application Uploads` folder. Copy only the value after `/folders/` in the Google Drive address bar. The ID is not a password, but it should still remain in server environment configuration rather than public UI code.

### 2. Google Workspace and Shared Drive

1. Keep `TCW Dream Medical Documents` restricted to TCW Workspace members.
2. Keep `tcw@tutticancerwarriors.org` as Manager.
3. Do not create link-sharing permissions.
4. Keep the `Dream Application Uploads` folder private.
5. In Google Cloud project `tcw-document-security`, enable only the Google Drive API required for this integration.
6. Configure the OAuth app as Internal.
7. Configure the OAuth web client with:
   - JavaScript origin: `https://tutticancerwarriors.org`
   - Redirect URI: `https://tutticancerwarriors.org/api/google-drive/oauth/callback`

The portal requests `openid`, `email` and the narrow `drive.file` scope. It does not request broad permission to browse or download unrelated Drive files. Files created by the portal use pseudonymous names containing the TCW reference, file category and a random ID—not the applicant’s name or original filename.

### 3. Connect Google Drive once

After the first manual deployment:

1. Open `https://tutticancerwarriors.org/admin/dream-applications`.
2. Sign in through Netlify Identity with the authorised TCW reviewer account.
3. Use the **Connect Google Drive** banner.
4. Select `tcw@tutticancerwarriors.org` and approve access.
5. Confirm the banner says the private Shared Drive is connected.

The OAuth callback verifies a short-lived anti-CSRF state value and verifies that the connected Google account is exactly the configured TCW address. The refresh token is encrypted before it is written to the private Netlify configuration Blob. Warriors never see Google OAuth and do not need Google accounts.

### 4. Reviewer identity and MFA

In Netlify:

1. Enable Identity.
2. Set registration to **Invite only**.
3. Enable Google as an external provider.
4. Invite `tcw@tutticancerwarriors.org`.
5. Keep the account in `DREAM_ADMIN_EMAILS`, or assign the `dream-reviewer` role.

The generic `admin` role does not grant Dream Support access. Every list, detail, status, note, deletion and file-preview request verifies reviewer access.

Enable MFA on:

- the Google Workspace reviewer account;
- every Netlify owner/developer account;
- GitHub accounts with repository access.

Remove infrastructure access from anyone who does not need it.

### 5. Reference-only email notifications

After deployment:

1. In Netlify Forms, add an email notification for `dream-application-server-alert` to `tcw@tutticancerwarriors.org`.
2. Add an email notification for `dream-retention-alert` to the same address.
3. Confirm the application email contains only the application reference, language and submission time.
4. Confirm retention-failure alerts contain only a generic event, time and error code.

Applicant names, contact details, answers, photographs and medical documents must never be placed in notification emails.

## Upload and review flow

1. A warrior completes the TCW website form without a Google account.
2. The Netlify route validates the upload session, file size and real file signature.
3. PDFs containing common active-content markers such as scripts, launch actions, embedded attachments, XFA or interactive forms are rejected.
4. The server uploads the accepted file to the private Shared Drive with a pseudonymous filename.
5. The encrypted application record stores only the private Drive file ID and the original filename for reviewer display.
6. An authorised reviewer opens the application and follows the protected file link.
7. The protected route redirects to Google Drive preview; Netlify does not stream the document bytes to the reviewer.

Preview documents in Google Drive before choosing to download. Never bypass a Google Drive, browser, operating-system or endpoint-security warning. Do not upload medical records to public or free online virus-scanning websites.

Google Drive security checks reduce risk but cannot guarantee that every hostile or previously unknown file is detected. Review files only on a supported, fully updated device with endpoint protection. Prefer a separate reviewer browser profile or device that does not contain Netlify/GitHub administration sessions or a password manager.

## Retention and deletion

- Incomplete drafts and their Drive uploads are scheduled for deletion after 24 hours.
- Setting an application to `Declined` starts a 90-day deletion countdown.
- Setting an application or completed grant to `Closed` starts a 90-day deletion countdown.
- Moving it out of `Declined` or `Closed` before deletion cancels the countdown.
- The scheduled Netlify Function deletes each private Google Drive file first, then deletes the encrypted application record.
- Manual permanent deletion follows the same order.
- If Drive deletion fails, the application record is retained and the cleanup run fails rather than falsely recording successful deletion.
- Cleanup failure is logged and triggers the generic `dream-retention-alert` notification.

Check retention logs and alert delivery at least monthly. Record the date checked, last successful run and any remedial action in TCW’s restricted compliance register.

Before marking an approved grant `Closed`, move only the limited payment, decision, consent and accounting information TCW must retain into the appropriate restricted governance/accounting system. Do not retain a medical document merely because a financial record must be kept.

## Recovery and incident response

- If the application encryption key is lost, encrypted application records and the stored Google refresh token cannot be recovered.
- If Google Drive shows disconnected or uploads return an authorisation error, reconnect through the private admin banner.
- If a Google reviewer account may be compromised, revoke its sessions, rotate credentials, review Drive activity and reconnect the portal.
- If a Netlify owner account may be compromised, revoke sessions/tokens, review environment-variable access and deployment history, and rotate affected secrets.
- If the Google client secret may be exposed, rotate it in Google Auth Platform and update Netlify.
- If the application encryption key may be exposed, stop new applications, preserve required evidence, rotate the key for future records and assess breach-notification obligations.
- Record every privacy incident, affected references, containment steps and decisions.

## Production verification checklist

- [ ] All required Netlify variables are configured, including `GOOGLE_DRIVE_UPLOAD_FOLDER_ID`.
- [ ] The Shared Drive and upload folder are private and have no link sharing.
- [ ] The Google OAuth app is Internal and the production redirect URI matches exactly.
- [ ] Identity registration is invite-only.
- [ ] Google, Netlify and GitHub MFA are enabled.
- [ ] The TCW reviewer account can sign in; an unapproved account is denied.
- [ ] An account with only the generic `admin` role is denied.
- [ ] The admin banner successfully connects `tcw@tutticancerwarriors.org`.
- [ ] EN, RO and ES public routes load correctly.
- [ ] A valid PDF/JPG/PNG below 4 MB uploads into `Dream Application Uploads`.
- [ ] The Drive filename contains only a TCW reference/category/random ID.
- [ ] Active-content, disallowed and oversized files are rejected.
- [ ] Optional photographs work and publicity can be set to `None`.
- [ ] The application appears in the private queue.
- [ ] The protected file link opens the private Google Drive preview only for an authorised reviewer.
- [ ] No Drive file has a public or link-sharing permission.
- [ ] Application and retention notification emails contain no applicant data.
- [ ] Status updates, notes and retention dates work.
- [ ] Test deletion removes the Drive file and encrypted application record.
- [ ] GitHub CI, dependency review and CodeQL pass.
- [ ] Public routes, page source and logs contain no applicant data or OAuth secrets.

## Cost controls

This implementation does not use Cloud Run, Cloud Storage, an image AI API or Supabase for medical-document storage. It uses the existing Google Workspace Shared Drive, the Google Drive API, and Netlify services attached to the site. Monitor Netlify and Google Workspace audit logs and quotas monthly.
