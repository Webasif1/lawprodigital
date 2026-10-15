import Link from "next/link";
import { offerings, services } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowIcon } from "@/components/ui/icons";

export function ServicesIndex() {
  return (
    <section aria-labelledby="services-heading" className="bg-paper">
      <div className="container-x section-y">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
            <SectionHeading eyebrow={services.eyebrow} index={1} title={<span id="services-heading">{services.heading}</span>} intro={services.intro} />
          </div>

          {/* An index, not a card grid: numbered rows that open into a highlighted state on hover and focus. */}
          <ol className="border-t border-ink lg:col-span-8">
            {offerings.map((o, i) => {
              const content = (
                <>
                  <span className="figure pt-1 text-lg tabular-nums text-muted transition-colors duration-(--dur-fast) group-hover:text-brass group-focus-within:text-brass">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-display text-h3 transition-colors duration-(--dur-fast) group-hover:text-navy">{o.title}</span>
                    <span className="mt-2 block max-w-lg leading-relaxed text-muted">{o.text}</span>
                  </span>
                  {o.href && (
                    <span className="grid size-11 place-items-center self-center rounded-tag ring-1 ring-line transition-[background-color,box-shadow,color] duration-(--dur-base) ease-out-expo group-hover:bg-navy group-hover:text-paper group-hover:ring-navy">
                      <ArrowIcon className="size-4 transition-transform duration-(--dur-base) ease-out-expo group-hover:translate-x-0.5" />
                    </span>
                  )}
                </>
              );
              const rowClass = "relative grid grid-cols-[2.75rem_1fr_auto] gap-4 py-7 transition-transform duration-(--dur-base) ease-out-expo sm:gap-6";
              return (
                <li
                  key={o.title}
                  data-reveal
                  style={{ ["--reveal-i" as string]: i % 3 }}
                  className="group relative border-b border-line transition-colors duration-(--dur-base) hover:bg-surface focus-within:bg-surface"
                >
                  {/* Hairline that draws across the row on hover. */}
                  <span
                    aria-hidden
                    className="absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-navy transition-transform duration-(--dur-slow) ease-out-expo group-hover:scale-x-100"
                  />
                  {o.href ? (
                    <Link href={o.href} className={`${rowClass} sm:group-hover:translate-x-4 sm:pr-4`}>
                      {content}
                    </Link>
                  ) : (
                    <div className={rowClass}>{content}</div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
