import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@/content/case-studies";
import { caseStudyImage } from "@/lib/assets";
import { ArrowIcon } from "@/components/ui/icons";

type Props = { study: CaseStudy; index: number; headingLevel?: "h2" | "h3" };

/** Large editorial case-study card. Leads with the original screenshot when present, otherwise with the verified numbers. */
export function CaseStudyCard({ study, index, headingLevel: H = "h3" }: Props) {
  const image = study.cardImage ? caseStudyImage(study.cardImage.file) : null;
  const [lead, ...rest] = study.stats;
  const flip = index % 2 === 1;

  return (
    <article data-reveal className="group relative grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
      <div className={`relative overflow-hidden rounded-[1.75rem] bg-ink lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
        <div className="relative aspect-[16/11]">
          {image && study.cardImage ? (
            <Image
              src={image}
              alt={study.cardImage.alt}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.04]"
            />
          ) : (
            <div className="grain absolute inset-0 flex flex-col justify-between p-7 text-paper sm:p-10">
              <div aria-hidden className="absolute -right-20 -top-28 size-52 rounded-full border-[10px] sm:-right-24 sm:-top-24 sm:size-80 sm:border-[14px] border-gold/80 transition-transform duration-[1.2s] ease-out-expo group-hover:-translate-x-6 group-hover:translate-y-6" />
              <div aria-hidden className="absolute bottom-0 right-8 flex items-end gap-3 sm:right-12">
                {[28, 46, 64, 86].map((h) => (
                  <span
                    key={h}
                    className="w-6 origin-bottom rounded-t-sm bg-paper/12 transition-transform duration-700 ease-out-expo group-hover:scale-y-110 sm:w-9"
                    style={{ height: `${h * 1.6}px` }}
                  />
                ))}
              </div>
              <p className="relative text-xs font-bold uppercase tracking-[0.22em] text-gold">
                {study.category} · {study.duration}
              </p>
              <p className="relative">
                <span className="block font-display text-[clamp(4rem,11vw,8.5rem)] leading-[0.9] tracking-tight">
                  {lead.prefix}
                  {lead.value.toLocaleString("en-US", { minimumFractionDigits: lead.decimals ?? 0 })}
                  {lead.suffix}
                </span>
                <span className="mt-3 block text-lg text-mist">{lead.label}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold-deep">
          Case study {String(index + 1).padStart(2, "0")} · {study.client}
        </p>
        <H className="mt-4 font-display text-[clamp(1.75rem,3vw,2.6rem)] leading-[1.08] tracking-tight text-balance">
          <Link href={`/${study.slug}/`} className="after:absolute after:inset-0 after:content-['']">
            {study.title}
          </Link>
        </H>
        <p className="mt-5 leading-relaxed text-slate">{study.summary}</p>
        <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-ink/12 pt-6">
          {rest.map((s) => (
            <div key={s.label}>
              <dt className="text-sm text-slate">{s.label}</dt>
              <dd className="mt-1 font-display text-3xl tracking-tight">
                {s.prefix}
                {s.value.toLocaleString("en-US", { minimumFractionDigits: s.decimals ?? 0 })}
                {s.suffix}
              </dd>
            </div>
          ))}
        </dl>
        <span className="mt-8 inline-flex items-center gap-3 font-semibold">
          Read the case study
          <span className="grid size-10 place-items-center rounded-full bg-ink text-paper transition-colors duration-300 group-hover:bg-gold group-hover:text-ink">
            <ArrowIcon className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5" />
          </span>
        </span>
      </div>
    </article>
  );
}
