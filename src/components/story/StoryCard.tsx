import Image from "next/image";
import Link from "next/link";
import type { Story } from "@/lib/stories";
import { storyImage } from "@/lib/assets";
import { ArrowUpRightIcon } from "@/components/ui/icons";

type Props = {
  story: Story;
  size?: "feature" | "default" | "compact";
  headingLevel?: "h2" | "h3";
  tone?: "light" | "dark";
};

/** Listing card: illustration, chapter-style kicker, headline and the story's lead figure. */
export function StoryCard({ story, size = "default", headingLevel: H = "h3", tone = "light" }: Props) {
  const src = storyImage(story.image);
  const stat = story.stats[0];
  const feature = size === "feature";
  const dark = tone === "dark";

  return (
    <article
      data-reveal
      className={`group relative flex h-full flex-col overflow-hidden rounded-card transition-[box-shadow,transform] duration-(--dur-base) ease-out-expo hover:-translate-y-1 ${
        dark ? "bg-navy-2/60 ring-1 ring-white/10" : "bg-surface ring-1 ring-line hover:shadow-[0_24px_50px_-28px_rgba(9,20,40,0.35)]"
      } ${feature ? "lg:grid lg:grid-cols-12" : ""}`}
    >
      <div className={`relative overflow-hidden bg-navy ${feature ? "aspect-16/10 lg:col-span-7 lg:aspect-auto lg:min-h-[28rem]" : size === "compact" ? "aspect-2/1" : "aspect-16/9"}`}>
        {src ? (
          <Image
            src={src}
            alt={story.heroAlt}
            fill
            sizes={feature ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-[1.04]"
          />
        ) : (
          <div aria-hidden className="ledger-rules absolute inset-0" />
        )}
        {stat && (
          <p className="absolute bottom-3 left-3 flex max-w-[calc(100%-1.5rem)] items-end gap-3 rounded-xl bg-navy/90 px-3.5 py-2.5 text-white">
            <span className={`figure shrink-0 leading-none text-gold ${feature ? "text-5xl sm:text-6xl" : stat.value.length > 7 ? "text-2xl" : "text-4xl"}`}>{stat.value}</span>
            <span className="max-w-[14rem] pb-0.5 text-xs leading-snug text-white/85">{stat.label}</span>
          </p>
        )}
      </div>
      <div className={`flex flex-1 flex-col p-6 ${feature ? "lg:col-span-5 lg:justify-center lg:p-10" : ""}`}>
        <p className={`eyebrow ${dark ? "text-gold" : "text-brass"}`}>
          Story {String(story.n).padStart(2, "0")} · {story.channel}
        </p>
        <H className={`mt-3 font-display font-bold tracking-tight text-balance ${feature ? "text-h2" : "text-xl leading-snug"} ${dark ? "text-white" : "text-ink"}`}>
          <Link href={story.href} className="after:absolute after:inset-0">
            {story.title}
          </Link>
        </H>
        {size !== "compact" && <p className={`mt-3 leading-relaxed ${dark ? "text-mist" : "text-muted"} ${feature ? "text-lead" : "text-[0.95rem]"}`}>{story.subhead}</p>}
        <span className={`mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold ${dark ? "text-gold" : "text-navy-2"}`}>
          Read the story
          <ArrowUpRightIcon className="size-4 transition-transform duration-(--dur-base) ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
