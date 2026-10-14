"use client";

import { useEffect, useRef } from "react";
import type { Step } from "@/content/services";

type Props = { steps: Step[]; tone?: "dark" | "light" };

/**
 * Vertical process timeline. A gold line fills with scroll progress and each
 * step lights up as the line reaches it. No pinning or scroll hijacking.
 *
 * Implemented with a rAF-throttled scroll listener that is only attached while
 * the timeline is on screen — a few hundred bytes instead of an animation
 * library. Without JS or with reduced motion, every step renders fully active.
 */
export function ProcessTimeline({ steps, tone = "dark" }: Props) {
  const root = useRef<HTMLOListElement>(null);
  const dark = tone === "dark";

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = [...el.querySelectorAll<HTMLElement>("[data-step]")];
    let frame = 0;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const rect = el.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (vh * 0.65 - rect.top) / rect.height));
      el.style.setProperty("--progress", progress.toFixed(4));
      for (const item of items) {
        const top = item.getBoundingClientRect().top;
        item.style.setProperty("--step-on", Math.min(1, Math.max(0, (vh * 0.72 - top) / (vh * 0.2))).toFixed(3));
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        update();
      } else {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    });
    update();
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <ol ref={root} className="relative grid gap-12 pl-14 [--progress:1] sm:pl-20">
      <span aria-hidden className={`absolute left-[1.15rem] top-2 bottom-2 w-px sm:left-[1.65rem] ${dark ? "bg-white/12" : "bg-ink/12"}`} />
      <span
        aria-hidden
        className="absolute left-[1.15rem] top-2 bottom-2 w-px origin-top bg-gold sm:left-[1.65rem]"
        style={{ transform: "scaleY(var(--progress))" }}
      />
      {steps.map((step, i) => (
        <li key={step.title} data-step className="relative [--step-on:1]">
          <span
            aria-hidden
            className={`absolute -left-14 top-0 grid size-9 place-items-center rounded-full text-xs font-bold tabular-nums ring-1 sm:-left-20 sm:size-12 sm:text-sm ${
              dark ? "bg-ink ring-white/15 text-mist" : "bg-paper ring-ink/15 text-slate"
            }`}
          >
            <span
              className="absolute inset-0 grid place-items-center rounded-full bg-gold text-ink"
              style={{ opacity: "var(--step-on)", transform: "scale(calc(0.6 + var(--step-on) * 0.4))" }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            {String(i + 1).padStart(2, "0")}
          </span>
          <p className={`text-xs font-bold uppercase tracking-[0.2em] ${dark ? "text-mist" : "text-slate"}`}>Step {i + 1}</p>
          <h3 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">{step.title}</h3>
          <p className={`mt-3 max-w-xl leading-relaxed ${dark ? "text-mist" : "text-slate"}`}>{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
