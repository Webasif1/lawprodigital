import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { LEGAL_UPDATED, privacyPolicy } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "What personal information the Law Pro Digital website collects through its contact form, how it is used and stored, and how to ask us to delete it.",
  path: "/privacy-policy/",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy-policy/"
      intro="What this website collects, why, and what you can ask us to do with it."
      updated={LEGAL_UPDATED}
      sections={privacyPolicy}
    />
  );
}
