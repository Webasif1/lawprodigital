/**
 * Site-wide brand, navigation and contact details.
 *
 * Contact fields are optional on purpose: the previous site only had
 * placeholder values (e.g. "+000000000000000"). Anything left empty here is
 * simply not rendered, so no placeholder ever reaches production.
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
  description:
    "Law Pro Digital is a law firm marketing agency. SEO, ads, reviews and websites that help lawyers get more clients.",
  logo: { src: "/brand/logo.png", width: 501, height: 126, alt: "Law Pro Digital — Driving Clients To Your Door" },
  primaryCta: { label: "Book a free strategy call", href: "/contact-us/" },
} as const;

// TODO(owner): fill in real details. Empty values are hidden site-wide.
export const contact: ContactDetails = {
  email: undefined,
  phone: undefined,
  offices: [],
};

// TODO(owner): add real profile URLs. Empty list renders nothing.
export const socials: SocialLink[] = [];

export const mainNav: NavLink[] = [
  { label: "About", href: "/about-us/" },
  { label: "Case Studies", href: "/case-study/" },
  { label: "Contact", href: "/contact-us/" },
];

export const quickLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us/" },
  { label: "Case Studies", href: "/case-study/" },
  { label: "Contact Us", href: "/contact-us/" },
];
