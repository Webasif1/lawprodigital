import { readFileSync } from "node:fs";
import path from "node:path";
import { type Channel, type StoryVideo, storyMeta } from "@/content/stories";

/**
 * Parses `src/content/source/case-studies.md` (the long-form case study
 * library) into structured stories at build time. The document follows a
 * fixed pattern per story, so the copy and every number stay exactly as the
 * owner wrote them:
 *
 *   ## Story N · Label
 *   **URL:** … **Primary keyword:** … **SEO title:** … **Meta description:** …
 *   ### H1            *Subhead:* …      **Image (hero):** … *Alt text: …*
 *   **The short answer:** …             | 4-column stat table |
 *   #### Chapter …    (paragraphs, lists, tables, **Chart:**, **Image (…):** flows)
 *   #### FAQ          **Question?** Answer
 *   **CTA:** …
 *
 * Inline `**bold**` / `*italic*` markers are kept and rendered by <Rich>.
 */

export type StoryBlock =
  | { type: "p"; text: string }
  | { type: "why"; label: string; text: string }
  | { type: "note"; text: string }
  | { type: "list"; items: string[]; ordered: boolean }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "chart"; title: string; points: { label: string; value: number; note?: string; highlight: boolean }[]; source?: string }
  | { type: "flow"; steps: string[]; alt: string }
  | { type: "shot"; src: string; width: number; height: number; alt: string };

export type ChapterKind = "default" | "results" | "setback" | "takeaways" | "testimonial";

export type Chapter = { id: string; title: string; kind: ChapterKind; blocks: StoryBlock[] };

export type Story = {
  n: number;
  slug: string;
  href: string;
  label: string;
  keyword: string;
  seoTitle: string;
  metaDescription: string;
  title: string;
  subhead: string;
  heroAlt: string;
  shortAnswer: string;
  stats: { value: string; label: string }[];
  chapters: Chapter[];
  faqs: { q: string; a: string }[];
  cta: string;
  /** Where the figures come from, when the story has its own (`**Data note:**`); otherwise `privacyLine`. */
  dataNote: string;
  related: number[];
  image: string;
  service: { label: string; href: string };
  channel: Channel;
  firm: string;
  video?: StoryVideo;
};

/** Date of the case study library this content was taken from. */
export const STORIES_UPDATED = "2026-10-27";

export const privacyLine =
  "Client name withheld for confidentiality. Figures come from the firm's Meta Ads Manager, Google Analytics, Search Console, Google Business Profile, call-tracking and client-intake records. Qualified firms can see the live dashboards on their onboarding call.";

const SOURCE = path.join(process.cwd(), "src", "content", "source", "case-studies.md");

