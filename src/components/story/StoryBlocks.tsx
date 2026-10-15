import type { StoryBlock } from "@/lib/stories";
import { CheckIcon } from "@/components/ui/icons";
import { Rich } from "./Rich";

const reveal = (i: number) => ({ ["--reveal-i" as string]: Math.min(i, 3) });
const toNumber = (s: string) => {
  const m = s.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : NaN;
};

/** A paragraph that opens with a bold sentence ("**Months 1–2: …** We set up…") reads as a story beat. */
const beatRe = /^\*\*([^*]+?[.:!?])\*\*\s+(.*)$/;

export function StoryBlocks({ blocks, tone = "default" }: { blocks: StoryBlock[]; tone?: "default" | "takeaways" }) {
  return (
    <div className="grid gap-6">
      {blocks.map((block, i) => (
        <Block key={i} block={block} i={i} tone={tone} />
      ))}
    </div>
  );
}

function Block({ block, i, tone }: { block: StoryBlock; i: number; tone: "default" | "takeaways" }) {
  switch (block.type) {
    case "p": {
      const beat = block.text.match(beatRe);
      if (beat)
        return (
          <div data-reveal style={reveal(i)} className="relative border-l-2 border-gold pl-6">
            <p className="font-display text-lg font-bold tracking-tight text-ink">{beat[1]}</p>
            <p className="mt-2 text-[1.0625rem] leading-[1.8] text-ink/80">
              <Rich text={beat[2]} />
            </p>
          </div>
        );
      return (
        <p data-reveal style={reveal(i)} className="text-[1.0625rem] leading-[1.8] text-ink/80 sm:text-lg sm:leading-[1.8]">
          <Rich text={block.text} />
        </p>
      );
    }

    case "why":
      return (
        <aside data-reveal style={reveal(i)} className="relative overflow-hidden rounded-card bg-navy p-6 text-white sm:p-8">
          <p className="eyebrow text-gold">{block.label}</p>
          <p className="mt-3 font-display text-xl font-semibold leading-snug tracking-tight text-balance sm:text-2xl">
            <Rich text={block.text} />
          </p>
        </aside>
      );

    case "note":
      return (
        <p data-reveal style={reveal(i)} className="border-l border-line pl-4 text-sm leading-relaxed text-muted">
          <Rich text={block.text} />
        </p>
      );

    case "list":
      if (tone === "takeaways")
        return (
          <ul className="grid gap-3">
            {block.items.map((item, k) => (
              <li key={k} data-reveal style={reveal(k)} className="flex gap-4 rounded-field bg-white/6 p-4 text-white/90 ring-1 ring-inset ring-white/10">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-gold text-ink">
                  <CheckIcon className="size-3.5" />
                </span>
                <span className="leading-relaxed [&_strong]:text-white">
                  <Rich text={item} />
                </span>
              </li>
            ))}
          </ul>
        );
      if (block.ordered)
        return (
          <ol className="grid gap-3">
            {block.items.map((item, k) => (
              <li key={k} data-reveal style={reveal(k)} className="flex gap-4 rounded-field border border-line bg-surface p-5">
                <span className="figure grid size-9 shrink-0 place-items-center rounded-tag bg-paper text-sm text-brass">{String(k + 1).padStart(2, "0")}</span>
                <span className="pt-1.5 leading-relaxed text-ink/80">
                  <Rich text={item} />
                </span>
              </li>
            ))}
          </ol>
        );
      return (
        <ul className="grid gap-3">
          {block.items.map((item, k) => (
            <li key={k} data-reveal style={reveal(k)} className="relative pl-7 text-[1.0625rem] leading-[1.75] text-ink/80">
              <span aria-hidden className="absolute left-0 top-[0.7em] h-0.5 w-3.5 rounded bg-gold" />
              <Rich text={item} />
            </li>
          ))}
        </ul>
      );

    case "table":
      return <DataTable head={block.head} rows={block.rows} i={i} />;

    case "chart":
      return <BarChart block={block} />;

    case "flow":
      return (
        <figure data-reveal className="rounded-card border border-line bg-surface p-5 sm:p-7">
          <ol aria-label={block.alt} className="grid gap-2 sm:flex sm:items-stretch">
            {block.steps.map((step, k) => {
              const last = k === block.steps.length - 1;
              return (
                <li key={k} className="flex flex-1 items-center gap-2 sm:flex-col sm:items-stretch">
                  <div className="flex flex-1 items-center gap-3 sm:flex-row">
                    <span
                      data-flow-step
                      className={`flex min-h-16 flex-1 items-center rounded-field px-4 py-3 text-sm font-semibold leading-snug ${
                        last ? "bg-gold text-ink" : k === 0 ? "bg-navy text-white" : "bg-paper text-ink ring-1 ring-inset ring-line"
                      }`}
                    >
                      {step}
                    </span>
                    {!last && (
                      <span aria-hidden className="hidden text-gold sm:block">
                        →
                      </span>
                    )}
                  </div>
                  {!last && (
                    <span aria-hidden className="pl-4 text-gold sm:hidden">
                      ↓
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
          {block.alt && <figcaption className="mt-4 text-xs text-muted">{block.alt}</figcaption>}
        </figure>
      );
  }
}

/**
 * Data tables stay real HTML tables so search engines and AI tools can cite
 * the numbers. A two-column table with a numeric second column also gets
 * inline bars, which grow in as the reader reaches them.
 */
function DataTable({ head, rows, i }: { head: string[]; rows: string[][]; i: number }) {
  const numeric = head.length === 2 && rows.every((r) => !Number.isNaN(toNumber(r[1] ?? "")));
  const max = numeric ? Math.max(...rows.map((r) => toNumber(r[1]))) : 0;
  const min = numeric ? Math.min(...rows.map((r) => toNumber(r[1]))) : 0;
  // For costs, the cheapest row is the story; for volumes, the largest.
  const costs = numeric && /cost|\$|cpc|per/i.test(head[1] + rows[0][1]);
  // Right-align columns that hold figures; text columns read left to right.
  const figureCol = head.map((_, k) => k > 0 && rows.every((r) => /^[$~+-]?\d|^—|^n\/a/i.test((r[k] ?? "").trim())));

  return (
    <div data-reveal style={reveal(i)} className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <table data-grow className="w-full min-w-[34rem] border-collapse overflow-hidden rounded-card bg-surface text-left text-sm ring-1 ring-line sm:min-w-0">
        <thead>
          <tr className="bg-navy text-white">
            {head.map((h, k) => (
              <th key={k} scope="col" className={`px-4 py-3.5 font-semibold ${figureCol[k] ? "text-right" : ""}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => {
            const value = numeric ? toNumber(row[1]) : 0;
            const best = numeric && value === (costs ? min : max);
            return (
              <tr key={r} className="border-t border-line even:bg-paper/60">
                {row.map((cell, k) => (
                  <td key={k} className={`px-4 py-3 align-top ${k === 0 ? "font-medium text-ink" : figureCol[k] ? "text-right tabular-nums text-ink/80" : "text-ink/80"}`}>
                    {numeric && k === 1 ? (
                      <span className="flex items-center justify-end gap-3">
                        <span aria-hidden className="hidden h-2 flex-1 overflow-hidden rounded-full bg-wash sm:block">
                          <span
                            data-grow-bar
                            className={`block h-full origin-left rounded-full ${best ? "bg-gold" : "bg-navy/70"}`}
                            style={{ width: `${Math.max(4, (value / max) * 100)}%` }}
                          />
                        </span>
                        <span className={`w-16 ${best ? "font-bold text-brass" : ""}`}>{cell}</span>
                      </span>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function BarChart({ block }: { block: Extract<StoryBlock, { type: "chart" }> }) {
  const max = Math.max(...block.points.map((p) => p.value));
  return (
    <figure data-reveal className="rounded-card border border-line bg-surface p-5 sm:p-8">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-display text-lg font-bold tracking-tight">{block.title}</span>
        <span className="flex items-center gap-2 text-xs text-muted">
          <span aria-hidden className="size-2.5 rounded-sm bg-gold" /> Highlighted
        </span>
      </figcaption>
      <div data-grow className="mt-8 flex h-56 items-end gap-1.5 sm:h-64 sm:gap-3">
        {block.points.map((p) => (
          <div key={p.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
            <span className={`text-[0.65rem] font-semibold tabular-nums sm:text-xs ${p.highlight ? "text-brass" : "text-muted"}`}>{p.value.toLocaleString("en-US")}</span>
            <span
              data-grow-col
              className={`block w-full origin-bottom rounded-t-md ${p.highlight ? "bg-gold" : "bg-navy/80"}`}
              style={{ height: `${(p.value / max) * 100}%` }}
            />
            <span className="w-full truncate text-center text-[0.65rem] text-muted sm:text-xs">{p.label.replace(" 2025", "")}</span>
          </div>
        ))}
      </div>
      <table className="sr-only">
        <caption>{block.title}</caption>
        <tbody>
          {block.points.map((p) => (
            <tr key={p.label}>
              <th scope="row">{p.label}</th>
              <td>
                {p.value.toLocaleString("en-US")} {p.note}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {block.source && <p className="mt-5 text-xs text-muted">Source: {block.source}</p>}
    </figure>
  );
}
