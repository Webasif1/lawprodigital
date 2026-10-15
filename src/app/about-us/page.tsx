import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cities, process, specialties } from "@/content/home";
import { site } from "@/content/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import Link from "next/link";

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
        intro={site.description}
        actions={<ButtonLink href={site.primaryCta.href}>{site.primaryCta.label}</ButtonLink>}
      />

      <section aria-labelledby="mission-heading" className="bg-paper">
        <div className="container-x section-y grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Who we are" title={<span id="mission-heading">We know how the legal world works</span>} />
          </div>
          <div className="grid gap-6 text-lg leading-relaxed text-ink/80 lg:col-span-7 lg:pt-10">
            <p data-reveal>
              We understand that legal professionals face unique challenges when it comes to attracting clients and building trust online.
              That’s why we’ve committed ourselves to mastering digital marketing strategies designed specifically for lawyers in Immigration,
              Bankruptcy, Injury, Criminal, Sexual Harassment, and other practice areas.
            </p>
            <p data-reveal>
              Our system was built and tested inside a multi-office US immigration firm: the ads, the content, the Google profiles and the monthly
              reports, all measured against one number, signed retainers. In nine months that firm went from 79 to an average of 115 new clients a
              month.{" "}
              <Link href="/case-study/immigration-law-firm-client-growth/" className="font-semibold text-navy-2 underline decoration-gold decoration-2 underline-offset-4">
                Read the story
              </Link>
              .
            </p>
            <p data-reveal>
              With Law Pro Digital, you get a dedicated growth partner, not only a marketing agency. We work closely with you every step of the way.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="results-heading" className="bg-wash">
        <div className="container-x section-y">
          <SectionHeading eyebrow="Team" align="split" title={<span id="results-heading">Expert marketing that delivers real results for legal practices</span>} />
          <ul className="mt-14 grid border-t border-ink sm:grid-cols-2">
            {outcomes.map((o, i) => (
              <li key={o} data-reveal style={{ ["--reveal-i" as string]: i }} className="flex gap-5 border-b border-line py-6 font-display text-xl leading-snug sm:odd:pr-8 sm:even:border-l sm:even:pl-8">
                <span aria-hidden className="figure w-7 shrink-0 pt-0.5 text-lg tabular-nums text-brass">{String(i + 1).padStart(2, "0")}</span>
                {o}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="practice-heading" className="bg-paper">
        <div className="container-x section-y grid gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Practice areas" title={<span id="practice-heading">Lawyers we work with</span>} />
            <ul className="mt-10 grid border-t border-ink">
              {specialties.map((s) => (
                <li key={s.title} data-reveal className="flex items-baseline justify-between gap-6 border-b border-line py-4">
                  <span className="font-display text-xl font-bold">{s.title}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="Locations" title="Cities we serve" />
            <ul className="mt-10 grid grid-cols-2 gap-x-6 border-t border-ink">
              {cities.map((c) => (
                <li key={c} data-reveal className="border-b border-line py-4 text-lg">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ProcessSection heading={process.heading} intro={process.intro} steps={process.steps} />
      <div className="bg-paper pt-20 sm:pt-28">
        <CtaBand />
      </div>
    </>
  );
}
