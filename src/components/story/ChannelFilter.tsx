"use client";

import { useState } from "react";

type Props = { channels: { id: string; label: string; count: number }[]; total: number; target: string };

/**
 * Filter chips for the story library. Every card is server-rendered; this
 * only sets `data-filter` on the grid and CSS hides the other channels, so
 * all stories stay in the HTML for search engines.
 */
export function ChannelFilter({ channels, total, target }: Props) {
  const [active, setActive] = useState("all");

  const choose = (id: string) => {
    setActive(id);
    document.getElementById(target)?.setAttribute("data-filter", id);
  };

  const chip = (id: string, label: string, count: number) => (
    <button
      key={id}
      type="button"
      aria-pressed={active === id}
      onClick={() => choose(id)}
      className="inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold ring-1 ring-inset ring-line transition-colors duration-(--dur-fast) hover:ring-ink/40 aria-pressed:bg-navy aria-pressed:text-white aria-pressed:ring-navy"
    >
      {label}
      <span className="tabular-nums opacity-60">{count}</span>
    </button>
  );

  return (
    <div role="group" aria-label="Filter stories by channel" className="flex flex-wrap gap-2">
      {chip("all", "All stories", total)}
      {channels.map((c) => chip(c.id, c.label, c.count))}
    </div>
  );
}
