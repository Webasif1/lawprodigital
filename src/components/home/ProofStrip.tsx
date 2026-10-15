import Link from "next/link";
import { proof } from "@/content/home";
import { CountUp } from "@/components/motion/CountUp";
import { ArrowUpRightIcon } from "@/components/ui/icons";

/** Four verified figures, in HTML text so search engines and AI tools can read them. Each links to its story. */
export function ProofStrip() {
  return (
    <section id="results" aria-label="Results" className="scroll-mt-20 bg-surface">
      <div className="container-x pt-6 pb-6 sm:pt-10">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {proof.stats.map((s, i) => (
            <li key={s.label} data-reveal style={{ ["--reveal-i" as string]: i }}>
              <Link
                href={s.href}
                className="group flex h-full flex-col rounded-card bg-surface p-6 ring-1 ring-line transition-[box-shadow,translate] duration-(--dur-base) ease-out-expo hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(9,20,40,0.35)] sm:p-7"
              >
                <span className={`figure text-figure ${i === 0 ? "text-brass" : "text-ink"}`}>
                  <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
                </span>
                <span className="mt-4 text-[0.95rem] leading-snug text-muted">{s.label}</span>
                <ArrowUpRightIcon className="mt-auto size-4 self-end text-muted transition-colors group-hover:text-brass" />
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          {proof.note}
          <Link href="/case-study/" className="font-semibold text-navy-2 underline decoration-gold decoration-2 underline-offset-4 hover:text-brass">
            See the case studies →
          </Link>
        </p>
      </div>
    </section>
  );
}
