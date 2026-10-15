"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { contact, mainNav, site } from "@/content/site";
import { services, serviceHref } from "@/content/services";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";

type Props = { open: boolean; onClose: () => void; pathname: string };

/** Full-screen mobile menu: focus-trapped, Escape to close, body scroll locked while open. */
export function MobileNav({ open, onClose, pathname }: Props) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const node = panel.current;
    const previous = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    node?.querySelector<HTMLElement>("button, a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !node) return;
      const focusables = node.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [open, onClose]);

  const linkClass = "block py-2 aria-[current=page]:text-brass";

  return (
    <div
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      inert={!open}
      className={`bg-halo fixed inset-0 z-60 flex flex-col overflow-y-auto text-ink xl:hidden ${
        // Visibility flips instantly on open (so focus can move in) and only after the fade on close.
        open
          ? "visible opacity-100 [transition:opacity_.5s_var(--ease-out-expo)]"
          : "invisible opacity-0 [transition:opacity_.5s_var(--ease-out-expo),visibility_0s_linear_.5s]"
      }`}
    >
      <div className="container-x flex h-(--header-h) shrink-0 items-center justify-between">
        <Logo tone="light" />
        <button type="button" onClick={onClose} aria-label="Close menu" className="grid size-11 place-items-center rounded-tag ring-1 ring-line">
          <span aria-hidden className="relative block size-5">
            <span className="absolute left-0 top-1/2 h-0.5 w-5 rotate-45 rounded bg-ink" />
            <span className="absolute left-0 top-1/2 h-0.5 w-5 -rotate-45 rounded bg-ink" />
          </span>
        </button>
      </div>

      <nav
        aria-label="Mobile"
        className={`container-x flex flex-1 flex-col gap-10 pb-10 pt-6 transition-transform duration-700 ease-out-expo ${open ? "translate-y-0" : "translate-y-6"}`}
      >
        <div>
          <p className="eyebrow text-brass">Services</p>
          <ul className="mt-3 grid gap-0.5 text-lg font-medium">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={serviceHref(s.slug)} aria-current={pathname === serviceHref(s.slug) ? "page" : undefined} className={linkClass}>
                  {s.navLabel}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <ul className="grid gap-1 border-t border-line pt-6 font-display text-3xl font-bold tracking-tight">
          <li>
            <Link href="/" aria-current={pathname === "/" ? "page" : undefined} className={linkClass}>
              Home
            </Link>
          </li>
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} aria-current={pathname === item.href || (item.href === "/case-study/" && pathname.startsWith(item.href)) ? "page" : undefined} className={linkClass}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-auto grid gap-4">
          <ButtonLink href={site.primaryCta.href} className="w-full">
            {site.primaryCta.label}
          </ButtonLink>
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="text-center text-muted">
              {contact.email}
            </a>
          )}
        </div>
      </nav>
    </div>
  );
}
