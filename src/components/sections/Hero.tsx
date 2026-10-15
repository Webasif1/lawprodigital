import { hero } from "@/content/home";
import { site } from "@/content/site";
import { publicImage } from "@/lib/assets";
import { ButtonLink } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";
import { HeroVisual } from "@/components/three/HeroVisual";

/** Drop a muted 15-second loop (under 3 MB) and its poster here and the hero uses it automatically. */
const HERO_VIDEO = "/media/hero.mp4";
const HERO_POSTER = "/media/hero-poster.jpg";

/**
 * Light hero on the aurora background. It runs up under the translucent
 * header so the gradient starts at the very top of the page.
 */
export function Hero() {
  const video = publicImage(HERO_VIDEO);
  const poster = publicImage(HERO_POSTER) ?? undefined;

  return (
    <section className="bg-aurora relative isolate -mt-(--header-h) overflow-hidden pt-(--header-h) text-ink">
      {video && (
        <div aria-hidden className="absolute inset-0 -z-10">
          <video className="size-full object-cover" src={video} poster={poster} autoPlay muted loop playsInline preload="metadata" />
          <div className="absolute inset-0 bg-white/75" />
        </div>
      )}
      <div aria-hidden className="grid-faint pointer-events-none absolute inset-0 -z-10 mask-[radial-gradient(ellipse_at_70%_40%,#000,transparent_70%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-linear-to-b from-transparent to-white" />

      <div className="container-x relative grid items-center gap-14 pt-12 pb-10 sm:pt-16 lg:min-h-[min(calc(100svh-var(--header-h)),52rem)] lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <p className="hero-fade eyebrow inline-flex items-center gap-2.5 rounded-full bg-white/80 px-3 py-1.5 text-brass shadow-[0_6px_20px_-12px_rgba(15,31,61,0.35)] ring-1 ring-line" style={{ ["--i" as string]: 0 }}>
            <span aria-hidden className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-60 motion-reduce:hidden" />
              <span className="relative size-2 rounded-full bg-signal" />
            </span>
            {hero.eyebrow}
          </p>
          <h1 className="mt-7 font-display-tight text-display text-balance text-navy">
            <span className="hero-line">
              <span>{hero.headline.join(" ")}</span>
            </span>
            <span className="hero-line">
              <span style={{ ["--i" as string]: 1 }}>
                <em className="marker text-brass">{hero.emphasis}</em>
              </span>
            </span>
          </h1>
          <p className="hero-settle mt-7 max-w-xl text-lead text-muted" style={{ ["--i" as string]: 1 }}>
            {hero.sub}
          </p>
          <div className="hero-fade mt-9 flex flex-wrap gap-3" style={{ ["--i" as string]: 2 }}>
            <ButtonLink href={site.primaryCta.href}>{site.primaryCta.label}</ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="ghost-light">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
          <ul className="hero-fade mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted" style={{ ["--i" as string]: 3 }}>
            {hero.trust.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckIcon className="size-4 text-brass" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-fade relative mx-auto w-full max-w-md sm:max-w-lg lg:col-span-5 lg:max-w-none" style={{ ["--i" as string]: 1 }}>
          {/* Soft glow behind the portal, like light falling on the scale. */}
          <div aria-hidden className="absolute left-1/2 top-1/2 -z-10 size-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(231,196,95,0.35),rgba(236,232,255,0.35)_45%,transparent_70%)] blur-2xl" />
          {/* The portal: a tall rounded frame holding the 3D scales of justice. */}
          <div className="relative mx-auto aspect-square w-[86%] overflow-hidden rounded-full bg-white/55 shadow-[0_40px_80px_-40px_rgba(15,31,61,0.45)] ring-1 ring-white backdrop-blur-sm">
            <div aria-hidden className="absolute inset-3 rounded-full ring-1 ring-line" />
            <div className="absolute inset-[9%]">
              <HeroVisual />
            </div>
          </div>
          <Sticker />
          <FloatingCards />
        </div>
      </div>
    </section>
  );
}

/** A slightly rotated gold seal on the portal's rim. */
function Sticker() {
  return (
    <div aria-hidden className="absolute right-[2%] top-[2%] grid size-24 rotate-12 place-items-center sm:size-28">
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full drop-shadow-[0_10px_20px_rgba(168,130,31,0.35)]">
        <path
          d="M50 2l7.6 9.7 12-3.2 1.6 12.3 11.6 4.5-4.6 11.5 8.8 8.7-8.8 8.7 4.6 11.5-11.6 4.5-1.6 12.3-12-3.2L50 98l-7.6-9.7-12 3.2-1.6-12.3-11.6-4.5 4.6-11.5L3 54.5l8.8-8.7-4.6-11.5 11.6-4.5 1.6-12.3 12 3.2z"
          fill="#d6ad3b"
        />
      </svg>
      <span className="relative text-center font-display leading-none text-ink">
        <span className="block text-2xl font-extrabold tracking-tight sm:text-[1.7rem]">+45%</span>
        <span className="mt-0.5 block text-[0.55rem] font-bold uppercase tracking-wider">signed clients</span>
      </span>
    </div>
  );
}

/**
 * Product-style cards around the portal: the moments the system is built
 * around (a message, a signed client, a call from Maps). Figures are from
 * the flagship case study; the chat is illustrative.
 */
function FloatingCards() {
  const bars = [79, 68, 103, 125, 89, 86, 100, 114, 116, 114];
  const max = Math.max(...bars);
  const card = "float-card absolute rounded-2xl bg-white/95 shadow-[0_24px_50px_-24px_rgba(15,31,61,0.35)] ring-1 ring-line backdrop-blur";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 text-ink">
      <div className={`${card} -left-2 -top-2 w-48 p-3 sm:-left-8 sm:w-52`} style={{ ["--float-d" as string]: "0s" }}>
        <p className="flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-wider text-muted">
          <span className="size-1.5 rounded-full bg-signal" /> New message · 11:42 pm
        </p>
        <p className="mt-2 rounded-xl rounded-tl-sm bg-paper px-3 py-2 text-[0.8rem] leading-snug">Hi, I have a question about my green card.</p>
        <p className="mt-1.5 ml-6 rounded-xl rounded-tr-sm bg-navy px-3 py-2 text-[0.8rem] leading-snug text-white">Happy to help. Which visa are you on today?</p>
        <p className="mt-1.5 text-right text-[0.6rem] text-muted">AI intake · replied in under 60s</p>
      </div>

      <div className={`${card} -bottom-4 -right-2 w-52 p-3.5 sm:-right-8 sm:w-56`} style={{ ["--float-d" as string]: "-2s" }}>
        <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted">Signed clients / month</p>
        <p className="mt-1 flex items-baseline gap-2 font-display text-2xl font-extrabold tracking-tight">
          79 <span className="text-sm text-muted">→</span> 115
        </p>
        <div className="mt-3 flex h-10 items-end gap-1">
          {bars.map((b, i) => (
            <span key={i} className={`flex-1 rounded-sm ${i >= 7 ? "bg-gold" : "bg-navy/15"}`} style={{ height: `${(b / max) * 100}%` }} />
          ))}
        </div>
      </div>

      <div className={`${card} -left-6 bottom-[4%] hidden w-40 p-3 sm:block`} style={{ ["--float-d" as string]: "-4s" }}>
        <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted">Calls from Google Maps</p>
        <p className="mt-1 font-display text-2xl font-extrabold tracking-tight">1,053</p>
        <p className="text-[0.7rem] text-muted">in seven months</p>
      </div>
    </div>
  );
}
