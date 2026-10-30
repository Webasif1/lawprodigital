import type { MetadataRoute } from "next";
import { noindex, site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  if (noindex) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // SEO-tool crawlers that fetch whole sites in bursts; polite ones honour Crawl-delay
      // (seconds between requests). Rude ones are rate limited in src/proxy.ts.
      { userAgent: ["AhrefsBot", "SemrushBot", "MJ12bot", "DotBot", "BLEXBot", "DataForSeoBot"], allow: "/", crawlDelay: 10 },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
