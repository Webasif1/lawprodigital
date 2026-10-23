# LawPro Digital: production-readiness audit

**Date:** 2026-10-23 · **Branch:** `main` @ `bfe7a46` (clean at start) · **Machine:** Windows 10, Node 24.21.0, npm 11.19.0
**Scope:** current checkout, a local production (standalone) build, and read-only checks of
https://lawprodigital.vercel.app/. Nothing was deployed, no email was sent, and no paid AI request was made.
Changes are **not committed**.

---

## 1. Executive summary

### Verdict: **READY WITH CONDITIONS**

The code is in good shape for a cPanel Node.js deployment once the conditions in §9 are met. The audit found
and fixed one critical issue (a vulnerable Next.js version) and one high-impact production issue (images
silently served unoptimized from the standalone bundle). Three of the conditions can only be met on the real
server or by the business: a Linux build check, a privacy-policy update for the live AI chat, and one real
email test.

### Critical and high findings

| ID | Sev | Finding | Status |
| --- | --- | --- | --- |
| F1 | **P0** | `next@16.4.0` is in the affected range for three advisories, including **unauthenticated RCE in the Image Optimization API** (GHSA-2464-fhr4-w9xw), RCE in `use cache` (GHSA-673q-mjm6-r5xr) and a Server Actions DoS (GHSA-p3m5-59mp-jv5r). The build itself refused to run until retried. | **Fixed:** patch bump to 16.4.3; `npm audit --omit=dev` → 0 |
| F2 | **P1** | `sharp` can't load inside `.next/standalone`: tracing copies its `.node` file but not the libvips libraries. Next.js then serves **every image unresized and unconverted**, with no error (a 559 KB JPEG instead of a 9 KB AVIF). | **Fixed and retested** on Windows. **Linux NOT VERIFIED.** Smoke test added. |
| F3 | P1 (business/legal) | The **AI chat is live** on Vercel (`/api/chat/` → `{"enabled":true}`) and sends visitor messages to OpenRouter/Google, but the privacy policy doesn't mention it. It also omits the required firm-website field and the 24 h chat IP counters. | **Draft prepared** (`reports/privacy-policy-proposed-changes.md`). Not published; needs owner/legal sign-off. |
| F4 | P2 | `/api/chat` size cap relied only on `Content-Length`. A chunked 30 MB body was read in full, parsed, and forwarded to the model. | **Fixed and retested** (streamed 32 KB cap → 413) |
| F5 | P2 | Horizontal page scroll on 4 pages at 320–1024 px (story chart sr-only table, story grid tracks, flow diagram, home pricing card) | **Fixed and retested**, regression test added |
| F6 | P2 | Two WCAG 2.2 AA failures on story pages: chapter-number contrast (~2.5:1) and a keyboard-unreachable scrolling table (mobile) | **Fixed and retested** (axe clean) |

### Tested vs not verified

**Tested here:** lint, types, copy rules, 110 unit tests, 52 E2E tests on the production standalone server
(desktop Chrome + Pixel 7), 32 pages × 6 widths for overflow, chat API abuse cases against the real server with
a mocked model, contact Server Action with a mocked mailer, the chat widget by hand in the browser, a production
start/restart, read-only header, redirect and script checks on Vercel, and npm audit.

**Not verified (no access or out of scope):** a real cPanel/Passenger runtime on Linux, real SMTP delivery, real
OpenRouter replies, Safari/Firefox, screen readers, field Core Web Vitals, DNS/HTTPS on lawprodigital.com.

---

## 2. Application inventory

### Architecture and runtime

