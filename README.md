# Law Pro Digital — website

Marketing site for Law Pro Digital, a digital marketing agency for law firms. It's built with
Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4.

**Design system — "Legal Ledger".** Newsreader (headlines) and Schibsted Grotesk (body, UI, figures);
neutral paper surfaces, ink text, the logo navy for dark sections and gold reserved for the main button
and key figures. Hairline rules instead of shadows; radii of 6px (buttons, tags), 12px (fields) and 20px
(cards). All tokens live in `src/app/globals.css`.

```bash
npm install
npm run dev        # http://localhost:3000
```

Deployment to cPanel is covered in **[DEPLOYMENT.md](DEPLOYMENT.md)**.

## Where things live

| Path | What it is |
| --- | --- |
| `src/content/` | **All site copy and data**: brand and contact details (`site.ts`), services (`services.ts`), case studies (`case-studies.ts`), homepage content (`home.ts`), plans (`pricing.ts`). Edit text here, not in components. Copy follows [`COPY_RULES.md`](src/content/COPY_RULES.md). |
| `src/app/` | Routes. `[slug]/` serves the service pages and case studies, which live at the site root to keep the original URLs. |
| `src/components/` | `layout/` (header, mobile nav, footer), `sections/` (page sections), `service/` and `case-study/` (page templates), `ui/` (buttons, headings, icons), `motion/` (scroll reveal, count-up, process timeline), `three/` (hero 3D scene and its SVG fallback). |
| `src/app/globals.css` | Design tokens (colors, fonts, easing) and global styles. |
| `src/lib/` | SEO helpers (metadata, JSON-LD) and the case-study image lookup. |
| `public/brand/` | Logo and social-share image. |
| `public/images/case-studies/` | Case-study screenshots (see below). |

## Common edits

- **Contact details and social links:** fill in `contact` and `socials` in `src/content/site.ts`.
  Empty values are hidden everywhere, so no placeholder text ever ships.
- **Case-study screenshots:** the original WordPress screenshots couldn't be recovered. Copy them
  into `public/images/case-studies/` using the file names referenced in
  `src/content/case-studies.ts` (for example `chambers-law-firm-HOmepage.jpg`), then rebuild.
  Each image appears automatically once its file exists.
- **Testimonials:** the only published testimonial is the Chambers Law Firm video. Add new ones
  only when they come from real, consenting clients.
- **New service or case study:** add an entry to `services.ts` or `case-studies.ts`. The page,
  the sitemap entry, the navigation link and the structured data are all generated from it.

## Motion and 3D

- Scroll reveals use one `IntersectionObserver` plus CSS. Content is visible without
  JavaScript, and a failsafe reveals everything if scripts fail to load.
- Scroll-linked effects (process timeline, case-study artwork reveal, hero figure drift) use GSAP +
  ScrollTrigger in `src/components/motion/GsapScenes.tsx`. Sections opt in with `data-timeline`,
  `data-media` and `data-parallax`. GSAP loads after the page is idle; nothing is pinned.
- The hero's 3D mark (React Three Fiber) loads only on desktop devices with WebGL and a fine
  pointer, after the page is idle. It pauses when off-screen. Every other visitor sees a static
  SVG version of the same composition.
- `prefers-reduced-motion` turns off all animation and the 3D scene.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run lint:copy   # banned-word check from COPY_RULES.md
npm run build:standalone
```
