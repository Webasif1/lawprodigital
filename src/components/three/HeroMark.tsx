import { useId } from "react";

/** Bars of the logo mark, in the 480×480 artboard: left edge x, height above the baseline. */
const BARS = [
  { x: 150, h: 70 },
  { x: 205, h: 120 },
  { x: 260, h: 175 },
  { x: 315, h: 235 },
];
const BASE = 360;
const BAR_W = 40;

/**
 * Static rendition of the hero composition — the logo mark (crescent, rising
 * bars, upward arrow) drawn as a "ledger constellation": dotted columns, a
 * dotted arc and one gold trend line. Used on mobile, with reduced motion,
 * without WebGL, and as the poster while the 3D scene loads.
 */
export function HeroMark({ className = "", decorative = false }: { className?: string; decorative?: boolean }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const dots = `hm-dots-${uid}`;
  const tops = BARS.map((b) => ({ x: b.x + BAR_W / 2, y: BASE - b.h }));
  const trend = [{ x: 118, y: 318 }, ...tops, { x: 372, y: 88 }];

  return (
    <svg
      viewBox="0 0 480 480"
      className={className}
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": "Rising bar chart inside a gold crescent — the Law Pro Digital mark" })}
    >
      <defs>
        <pattern id={dots} width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="1.7" fill="#ffffff" />
        </pattern>
      </defs>

      {/* Baseline: a dotted floor. */}
      <line x1="96" y1={BASE + 14} x2="400" y2={BASE + 14} stroke="#ffffff" strokeOpacity="0.28" strokeWidth="2" strokeDasharray="0 10" strokeLinecap="round" />

      {/* Crescent: an open arc of points, like the "C" of the logo, opening to the right. */}
      <path d="M392 108 A190 190 0 1 0 392 372" fill="none" stroke="#d6ad3b" strokeWidth="5" strokeDasharray="0 13" strokeLinecap="round" />

      {BARS.map((b) => (
        <rect key={b.x} x={b.x} y={BASE - b.h} width={BAR_W} height={b.h} fill={`url(#${dots})`} opacity="0.9" />
      ))}

      {/* Trend line through the top of each bar, ending in an arrow. */}
      <polyline points={trend.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#d6ad3b" strokeWidth="2" strokeLinejoin="round" />
      {tops.map((p) => (
        <circle key={p.x} cx={p.x} cy={p.y} r="5" fill="#0f1f3d" stroke="#d6ad3b" strokeWidth="2" />
      ))}
      <path d="M382 78 L376.3 95.1 L364.9 83.7 Z" fill="#d6ad3b" />
    </svg>
  );
}
