import { entitySentence, locationHref, locations, practiceHubs } from "@/content/locations";
import { plans } from "@/content/pricing";
import { services, serviceHref } from "@/content/services";
import { contact, site } from "@/content/site";
import { founder, proof } from "@/content/home";
import { getStories } from "@/lib/stories";

/**
 * /llms.txt — a plain-Markdown guide to the site for AI assistants and answer engines (llmstxt.org format).
 * Built from the same content files as the pages, so new services, stories and city pages appear automatically.
 */
export const dynamic = "force-static";

const url = (path: string) => new URL(path, site.url).toString();
const link = (title: string, path: string, note?: string) => `- [${title}](${url(path)})${note ? `: ${note}` : ""}`;

export function GET() {
  const stories = getStories();
  const byPractice = (p: keyof typeof practiceHubs) =>
    locations
      .filter((l) => l.practice === p)
      .map((l) => link(`${practiceHubs[p].label} in ${l.city}, ${l.stateCode}`, locationHref(l), l.metaDescription));

  const lines = [
    `# ${site.name}`,
    "",
    `> ${entitySentence}`,
    "",
    "Key facts:",
    "",
    "- Works only with law firms: immigration first, plus personal injury and bankruptcy firms.",
    "- Services: SEO and local SEO, AI search optimization (AEO/GEO), AI-based marketing, Google Ads and Local Services Ads, Facebook and Instagram ads, AI client intake, content writing, website design, branding and video marketing.",
    "- Measures results by cost per signed client, reported in one monthly scorecard. No long contracts.",
    `- Plans start at $${plans[0].price.toLocaleString("en-US")} a month plus ad spend; custom packages are available.`,
    ...proof.stats.map((s) => `- ${s.prefix ?? ""}${s.value.toLocaleString("en-US")}${s.suffix ?? ""}: ${s.label} (source: ${url(s.href)}).`),
    `- Founder: ${founder.name}, ${founder.role}.`,
    `- Clients are described anonymously (for example "a US immigration law firm"); figures come from client records and are linked to their case studies.`,
    contact.email ? `- Contact: ${contact.email}${contact.phone ? `, ${contact.phone}` : ""}. Free strategy call: ${url(site.primaryCta.href)}` : "",
    "",
    "## Services",
    "",
    ...services.map((s) => link(s.navLabel, serviceHref(s.slug), s.summary)),
    link("AI client intake", "/ai-solutions/", "AI chat on the website, WhatsApp and Messenger that replies in seconds and books consultations"),
    link("Pricing", "/pricing/", "Monthly plans and custom packages"),
    "",
    "## Case studies",
    "",
    ...stories.map((s) => link(s.title, s.href, s.metaDescription)),
    "",
    "## Immigration law firm marketing by city",
    "",
    link(practiceHubs.immigration.label + " by city", `/${practiceHubs.immigration.slug}/`),
    ...byPractice("immigration"),
    "",
    "## Personal injury and bankruptcy law firm marketing by city",
    "",
    link(practiceHubs["personal-injury"].label + " by city", `/${practiceHubs["personal-injury"].slug}/`),
    ...byPractice("personal-injury"),
    "",
    "## Company",
    "",
    link("About Law Pro Digital", "/about-us/"),
    link("Contact and free strategy call", "/contact-us/"),
    "",
    "## Optional",
    "",
    link("Sitemap", "/sitemap.xml"),
    link("Privacy policy", "/privacy-policy/"),
    link("Terms", "/terms/"),
    "",
  ];

  return new Response(lines.filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
