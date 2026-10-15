import type { Metadata } from "next";
import { CaseStudiesSection } from "@/components/sections/CaseStudiesSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqList } from "@/components/sections/FaqList";
import { Hero } from "@/components/sections/Hero";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ProofStats } from "@/components/sections/ProofStats";
import { ServicesIndex } from "@/components/sections/ServicesIndex";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { WhoWeServe } from "@/components/sections/WhoWeServe";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqs, process } from "@/content/home";
import { site } from "@/content/site";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Digital Marketing for Law Firms | Grow Clients & Revenue",
  description: site.description,
  path: "/",
  absoluteTitle: true,
});

/**
 * Narrative: promise → proof → what we do → the work → how we work →
 * who it's for → a client in their own words → questions → the call.
 */
export default function HomePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <Hero />
      <ProofStats />
      <ServicesIndex />
      <CaseStudiesSection />
      <ProcessSection index={3} heading={process.heading} intro={process.intro} steps={process.steps} />
      <WhoWeServe index={4} />
      <TestimonialSection />
      <FaqList items={faqs} />
      <CtaBand />
    </>
  );
}