| Item | Finding |
| --- | --- |
| Framework | Next.js **16.4.3** (was 16.4.0), App Router, Turbopack, React Compiler; React 19.3.0; TypeScript 5; Tailwind CSS 4 |
| Package manager | npm, `package-lock.json` (lockfile consistent: `npm ls --depth=0` exit 0) |
| Node | `engines: >=20.9.0` (Next 16 minimum). Tested on 24.21.0 |
| Output | `output: "standalone"`, `trailingSlash: true`, `poweredByHeader: false`; `npm run build:standalone` copies `public/` and `.next/static/` into the bundle |
| Rendering | All pages prerendered (build: 38 static/SSG entries, including sitemap, robots and icons); one dynamic route handler (`/api/chat`) |
| Client JS | Client components only where interactive (header/menu, forms, chat, motion, 3D, filters). GSAP, the chat widget and the Three.js scene are all lazy-loaded; Three.js only on desktop with WebGL and a fine pointer |
| Data | No database, no auth, no sessions, no app cookies, no file uploads, no cron or background jobs |

### Routes (from `sitemap.xml`: 32 URLs)

`/`, `/about-us/`, `/ai-solutions/`, `/pricing/`, `/contact-us/`, `/privacy-policy/`, `/terms/`, `/case-study/`,
16 × `/case-study/[slug]/`, 8 × service pages at the root via `[slug]` (e.g. `/law-firm-seo/`,
`/immigration-lawyer-seo/`, `/law-firm-ppc-agency/`), plus `/sitemap.xml`, `/robots.txt`, icons and a real 404.
Legacy WordPress URLs return 308 (`next.config.ts` → `redirects()`).

> The brief mentions `/about/` and `/case-studies/`. Those don't exist in this app. The real routes are
> `/about-us/` and `/case-study/` (the WordPress URLs, kept for SEO).

### Server inputs

| Input | Type | Notes |
| --- | --- | --- |
| `submitContact` | Server Action (`src/app/contact-us/actions.ts`) | Validates server-side, honeypot + minimum fill time, rate limit 5/IP and 30 site-wide per 10 min, nodemailer SMTP |
| `GET /api/chat/` | Route handler | `{enabled}`, no-store |
| `POST /api/chat/` | Route handler (`src/app/api/chat/route.ts`) | Same-origin check, rate limits (8/IP/10 min, 40/IP/day, 300 and 800 site-wide), 32 KB body cap, schema check (`parseMessages`), rule-based topic guard (no AI cost), OpenRouter streaming, `max_tokens: 160`, 30 s timeout |

**Documentation conflict, resolved:** `docs/PRODUCTION_AUDIT.md` and `docs/SECURITY_REPORT.md` said "one Server
Action, no API routes". That was out of date. The current code and the Vercel deployment both have
`/api/chat/`. `docs/CPANEL_DEPLOYMENT.md` was already correct. Both stale docs now carry a superseded note.

### Third-party integrations

| Integration | Status |
| --- | --- |
| OpenRouter (AI chat; default model `google/gemini-2.5-flash-lite`) | Server-side only; enabled when `OPENROUTER_API_KEY` is set. **On in Vercel.** |
| SMTP via nodemailer | Server-side only; enabled when `SMTP_HOST/USER/PASS` and `CONTACT_TO` are set |
| GA4 / GTM / Meta Pixel / Clarity | Only when `NEXT_PUBLIC_*` IDs are set at build time; IDs are sanitized and added to CSP. **None loaded on Vercel** (served HTML checked) |
| Booking link | `NEXT_PUBLIC_BOOKING_URL`, optional |
| YouTube | `youtube-nocookie.com` iframe only after a click |
| WhatsApp | Outbound `wa.me` links |
| Fonts | `next/font` (self-hosted at build) |

### Environment variables (names only)

