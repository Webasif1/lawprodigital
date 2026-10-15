import { founder } from "@/content/home";
import { videoTestimonial } from "@/content/testimonials";
import { VideoTestimonial } from "@/components/sections/VideoTestimonial";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** The founder's reason for working only with law firms, beside the one verified client video. */
export function FounderSection() {
  return (
    <section aria-labelledby="founder-heading" className="bg-halo overflow-hidden text-ink">
      <div className="container-x section-y grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionHeading eyebrow="Founder note" title={<span id="founder-heading">{founder.heading}</span>} />
          <figure data-reveal className="mt-16">
            <blockquote className="relative font-display text-[clamp(1.35rem,2.4vw,1.9rem)] font-medium leading-[1.4] tracking-tight text-navy">
              <span aria-hidden className="absolute -left-2 -top-8 font-display text-7xl font-extrabold text-gold/60">
                “
              </span>
              {founder.quote}
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4 text-muted">
              <span aria-hidden className="h-px w-10 bg-gold" />
              {founder.attribution}
            </figcaption>
          </figure>
        </div>
        <div data-reveal className="lg:col-span-4 lg:col-start-9">
          <p className="eyebrow mb-4 text-center text-brass">A client in their own words</p>
          <VideoTestimonial youtubeId={videoTestimonial.youtubeId} title={`${videoTestimonial.client} — client testimonial video`} />
          <p className="mt-4 text-center text-sm text-muted">
            {videoTestimonial.client} · {videoTestimonial.context}
          </p>
        </div>
      </div>
    </section>
  );
}
