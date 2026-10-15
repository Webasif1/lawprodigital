import Link from "next/link";
import { caseStudies } from "@/content/home";
import { getStoryByNumber, type Story } from "@/lib/stories";
import { StoryCard } from "@/components/story/StoryCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowUpRightIcon } from "@/components/ui/icons";

export function StoriesSection() {
  const featured = getStoryByNumber(caseStudies.featured);
  const supporting = caseStudies.supporting.map(getStoryByNumber).filter((s): s is Story => Boolean(s));

  return (
    <section aria-labelledby="stories-heading" className="bg-paper">
      <div className="container-x section-y">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Case studies" title={<span id="stories-heading">{caseStudies.heading}</span>} />
          <Link href="/case-study/" className="inline-flex items-center gap-2 font-semibold text-navy-2 hover:text-brass">
            See all 16 case studies <ArrowUpRightIcon className="size-4" />
          </Link>
        </div>
        {featured && (
          <div className="mt-14">
            <StoryCard story={featured} size="feature" />
          </div>
        )}
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {supporting.map((s) => (
            <StoryCard key={s.slug} story={s} size="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}
