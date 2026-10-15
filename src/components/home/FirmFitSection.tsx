import Link from "next/link";
import { pricingTeaser, whoWeServe } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowUpRightIcon } from "@/components/ui/icons";

/** Who we work with, then what it costs: the two questions a partner asks before booking a call. */
export function FirmFitSection() {
  return (
    <section aria-labelledby="fit-heading" className="bg-paper">
      <div className="container-x section-y">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading eyebrow="Who we work with" title={<span id="fit-heading">{whoWeServe.heading}</span>} />
            <p data-reveal className="mt-6 max-w-xl text-lead text-muted">
              {whoWeServe.body}
            </p>
          </div>
          <div data-reveal className="self-end lg:col-span-6">
            <p className="eyebrow text-muted">Immigration case types</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {whoWeServe.caseTypes.map((c) => (
                <li key={c} className="rounded-full bg-navy px-4 py-2 font-display text-sm font-semibold text-white">
                  {c}
                </li>
              ))}
            </ul>
            <p className="eyebrow mt-8 text-muted">Also</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {whoWeServe.also.map((c) => (
                <li key={c} className="rounded-full bg-surface px-4 py-2 font-display text-sm font-semibold ring-1 ring-line">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-24 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-12">
          <h2 className="font-display-tight text-h2">Packages</h2>
          <Link href="/pricing/" className="inline-flex items-center gap-2 font-semibold text-navy-2 hover:text-brass">
            Compare packages <ArrowUpRightIcon className="size-4" />
          </Link>
        </div>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {pricingTeaser.map((p, i) => {
            const featured = i === 1;
            return (
              <li
                key={p.name}
                data-reveal
                style={{ ["--reveal-i" as string]: i }}
                className={`flex flex-col rounded-card p-7 ${featured ? "on-dark bg-navy text-white" : "bg-surface ring-1 ring-line"}`}
              >
                <h3 className="font-display text-xl font-bold tracking-tight">{p.name}</h3>
                <p className="mt-6 flex items-baseline gap-2">
                  <span className={`figure text-4xl ${featured ? "text-gold" : "text-ink"}`}>{p.price}</span>
                  {p.note && <span className={`text-sm ${featured ? "text-mist" : "text-muted"}`}>{p.note}</span>}
                </p>
                <p className={`mt-5 leading-relaxed ${featured ? "text-mist" : "text-muted"}`}>{p.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
