import type { Metadata } from "next";
import { ChannelFilter } from "@/components/story/ChannelFilter";
import { StoryCard } from "@/components/story/StoryCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { channels } from "@/content/stories";
import { getStories, privacyLine } from "@/lib/stories";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Immigration Law Firm Marketing Case Studies: 16 Real Stories",
  description:
    "Sixteen long-form case studies from one multi-office US immigration law firm: Meta Ads, SEO, AI search, Google Maps, webinars and video, followed all the way to signed clients.",
  path: "/case-study/",
});

const channelId = (c: string) => c.toLowerCase().replace(/[^a-z]+/g, "-");

export default function CaseStudiesPage() {
  const stories = getStories();
  const [flagship, ...rest] = stories;
  const filterCss = channels
    .map((c) => `#stories[data-filter="${channelId(c)}"] [data-channel]:not([data-channel="${channelId(c)}"]){display:none}`)
    .join("");

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Case Studies", path: "/case-study/" }]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: stories.map((s, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(s.href), name: s.title })),
          },
        ]}
      />
      <style>{filterCss}</style>
      <PageHero
        eyebrow="Case studies"
        crumbs={[{ name: "Case Studies", path: "/case-study/" }]}
        title={
          <>
            Sixteen stories. <em className="marker text-brass">One immigration firm.</em> Every number traced to a signed client.
          </>
        }
        intro="How a multi-office US immigration law firm went from 79 to an average of 115 signed clients a month, told chapter by chapter: what we tried, what worked, what didn't, and what your firm can take from it."
        aside={
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card bg-line shadow-[0_30px_60px_-35px_rgba(15,31,61,0.35)] ring-1 ring-line">
            {[
              ["+45%", "Signed clients per month"],
              ["915", "New clients in 9 months"],
              ["15,738", "Ad conversations & leads"],
              ["$0.44", "Per international contact"],
            ].map(([v, l]) => (
              <div key={l} className="flex flex-col bg-white/90 p-5">
                <dt className="order-2 mt-2 text-xs text-muted">{l}</dt>
                <dd className="figure text-3xl text-navy">{v}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <section aria-label="All case studies" className="bg-paper">
        <div className="container-x section-y">
          <StoryCard story={flagship} size="feature" headingLevel="h2" />

          <div className="mt-20 flex flex-col gap-6 border-t border-line pt-10 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="font-display-tight text-h3">Browse by channel</h2>
            <ChannelFilter
              target="stories"
              total={rest.length}
              channels={channels
                .map((c) => ({ id: channelId(c), label: c, count: rest.filter((s) => s.channel === c).length }))
                .filter((c) => c.count > 0)}
            />
          </div>

          <div id="stories" data-filter="all" className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((story) => (
              <div key={story.slug} data-channel={channelId(story.channel)}>
                <StoryCard story={story} headingLevel="h2" />
              </div>
            ))}
          </div>

          <p className="mt-14 max-w-3xl text-sm leading-relaxed text-muted">{privacyLine}</p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
