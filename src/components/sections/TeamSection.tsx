import { team } from "@/content/team";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { TeamCarousel } from "./TeamCarousel";

/** The people behind the work. */
export function TeamSection() {
  return (
    <section aria-labelledby="team-heading" className="overflow-hidden bg-wash">
      <div className="container-x section-y">
        <div className="mx-auto max-w-2xl text-center">
          <div data-reveal className="mb-5">
            <Eyebrow>Team</Eyebrow>
          </div>
          <h2 id="team-heading" data-reveal className="font-display-tight text-h2 text-balance" style={{ ["--reveal-i" as string]: 1 }}>
            The people behind your growth
          </h2>
          <p data-reveal className="mx-auto mt-6 max-w-xl text-lead text-muted" style={{ ["--reveal-i" as string]: 2 }}>
            A small, senior team. You talk directly to the people running your campaigns.
          </p>
        </div>
        <TeamCarousel members={team} />
      </div>
    </section>
  );
}
