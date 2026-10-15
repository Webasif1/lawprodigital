import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { type Story, getStoryByNumber, privacyLine, STORIES_UPDATED } from "@/lib/stories";
import { storyImage } from "@/lib/assets";
import { absoluteUrl, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowUpRightIcon, PlusIcon } from "@/components/ui/icons";
import { ChapterRail } from "./ChapterRail";
import { plain, Rich } from "./Rich";
import { StoryBlocks } from "./StoryBlocks";
import { StoryCard } from "./StoryCard";

const updated = new Date(STORIES_UPDATED).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

function readingMinutes(story: Story) {
  const words = JSON.stringify([story.shortAnswer, story.chapters, story.faqs]).split(/\s+/).length;
  return Math.max(3, Math.round(words / 230));
}

/**
 * A case study told as a story. The page answers a managing partner's four
 * questions in order: is this firm like mine, did it produce signed clients,
 * how exactly, and can I trust the numbers.
 *
 * Hero → the short answer → at a glance → chapters (with a sticky chapter
 * rail and scroll-drawn charts) → FAQ → call to action → related stories.
 */
export function StoryPage({ story }: { story: Story }) {
  const src = storyImage(story.image);
  const related = story.related.map(getStoryByNumber).filter((s): s is Story => Boolean(s));
  const chapters = story.chapters.map((c) => ({ id: c.id, title: c.title }));
  const bodyId = "story-body";

  return (
    <article>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: story.title,
            description: story.metaDescription,
            datePublished: STORIES_UPDATED,
            dateModified: STORIES_UPDATED,
            mainEntityOfPage: absoluteUrl(story.href),
            ...(src ? { image: absoluteUrl(src) } : {}),
            author: { "@type": "Organization", name: site.name, url: site.url },
            publisher: { "@id": `${site.url}/#organization` },
            about: story.keyword,
          },
          breadcrumbJsonLd([
            { name: "Case Studies", path: "/case-study/" },
            { name: story.title, path: story.href },
          ]),
          ...(story.faqs.length ? [faqJsonLd(story.faqs.map((f) => ({ q: plain(f.q), a: plain(f.a) })))] : []),
        ]}
      />

      {/* Hero: the photograph sets the scene, the headline states the result. */}
      <header className="on-dark relative isolate overflow-hidden bg-navy text-white">
        {src && (
          <div aria-hidden={false} className="absolute inset-0 -z-10">
            <Image src={src} alt={story.heroAlt} fill priority sizes="100vw" className="hero-zoom object-cover" />
            <div className="absolute inset-0 bg-navy/80" />
          </div>
        )}
        <div className="container-x relative flex min-h-[min(82svh,46rem)] flex-col pt-8 pb-28 sm:pb-36">
          <nav aria-label="Breadcrumb" className="hero-fade" style={{ ["--i" as string]: 0 }}>
            <ol className="flex flex-wrap items-center gap-2 text-sm text-white/70">
              <li>
                <Link href="/" className="hover:text-gold">
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-white/30">
                /
              </li>
              <li>
                <Link href="/case-study/" className="hover:text-gold">
                  Case Studies
                </Link>
              </li>
              <li aria-hidden className="text-white/30">
                /
              </li>
              <li aria-current="page" className="text-white">
                Story {story.n}
              </li>
            </ol>
          </nav>
          <div className="mt-auto max-w-4xl pt-16">
            <p className="hero-fade eyebrow inline-flex items-center gap-2.5 rounded-full bg-white/10 px-3 py-1.5 text-gold ring-1 ring-inset ring-white/15 backdrop-blur" style={{ ["--i" as string]: 0 }}>
              <span className="tabular-nums">Story {String(story.n).padStart(2, "0")}</span>
              <span aria-hidden className="size-1 rounded-full bg-current" />
              {story.label}
            </p>
            <h1 className="mt-6 font-display-tight text-h1 text-balance">
              <span className="hero-line">
                <span>{story.title}</span>
              </span>
            </h1>
            <p className="hero-settle mt-6 max-w-2xl text-lead text-white/80" style={{ ["--i" as string]: 1 }}>
              {story.subhead}
            </p>
            <p className="hero-fade mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/65" style={{ ["--i" as string]: 2 }}>
              <span>{readingMinutes(story)} min read</span>
              <span>Updated {updated}</span>
              <span>Multi-office US immigration firm</span>
            </p>
          </div>
        </div>
      </header>

      {/* The short answer: lifted by AI Overviews, ChatGPT and Perplexity. */}
      <section aria-label="The short answer" className="relative bg-paper">
        <div className="container-x">
          <div className="relative -mt-20 grid gap-6 rounded-card bg-surface p-6 shadow-[0_30px_70px_-35px_rgba(9,20,40,0.45)] ring-1 ring-line sm:-mt-24 sm:p-10 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <p className="eyebrow inline-flex items-center gap-2 rounded-full bg-gold-wash px-3 py-1.5 text-brass">
                <span aria-hidden className="size-1.5 rounded-full bg-current" />
                The short answer
              </p>
              <p className="mt-5 font-display text-xl font-medium leading-relaxed tracking-tight text-ink sm:text-[1.4rem]">
                <Rich text={story.shortAnswer} />
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-field bg-line ring-1 ring-line lg:col-span-5">
              {story.stats.map((s, i) => (
                <div key={i} data-reveal style={{ ["--reveal-i" as string]: i }} className="flex flex-col bg-surface p-4 sm:p-5">
                  <dt className="order-2 mt-2 text-xs leading-snug text-muted">{s.label}</dt>
                  <dd className={`figure order-1 text-[clamp(1.5rem,3vw,2.1rem)] leading-none tracking-tight ${i === 0 ? "text-brass" : "text-ink"}`}>{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* The story itself. */}
      <div className="bg-paper">
        <div id={bodyId} className="container-x grid gap-12 py-20 sm:py-28 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <ChapterRail chapters={chapters} bodyId={bodyId} />
          </aside>
          <div className="grid gap-20 sm:gap-24 lg:col-span-8 lg:col-start-5">
            {story.chapters.map((chapter, i) => {
              if (chapter.kind === "takeaways")
                return (
                  <section key={chapter.id} id={chapter.id} aria-labelledby={`${chapter.id}-h`} className="on-dark scroll-mt-28 rounded-card bg-navy p-6 text-white sm:p-10">
                    <ChapterHeading index={i} id={`${chapter.id}-h`} title={chapter.title} dark />
                    <div className="mt-8">
                      <StoryBlocks blocks={chapter.blocks} tone="takeaways" />
                    </div>
                    <Link
                      href={story.service.href}
                      className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-soft"
                    >
                      How we do this: {story.service.label}
                      <ArrowUpRightIcon className="size-4" />
                    </Link>
                  </section>
                );
              if (chapter.kind === "setback")
                return (
                  <section key={chapter.id} id={chapter.id} aria-labelledby={`${chapter.id}-h`} className="scroll-mt-28 rounded-card border border-dashed border-brass/40 bg-gold-wash/50 p-6 sm:p-10">
                    <p className="eyebrow text-brass">The honest part</p>
                    <ChapterHeading index={i} id={`${chapter.id}-h`} title={chapter.title} />
                    <div className="mt-6">
                      <StoryBlocks blocks={chapter.blocks} />
                    </div>
                  </section>
                );
              return (
                <section key={chapter.id} id={chapter.id} aria-labelledby={`${chapter.id}-h`} className="scroll-mt-28">
                  <ChapterHeading index={i} id={`${chapter.id}-h`} title={chapter.title} />
                  <div className="mt-8">
                    <StoryBlocks blocks={chapter.blocks} />
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>

      {story.faqs.length > 0 && (
        <section aria-labelledby="story-faq" className="border-t border-line bg-surface">
          <div className="container-x section-y grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow inline-flex items-center gap-2 rounded-full bg-gold-wash px-3 py-1.5 text-brass">
                <span aria-hidden className="size-1.5 rounded-full bg-current" />
                FAQ
              </p>
              <h2 id="story-faq" className="mt-5 font-display-tight text-h2">
                Questions firms ask about this
              </h2>
            </div>
            <div className="border-t border-ink lg:col-span-8">
              {story.faqs.map((f, i) => (
                <details key={f.q} className="group border-b border-line" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left font-display text-lg font-semibold leading-snug tracking-tight sm:text-xl [&::-webkit-details-marker]:hidden">
                    {plain(f.q)}
                    <span className="grid size-10 shrink-0 place-items-center rounded-tag ring-1 ring-line transition-colors duration-(--dur-base) group-open:bg-navy group-open:text-white group-open:ring-navy">
                      <PlusIcon className="size-4 transition-transform duration-(--dur-base) ease-out-expo group-open:rotate-45" />
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-7 text-lg leading-relaxed text-muted">
                    <Rich text={f.a} />
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="story-cta" className="bg-surface pb-20 sm:pb-28">
        <div className="container-x">
          <div className="on-dark relative overflow-hidden rounded-card bg-navy px-6 py-14 text-white sm:px-14 sm:py-16">
            <div aria-hidden className="ledger-rules pointer-events-none absolute inset-0 mask-[linear-gradient(to_left,#000,transparent_70%)]" />
            <div className="relative grid gap-8 lg:grid-cols-12 lg:items-end">
              <h2 id="story-cta" className="font-display-tight text-h2 text-balance lg:col-span-8">
                {story.cta || "Want this system running in your firm?"}
              </h2>
              <div className="lg:col-span-4 lg:justify-self-end">
                <ButtonLink href={site.primaryCta.href}>{site.primaryCta.label}</ButtonLink>
              </div>
            </div>
            <p className="relative mt-10 max-w-3xl border-t border-white/10 pt-6 text-xs leading-relaxed text-mist">{privacyLine}</p>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-h" className="bg-paper">
          <div className="container-x section-y">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="related-h" className="font-display-tight text-h2">
                Keep reading
              </h2>
              <Link href="/case-study/" className="inline-flex items-center gap-2 font-semibold text-navy-2 hover:text-brass">
                All 16 stories <ArrowUpRightIcon className="size-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <StoryCard key={r.slug} story={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

function ChapterHeading({ index, id, title, dark = false }: { index: number; id: string; title: string; dark?: boolean }) {
  return (
    <div data-reveal className="flex items-start gap-5">
      <span aria-hidden className={`figure mt-1 text-sm tabular-nums ${dark ? "text-gold" : "text-brass"}`}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <h2 id={id} className={`font-display-tight text-[clamp(1.6rem,2.8vw,2.3rem)] leading-[1.12] tracking-[-0.03em] text-balance ${dark ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
    </div>
  );
}
