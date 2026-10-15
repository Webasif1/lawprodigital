import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/case-studies";
import { services } from "@/content/services";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, site.url).toString();
  return [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    ...services.map((s) => ({ url: url(`/${s.slug}/`), changeFrequency: "monthly" as const, priority: 0.9 })),
    { url: url("/case-study/"), changeFrequency: "monthly", priority: 0.8 },
    ...caseStudies.map((c) => ({ url: url(`/${c.slug}/`), lastModified: c.published, changeFrequency: "yearly" as const, priority: 0.7 })),
    { url: url("/pricing/"), changeFrequency: "monthly", priority: 0.7 },
    { url: url("/about-us/"), changeFrequency: "yearly", priority: 0.6 },
    { url: url("/contact-us/"), changeFrequency: "yearly", priority: 0.6 },
  ];
}