const unescape = (s: string) => s.replace(/\\([\\*#&[\]_\-.()>!|`~+])/g, "$1");
const stripBold = (s: string) => s.trim().replace(/^\*\*(.*)\*\*$/, "$1").trim();
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const isBlank = (s: string) => s.trim() === "";
const ulRe = /^\s*-\s+(.*)$/;
const olRe = /^\s*\d+\.\s+(.*)$/;
const altRe = /\*?Alt text:\s*(.*?)\.?\*?\s*$/;

function parseRow(line: string) {
  return line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => stripBold(unescape(c.trim())));
}

function chapterKind(title: string): ChapterKind {
  if (/didn.t|did not|failed|not to plan|honest|as well/i.test(title)) return "setback";
  if (/take from this/i.test(title)) return "takeaways";
  if (/testimonial/i.test(title)) return "testimonial";
  if (/result|numbers showed/i.test(title)) return "results";
  return "default";
}

function parseChart(raw: string): StoryBlock {
  const sourceMatch = raw.match(/\*Source:\s*(.*?)\*\s*$/);
  const body = raw.replace(/\*Source:.*$/, "").trim();
  const [title, list = ""] = body.split(/\s+—\s+/);
  const highlightQ3 = /Q3/.test(list);
  const points = list
    .replace(/\s*\([^)]*highlighted\)\.?\s*$/, "")
    .replace(/\.\s*$/, "")
    .split(/\s+·\s+/)
    .map((item) => {
      const [label, rest = ""] = item.split(/:\s+/);
      const num = rest.match(/[\d,.]+/)?.[0] ?? "0";
      const note = rest.replace(num, "").trim() || undefined;
      return { label: label.trim(), value: Number(num.replace(/,/g, "")), note, highlight: false };
    });
  if (highlightQ3) points.forEach((p) => (p.highlight = ["Jul", "Aug", "Sep"].includes(p.label)));
  else if (points.length) points.reduce((a, b) => (b.value > a.value ? b : a)).highlight = true;
  return { type: "chart", title: title.trim(), points, source: sourceMatch?.[1] };
}

function parseStory(n: number, label: string, lines: string[]): Omit<Story, "related"> {
  const meta = storyMeta[n];
  const story: Omit<Story, "related"> = {
    n,
    slug: "",
    href: "",
    label,
    keyword: "",
    seoTitle: "",
    metaDescription: "",
    title: "",
    subhead: "",
    heroAlt: "",
    shortAnswer: "",
    stats: [],
    chapters: [],
    faqs: [],
    cta: "",
    dataNote: "",
    image: meta?.image ?? "",
    service: meta?.service ?? { label: "Our services", href: "/" },
    channel: meta?.channel ?? "Strategy",
    firm: meta?.firm ?? "Multi-office US immigration firm",
    video: meta?.video,
  };

  let chapter: Chapter | null = null;
  const push = (block: StoryBlock) => chapter?.blocks.push(block);

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (isBlank(raw)) continue;
    const line = raw.trim();
    const text = unescape(line);

    // Tables: consume every consecutive "|" row.
    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const row = lines[i].trim();
        if (!/^\|\s*:?-/.test(row)) {
          const cells = parseRow(row);
          if (cells.some(Boolean)) rows.push(cells);
        }
        i++;
      }
      i--;
      if (!story.stats.length && !story.chapters.length && rows.length === 2) {
        story.stats = rows[0].map((value, k) => ({ value, label: rows[1][k] ?? "" }));
      } else if (rows.length) {
        push({ type: "table", head: rows[0], rows: rows.slice(1) });
      }
      continue;
    }

    // Lists: blank lines between items of the same kind don't end the list.
    const listKind = ulRe.test(raw) ? "ul" : olRe.test(raw) ? "ol" : null;
    if (listKind) {
      const re = listKind === "ul" ? ulRe : olRe;
      const items: string[] = [];
      while (i < lines.length) {
        if (isBlank(lines[i])) {
          let j = i;
          while (j < lines.length && isBlank(lines[j])) j++;
          if (j < lines.length && re.test(lines[j])) {
            i = j;
            continue;
          }
          break;
        }
        const m = lines[i].match(re);
        if (!m) break;
        items.push(unescape(m[1].trim()));
        i++;
      }
      i--;
      push({ type: "list", items, ordered: listKind === "ol" });
      continue;
    }

    if (line.startsWith("**URL:**")) {
      const m = text.match(/\*\*URL:\*\*\s*(\S+)\s*\*\*Primary keyword:\*\*\s*(.+?)\s*\*\*SEO title:\*\*\s*(.+?)\s*\*\*Meta description:\*\*\s*(.+?)\s*\*\*Schema:/);
      if (m) {
        story.href = m[1].endsWith("/") ? m[1] : `${m[1]}/`;
        story.slug = story.href.replace(/^\/case-study\//, "").replace(/\/$/, "");
        story.keyword = m[2];
        story.seoTitle = m[3];
        story.metaDescription = m[4];
      }
      continue;
    }
    if (line.startsWith("### ")) {
      story.title = stripBold(text.slice(4));
      continue;
    }
    if (line.startsWith("#### ")) {
      const title = stripBold(text.slice(5));
      chapter = title === "FAQ" ? null : { id: slugify(title), title, kind: chapterKind(title), blocks: [] };
      if (chapter) story.chapters.push(chapter);
      else story.chapters.push({ id: "faq", title: "FAQ", kind: "default", blocks: [] });
      continue;
    }
    if (line.startsWith("*Subhead:*")) {
      story.subhead = text.replace("*Subhead:*", "").trim();
      continue;
    }
    if (line.startsWith("**The short answer:**")) {
      story.shortAnswer = text.replace("**The short answer:**", "").trim();
      continue;
    }
    if (line.startsWith("**CTA:**")) {
      story.cta = text.replace("**CTA:**", "").trim().replace(/^\*|\*$/g, "");
      continue;
    }
    if (line.startsWith("**Data note:**")) {
      story.dataNote = text.replace("**Data note:**", "").trim();
      continue;
    }
    if (line.startsWith("**Chart:**")) {
      push(parseChart(text.replace("**Chart:**", "").trim()));
      continue;
    }
    const image = text.match(/^\*\*Image \(([^)]+)\):\*\*\s*(.*)$/);
    if (image) {
      const alt = image[2].match(altRe)?.[1] ?? "";
      // Screenshots: "**Image (screenshot):** folder/file.jpg 1600x731 *Alt text: …*" (file in /public/images/case-studies/).
      const shot = image[2].match(/^(\S+\.(?:jpg|png|webp))\s+(\d+)x(\d+)/);
      if (image[1] === "hero") story.heroAlt = alt;
      else if (shot) push({ type: "shot", src: `/images/case-studies/${shot[1]}`, width: Number(shot[2]), height: Number(shot[3]), alt });
      else {
        const flow = image[2].match(/\*([^*]*→[^*]*)\*/);
        if (flow) push({ type: "flow", steps: flow[1].split("→").map((s) => s.trim().replace(/\.$/, "")), alt });
      }
      continue;
    }
    if (/^\*?\[Internal/.test(text)) continue;

    // FAQ entries follow the "FAQ" chapter marker.
    const inFaq = story.chapters.at(-1)?.id === "faq";
    if (inFaq) {
      const q = text.match(/^\*\*(.+?)\*\*\s*(.*)$/);
      if (q) story.faqs.push({ q: q[1].trim(), a: q[2].trim() });
      continue;
    }

    const why = text.match(/^\*\*(Why it works[^*:]*):\*\*\s*(.*)$/);
    if (why) push({ type: "why", label: why[1], text: why[2].charAt(0).toUpperCase() + why[2].slice(1) });
    else if (/^\*[^*].*\*$/.test(text)) push({ type: "note", text: text.slice(1, -1) });
    else push({ type: "p", text });
  }

  story.chapters = story.chapters.filter((c) => c.id !== "faq");
  return story;
}

