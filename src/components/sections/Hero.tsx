import Link from "next/link";
import { hero } from "@/content/home";
import { site } from "@/content/site";
import { publicImage } from "@/lib/assets";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowIcon, CheckIcon } from "@/components/ui/icons";
import { HeroVisual } from "@/components/three/HeroVisual";

/** Drop a muted 15-second loop (under 3 MB) and its poster here and the hero uses it automatically. */
const HERO_VIDEO = "/media/hero.mp4";
const HERO_POSTER = "/media/hero-poster.jpg";

/** Small tiles that drift around the scale: the channels the system runs on. */
const orbit = [
  { label: "Messages", d: "M4 5h16v11H9l-5 4V5Z", pos: "left-[6%] top-[18%]", delay: "0s" },
  { label: "Search", d: "M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Zm5-2 4 4", pos: "right-[8%] top-[12%]", delay: "-2s" },
  { label: "Maps", d: "M12 21s-6-5.6-6-11a6 6 0 1 1 12 0c0 5.4-6 11-6 11Zm0-9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z", pos: "left-[14%] bottom-[10%]", delay: "-4s" },
  { label: "Reports", d: "M4 20h16M7 16v-4m5 4V8m5 8V5", pos: "right-[12%] bottom-[16%]", delay: "-6s" },
];

/**
 * Centred hero on the gold halo: the scales of justice as the page's icon,
 * then the promise, then a proof panel with the three moments the system is
 * built around. Runs up under the translucent header.
 */
export function Hero() {
  const video = publicImage(HERO_VIDEO);
  const poster = publicImage(HERO_POSTER) ?? undefined;

  return (
    <section className="bg-halo relative isolate -mt-(--header-h) overflow-hidden pt-(--header-h) text-ink">
      {video && (
        <div aria-hidden className="absolute inset-0 -z-10">
          <video className="size-full object-cover" src={video} poster={poster} autoPlay muted loop playsInline preload="metadata" />
          <div className="absolute inset-0 bg-white/80" />
        </div>
      )}

      <div className="container-x relative flex flex-col items-center pt-6 pb-12 text-center sm:pt-10">
        {/* The icon: scales of justice in a lit orb, on faint rings, with channel tiles drifting around it. */}
        <div className="hero-fade relative w-full max-w-xl" style={{ ["--i" as string]: 0 }}>
          <div aria-hidden className="halo-rings absolute left-1/2 top-1/2 -z-10 size-[44rem] -translate-x-1/2 -translate-y-1/2" />
          <div className="relative mx-auto size-56 sm:size-72">
            <div aria-hidden className="absolute inset-[-18%] -z-10 rounded-full bg-[radial-gradient(circle,rgba(214,173,59,0.32),rgba(214,173,59,0.1)_45%,transparent_70%)] blur-xl" />
            <div className="absolute inset-0 rounded-full bg-white/70 shadow-[0_30px_70px_-30px_rgba(15,31,61,0.35)] ring-1 ring-white" />
            <div className="absolute inset-[8%]">
              <HeroVisual />
            </div>
          </div>
          <ul aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
            {orbit.map((o) => (
              <li
                key={o.label}
                className={`float-card absolute grid size-11 place-items-center rounded-2xl bg-white text-navy shadow-[0_14px_30px_-14px_rgba(15,31,61,0.4)] ring-1 ring-line ${o.pos}`}
                style={{ ["--float-d" as string]: o.delay }}
              >
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                  <path d={o.d} />
                </svg>
              </li>
            ))}
          </ul>
        </div>

        <p className="hero-fade eyebrow mt-8 inline-flex items-center gap-2.5 rounded-full bg-white/90 px-3 py-1.5 text-brass ring-1 ring-line" style={{ ["--i" as string]: 0 }}>
          <span aria-hidden className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-gold opacity-60 motion-reduce:hidden" />
            <span className="relative size-2 rounded-full bg-gold" />
          </span>
          {hero.eyebrow}
        </p>
        <h1 className="mt-6 max-w-4xl font-display-tight text-display text-balance text-navy">
          <span className="hero-line">
            <span>{hero.headline.join(" ")}</span>
          </span>
          <span className="hero-line">
            <span style={{ ["--i" as string]: 1 }}>
              <em className="marker text-brass">{hero.emphasis}</em>
            </span>
          </span>
        </h1>
        <p className="hero-settle mt-6 max-w-[38rem] text-lead text-muted" style={{ ["--i" as string]: 1 }}>
          {hero.sub}
        </p>
        <div className="hero-fade mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-4" style={{ ["--i" as string]: 2 }}>
          <ButtonLink href={site.primaryCta.href}>{site.primaryCta.label}</ButtonLink>
          <Link href={hero.secondaryCta.href} className="group inline-flex items-center gap-2 font-semibold text-navy hover:text-brass">
            {hero.secondaryCta.label}
            <ArrowIcon className="size-4 transition-transform duration-(--dur-base) ease-out-expo group-hover:translate-x-1" />
          </Link>
        </div>
        <ul className="hero-fade mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted" style={{ ["--i" as string]: 3 }}>
          {hero.trust.map((t) => (
            <li key={t} className="flex items-center gap-2">
              <CheckIcon className="size-4 text-brass" />
              {t}
            </li>
          ))}
        </ul>

        <ProofPanel />
      </div>
    </section>
  );
}

