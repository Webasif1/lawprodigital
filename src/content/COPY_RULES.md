# Copy rules

These rules cover every piece of text in `src/content/` and any copy written directly into components.
They come from comparing the first screens of the five law-firm marketing agencies that keep
appearing at the top of 2026 shortlists against weaker agencies in the same niche (October 2026).

Run `npm run lint:copy` before shipping copy changes. It flags the banned words listed below.

## What the strong sites do that the weak ones don't

| | Headline | Button | Proof on the first screen |
| --- | --- | --- | --- |
| **Rankings.io** | Own Legal Marketing. Win the Best Cases. | Book Complimentary Growth Audit | 4.9/5 from 200 reviews; "300+ PI firms" |
| **Juris Digital** | More of the cases you want. | Explore Partnership | 4.8/5 from 81 Google reviews; 1:57 video |
| **LawRank** | Law Firm Marketing That Wins You Cases | Next (form step 1) | "384% increase in first-time calls within 12 months" |
| **Grow Law** | Get Found. Sign More Cases. | Build My Growth Plan | 3.8× year-one return, 160+ firms, est. 2008, with a footnote |
| **Consultwebs** | Signed Cases. That's the Only Metric That Matters. | Check Availability in Your Area | A named partner's video testimonial |
| *Mockingbird* | Your Marketing wingman | GET ON BOARD | None |
| *On The Map* | Local Search Marketing Powerhouse | Let's Talk Marketing | Badges with no numbers |
| *Search Engine People* | Law Firm Digital Marketing+ | Get a Quote / Speak With A Specialist / How it works | "Reviewed on" logos with no rating |
| *LawPro (old)* | Grow Your Law Firm with Proven Digital Marketing That Wins Clients | Book a call / Get A Free Call | None |

The five patterns below come from that comparison.

1. **They sell the lawyer's unit of success: cases.** All five strong headlines say *cases*. The weak
   ones describe the agency ("wingman", "powerhouse", "digital marketing").
2. **The headline is short and works as a promise.** The strong ones are two short sentences or eight
   words at most. Weak ones run long or say nothing.
3. **There is proof next to the button, and it's specific.** It's a rating with a count, a number of
   firms, or one result with a timeframe. "Reviewed on [logo]" without a number doesn't count.
4. **The button names what you get.** An audit, a growth plan, an availability check. Weak buttons are
   generic ("Get a Quote", "Let's Talk") or cute ("GET ON BOARD").
5. **One main action.** The strong sites have one button, or one plus a low-effort second choice.
   Search Engine People offers three, plus a second headline that competes with the first.

The weak sites also share one tell: hype adjectives ("killer", "rockstars", "bold, loud and
unstoppable"). None of the strong sites use them.

## Rules

### Headlines
- Eight words or fewer. Two short sentences are fine.
- Talk about the firm's outcome (clients, cases, calls), not about us or our services.
- No adjectives that rate ourselves: *proven, powerful, leading, smart, best*.

### One idea per screen
- Each section makes exactly one point. If you need "and" to summarise it, split it or cut half.
- Use one supporting line, two at most. Anything longer belongs on an inner page.
- Bullet lists hold facts, not slogans.

### Buttons
- Primary: say what happens. Use **Book a free strategy call**, not "Contact", "Get started" or "Learn more".
- At most one secondary button per screen, and it has to cost less effort than the primary (e.g. **See the results**).
- Use the same verb for the same action across the site.

### Proof
- Every number must come from a published case study in `case-studies.ts`, and it links to that study.
- Always give the context: who, how long, which practice area. "99% lead conversion" alone isn't enough.
- No ratings, review counts, firm counts or awards until they're real and we can link to them.
- Don't promise future results. Describe what happened for a named client.

### Words
Write the way a lawyer would talk to a colleague. Use short sentences, concrete nouns and the active voice.

**Banned** (`npm run lint:copy` flags them): seamless, leverage, elevate, unlock, empower, robust,
cutting-edge, game-changer, supercharge, effortless(ly), holistic, synergy, world-class, next-level,
ever-evolving, delve, landscape, realm, tailored, laser-focused, inside out, live and breathe, glowing,
passionate, compelling, meaningful, dominate, powerhouse, rockstar, killer, journey, "in today's",
"not just …", proven.

Also avoid these patterns:
- "We're not just X — we're Y."
- Groups of three adjectives ("fast, reliable and effective").
- Em-dash asides that restate the sentence.
- Questions in headlines that the reader would answer "no" to.

## Checklist before publishing a page
- [ ] Can each screen be summarised in one sentence?
- [ ] Is the H1 eight words or fewer, about the client's outcome?
- [ ] Is there a specific, linked proof point within one scroll of the first button?
- [ ] Does every button say what happens next?
- [ ] Does `npm run lint:copy` pass?