let cache: Story[] | null = null;

export function getStories(): Story[] {
  if (cache) return cache;
  const lines = readFileSync(SOURCE, "utf8").replace(/\r\n/g, "\n").split("\n");
  const starts: { n: number; label: string; at: number }[] = [];
  lines.forEach((line, at) => {
    const m = line.match(/^##\s+(?:\*\*)?Story (\d+) · (.+?)(?:\*\*)?\s*$/);
    if (m) starts.push({ n: Number(m[1]), label: unescape(m[2]), at });
  });

  const parsed = starts.map((s, k) => parseStory(s.n, s.label, lines.slice(s.at + 1, starts[k + 1]?.at ?? lines.length)));

  cache = parsed.map((story) => {
    // Related: stories this one mentions ("see Story 4"), then the same channel, then neighbours.
    const all = JSON.stringify(story.chapters) + story.shortAnswer;
    const mentioned = [...all.matchAll(/Story (\d+)/g)].map((m) => Number(m[1]));
    const sameChannel = parsed.filter((o) => o.channel === story.channel).map((o) => o.n);
    const order = [...mentioned, ...sameChannel, story.n + 1, story.n - 1, ...parsed.map((o) => o.n)];
    const related = [...new Set(order)].filter((n) => n !== story.n && parsed.some((o) => o.n === n)).slice(0, 3);
    return { ...story, related };
  });
  return cache;
}

export const getStory = (slug: string) => getStories().find((s) => s.slug === slug);
export const getStoryByNumber = (n: number) => getStories().find((s) => s.n === n);
