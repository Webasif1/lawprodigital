import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { LEGAL_UPDATED, terms } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description: "The terms that apply when you use the Law Pro Digital website, including how case study results, pricing and site content should be read.",
  path: "/terms/",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      path="/terms/"
      intro="The ground rules for using this website."
      updated={LEGAL_UPDATED}
      sections={terms}
    />
  );
}
