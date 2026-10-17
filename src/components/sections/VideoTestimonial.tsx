"use client";

import { useState } from "react";
import Image from "next/image";
import { PlayIcon } from "@/components/ui/icons";

type Props = { youtubeId: string; title: string; cover?: string };

/**
 * Click-to-load YouTube player. Nothing is requested from YouTube until the
 * visitor presses play (privacy-enhanced domain, no cookies before consent);
 * the cover is a self-hosted still from the video.
 */
export function VideoTestimonial({ youtubeId, title, cover }: Props) {
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
          className="group absolute inset-0 flex flex-col items-center justify-end gap-4 p-8 text-center text-paper"
        >
          {cover ? (
            <>
              <Image
                src={cover}
                alt=""
                fill
                sizes="(min-width: 640px) 22rem, 100vw"
                className="object-cover transition-transform duration-(--dur-slow) ease-out-expo group-hover:scale-[1.03]"
              />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-navy/0" />
            </>
          ) : (
            <span aria-hidden className="ledger-rules absolute inset-0" />
          )}
          <span className="relative grid size-18 place-items-center rounded-full bg-gold text-ink shadow-lg transition-transform duration-(--dur-base) ease-out-expo group-hover:scale-105">
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
