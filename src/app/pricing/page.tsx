import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
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
            Plans for every stage of <em className="text-gold">your firm.</em>
          </>
        }
        intro={pricing.intro}
      />

      <section aria-label="Plans" className="bg-paper">
        <div className="container-x section-y">
          <ul className="grid border-t border-ink lg:grid-cols-3">
            {plans.map((plan, i) => (
              <li
                key={plan.name}
                data-reveal
                style={{ ["--reveal-i" as string]: i }}
                className="flex flex-col border-b border-line py-10 lg:border-r lg:border-b-0 lg:px-10 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
              >
                <p className="eyebrow text-brass">
                  <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                </p>
                <h2 className="mt-4 font-display text-h3">{plan.name}</h2>
                <p className="mt-3 leading-relaxed text-muted lg:min-h-[2lh]">{plan.fit}</p>
                <p className="mt-8 flex items-baseline gap-2 border-t border-line pt-6">
                  <span className="figure text-figure text-navy">{usd(plan.price)}</span>
                  <span className="text-muted">/ month</span>
                </p>
                <ul className="mt-8 grid flex-1 content-start border-t border-line">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-4 border-b border-line py-3.5 leading-snug">
                      <span aria-hidden className="mt-2.5 h-0.5 w-4 shrink-0 bg-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
                <ButtonLink href={site.primaryCta.href} variant="ink" className="mt-10 w-full">
                  {site.primaryCta.label}
                </ButtonLink>
              </li>
            ))}
          </ul>
          <p data-reveal className="mt-10 max-w-2xl text-muted">
            {pricing.note}
          </p>
        </div>
      </section>

      <CtaBand heading="Not sure which plan fits your firm?" text="Tell us your practice area, your city and your goals. We’ll recommend a plan on a free call." />
    </>
  );
}
