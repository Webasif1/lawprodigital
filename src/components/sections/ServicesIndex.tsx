import Link from "next/link";
import { offerings, services } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowIcon } from "@/components/ui/icons";

export function ServicesIndex() {
  return (
    <section aria-labelledby="services-heading" className="bg-paper">
      <div className="container-x py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow={services.eyebrow}
              title={<span id="services-heading">{services.heading}</span>}
              intro={services.intro}
            />
          </div>

          <ol className="border-t border-ink/15 lg:col-span-7">
            {offerings.map((o, i) => {
              const content = (
                <>
                  <span className="pt-1.5 text-sm font-bold tabular-nums text-gold-deep">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block font-display text-2xl leading-tight tracking-tight transition-colors duration-300 group-hover:text-navy sm:text-[1.9rem]">
                      {o.title}
                    </span>
                    <span className="mt-2 block max-w-md leading-relaxed text-slate">{o.text}</span>
                  </span>
                  {o.href && (
                    <span className="grid size-11 place-items-center self-center rounded-full ring-1 ring-ink/15 transition-all duration-500 ease-out-expo group-hover:bg-gold group-hover:ring-gold">
                      <ArrowIcon className="size-4 transition-transform duration-500 ease-out-expo group-hover:-rotate-45" />
                    </span>
                  )}
                </>
              );
              const rowClass =
                "relative grid grid-cols-[2.5rem_1fr_auto] gap-4 py-7 transition-transform duration-500 ease-out-expo sm:gap-6";
              return (
                <li key={o.title} data-reveal style={{ ["--reveal-i" as string]: i % 3 }} className="group relative border-b border-ink/15">
                  <span aria-hidden className="absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-navy transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
                  {o.href ? (
                    <Link href={o.href} className={`${rowClass} group-hover:translate-x-2`}>
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
