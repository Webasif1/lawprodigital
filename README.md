# Law Pro Digital — website

Marketing site for Law Pro Digital, a digital growth agency for US immigration law firms. It's built with
Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4.

**Design system — "Signed".** Plus Jakarta Sans (headlines, figures) and Inter (body, UI); deep navy
(#0F1F3D) for heroes and feature sections, cool-grey paper and white cards for reading, and one warm gold
(#D6AD3B) for the main button, key figures and the marker-highlighted labels. Radii of 10px (buttons),
14px (fields) and 24px (cards); a single soft shadow only on floating UI. All tokens live in
`src/app/globals.css`.

```bash
npm install
npm run dev        # http://localhost:3000
```

Deployment to cPanel is covered in **[docs/CPANEL_DEPLOYMENT.md](docs/CPANEL_DEPLOYMENT.md)**; audits and the launch checklist are in [`docs/`](docs/).

## Where things live

| Path | What it is |
| --- | --- |
| `src/content/` | **All site copy and data**: brand and contact details (`site.ts`), services (`services.ts`), homepage content (`home.ts`), plans (`pricing.ts`), story settings (`stories.ts`) and the case study library (`source/case-studies.md`). |
| `src/app/` | Routes. `[slug]/` serves the service pages at the site root (original URLs); `case-study/[slug]/` serves the 16 stories; `ai-solutions/` is the AI intake page. Old case study URLs are 301s in `next.config.ts`. |
| `src/components/` | `layout/` (header, mobile nav, footer), `home/` (homepage sections), `story/` (case study template, chapter rail, charts), `sections/` (shared sections), `service/` (service template), `brand/` (logo), `ui/`, `motion/`, `three/`. |
| `src/app/globals.css` | Design tokens (colors, fonts, easing) and global styles. |
| `src/lib/` | SEO helpers (metadata, JSON-LD), the case study parser (`stories.ts`) and the image lookup. |
| `public/brand/` | Logo mark and social-share image. |
| `public/images/stories/` | One illustration per story (AI-generated; illustrative, not photos of clients). |

## Common edits

- **Contact details and social links:** fill in `contact` and `socials` in `src/content/site.ts`.
  Empty values are hidden everywhere, so no placeholder text ever ships.
- **Case studies:** edit `src/content/source/case-studies.md` (the Case Study Library doc exported as
  Markdown) and rebuild. Each `## Story N · …` block becomes a page: URL, SEO title and meta description
  come from its first line, `####` headings become chapters, tables stay real HTML tables, `**Chart:**`
  lines become bar charts and `**Image (…):**` notes with arrows become flow diagrams. The image, related
  service and filter channel for each story are set in `src/content/stories.ts`.
- **Hero video:** drop a muted loop at `public/media/hero.mp4` (under 3 MB) and a poster at
  `public/media/hero-poster.jpg`, then rebuild. The hero switches to it automatically.
- **Testimonials:** the only published testimonial is the Chambers Law Firm video. Add new ones
  only when they come from real, consenting clients.
- **New service:** add an entry to `services.ts`. The page, the sitemap entry, the navigation link
  and the structured data are all generated from it.

## Motion and 3D

- Scroll reveals use one `IntersectionObserver` plus CSS. Content is visible without
  JavaScript, and a failsafe reveals everything if scripts fail to load.
- Scroll-linked effects (process timelines, story charts, flow diagrams) use GSAP + ScrollTrigger in
  `src/components/motion/GsapScenes.tsx`. Sections opt in with `data-timeline`, `data-grow`, `data-media`
  and `data-parallax`. GSAP loads after the page is idle; nothing is pinned and scrolling is never hijacked.
- Story pages show a reading-progress line and a sticky chapter list (`story/ChapterRail.tsx`).
- The hero's 3D mark (React Three Fiber) loads only on desktop devices with WebGL and a fine
  pointer, after the page is idle. It pauses when off-screen. Every other visitor sees a static
  SVG version of the same composition.
- `prefers-reduced-motion` turns off all animation and the 3D scene.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run lint:copy   # banned-word check from COPY_RULES.md
npm test            # Vitest unit tests (contact validation, rate limit, content, SEO helpers)
npm run build:standalone
npm run test:e2e    # Playwright on the built bundle: routes, redirects, headers, a11y, forms
```
