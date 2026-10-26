type Tone = "light" | "dark";

const palette = {
  light: { gold: "#d6ad3b", ink: "#0f1f3d", lead: "text-brass", word: "text-navy", sub: "text-muted" },
  dark: { gold: "#d6ad3b", ink: "#ffffff", lead: "text-gold", word: "text-white", sub: "text-mist" },
} as const;

/** Geometry shared with src/app/icon.svg and public/brand/logo-mark.svg. */
export const markPaths = {
  crescent: "M81 25.2A40.4 40.4 0 1 0 81 76.6A36.6 36.6 0 1 1 81 25.2Z",
  bars: "M22 61H29.6V75.01A34.8 34.8 0 0 1 22 62.98ZM33.6 53H41.2V82.92A34.8 34.8 0 0 1 33.6 78.55ZM45.6 44.5H53.2V85.57A34.8 34.8 0 0 1 45.6 84.42ZM57.6 35.5H65.2V83.95A34.8 34.8 0 0 1 57.6 85.47ZM49.4 20 56.8 27.6H53.2V36.4H45.6V27.6H42Z",
  swoosh: "M19 59.5Q40 34 88 25.6Q45 36 19 59.5Z",
  scale: "M78.8 31.6 69.4 50.6M78.8 31.6 88.2 50.6M78.8 31.6V50.6",
  pan: "M68 50.2H89.6A10.8 9 0 0 1 68 50.2Z",
} as const;

/**
 * The mark: a gold crescent holding rising bars and an arrow that breaks
 * through the trend line, with the scales of justice at its open edge.
 */
export function LogoMark({ tone = "light", className = "" }: { tone?: Tone; className?: string }) {
  const p = palette[tone];
  return (
    <svg viewBox="8 10 84 84" aria-hidden className={className}>
      <path d={markPaths.crescent} fill={p.gold} />
      <path d={markPaths.bars} fill={p.ink} />
      <path d={markPaths.swoosh} fill={p.ink} />
      <circle cx="78.8" cy="30" r="2.9" fill={p.gold} />
      <path d={markPaths.scale} stroke={p.gold} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d={markPaths.pan} fill={p.gold} />
    </svg>
  );
}

/** Mark + wordmark, set in the display face so it stays crisp at any size. */
export function Logo({ tone = "light", className = "", tagline = false }: { tone?: Tone; className?: string; tagline?: boolean }) {
  const p = palette[tone];
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark tone={tone} className="size-10 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.15rem] font-extrabold uppercase tracking-[-0.01em] ${p.word}`}>
          <span className={p.lead}>Law Pro</span> Digital
        </span>
        {tagline && <span className={`mt-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] ${p.sub}`}>Driving clients to your door</span>}
      </span>
    </span>
  );
}
