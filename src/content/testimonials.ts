/**
 * Verified client testimonials only. The old homepage's "Michael H" quotes
 * contained an unfilled "[Your Agency Name]" placeholder and were not carried over.
 */
export const videoTestimonial = {
  youtubeId: "WJzkOR6Y-FE",
  /** Self-hosted copy of the video's YouTube thumbnail, so nothing loads from YouTube before play. */
  cover: "/images/video/chambers-law-firm-cover.jpg",
  client: "Chambers Law Firm",
  context: "Bankruptcy law · 6-month engagement",
} as const;
