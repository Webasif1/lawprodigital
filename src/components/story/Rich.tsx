import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { getStoryByNumber } from "@/lib/stories";

/**
 * Renders the small amount of inline markup the case study document uses:
 * `**bold**`, `*italic*`, and "Story N" cross-references, which become links
 * to that story's page.
 */
export function Rich({ text }: { text: string }) {
  return <>{renderInline(text)}</>;
}

function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|Story (\d+)/g;
  let last = 0;
  let k = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push(<Fragment key={k++}>{text.slice(last, m.index)}</Fragment>);
    if (m[1] !== undefined) out.push(<strong key={k++} className="font-semibold text-ink">{renderInline(m[1])}</strong>);
    else if (m[2] !== undefined) out.push(<em key={k++}>{renderInline(m[2])}</em>);
    else {
      const story = getStoryByNumber(Number(m[3]));
      out.push(
        story ? (
          <Link key={k++} href={story.href} className="font-medium text-navy-2 underline decoration-gold decoration-2 underline-offset-4 hover:text-brass">
            Story {m[3]}
          </Link>
        ) : (
          <Fragment key={k++}>{m[0]}</Fragment>
        ),
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(<Fragment key={k++}>{text.slice(last)}</Fragment>);
  return out;
}

/** Plain text (markers removed), for alt text, schema and meta. */
export const plain = (text: string) => text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1");
