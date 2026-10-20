/**
 * Measurement IDs. Each tool loads only when its ID is set, and next.config.ts opens the
 * CSP for that tool only. NEXT_PUBLIC_* values are inlined at build time, so set them
 * before `npm run build` (see docs/CPANEL_DEPLOYMENT.md).
 */
export const analyticsIds = {
  ga4: process.env.NEXT_PUBLIC_GA4_ID || undefined,
  gtm: process.env.NEXT_PUBLIC_GTM_ID || undefined,
  metaPixel: process.env.NEXT_PUBLIC_META_PIXEL_ID || undefined,
  clarity: process.env.NEXT_PUBLIC_CLARITY_ID || undefined,
};

type Directive = "script-src" | "connect-src" | "img-src" | "frame-src";

/** Extra CSP sources for the tools that are switched on. */
export function analyticsCspSources(): Record<Directive, string[]> {
  const out: Record<Directive, string[]> = { "script-src": [], "connect-src": [], "img-src": [], "frame-src": [] };
  const add = (d: Directive, ...hosts: string[]) => out[d].push(...hosts);
  const { ga4, gtm, metaPixel, clarity } = analyticsIds;
  if (ga4 || gtm) {
    add("script-src", "https://www.googletagmanager.com");
    add("connect-src", "https://*.google-analytics.com", "https://*.analytics.google.com", "https://www.googletagmanager.com");
    add("img-src", "https://*.google-analytics.com", "https://www.googletagmanager.com");
  }
  if (gtm) add("frame-src", "https://www.googletagmanager.com");
  if (metaPixel) {
    add("script-src", "https://connect.facebook.net");
    add("connect-src", "https://www.facebook.com", "https://connect.facebook.net");
    add("img-src", "https://www.facebook.com");
  }
  if (clarity) {
    add("script-src", "https://*.clarity.ms");
    add("connect-src", "https://*.clarity.ms");
    add("img-src", "https://*.clarity.ms", "https://c.bing.com");
  }
  for (const d of Object.keys(out) as Directive[]) out[d] = [...new Set(out[d])];
  return out;
}

type Win = Window & {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

/** A submitted lead. A no-op for any tool that isn't loaded. */
export function trackLead(params: { service?: string } = {}) {
  if (typeof window === "undefined") return;
  const w = window as Win;
  w.gtag?.("event", "generate_lead", { form_name: "free_ai_lead_audit", ...(params.service ? { service: params.service } : {}) });
  if (analyticsIds.gtm) w.dataLayer?.push({ event: "generate_lead", form_name: "free_ai_lead_audit", service: params.service });
  w.fbq?.("track", "Lead");
}

/** A click on a WhatsApp link, with the page (and service, on a service page) it came from. */
export function trackWhatsApp(params: { page: string; service?: string }) {
  if (typeof window === "undefined") return;
  const w = window as Win;
  w.gtag?.("event", "whatsapp_click", { page_path: params.page, ...(params.service ? { service: params.service } : {}) });
  if (analyticsIds.gtm) w.dataLayer?.push({ event: "whatsapp_click", page_path: params.page, service: params.service });
  w.fbq?.("track", "Contact");
}
