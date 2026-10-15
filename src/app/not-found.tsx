import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { services, serviceHref } from "@/content/services";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="bg-halo relative -mt-(--header-h) pt-(--header-h) text-ink">
      <div className="container-x section-y grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow text-brass">Error 404</p>
          <h1 className="mt-6 font-display-tight text-display text-navy">
            This page has <em className="marker text-brass">moved on.</em>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted">The page you’re looking for doesn’t exist. Try one of these instead.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/">Back to home</ButtonLink>
            <ButtonLink href="/case-study/" variant="ghost-light" arrow={false}>
              Read the case studies
            </ButtonLink>
          </div>
        </div>
        <nav aria-label="Services" className="lg:col-span-5 lg:pt-16">
          <ul className="grid border-t border-line">
            {services.map((s) => (
              <li key={s.slug} className="border-b border-line">
                <Link href={serviceHref(s.slug)} className="block py-4 font-display text-lg font-semibold hover:text-brass">
                  {s.navLabel}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
