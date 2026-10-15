import Link from "next/link";
import { caseStudies } from "@/content/case-studies";
import { CountUp } from "@/components/motion/CountUp";
import { ArrowUpRightIcon } from "@/components/ui/icons";

/**
 * Headline figures — every number is taken from a published case study and
 * links to it, so each claim carries its own context.
 */
export function ProofStats() {
  const items = caseStudies.slice(0, 4).map((c) => ({ stat: c.stats[0], second: c.stats[1], study: c }));

  return (
    <section aria-labelledby="proof-heading" className="border-b border-line bg-surface">
      <div className="container-x py-14 sm:py-16">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="proof-heading" data-reveal className="eyebrow text-brass">
            Results from our published case studies
          </h2>
          <Link data-reveal href="/case-study/" className="group inline-flex items-center gap-2 text-sm font-semibold text-navy">
            Read the case studies
            <ArrowUpRightIcon className="size-4 transition-transform duration-(--dur-base) ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
        <ul className="mt-8 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ stat, second, study }, i) => (
            <li
              key={study.slug}
              data-reveal
              style={{ ["--reveal-i" as string]: i }}
              className="border-b border-line sm:odd:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
            >
              <Link href={`/${study.slug}/`} className="group flex h-full flex-col py-8 sm:px-7">
                <span className="figure text-figure text-ink transition-colors duration-(--dur-fast) group-hover:text-navy">
                  <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} />
                </span>
                <span className="mt-3 font-semibold">{stat.label}</span>
                {second && (
                  <span className="mt-1 text-sm text-muted">
                    {second.prefix}
                    {second.value.toLocaleString("en-US", { minimumFractionDigits: second.decimals ?? 0 })}
                    {second.suffix} {second.label.toLowerCase()}
                  </span>
                )}
                <span className="mt-auto flex items-center justify-between gap-3 pt-8 text-sm text-muted">
                  <span>
                    {study.category} · {study.duration}
                  </span>
                  <ArrowUpRightIcon className="size-4 shrink-0 text-brass transition-transform duration-(--dur-base) ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
