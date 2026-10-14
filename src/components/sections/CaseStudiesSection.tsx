import { caseStudies } from "@/content/case-studies";
import { CaseStudyCard } from "@/components/case-study/CaseStudyCard";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CaseStudiesSection({ limit = 3 }: { limit?: number }) {
  return (
    <section aria-labelledby="cases-heading" className="bg-paper">
      <div className="container-x py-24 sm:py-32">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading eyebrow="Case studies" title={<span id="cases-heading">The work behind the numbers</span>} />
          <ButtonLink href="/case-study/" variant="ghost-light" data-reveal>
            All case studies
          </ButtonLink>
        </div>
        <div className="mt-16 grid gap-20 sm:gap-28">
          {caseStudies.slice(0, limit).map((study, i) => (
            <CaseStudyCard key={study.slug} study={study} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
