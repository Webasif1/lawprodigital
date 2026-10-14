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
    <section aria-labelledby="testimonial-heading" className="grain overflow-hidden bg-ink-2 text-paper">
      <div className="container-x grid items-center gap-14 py-24 sm:py-32 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div data-reveal>
            <Eyebrow tone="dark">Client testimonial</Eyebrow>
          </div>
          <h2 id="testimonial-heading" data-reveal className="mt-6 font-display-tight text-[clamp(2.25rem,5vw,4.25rem)]">
            Hear it from <em className="text-gold">{featuredTestimonial.client}</em>
          </h2>
          <p data-reveal className="mt-6 max-w-xl text-lg leading-relaxed text-mist">
            After six months of working together, {featuredTestimonial.client} talked on camera about the experience.
          </p>
          <dl data-reveal className="mt-10 grid max-w-xl grid-cols-3 gap-6 border-t border-white/12 pt-8">
            {study.stats.map((s) => (
              <div key={s.label}>
                <dt className="text-sm text-mist">{s.label}</dt>
                <dd className="mt-1 font-display text-3xl tracking-tight sm:text-4xl">
                  {s.prefix}
                  {s.value}
                  {s.suffix}
                </dd>
              </div>
            ))}
          </dl>
          <Link data-reveal href={`/${study.slug}/`} className="group mt-10 inline-flex items-center gap-3 font-semibold text-paper">
            Read the full case study
            <ArrowIcon className="size-4 text-gold transition-transform duration-300 group-hover:translate-x-1" />
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
