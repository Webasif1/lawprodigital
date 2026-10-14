import type { ReactNode } from "react";

type Tone = "light" | "dark";

export function Eyebrow({ children, tone = "light" }: { children: ReactNode; tone?: Tone }) {
  return (
    <p
      className={`flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] ${
        tone === "dark" ? "text-gold" : "text-gold-deep"
      }`}
    >
      <span aria-hidden className="h-px w-8 bg-current" />
      {children}
    </p>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: Tone;
  as?: "h1" | "h2";
  align?: "left" | "split";
  className?: string;
};

/** Eyebrow + display heading + optional intro. "split" puts the intro beside the heading on large screens. */
export function SectionHeading({ eyebrow, title, intro, tone = "light", as: Tag = "h2", align = "left", className = "" }: SectionHeadingProps) {
  const introColor = tone === "dark" ? "text-mist" : "text-slate";
  return (
    <div className={`${align === "split" ? "grid gap-6 lg:grid-cols-12 lg:items-end" : "max-w-3xl"} ${className}`}>
      <div className={align === "split" ? "lg:col-span-7" : ""}>
        {eyebrow && (
          <div data-reveal className="mb-5">
            <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
          </div>
        )}
        <Tag data-reveal className="font-display-tight text-balance text-[clamp(2rem,4.6vw,3.75rem)]" style={{ ["--reveal-i" as string]: 1 }}>
          {title}
        </Tag>
      </div>
      {intro && (
        <p
          data-reveal
          className={`${align === "split" ? "lg:col-span-5 lg:pb-2" : "mt-6"} max-w-xl text-lg leading-relaxed ${introColor}`}
          style={{ ["--reveal-i" as string]: 2 }}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
