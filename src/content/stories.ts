/**
 * Per-story settings that are not in the case study document itself: the
 * illustration, the matching service page and the channel used for filters.
 *
 * The stories' words and numbers live in `source/case-studies.md` (exported
 * from the "Case Study Library (Long-form)" Google Doc) and are parsed at
 * build time by `src/lib/stories.ts`. Edit that file to change the copy.
 */

export type Channel = "Strategy" | "Meta Ads" | "International" | "Search & AI" | "Video";

export const channels: Channel[] = ["Strategy", "Meta Ads", "International", "Search & AI", "Video"];

type StoryMeta = {
  /** File in /public/images/stories/. Illustrative image, not a photo of the client. */
  image: string;
  service: { label: string; href: string };
  channel: Channel;
};

const ppc = { label: "Meta & Google Ads for law firms", href: "/law-firm-ppc-agency/" };
const immSeo = { label: "SEO for immigration lawyers", href: "/immigration-lawyer-seo/" };
const seo = { label: "Law firm SEO & Google Maps", href: "/law-firm-seo/" };

/** Keyed by story number in the document. */
export const storyMeta: Record<number, StoryMeta> = {
  1: { image: "s01-signed-clients.jpg", service: ppc, channel: "Strategy" },
  2: { image: "s02-meta-ads.jpg", service: ppc, channel: "Meta Ads" },
  3: { image: "s03-cost-per-client.jpg", service: ppc, channel: "Meta Ads" },
  4: { image: "s04-busy-office.jpg", service: ppc, channel: "Meta Ads" },
  5: { image: "s05-international.jpg", service: ppc, channel: "International" },
  6: { image: "s06-dubai.jpg", service: immSeo, channel: "International" },
  7: { image: "s07-webinar.jpg", service: { label: "Social media for law firms", href: "/social-media-marketing/" }, channel: "International" },
  8: { image: "s08-asylum.jpg", service: ppc, channel: "Meta Ads" },
  9: { image: "s09-visa-bulletin.jpg", service: ppc, channel: "Meta Ads" },
  10: { image: "s10-visa-types.jpg", service: ppc, channel: "Meta Ads" },
  11: { image: "s11-second-chance.jpg", service: ppc, channel: "Meta Ads" },
  12: { image: "s12-seo-ai.jpg", service: immSeo, channel: "Search & AI" },
  13: { image: "s13-google-maps.jpg", service: seo, channel: "Search & AI" },
  14: { image: "s14-organic-leads.jpg", service: immSeo, channel: "Search & AI" },
  15: { image: "s15-video.jpg", service: { label: "Video marketing for law firms", href: "/video-marketing-for-law-firms/" }, channel: "Video" },
  16: { image: "s16-system.jpg", service: seo, channel: "Strategy" },
};

/** Old case study URLs and the story that now answers the same question (used for 301s). */
export const legacyCaseStudyRedirects: Record<string, string> = {
  "bankruptcy-law-firm-99-percent-lead-conversion": "",
  "how-i-generated-240000-in-projected-revenue-from-a-932-ad-spend-for-an-immigration-law-firm": "international-clients-us-immigration-lawyer",
  "us-immigration-leads-dubai-meta-ads-case-study": "us-immigration-lawyer-dubai-marketing",
  "e2-visa-lead-generation-for-us-immigration-lawyers-dubai": "us-immigration-lawyer-dubai-marketing",
  "google-call-ads-leads-immigration-lawyers-los-angeles": "law-firm-marketing-system-lessons",
};
