import type { ReactNode } from "react";

type Tone = "light" | "dark";

/** Small label above a heading: a marker-highlighted pill, optionally numbered like a chapter. */
export function Eyebrow({ children, tone = "light", index }: { children: ReactNode; tone?: Tone; index?: number }) {
  return (
    <p
      className={`eyebrow inline-flex items-center gap-2.5 rounded-full px-3 py-1.5 ${
        tone === "dark" ? "bg-white/8 text-gold ring-1 ring-inset ring-white/10" : "bg-gold-wash text-brass"
      }`}
    >
      {index !== undefined ? (
        <span className="tabular-nums opacity-70">{String(index).padStart(2, "0")}</span>
      ) : (
        <span aria-hidden className="size-1.5 rounded-full bg-current" />
      )}
      {children}
    </p>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  /** Optional section number shown in the eyebrow (editorial "chapter" marker). */
  index?: number;
  title: ReactNode;
  intro?: ReactNode;
  tone?: Tone;
  as?: "h1" | "h2";
  align?: "left" | "split";
  className?: string;
};

/** Eyebrow + display heading + optional intro. "split" puts the intro beside the heading on large screens. */
export function SectionHeading({ eyebrow, index, title, intro, tone = "light", as: Tag = "h2", align = "left", className = "" }: SectionHeadingProps) {
  const introColor = tone === "dark" ? "text-mist" : "text-muted";
  return (
    <div className={`${align === "split" ? "grid gap-6 lg:grid-cols-12 lg:items-end" : "max-w-3xl"} ${className}`}>
      <div className={align === "split" ? "lg:col-span-7" : ""}>
        {eyebrow && (
          <div data-reveal className="mb-5">
            <Eyebrow tone={tone} index={index}>
              {eyebrow}
            </Eyebrow>
          </div>
        )}
        <Tag data-reveal className="font-display-tight text-h2 text-balance" style={{ ["--reveal-i" as string]: 1 }}>
          {title}
        </Tag>
      </div>
      {intro && (
        <p
          data-reveal
          className={`${align === "split" ? "lg:col-span-5 lg:pb-2" : "mt-6"} max-w-xl text-lead ${introColor}`}
          style={{ ["--reveal-i" as string]: 2 }}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
