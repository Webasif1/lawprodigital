"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scroll-linked motion, driven by GSAP + ScrollTrigger. Sections opt in with
 * data attributes and stay Server Components:
 *
 * - `[data-timeline]` / `[data-step]`: the process rule fills and steps light up.
 * - `[data-media]`: case-study artwork opens from a slightly inset frame.
 * - `[data-grow]`: chart columns / table bars grow in once when reached.
 * - `[data-parallax="-0.08"]`: a gentle vertical drift (factor × 400px over the viewport).
 *
 * GSAP is loaded only after the page is idle and only when the visitor allows
 * motion. Everything renders in its final state without it. No pinning and no
 * scroll hijacking: every effect is scrubbed to the native scroll position.
 */
export function GsapScenes() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let revert: (() => void) | undefined;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 400));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;

    const handle = idle(
      async () => {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
          for (const timeline of gsap.utils.toArray<HTMLElement>("[data-timeline]")) {
            gsap.fromTo(
              timeline,
              { "--progress": 0 },
              { "--progress": 1, ease: "none", scrollTrigger: { trigger: timeline, start: "top 65%", end: "bottom 65%", scrub: 0.4 } },
            );
            for (const step of timeline.querySelectorAll<HTMLElement>("[data-step]")) {
              gsap.fromTo(
                step,
                { "--step-on": 0 },
                { "--step-on": 1, ease: "none", scrollTrigger: { trigger: step, start: "top 78%", end: "top 58%", scrub: 0.3 } },
              );
            }
          }

          for (const media of gsap.utils.toArray<HTMLElement>("[data-media]")) {
            gsap.fromTo(
              media,
              { clipPath: "inset(7% 5% 7% 5% round 20px)" },
              {
                clipPath: "inset(0% 0% 0% 0% round 20px)",
                ease: "none",
                scrollTrigger: { trigger: media, start: "top 95%", end: "top 50%", scrub: 0.5 },
              },
            );
          }

          // Story charts: columns and table bars grow in once, as the reader reaches them.
          for (const chart of gsap.utils.toArray<HTMLElement>("[data-grow]")) {
            const cols = chart.querySelectorAll("[data-grow-col]");
            const bars = chart.querySelectorAll("[data-grow-bar]");
            const trigger = { trigger: chart, start: "top 82%", once: true };
            if (cols.length) gsap.from(cols, { scaleY: 0, duration: 1.1, ease: "expo.out", stagger: 0.06, scrollTrigger: trigger });
            if (bars.length) gsap.from(bars, { scaleX: 0, duration: 1.1, ease: "expo.out", stagger: 0.05, scrollTrigger: trigger });
          }

          // Flow diagrams light up step by step.
          for (const flow of gsap.utils.toArray<HTMLElement>("figure:has([data-flow-step])")) {
            gsap.from(flow.querySelectorAll("[data-flow-step]"), {
              opacity: 0.25,
              y: 8,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.18,
              scrollTrigger: { trigger: flow, start: "top 80%", once: true },
            });
          }

          for (const el of gsap.utils.toArray<HTMLElement>("[data-parallax]")) {
            const factor = Number(el.dataset.parallax) || 0;
            gsap.to(el, {
              y: factor * 400,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            });
          }
        });

        // Fonts can shift section heights after first layout; recalculate trigger positions once they settle.
        document.fonts?.ready.then(() => !cancelled && ScrollTrigger.refresh());
        revert = () => ctx.revert();
      },
      { timeout: 2000 },
    );

    return () => {
      cancelled = true;
      cancelIdle(handle);
      revert?.();
    };
  }, [pathname]);

  return null;
}
