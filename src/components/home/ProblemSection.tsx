import { problem } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** The four reasons leads don't become clients, one idea per card. */
export function ProblemSection() {
  return (
    <section aria-labelledby="problem-heading" className="bg-paper">
      <div className="container-x section-y grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeading eyebrow="The problem" title={<span id="problem-heading">{problem.heading}</span>} />
          </div>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {problem.points.map((p, i) => (
            <li
              key={p.title}
              data-reveal
              style={{ ["--reveal-i" as string]: i % 2 }}
              className={`flex flex-col rounded-card p-7 ${i === 1 ? "on-dark bg-navy text-white" : "bg-surface ring-1 ring-line"}`}
            >
              <span className={`figure text-sm ${i === 1 ? "text-gold" : "text-brass"}`}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-8 font-display text-xl font-bold tracking-tight">{p.title}</h3>
              <p className={`mt-3 leading-relaxed ${i === 1 ? "text-mist" : "text-muted"}`}>{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
