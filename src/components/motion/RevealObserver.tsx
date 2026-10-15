"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SELECTOR = "[data-reveal]:not([data-revealed])";

/**
 * One observer for every `[data-reveal]` element on the page, so section
 * components can stay Server Components and only carry a data attribute.
 *
 * Content must never stay hidden, so:
 * - elements added after the first scan (client components, hot reload,
 *   streamed sections) are picked up by a MutationObserver;
 * - elements already above the viewport (the page opened mid-scroll or at an
 *   anchor) are revealed at once instead of waiting to be scrolled back to.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");
    const reveal = (el: Element) => el.setAttribute("data-revealed", "");

    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(SELECTOR).forEach(reveal);
      const mo = new MutationObserver(() => document.querySelectorAll(SELECTOR).forEach(reveal));
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const observeAll = (scope: ParentNode) => {
      if (scope instanceof Element && scope.matches(SELECTOR)) io.observe(scope);
      scope.querySelectorAll(SELECTOR).forEach((el) => io.observe(el));
    };
    observeAll(document);

    const mo = new MutationObserver((records) => {
      for (const record of records) record.addedNodes.forEach((node) => node instanceof Element && observeAll(node));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Belt and braces: a throttled scroll check reveals anything that has
    // reached the viewport, in case the observer is delayed or throttled.
    let timer: number | undefined;
    const sweep = () => {
      timer = undefined;
      const limit = window.innerHeight * 0.95;
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (el.getBoundingClientRect().top < limit) reveal(el);
      });
    };
    const onScroll = () => {
      if (timer === undefined) timer = window.setTimeout(sweep, 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    const initial = window.setTimeout(sweep, 1200);

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(timer);
      window.clearTimeout(initial);
    };
  }, [pathname]);

  return null;
}
