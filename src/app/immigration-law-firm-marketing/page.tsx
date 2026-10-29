import type { Metadata } from "next";
import { LocationHub } from "@/components/location/LocationHub";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Immigration Law Firm Marketing by City: Find Yours",
  description:
    "Local SEO, AI search, Meta and Google ads and AI intake for immigration law firms in Texas, Florida, Georgia, Virginia, Maryland and New Jersey.",
  path: "/immigration-law-firm-marketing/",
});

export default function ImmigrationHubPage() {
  return (
    <LocationHub
      practice="immigration"
      intro="We help immigration law firms sign more retained clients with local SEO, AI search, Meta and Google ads and AI intake, built for the communities each city serves."
    />
  );
}
