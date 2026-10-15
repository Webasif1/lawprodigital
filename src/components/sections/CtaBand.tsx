import { finalCta } from "@/content/home";
import { contact, site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";

type Props = { heading?: string; text?: string };

export function CtaBand({ heading = finalCta.heading, text = finalCta.text }: Props) {
  return (
    <section aria-labelledby="cta-heading" className="container-x pb-20 sm:pb-28">
      <div className="on-dark relative overflow-hidden rounded-[2.5rem] bg-navy text-paper">
        <div aria-hidden className="pointer-events-none absolute -top-1/2 left-1/2 size-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(214,173,59,0.28),rgba(214,173,59,0.06)_40%,transparent_65%)]" />
        <div className="relative grid gap-10 px-6 py-16 sm:px-14 sm:py-20 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h2 id="cta-heading" data-reveal className="font-display-tight text-h1 text-balance">
              {heading}
            </h2>
            <p data-reveal className="mt-6 max-w-xl text-lead text-mist">
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
