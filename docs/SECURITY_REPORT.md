# Security report

Defensive, code-first review of the repository on 2026-10-20, plus tests against a local production build
(`node .next/standalone/server.js`). No testing was done against the live Vercel or production site beyond
reading its public response headers.

## Attack surface

| Surface | Notes |
| --- | --- |
| Pages | 36 prerendered routes, no user-specific data, no auth, no cookies set by the app. |
| Server input | One Server Action: `submitContact` (`src/app/contact-us/actions.ts`). No API routes, no uploads, no DB. |
| Outbound | SMTP via nodemailer (env-configured). YouTube iframe only after a click. |
| Secrets | SMTP credentials in env vars only. `.env*` is gitignored except `.env.example` (placeholders). |

## Findings

| # | Severity | Finding | Status |
| --- | --- | --- | --- |
| S1 | **P1** | No security headers once off Vercel (no HSTS, CSP, clickjacking or MIME protections) | Fixed, retested |
| S2 | P2 | Rate limiter keyed on the client-controlled first `X-Forwarded-For` entry; and `hits.clear()` at 5,000 keys let anyone reset all counters | Fixed, retested |
| S3 | P2 | SMTP error objects logged whole (can include server responses) | Fixed |
| S4 | P3 | Email header injection via `Reply-To` (CRLF in email) | Already blocked by the regex; now explicit + tested |
| S5 | P3 | `experimental.agentFeedback` dev flag enabled in production config | Removed |
| S6 | P3 | 5 "high" npm advisories (`braces` via `eslint-config-next`) | Dev-only, not shipped; accepted |
| S7 | Info | CSP needs `'unsafe-inline'` for scripts | Accepted trade-off, documented |

### S1 — Missing security headers (P1)
- **Where:** `next.config.ts` (no `headers()`); live Vercel response showed only Vercel's own HSTS.
- **Risk:** on cPanel the site would ship with no HSTS (SSL-strip on first visit), could be framed (clickjacking of
  the contact form), and had no CSP to limit injected script.
- **Fix:** `headers()` now sends on every route: `Content-Security-Policy` (default-src 'self'; frame-src only
  youtube-nocookie; `frame-ancestors 'none'`; `object-src 'none'`; `base-uri`/`form-action 'self'`;
  `upgrade-insecure-requests` in production), `Strict-Transport-Security: max-age=63072000; includeSubDomains`,
  `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy` (camera, mic, geolocation, payment, usb off), `Cross-Origin-Opener-Policy: same-origin`.
  `X-Powered-By` was already off.
- **Repro (before):** `curl -sI http://localhost:3000/` on the old build → none of the headers.
- **Retest:** e2e `security headers are sent on pages` passes; browser check on the standalone build: home page,
  3D hero, GSAP scenes and the YouTube player all load with no CSP violations in the console.
- **`preload`** was left off HSTS on purpose: add it only after HTTPS works on every subdomain.

### S7 — `'unsafe-inline'` in `script-src`
All pages are prerendered static HTML, so a per-request nonce isn't possible without making every page dynamic
(slower, more server load on shared hosting). Next's inline bootstrap/RSC scripts, the one-line `js` class script
and JSON-LD need inline. The site renders no user-supplied HTML (JSON-LD escapes `<`, the email body escapes HTML),
so the residual XSS risk is low. Revisit if user-generated content is ever added.

### S2 — Rate limiting (P2)
- **Where:** `src/app/contact-us/actions.ts` (old `rateLimited`).
- **Explanation:** the IP came from the first `X-Forwarded-For` entry, which the client controls, so a script could
  send unlimited emails by rotating that header. Filling the map to 5,000 entries cleared it for everyone.
- **Fix:** `src/app/contact-us/validate.ts` → `createRateLimiter`: 5 per key **and 30 site-wide** per 10 minutes
  (caps mailbox flooding even with spoofed IPs), LRU eviction instead of `clear()`. `clientIp` uses the last
  (proxy-appended) hop.
- **Retest:** unit tests `createRateLimiter` (3 cases) and `clientIp` pass.
- **Residual:** in-memory, per process. Passenger may run more than one process, or restart; that only loosens the
  limit. Behind Cloudflare, consider its rate limiting too.

### S3 — Logging (P2)
Failed sends now log only `code`, `responseCode` and `message`. Credentials are never logged; the message content is
never logged.

### S4 — Header injection / XSS in email (P3)
Email addresses with `\r` or `\n` are rejected; subject and name are flattened to one line; every value in the HTML
email is escaped. Unit tests cover CRLF in the email and name, and `<b>`/`onerror` payloads in the body.

## Checked and not applicable / no issue

- **SQL/NoSQL injection, SSRF, path traversal, uploads, command injection, deserialisation, prototype pollution:**
  no DB, no user-controlled URLs or paths, no `child_process`, no `eval`. The case study parser reads one fixed file
  at build time.
- **CSRF:** Next.js Server Actions only accept POSTs whose `Origin` matches the host. No cookies/sessions exist to
  ride on.
- **Open redirects:** all redirects are static in `next.config.ts`.
- **CORS:** the app sends no `Access-Control-Allow-*` headers (Vercel's `*` on static files goes away on cPanel).
- **Auth/IDOR/sessions:** no authentication exists, none is needed for a marketing site.
- **Server input size:** field limits are enforced server-side (name 80, email 200, phone 40, message 5,000);
  Server Action bodies are capped at Next's default 1 MB.
- **Spam:** honeypot field + 2.5 s minimum fill time (server-checked) + rate limits.
- **Information disclosure:** production errors render the generic error/404 pages; no stack traces in responses.
- **Secrets in the client:** `grep` found no `NEXT_PUBLIC_` variables; e2e test fetches every JS chunk on
  `/contact-us/` and asserts no `SMTP_*`/`CONTACT_TO` names appear. The standalone bundle contains no `.env` files.
- **Leaked credentials:** none found. All commits were scanned for credential patterns; the only `.env` file ever committed is
  `.env.example`, with the placeholder `change-me`. `.env.local` exists locally and
  is ignored. If a real `SMTP_PASS` was ever committed or shared, rotate it: change the mailbox password in cPanel →
  Email Accounts (or revoke the Google App Password), update the env var in Setup Node.js App, Restart.

## Dependencies

- `npm audit --omit=dev`: **0 vulnerabilities** (what ships).
- `npm audit` (all): 5 high, one chain — `braces` ← `micromatch` ← `fast-glob` ← `@next/eslint-plugin-next` ←
  `eslint-config-next@16.4.0`. Lint-time only; the suggested "fix" downgrades to v14 and would break linting.
  Re-check when `eslint-config-next` updates.

## Retest evidence (2026-10-20, Windows, Node 24.21)

- `npm test` → 27 passed.
- `npm run test:e2e` → 31 passed, 11 skipped (desktop-only or mobile-only cases), against the standalone build.
