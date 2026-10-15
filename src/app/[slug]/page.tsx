import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePage } from "@/components/service/ServicePage";
import { getService, services } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

/**
 * Service pages live at the root, as on the original site (e.g. /website-design/).
 * Case studies moved to /case-study/[slug]/; their old root URLs are 301s in next.config.ts.
 * Only known slugs are generated; anything else is a 404.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata({ title: service.metaTitle, description: service.metaDescription, path: `/${slug}/` });
}

export default async function SlugPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  return <ServicePage service={service} />;
}
