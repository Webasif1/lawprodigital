import Link from "next/link";
import { contact, quickLinks, site, socials } from "@/content/site";
import { services, serviceHref } from "@/content/services";
import { cities } from "@/content/home";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  const year = new Date().getFullYear();
  const linkClass = "text-white/75 transition-colors duration-(--dur-fast) hover:text-gold";

  return (
    <footer className="on-dark bg-navy-deep text-white">
      <div className="container-x pt-20 pb-10">
        <div className="grid gap-12 border-b border-white/10 pb-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" aria-label={`${site.name} — home`}>
              <Logo tone="dark" tagline />
            </Link>
            <p className="mt-8 max-w-md leading-relaxed text-mist">{site.description}</p>
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="mt-6 inline-block font-display text-xl font-bold tracking-tight text-white hover:text-gold">
                {contact.email}
              </a>
            )}
            {contact.phone && (
              <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} className="mt-2 block text-white/80 hover:text-gold">
                {contact.phone}
              </a>
            )}
          </div>

          <nav aria-label="Services" className="lg:col-span-3">
            <h2 className="eyebrow text-gold">Services</h2>
            <ul className="mt-5 grid gap-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={serviceHref(s.slug)} className={linkClass}>
                    {s.navLabel}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/ai-solutions/" className={linkClass}>
                  AI Intake Assistant
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Company" className="lg:col-span-2">
            <h2 className="eyebrow text-gold">Company</h2>
            <ul className="mt-5 grid gap-3">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <h2 className="eyebrow text-gold">Start here</h2>
            <p className="mt-5 text-sm leading-relaxed text-mist">
              A 5-minute video audit of how your firm shows up on Google, Maps and ChatGPT.
            </p>
            <Link href={site.primaryCta.href} className="mt-4 inline-flex items-center gap-2 font-semibold text-gold hover:text-gold-soft">
              {site.primaryCta.label} →
            </Link>
            {socials.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-3">
                {socials.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-sm text-white/75 underline-offset-4 hover:text-gold hover:underline">
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
            <span className="font-semibold text-white">Serving law firms in </span>
            {cities.join(" · ")}
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="font-display font-semibold text-white/70">{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
