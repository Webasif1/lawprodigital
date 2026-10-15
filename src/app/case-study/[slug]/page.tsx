import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryPage } from "@/components/story/StoryPage";
import { getStories, getStory, STORIES_UPDATED } from "@/lib/stories";
import { storyImage } from "@/lib/assets";
import { pageMetadata } from "@/lib/seo";

/** The 16 long-form case study stories. Only known slugs are generated. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getStories().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/case-study/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) return {};
  const image = storyImage(story.image);
  return pageMetadata({
    title: story.seoTitle,
    description: story.metaDescription,
    path: story.href,
    absoluteTitle: true,
    type: "article",
    publishedTime: STORIES_UPDATED,
    image: image ? { url: image, width: 1344, height: 768, alt: story.heroAlt } : undefined,
  });
}

export default async function CaseStudyStoryPage({ params }: PageProps<"/case-study/[slug]">) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();
  return <StoryPage story={story} />;
}
