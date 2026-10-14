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
import { CheckIcon } from "@/components/ui/icons";
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
            <ButtonLink href="/case-study/" variant="ghost-dark">
              See case studies
            </ButtonLink>
          </>
        }
      />

      {service.sections.map((section, i) => (
        <SectionView key={section.id} section={section} alt={i % 2 === 1} />
      ))}

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="border-t border-ink/10 bg-paper">
          <div className="container-x py-24 sm:py-32">
            <SectionHeading eyebrow="Proof" title={<span id="related-heading">Related case studies</span>} />
            <div className="mt-16 grid gap-20">
              {related.map((study, i) => (
                <CaseStudyCard key={study.slug} study={study} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <nav aria-labelledby="other-services" className="border-t border-ink/10 bg-paper-2">
        <div className="container-x py-16">
          <h2 id="other-services" className="text-xs font-bold uppercase tracking-[0.22em] text-gold-deep">
            More services
          </h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {others.map((s) => (
              <li key={s.slug}>
                <Link
                  href={serviceHref(s.slug)}
                  className="inline-flex min-h-11 items-center rounded-full bg-paper px-5 font-semibold ring-1 ring-ink/12 transition-colors hover:bg-ink hover:text-paper"
                >
                  {s.navLabel}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="pt-24 sm:pt-32 bg-paper">
        <CtaBand heading={service.closing?.heading} text={service.closing?.text} />
      </div>
    </>
  );
}

function SectionView({ section, alt }: { section: ServiceSection; alt: boolean }) {
  const bg = alt ? "bg-paper-2" : "bg-paper";
  const headingId = `${section.id}-heading`;

  switch (section.kind) {
    case "faq":
      return <FaqList items={section.items} heading={section.heading} id={headingId} />;
    case "process":
      return <ProcessSection eyebrow={section.eyebrow} heading={section.heading} intro={section.intro} steps={section.steps} id={headingId} />;
    case "features":
      return (
        <section aria-labelledby={headingId} className={bg}>
          <div className="container-x py-24 sm:py-32">
            <SectionHeading align="split" eyebrow={section.eyebrow} title={<span id={headingId}>{section.heading}</span>} intro={section.intro} />
            <ul className={`mt-16 grid gap-px overflow-hidden rounded-3xl bg-ink/12 sm:grid-cols-2 ${section.items.length % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-2 xl:grid-cols-3"}`}>
              {section.items.map((item, i) => (
                <li key={item.title} data-reveal style={{ ["--reveal-i" as string]: i % 3 }} className={`group flex flex-col gap-4 p-7 sm:p-8 ${bg} transition-colors duration-500 hover:bg-ink hover:text-paper`}>
                  <span className="text-sm font-bold tabular-nums text-gold-deep transition-colors group-hover:text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-display text-2xl leading-tight tracking-tight">{item.title}</h3>
                  {item.text && <p className="leading-relaxed text-slate transition-colors group-hover:text-mist">{item.text}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      );
    case "tags":
      return (
        <section aria-labelledby={headingId} className={bg}>
          <div className="container-x py-24 sm:py-28">
            <SectionHeading eyebrow={section.eyebrow} title={<span id={headingId}>{section.heading}</span>} intro={section.intro} />
            <ul className="mt-12 flex flex-wrap gap-3">
              {section.items.map((item, i) => (
                <li
                  key={item}
                  data-reveal
                  style={{ ["--reveal-i" as string]: i % 4 }}
                  className="rounded-full bg-ink px-6 py-3.5 font-display text-xl tracking-tight text-paper sm:text-2xl"
                >
                  {item}
                </li>
              ))}
            </ul>
            {section.closing && (
              <p data-reveal className="mt-10 max-w-2xl text-lg leading-relaxed text-slate">
                {section.closing}
              </p>
            )}
          </div>
        </section>
      );
    case "prose":
      return (
        <section aria-labelledby={headingId} className={bg}>
          <div className="container-x grid gap-12 py-24 sm:py-32 lg:grid-cols-12">
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
                <ul className="mt-8 grid gap-3">
                  {section.bullets.map((b, i) => (
                    <li key={b} data-reveal style={{ ["--reveal-i" as string]: i }} className="flex gap-4 rounded-2xl bg-ink/[0.04] p-5 text-lg leading-snug">
                      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-navy text-gold">
                        <CheckIcon className="size-3.5" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              {section.closing && (
                <p data-reveal className="mt-8 text-lg leading-relaxed text-slate">
                  {section.closing}
                </p>
              )}
            </div>
          </div>
        </section>
      );
  }
}
