import { useId } from "react";

/**
 * Static rendition of the hero composition — the logo mark (crescent, rising
 * bars, upward arrow) reinterpreted for a dark surface. Used on mobile, with
 * reduced motion, without WebGL, and as the poster while the 3D scene loads.
 */
export function HeroMark({ className = "", decorative = false }: { className?: string; decorative?: boolean }) {
  const bars = [
    { x: 150, h: 70 },
    { x: 205, h: 120 },
    { x: 260, h: 175 },
    { x: 315, h: 235 },
  ];
  const base = 360;
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = (name: string) => `${name}-${uid}`;
  return (
    <svg
      viewBox="0 0 480 480"
      className={className}
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": "Rising bar chart inside a gold crescent — the Law Pro Digital mark" })}
    >
      <defs>
        <linearGradient id={id("hm-gold")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd35e" />
          <stop offset="1" stopColor="#c98f00" />
        </linearGradient>
        <linearGradient id={id("hm-bar")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6f3ec" />
          <stop offset="1" stopColor="#f6f3ec" stopOpacity="0.18" />
        </linearGradient>
        <radialGradient id={id("hm-glow")} cx="0.55" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f4b71a" stopOpacity="0.22" />
          <stop offset="1" stopColor="#f4b71a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="250" cy="240" r="230" fill={`url(#${id("hm-glow")})`} />
      {/* Crescent: an open arc, like the "C" of the logo, opening to the right. */}
      <path d="M392 108 A190 190 0 1 0 392 372" fill="none" stroke={`url(#${id("hm-gold")})`} strokeWidth="16" strokeLinecap="round" />
      {bars.map((b) => (
        <rect key={b.x} x={b.x} y={base - b.h} width="40" height={b.h} rx="3" fill={`url(#${id("hm-bar")})`} />
      ))}
      {/* Upward arrow sweeping over the bars. */}
      <path d="M128 268 C 210 210, 270 160, 338 92" fill="none" stroke={`url(#${id("hm-gold")})`} strokeWidth="10" strokeLinecap="round" />
      <path d="M314 86 L352 78 L346 116 Z" fill="#ffd35e" />
    </svg>
  );
}
