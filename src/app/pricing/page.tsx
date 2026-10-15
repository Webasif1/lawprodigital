import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";
import { plans, pricing } from "@/content/pricing";
import { site } from "@/content/site";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Pricing — Law Firm Marketing Plans",
  description: "The question is not \"How much does it cost?\" The real question is, \"How many new cases will this generate?\"",
  path: "/pricing/",
});

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Pricing", path: "/pricing/" }]),
          {
            "@context": "https://schema.org",
            "@type": "OfferCatalog",
            name: `${site.name} marketing plans`,
            url: absoluteUrl("/pricing/"),
            itemListElement: plans.map((p) => ({
              "@type": "Offer",
              name: p.name,
              description: p.features.join("; "),
              seller: { "@id": `${site.url}/#organization` },
              priceSpecification: { "@type": "UnitPriceSpecification", price: p.price, priceCurrency: "USD", unitText: "MONTH" },
            })),
          },
        ]}
      />
      <PageHero
        eyebrow={pricing.eyebrow}
        crumbs={[{ name: "Pricing", path: "/pricing/" }]}
        title={
          <>
            Plans for every stage of <em className="marker text-brass">your firm.</em>
          </>
        }
        intro={pricing.intro}
      />

      <section aria-label="Plans" className="bg-paper">
        <div className="container-x section-y">
          <ul className="grid items-stretch gap-5 lg:grid-cols-3">
            {plans.map((plan, i) => {
              const dark = Boolean(plan.featured);
              return (
                <li
                  key={plan.name}
                  data-reveal
                  style={{ ["--reveal-i" as string]: i }}
                  className={`relative flex flex-col rounded-card p-7 sm:p-9 ${dark ? "on-dark bg-navy text-white shadow-[0_30px_70px_-35px_rgba(9,20,40,0.6)]" : "bg-surface ring-1 ring-line"}`}
                >
                  <p className={`eyebrow tabular-nums ${dark ? "text-gold" : "text-brass"}`}>{String(i + 1).padStart(2, "0")}</p>
                  <h2 className="mt-4 font-display text-h3 font-bold">{plan.name}</h2>
                  <p className={`mt-3 leading-relaxed lg:min-h-[3lh] ${dark ? "text-mist" : "text-muted"}`}>{plan.fit}</p>
                  <p className={`mt-6 flex flex-wrap items-baseline gap-x-2 border-t pt-6 ${dark ? "border-white/15" : "border-line"}`}>
                    <span className={`figure text-figure ${dark ? "text-gold" : "text-navy"}`}>{usd(plan.price)}</span>
                    <span className={dark ? "text-mist" : "text-muted"}>/ month {plan.priceNote}</span>
                  </p>
                  <ul className="mt-8 grid flex-1 content-start gap-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-3 leading-snug">
                        <CheckIcon className={`mt-0.5 size-4 shrink-0 ${dark ? "text-gold" : "text-brass"}`} />
                        <span className={dark ? "text-white/90" : ""}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <ButtonLink href={site.primaryCta.href} variant={dark ? "gold" : "ink"} className="mt-10 w-full">
                    {site.primaryCta.label}
                  </ButtonLink>
                </li>
              );
            })}
          </ul>
          <p data-reveal className="mt-10 max-w-2xl text-muted">
            {pricing.note}
          </p>
        </div>
      </section>

      <CtaBand heading="Not sure which plan fits your firm?" text="Start with a free AI lead audit. We’ll show you where clients are slipping away and recommend a plan for your firm." />
    </>
  );
}
