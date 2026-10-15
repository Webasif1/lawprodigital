import type { Step } from "@/content/services";
import { ProcessTimeline } from "@/components/motion/ProcessTimeline";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = { eyebrow?: string; index?: number; heading: string; intro?: string; steps: Step[]; id?: string; tone?: "dark" | "light" };

export function ProcessSection({ eyebrow = "How we work", index, heading, intro, steps, id = "process-heading", tone = "light" }: Props) {
  const dark = tone === "dark";
  return (
    <section aria-labelledby={id} className={dark ? "on-dark bg-navy text-paper" : "bg-surface text-ink"}>
      <div className="container-x section-y grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeading tone={tone} eyebrow={eyebrow} index={index} title={<span id={id}>{heading}</span>} intro={intro} />
          </div>
        </div>
        <div className="lg:col-span-7 lg:pt-4">
          <ProcessTimeline steps={steps} tone={tone} />
        </div>
      </div>
    </section>
  );
}
