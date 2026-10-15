import Image from "next/image";
import type { Block } from "@/content/case-studies";
import { caseStudyImage } from "@/lib/assets";
import { VideoTestimonial } from "@/components/sections/VideoTestimonial";

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-case">
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return <h2>{block.text}</h2>;
    case "h3":
      return <h3>{block.text}</h3>;
    case "p":
      return <p>{block.text}</p>;
    case "list": {
      const items = block.items.map((item) => <li key={item}>{item}</li>);
      return block.ordered ? <ol>{items}</ol> : <ul>{items}</ul>;
    }
    case "facts":
      return (
        <dl className="my-8 grid border-t border-ink sm:grid-cols-2">
          {block.items.map((f) => (
            <div key={f.label} className="border-b border-line py-4 sm:odd:pr-6 sm:even:pl-6 sm:even:border-l">
              <dt className="eyebrow text-muted">{f.label}</dt>
              <dd className="mt-1.5 font-semibold leading-snug">{f.value}</dd>
            </div>
          ))}
        </dl>
      );
    case "table":
      return (
        <div className="my-8 overflow-x-auto rounded-field ring-1 ring-line">
          <table className="w-full min-w-[28rem] border-collapse text-left [&_td]:align-baseline [&_th]:align-baseline">
            {block.caption && <caption className="caption-bottom px-5 py-3 text-left text-sm text-muted">{block.caption}</caption>}
            <thead className="bg-navy text-paper">
              <tr>
                {block.head.map((h) => (
                  <th key={h} scope="col" className="px-5 py-3.5 text-sm font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")} className="border-t border-line odd:bg-surface even:bg-wash/60">
                  {row.map((cell, ci) =>
                    ci === 0 ? (
                      <th key={ci} scope="row" className="px-5 py-3.5 font-medium">
                        {cell}
                      </th>
                    ) : (
                      <td key={ci} className="figure px-5 py-3.5 text-lg tracking-tight">
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout":
      return (
        <blockquote className="my-10 border-l-2 border-gold py-1 pl-6 font-display text-2xl leading-snug tracking-tight text-navy text-balance">
          {block.text}
        </blockquote>
      );
    case "image": {
      const src = caseStudyImage(block.file);
      if (!src) return null;
      return (
        <figure className="my-10">
          <Image src={src} alt={block.alt} width={block.width} height={block.height} sizes="(min-width: 1024px) 760px, 100vw" className="h-auto w-full rounded-field ring-1 ring-line" />
          {block.caption && <figcaption className="mt-3 text-sm text-muted">{block.caption}</figcaption>}
        </figure>
      );
    }
    case "video":
      return (
        <div className="on-dark my-10 rounded-card bg-navy p-6 sm:p-10">
          <VideoTestimonial youtubeId={block.youtubeId} title={block.title} />
        </div>
      );
  }
}
