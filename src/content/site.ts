/**
 * Site-wide brand, navigation and contact details.
 *
 * Contact fields are optional on purpose: anything left empty here is simply
 * not rendered, so no placeholder (like the old 555 number) reaches production.
 */

export type NavLink = { label: string; href: string };

export type ContactDetails = {
  email?: string;
  phone?: string;
  /** WhatsApp number, digits only with country code (the format wa.me expects). */
  whatsapp?: string;
  /** Rendered as separate lines. */
  offices?: { label: string; lines: string[] }[];
};

export type SocialLink = { label: "Facebook" | "Twitter" | "YouTube" | "LinkedIn" | "Instagram" | "TikTok" | "Upwork"; href: string };

export const site = {
  name: "Law Pro Digital",
  legalName: "Law Pro Digital",
  tagline: "Driving Clients To Your Door",
  url: "https://lawprodigital.com",
  /** Entity sentence: used identically on every page, LinkedIn and directories. */
  description:
    "Law Pro Digital is a digital growth agency for US immigration law firms, specializing in Meta Ads, SEO, AI search (AEO/GEO) and AI-powered client intake.",
  logo: { src: "/brand/logo-mark-512.png", width: 512, height: 512, alt: "Law Pro Digital logo" },
  primaryCta: { label: "Get a Free Call", href: "/contact-us/" },
} as const;

/**
 * Keep search engines off non-production copies. Production runs on cPanel, so any
 * Vercel deployment (lawprodigital.vercel.app, previews) is noindexed by default.
 * SITE_NOINDEX=true|false overrides this either way.
 */
export const noindex = process.env.SITE_NOINDEX ? process.env.SITE_NOINDEX === "true" : Boolean(process.env.VERCEL);

/** Where "Book a call" links go: the built-in calendar, unless NEXT_PUBLIC_BOOKING_URL points elsewhere. */
export const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || "/book-a-call/";
export const bookingIsExternal = /^https?:\/\//.test(bookingUrl);

export const contact: ContactDetails = {
  email: "hello@lawprodigital.com",
  whatsapp: "8801707873234",
  offices: [{ label: "New York", lines: ["60 Bay Street", "Staten Island, NY 10301", "United States"] }],
};

/** A wa.me link that opens a WhatsApp chat with `text` already typed in. */
export const whatsappUrl = (text: string) =>
  contact.whatsapp ? `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}` : undefined;

/** Official profiles. Also used as the Organization schema's sameAs. */
export const socials: SocialLink[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/lawprodigital/" },
  { label: "YouTube", href: "https://www.youtube.com/@LawProDigital" },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61579339467322" },
  { label: "Instagram", href: "https://www.instagram.com/lawprodigital/" },
  { label: "TikTok", href: "https://www.tiktok.com/@lawprodigital" },
];

/** Shown after the Services menu in the header. */
export const mainNav: NavLink[] = [
  { label: "Results", href: "/#results" },
  { label: "AI Solutions", href: "/ai-solutions/" },
  { label: "Case Studies", href: "/case-study/" },
  { label: "Locations", href: "/immigration-law-firm-marketing/" },
  { label: "Pricing", href: "/pricing/" },
  { label: "About", href: "/about-us/" },
];

export const quickLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us/" },
  { label: "AI Solutions", href: "/ai-solutions/" },
  { label: "Case Studies", href: "/case-study/" },
  { label: "Immigration Firms by City", href: "/immigration-law-firm-marketing/" },
  { label: "Pricing", href: "/pricing/" },
  { label: "Contact Us", href: "/contact-us/" },
];
