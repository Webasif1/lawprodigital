import { finalCta } from "@/content/home";
import { contact, site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { HeroMark } from "@/components/three/HeroMark";

type Props = { heading?: string; text?: string };

export function CtaBand({ heading = finalCta.heading, text = finalCta.text }: Props) {
  return (
    <section aria-labelledby="cta-heading" className="bg-paper px-[var(--gutter)] pb-24 sm:pb-32">
      <div className="grain relative mx-auto max-w-[82rem] overflow-hidden rounded-[2rem] bg-navy text-paper">
        <HeroMark decorative className="pointer-events-none absolute -right-24 -bottom-28 size-[26rem] opacity-25 sm:-right-10 sm:size-[32rem]" />
        <div className="relative grid gap-10 px-6 py-16 sm:px-14 sm:py-20 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h2 id="cta-heading" data-reveal className="font-display-tight text-[clamp(2.25rem,5.5vw,4.5rem)] text-balance">
              {heading}
            </h2>
            <p data-reveal className="mt-6 max-w-xl text-lg leading-relaxed text-mist">
              {text}
            </p>
          </div>
          <div data-reveal className="flex flex-col gap-4 lg:col-span-4 lg:items-end">
            <ButtonLink href={site.primaryCta.href}>{site.primaryCta.label}</ButtonLink>
            {contact.phone && (
              <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} className="text-paper/80 hover:text-gold">
                or call {contact.phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
