"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { mainNav, site } from "@/content/site";
import { services, serviceHref } from "@/content/services";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowUpRightIcon, ChevronDownIcon } from "@/components/ui/icons";
import { MobileNav } from "./MobileNav";

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
  const dropdownOpen = servicesOpen;

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
  const openNow = () => {
    window.clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const closeSoon = () => {
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), 140);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-paper transition-[box-shadow,border-color] duration-300 ${
        scrolled ? "border-line" : "border-transparent"
      }`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-tag focus:bg-navy focus:px-4 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <div className={`container-x flex items-center justify-between gap-6 transition-[height] duration-300 ${scrolled ? "h-16" : "h-(--header-h)"}`}>
        <Link href="/" className="shrink-0" aria-label={`${site.name} — home`}>
          <Image
            src={site.logo.src}
            alt={site.logo.alt}
            width={site.logo.width}
            height={site.logo.height}
            priority
            sizes="(min-width: 640px) 200px, 180px"
            className={`w-auto transition-[height] duration-300 ${scrolled ? "h-10 sm:h-11" : "h-11 sm:h-12"}`}
          />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1 text-[0.94rem] font-medium">
            <li>
              <div ref={servicesRef} className="relative" onPointerEnter={openNow} onPointerLeave={closeSoon}>
                <button
                  type="button"
                  aria-expanded={dropdownOpen}
                  aria-controls={menuId}
                  onClick={() => (dropdownOpen ? setServicesOpen(false) : openNow())}
                  className={`flex items-center gap-1.5 rounded-tag px-3.5 py-2 transition-colors hover:bg-wash ${isServicePath ? "text-navy underline decoration-gold decoration-2 underline-offset-[10px]" : "text-ink"}`}
                >
                  Services
                  <ChevronDownIcon className={`size-4 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>
                <div
                  id={menuId}
                  hidden={!dropdownOpen}
                  className="absolute left-1/2 top-full w-144 -translate-x-1/2 pt-3"
                >
                  <div className="on-dark grid grid-cols-2 gap-1 rounded-card bg-navy p-3 text-paper shadow-[0_24px_60px_-20px_rgba(14,17,22,0.45)] motion-safe:animate-[fade_.35s_var(--ease-out-expo)_both]">
                    {services.map((s) => (
                      <Link
                        key={s.slug}
                        href={serviceHref(s.slug)}
                        onClick={() => setServicesOpen(false)}
                        aria-current={pathname === serviceHref(s.slug) ? "page" : undefined}
                        className="group rounded-field p-4 transition-colors hover:bg-white/7 aria-[current=page]:bg-white/7"
                      >
                        <span className="flex items-center justify-between font-semibold">
                          {s.navLabel}
                          <ArrowUpRightIcon className="size-4 text-gold opacity-0 transition-opacity group-hover:opacity-100" />
                        </span>
                        <span className="mt-1 block text-sm font-normal leading-snug text-mist">{s.summary}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </li>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="relative rounded-tag px-3.5 py-2 transition-colors hover:bg-wash aria-[current=page]:text-navy aria-[current=page]:underline aria-[current=page]:decoration-gold aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-[10px]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ButtonLink href={site.primaryCta.href}>{site.primaryCta.label}</ButtonLink>
          </div>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-tag ring-1 ring-line lg:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMenuFor(pathname)}
          >
            <span aria-hidden className="grid gap-1.5">
              <span className="block h-0.5 w-5 rounded bg-ink" />
              <span className="block h-0.5 w-5 rounded bg-ink" />
            </span>
          </button>
        </div>
      </div>
      <MobileNav open={mobileOpen} onClose={() => setMenuFor(null)} pathname={pathname} />
    </header>
  );
}
