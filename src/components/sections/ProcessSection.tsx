import type { Step } from "@/content/services";
import { ProcessTimeline } from "@/components/motion/ProcessTimeline";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = { eyebrow?: string; heading: string; intro?: string; steps: Step[]; id?: string };

export function ProcessSection({ eyebrow = "How we work", heading, intro, steps, id = "process-heading" }: Props) {
  return (
    <section aria-labelledby={id} className="grain bg-ink text-paper">
      <div className="container-x grid gap-16 py-24 sm:py-32 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeading tone="dark" eyebrow={eyebrow} title={<span id={id}>{heading}</span>} intro={intro} />
          </div>
        </div>
        <div className="lg:col-span-7 lg:pt-4">
          <ProcessTimeline steps={steps} />
        </div>
      </div>
    </section>
  );
}