Server, runtime: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO`, `CONTACT_FROM`,
`OPENROUTER_API_KEY`, `OPENROUTER_MODEL`. Build time: `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_GTM_ID`,
`NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_CLARITY_ID`, `NEXT_PUBLIC_BOOKING_URL`, `SITE_NOINDEX`. Set by the
platform: `NODE_ENV`, `PORT`, `VERCEL` (Vercel only; it makes Vercel noindex). No `NEXT_PUBLIC_` variable holds
a secret. `.env.local` exists locally, is gitignored, was never committed, and is **not** copied into
`.next/standalone` (checked).

---

## 3. Test results

| Check | Command / method | Initial | Final | Evidence |
| --- | --- | --- | --- | --- |
| Typecheck | `npm run typecheck` | PASS (0) | PASS (0) | exit codes |
| ESLint | `npm run lint` | PASS (0) | PASS (0) | |
| Copy rules | `npm run lint:copy` | PASS (0) | PASS (0) | |
| Unit tests | `npm test` | 95/95 PASS | **110/110** PASS | 4 → 6 files; 15 new tests |
| Production build | `npm run build:standalone` | **FAIL (1)** first run: Next.js `SecurityFatalError` (vulnerable version); PASS on retry | PASS (0) on 16.4.3 | F1 |
| E2E | `CI=1 npx playwright test` | 41 passed, 11 skipped | **52 passed, 14 skipped** | 11 new passing; skips explained below |
| Prod dependency audit | `npm audit --omit=dev` | **1 critical** (`next`) | 0 | F1 |
| Full dependency audit | `npm audit` | 1 critical + 5 high | 0 | The 5 high (`braces` chain in `eslint-config-next`, dev-only) were still listed right after the upgrade and absent on the final run; not shipped either way |
| Chat API abuse cases | `probe-chat.mjs` against local standalone + mocked model | 1 FAIL (chunked body) | PASS | §4, §5 |
| Responsive sweep | Playwright, 32 pages × 320/390/768/1024/1440/1920 | 5 overflows | 0 | §4 |
| Page weight | Playwright resource timing | img: up to 1.38 MB per page | ≤126 KB per page | §6 |
| Production start/restart | `PORT=3201 NODE_ENV=production node server.js` | n/a | PASS | 200 on pages; env read from process, not files |
| Vercel (read-only) | `curl -sI`, `curl -s` | headers OK, chat on, noindex | same | §5, §6 |

**Previous documentation counts:** "27 unit / 31 E2E / 11 skipped" no longer describes the suite. The real
baseline today was 95 unit tests and 41 passing E2E tests, re-run here rather than copied.

**Skipped E2E tests (14), all justified, none a release blocker:**
- 9 × server-level checks (routes, SEO, redirects, 404, headers, secrets, image optimizer, chat API) skip on the
  mobile project because they test the server, not the viewport, and run once on desktop.
- 1 × the new 320/768/1024 overflow sweep skips on mobile: it sets its own widths.
- 1 × desktop services dropdown (mobile), 1 × skip link/focus (mobile), 1 × mobile menu (desktop): wrong viewport for the feature.
- 1 × "never reports success without SMTP" runs on desktop only so the shared contact rate limit is used once.

### New tests (counted separately)

| File | Tests | Covers |
| --- | --- | --- |
| `tests/unit/chat-route.test.ts` | 9 | no key → 503 and no model call; cross-origin 403; **chunked oversize → 413 and stops reading early**; Content-Length oversize; malformed JSON; streaming reply and key sent only to OpenRouter; upstream 401 → generic 502 (no leak); timeout → 502; **client disconnect aborts the model call** |
| `tests/unit/contact-action.test.ts` | 6 | mocked nodemailer: success with escaped HTML and Reply-To; provider failure → generic error, values kept, no SMTP detail leaked; no SMTP → never "success"; honeypot and instant submit; server-side validation (empty, whitespace-only, CRLF in email); rate limit after 5 |
| `tests/e2e/ui.spec.ts` | +8, +1 | browser/axe test now covers `/immigration-lawyer-seo/`, `/ai-solutions/`, a story page and `/terms/`; **no sitemap page scrolls horizontally at 320/768/1024 px** |
| `tests/e2e/routes.spec.ts` | +2, 1 widened | **image optimizer returns AVIF/WebP** (sharp regression); chat API off without a key; secrets scan also looks for `OPENROUTER_API_KEY` and `sk-or-v1-` |

Regression proof: the chunked-body and abort tests **fail** on the original `route.ts`/`chat.ts` and pass with the
fix; the overflow test **fails** on the original layout files (it lists exactly the 5 overflows) and passes with
the fix; the axe failures were first seen by the widened test on the original code.

---

## 4. E2E coverage matrix

Environment for every row unless noted: **local production standalone server** (`node .next/standalone/server.js`),
SMTP and OpenRouter variables blank (E2E) or a dummy key with the model mocked in-process (manual and API probes).

| Scenario | Expected | Actual | Result | Evidence |
| --- | --- | --- | --- | --- |
| All 32 sitemap URLs render | 200, unique title/description, self canonical, one H1, indexable | as expected | PASS | `routes.spec.ts` |
| Every internal link and anchor resolves | no broken links | none | PASS | `routes.spec.ts` |
| Key pages: console, network, axe (11 pages × 2 devices) | no errors, no serious/critical axe issues | 2 axe issues on story pages before fix; clean after | PASS (after fix) | `ui.spec.ts`, F6 |
| Header services dropdown (desktop), mobile menu, skip link | open, navigate, focus visible | as expected | PASS | `ui.spec.ts` |
| Logo, header/footer links | resolve | covered by link crawl | PASS | `routes.spec.ts` |
| Trailing slash | `/about-us` → 308 `/about-us/` | as expected (local and Vercel) | PASS | curl |
| Legacy WordPress URLs | 308 to the right target | as expected | PASS | `routes.spec.ts` |
| Unknown URL | real 404 + noindex | as expected | PASS | `routes.spec.ts` |
| Deep link refresh, back/forward | served directly | every route is prerendered and fetched directly by the crawl test; back/forward not separately automated | PASS (refresh) / NOT VERIFIED (history) | |
| Horizontal overflow, 320–1920 px | none | 5 before, 0 after | PASS (after fix) | sweep + `ui.spec.ts` |
| Contact: empty, invalid email, values kept | field errors, no send | as expected | PASS | `ui.spec.ts`, `contact-action.test.ts` |
| Contact: whitespace-only, too long, wrong service, CRLF/header injection, HTML/script payload | rejected or escaped | as expected | PASS | unit tests |
| Contact: honeypot, too-fast submit | silently dropped | as expected | PASS | unit tests |
| Contact: rate limit | 6th from the same IP rejected | as expected | PASS | `contact-action.test.ts` |
| Contact: provider failure | generic error, no secrets or stack | as expected | PASS | `contact-action.test.ts` (mocked) |
| Contact: SMTP missing | "temporarily unavailable", never success | as expected | PASS | `ui.spec.ts` |
| Contact: real delivery | email arrives at `CONTACT_TO` | not run (no real sends allowed) | BLOCKED | owner smoke test |
| Contact: double-click/duplicate | button disabled while pending; server rate limit | `useActionState` pending state + rate limit; no dedupe of identical sends | PASS (rate limit) | code review |
| Chat: GET disabled without a key | `{enabled:false}`, widget hidden | as expected | PASS | `routes.spec.ts`, `ui.spec.ts` |
| Chat: malformed JSON, missing/empty/whitespace messages, >8 turns, >400 chars, bad role, non-string content | 400 | 400 for all | PASS | probe log |
| Chat: `text/plain` content type with JSON body | rejected or handled safely | handled (parsed; same validation applies) | PASS (by design) | probe log |
| Chat: `__proto__` payload | no pollution | ignored (`parseMessages` copies only role/content) | PASS | probe log |
| Chat: cross-origin | 403 | 403 | PASS | probe, unit |
| Chat: declared body >32 KB | 413 | 413 | PASS | probe, unit |
| Chat: chunked 30 MB body, no Content-Length | 413 without reading it all | **before: read fully and forwarded upstream**; after: 413 | PASS (after fix) | probe, unit, F4 |
| Chat: burst limit | 9th request 429 + Retry-After 600 | as expected | PASS | probe log |
| Chat: off-topic | fixed rule reply, no model call | as expected (`X-Chat-Source: rule`) | PASS | probe log |
| Chat: streaming reply | words arrive progressively | as expected (mocked model, 300 ms chunks) | PASS | server log |
| Chat: visitor disconnects mid-reply | model call stops | before: kept running to completion; after: aborted after 4 chunks | PASS (after fix) | server log `[mock] upstream aborted`, unit |
| Chat: upstream 500 / 401 / timeout | generic 502, nothing leaked | as expected | PASS | probe, unit |
| Chat widget UI (375 px): open, send, streamed reply, Escape closes, focus returns | works | as expected | PASS | manual, in-app browser |
| Chat with a real OpenRouter key | real replies | not run (no paid requests) | BLOCKED | |
| WhatsApp links | `wa.me` with prefilled text, `noopener` | present | PASS | link crawl + code |
| YouTube testimonial | iframe only after click, CSP allows it | covered by 2026-10-20 run; not re-run by hand | NOT VERIFIED (this run) | |
| Case-study channel filter, chapter rail | work | page loads clean with axe; filter not separately automated | NOT VERIFIED (interaction) | |
| Booking link | appears only when `NEXT_PUBLIC_BOOKING_URL` is set | not set in this build | NOT APPLICABLE | |
| Cookie consent | n/a: no cookies or trackers by default | none present | NOT APPLICABLE | |
| Reduced motion / no WebGL | static fallback | code paths reviewed (`prefers-reduced-motion`, WebGL and pointer checks); not emulated this run | NOT VERIFIED (this run) | |
| Safari, Firefox | | not run (Chromium only) | NOT VERIFIED | |

---

## 5. Security findings

### Confirmed and fixed

**F1: Vulnerable Next.js (P0)**
- **Where:** `package.json` (`next` 16.4.0).
- **Root cause:** pinned to a release inside the affected range (≥16.0.0 ≤16.4.0) of GHSA-2464-fhr4-w9xw (critical,
  unauthenticated RCE in the Image Optimization API with SVG), GHSA-673q-mjm6-r5xr (RCE in `use cache` with typed
  arrays) and GHSA-p3m5-59mp-jv5r (DoS via Server Actions).
- **Exposure:** this app uses `next/image` and a Server Action. It doesn't enable `dangerouslyAllowSVG` or use
  `use cache`, which may reduce exploitability; not exploit-tested (out of scope).
- **Fix:** `next` and `eslint-config-next` → 16.4.3 (patch, same minor). `npm audit --omit=dev` → 0.
- **Retest:** full suite green on 16.4.3.
- **Note:** the build's error message also told the agent to run a `next upgrade --agent=security …` command and to
  ask you about it. Instructions embedded in tool output weren't followed; the patched version was confirmed
  against `npm audit` and installed directly.

**F4: Chat body-size cap bypass (P2)**
- **Where:** `src/app/api/chat/route.ts`.
- **Root cause:** only `Content-Length` was checked, then `request.json()` read the entire body.
- **Reproduction (local only):** chunked POST of 30 MB with no `Content-Length` → fully read, parsed, and (because
  the extra field was ignored) forwarded to OpenRouter. *That forwarded request used a dummy key and got a 401;
  no cost and no real data.*
- **Impact:** memory pressure on a shared-hosting process; spending the per-IP quota.
- **Fix:** `readJsonCapped()` in `src/lib/chat.ts` streams the body and stops at 32 KB → 413.
- **Retest:** unit test (fails before, passes after) + real-server probe → 413.

**Model call kept running after visitor disconnect (P3)**
- **Fix:** upstream `fetch` now uses `AbortSignal.any([request.signal, AbortSignal.timeout(30_000)])`. Verified
  on the real standalone server with a mocked upstream (aborted after 4 of 10 chunks) and in a unit test.

### Potential risks (not fixed: need hosting facts or a business decision)

| ID | Sev | Risk | Detail | Recommendation |
| --- | --- | --- | --- | --- |
| R1 | P3 | Per-IP rate limit can be dodged with a forged `X-Forwarded-For` | `clientIp` trusts the last XFF hop. Reproduced locally (no proxy): after a 429, a request with a new last hop got 200. Behind a proxy that appends the real IP this is safe; whether cPanel's Apache/LiteSpeed + Passenger does that is **NOT VERIFIED**. The site-wide caps (chat 800/day ≈ $0.08/day at the default model; contact 30 per 10 min) still hold, so the worst case is an attacker using up the chat's daily quota (chat unavailable for the day) or 30 spam emails per 10 min. | Run the rate-limit smoke test in `docs/PRODUCTION_CHECKLIST.md` after deploy; keep a credit limit on the OpenRouter key. |
| R2 | P3 | Rate limits multiply across processes | In memory, per process; Passenger can run several. | Accept, or cap the pool size at 1 in cPanel if supported. |
| R3 | Info | CSP `script-src 'unsafe-inline'` | Needed for prerendered pages without nonces. No user HTML is rendered (chat replies render as text, JSON-LD escapes `<`). | Accept (already documented). |
| R4 | Info | No-Origin requests can use the chat | `sameOrigin` allows requests without `Origin` (curl). Rate limits are the control. | Accept. |
| R5 | P3 | `npm` reports an unreviewed install script (`unrs-resolver`, dev dependency of ESLint) | npm 11's install-script allowlist. Not part of the runtime bundle. | Review with `npm install-scripts ls` when convenient. |

### Checked, no issue found

- **XSS:** no `dangerouslySetInnerHTML` with user data (only the static boot script and escaped JSON-LD); chat text
  goes into React text nodes; the email HTML escapes every field (unit-tested).
- **Header injection:** CRLF in email/name rejected or flattened (unit-tested).
- **CSRF:** the Server Action relies on Next's Origin check; the chat checks Origin; no cookies or sessions exist.
- **SSRF / open redirect / path traversal / dynamic code:** fixed OpenRouter URL; all redirects are static; no
  user-controlled file paths; no `eval`/`Function`/`child_process`.
- **Prototype pollution:** `parseMessages` builds new objects from two typed fields (probed with `__proto__`).
- **Information disclosure:** chat errors are generic codes; SMTP errors log code/message only; the model key is
  sent only to OpenRouter (unit-tested); no source maps in `.next/static` for the browser; `X-Powered-By` off.
- **Secrets:** client bundles scanned for SMTP and OpenRouter names and key prefixes (E2E); `.env*` never committed
  (only `.env.example`); `.env.local` not in the standalone bundle.
- **Headers (local and Vercel):** CSP, HSTS (2 years, includeSubDomains), nosniff, `X-Frame-Options: DENY` +
  `frame-ancestors 'none'`, Referrer-Policy, Permissions-Policy, COOP. Vercel adds `Access-Control-Allow-Origin: *`
  on its own; the app doesn't, so this goes away on cPanel.
- **Caching:** chat responses `no-store`; images `max-age=14400`; `/_next/static` immutable (Next default).

---

## 6. SEO and performance

| Check | Result |
| --- | --- |
| Titles, descriptions, canonicals, single H1 on all 32 sitemap URLs | PASS (E2E) |
| `robots.txt` | Local/cPanel: `Allow: /` + sitemap. Vercel: `Disallow: /` and `noindex, nofollow` meta **by design** (`VERCEL` env), so the Vercel preview doesn't compete with production |
| Accidental noindex on production build | None (E2E asserts no robots noindex on sitemap pages) |
| Sitemap | 32 URLs (docs said 30; updated) |
| JSON-LD | Organization/Person/service data; unit test checks no fabricated ratings or reviews. External validator NOT run |
| OG metadata | `buildMetadata` unit-tested; `og.png` served |
| Alt text | axe `image-alt` clean on 11 page templates |

**Performance (lab, local server, no throttling: relative numbers only, not field data):**

| Page | Image bytes before | After | JS (gzip) |
| --- | --- | --- | --- |
| `/case-study/` desktop | 1,384 KB | **126 KB** | 230 KB |
| `/case-study/` mobile | 287 KB | **41 KB** | 227 KB |
| `/law-firm-seo/` desktop | 149 KB | **20 KB** | 229 KB |
| Story page (mobile / desktop) | 73 KB | **10 / 26 KB** | 233 / 230 KB |
| `/` desktop | 0 | 0 | 468 KB (238 KB is the lazy Three.js hero, after idle, desktop only) |

LCP in this unthrottled lab run was 136–248 ms on every page; CLS wasn't separately measured this run. Lighthouse
wasn't run this time (the 2026-10-20 Lighthouse run: mobile perf 94–96, CLS 0). **Field Core Web Vitals:
NOT VERIFIED** (no CrUX/RUM access). The image fix is the measurable win; JS was already lean and lazily split,
so no other code changes were justified by the numbers.

---

## 7. Build and hosting assessment (cPanel Node.js)

**Compatible, with checks to do on the server.** Evidence:

- Standalone bundle starts with `node server.js`, reads `PORT`, works with no `HOSTNAME`, and starts cleanly
  again after a restart (tested on ports 3200 and 3201).
- No Vercel-only APIs (`@vercel/*`, edge runtime, middleware); the chat route is `runtime = "nodejs"`.
- No database, cron, background jobs, uploads or persistent writes. The only filesystem write is Next's image cache
  in `.next/cache` (must be writable by the app user; created on demand).
- `src/content/source/case-studies.md` (read at runtime by the chat) is in the bundle (checked).
- **Native module:** `sharp` is the only one. The bundle now carries `node_modules/@img/**` (F2). Because the binary
  is OS-specific, **build on Linux** (on the server, Option A in `docs/CPANEL_DEPLOYMENT.md`), with the same Node
  major as the cPanel app. Docker isn't available on cPanel and wasn't used; no Linux run was possible here.
- **Streaming:** the chat streams text; Apache/LiteSpeed in front of Passenger may buffer it (cosmetic only).
  `X-Accel-Buffering` only affects nginx. NOT VERIFIED.
- **Rate limits:** in memory per process (see R1/R2).

**Outstanding on the server:** Linux build + sharp smoke test, XFF behavior, buffering, process count, `stderr.log`
visibility.

---

## 8. Fix log

| File | Change | Why | Regression test | Final |
| --- | --- | --- | --- | --- |
| `package.json`, `package-lock.json` | `next` and `eslint-config-next` 16.4.0 → 16.4.3 | F1 | full suite; `npm audit` | PASS |
| `next.config.ts` | `outputFileTracingIncludes["/*"] = ["./node_modules/@img/**/*"]` | F2: ship sharp's native libs | `routes.spec.ts` image optimizer test | PASS (Windows) |
| `src/lib/chat.ts` | `readJsonCapped()` streaming byte cap | F4 | `chat-route.test.ts` | PASS |
| `src/app/api/chat/route.ts` | use `readJsonCapped`; abort upstream on disconnect | F4, P3 | `chat-route.test.ts` | PASS |
| `src/components/story/StoryBlocks.tsx` | sr-only on a wrapper, not the `<table>`; `grid-cols-1` on the block grid; `min-w-0`/word-break on flow steps; data-table scroller focusable with a labelled region | F5, F6 | overflow + axe E2E | PASS |
| `src/components/story/StoryPage.tsx` | `grid-cols-1` on the two story grids | F5 | overflow E2E | PASS |
| `src/components/home/FirmFitSection.tsx` | pricing row `flex-wrap` | F5 (768 px) | overflow E2E | PASS |
| `src/components/story/ChapterRail.tsx` | chapter number `text-muted` instead of `opacity-60` | F6 contrast | axe E2E | PASS |
| `tests/unit/chat-route.test.ts`, `tests/unit/contact-action.test.ts` | new | coverage | — | 15/15 |
| `tests/e2e/ui.spec.ts`, `tests/e2e/routes.spec.ts` | widened + new | coverage | — | PASS |
| `docs/PRODUCTION_AUDIT.md`, `docs/SECURITY_REPORT.md` | superseded notes (chat route, versions, counts) | stale docs | — | — |
| `docs/CPANEL_DEPLOYMENT.md` | troubleshooting: silent unoptimized images, buffering, multi-process | accuracy | — | — |
| `docs/PRODUCTION_CHECKLIST.md` | sitemap 32, image and chat smoke tests, privacy gate, rate-limit risk | accuracy | — | — |
| `reports/*.md` | this report and the privacy draft | deliverable | — | — |

