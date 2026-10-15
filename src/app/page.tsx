import type { Metadata } from "next";
import { AiSection } from "@/components/home/AiSection";
import { FirmFitSection } from "@/components/home/FirmFitSection";
import { FounderSection } from "@/components/home/FounderSection";
import { InternationalSection } from "@/components/home/InternationalSection";
import { ProblemSection } from "@/components/home/ProblemSection";
import { ProofStrip } from "@/components/home/ProofStrip";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { StoriesSection } from "@/components/home/StoriesSection";
import { SystemSection } from "@/components/home/SystemSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqList } from "@/components/sections/FaqList";
import { Hero } from "@/components/sections/Hero";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqs, process, seo } from "@/content/home";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: seo.title,
  description: seo.description,
  path: "/",
  absoluteTitle: true,
});

/**
 * Narrative: promise → proof → the problem → the system → what we do →
 * AI intake → the stories → markets abroad → the first 90 days → who it's
 * for and what it costs → why we do it → questions → the audit.
 */
export default function HomePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <Hero />
      <ProofStrip />
      <ProblemSection />
      <SystemSection />
      <ServicesGrid />
      <AiSection />
      <StoriesSection />
      <InternationalSection />
      <ProcessSection eyebrow="First 90 days" heading={process.heading} intro={process.intro} steps={process.steps} tone="light" />
      <FirmFitSection />
      <FounderSection />
      <FaqList items={faqs} />
      <CtaBand />
    </>
  );
}
