import Link from "next/link";
import { featuredTestimonial, getCaseStudy } from "@/content/case-studies";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { ArrowIcon } from "@/components/ui/icons";
import { VideoTestimonial } from "./VideoTestimonial";

/** The one verified client testimonial: Chambers Law Firm's video, tied to its case study. */
export function TestimonialSection() {
  const study = getCaseStudy(featuredTestimonial.caseStudySlug);
  if (!study) return null;

  return (
    <section aria-labelledby="testimonial-heading" className="on-dark overflow-hidden bg-navy-deep text-paper">
      <div className="container-x section-y grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div data-reveal>
            <Eyebrow tone="dark">Client testimonial</Eyebrow>
          </div>
          <h2 id="testimonial-heading" data-reveal className="mt-6 font-display-tight text-h1">
            Hear it from <em className="text-gold">{featuredTestimonial.client}</em>
          </h2>
          <p data-reveal className="mt-6 max-w-xl text-lead text-mist">
            After six months of working together, {featuredTestimonial.client} talked on camera about the experience.
          </p>
          <dl data-reveal className="mt-10 grid max-w-xl grid-cols-3 border-t border-white/15">
            {study.stats.map((s) => (
              <div key={s.label} className="border-r border-white/15 py-6 pr-4 last:border-r-0 not-first:pl-5">
                <dt className="text-sm text-mist">{s.label}</dt>
                <dd className="figure mt-2 text-3xl tracking-tight sm:text-4xl">
                  {s.prefix}
                  {s.value}
                  {s.suffix}
                </dd>
              </div>
            ))}
          </dl>
          <Link data-reveal href={`/${study.slug}/`} className="group mt-10 inline-flex items-center gap-2 font-semibold text-paper">
            Read the full case study
            <ArrowIcon className="size-4 text-gold transition-transform duration-(--dur-base) ease-out-expo group-hover:translate-x-1" />
          </Link>
        </div>
        <div data-reveal className="lg:col-span-5">
          <VideoTestimonial youtubeId={featuredTestimonial.youtubeId} title={`${featuredTestimonial.client} — client testimonial video`} />
          <p className="mt-4 text-center text-sm text-mist">{featuredTestimonial.context}</p>
        </div>
      </div>
    </section>
  );
}
