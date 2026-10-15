import { cities, specialties, whyUs } from "@/content/home";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Who we work for (practice areas, cities) and why that focus matters. One idea: we only do law firms. */
export function WhoWeServe({ index }: { index?: number }) {
  return (
    <section aria-labelledby="serve-heading" className="bg-wash">
      <div className="container-x section-y">
        <SectionHeading
          eyebrow={whyUs.eyebrow}
          index={index}
          align="split"
          title={<span id="serve-heading">{whyUs.heading}</span>}
          intro={whyUs.body}
        />

        <h3 className="sr-only">Practice areas</h3>
        <ul className="mt-16 grid border-t border-ink sm:grid-cols-2 lg:grid-cols-5">
          {specialties.map((s, i) => (
            <li
              key={s.title}
              data-reveal
              style={{ ["--reveal-i" as string]: i }}
              className="flex flex-col gap-8 border-b border-line py-7 sm:px-6 sm:odd:border-r lg:border-r lg:border-b-0 lg:pb-10 lg:last:border-r-0 lg:first:pl-0"
            >
              <span className="figure text-lg tabular-nums text-brass">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-display text-2xl leading-tight tracking-[-0.015em]">{s.title}</p>
                <p className="mt-2 leading-relaxed text-muted">{s.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-20 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h3 data-reveal className="eyebrow text-brass">
              What you get
            </h3>
            <ul className="mt-6 grid border-t border-line">
              {whyUs.points.map((p, i) => (
                <li key={p} data-reveal style={{ ["--reveal-i" as string]: i }} className="flex gap-4 border-b border-line py-5 text-lg leading-snug">
                  <span aria-hidden className="mt-2.5 h-0.5 w-5 shrink-0 bg-gold" />
                  {p}
                </li>
              ))}
            </ul>
            <div data-reveal className="mt-10">
              <ButtonLink href={site.primaryCta.href} variant="ink">
                {site.primaryCta.label}
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <h3 data-reveal className="eyebrow text-brass">
              Cities we market law firms in
            </h3>
            <ul className="mt-6 grid grid-cols-2 border-t border-line">
              {cities.map((c, i) => (
                <li key={c} data-reveal style={{ ["--reveal-i" as string]: i % 4 }} className="border-b border-line py-3.5 font-display text-xl tracking-[-0.01em]">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
