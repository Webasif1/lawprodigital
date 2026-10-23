# Production audit

> **Superseded in part (2026-10-23).** The current release audit is
> [`reports/production-readiness-audit.md`](../reports/production-readiness-audit.md). Since this page was
> written the app gained a live AI chat (`/api/chat/`, OpenRouter), optional analytics and a booking link;
> the test suites grew (110 unit tests, 51 E2E passing / 13 viewport skips); the sitemap has 32 URLs; and
> Next.js was patched to 16.4.3. The tables below are kept as the 2026-10-20 record.

Baseline taken 2026-10-20 at commit `bc02259`, before changes. Fixes are in the same working tree.

## Architecture

| Area | Finding |
| --- | --- |
| Framework | Next.js 16.4 (App Router, Turbopack, React Compiler), React 19.3, TypeScript 5, Tailwind CSS 4 |
| Motion / 3D | GSAP 3.15 + ScrollTrigger (idle-loaded), React Three Fiber 9 / three 0.186 (desktop + WebGL only, idle-loaded) |
| Backend | One Server Action (contact form → nodemailer SMTP). No API routes, DB, auth, CMS or third-party scripts. |
| Content | TypeScript files in `src/content/`; 16 case studies parsed at build time from `src/content/source/case-studies.md`. |
| Build / hosting | `output: "standalone"`, `trailingSlash: true`, 308 redirects for old WordPress URLs. Currently on Vercel; target cPanel Passenger (see [CPANEL_DEPLOYMENT.md](CPANEL_DEPLOYMENT.md)). |
| Package manager | npm (`package-lock.json`). Node ≥ 20.9. |
| Tests (before) | None. Only `lint`, `typecheck`, `lint:copy`. |

## Route inventory

| Route | Type | Notes |
| --- | --- | --- |
| `/` | Static | Homepage |
| `/law-firm-seo/`, `/immigration-lawyer-seo/`, `/law-firm-ppc-agency/`, `/website-design/`, `/social-media-marketing/`, `/video-marketing-for-law-firms/` | SSG `[slug]` | Unknown slugs → 404 (`dynamicParams = false`) |
| `/ai-solutions/` | Static | AI intake |
| `/case-study/` + 16 × `/case-study/[slug]/` | SSG | Filterable library |
| `/pricing/`, `/about-us/`, `/contact-us/` | Static | Contact form = Server Action |
| `/privacy-policy/`, `/terms/` | Static | **New** |
| `/sitemap.xml`, `/robots.txt`, icons | Generated | 30 URLs in sitemap |
| Old WordPress URLs | 308 | Rules in `next.config.ts` (legacy case studies, `/booking/`, `/category/*`, `/author/*`, feeds) |

## Issues

| ID | Sev | Issue | Resolution | Status |
| --- | --- | --- | --- | --- |
| A1 | P1 | No security headers on cPanel (HSTS was Vercel's) | CSP + HSTS + 5 headers in `next.config.ts` | **Fixed** |
| A2 | P1 | No Privacy Policy / Terms although the form collects personal data | Drafts at `/privacy-policy/` and `/terms/`, linked from footer and form | **Fixed — needs legal review** |
| A3 | P2 | Contact rate limit bypassable via `X-Forwarded-For`; map reset at 5k keys | Global cap + LRU + proxy hop | **Fixed** |
| A4 | P2 | No automated tests | Vitest (27) + Playwright (31 on 2 viewports) | **Fixed** |
| A5 | P2 | Gold text token `brass` failed WCAG AA by a hair on `gold-wash`/`wash` (4.47:1) — home, service, about | `#85680f` → `#7a5f0d` | **Fixed** (axe clean, Lighthouse a11y 100) |
| A6 | P2 | Service pages without a process section didn't say what happens after contact | Shared 90-day process added to those pages | **Fixed** |
| A7 | P2 | Founder anonymous, no phone/address/socials, one testimonial | Needs owner facts | **Blocked (owner)** |
| A8 | P3 | SMTP errors logged in full | Code/message only | **Fixed** |
| A9 | P3 | `experimental.agentFeedback` left on | Removed | **Fixed** |
| A10 | P3 | `npm run lint:copy` failed on a code comment | Comment reworded | **Fixed** |
| A11 | P3 | Dev-only npm advisories (`braces` chain via `eslint-config-next`) | Not shipped; wait for upstream | Accepted |
| A12 | P3 | `THREE.Clock` deprecation warning in console (from R3F) | Upstream; harmless | Accepted |
| A13 | P3 | Hero headline is 9 words vs the 8-word rule in COPY_RULES | Owner copy decision | Open |

No P0 issues were found.

## Verification by area

| Area | Status | Evidence |
| --- | --- | --- |
| Production build | **PASS** | `npm run build:standalone` — 36 routes, no warnings |
| Lint / types / copy | **PASS** | `npm run lint`, `npm run typecheck`, `npm run lint:copy` |
| Unit tests | **PASS** | `npm test` — 27/27 |
| E2E (standalone build, desktop + Pixel 7) | **PASS** | `npm run test:e2e` — 31 passed, 11 skipped by design |
| Routes, titles, canonicals, single H1 | **PASS** | e2e over all 30 sitemap URLs |
| Internal links & anchors | **PASS** | e2e crawls every `<a>` on every sitemap page |
| Redirects / 404 | **PASS** | e2e: 5 legacy URLs → 308; unknown URL → 404 + noindex |
| Security headers / CSP | **PASS** | e2e + manual: 3D hero, GSAP, YouTube player load with no CSP errors |
| Secrets in client bundles | **PASS** | e2e scans JS chunks; no `.env` in bundle; git history scanned |
| Accessibility | **PASS** (automated) | axe (WCAG 2 A/AA, serious+critical) on 7 pages × 2 viewports; Lighthouse a11y 100. Screen-reader testing **NOT TESTED** |
| Mobile layout | **PASS** | e2e no horizontal scroll at 412 px; manual 375 px review of home, contact, service |
| Keyboard | **PASS** (partial) | e2e: first Tab = skip link with visible focus; mobile menu dialog. Full keyboard walk **NOT TESTED** |
| Contact form validation | **PASS** | unit + e2e (empty, invalid email, values kept) |
| Email delivery | **BLOCKED** | Needs real SMTP credentials; e2e verifies the "unavailable" path never claims success |
| Performance | **PASS** | Lighthouse 12 mobile, local standalone: home 94 (LCP 3.0 s, CLS 0, TBT 70 ms), `/law-firm-seo/` 96. Live Vercel home for reference: 95 / a11y 96. Local numbers ≠ production. |
| cPanel staging | **NOT TESTED** | No cPanel access. Standalone server tested locally on Windows; must be rebuilt on Linux |
| Cross-browser | **NOT TESTED** | Chromium only (Playwright). Safari/Firefox not run |

## Lighthouse (mobile, simulated throttling)

| Page | Perf | A11y | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Live Vercel `/` (before) | 95 | 96 | 100 | 100 | 2.8 s | 0 | 50 ms |
| Local standalone `/` (after) | 94 | 100 | 100 | 100 | 3.0 s | 0 | 70 ms |
| Local standalone `/law-firm-seo/` (after) | 96 | 100 | 100 | 100 | 2.8 s | 0 | 60 ms |

Before/after performance runs are on different hosts (Vercel CDN vs a local Windows server), so the 1-point
difference isn't meaningful. Re-run on the cPanel server after launch.
