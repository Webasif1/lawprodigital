import type { Step } from "@/content/services";

type Props = { steps: Step[]; tone?: "dark" | "light" };

/**
 * Vertical process timeline. A gold rule fills with scroll progress and each
 * step lights up as the rule reaches it. No pinning or scroll hijacking.
 *
 * Rendered fully "on" by default (`--progress: 1`, `--step-on: 1`); the
 * scroll-linked state is applied by `GsapScenes`, so without JavaScript or
 * with reduced motion every step is simply shown complete.
 */
export function ProcessTimeline({ steps, tone = "dark" }: Props) {
  const dark = tone === "dark";

  return (
    <ol data-timeline className="relative grid gap-12 pl-14 [--progress:1] sm:pl-20">
      <span aria-hidden className={`absolute left-[1.1rem] top-2 bottom-2 w-px sm:left-6 ${dark ? "bg-white/15" : "bg-line"}`} />
      <span
        aria-hidden
        className="absolute left-[1.1rem] top-2 bottom-2 w-px origin-top bg-gold sm:left-6"
        style={{ transform: "scaleY(var(--progress))" }}
      />
      {steps.map((step, i) => (
        <li key={step.title} data-step className="relative [--step-on:1]">
          <span
            aria-hidden
            className={`figure absolute -left-14 top-0 grid size-9 place-items-center rounded-tag text-sm tabular-nums ring-1 sm:-left-20 sm:size-12 sm:text-base ${
              dark ? "bg-navy text-mist ring-white/20" : "bg-paper text-muted ring-line"
            }`}
          >
            <span
              className="absolute inset-0 grid place-items-center rounded-tag bg-gold text-ink"
              style={{ opacity: "var(--step-on)", transform: "scale(calc(0.7 + var(--step-on) * 0.3))" }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            {String(i + 1).padStart(2, "0")}
          </span>
          <p className={`eyebrow ${dark ? "text-mist" : "text-muted"}`}>Step {i + 1}</p>
          <h3 className="mt-2 font-display text-h3">{step.title}</h3>
          <p className={`mt-3 max-w-xl leading-relaxed ${dark ? "text-mist" : "text-muted"}`}>{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
