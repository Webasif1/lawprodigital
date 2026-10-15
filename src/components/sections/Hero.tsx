import { hero } from "@/content/home";
import { site } from "@/content/site";
import { publicImage } from "@/lib/assets";
import { ButtonLink } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";
import { HeroVisual } from "@/components/three/HeroVisual";

/** Drop a muted 15-second loop (under 3 MB) and its poster here and the hero uses it automatically. */
const HERO_VIDEO = "/media/hero.mp4";
const HERO_POSTER = "/media/hero-poster.jpg";

export function Hero() {
  const video = publicImage(HERO_VIDEO);
  const poster = publicImage(HERO_POSTER) ?? undefined;

  return (
    <section className="on-dark relative isolate overflow-hidden bg-navy text-white">
      {video ? (
        <div aria-hidden className="absolute inset-0 -z-10">
          <video className="size-full object-cover" src={video} poster={poster} autoPlay muted loop playsInline preload="metadata" />
          <div className="absolute inset-0 bg-navy/70" />
        </div>
      ) : (
        <>
          <div aria-hidden className="ledger-rules pointer-events-none absolute inset-0 -z-10 mask-[radial-gradient(ellipse_at_75%_35%,#000,transparent_70%)]" />
        </>
      )}

      <div className="container-x relative grid items-center gap-12 pt-12 pb-16 sm:pt-16 sm:pb-20 lg:min-h-[min(calc(100svh-var(--header-h)),50rem)] lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <p className="hero-fade eyebrow inline-flex items-center gap-2.5 rounded-full bg-white/8 px-3 py-1.5 text-gold ring-1 ring-inset ring-white/10" style={{ ["--i" as string]: 0 }}>
            <span aria-hidden className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-60 motion-reduce:hidden" />
              <span className="relative size-2 rounded-full bg-signal" />
            </span>
            {hero.eyebrow}
          </p>
          <h1 className="mt-7 font-display-tight text-display text-balance">
            <span className="hero-line">
              <span>{hero.headline.join(" ")}</span>
            </span>
            <span className="hero-line">
              <span style={{ ["--i" as string]: 1 }}>
                <em className="text-gold">{hero.emphasis}</em>
              </span>
            </span>
          </h1>
          <p className="hero-settle mt-7 max-w-xl text-lead text-white/75" style={{ ["--i" as string]: 1 }}>
            {hero.sub}
          </p>
          <div className="hero-fade mt-9 flex flex-wrap gap-3" style={{ ["--i" as string]: 2 }}>
            <ButtonLink href={site.primaryCta.href}>{site.primaryCta.label}</ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="ghost-dark">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
          <ul className="hero-fade mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70" style={{ ["--i" as string]: 3 }}>
            {hero.trust.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckIcon className="size-4 text-gold" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-fade relative mx-auto w-full max-w-md sm:max-w-lg lg:col-span-5 lg:max-w-none" style={{ ["--i" as string]: 1 }}>
          <HeroVisual />
          <FloatingCards />
        </div>
      </div>
    </section>
  );
}

/**
 * Product-style cards around the 3D mark: the three moments the system is
 * built around (a message, a signed client, a call from Maps). Figures are
 * from the flagship case study; the chat is illustrative.
 */
function FloatingCards() {
  const bars = [79, 68, 103, 125, 89, 86, 100, 114, 116, 114];
  const max = Math.max(...bars);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 text-ink">
      <div className="float-card absolute left-0 top-[6%] w-56 rounded-2xl bg-white p-3.5 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.55)] sm:-left-4" style={{ ["--float-d" as string]: "0s" }}>
        <p className="flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-wider text-muted">
          <span className="size-1.5 rounded-full bg-signal" /> New message · 11:42 pm
        </p>
        <p className="mt-2 rounded-xl rounded-tl-sm bg-paper px-3 py-2 text-[0.8rem] leading-snug">Hi, I have a question about my green card.</p>
        <p className="mt-1.5 ml-6 rounded-xl rounded-tr-sm bg-navy px-3 py-2 text-[0.8rem] leading-snug text-white">Happy to help. Which visa are you on today?</p>
        <p className="mt-1.5 text-right text-[0.6rem] text-muted">AI intake · replied in under 60s</p>
      </div>

      <div className="float-card absolute bottom-[4%] right-0 w-60 sm:left-[4%] sm:right-auto rounded-2xl bg-white p-4 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.55)]" style={{ ["--float-d" as string]: "-2s" }}>
        <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted">Signed clients / month</p>
        <p className="mt-1 flex items-baseline gap-2 font-display text-2xl font-extrabold tracking-tight">
          79 <span className="text-sm text-muted">→</span> 115 <span className="rounded-full bg-gold-wash px-2 py-0.5 text-xs font-bold text-brass">+45%</span>
        </p>
        <div className="mt-3 flex h-12 items-end gap-1">
          {bars.map((b, i) => (
            <span key={i} className={`flex-1 rounded-sm ${i >= 7 ? "bg-gold" : "bg-navy/20"}`} style={{ height: `${(b / max) * 100}%` }} />
          ))}
        </div>
      </div>

      <div className="float-card absolute right-0 top-[42%] hidden w-48 sm:block rounded-2xl bg-white p-3.5 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.55)] sm:-right-2" style={{ ["--float-d" as string]: "-4s" }}>
        <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted">Calls from Google Maps</p>
        <p className="mt-1 font-display text-2xl font-extrabold tracking-tight">1,053</p>
        <p className="text-[0.7rem] text-muted">in seven months</p>
      </div>
    </div>
  );
}
