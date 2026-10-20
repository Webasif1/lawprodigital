import { describe, expect, it } from "vitest";
import { services } from "@/content/services";
import { legacyCaseStudyRedirects } from "@/content/stories";
import { breadcrumbJsonLd, faqJsonLd, founderJsonLd, organizationJsonLd, pageMetadata } from "@/lib/seo";
import { getStories } from "@/lib/stories";

describe("case study library", () => {
  const stories = getStories();

  it("parses all 16 stories with unique slugs and SEO fields", () => {
    expect(stories).toHaveLength(16);
    expect(new Set(stories.map((s) => s.slug)).size).toBe(16);
    for (const s of stories) {
      expect(s.href).toBe(`/case-study/${s.slug}/`);
      expect(s.seoTitle.length).toBeGreaterThan(10);
      expect(s.metaDescription.length).toBeGreaterThan(50);
      expect(s.chapters.length).toBeGreaterThan(0);
    }
  });

  it("points every legacy case study redirect at an existing story (or the library)", () => {
    const slugs = new Set(stories.map((s) => s.slug));
    for (const target of Object.values(legacyCaseStudyRedirects)) {
      if (target) expect(slugs.has(target)).toBe(true);
    }
  });
});

describe("services", () => {
  it("have unique slugs and distinct meta titles/descriptions", () => {
    expect(new Set(services.map((s) => s.slug)).size).toBe(services.length);
    expect(new Set(services.map((s) => s.metaTitle)).size).toBe(services.length);
    expect(new Set(services.map((s) => s.metaDescription)).size).toBe(services.length);
  });

  it("include the Meta Ads and AI search pages, each linked to real stories", () => {
    const numbers = new Set(getStories().map((s) => s.n));
    for (const slug of ["facebook-instagram-ads-for-law-firms", "ai-search-optimization-for-lawyers"]) {
      const service = services.find((s) => s.slug === slug);
      expect(service, slug).toBeDefined();
      expect(service!.relatedStories.length).toBeGreaterThan(0);
      for (const n of service!.relatedStories) expect(numbers.has(n), `${slug} → story ${n}`).toBe(true);
    }
  });

  it("don't collide with top-level routes", () => {
    const reserved = ["about-us", "ai-solutions", "api", "case-study", "contact-us", "pricing", "privacy-policy", "terms"];
    for (const s of services) expect(reserved).not.toContain(s.slug);
  });
});

describe("SEO helpers", () => {
  it("builds a canonical and OG metadata for a page", () => {
    const meta = pageMetadata({ title: "Short title", description: "Desc", path: "/x/" });
    expect(meta.alternates?.canonical).toBe("/x/");
    expect(meta.title).toBe("Short title");
    expect(pageMetadata({ title: "x".repeat(60), description: "d", path: "/" }).title).toEqual({ absolute: "x".repeat(60) });
  });

  it("emits JSON-LD without fabricated ratings or reviews", () => {
    const json = JSON.stringify([organizationJsonLd(), founderJsonLd(), breadcrumbJsonLd([{ name: "A", path: "/a/" }]), faqJsonLd([{ q: "q", a: "a" }])]);
    expect(json).not.toMatch(/aggregateRating|"review"/i);
    expect(breadcrumbJsonLd([{ name: "A", path: "/a/" }]).itemListElement[1].item).toBe("https://lawprodigital.com/a/");
  });
});

describe("founder schema", () => {
  it("links the Person and the Organization both ways", () => {
    const org = organizationJsonLd();
    const person = founderJsonLd();
    expect(person.name).toBe("Bellal Hosen");
    expect(org.founder["@id"]).toBe(person["@id"]);
    expect(person.worksFor["@id"]).toBe(org["@id"]);
  });
});
