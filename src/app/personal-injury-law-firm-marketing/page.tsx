import type { Metadata } from "next";
import { LocationHub } from "@/components/location/LocationHub";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Personal Injury & Bankruptcy Law Firm Marketing by City",
  description:
    "Local SEO, Google Local Services Ads, AI search and AI intake for personal injury and bankruptcy law firms. Custom packages from a law-firm-only team.",
  path: "/personal-injury-law-firm-marketing/",
});

export default function InjuryHubPage() {
  return (
    <LocationHub
      practice="personal-injury"
      intro="We help personal injury and bankruptcy firms win local cases from bigger competitors with local SEO, Google Local Services Ads, AI search and AI intake that replies in seconds."
    />
  );
}
