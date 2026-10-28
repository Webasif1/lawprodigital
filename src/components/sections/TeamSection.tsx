import Image from "next/image";
import { demoTeam, team, type TeamMember } from "@/content/team";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowUpRightIcon } from "@/components/ui/icons";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => w.toLowerCase() !== "md")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/** The people behind the work. Demo placeholders appear in `next dev` only. */
export function TeamSection() {
  const members: TeamMember[] = process.env.NODE_ENV === "production" ? team : [...team, ...demoTeam];

  return (
    <section aria-labelledby="team-heading" className="bg-wash">
      <div className="container-x section-y">
        <SectionHeading
          eyebrow="Team"
          align="split"
          title={<span id="team-heading">The people behind your growth</span>}
          intro="A small, senior team. You talk directly to the people running your campaigns."
        />
        <ul className="mt-14 grid gap-x-8 border-t border-ink sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m, i) => (
            <li key={`${m.name}-${m.role}`} data-reveal style={{ ["--reveal-i" as string]: i }} className="flex gap-5 border-b border-line py-8">
              {m.photo ? (
                <Image
                  src={m.photo.src}
                  width={m.photo.width}
                  height={m.photo.height}
                  alt={`${m.name}, ${m.role}`}
                  sizes="5rem"
                  unoptimized={m.photo.src.endsWith(".svg")}
                  className="size-20 shrink-0 rounded-full object-cover ring-2 ring-gold/60"
                />
              ) : (
                <span
                  aria-hidden
                  className="grid size-20 shrink-0 place-items-center rounded-full bg-navy font-display text-2xl font-bold text-gold ring-2 ring-gold/60"
                >
                  {initials(m.name)}
                </span>
              )}
              <div className="min-w-0">
                <h3 className="font-display text-xl font-bold leading-snug text-ink">{m.name}</h3>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-brass">{m.role}</p>
                {m.bio && <p className="mt-3 text-muted">{m.bio}</p>}
                {m.links.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {m.links.map((l) => (
                      <li key={l.href}>
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-ink ring-1 ring-ink/20 transition-colors duration-(--dur-fast) hover:bg-white hover:text-navy-2"
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
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
