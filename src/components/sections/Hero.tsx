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
    <section className="on-dark relative overflow-hidden bg-navy text-paper">
      {/* Faint ruled lines, like a ledger page. Masked so they fade out toward the edges. */}
      <div aria-hidden className="ledger-rules pointer-events-none absolute inset-0 mask-[radial-gradient(ellipse_at_70%_40%,#000,transparent_75%)]" />
      <div className="container-x relative grid items-center gap-10 pt-14 pb-16 sm:pt-20 sm:pb-20 lg:min-h-[min(calc(100svh-var(--header-h)-4.5rem),52rem)] lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-7">
          {/* The eyebrow sits inside the H1 so the heading keeps the "digital marketing for law firms" keyword. */}
          <h1 className="font-display-tight text-display">
            <span className="hero-fade eyebrow mb-8 flex items-center gap-3 font-sans text-gold" style={{ ["--i" as string]: 0 }}>
              <span aria-hidden className="h-px w-8 bg-gold/70" />
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
          <p className="hero-settle mt-8 max-w-xl text-lead text-mist" style={{ ["--i" as string]: 1 }}>
            {hero.sub}
          </p>
          <div className="hero-fade mt-10 flex flex-wrap gap-3" style={{ ["--i" as string]: 2 }}>
            <ButtonLink href={site.primaryCta.href}>{site.primaryCta.label}</ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="ghost-dark" arrow={false}>
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
          <Link
            href={`/${study.slug}/`}
            className="hero-fade group mt-12 flex max-w-md items-center gap-5 border-t border-white/15 pt-6"
            style={{ ["--i" as string]: 3 }}
          >
            <span data-parallax="-0.08" className="figure text-5xl leading-none tracking-tight text-gold">
              {stat.prefix}
              {stat.value}
              {stat.suffix}
            </span>
            <span className="text-sm leading-snug text-mist">
              <span className="block font-semibold text-paper">{stat.label}</span>
              {study.client} · {study.duration.toLowerCase()}
            </span>
            <ArrowUpRightIcon className="ml-auto size-4 shrink-0 text-gold transition-transform duration-(--dur-base) ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="hero-fade relative mx-auto w-full max-w-sm sm:max-w-md lg:col-span-5 lg:max-w-none" style={{ ["--i" as string]: 1 }}>
          <HeroVisual />
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <ul className="container-x flex flex-wrap items-center gap-x-7 gap-y-2 py-5 text-sm text-mist">
          <li className="eyebrow text-paper">Built for</li>
          {specialties.map((s) => (
            <li key={s.title}>{s.title}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
