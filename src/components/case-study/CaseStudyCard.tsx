import Image from "next/image";
import Link from "next/link";
import type { CaseStudy, Stat } from "@/content/case-studies";
import { caseStudyImage } from "@/lib/assets";
import { ArrowIcon } from "@/components/ui/icons";

type Props = { study: CaseStudy; index: number; headingLevel?: "h2" | "h3" };

const fmt = (s: Stat) => `${s.prefix ?? ""}${s.value.toLocaleString("en-US", { minimumFractionDigits: s.decimals ?? 0 })}${s.suffix ?? ""}`;

/**
 * Large editorial case-study card. Leads with the original screenshot when
 * present; otherwise with one of three typographic compositions built from the
 * study's published figures, so neighbouring cards never look alike.
 */
export function CaseStudyCard({ study, index, headingLevel: H = "h3" }: Props) {
  const image = study.cardImage ? caseStudyImage(study.cardImage.file) : null;
  const [lead, ...rest] = study.stats;
  const flip = index % 2 === 1;
  // With a screenshot every figure is listed; with a composition the lead figure is already the artwork.
  const listed = image ? study.stats : rest;

  return (
    <article data-reveal className="group relative grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-14">
      <div data-media className={`relative overflow-hidden rounded-card lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
        <div className="relative aspect-[16/11]">
          {image && study.cardImage ? (
            <Image
              src={image}
              alt={study.cardImage.alt}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.03]"
            />
          ) : (
            <Composition study={study} variant={index % 3} />
          )}
        </div>
      </div>

      <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
        <p className="eyebrow flex flex-wrap gap-x-3 text-brass">
          <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span>
          <span>{study.category}</span>
          <span className="text-muted">{study.client}</span>
        </p>
        <H className="mt-4 font-display text-[clamp(1.6rem,2.6vw,2.3rem)] leading-[1.1] tracking-[-0.02em] text-balance">
          <Link href={`/${study.slug}/`} className="after:absolute after:inset-0 after:content-['']">
            {study.title}
          </Link>
        </H>
        <p className="mt-5 leading-relaxed text-muted">{study.summary}</p>
        <dl className={`mt-8 grid gap-6 border-t border-line pt-6 ${listed.length > 2 ? "grid-cols-3" : "grid-cols-2"}`}>
          {!image && (
            <div className="sr-only">
              <dt>{lead.label}</dt>
              <dd>{fmt(lead)}</dd>
            </div>
          )}
          {listed.map((s) => (
            <div key={s.label}>
              <dt className="text-sm text-muted">{s.label}</dt>
              <dd className="figure mt-1 text-3xl tracking-tight">{fmt(s)}</dd>
            </div>
          ))}
        </dl>
        <span className="mt-8 inline-flex items-center gap-2 font-semibold text-navy">
          Read the case study
          <ArrowIcon className="size-4 transition-transform duration-(--dur-base) ease-out-expo group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}

/** Data-driven artwork used while a study has no screenshot. Purely decorative: the same figures are in the text. */
function Composition({ study, variant }: { study: CaseStudy; variant: number }) {
  const [lead] = study.stats;
  const spend = study.stats.find((s) => /spend/i.test(s.label));

  // 1 — Spend to result: what went in, what came out, on a ruled line.
  if (variant === 1 && spend && spend !== lead) {
    return (
      <div aria-hidden className="absolute inset-0 flex flex-col justify-between bg-wash p-7 text-ink sm:p-10">
        <p className="eyebrow text-brass">
          {study.category} · {study.duration}
        </p>
        <div className="grid gap-6">
          <div className="flex items-baseline justify-between gap-4 border-b border-ink/15 pb-4">
            <span className="text-sm text-muted">{spend.label}</span>
            <span className="figure text-[clamp(1.75rem,3.5vw,2.75rem)] leading-none tracking-tight">{fmt(spend)}</span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <span className="max-w-[12ch] text-sm text-muted">{lead.label}</span>
            <span className="figure text-[clamp(4.5rem,12vw,9.5rem)] leading-[0.85] tracking-[-0.04em] text-navy transition-transform duration-(--dur-slow) ease-out-expo group-hover:-translate-y-1">
              {fmt(lead)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2 — Ledger: every figure on its own ruled row, like a statement.
  if (variant === 2) {
    return (
      <div aria-hidden className="absolute inset-0 flex flex-col justify-between bg-surface p-7 ring-1 ring-inset ring-line sm:p-10">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-brass">Statement of results</p>
          <p className="eyebrow text-muted">{study.duration}</p>
        </div>
        <dl className="grid">
          {study.stats.map((s, i) => (
            <div key={s.label} className="flex items-baseline gap-4 border-t border-line py-3 sm:py-4">
              <dt className="text-sm text-muted">{s.label}</dt>
              <span className="mb-1 flex-1 border-b border-dotted border-ink/25" />
              <dd className={`figure leading-none tracking-tight ${i === 0 ? "text-[clamp(2.5rem,5vw,3.75rem)] text-navy" : "text-[clamp(1.5rem,2.6vw,2rem)]"}`}>{fmt(s)}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  // 0 — Figure: the headline number, oversized on navy over ledger rules.
  return (
    <div aria-hidden className="on-dark absolute inset-0 flex flex-col justify-between overflow-hidden bg-navy p-7 text-paper sm:p-10">
      <div className="ledger-rules absolute inset-0" />
      <span className="absolute -right-4 top-1/2 h-px w-2/5 bg-gold/70 transition-[width] duration-(--dur-slow) ease-out-expo group-hover:w-1/2" />
      <p className="eyebrow relative text-gold">
        {study.category} · {study.duration}
      </p>
      <p className="relative">
        <span className="figure block text-[clamp(4.5rem,13vw,10rem)] leading-[0.85] tracking-[-0.045em]">{fmt(lead)}</span>
        <span className="mt-4 block text-lg text-mist">{lead.label}</span>
      </p>
    </div>
  );
}
