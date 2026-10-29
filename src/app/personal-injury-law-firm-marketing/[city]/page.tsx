import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocationPage } from "@/components/location/LocationPage";
import { getLocation, locationHref, locations } from "@/content/locations";
import { pageMetadata } from "@/lib/seo";

/** Personal injury location pages, e.g. /personal-injury-law-firm-marketing/brandon-fl/. Unknown cities are a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return locations.filter((l) => l.practice === "personal-injury").map((l) => ({ city: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const l = getLocation("personal-injury", city);
  if (!l) return {};
  return pageMetadata({ title: l.metaTitle, description: l.metaDescription, path: locationHref(l) });
}

export default async function InjuryCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const l = getLocation("personal-injury", city);
  if (!l) notFound();
  return <LocationPage location={l} />;
}
