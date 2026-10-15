type Tone = "light" | "dark";

const palette = {
  light: { tile: "#0f1f3d", bars: "#ffffff", word: "text-navy", sub: "text-muted" },
  dark: { tile: "#1b3160", bars: "#ffffff", word: "text-white", sub: "text-mist" },
} as const;

/**
 * The mark: a door-like tile holding three rising bars, with a gold trend
 * arrow that breaks out of the frame ("driving clients to your door").
 */
export function LogoMark({ tone = "light", className = "" }: { tone?: Tone; className?: string }) {
  const p = palette[tone];
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={className}>
      <rect width="40" height="40" rx="11" fill={p.tile} />
      <rect x="9" y="24" width="5" height="8" rx="1.5" fill={p.bars} opacity="0.55" />
      <rect x="17.5" y="19" width="5" height="13" rx="1.5" fill={p.bars} opacity="0.8" />
      <rect x="26" y="14" width="5" height="18" rx="1.5" fill={p.bars} />
      <path d="M7.5 20.5 15 14.5l5 3.2 11.5-9.2" fill="none" stroke="#d6ad3b" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 8h6v6" fill="none" stroke="#d6ad3b" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Mark + wordmark, set in the display face so it stays crisp at any size. */
export function Logo({ tone = "light", className = "", tagline = false }: { tone?: Tone; className?: string; tagline?: boolean }) {
  const p = palette[tone];
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark tone={tone} className="size-9 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.2rem] font-extrabold tracking-[-0.03em] ${p.word}`}>
          Law Pro <span className="font-medium">Digital</span>
        </span>
        {tagline && <span className={`mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] ${p.sub}`}>Driving clients to your door</span>}
      </span>
    </span>
  );
}