/**
 * The reference's "product" panel: a wide grey panel with the three moments
 * the system is built around. Figures are from the flagship case study; the
 * chat is illustrative.
 */
function ProofPanel() {
  const bars = [79, 68, 103, 125, 89, 86, 100, 114, 116, 114];
  const max = Math.max(...bars);
  const card = "flex flex-col rounded-[1.5rem] bg-white p-5 text-left shadow-[0_20px_40px_-28px_rgba(15,31,61,0.35)] ring-1 ring-line";

  return (
    <div className="hero-fade mt-16 w-full rounded-[2.5rem] bg-paper p-4 ring-1 ring-line/70 sm:p-6" style={{ ["--i" as string]: 3 }}>
      <div className="grid gap-4 md:grid-cols-3">
        <div className={card}>
          <p className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-wider text-muted">
            <span className="size-1.5 rounded-full bg-signal" /> New message · 11:42 pm
          </p>
          <p className="mt-3 max-w-[85%] rounded-2xl rounded-tl-sm bg-paper px-3.5 py-2.5 text-sm leading-snug">Hi, I have a question about my green card.</p>
          <p className="mt-2 ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-navy px-3.5 py-2.5 text-sm leading-snug text-white">Happy to help. Which visa are you on today?</p>
          <p className="mt-auto pt-3 text-right text-[0.7rem] text-muted">AI intake · replied in under 60 seconds (illustrative)</p>
        </div>
        <div className={card}>
          <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted">Signed clients / month</p>
          <p className="mt-2 flex items-baseline gap-2 font-display text-3xl font-extrabold tracking-tight text-navy">
            79 <span className="text-base text-muted">→</span> 115
            <span className="rounded-full bg-gold-wash px-2 py-0.5 text-xs font-bold text-brass">+45%</span>
          </p>
          <div className="mt-auto flex h-16 items-end gap-1.5 pt-4">
            {bars.map((b, i) => (
              <span key={i} className={`flex-1 rounded-sm ${i >= 7 ? "bg-gold" : "bg-navy/15"}`} style={{ height: `${(b / max) * 100}%` }} />
            ))}
          </div>
        </div>
        <div className={card}>
          <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted">Calls from Google Maps</p>
          <p className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy">1,053</p>
          <p className="text-sm text-muted">in seven months</p>
          <Link href="/case-study/law-firm-google-business-profile-calls/" className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-navy-2 hover:text-brass">
            Read the Maps story <ArrowIcon className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
