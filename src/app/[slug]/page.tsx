import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPage } from "@/components/case-study/CaseStudyPage";
import { ServicePage } from "@/components/service/ServicePage";
import { caseStudies, getCaseStudy } from "@/content/case-studies";
import { getService, services } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

/**
 * Root-level pages from the original site: service pages and case studies
 * both lived directly under "/" (e.g. /website-design/, /bankruptcy-law-firm-…/).
 * Only known slugs are generated; anything else is a 404.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return [...services.map((s) => ({ slug: s.slug })), ...caseStudies.map((c) => ({ slug: c.slug }))];
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (service) {
    return pageMetadata({ title: service.metaTitle, description: service.metaDescription, path: `/${slug}/` });
  }
  const study = getCaseStudy(slug);
  if (study) {
    return pageMetadata({
      title: study.metaTitle,
      description: study.metaDescription,
      path: `/${slug}/`,
      type: "article",
      publishedTime: study.published,
    });
  }
  return {};
}

export default async function SlugPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (service) return <ServicePage service={service} />;
  const study = getCaseStudy(slug);
  if (study) return <CaseStudyPage study={study} />;
  notFound();
}
