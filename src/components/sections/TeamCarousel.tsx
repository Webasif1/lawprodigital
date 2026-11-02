"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { TeamMember } from "@/content/team";
import { ArrowIcon, ArrowUpRightIcon } from "@/components/ui/icons";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => w.toLowerCase() !== "md")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/** Lists this short sit centred in colour, with no carousel controls. */
const STATIC_MAX = 3;

/**
 * Portrait cards on a native scroll-snap track. The card in the centre is in full colour
 * and full size; the rest are greyscale and slightly smaller. Swipe, arrow keys or the
 * prev/next buttons move between them.
 */
export function TeamCarousel({ members }: { members: TeamMember[] }) {
  const isStatic = members.length <= STATIC_MAX;
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (isStatic || !track) return;
    // A card is active once it crosses the middle tenth of the track.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
      },
      { root: track, rootMargin: "0px -45% 0px -45%" },
    );
    for (const li of track.children) io.observe(li);
    return () => io.disconnect();
  }, [isStatic, members.length]);

  const go = (i: number) => {
    const track = trackRef.current;
    const card = track?.children[i] as HTMLElement | undefined;
    if (!track || !card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Rounded and clamped: a half-pixel past the end makes the snap pull back a card.
    const left = Math.min(Math.round(card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2), track.scrollWidth - track.clientWidth);
    track.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="mt-14 [--card:15rem] sm:[--card:16rem] lg:[--card:17rem]">
      <ul
        ref={trackRef}
        tabIndex={isStatic ? undefined : 0}
        aria-label={isStatic ? undefined : "Team members, scroll sideways for more"}
        className={
          isStatic
            ? "flex flex-wrap justify-center gap-6 sm:gap-8"
            : "relative flex snap-x snap-mandatory gap-4 overflow-x-auto px-[calc(50%-var(--card)/2)] pt-2 pb-4 [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden"
        }
      >
        {members.map((m, i) => {
          const on = isStatic || i === active;
          return (
            <li
              key={`${m.name}-${m.role}`}
              data-index={i}
              data-reveal
              style={{ ["--reveal-i" as string]: i }}
              className="w-(--card) shrink-0 snap-center"
            >
              <div
                className={`group origin-bottom transition-[transform,opacity] duration-(--dur-base) ease-(--ease-out-expo) motion-reduce:transition-none ${
                  on ? "scale-100" : "scale-[0.88] opacity-80 hover:opacity-100"
                }`}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-navy shadow-[0_24px_48px_-28px_rgb(10_22_40/0.55)] ring-1 ring-ink/10">
                  {m.photo ? (
                    <Image
                      src={m.photo.src}
                      width={m.photo.width}
                      height={m.photo.height}
                      alt={`${m.name}, ${m.role}`}
                      sizes="(min-width: 1024px) 17rem, (min-width: 640px) 16rem, 15rem"
                      className={`size-full object-cover object-top transition-[filter] duration-(--dur-base) motion-reduce:transition-none ${
                        on ? "grayscale-0" : "grayscale group-hover:grayscale-0 group-focus-within:grayscale-0"
                      }`}
                    />
                  ) : (
                    <span aria-hidden className="grid size-full place-items-center font-display text-5xl font-bold text-gold">
                      {initials(m.name)}
                    </span>
                  )}
                  {m.links.length > 0 && (
                    <ul
                      className={`absolute inset-x-3 bottom-3 flex flex-wrap justify-center gap-2 transition-opacity duration-(--dur-fast) [@media(hover:none)]:opacity-100 ${
                        on ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                      }`}
                    >
                      {m.links.map((l) => (
                        <li key={l.href}>
                          <a
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white/90 px-4 text-sm font-semibold text-ink shadow-sm backdrop-blur transition-colors duration-(--dur-fast) hover:bg-white hover:text-navy-2"
                          >
                            {l.label}
                            <ArrowUpRightIcon aria-hidden className="size-3.5" />
                            <span className="sr-only"> profile of {m.name} (opens in a new tab)</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <h3 className="font-display text-lg font-bold leading-snug text-ink">{m.name}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-brass">{m.role}</p>
                  {/* Opacity only: a layout change mid-scroll makes the browser re-snap and cancel it. */}
                  {m.bio && (
                    <p className={`mt-2 text-sm text-muted transition-opacity duration-(--dur-base) ${on ? "opacity-100" : "opacity-0"}`}>{m.bio}</p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {!isStatic && (
        <div className="mx-auto mt-8 flex max-w-md items-center gap-5">
          <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-ink transition-[width] duration-(--dur-base) ease-(--ease-out-expo) motion-reduce:transition-none"
              style={{ width: `${((active + 1) / members.length) * 100}%` }}
            />
          </div>
          <p aria-live="polite" className="text-sm font-semibold tabular-nums text-muted">
            <span className="sr-only">Showing team member </span>
            {active + 1} / {members.length}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(active - 1)}
              disabled={active === 0}
              aria-label="Previous team member"
              className="grid size-11 place-items-center rounded-full bg-ink text-white transition-colors duration-(--dur-fast) hover:bg-navy-2 disabled:bg-ink/15 disabled:text-ink/40"
            >
              <ArrowIcon aria-hidden className="size-4 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              disabled={active === members.length - 1}
              aria-label="Next team member"
              className="grid size-11 place-items-center rounded-full bg-ink text-white transition-colors duration-(--dur-fast) hover:bg-navy-2 disabled:bg-ink/15 disabled:text-ink/40"
            >
              <ArrowIcon aria-hidden className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
