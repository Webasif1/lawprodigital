"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { mainNav, site } from "@/content/site";
import { services, serviceHref } from "@/content/services";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowUpRightIcon, ChevronDownIcon } from "@/components/ui/icons";
import { MobileNav } from "./MobileNav";

/**
 * Every page opens on a navy surface, so the header is navy too: it reads as
 * part of the hero at the top and becomes a solid, blurred bar once scrolled.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const menuId = useId();
  const servicesRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  // The mobile menu is tied to the path it was opened on, so it closes itself on navigation.
  const mobileOpen = menuFor === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!servicesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setServicesOpen(false);
        servicesRef.current?.querySelector("button")?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!servicesRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [servicesOpen]);

  const isServicePath = services.some((s) => pathname === serviceHref(s.slug));
  const isCurrent = (href: string) => (href === "/case-study/" ? pathname.startsWith(href) : pathname === href);
  const openNow = () => {
    window.clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const closeSoon = () => {
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), 140);
  };

  const linkBase =
    "relative whitespace-nowrap rounded-tag px-3 py-2 text-white/80 transition-colors duration-(--dur-fast) hover:bg-white/7 hover:text-white aria-[current=page]:text-white";

  return (
    <>
    <header
      className={`on-dark sticky top-0 z-50 border-b text-white transition-[background-color,border-color] duration-300 ${
        scrolled ? "border-white/10 bg-navy/92 backdrop-blur-md" : "border-transparent bg-navy"
      }`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-tag focus:bg-gold focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <div className={`container-x flex items-center justify-between gap-6 transition-[height] duration-300 ${scrolled ? "h-16" : "h-(--header-h)"}`}>
        <Link href="/" className="shrink-0" aria-label={`${site.name} — home`}>
          <Logo tone="dark" />
        </Link>

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-0.5 text-[0.92rem] font-medium">
            <li>
              <div ref={servicesRef} className="relative" onPointerEnter={openNow} onPointerLeave={closeSoon}>
                <button
                  type="button"
                  aria-expanded={servicesOpen}
                  aria-controls={menuId}
                  onClick={() => (servicesOpen ? setServicesOpen(false) : openNow())}
                  className={`${linkBase} flex items-center gap-1.5 ${isServicePath ? "text-white" : ""}`}
                >
                  Services
                  <ChevronDownIcon className={`size-4 transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`} />
                </button>
                <div id={menuId} hidden={!servicesOpen} className="absolute left-1/2 top-full w-152 -translate-x-1/2 pt-3">
                  <div className="grid grid-cols-2 gap-1 rounded-card border border-line bg-surface p-3 text-ink shadow-[0_30px_70px_-25px_rgba(9,20,40,0.45)] motion-safe:animate-[fade_.35s_var(--ease-out-expo)_both]">
                    {services.map((s) => (
                      <Link
                        key={s.slug}
                        href={serviceHref(s.slug)}
                        onClick={() => setServicesOpen(false)}
                        aria-current={pathname === serviceHref(s.slug) ? "page" : undefined}
                        className="group rounded-field p-4 transition-colors hover:bg-paper aria-[current=page]:bg-paper"
                      >
                        <span className="flex items-center justify-between font-display font-bold tracking-tight">
                          {s.navLabel}
                          <ArrowUpRightIcon className="size-4 text-brass opacity-0 transition-opacity group-hover:opacity-100" />
                        </span>
                        <span className="mt-1 block text-sm font-normal leading-snug text-muted">{s.summary}</span>
                      </Link>
                    ))}
                    <Link
                      href="/ai-solutions/"
                      onClick={() => setServicesOpen(false)}
                      className="col-span-2 mt-1 flex items-center justify-between rounded-field bg-navy px-4 py-3.5 text-sm text-white transition-colors hover:bg-navy-2"
                    >
                      <span>
                        <span className="font-semibold">AI intake assistant</span>
                        <span className="text-mist"> · replies to every inquiry in seconds, day or night</span>
                      </span>
                      <ArrowUpRightIcon className="size-4 text-gold" />
                    </Link>
                  </div>
                </div>
              </div>
            </li>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined} className={linkBase}>
                  {item.label}
                  <span
                    aria-hidden
                    className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded bg-gold transition-transform duration-300 ${isCurrent(item.href) ? "scale-x-100" : "scale-x-0"}`}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ButtonLink href={site.primaryCta.href} className="min-h-11">
              {site.primaryCta.label}
            </ButtonLink>
          </div>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-tag ring-1 ring-white/20 xl:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMenuFor(pathname)}
          >
            <span aria-hidden className="grid gap-1.5">
              <span className="block h-0.5 w-5 rounded bg-white" />
              <span className="block h-0.5 w-3.5 justify-self-end rounded bg-gold" />
            </span>
          </button>
        </div>
      </div>
    </header>
    {/* Outside the header: its scrolled backdrop-blur would otherwise trap this fixed, full-screen panel inside the header box. */}
    <MobileNav open={mobileOpen} onClose={() => setMenuFor(null)} pathname={pathname} />
    </>
  );
}
