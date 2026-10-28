import type { MetadataRoute } from "next";
import { LEGAL_UPDATED } from "@/content/legal";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { getStories, STORIES_UPDATED } from "@/lib/stories";
import { locationHref, locations, practiceHubs } from "@/content/locations";

/**
 * When the main pages last changed (the custom-site relaunch). Bump it when you edit page
 * content, so Google and Bing know to re-crawl; a date that changes on every deploy gets ignored.
 */
const PAGES_UPDATED = "2026-10-28";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, site.url).toString();
  return [
    { url: url("/"), lastModified: PAGES_UPDATED, changeFrequency: "monthly", priority: 1 },
    ...services.map((s) => ({ url: url(`/${s.slug}/`), lastModified: PAGES_UPDATED, changeFrequency: "monthly" as const, priority: 0.9 })),
    { url: url("/ai-solutions/"), lastModified: PAGES_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    ...Object.values(practiceHubs).map((h) => ({ url: url(`/${h.slug}/`), lastModified: "2026-10-29", changeFrequency: "monthly" as const, priority: 0.8 })),
    ...locations.map((l) => ({ url: url(locationHref(l)), lastModified: l.updated, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: url("/case-study/"), lastModified: STORIES_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    ...getStories().map((s) => ({ url: url(s.href), lastModified: STORIES_UPDATED, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: url("/pricing/"), lastModified: PAGES_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/about-us/"), lastModified: PAGES_UPDATED, changeFrequency: "yearly", priority: 0.6 },
    { url: url("/contact-us/"), lastModified: PAGES_UPDATED, changeFrequency: "yearly", priority: 0.6 },
    { url: url("/privacy-policy/"), lastModified: LEGAL_UPDATED, changeFrequency: "yearly", priority: 0.2 },
    { url: url("/terms/"), lastModified: LEGAL_UPDATED, changeFrequency: "yearly", priority: 0.2 },
  ];
}
