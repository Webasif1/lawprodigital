"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { TeamMember } from "@/content/team";
import { ArrowIcon, ArrowUpRightIcon, LinkedInIcon } from "@/components/ui/icons";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => w.toLowerCase() !== "md")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/**
 * Portrait cards on a native scroll-snap track, opening on the middle card. The centred
 * card is full size and in colour with its profile links; the rest are greyscale and
 * smaller. Swipe, arrow keys, the prev/next buttons or a click on a card move between them.
 */
export function TeamCarousel({ members }: { members: TeamMember[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const start = Math.floor(members.length / 2);
  const [active, setActive] = useState(start);

  const go = (i: number, smooth = true) => {
    const track = trackRef.current;
    const card = track?.children[i] as HTMLElement | undefined;
    if (!track || !card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Rounded and clamped: a half-pixel past the end makes the snap pull back a card.
    const left = Math.min(Math.round(card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2), track.scrollWidth - track.clientWidth);
    track.scrollTo({ left, behavior: smooth && !reduce ? "smooth" : "auto" });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    go(start, false);
    // A card is active once it crosses the middle tenth of the track.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
      },
      { root: track, rootMargin: "0px -45% 0px -45%" },
    );
    for (const li of track.children) io.observe(li);
    return () => io.disconnect();
  }, [start, members.length]);

  return (
    <div className="mt-14 [--card:13.5rem] sm:[--card:14rem] lg:[--card:15rem]">
      {/* The bleed sits on a wrapper: the track's % padding resolves against its parent's width. */}
      <div className="-mx-(--gutter)">
        <ul
          ref={trackRef}
          tabIndex={0}
          aria-label="Team members, scroll sideways for more"
          className="relative flex snap-x snap-mandatory items-end gap-2 overflow-x-auto px-[calc(50%-var(--card)/2)] pt-2 pb-2 [scrollbar-width:none] sm:gap-3 [&::-webkit-scrollbar]:hidden"
        >
          {members.map((m, i) => {
            const on = i === active;
            return (
              <li
                key={`${m.name}-${m.role}`}
                data-index={i}
                data-reveal
                style={{ ["--reveal-i" as string]: Math.abs(i - start) }}
                className="w-(--card) shrink-0 snap-center"
              >
                <div
                  onClick={on ? undefined : () => go(i)}
                  className={`group origin-bottom transition-transform duration-(--dur-base) ease-(--ease-out-expo) motion-reduce:transition-none ${
                    on ? "scale-100" : "scale-[0.82] cursor-pointer"
                  }`}
                >
                  <div
                    className={`relative aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-navy ring-1 transition-shadow duration-(--dur-base) ${
                      on ? "shadow-[0_28px_56px_-28px_rgb(10_22_40/0.6)] ring-ink/10" : "ring-ink/5"
                    }`}
                  >
                    {m.photo ? (
                      <Image
                        src={m.photo.src}
                        width={m.photo.width}
                        height={m.photo.height}
                        alt={`${m.name}, ${m.role}`}
                        sizes="(min-width: 1024px) 15rem, (min-width: 640px) 14rem, 13.5rem"
                        className={`size-full object-cover object-top transition-[filter] duration-(--dur-base) motion-reduce:transition-none ${
                          on ? "grayscale-0" : "grayscale group-hover:grayscale-0"
                        }`}
                      />
                    ) : (
                      <span aria-hidden className="grid size-full place-items-center font-display text-5xl font-bold text-gold">
                        {initials(m.name)}
                      </span>
                    )}
                    {m.links.length > 0 && (
                      <ul
                        className={`absolute inset-x-0 bottom-2 flex justify-center transition-opacity duration-(--dur-fast) ${
                          on ? "opacity-100" : "pointer-events-none opacity-0"
                        }`}
                      >
                        {m.links.map((l) => (
                          <li key={l.href}>
                            {/* 44px tap target around a 32px chip. */}
                            <a
                              href={l.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              tabIndex={on ? undefined : -1}
                              className="group/link grid size-11 place-items-center rounded-full"
                            >
                              <span className="grid size-8 place-items-center rounded-full bg-ink/55 text-white ring-1 ring-white/30 backdrop-blur transition-colors duration-(--dur-fast) group-hover/link:bg-white group-hover/link:text-ink">
                                {l.label === "LinkedIn" ? (
                                  <LinkedInIcon aria-hidden className="size-3.5" />
                                ) : (
                                  <ArrowUpRightIcon aria-hidden className="size-3.5" />
                                )}
                              </span>
                              <span className="sr-only">
                                {l.label} profile of {m.name} (opens in a new tab)
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    {/* Colour only: a layout change mid-scroll makes the browser re-snap and cancel it. */}
                    <h3 className={`font-display text-base font-bold leading-snug transition-colors ${on ? "text-ink" : "text-ink/60"}`}>{m.name}</h3>
                    <p className="mt-0.5 text-xs text-muted">{m.role}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-8 flex items-center gap-6">
        <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-ink transition-[width] duration-(--dur-base) ease-(--ease-out-expo) motion-reduce:transition-none"
            style={{ width: `${((active + 1) / members.length) * 100}%` }}
          />
        </div>
        <p aria-live="polite" className="sr-only">
          Showing team member {active + 1} of {members.length}
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
    </div>
  );
}