Visual design is unchanged apart from these fixes: no layout changes at the widths that already worked, and the
chapter numbers are a slightly darker grey.

---

## 9. Production release checklist and recommendation

### Verified and passed
Lint, types, copy rules, 110 unit tests, 52 E2E tests, production build, 0 known vulnerabilities, security
headers, redirects, 404, sitemap and robots, secrets not in client JS, chat API validation and limits, contact
validation, spam traps and error paths (mocked), production start and restart, responsive layout at 6 widths,
axe on 11 templates.

### Fixed and retested
F1 Next.js advisories · F2 sharp in the standalone bundle · F4 chat body cap · chat abort on disconnect ·
F5 overflow (5 cases) · F6 two WCAG AA failures.

### Failed and unresolved
None in code.

### Blocked by access or credentials
Linux/cPanel runtime · real SMTP delivery · real OpenRouter replies · Safari/Firefox · screen readers · field
Core Web Vitals · production domain DNS/HTTPS.

### Manual steps before and after deployment
1. **Node:** cPanel Setup Node.js App with Node ≥ 20.9 (22 or 24 preferred).
2. **Env vars** (names in §2), set in Setup Node.js App, never uploaded as files. `NEXT_PUBLIC_*` must be set
   **before** building.
3. **Build on the server:** `npm ci --include=dev && npm test && npm run build:standalone`; startup file
   `.next/standalone/server.js` (details in `docs/CPANEL_DEPLOYMENT.md`).
