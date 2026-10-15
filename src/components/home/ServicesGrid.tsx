import Link from "next/link";
import { offerings, services } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowUpRightIcon } from "@/components/ui/icons";

/**
 * Eight services in a two-tone grid: the two the system is built on (Meta Ads
 * and the AI intake assistant) are set on navy so the eye lands there first.
 */
export function ServicesGrid() {
  return (
    <section aria-labelledby="services-heading" className="bg-paper">
      <div className="container-x section-y">
        <SectionHeading eyebrow="Services" title={<span id="services-heading">{services.heading}</span>} />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {offerings.map((o, i) => {
            const dark = i === 0 || i === 4;
            return (
              <li key={o.title} data-reveal style={{ ["--reveal-i" as string]: i % 4 }}>
                <Link
                  href={o.href}
                  className={`group relative flex h-full min-h-60 flex-col overflow-hidden rounded-card p-6 transition-[translate,box-shadow] duration-(--dur-base) ease-out-expo hover:-translate-y-1 ${
                    dark ? "on-dark bg-navy text-white" : "bg-surface ring-1 ring-line hover:shadow-[0_24px_50px_-28px_rgba(9,20,40,0.35)]"
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span className={`eyebrow rounded-full px-2.5 py-1 ${dark ? "bg-white/10 text-gold" : "bg-gold-wash text-brass"}`}>{o.tag}</span>
                    <span
                      className={`grid size-9 place-items-center rounded-full transition-[background-color,color,rotate] duration-(--dur-base) ease-out-expo group-hover:rotate-45 ${
                        dark ? "bg-gold text-ink" : "bg-paper text-ink group-hover:bg-navy group-hover:text-white"
                      }`}
                    >
                      <ArrowUpRightIcon className="size-4" />
                    </span>
                  </span>
                  <span className="mt-auto pt-10">
                    <span className="block font-display text-xl font-bold leading-snug tracking-tight">{o.title}</span>
                    <span className={`mt-2 block text-[0.95rem] leading-relaxed ${dark ? "text-mist" : "text-muted"}`}>{o.text}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
