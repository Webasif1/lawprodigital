import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { contact, socials } from "@/content/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us — Ready to Grow Your Law Firm? Let’s Talk",
  description:
    "Have questions? Want to learn how our specialized digital marketing services can bring more clients through your door? Our team at Law Pro Digital is here to help.",
  path: "/contact-us/",
});

const nextSteps = [
  "Tell us about your practice area, city and goals.",
  "Our team reviews your enquiry.",
  "We get back to you to arrange your free call.",
];

export default function ContactPage() {
  const hasDetails = Boolean(contact.email || contact.phone || contact.offices?.length || socials.length);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Contact Us", path: "/contact-us/" }])} />
      <PageHero
        eyebrow="Contact us"
        crumbs={[{ name: "Contact Us", path: "/contact-us/" }]}
        title={
          <>
            Ready to grow your law firm? <em className="text-gold">Let’s talk.</em>
          </>
        }
        intro="Have questions? Want to learn how our specialized digital marketing services can bring more clients through your door? Our team at Law Pro Digital is here to help."
      />
      <section aria-label="Contact form" className="bg-paper">
        <div className="container-x grid gap-14 py-20 sm:py-28 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-lg leading-relaxed text-ink/80">
              Whether you’re looking for more leads, better reviews, or a stronger online presence, we’re ready to build a strategy for your law firm.
            </p>
            <h2 className="eyebrow mt-12 text-brass">What happens next</h2>
            <ol className="mt-5 grid border-t border-line">
              {nextSteps.map((s, i) => (
                <li key={s} className="flex gap-4 border-b border-line py-4 text-lg leading-snug">
                  <span className="figure w-7 shrink-0 text-lg tabular-nums text-brass">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>

            {hasDetails && (
              <div className="mt-12 grid gap-6 border-t border-line pt-8">
                {contact.phone && (
                  <p>
                    <span className="block text-sm text-muted">Phone</span>
                    <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} className="font-display text-2xl tracking-tight hover:text-navy">
                      {contact.phone}
                    </a>
                  </p>
                )}
                {contact.email && (
                  <p>
                    <span className="block text-sm text-muted">Email</span>
                    <a href={`mailto:${contact.email}`} className="font-display text-2xl tracking-tight break-all hover:text-navy">
                      {contact.email}
                    </a>
                  </p>
                )}
                {contact.offices?.map((o) => (
                  <div key={o.label}>
                    <h3 className="text-sm text-muted">{o.label}</h3>
                    <address className="mt-1 not-italic leading-relaxed">
                      {o.lines.map((l) => (
                        <span key={l} className="block">
                          {l}
                        </span>
                      ))}
                    </address>
                  </div>
                ))}
                {socials.length > 0 && (
                  <ul className="flex flex-wrap gap-4">
                    {socials.map((s) => (
                      <li key={s.href}>
                        <a href={s.href} target="_blank" rel="noopener noreferrer" className="font-semibold underline-offset-4 hover:underline">
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
