import { whyUs } from "@/content/home";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CheckIcon } from "@/components/ui/icons";

export function WhyUs() {
  return (
    <section aria-labelledby="why-heading" className="bg-paper">
      <div className="container-x grid gap-14 py-24 sm:py-32 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionHeading eyebrow={whyUs.eyebrow} title={<span id="why-heading">{whyUs.heading}</span>} />
          <p data-reveal className="mt-8 max-w-xl text-lg leading-relaxed text-slate">
            {whyUs.body}
          </p>
          <div data-reveal className="mt-10">
            <ButtonLink href={site.primaryCta.href} variant="ink">
              {site.primaryCta.label}
            </ButtonLink>
          </div>
        </div>
        <ul className="grid content-start gap-4 lg:col-span-6 lg:pt-16">
          {whyUs.points.map((p, i) => (
            <li
              key={p}
              data-reveal
              style={{ ["--reveal-i" as string]: i }}
              className="flex gap-5 rounded-2xl bg-paper-2 p-6 text-lg leading-snug sm:p-7"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy text-gold">
                <CheckIcon className="size-4" />
              </span>
              <span className="pt-1">{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
