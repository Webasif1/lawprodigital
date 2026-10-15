import { caseStudies } from "@/content/case-studies";
import { type Service, type ServiceSection, services, serviceHref } from "@/content/services";
import { site } from "@/content/site";
import { CaseStudyCard } from "@/components/case-study/CaseStudyCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqList } from "@/components/sections/FaqList";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { absoluteUrl, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import Link from "next/link";

export function ServicePage({ service }: { service: Service }) {
  const path = serviceHref(service.slug);
  const related = caseStudies.filter((c) => service.relatedCaseStudies.includes(c.slug));
  const faq = service.sections.find((s) => s.kind === "faq");
  const others = services.filter((s) => s.slug !== service.slug);

  const jsonLd: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.navLabel,
      serviceType: service.navLabel,
      description: service.metaDescription,
      url: absoluteUrl(path),
      provider: { "@id": `${site.url}/#organization` },
      audience: { "@type": "Audience", audienceType: "Law firms and lawyers" },
    },
    breadcrumbJsonLd([{ name: service.navLabel, path }]),
  ];
  if (faq?.kind === "faq") jsonLd.push(faqJsonLd(faq.items));

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHero
        eyebrow={service.eyebrow}
        crumbs={[{ name: service.navLabel, path }]}
        title={
          <>
            {service.headline.lead && `${service.headline.lead} `}
            <em className="text-gold">{service.headline.emphasis}</em> {service.headline.tail}
          </>
        }
        intro={service.intro}
        actions={
          <>
            <ButtonLink href={site.primaryCta.href}>{site.primaryCta.label}</ButtonLink>
            <ButtonLink href="/case-study/" variant="ghost-dark" arrow={false}>
              See case studies
            </ButtonLink>
          </>
        }
      />

      {service.sections.map((section, i) => (
        <SectionView key={section.id} section={section} alt={i % 2 === 1} />
      ))}

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="border-t border-line bg-paper">
          <div className="container-x section-y">
            <SectionHeading eyebrow="Proof" title={<span id="related-heading">Related case studies</span>} />
            <div className="mt-16 grid gap-20">
              {related.map((study, i) => (
                <CaseStudyCard key={study.slug} study={study} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <nav aria-labelledby="other-services" className="border-t border-line bg-wash">
        <div className="container-x py-16">
          <h2 id="other-services" className="eyebrow text-brass">
            More services
          </h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {others.map((s) => (
              <li key={s.slug}>
                <Link
                  href={serviceHref(s.slug)}
                  className="inline-flex min-h-11 items-center rounded-tag bg-surface px-4 font-medium ring-1 ring-line transition-colors duration-(--dur-fast) hover:bg-navy hover:text-paper hover:ring-navy"
                >
                  {s.navLabel}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="bg-paper pt-20 sm:pt-28">
        <CtaBand heading={service.closing?.heading} text={service.closing?.text} />
      </div>
    </>
  );
}

function SectionView({ section, alt }: { section: ServiceSection; alt: boolean }) {
  const bg = alt ? "bg-wash" : "bg-paper";
  const headingId = `${section.id}-heading`;

  switch (section.kind) {
    case "faq":
      return <FaqList items={section.items} heading={section.heading} id={headingId} />;
    case "process":
      return <ProcessSection eyebrow={section.eyebrow} heading={section.heading} intro={section.intro} steps={section.steps} id={headingId} />;
    case "features":
      return (
        <section aria-labelledby={headingId} className={bg}>
          <div className="container-x section-y">
            <SectionHeading align="split" eyebrow={section.eyebrow} title={<span id={headingId}>{section.heading}</span>} intro={section.intro} />
            <ul className={`mt-16 grid border-t border-l border-line sm:grid-cols-2 ${section.items.length % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-2 xl:grid-cols-3"}`}>
              {section.items.map((item, i) => (
                <li key={item.title} data-reveal style={{ ["--reveal-i" as string]: i % 3 }} className="group flex flex-col gap-4 border-r border-b border-line p-7 transition-colors duration-(--dur-base) hover:bg-surface sm:p-8">
                  <span className="figure text-lg tabular-nums text-muted transition-colors duration-(--dur-fast) group-hover:text-brass">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-display text-[1.6rem] leading-tight tracking-[-0.015em] transition-colors duration-(--dur-fast) group-hover:text-navy">{item.title}</h3>
                  {item.text && <p className="leading-relaxed text-muted">{item.text}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      );
    case "tags":
      return (
        <section aria-labelledby={headingId} className={bg}>
          <div className="container-x section-y">
            <SectionHeading eyebrow={section.eyebrow} title={<span id={headingId}>{section.heading}</span>} intro={section.intro} />
            <ul className="mt-12 flex flex-wrap gap-3">
              {section.items.map((item, i) => (
                <li
                  key={item}
                  data-reveal
                  style={{ ["--reveal-i" as string]: i % 4 }}
                  className="rounded-tag bg-surface px-5 py-3 font-display text-xl tracking-[-0.01em] ring-1 ring-line sm:text-2xl"
                >
                  {item}
                </li>
              ))}
            </ul>
            {section.closing && (
              <p data-reveal className="mt-10 max-w-2xl text-lg leading-relaxed text-muted">
                {section.closing}
              </p>
            )}
          </div>
        </section>
      );
    case "prose":
      return (
        <section aria-labelledby={headingId} className={bg}>
          <div className="container-x section-y grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading eyebrow={section.eyebrow} title={<span id={headingId}>{section.heading}</span>} />
            </div>
            <div className="lg:col-span-7 lg:pt-10">
              {section.paragraphs.map((p) => (
                <p key={p} data-reveal className="mb-5 text-lg leading-relaxed text-ink/80">
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-8 grid border-t border-line">
                  {section.bullets.map((b, i) => (
                    <li key={b} data-reveal style={{ ["--reveal-i" as string]: i }} className="flex gap-4 border-b border-line py-4 text-lg leading-snug">
                      <span aria-hidden className="mt-3 h-0.5 w-5 shrink-0 bg-gold" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              {section.closing && (
                <p data-reveal className="mt-8 text-lg leading-relaxed text-muted">
                  {section.closing}
                </p>
              )}
            </div>
          </div>
        </section>
      );
  }
}
