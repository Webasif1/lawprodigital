# Production checklist

## Before launch — owner must supply

- [ ] **SMTP credentials** for a real mailbox (or a Gmail App Password) → Setup Node.js App env vars.
- [ ] **Legal review** of `/privacy-policy/` and `/terms/` (`src/content/legal.ts`). Add the registered business
      name/address and governing-law state if your lawyer wants them. Update the policy if analytics, chat or a CRM
      are added later.
- [ ] **Phone, address, social profiles** → `contact` and `socials` in `src/content/site.ts` (empty values stay hidden).
- [ ] **Founder name, photo and LinkedIn** for the founder note (biggest trust gap vs competitors — see
      [COMPETITOR_ANALYSIS.md](COMPETITOR_ANALYSIS.md)).
- [ ] Optional: permission to name case study clients, more consented testimonials, a real review profile link.
- [ ] Confirm the cPanel plan has **Setup Node.js App** with Node ≥ 20.9, and enough memory to build (else Option B).

## Release acceptance

- [ ] `npm ci && npm run lint && npm run typecheck && npm run lint:copy && npm test` pass.
- [ ] `npm run build:standalone` succeeds **on Linux** (server, WSL or CI).
- [ ] `npm run test:e2e` passes against that build (needs `npx playwright install --with-deps chromium`).
- [ ] `npm audit --omit=dev` shows 0 vulnerabilities.
- [ ] No open P0/P1 items in [reports/production-readiness-audit.md](../reports/production-readiness-audit.md).
- [ ] Privacy policy updated for the AI chat (and analytics, if any `NEXT_PUBLIC_*` analytics ID is set) — see [reports/privacy-policy-proposed-changes.md](../reports/privacy-policy-proposed-changes.md).
- [ ] AutoSSL certificate active for `lawprodigital.com` (and `www`) **before** switching DNS — the app sends HSTS.
- [ ] Env vars set in Setup Node.js App; app restarted.

## Backup (before every deploy)

- Option A: `cp -r ~/lawprodigital/.next/standalone ~/backups/standalone-$(date +%F-%H%M)`
- Option B: keep the previous `lawprodigital-standalone-<date>.zip`.
- Note the git commit being deployed: `git rev-parse --short HEAD`.
- Env vars live in cPanel, not in the bundle — screenshot or note them once (without sharing the password).

## Post-deployment smoke tests

Run from your own machine against production:

```bash
curl -sI https://lawprodigital.com/ | grep -iE "^HTTP|strict-transport|content-security|x-frame"
curl -sI https://lawprodigital.com/about-us | grep -iE "^HTTP|location"        # 308 → /about-us/
curl -sI https://lawprodigital.com/booking/ | grep -iE "^HTTP|location"        # 308 → /contact-us/
curl -s -o /dev/null -w "%{http_code}\n" https://lawprodigital.com/no-such-page/  # 404
curl -s https://lawprodigital.com/sitemap.xml | grep -c "<loc>"                # 32
curl -s https://lawprodigital.com/robots.txt                                   # Allow: / (not Disallow)
# sharp works on the server: must say image/avif or image/webp, not image/jpeg
curl -s -o /dev/null -H "Accept: image/avif,image/webp" -w "%{content_type}\n" "https://lawprodigital.com/_next/image/?url=%2Fimages%2Fstories%2Fs16-system.jpg&w=640&q=75"
curl -s https://lawprodigital.com/api/chat/                                    # {"enabled":true} once OPENROUTER_API_KEY is set
```

Rate-limit check for the chat (needs `OPENROUTER_API_KEY`). Each request is an off-topic question, which the
built-in rule answers without calling the model, so it costs nothing. The 9th should return 429. Then send one
with a made-up `X-Forwarded-For`: if it gets 200, the proxy passes the header through unchanged and the per-IP
limit can be dodged (the site-wide caps still hold). Tell the developer either way.

```bash
for i in $(seq 1 9); do curl -s -o /dev/null -w "%{http_code} " -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"what is the weather on mars"}]}' https://lawprodigital.com/api/chat/; done; echo
curl -s -o /dev/null -w "%{http_code}\n" -H "X-Forwarded-For: 203.0.113.9" -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"what is the weather on mars"}]}' https://lawprodigital.com/api/chat/
```

Then in a browser (desktop and phone):

- [ ] Home loads, hero visible, no console errors; the client video plays after pressing play.
- [ ] Services menu (desktop) and mobile menu open and navigate.
- [ ] A service page, `/case-study/`, one story, `/pricing/`, `/about-us/`, `/privacy-policy/` load.
- [ ] Images load (if they 500, the bundle was built on the wrong OS).
- [ ] Send **one** real enquiry from `/contact-us/` with your own details and confirm it arrives at `CONTACT_TO`
      with a working Reply-To. Do not submit invented customer data.
- [ ] `stderr.log` has no new errors.
- [ ] Google Search Console: resubmit `https://lawprodigital.com/sitemap.xml`; spot-check URL inspection on `/`.
- [ ] Re-run Lighthouse on production and record the numbers in PRODUCTION_AUDIT.md.

## Rollback

1. Option A: `rm -rf ~/lawprodigital/.next/standalone && cp -r ~/backups/standalone-<stamp> ~/lawprodigital/.next/standalone`
   Option B: delete `server.js`, `.next/`, `public/`, `node_modules/` from the app root and extract the previous zip.
2. Setup Node.js App → **Restart**.
3. Run the curl smoke tests above.
4. If the problem was an env var change, restore the old value and Restart — no rebuild needed.

There's no database, so rollback never involves data migration.

## Known remaining risks

- Rate limiting is in memory, per process; restarts reset it, and several Passenger processes multiply it. The per-IP part trusts the last `X-Forwarded-For` hop — check it with the rate-limit smoke test above.
- CSP allows `'unsafe-inline'` scripts (static prerendering) — see [SECURITY_REPORT.md](SECURITY_REPORT.md).
- Email delivery, cPanel runtime, Safari/Firefox and screen readers haven't been tested yet.
