import { caseStudies } from "@/content/case-studies";
import { CaseStudyCard } from "@/components/case-study/CaseStudyCard";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CaseStudiesSection({ limit = 3 }: { limit?: number }) {
  return (
    <section aria-labelledby="cases-heading" className="bg-paper">
      <div className="container-x section-y border-t border-line">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading eyebrow="Case studies" index={2} title={<span id="cases-heading">The work behind the numbers</span>} />
          <ButtonLink href="/case-study/" variant="ghost-light" arrow={false} data-reveal>
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
