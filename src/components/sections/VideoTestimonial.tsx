"use client";

import { useState } from "react";
import { PlayIcon } from "@/components/ui/icons";

type Props = { youtubeId: string; title: string };

/**
 * Click-to-load YouTube player. Nothing is requested from YouTube until the
 * visitor presses play (privacy-enhanced domain, no cookies before consent).
 */
export function VideoTestimonial({ youtubeId, title }: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[22rem] overflow-hidden rounded-card bg-navy ring-1 ring-white/15">
      {playing ? (
        <iframe
          className="absolute inset-0 size-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center text-paper"
        >
          <span aria-hidden className="ledger-rules absolute inset-0" />
          <span className="relative grid size-18 place-items-center rounded-full bg-gold text-ink transition-transform duration-(--dur-base) ease-out-expo group-hover:scale-105">
            <PlayIcon className="ml-1 size-8" />
          </span>
          <span className="relative font-display text-2xl font-bold leading-tight">Play client video</span>
          <span className="relative text-sm text-mist">Loads from YouTube</span>
          <span className="sr-only">{title}</span>
        </button>
      )}
    </div>
  );
}
