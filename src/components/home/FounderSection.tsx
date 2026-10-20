import Image from "next/image";
import { founder } from "@/content/home";
import { videoTestimonial } from "@/content/testimonials";
import { VideoTestimonial } from "@/components/sections/VideoTestimonial";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowUpRightIcon } from "@/components/ui/icons";

/**
 * The founder's reason for working only with law firms, with a name and face, beside
 * the founder's intro video (once there is one) and the verified client video.
 */
export function FounderSection() {
  const videos = [
    ...(founder.videoId
      ? [{ id: founder.videoId, cover: founder.videoCover, title: `${founder.name} — 60-second intro video`, label: "Meet the founder", note: founder.role }]
      : []),
    {
      id: videoTestimonial.youtubeId,
      cover: videoTestimonial.cover,
      title: `${videoTestimonial.client} — client testimonial video`,
      label: "A client in their own words",
      note: `${videoTestimonial.client} · ${videoTestimonial.context}`,
    },
  ];

  return (
    <section aria-labelledby="founder-heading" className="on-dark overflow-hidden bg-navy text-white">
      <div className="container-x section-y grid items-center gap-14 lg:grid-cols-12">
        <div className={videos.length > 1 ? "lg:col-span-6" : "lg:col-span-7"}>
          <SectionHeading tone="dark" eyebrow="Founder note" title={<span id="founder-heading">{founder.heading}</span>} />
          <figure data-reveal className="mt-14">
            <blockquote className="relative font-display text-[clamp(1.35rem,2.4vw,1.9rem)] font-medium leading-[1.4] tracking-tight text-white/90">
              <span aria-hidden className="absolute -left-2 -top-8 font-display text-7xl font-extrabold text-gold/40">
                “
              </span>
              {founder.quote}
            </blockquote>
            <figcaption className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4">
              {founder.photo ? (
                <Image
                  src={founder.photo.src}
                  width={founder.photo.width}
                  height={founder.photo.height}
                  alt={`${founder.name}, ${founder.role}`}
                  sizes="4rem"
                  className="size-16 rounded-full object-cover ring-2 ring-gold/60"
                />
              ) : (
                <span aria-hidden className="h-px w-10 bg-gold" />
              )}
              <span>
                <span className="block font-display text-lg font-bold text-white">{founder.name}</span>
                <span className="block text-sm text-mist">{founder.role}</span>
              </span>
              {founder.links.length > 0 && (
                <ul className="flex flex-wrap gap-2 sm:ml-auto">
                  {founder.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer me"
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-white ring-1 ring-white/25 transition-colors duration-(--dur-fast) hover:bg-white/10 hover:text-gold"
                      >
                        {l.label}
                        <ArrowUpRightIcon aria-hidden className="size-3.5" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </figcaption>
          </figure>
        </div>
        <div data-reveal className={`grid gap-8 ${videos.length > 1 ? "sm:grid-cols-2 lg:col-span-5 lg:col-start-8" : "lg:col-span-4 lg:col-start-9"}`}>
          {videos.map((v) => (
            <div key={v.id}>
              <p className="eyebrow mb-4 text-center text-gold">{v.label}</p>
              <VideoTestimonial youtubeId={v.id} cover={v.cover} title={v.title} />
              <p className="mt-4 text-center text-sm text-mist">{v.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
