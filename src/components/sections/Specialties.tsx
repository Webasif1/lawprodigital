import { cities, specialties } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Specialties() {
  return (
    <section aria-labelledby="specialties-heading" className="overflow-hidden bg-paper-2">
      <div className="container-x py-24 sm:py-32">
        <SectionHeading
          eyebrow="Practice areas"
          align="split"
          title={<span id="specialties-heading">Built around your practice area</span>}
          intro="An immigration firm and an injury firm need different clients. Your plan starts there."
        />
        <ul className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-ink/12 sm:grid-cols-2 lg:grid-cols-5">
          {specialties.map((s, i) => (
            <li
              key={s.title}
              data-reveal
              style={{ ["--reveal-i" as string]: i }}
              className="group relative flex flex-col justify-between gap-8 bg-paper-2 p-7 lg:min-h-60 transition-colors duration-500 hover:bg-ink hover:text-paper"
            >
              <span className="text-sm font-bold tabular-nums text-gold-deep transition-colors group-hover:text-gold">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display text-2xl leading-tight tracking-tight">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-slate transition-colors group-hover:text-mist">{s.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-y border-ink/12 bg-paper py-10">
        <div className="container-x mb-6 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-2xl tracking-tight sm:text-3xl">Where we market law firms</h2>
          <p className="text-slate">Your clients search close to home.</p>
        </div>
        {/* Static list for assistive tech and crawlers; the marquee is decorative. */}
        <p className="sr-only">We specialize in marketing law firms in: {cities.join(", ")}.</p>
        <div aria-hidden className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
          <ul className="flex shrink-0 animate-marquee gap-12 pr-12 font-display text-5xl tracking-tight text-ink/85 motion-reduce:animate-none sm:text-7xl">
            {[...cities, ...cities].map((c, i) => (
              <li key={`${c}-${i}`} className="flex items-center gap-12 whitespace-nowrap">
                {c}
                <span className="size-3 rounded-full bg-gold" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
