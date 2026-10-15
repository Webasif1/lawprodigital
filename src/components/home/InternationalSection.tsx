import Link from "next/link";
import { international } from "@/content/home";
import { worldDots } from "@/content/world-dots";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowUpRightIcon } from "@/components/ui/icons";

// Equirectangular projection onto a 1000×500 canvas, cropped to the band where the markets are.
const W = 1000;
const H = 500;
const project = (lon: number, lat: number) => ({ x: ((lon + 180) / 360) * W, y: ((90 - lat) / 180) * H });
const VIEW = { x: 120, y: 70, w: 760, h: 250 };

/** All land dots as one path of zero-length round-capped segments: one element instead of ~1,200. */
const landPath = Array.from({ length: worldDots.length / 2 }, (_, i) => `M${worldDots[i * 2]} ${worldDots[i * 2 + 1]}h0`).join("");

/**
 * A dot-grid map with pulsing points over each international market, joined
 * to the US by arcs that draw in as the section is reached. The cost per
 * contact for each market is printed beside it and repeated in a list.
 */
export function InternationalSection() {
  const us = project(international.us.lon, international.us.lat);
  // Label only markets that don't crowd each other on the map.
  const labelled = ["Ghana", "Pakistan", "Bangladesh", "Qatar", "Portugal", "Turkey"];
  const markets = international.markets.map((m) => ({ ...m, ...project(m.lon, m.lat), label: labelled.includes(m.name) }));

  return (
    <section aria-labelledby="intl-heading" className="relative overflow-hidden bg-paper text-ink">
      <div className="container-x section-y">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionHeading eyebrow="International clients" title={<span id="intl-heading">{international.heading}</span>} />
          </div>
          <p data-reveal className="text-lead text-muted lg:col-span-5">
            {international.body}
          </p>
        </div>

        <figure data-reveal className="relative mt-14 overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_70px_-45px_rgba(15,31,61,0.4)] ring-1 ring-line">
          <svg viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`} className="block h-auto w-full" role="img" aria-label="Map of markets where a US immigration firm reached clients, with cost per contact">
            <defs>
              <radialGradient id="intl-glow">
                <stop offset="0" stopColor="#d6ad3b" stopOpacity="0.55" />
                <stop offset="1" stopColor="#d6ad3b" stopOpacity="0" />
              </radialGradient>
            </defs>
            <path d={landPath} stroke="rgba(15,31,61,0.13)" strokeWidth="4.2" strokeLinecap="round" />
            {markets.map((m) => {
              const mx = (us.x + m.x) / 2;
              const my = Math.min(us.y, m.y) - 60 - Math.abs(m.x - us.x) * 0.08;
              return <path key={`arc-${m.name}`} className="intl-arc" d={`M${us.x} ${us.y} Q${mx} ${my} ${m.x} ${m.y}`} fill="none" stroke="rgba(184,146,44,0.6)" strokeWidth="1.2" pathLength={1} />;
            })}
            <g>
              <circle cx={us.x} cy={us.y} r="22" fill="url(#intl-glow)" />
              <circle cx={us.x} cy={us.y} r="5" fill="#0f1f3d" />
              <text x={us.x} y={us.y + 22} textAnchor="middle" className="fill-navy text-[11px] font-bold">
                US · {international.us.cost}
              </text>
            </g>
            {markets.map((m, i) => (
              <g key={m.name}>
                <circle className="intl-pulse" cx={m.x} cy={m.y} r="10" fill="url(#intl-glow)" style={{ animationDelay: `${i * 0.35}s` }} />
                <circle cx={m.x} cy={m.y} r="3.2" fill="#d6ad3b" />
                {m.label && (
                  <text x={m.x + 6} y={m.y - 6} className="fill-ink/75 text-[8px] font-semibold">
                    {m.name}
                  </text>
                )}
              </g>
            ))}
          </svg>
          <figcaption className="grid gap-px border-t border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
            {markets.slice(0, 5).map((m) => (
              <div key={m.name} className="bg-white px-5 py-4">
                <span className="figure block text-2xl text-brass">{m.cost}</span>
                <span className="text-sm text-muted">per contact · {m.name}</span>
              </div>
            ))}
          </figcaption>
        </figure>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
          <p>
            Cost per contact by market, Feb–Oct 2026, vs <span className="font-semibold text-ink">{international.us.cost} in the US</span>. Also tested: Saudi Arabia, Turkey, Portugal and the UAE.
          </p>
          <Link href="/case-study/international-clients-us-immigration-lawyer/" className="inline-flex items-center gap-2 font-semibold text-navy-2 hover:text-brass">
            Read the international story <ArrowUpRightIcon className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
