import Link from "next/link";
import { type CaseStudy, caseStudies } from "@/content/case-studies";
import { site } from "@/content/site";
import { BlockRenderer } from "@/components/case-study/BlockRenderer";
import { CountUp } from "@/components/motion/CountUp";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArrowIcon } from "@/components/ui/icons";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" });

export function CaseStudyPage({ study }: { study: CaseStudy }) {
  const path = `/${study.slug}/`;
  const others = caseStudies.filter((c) => c.slug !== study.slug);

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: study.title,
            description: study.metaDescription,
            datePublished: study.published,
            mainEntityOfPage: absoluteUrl(path),
            author: { "@id": `${site.url}/#organization` },
            publisher: { "@id": `${site.url}/#organization` },
            image: absoluteUrl(site.logo.src),
          },
          breadcrumbJsonLd([
            { name: "Case Studies", path: "/case-study/" },
            { name: study.shortTitle, path },
          ]),
        ]}
      />
      <PageHero
        eyebrow={`Case study · ${study.category}`}
        crumbs={[
          { name: "Case Studies", path: "/case-study/" },
          { name: study.shortTitle, path },
        ]}
        title={study.title}
        intro={study.summary}
      />

      <section aria-label="Key results" className="border-b border-ink/10 bg-paper">
        <dl className="container-x grid gap-px py-0 sm:grid-cols-3">
          {study.stats.map((s, i) => (
            <div key={s.label} data-reveal style={{ ["--reveal-i" as string]: i }} className="border-ink/10 py-10 sm:border-l sm:px-8 sm:first:border-l-0 sm:first:pl-0">
              <dt className="text-sm font-semibold text-slate">{s.label}</dt>
              <dd className="mt-2 font-display text-[clamp(2.75rem,5vw,4.25rem)] leading-none tracking-tight">
                <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <article className="bg-paper">
        <div className="container-x grid gap-14 py-20 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="rounded-3xl bg-paper-2 p-7 lg:sticky lg:top-28">
              <dl className="grid gap-5">
                {[
                  ["Client", study.client],
                  ["Industry", study.industry],
                  ["Duration", study.duration],
                  ["Services", study.channels],
                  ["Published", dateFormat.format(new Date(study.published))],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs font-bold uppercase tracking-[0.18em] text-gold-deep">{k}</dt>
                    <dd className="mt-1 leading-snug">{v}</dd>
                  </div>
                ))}
              </dl>
              <Link
                href={site.primaryCta.href}
                className="group mt-8 flex items-center justify-between rounded-2xl bg-ink px-5 py-4 font-semibold text-paper transition-colors hover:bg-navy"
              >
                Want results like this?
                <ArrowIcon className="size-4 text-gold transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </aside>
          <div className="min-w-0 max-w-3xl lg:col-span-8">
            <BlockRenderer blocks={study.blocks} />
          </div>
        </div>
      </article>

      <nav aria-labelledby="more-cases" className="border-t border-ink/10 bg-paper">
        <div className="container-x py-20">
          <h2 id="more-cases" className="font-display text-3xl tracking-tight sm:text-4xl">
            More case studies
          </h2>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-3xl bg-ink/12 md:grid-cols-3">
            {others.map((c) => (
              <li key={c.slug} className="bg-paper">
                <Link href={`/${c.slug}/`} className="group flex h-full flex-col gap-6 p-7 transition-colors duration-300 hover:bg-ink hover:text-paper">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-deep group-hover:text-gold">
                    {c.category} · {c.duration}
                  </span>
                  <span className="font-display text-xl leading-snug tracking-tight">{c.title}</span>
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold">
                    Read case study <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <CtaBand heading="Want to get more legal leads for your firm?" text="Let our expert team create a custom digital growth plan for your practice — and let’s start building your success story." />
    </>
  );
}
