import { system } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";

const icons = [
  // Be found: magnifier
  "M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Zm5-2 4 4",
  // Be trusted: shield with check
  "M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Zm-3 9 2 2 4-4",
  // Be easy to reach: chat bubble
  "M4 5h16v11H9l-5 4V5Zm4 5h8M8 13h5",
  // Be measured: bar chart
  "M4 20h16M7 16v-4m5 4V8m5 8V5",
];

/** How a client actually chooses a lawyer, as four connected jobs. The connector fills on scroll. */
export function SystemSection() {
  return (
    <section aria-labelledby="system-heading" className="border-y border-line bg-surface">
      <div className="container-x section-y">
        <SectionHeading
          align="split"
          eyebrow="How we grow immigration firms"
          title={<span id="system-heading">{system.heading}</span>}
          intro="People don't hire an immigration lawyer the way they buy shoes. They worry, research, ask questions, and choose someone they trust. So the plan follows the four steps a client takes."
        />
        <ol data-timeline className="relative mt-16 grid gap-8 [--progress:1] md:grid-cols-4 md:gap-6">
          <span aria-hidden className="absolute left-7 right-7 top-7 hidden h-px bg-line md:block" />
          <span aria-hidden className="absolute left-7 right-7 top-7 hidden h-px origin-left bg-gold md:block" style={{ transform: "scaleX(var(--progress))" }} />
          {system.jobs.map((job, i) => (
            <li key={job.title} data-reveal style={{ ["--reveal-i" as string]: i }} className="relative">
              <span className={`relative grid size-14 place-items-center rounded-2xl ${i === 3 ? "bg-gold text-ink" : "bg-navy text-white"}`}>
                <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d={icons[i]} />
                </svg>
              </span>
              <p className="eyebrow mt-6 text-muted">Job {i + 1}</p>
              <h3 className="mt-2 font-display text-h3 font-bold">{job.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{job.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
