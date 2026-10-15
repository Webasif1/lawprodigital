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

      <section aria-label="Key results" className="border-b border-line bg-surface">
        <dl className="container-x grid gap-px py-0 sm:grid-cols-3">
          {study.stats.map((s, i) => (
            <div key={s.label} data-reveal style={{ ["--reveal-i" as string]: i }} className="border-b border-line py-9 last:border-b-0 sm:border-b-0 sm:border-l sm:px-8 sm:first:border-l-0 sm:first:pl-0">
              <dt className="text-sm font-semibold text-muted">{s.label}</dt>
              <dd className="figure mt-2 text-figure text-navy">
                <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <article className="bg-paper">
        <div className="container-x grid gap-14 py-16 sm:py-20 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="border-t border-ink pt-6 lg:sticky lg:top-28">
              <dl className="grid gap-5">
                {[
                  ["Client", study.client],
                  ["Industry", study.industry],
                  ["Duration", study.duration],
                  ["Services", study.channels],
                  ["Published", dateFormat.format(new Date(study.published))],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="eyebrow text-brass">{k}</dt>
                    <dd className="mt-1 leading-snug">{v}</dd>
                  </div>
                ))}
              </dl>
              <Link
                href={site.primaryCta.href}
                className="group on-dark mt-8 flex items-center justify-between rounded-tag bg-navy px-5 py-4 font-semibold text-paper transition-colors duration-(--dur-fast) hover:bg-navy-2"
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

      <nav aria-labelledby="more-cases" className="border-t border-line bg-wash">
        <div className="container-x py-20">
          <h2 id="more-cases" className="font-display-tight text-h2">
            More case studies
          </h2>
          <ul className="mt-10 grid border-t border-ink md:grid-cols-2 lg:grid-cols-4">
            {others.map((c) => (
              <li key={c.slug} className="border-b border-line md:border-r md:even:border-r-0 lg:even:border-r lg:last:border-r-0">
                <Link href={`/${c.slug}/`} className="group flex h-full flex-col gap-6 py-7 transition-colors duration-(--dur-base) hover:bg-surface md:px-6">
                  <span className="eyebrow text-brass">
                    {c.category} · {c.duration}
                  </span>
                  <span className="font-display text-xl leading-snug tracking-[-0.01em] transition-colors group-hover:text-navy">{c.title}</span>
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-navy">
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
