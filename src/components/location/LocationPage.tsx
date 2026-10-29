import Link from "next/link";
import { videoTestimonial } from "@/content/testimonials";
import { entitySentence, getLocation, injuryProof, type Location, locationHref, locationProof, practiceHubs } from "@/content/locations";
import { contact, site } from "@/content/site";
import { founder } from "@/content/home";
import { ContactForm } from "@/app/contact-us/ContactForm";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqList } from "@/components/sections/FaqList";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { VideoTestimonial } from "@/components/sections/VideoTestimonial";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { absoluteUrl, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

/**
 * Local landing page template. Section order follows the "content structure for Google and AI ranking"
 * in the Local SEO Page Plan: answer first, local data, problems, services, process, proof,
 * comparison, areas served, pricing, FAQ, final CTA.
 */
export function LocationPage({ location: l }: { location: Location }) {
  const hub = practiceHubs[l.practice];
  const path = locationHref(l);
  const place = `${l.city}, ${l.stateCode}`;
  const proof = l.practice === "immigration" ? locationProof : injuryProof;
  const related = l.related.map((slug) => getLocation(l.practice, slug)).filter((x): x is Location => Boolean(x));

  const jsonLd: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `${hub.label} in ${place}`,
      serviceType: hub.label,
      description: l.metaDescription,
      url: absoluteUrl(path),
      provider: { "@id": `${site.url}/#organization` },
      areaServed: [
        { "@type": "City", name: l.city, containedInPlace: { "@type": "State", name: l.state } },
        ...l.neighbors.map((n) => ({ "@type": "Place", name: `${n}, ${l.stateCode}` })),
      ],
      audience: { "@type": "Audience", audienceType: `${hub.short} law firms` },
      offers: { "@type": "Offer", priceCurrency: "USD", price: "1500", description: "Monthly plans from $1,500 plus ad spend", url: absoluteUrl("/pricing/") },
    },
    breadcrumbJsonLd([
      { name: hub.label, path: `/${hub.slug}/` },
      { name: place, path },
    ]),
    faqJsonLd(l.faq),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${absoluteUrl(path)}#webpage`,
      url: absoluteUrl(path),
      name: l.metaTitle,
      description: l.metaDescription,
      inLanguage: "en-US",
      isPartOf: { "@type": "WebSite", url: site.url, name: site.name },
      about: { "@id": `${site.url}/#organization` },
      reviewedBy: { "@id": `${site.url}/#founder` },
      dateModified: l.updated,
      speakable: { "@type": "SpeakableSpecification", cssSelector: ["#location-answer"] },
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* 1. Hero: H1 + 40–60 word direct answer */}
      <PageHero
        eyebrow={l.eyebrow}
        crumbs={[
          { name: hub.label, path: `/${hub.slug}/` },
          { name: place, path },
        ]}
        title={
          <>
            {l.h1.lead} <em className="text-gold">{l.h1.emphasis}</em>
          </>
        }
        intro={<span id="location-answer">{l.answer}</span>}
        actions={
          <>
            <ButtonLink href="#contact">{site.primaryCta.label}</ButtonLink>
            <ButtonLink href="/case-study/" variant="ghost-dark" arrow={false}>
              See case studies
            </ButtonLink>
          </>
        }
      />

      {/* 2. Proof strip + entity sentence */}
      <section aria-label="Results" className="border-b border-line bg-paper">
        <div className="container-x py-12">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {proof.map((p) => (
              <li key={p.label}>
                <Link href={p.href} className="group block h-full rounded-card bg-surface p-6 ring-1 ring-line transition-colors hover:ring-navy">
                  <span className="figure block font-display text-3xl font-bold tabular-nums text-navy">{p.value}</span>
                  <span className="mt-2 block leading-snug text-muted group-hover:text-ink">{p.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-ink/80">{entitySentence}</p>
          <p className="mt-3 text-sm text-muted">
            Reviewed by{" "}
            <Link href="/about-us/" className="font-semibold text-navy underline decoration-gold underline-offset-4">
              {founder.name}
            </Link>
            , {founder.role} · Updated{" "}
            <time dateTime={l.updated}>{new Date(l.updated + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
          </p>
        </div>
      </section>

      {/* 3. Local market data */}
      <section aria-labelledby="market-heading" className="bg-wash">
        <div className="container-x section-y">
          <SectionHeading eyebrow={`The ${l.city} market`} title={<span id="market-heading">{l.market.heading}</span>} intro={l.market.intro} />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {l.market.stats.map((s) => (
              <li key={s.label} className="flex flex-col rounded-card bg-surface p-6 ring-1 ring-line">
                <span className="figure font-display text-4xl font-bold tabular-nums text-navy">{s.value}</span>
                <span className="mt-3 leading-snug">{s.label}</span>
                <a href={s.source.href} rel="noopener" target="_blank" className="mt-auto pt-4 text-sm text-muted underline decoration-line underline-offset-4 hover:text-ink">
                  Source: {s.source.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-3xl border-l-2 border-gold pl-5 text-lg leading-relaxed">{l.market.note}</p>
        </div>
      </section>

      {/* 4. Local problems */}
      <section aria-labelledby="problems-heading" className="bg-paper">
        <div className="container-x section-y">
          <SectionHeading eyebrow="The problem" title={<span id="problems-heading">{l.problems.heading}</span>} intro={l.problems.intro} />
          <ol className="mt-12 grid gap-6 lg:grid-cols-3">
            {l.problems.items.map((p, i) => (
              <li key={p.title} className="rounded-card bg-surface p-7 ring-1 ring-line">
                <span className="figure text-sm tabular-nums text-brass">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-xl font-bold leading-snug">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Services: one H3 each, answer first */}
      <section aria-labelledby="services-heading" className="bg-wash">
        <div className="container-x section-y">
          <SectionHeading align="split" eyebrow="Services" title={<span id="services-heading">{l.services.heading}</span>} intro={l.services.intro} />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2">
            {l.services.items.map((s) => (
              <li key={s.title} className="flex flex-col gap-3 rounded-card bg-surface p-7 ring-1 ring-line">
                <h3 className="font-display text-xl font-bold leading-snug">{s.title}</h3>
                <p className="font-medium leading-relaxed">{s.answer}</p>
                <p className="leading-relaxed text-muted">{s.text}</p>
                {s.href && (
                  <Link href={s.href} className="mt-auto pt-2 text-sm font-semibold text-navy underline decoration-gold underline-offset-4 hover:text-brass">
                    {s.title} details
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Process */}
      <ProcessSection id="location-process-heading" eyebrow="How it works" heading={l.process.heading} intro={l.process.intro} steps={l.process.steps} />

      {/* 7. Proof: video testimonial + case study */}
      <section aria-labelledby="proof-heading" className="bg-paper">
        <div className="container-x section-y grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Proof" title={<span id="proof-heading">Real law firms, real signed clients</span>} />
            <p className="mt-6 text-lg leading-relaxed text-ink/80">
              A multi-office US law firm went from 79 to an average of 115 signed clients a month with the same system we bring to {l.city}: Meta Ads, SEO, AI search and AI intake, measured to signed retainers. Watch Timothy Chambers of Chambers Law Firm, a bankruptcy firm we rebuilt from scratch, describe working with us.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/case-study/immigration-law-firm-client-growth/">Read the 9-month story</ButtonLink>
              <ButtonLink href="/case-study/" variant="ghost-light" arrow={false}>
                All case studies
              </ButtonLink>
            </div>
          </div>
          <figure>
            <VideoTestimonial youtubeId={videoTestimonial.youtubeId} cover={videoTestimonial.cover} title={`Timothy Chambers of ${videoTestimonial.client} on working with Law Pro Digital`} />
            <figcaption className="mt-3 text-sm text-muted">
              {videoTestimonial.client} · {videoTestimonial.context}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 8. Comparison table */}
      <section aria-labelledby="compare-heading" className="bg-wash">
        <div className="container-x section-y">
          <SectionHeading eyebrow="Compare" title={<span id="compare-heading">{l.comparison.heading}</span>} intro={l.comparison.intro} />
          <div className="mt-10 overflow-x-auto rounded-card ring-1 ring-line">
            <table className="w-full min-w-[640px] border-collapse bg-surface text-left">
              <caption className="sr-only">{l.comparison.heading}</caption>
              <thead>
                <tr className="bg-navy text-paper">
                  <th scope="col" className="p-4 font-semibold">What you get</th>
                  <th scope="col" className="p-4 font-semibold text-gold">Law Pro Digital</th>
                  <th scope="col" className="p-4 font-semibold">General agency</th>
                  <th scope="col" className="p-4 font-semibold">Lead seller</th>
                </tr>
              </thead>
              <tbody>
                {l.comparison.rows.map((r) => (
                  <tr key={r.label} className="border-t border-line">
                    <th scope="row" className="p-4 font-medium">{r.label}</th>
                    <td className="p-4 font-semibold text-navy">{r.us}</td>
                    <td className="p-4 text-muted">{r.agency}</td>
                    <td className="p-4 text-muted">{r.leads}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 9. Areas served + 10. pricing pointer */}
      <section aria-labelledby="areas-heading" className="bg-paper">
        <div className="container-x section-y grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Areas we serve" title={<span id="areas-heading">{`Serving ${hub.firms} in ${l.city} and nearby`}</span>} />
            <ul className="mt-8 flex flex-wrap gap-3">
              {[l.city, ...l.neighbors].map((n) => (
                <li key={n} className="rounded-full bg-surface px-4 py-2 font-medium ring-1 ring-line">{n}</li>
              ))}
            </ul>
            <p className="mt-6 leading-relaxed text-muted">
              Part of our <Link href={`/${hub.slug}/`} className="font-semibold text-navy underline decoration-gold underline-offset-4">{hub.label.toLowerCase()}</Link> across the {l.metro} area and beyond.
            </p>
            {related.length > 0 && (
              <p className="mt-3 leading-relaxed text-muted">
                Nearby:{" "}
                {related.map((r, i) => (
                  <span key={r.slug}>
                    {i > 0 && " · "}
                    <Link href={locationHref(r)} className="font-semibold text-navy underline decoration-gold underline-offset-4">{`${r.city}, ${r.stateCode}`}</Link>
                  </span>
                ))}
              </p>
            )}
          </div>
          <div className="rounded-card bg-navy p-8 text-paper sm:p-10">
            <h2 className="font-display text-2xl font-bold">Plans from $1,500 a month, or a custom package</h2>
            <p className="mt-4 leading-relaxed text-mist">Plus ad spend if you run ads. Need a different mix? We build a custom package around your caseload, languages, offices and budget. No long contracts: every month you see cost per signed client in one scorecard.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="#contact">Ask for a custom package</ButtonLink>
              <ButtonLink href="/pricing/" variant="ghost-dark" arrow={false}>
                See pricing
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FAQ */}
      <FaqList items={l.faq} heading={`${l.city} ${hub.short.toLowerCase()} law firm marketing FAQ`} id="location-faq-heading" />

      {/* 12. Contact form + final CTA */}
      <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-24 bg-wash">
        <div className="container-x section-y grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Free strategy call" title={<span id="contact-heading">{l.closing.heading}</span>} intro={l.closing.text} />
            <ul className="mt-8 grid gap-3 text-lg">
              {contact.email && (
                <li>
                  Email:{" "}
                  <a href={`mailto:${contact.email}`} className="font-semibold text-navy underline decoration-gold underline-offset-4">
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.phone && (
                <li>
                  Phone:{" "}
                  <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} className="font-semibold text-navy underline decoration-gold underline-offset-4">
                    {contact.phone}
                  </a>
                </li>
              )}
            </ul>
            <p className="mt-6 leading-relaxed text-muted">Tell us your city, practice area and goals. We will send a short video audit of how your firm shows up on Google, Maps and ChatGPT, and a custom package proposal if you want one.</p>
          </div>
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>

      <CtaBand heading={l.closing.heading} text={l.closing.text} />

      <p className="container-x py-6 text-sm text-muted">
        Last updated <time dateTime={l.updated}>{new Date(l.updated + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
      </p>
    </>
  );
}
