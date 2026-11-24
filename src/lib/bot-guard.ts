import { createRateLimiter } from "@/lib/rate-limit";

/**
 * Page-request limits for src/proxy.ts. Only full page loads are counted (link prefetches
 * are skipped by the proxy matcher), so a person never gets near 60 a minute; a crawler
 * that walks the whole sitemap in seconds does. The global ceiling stops the counter
 * itself growing without bound in a flood (100 pages a second is past what one Node
 * process serves anyway).
 */
export const PAGE_RATE = { windowMs: 60 * 1000, perKey: 60, global: 6000 };

/**
 * User agents no visitor's browser sends: HTTP libraries and headless scrapers.
 * Search engines and AI crawlers (Googlebot, Bingbot, GPTBot, ClaudeBot…) are not
 * listed, so the site stays indexable and citable; they are only rate limited.
 */
const BLOCKED_UA = /^$|python-requests|python-urllib|aiohttp|go-http-client|^curl\/|^wget\/|libwww-perl|scrapy|headlesschrome|phantomjs|bytespider/i;

export function blockedAgent(userAgent: string | null) {
  return BLOCKED_UA.test(userAgent?.trim() ?? "");
}

/**
 * No real client IP. Next fills X-Forwarded-For with the socket address only when no proxy sent
 * one, so this is local dev, tests, or a front proxy that forwards nothing. Limiting it would put
 * every visitor in one shared bucket and lock them all out together.
 */
export function anonymous(ip: string) {
  return ip === "unknown" || ip === "::1" || /^(::ffff:)?127\./.test(ip);
}

export function createPageGuard({ logEveryMs = PAGE_RATE.windowMs } = {}) {
  const limited = createRateLimiter(PAGE_RATE);
  // One log line per IP per window, so a flood doesn't flood stderr.log too.
  const logged = new Map<string, number>();

  return function check(ip: string, userAgent: string | null, now = Date.now()) {
    const verdict = blockedAgent(userAgent) ? 403 : !anonymous(ip) && limited(ip, now) ? 429 : 200;
    if (verdict === 200) return { status: 200, log: false };
    const last = logged.get(ip);
    const log = last === undefined || now - last >= logEveryMs;
    if (log) {
      logged.delete(ip);
      logged.set(ip, now);
      while (logged.size > 5000) logged.delete(logged.keys().next().value!);
    }
    return { status: verdict, log };
  };
}
