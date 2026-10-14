import Link from "next/link";
import { caseStudies } from "@/content/case-studies";
import { CountUp } from "@/components/motion/CountUp";
import { ArrowUpRightIcon } from "@/components/ui/icons";

/**
 * Headline figures — every number is taken from a published case study and
 * links to it, so each claim carries its own context.
 */
export function ProofStats() {
  const items = caseStudies.map((c) => ({ stat: c.stats[0], second: c.stats[1], study: c }));

  return (
    <section aria-labelledby="proof-heading" className="border-b border-ink/10 bg-paper">
      <div className="container-x py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="proof-heading" data-reveal className="max-w-md text-sm font-bold uppercase tracking-[0.22em] text-gold-deep">
            Numbers from our published case studies
          </h2>
          <Link data-reveal href="/case-study/" className="group inline-flex items-center gap-2 text-sm font-semibold text-ink">
            Read the case studies
            <ArrowUpRightIcon className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
        <ul className="mt-10 grid gap-px overflow-hidden rounded-3xl bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ stat, second, study }, i) => (
            <li key={study.slug} data-reveal style={{ ["--reveal-i" as string]: i }} className="bg-paper">
              <Link href={`/${study.slug}/`} className="group flex h-full flex-col p-7 transition-colors duration-300 hover:bg-paper-2 sm:p-8">
                <span className="font-display text-[clamp(2.75rem,5vw,4rem)] leading-none tracking-tight text-ink">
                  <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} />
                </span>
                <span className="mt-3 font-semibold">{stat.label}</span>
                {second && (
                  <span className="mt-1 text-sm text-slate">
                    {second.prefix}
                    {second.value.toLocaleString("en-US", { minimumFractionDigits: second.decimals ?? 0 })}
                    {second.suffix} {second.label.toLowerCase()}
                  </span>
                )}
                <span className="mt-auto flex items-start justify-between gap-3 pt-8 text-sm leading-snug text-slate">
                  <span>
                    {study.category} · {study.duration}
                  </span>
                  <ArrowUpRightIcon className="size-4 shrink-0 text-gold-deep transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
