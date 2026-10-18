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
  /** Rendered as separate lines. */
  offices?: { label: string; lines: string[] }[];
};

export type SocialLink = { label: "Facebook" | "Twitter" | "YouTube" | "LinkedIn" | "Instagram"; href: string };

export const site = {
  name: "Law Pro Digital",
  legalName: "Law Pro Digital",
  tagline: "Driving Clients To Your Door",
  url: "https://lawprodigital.com",
  /** Entity sentence: used identically on every page, LinkedIn and directories. */
  description:
    "Law Pro Digital is a digital growth agency for US immigration law firms, specializing in Meta Ads, SEO, AI search (AEO/GEO) and AI-powered client intake.",
  logo: { src: "/brand/logo-mark-512.png", width: 512, height: 512, alt: "Law Pro Digital logo" },
  primaryCta: { label: "Get Your Free AI Lead Audit", href: "/contact-us/" },
} as const;

// TODO(owner): add the real phone number. Empty values are hidden site-wide.
export const contact: ContactDetails = {
  email: "lawprodigital@gmail.com",
  phone: undefined,
  offices: [],
};

// TODO(owner): add real LinkedIn, Facebook and YouTube URLs. Empty list renders nothing.
export const socials: SocialLink[] = [];

/** Shown after the Services menu in the header. */
export const mainNav: NavLink[] = [
  { label: "Results", href: "/#results" },
  { label: "AI Solutions", href: "/ai-solutions/" },
  { label: "Case Studies", href: "/case-study/" },
  { label: "Pricing", href: "/pricing/" },
  { label: "About", href: "/about-us/" },
];

export const quickLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us/" },
  { label: "AI Solutions", href: "/ai-solutions/" },
  { label: "Case Studies", href: "/case-study/" },
  { label: "Pricing", href: "/pricing/" },
  { label: "Contact Us", href: "/contact-us/" },
];
