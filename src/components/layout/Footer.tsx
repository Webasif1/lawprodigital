import Image from "next/image";
import Link from "next/link";
import { contact, quickLinks, site, socials } from "@/content/site";
import { services, serviceHref } from "@/content/services";
import { cities } from "@/content/home";
import { ButtonLink } from "@/components/ui/Button";

export function Footer() {
  const hasContact = Boolean(contact.email || contact.phone || contact.offices?.length);
  const year = new Date().getFullYear();

  return (
    <footer className="grain bg-ink text-paper">
      <div className="container-x pt-20 pb-10">
        <div className="grid gap-12 border-b border-white/10 pb-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            {/* The logo's navy wordmark needs a light surface, so it sits on a paper tile. */}
            <Link href="/" className="inline-block rounded-2xl bg-paper px-5 py-4" aria-label={`${site.name} — home`}>
              <Image src={site.logo.src} alt={site.logo.alt} width={site.logo.width} height={site.logo.height} sizes="240px" className="h-12 w-auto" />
            </Link>
            <p className="mt-8 max-w-sm text-lg leading-relaxed text-mist">
              Digital marketing exclusively for law firms — SEO, PPC, websites, social and video that bring clients through your door.
            </p>
            <ButtonLink href={site.primaryCta.href} className="mt-8">
              {site.primaryCta.label}
            </ButtonLink>
          </div>

          <nav aria-label="Services" className="lg:col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Services</h2>
            <ul className="mt-5 grid gap-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={serviceHref(s.slug)} className="text-paper/80 transition-colors hover:text-gold">
                    {s.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Quick links" className="lg:col-span-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Quick Links</h2>
            <ul className="mt-5 grid gap-3">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-paper/80 transition-colors hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Contact</h2>
            <ul className="mt-5 grid gap-3 text-paper/80">
              {contact.phone && (
                <li>
                  <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} className="hover:text-gold">
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact.email && (
                <li>
                  <a href={`mailto:${contact.email}`} className="break-all hover:text-gold">
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.offices?.map((o) => (
                <li key={o.label}>
                  <span className="block text-sm font-semibold text-paper">{o.label}</span>
                  <address className="not-italic">{o.lines.join(", ")}</address>
                </li>
              ))}
              {!hasContact && (
                <li>
                  <Link href="/contact-us/" className="hover:text-gold">
                    Send us a message
                  </Link>
                </li>
              )}
            </ul>
            {socials.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-3">
                {socials.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-sm text-paper/80 underline-offset-4 hover:text-gold hover:underline">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="py-8">
          <h2 className="sr-only">Cities we serve</h2>
          <p className="text-sm leading-relaxed text-mist">
            <span className="font-semibold text-paper">Serving law firms in </span>
            {cities.join(" · ")}
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="font-display italic text-paper/70">{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
