# Competitor analysis

Observed on 2026-10-20 in a desktop browser (≈800 px wide pane) and, for LawPro, also at 375 px. Pages inspected:

- **LawPro Digital:** https://lawprodigital.vercel.app/ home, `/law-firm-seo/`, `/contact-us/` (and every route locally).
- **Juris Digital:** https://jurisdigital.com/ home, `/contact-us/`.
- **Rankings.io:** https://rankings.io/ home, `/contact/`.

Competitor service pages, case study pages, about pages and mobile layouts were **not** inspected this time and are
marked *unverified*. An earlier comparison of five agencies' first screens is in `src/content/COPY_RULES.md`.
Nothing below is copied into the site; the aim is the underlying principles.

| Category | LawPro Digital (current) | Juris Digital | Rankings.io | Recommended improvement |
| --- | --- | --- | --- | --- |
| Positioning | Niche and specific: US immigration firms, AI-led intake and ads. Also bankruptcy/PI. | Broad: "serious law firms", 100% done-for-you, "AI-age" agency. | PI first (300+ PI firms), then other high-stakes areas. | Keep the immigration niche — it's the clearest of the three. Don't broaden the hero. |
| Headline | "More Signed Clients for US Immigration Law Firms, Powered by AI" (9 words, outcome-led). | "More of the legacy you want." (short, abstract). | "Own Legal Marketing. Win the Best Cases." (two short sentences). | Optional: trim to ≤ 8 words per COPY_RULES (e.g. drop "Powered by AI" to the eyebrow). Owner decision — not changed. |
| Hero proof | Inline result (79 → 115 clients/month) + three reassurance bullets + visual of the data. | 4.8/5 from 81 Google reviews + 1:57 video. | 4.9/5 from 200 reviews. | The strongest missing proof is a **review rating with a count**. Add only if a real Google/Clutch profile exists (owner to supply). |
| Header / CTA | One gold CTA ("Get Your Free AI Lead Audit"), services menu, city ticker. | One CTA ("Explore Partnership"), hamburger. | One CTA ("Contact us"), hamburger. | Already aligned: one named primary action. No change. |
| Services architecture | 6 legacy service pages + AI page; homepage lists 8 services by job. | 6 services, each with a page. | 6 services + "Modern Search" framing. | Service pages lacked "what happens next" → **added the 90-day process to every service page that had none.** |
| Service depth | Features, practice areas, related stories, FAQ on some pages. | *Unverified.* | *Unverified.* | Add FAQs to the SEO / website / social pages once the owner approves answers (no invented claims). |
| Trust: testimonials | One real client video (Chambers Law Firm). | Three named attorney quotes + video. | Review count; testimonials *unverified*. | Collect 2–3 more named, consented testimonials. Don't fabricate. |
| Trust: team | "Founder, Law Pro Digital" — unnamed. | "Principals with 30 years combined", team video. | Named founder/CEO, books, podcast, event. | **Biggest gap.** Name the founder with photo and LinkedIn; add a short team section. Owner to supply. |
| Case studies | 16 long-form, anonymised stories with charts and real numbers. | 5 named-client success stories. | Percent-growth proof cards. | Already the deepest of the three. Anonymity is a weakness vs named clients — get permission to name even one. |
| Portfolio | None (website design service has no examples). | Filterable website portfolio. | *Unverified.* | Add real site examples to `/website-design/` when available. |
| Lead generation | One form + "what happens next" steps; email shown. | Request-a-quote form, phone, address, separate client/RFP contacts. | Multi-step "Next steps" explaining speed of follow-up. | Add a phone number and business address (owner to supply — `src/content/site.ts`). Consider stating a reply time once the team commits to one. |
| Differentiation | "Measured against signed retainers", monthly scorecard, no long contracts. | "No vanity metrics", ROI guarantee. | Comparison table vs generalist agencies, month-to-month. | A "how we differ" table could work, but only with claims the owner can back. Not added. |
| Colour / type | Deep navy, one warm gold, Plus Jakarta Sans + Inter, ledger-rule texture. | White/teal, green CTA, rounded sans. | Cream, black serif headlines, lime CTA. | Keep "Signed". Fixed a contrast bug in the gold-on-light text token. |
| Imagery | Data visuals, chat demo, illustrated story heroes (labelled illustrative). | Video, website screenshots. | Founder photos, book covers. | Real photography of the founder/team would add the human element both competitors have. |
| Motion | GSAP scroll timelines, idle-loaded R3F hero (desktop only), reduced-motion respected. | Light. | Light. | Keep as is; no scroll hijacking. |
| Responsive | Hero CTA visible in the first 812 px on a 375 px screen; no horizontal scroll (tested). | *Unverified (mobile).* | *Unverified (mobile).* | — |
| Accessibility | Lighthouse a11y 100 locally after the contrast fix (live site: 96). axe: no serious issues on 7 key pages. | *Not measured.* | *Not measured.* | — |
| Technical SEO | Unique titles/descriptions/canonicals on all 30 sitemap URLs, JSON-LD (Organization, Service, FAQ, Breadcrumb), sitemap, robots, 308s for old URLs. | *Not audited.* | *Not audited.* | Add Privacy/Terms (done). Add `sameAs` social links once real profiles exist. |

## Principles taken (not copied)

1. **One named action and proof next to it** — both competitors pair the CTA with a review count. LawPro pairs it with
   a real result; a review count is the next best addition.
2. **People behind the agency** — both show who you'd work with. LawPro's founder is anonymous; this is the main
   credibility gap and can only be fixed with owner-supplied facts.
3. **Explain what happens after the form** — Rankings.io's contact page sets expectations. LawPro's contact page
   already does; service pages now do too.
