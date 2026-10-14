import type { Metadata } from "next";
import { CaseStudiesSection } from "@/components/sections/CaseStudiesSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqList } from "@/components/sections/FaqList";
import { Hero } from "@/components/sections/Hero";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ProofStats } from "@/components/sections/ProofStats";
import { ServicesIndex } from "@/components/sections/ServicesIndex";
import { Specialties } from "@/components/sections/Specialties";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { WhyUs } from "@/components/sections/WhyUs";
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

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <Hero />
      <ProofStats />
      <ServicesIndex />
      <CaseStudiesSection />
      <ProcessSection heading={process.heading} intro={process.intro} steps={process.steps} />
      <Specialties />
      <WhyUs />
      <TestimonialSection />
      <FaqList items={faqs} />
      <CtaBand />
    </>
  );
}
