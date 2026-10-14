import type { Metadata } from "next";
import { contact, site, socials } from "@/content/site";

export const ogImage = { url: "/brand/og.png", width: 1200, height: 630, alt: site.logo.alt };

/** Titles longer than this skip the brand suffix so they aren't truncated in search results. */
const SUFFIX_LIMIT = 48;

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Skip the "| Law Pro Digital" suffix (used when the title already names the brand). */
  absoluteTitle?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
};

export function pageMetadata({ title, description, path, absoluteTitle, type = "website", publishedTime }: PageMetaInput): Metadata {
  return {
    title: absoluteTitle || title.length > SUFFIX_LIMIT ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: site.name,
      type,
      locale: "en_US",
      images: [ogImage],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage.url] },
  };
}

export const absoluteUrl = (path: string) => new URL(path, site.url).toString();

export function organizationJsonLd() {
  const sameAs = socials.map((s) => s.href);
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#organization`,
    name: site.name,
    slogan: site.tagline,
    url: site.url,
    logo: absoluteUrl(site.logo.src),
    image: absoluteUrl(site.logo.src),
    description: site.description,
    ...(contact.email ? { email: contact.email } : {}),
    ...(contact.phone ? { telephone: contact.phone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
