import type { Metadata } from "next";
import { CaseStudyCard } from "@/components/case-study/CaseStudyCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { caseStudies } from "@/content/case-studies";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Case Studies — Law Firm Marketing Results",
  description:
    "Digital marketing that delivers success: case studies from Law Pro Digital, including 99% lead conversion for a bankruptcy law firm and low-cost U.S. immigration lead generation campaigns.",
  path: "/case-study/",
});

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Case Studies", path: "/case-study/" }]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: caseStudies.map((c, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/${c.slug}/`), name: c.title })),
          },
        ]}
      />
      <PageHero
        eyebrow="Case studies"
        crumbs={[{ name: "Case Studies", path: "/case-study/" }]}
        title={
          <>
            Digital marketing that <em className="text-gold">delivers success.</em>
          </>
        }
        intro="Real campaigns for real law firms — the strategy, the spend and the numbers, published in full."
      />
      <section aria-label="All case studies" className="bg-paper">
        <div className="container-x section-y grid gap-24 sm:gap-32">
          {caseStudies.map((study, i) => (
            <CaseStudyCard key={study.slug} study={study} index={i} headingLevel="h2" />
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
