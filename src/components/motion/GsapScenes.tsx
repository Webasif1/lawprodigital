"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scroll-linked motion, driven by GSAP + ScrollTrigger. Sections opt in with
 * data attributes and stay Server Components:
 *
 * - `[data-timeline]` / `[data-step]`: the process rule fills and steps light up.
 * - `[data-media]`: case-study artwork opens from a slightly inset frame.
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
