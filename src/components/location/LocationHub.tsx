import Link from "next/link";
import { entitySentence, locationHref, locations, type Practice, practiceHubs } from "@/content/locations";
import { site } from "@/content/site";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";

/** Practice hub: lists every city page for one practice, grouped by metro. */
export function LocationHub({ practice, intro }: { practice: Practice; intro: string }) {
  const hub = practiceHubs[practice];
  const path = `/${hub.slug}/`;
  const pages = locations.filter((l) => l.practice === practice);
  const byMetro = Object.entries(
    pages.reduce<Record<string, typeof pages>>((acc, l) => {
      (acc[l.metro] ??= []).push(l);
      return acc;
    }, {}),
  );

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${hub.label} by city`,
    itemListElement: pages.map((l, i) => ({ "@type": "ListItem", position: i + 1, name: `${hub.label} in ${l.city}, ${l.stateCode}`, url: absoluteUrl(locationHref(l)) })),
  };

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd([{ name: hub.label, path }]), itemList]} />
      <PageHero
        eyebrow={`${hub.short} law firms · by city`}
        crumbs={[{ name: hub.label, path }]}
        title={
          <>
            {hub.label} <em className="text-gold">in Your City</em>
          </>
        }
        intro={intro}
        actions={<ButtonLink href={site.primaryCta.href}>{site.primaryCta.label}</ButtonLink>}
      />
      <section aria-labelledby="cities-heading" className="bg-paper">
        <div className="container-x section-y">
          <SectionHeading eyebrow="Areas we serve" title={<span id="cities-heading">Find your city</span>} intro={entitySentence} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {byMetro.map(([metro, list]) => (
              <section key={metro} aria-labelledby={`metro-${list[0].slug}`} className="rounded-card bg-surface p-7 ring-1 ring-line">
                <h2 id={`metro-${list[0].slug}`} className="font-display text-xl font-bold">
                  {metro} area
                </h2>
                <ul className="mt-4 grid gap-2">
                  {list.map((l) => (
                    <li key={l.slug}>
                      <Link href={locationHref(l)} className="font-semibold text-navy underline decoration-gold underline-offset-4 hover:text-brass">
                        {`${hub.label} in ${l.city}, ${l.stateCode}`}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
