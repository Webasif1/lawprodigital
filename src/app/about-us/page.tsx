import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CheckIcon } from "@/components/ui/icons";
import { cities, process, specialties } from "@/content/home";
import { site } from "@/content/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Us — Digital Marketing Exclusively for Law Firms",
  description:
    "At Law Pro Digital, we specialize exclusively in marketing for law firms. We understand that legal professionals face unique challenges when it comes to attracting clients and building trust online.",
  path: "/about-us/",
});

const outcomes = [
  "Generate more qualified client leads",
  "Build a strong and trustworthy online reputation",
  "Rank higher in local search results where clients are looking now",
  "Convert website visitors into paying clients",
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "About Us", path: "/about-us/" }])} />
      <PageHero
        eyebrow="About us"
        crumbs={[{ name: "About Us", path: "/about-us/" }]}
        title={
          <>
            Your trusted digital marketing partner <em className="text-gold">dedicated to law firms</em>
          </>
        }
        intro="At Law Pro Digital, we specialize exclusively in marketing for law firms."
        actions={<ButtonLink href={site.primaryCta.href}>Contact us</ButtonLink>}
      />

      <section aria-labelledby="mission-heading" className="bg-paper">
        <div className="container-x grid gap-12 py-24 sm:py-32 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Who we are" title={<span id="mission-heading">We understand the legal world inside out</span>} />
          </div>
          <div className="grid gap-6 text-lg leading-relaxed text-ink/80 lg:col-span-7 lg:pt-10">
            <p data-reveal>
              We understand that legal professionals face unique challenges when it comes to attracting clients and building trust online.
              That’s why we’ve committed ourselves to mastering digital marketing strategies designed specifically for lawyers in Immigration,
              Bankruptcy, Injury, Criminal, Sexual Harassment, and other practice areas.
            </p>
            <p data-reveal>
              With Law Pro Digital, you get more than just a marketing agency — you get a dedicated growth partner who works closely with you every
              step of the way.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="results-heading" className="bg-paper-2">
        <div className="container-x py-24 sm:py-32">
          <SectionHeading eyebrow="Team" align="split" title={<span id="results-heading">Expert marketing that delivers real results for legal practices</span>} />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2">
            {outcomes.map((o, i) => (
              <li key={o} data-reveal style={{ ["--reveal-i" as string]: i }} className="flex gap-5 rounded-2xl bg-paper p-7 text-xl leading-snug">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy text-gold">
                  <CheckIcon className="size-4" />
                </span>
                {o}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="practice-heading" className="bg-paper">
        <div className="container-x grid gap-12 py-24 sm:py-32 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Practice areas" title={<span id="practice-heading">Lawyers we work with</span>} />
            <ul className="mt-10 grid gap-3">
              {specialties.map((s) => (
                <li key={s.title} data-reveal className="flex items-baseline justify-between gap-6 border-b border-ink/12 pb-3">
                  <span className="font-display text-2xl tracking-tight">{s.title}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="Locations" title="Cities we serve" />
            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3">
              {cities.map((c) => (
                <li key={c} data-reveal className="border-b border-ink/12 pb-3 text-lg">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ProcessSection heading={process.heading} intro={process.intro} steps={process.steps} />
      <div className="bg-paper pt-24 sm:pt-32">
        <CtaBand />
      </div>
    </>
  );
}
