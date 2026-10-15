import Link from "next/link";
import type { ReactNode } from "react";

type Crumb = { name: string; path: string };

type Props = {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  crumbs: Crumb[];
  actions?: ReactNode;
  aside?: ReactNode;
};

/** Navy inner-page header: breadcrumbs, eyebrow, H1 and intro with the same CSS-only entrance as the homepage hero. */
export function PageHero({ eyebrow, title, intro, crumbs, actions, aside }: Props) {
  return (
    <section className="on-dark relative overflow-hidden bg-navy text-paper">
      <div aria-hidden className="ledger-rules pointer-events-none absolute inset-0 mask-[linear-gradient(to_bottom,#000,transparent)]" />
      <div className="container-x relative pt-10 pb-16 sm:pt-12 sm:pb-24">
        <nav aria-label="Breadcrumb" className="hero-fade" style={{ ["--i" as string]: 0 }}>
          <ol className="flex flex-wrap items-center gap-2 text-sm text-mist">
            <li>
              <Link href="/" className="hover:text-gold">
                Home
              </Link>
            </li>
            {crumbs.map((c, i) => (
              <li key={c.path} className="flex items-center gap-2">
                <span aria-hidden className="text-white/30">
                  /
                </span>
                {i === crumbs.length - 1 ? (
                  <span aria-current="page" className="text-paper">
                    {c.name}
                  </span>
                ) : (
                  <Link href={c.path} className="hover:text-gold">
                    {c.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div className={`mt-14 grid gap-12 ${aside ? "lg:grid-cols-12 lg:items-end" : ""}`}>
          <div className={aside ? "lg:col-span-8" : "max-w-5xl"}>
            <p className="hero-fade eyebrow flex items-center gap-3 text-gold" style={{ ["--i" as string]: 0 }}>
              <span aria-hidden className="h-px w-8 bg-gold/70" />
              {eyebrow}
            </p>
            <h1 className="mt-6 font-display-tight text-h1 text-balance">
              <span className="hero-line">
                <span>{title}</span>
              </span>
            </h1>
            {intro && (
              <p className="hero-settle mt-7 max-w-2xl text-lead text-mist" style={{ ["--i" as string]: 1 }}>
                {intro}
              </p>
            )}
            {actions && (
              <div className="hero-fade mt-10 flex flex-wrap gap-3" style={{ ["--i" as string]: 2 }}>
                {actions}
              </div>
            )}
          </div>
          {aside && (
            <div className="hero-fade lg:col-span-4" style={{ ["--i" as string]: 2 }}>
              {aside}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
