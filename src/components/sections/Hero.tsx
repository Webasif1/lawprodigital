import Link from "next/link";
import { caseStudies } from "@/content/case-studies";
import { hero, specialties } from "@/content/home";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { HeroVisual } from "@/components/three/HeroVisual";
import { ArrowUpRightIcon } from "@/components/ui/icons";

export function Hero() {
  // First-screen proof: one published result, with its context, linked to the case study.
  const study = caseStudies[0];
  const stat = study.stats[0];

  return (
    <section className="grain relative overflow-hidden bg-ink text-paper">
      {/* Fine architectural grid — a nod to columns and ledgers, kept very faint. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#fff_1px,transparent_1px)] bg-size-[calc(100%/12)_100%]"
      />
      <div className="container-x relative grid items-center gap-10 pt-16 pb-20 sm:pt-20 lg:min-h-[calc(100svh-var(--header-h))] lg:grid-cols-12 lg:gap-6 lg:py-20">
        <div className="lg:col-span-7">
          {/* The eyebrow sits inside the H1 so the heading keeps the "digital marketing for law firms" keyword. */}
          <h1 className="font-display-tight text-[clamp(2.15rem,7vw,5.6rem)] font-normal">
            <span
              className="hero-fade mb-7 flex items-center gap-3 font-sans text-xs font-bold uppercase tracking-[0.24em] text-gold"
              style={{ ["--i" as string]: 0 }}
            >
              <span aria-hidden className="h-px w-10 bg-gold" />
              {hero.eyebrow}
            </span>
            {hero.headline.map((line, i) => (
              <span key={line} className="hero-line">
                <span style={{ ["--i" as string]: i }}>
                  {line}
                  {i === hero.headline.length - 1 && (
                    <>
                      {" "}
                      <em className="text-gold">{hero.emphasis}</em>
                    </>
                  )}
                </span>
              </span>
            ))}
          </h1>
          <p className="hero-settle mt-8 max-w-xl text-lg leading-relaxed text-mist sm:text-xl" style={{ ["--i" as string]: 1 }}>
            {hero.sub}
          </p>
          <div className="hero-fade mt-10 flex flex-wrap gap-3" style={{ ["--i" as string]: 2 }}>
            <ButtonLink href={site.primaryCta.href}>{site.primaryCta.label}</ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="ghost-dark">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
          <Link
            href={`/${study.slug}/`}
            className="hero-fade group mt-8 inline-flex items-baseline gap-3 text-sm text-mist"
            style={{ ["--i" as string]: 3 }}
          >
            <span className="font-display text-2xl leading-none text-paper">
              {stat.prefix}
              {stat.value}
              {stat.suffix}
            </span>
            <span>
              {stat.label.toLowerCase()} in {study.duration.toLowerCase()} · {study.client}
            </span>
            <ArrowUpRightIcon className="size-3.5 self-center text-gold transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="hero-fade relative mx-auto w-full max-w-md sm:max-w-lg lg:col-span-5 lg:max-w-none" style={{ ["--i" as string]: 1 }}>
          <HeroVisual />
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <ul className="container-x flex flex-wrap gap-x-8 gap-y-3 py-6 text-sm text-mist">
          <li className="font-semibold text-paper">Built for</li>
          {specialties.map((s) => (
            <li key={s.title} className="flex items-center gap-2">
              <span aria-hidden className="size-1.5 rounded-full bg-gold" />
              {s.title}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