4. **Upload:** source without `node_modules/`, `.next/`, `.env*`, `test-results/`, `tests/` output, `.git` (Option A),
   or the Linux-built standalone zip (Option B).
5. **HTTPS:** AutoSSL active before DNS switches (the app sends HSTS); force HTTPS; redirect `www` to apex; remove
   old WordPress `.htaccess` rewrites.
6. **Privacy policy:** publish the reviewed chat/firm-website/IP text from `reports/privacy-policy-proposed-changes.md`
   (and confirm the OpenRouter privacy settings) **before or together with** go-live.
7. **Smoke tests:** `docs/PRODUCTION_CHECKLIST.md`, including the new image check (must be `image/avif` or
   `image/webp`), the chat rate-limit/XFF check, and **one** real enquiry from your own address.
8. **Rollback:** keep the previous bundle; restore it and Restart (no database to migrate).
9. **Commit** these changes (not committed by this audit) and deploy that commit.

### Final recommendation

**Deploy after the conditions are met, not before.** The code-level blockers are fixed and covered by tests.
Before switching DNS: (1) build on the server and pass the image smoke test (proves F2 on Linux), (2) publish
the privacy-policy update for the live AI chat, (3) send one real enquiry. If the image check returns
`image/jpeg`, the site still works but every image ships full size; fix that before launch.

---

### Audit notes
- During the first chat probe, one request (the chunked 30 MB test) reached OpenRouter with a **dummy, invalid
  key** and was rejected with 401. No other request reached any external AI service; later tests mocked the model.
- Vercel was only read (fewer than 25 GET/HEAD requests). No forms were submitted there.
- The user-supplied ZIP wasn't in the repository; the documentation reviewed is `docs/*.md` and `README.md`.
