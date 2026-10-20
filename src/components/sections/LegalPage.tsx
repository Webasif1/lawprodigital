import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import type { LegalSection } from "@/content/legal";
import { breadcrumbJsonLd } from "@/lib/seo";

type Props = { title: string; path: string; intro: string; updated: string; sections: LegalSection[] };

const dateLabel = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

/** Plain reading layout for the privacy policy and terms. */
export function LegalPage({ title, path, intro, updated, sections }: Props) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: title, path }])} />
      <PageHero eyebrow="Legal" crumbs={[{ name: title, path }]} title={title} intro={intro} />
      <section className="bg-paper">
        <div className="container-x section-y grid gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <p className="text-sm text-muted">
              Last updated <time dateTime={updated}>{dateLabel(updated)}</time>
            </p>
            <nav aria-label="On this page" className="mt-6 hidden lg:block">
              <ol className="grid gap-2 border-l border-line pl-5 text-sm">
                {sections.map((s, i) => (
                  <li key={s.heading}>
                    <a href={`#s${i + 1}`} className="text-ink/70 transition-colors hover:text-navy">
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
          <div className="prose-case max-w-[68ch] lg:col-span-8">
            {sections.map((s, i) => (
              <section key={s.heading} aria-labelledby={`s${i + 1}`}>
                <h2 id={`s${i + 1}`} className="scroll-mt-28 first:mt-0">
                  {s.heading}
                </h2>
                {s.paragraphs?.map((p) => <p key={p}>{p}</p>)}
                {s.items && (
                  <ul>
                    {s.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
