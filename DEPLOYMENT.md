# Deploying to cPanel (Setup Node.js App)

The site is a Next.js 16 app built with `output: "standalone"`. A build produces a
self-contained server in `.next/standalone/` that runs with plain `node server.js` — no
`node_modules` install is needed on the server for that folder.

## Requirements

- cPanel with **Setup Node.js App** (Phusion Passenger).
- **Node.js 20.9 or newer** (Next.js 16's minimum). Choose the newest version cPanel offers — 22.x or 24.x.
- An email account for the contact form's SMTP (see [Environment variables](#environment-variables)).

> **Build on Linux.** The standalone folder contains native binaries (e.g. `sharp` for image
> optimization) for the OS it was built on. A bundle built on Windows will not run on a Linux
> cPanel server. Build on the server itself (Option A) or on Linux/WSL/CI (Option B).

---

## Option A — build on the server (simplest)

1. **Upload the source** (everything except `node_modules/` and `.next/`) to e.g.
   `/home/USER/lawprodigital`, via Git (cPanel → Git Version Control) or File Manager.
2. **cPanel → Setup Node.js App → Create Application**
   - Node.js version: newest available (≥ 20.9)
   - Application mode: `Production`
   - Application root: `lawprodigital`
   - Application URL: `lawprodigital.com`
   - Application startup file: `.next/standalone/server.js`
   - Add the [environment variables](#environment-variables).
   - Click **Create**.
3. **Install and build.** Copy the "Enter to the virtual environment" command shown at the top of the app page, then in cPanel → Terminal:

   ```bash
   source /home/USER/nodevenv/lawprodigital/22/bin/activate && cd /home/USER/lawprodigital
   npm ci --include=dev          # dev deps (Tailwind, TypeScript) are needed to build
   npm run build:standalone      # next build + copies public/ and .next/static/ into the bundle
   ```

4. Back in Setup Node.js App, click **Restart**.

To deploy updates: pull or upload the changes, re-run step 3, then click **Restart**.

If the build is killed for using too much memory (common on shared plans), use Option B.

## Option B — build elsewhere, upload the bundle

On Linux, WSL, or CI (GitHub Actions `ubuntu-latest`), with the same Node major version as the server:

```bash
npm ci
npm run build:standalone
cd .next/standalone && zip -r ../../lawprodigital-standalone.zip . && cd -
```

Upload `lawprodigital-standalone.zip` to the application root and extract it, so that
`server.js`, `.next/`, `public/` and `node_modules/` sit directly in the root.

Then set **Application startup file** to `server.js` and click **Restart**. Do **not** click
"Run NPM Install" — the bundle already contains its trimmed `node_modules`.

## Environment variables

Set these in **Setup Node.js App → Environment variables**, then click **Restart**. They are
read at request time on the server and never reach the browser. `.env.example` has a template.

| Variable | Example | Notes |
| --- | --- | --- |
| `SMTP_HOST` | `mail.lawprodigital.com` | From cPanel → Email Accounts → Connect Devices |
| `SMTP_PORT` | `465` | `465` (SSL) or `587` (STARTTLS) |
| `SMTP_SECURE` | `true` | Optional; inferred from the port |
| `SMTP_USER` | `website@lawprodigital.com` | Full mailbox address |
| `SMTP_PASS` | — | Mailbox password. Keep it out of Git. |
| `CONTACT_TO` | `lawprodigital@gmail.com` | Where enquiries are delivered |
| `CONTACT_FROM` | `website@lawprodigital.com` | Optional; defaults to `SMTP_USER` |

Passenger sets `PORT` itself — don't set it. If the SMTP variables are missing, the contact form
shows "temporarily unavailable" to the visitor and logs the reason. It never pretends a message
was sent.

## After deploying — checklist

- `https://lawprodigital.com/` and a few inner pages load (e.g. `/website-design/`, `/case-study/`).
- `https://lawprodigital.com/about-us` redirects to `/about-us/` (trailing slashes are preserved
  from the old WordPress URLs).
- `https://lawprodigital.com/sitemap.xml` and `/robots.txt` respond.
- Send a test message from `/contact-us/` and confirm it arrives.
- Old WordPress URLs redirect (308): `/category/immigration/` → `/case-study/`,
  `/how-we-helped-a-bankruptcy-law-firm-achieve-99-lead-conversion-in-6-months/` → the case study.
- In Google Search Console, resubmit `https://lawprodigital.com/sitemap.xml`.
- If the old WordPress site lived in the same `public_html`, remove its `.htaccess` rewrite rules
  so Passenger serves the Node app.

## Logs and troubleshooting

- App errors: `stderr.log` in the application root (Passenger), or cPanel → Errors.
- 503 / "Incomplete response": check that the startup file path is right, and that
  `.next/standalone/server.js` exists (Option A) or `server.js` is in the root (Option B).
- Images 500 on Linux: the bundle was built on another OS — rebuild on Linux.
- Contact form "temporarily unavailable": the SMTP environment variables are missing.
  If it shows "Something went wrong sending", the SMTP credentials or port are wrong — see the log.

## Local commands

```bash
npm run dev               # development server, http://localhost:3000
npm run lint              # ESLint
npm run typecheck         # TypeScript
npm run build:standalone  # production build + assemble .next/standalone
npm run start:standalone  # run the production bundle locally (PORT=3000 by default)
```
