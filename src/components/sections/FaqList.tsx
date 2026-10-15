import type { Faq } from "@/content/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PlusIcon } from "@/components/ui/icons";

type Props = { items: Faq[]; heading?: string; id?: string };

/** Native <details> accordion: keyboard accessible, works without JS, and answers stay in the HTML for search engines. */
export function FaqList({ items, heading = "Frequently asked questions", id = "faq-heading" }: Props) {
  return (
    <section aria-labelledby={id} className="bg-paper">
      <div className="container-x section-y grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow="FAQ" title={<span id={id}>{heading}</span>} />
        </div>
        <div className="border-t border-ink lg:col-span-8">
          {items.map((f, i) => (
            <details key={f.q} data-reveal style={{ ["--reveal-i" as string]: i }} className="group border-b border-line" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left font-display text-[1.375rem] leading-snug tracking-[-0.012em] sm:text-[1.6rem] [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="grid size-10 shrink-0 place-items-center rounded-tag ring-1 ring-line transition-[background-color,color] duration-(--dur-base) ease-out-expo group-open:bg-navy group-open:text-paper group-open:ring-navy">
                  <PlusIcon className="size-4 transition-transform duration-(--dur-base) ease-out-expo group-open:rotate-45" />
                </span>
              </summary>
              <p className="max-w-2xl pb-7 text-lg leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
