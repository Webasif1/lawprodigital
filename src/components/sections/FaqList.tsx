import type { Faq } from "@/content/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PlusIcon } from "@/components/ui/icons";

type Props = { items: Faq[]; heading?: string; id?: string };

/** Native <details> accordion: keyboard accessible, works without JS, and answers stay in the HTML for search engines. */
export function FaqList({ items, heading = "Frequently asked questions", id = "faq-heading" }: Props) {
  return (
    <section aria-labelledby={id} className="bg-paper">
      <div className="container-x grid gap-12 py-24 sm:py-32 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow="FAQ" title={<span id={id}>{heading}</span>} />
        </div>
        <div className="border-t border-ink/15 lg:col-span-8">
          {items.map((f, i) => (
            <details key={f.q} data-reveal style={{ ["--reveal-i" as string]: i }} className="group border-b border-ink/15" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left font-display text-xl tracking-tight sm:text-2xl [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-ink/15 transition-[transform,background-color] duration-500 ease-out-expo group-open:rotate-45 group-open:bg-gold group-open:ring-gold">
                  <PlusIcon className="size-4" />
                </span>
              </summary>
              <p className="max-w-2xl pb-7 text-lg leading-relaxed text-slate">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
