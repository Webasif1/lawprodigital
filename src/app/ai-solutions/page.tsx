import type { Metadata } from "next";
import Link from "next/link";
import { ChatDemo } from "@/components/home/ChatDemo";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ai, problem } from "@/content/home";
import { plans } from "@/content/pricing";
import { site } from "@/content/site";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "AI Intake Assistant for Immigration Law Firms | Law Pro Digital",
  description:
    "An AI intake assistant that replies on your website, WhatsApp and Messenger in under 60 seconds, in your clients' languages, qualifies the case, books consultations and records where every lead came from.",
  path: "/ai-solutions/",
  absoluteTitle: true,
});

const steps = [
  { title: "Replies in seconds", text: "On your website, WhatsApp and Messenger, day or night, in Arabic, Bengali, Hindi, Spanish and more." },
  { title: "Asks the right questions", text: "Visa type, timeline and location, so your team knows what the case is before anyone calls back." },
  { title: "Books the consultation", text: "Directly into your calendar, with a confirmation the client receives on the channel they used." },
  { title: "Records the source", text: "Every prospect is asked how they found the firm, so your monthly scorecard shows what actually signs clients." },
];

export default function AiSolutionsPage() {
  const included = plans.filter((p) => /intake|voice agent/i.test(p.fit + p.features.join(" ")));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "AI Solutions", path: "/ai-solutions/" }]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "AI intake assistant for law firms",
            serviceType: "AI client intake",
            description: ai.body,
            url: absoluteUrl("/ai-solutions/"),
            provider: { "@id": `${site.url}/#organization` },
            areaServed: { "@type": "Country", name: "United States" },
            audience: { "@type": "Audience", audienceType: "US immigration law firms" },
          },
        ]}
      />
      <PageHero
        eyebrow="AI Solutions"
        crumbs={[{ name: "AI Solutions", path: "/ai-solutions/" }]}
        title={
          <>
            AI that answers every inquiry <em className="text-gold">in seconds, day or night</em>
          </>
        }
        intro={ai.body}
        actions={<ButtonLink href={site.primaryCta.href}>{site.primaryCta.label}</ButtonLink>}
      />

      <section aria-labelledby="how-heading" className="bg-paper">
        <div className="container-x section-y grid items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading eyebrow="How it works" title={<span id="how-heading">Qualified conversations instead of missed calls</span>} />
            <ol className="mt-12 grid gap-4">
              {steps.map((s, i) => (
                <li key={s.title} data-reveal style={{ ["--reveal-i" as string]: i }} className="flex gap-5 rounded-card bg-surface p-6 ring-1 ring-line">
                  <span className="figure grid size-10 shrink-0 place-items-center rounded-tag bg-navy text-sm text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block font-display text-lg font-bold">{s.title}</span>
                    <span className="mt-1 block leading-relaxed text-muted">{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div data-reveal className="rounded-card bg-navy-deep px-6 py-12 lg:col-span-5 lg:col-start-8">
            <ChatDemo />
          </div>
        </div>
      </section>

      <section aria-labelledby="why-ai-heading" className="border-y border-line bg-surface">
        <div className="container-x section-y grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Why it matters" title={<span id="why-ai-heading">Immigration clients message at night, and move on if nobody answers</span>} />
          </div>
          <div className="grid gap-6 text-lg leading-relaxed text-ink/80 lg:col-span-7 lg:pt-10">
            <p data-reveal>{problem.points[2].text}</p>
            <p data-reveal>
              Calls are the other blind spot. At the multi-office immigration firm in our case studies, 370 of 478 calls in September still had no
              recorded source. An assistant that answers in seconds, asks every prospect how they found the firm, qualifies the case and books the
              consultation turns every call into data.{" "}
              <Link href="/case-study/law-firm-marketing-system-lessons/" className="font-semibold text-navy-2 underline decoration-gold decoration-2 underline-offset-4 hover:text-brass">
                Read the story
              </Link>
              .
            </p>
            <ul className="mt-2 grid gap-3 sm:grid-cols-2">
              {ai.bullets.map((b) => (
                <li key={b} data-reveal className="flex items-start gap-3 rounded-field bg-paper p-4 text-base">
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-brass" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="included-heading" className="bg-paper">
        <div className="container-x section-y">
          <SectionHeading eyebrow="Packages" title={<span id="included-heading">Where AI intake is included</span>} />
          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {included.map((p) => (
              <li key={p.name} data-reveal className="flex flex-col rounded-card bg-surface p-7 ring-1 ring-line">
                <h3 className="font-display text-h3 font-bold">{p.name}</h3>
                <p className="mt-2 text-muted">{p.fit}</p>
                <p className="figure mt-6 text-3xl text-navy">
                  ${p.price.toLocaleString("en-US")}
                  <span className="ml-2 font-sans text-sm font-normal text-muted">/ month {p.priceNote}</span>
                </p>
              </li>
            ))}
          </ul>
          <Link href="/pricing/" className="mt-8 inline-flex font-semibold text-navy-2 underline decoration-gold decoration-2 underline-offset-4 hover:text-brass">
            Compare all packages
          </Link>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
