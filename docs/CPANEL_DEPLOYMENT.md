# Deploying to cPanel (Setup Node.js App)

## What kind of app this is

| Question | Answer (checked in the code, Oct 2026) |
| --- | --- |
| Static, SSR or full-stack? | Next.js 16 App Router. Every page is prerendered at build time, but the app **needs a running Node.js process** for the contact form (a Server Action that sends email), image optimisation (`next/image` + `sharp`), redirects and security headers. A static export would break the form and the redirects. |
| Database | None. |
| Background jobs / cron / WebSockets | None. |
| Vercel-specific features | None in the code (no `@vercel/*`, no edge middleware, no Vercel env vars). Vercel added HSTS on its own; the app now sends it itself (`next.config.ts`). |
| Build output | `output: "standalone"` → `.next/standalone/server.js` (≈ 47 MB with its trimmed `node_modules`). `npm run build:standalone` copies `public/` and `.next/static/` into it. |
| Runtime | Node.js **≥ 20.9** (Next.js 16 minimum). Tested locally on Node 24. |
| Port | Passenger sets `PORT`; don't set it yourself. |

**Check your plan first:** cPanel → Software → **Setup Node.js App** must exist, and the version list must include
20.9+ (22.x or 24.x preferred). If your plan doesn't have Setup Node.js App, this site can't run there as-is — ask the
host to enable it (CloudLinux "Node.js Selector") or move to a plan that has it.

> **Build on Linux.** The standalone folder contains native binaries (`sharp`) for the OS it was built on.
> A bundle built on Windows won't run on a Linux cPanel server. Build on the server (Option A) or on
> Linux / WSL / CI (Option B).

---

## Option A — build on the server (simplest)

1. **Upload the source** (everything except `node_modules/`, `.next/`, `.env*`) to e.g.
   `/home/USER/lawprodigital`, via cPanel → Git Version Control or File Manager.
2. **cPanel → Setup Node.js App → Create Application**
   - Node.js version: newest available (≥ 20.9)
   - Application mode: `Production`
   - Application root: `lawprodigital`
   - Application URL: `lawprodigital.com`
   - Application startup file: `.next/standalone/server.js`
   - Add the [environment variables](#environment-variables), then **Create**.
3. **Install, test and build.** Copy the "Enter to the virtual environment" command from the top of the app page,
   then in cPanel → Terminal:

   ```bash
   source /home/USER/nodevenv/lawprodigital/22/bin/activate && cd /home/USER/lawprodigital
   npm ci --include=dev          # dev deps (Tailwind, TypeScript) are needed to build
   npm test                      # unit tests (no browser needed)
   npm run build:standalone      # next build + copies public/ and .next/static/ into the bundle
   ```

4. Back in Setup Node.js App, click **Restart**, then run the [smoke tests](PRODUCTION_CHECKLIST.md#post-deployment-smoke-tests).

**Updates:** back up the current bundle (`cp -r .next/standalone ~/backups/standalone-$(date +%F-%H%M)`), pull or
upload the changes, re-run step 3, click **Restart**.

If the build is killed for using too much memory (common on shared plans), use Option B.

## Option B — build elsewhere, upload the bundle

On Linux, WSL or CI (GitHub Actions `ubuntu-latest`) with the **same Node major version as the server**:

```bash
npm ci
npm run lint && npm run typecheck && npm test
npm run build:standalone
npx playwright install --with-deps chromium && npm run test:e2e   # optional, runs the browser tests on the bundle
cd .next/standalone && zip -r ../../lawprodigital-standalone-$(date +%F).zip . && cd -
```

Upload the zip to the application root and extract it so that `server.js`, `.next/`, `public/` and `node_modules/`
sit directly in the root. Set **Application startup file** to `server.js` and click **Restart**. Do **not** click
"Run NPM Install" — the bundle already contains its trimmed `node_modules`. Keep the previous zip for rollback.

## Environment variables

Set these in **Setup Node.js App → Environment variables**, then click **Restart**. They're read at request time on
the server and never reach the browser (an e2e test checks the client bundles). `.env.example` has a template.

| Variable | Required | Example | Notes |
| --- | --- | --- | --- |
| `SMTP_HOST` | Yes | `mail.lawprodigital.com` | cPanel → Email Accounts → Connect Devices |
| `SMTP_PORT` | No (465) | `465` | `465` (SSL) or `587` (STARTTLS) |
| `SMTP_SECURE` | No | `true` | Inferred from the port if omitted |
| `SMTP_USER` | Yes | `website@lawprodigital.com` | Full mailbox address |
| `SMTP_PASS` | Yes | — | Mailbox password. Never commit it. |
| `CONTACT_TO` | Yes | `lawprodigital@gmail.com` | Where enquiries are delivered |
| `CONTACT_FROM` | No | `website@lawprodigital.com` | Defaults to `SMTP_USER` |
| `NODE_ENV` | Set by Passenger | `production` | The production CSP depends on it |

**Sending through Gmail instead.** `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_USER` and `CONTACT_FROM`
set to the Gmail address, and `SMTP_PASS` set to a Google **App Password** (Google Account → Security → 2-Step
Verification → App passwords), not the account password. Gmail only sends as the signed-in address.

If the SMTP variables are missing, the form shows "temporarily unavailable" and logs the reason. It never pretends
a message was sent.

## HTTPS and the domain

- Turn on **AutoSSL** (cPanel → SSL/TLS Status) before pointing the domain at the app. The app sends
  `Strict-Transport-Security` and `upgrade-insecure-requests`, so HTTPS must work first.
- Force HTTPS in cPanel → Domains → **Force HTTPS Redirect**.
- Pick one host. `site.url` is `https://lawprodigital.com`; redirect `www.` to it (cPanel → Domains → Redirects, or
  `.htaccess` in `public_html`).
- If the old WordPress site lived in the same `public_html`, remove its `.htaccess` rewrite rules so Passenger
  serves the Node app.

## Logs and troubleshooting

- App errors: `stderr.log` in the application root, or cPanel → Errors. Contact-form failures are logged as
  `[contact] …` with the SMTP error code only — never the password or message content.
- 503 / "Incomplete response": wrong startup file path, or `.next/standalone/server.js` (A) / `server.js` (B) missing.
- Images return 500: the bundle was built on another OS — rebuild on Linux.
- Form says "temporarily unavailable": SMTP variables missing. "Something went wrong sending": wrong credentials or
  port — check the log.

## Local commands

```bash
npm run dev               # development server, http://localhost:3000
npm run lint              # ESLint
npm run typecheck         # TypeScript
npm run lint:copy         # banned-word check (src/content/COPY_RULES.md)
npm test                  # Vitest unit tests
npm run build:standalone  # production build + assemble .next/standalone
npm run start:standalone  # run the production bundle (PORT=3000 by default)
npm run test:e2e          # Playwright against the built bundle (port 3100, SMTP disabled)
```

Rollback and the launch checklist are in [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md).
