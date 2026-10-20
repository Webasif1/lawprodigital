"use client";

import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { site, whatsappUrl } from "@/content/site";
import { trackWhatsApp } from "@/lib/analytics";

type Props = {
  /** slug → service name, so a service page can name the service in the message. */
  services: Record<string, string>;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
};

const host = site.url.replace(/^https?:\/\//, "");

/** The prefilled message: says which service (or page) the visitor was looking at. */
function message(pathname: string, service: string | undefined, pageTitle?: string) {
  const page = `${host}${pathname}`;
  if (service) return `Hi ${site.name}, I'm interested in ${service}. (Page: ${page})`;
  if (pathname.startsWith("/contact-us")) return `Hi ${site.name}, I'd like to talk about growing my law firm. (From the contact page)`;
  if (pageTitle && pathname !== "/") return `Hi ${site.name}, I was reading "${pageTitle}" and have a question. (Page: ${page})`;
  return `Hi ${site.name}, I'd like to talk about growing my law firm. (Page: ${page})`;
}

/**
 * Opens a WhatsApp chat with the page the visitor came from written into the first
 * message, so the team sees which service or case study they were reading.
 */
export function WhatsAppLink({ services, className, children, ...rest }: Props) {
  const pathname = usePathname() || "/";
  const service = services[pathname.replace(/^\/|\/$/g, "")];
  const href = whatsappUrl(message(pathname, service));
  if (!href) return null;

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // The page title is only known in the browser; add it at click time.
    const title = document.title.split(" | ")[0]?.trim();
    const withTitle = whatsappUrl(message(pathname, service, title));
    if (withTitle) e.currentTarget.href = withTitle;
    trackWhatsApp({ page: pathname, service });
  };

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className} {...rest}>
      {children}
      <span className="sr-only"> (opens WhatsApp in a new tab)</span>
    </a>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.43 9.43 0 0 1-4.8-1.32l-.35-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44 2.52 0 4.89.99 6.68 2.77a9.38 9.38 0 0 1 2.76 6.68c0 5.21-4.24 9.44-9.45 9.44zm8.04-17.48A11.3 11.3 0 0 0 12.05.7C5.78.7.68 5.8.68 12.06c0 2 .52 3.96 1.52 5.68L.6 23.3l5.7-1.5a11.33 11.33 0 0 0 5.74 1.47h.01c6.27 0 11.37-5.1 11.37-11.37 0-3.04-1.18-5.89-3.33-8.04z" />
    </svg>
  );
}

/** The floating button. Bottom-left, so it never sits on the chat launcher (bottom-right). */
export function WhatsAppButton({ services }: { services: Record<string, string> }) {
  return (
    <WhatsAppLink
      services={services}
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-4 left-4 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_18px_40px_-16px_rgba(8,18,38,0.7)] ring-1 ring-black/5 transition-transform duration-(--dur-fast) hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy sm:bottom-6 sm:left-6"
    >
      <WhatsAppIcon className="size-7" />
    </WhatsAppLink>
  );
}
