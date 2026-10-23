"use client";

import { useEffect, useState } from "react";

type Props = { chapters: { id: string; title: string }[]; bodyId: string };

/**
 * The reader's place in the story: a thin progress line under the header and
 * a sticky chapter list that follows along. Pure navigation: it never moves
 * the page on its own.
 */
export function ChapterRail({ chapters, bodyId }: Props) {
  const [active, setActive] = useState(chapters[0]?.id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const body = document.getElementById(bodyId);
    if (!body) return;

    const onScroll = () => {
      const rect = body.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.5;
      setProgress(Math.min(1, Math.max(0, (-rect.top + window.innerHeight * 0.3) / Math.max(1, total))));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sections = chapters.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-25% 0px -60% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, [chapters, bodyId]);

  return (
    <>
      <div aria-hidden className="fixed inset-x-0 top-16 z-40 h-0.5 bg-transparent">
        <div className="h-full origin-left bg-gold" style={{ transform: `scaleX(${progress})` }} />
      </div>
      <nav aria-label="Chapters" className="sticky top-28 hidden lg:block">
        <p className="eyebrow text-muted">In this story</p>
        <ol className="mt-5 grid gap-1 border-l border-line">
          {chapters.map((c, i) => {
            const on = c.id === active;
            return (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  aria-current={on ? "location" : undefined}
                  className={`-ml-px flex gap-3 border-l-2 py-2 pl-4 text-sm leading-snug transition-colors duration-(--dur-base) ${
                    on ? "border-gold font-semibold text-ink" : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  <span className="tabular-nums font-normal text-muted">{String(i + 1).padStart(2, "0")}</span>
                  {c.title}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
