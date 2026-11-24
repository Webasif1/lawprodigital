import { type NextRequest, NextResponse } from "next/server";
import { PAGE_RATE, createPageGuard } from "@/lib/bot-guard";
import { clientIp } from "@/lib/rate-limit";

/**
 * First line of defence in the app against crawlers that hit every page in seconds.
 * Cloudflare or .htaccess rules in front of Passenger are cheaper (docs/CPANEL_DEPLOYMENT.md);
 * this catches what gets past them. Counters are in memory, per Node process.
 */
const check = createPageGuard();

export function proxy(request: NextRequest) {
  const ua = request.headers.get("user-agent");
  // Cloudflare (if added) puts the visitor in CF-Connecting-IP; X-Forwarded-For would end in its edge IP.
  const ip = request.headers.get("cf-connecting-ip")?.trim() || clientIp(request.headers.get("x-forwarded-for"), request.headers.get("x-real-ip"));
  const { status, log } = check(ip, ua);
  if (status === 200) return NextResponse.next();

  if (log) console.warn(`[proxy] ${status} ip=${ip} path=${request.nextUrl.pathname} ua=${JSON.stringify((ua ?? "").slice(0, 160))}`);
  const retry = String(PAGE_RATE.windowMs / 1000);
  return new NextResponse(status === 429 ? "Too many requests. Please slow down." : "Forbidden", {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      ...(status === 429 && { "Retry-After": retry, "X-RateLimit-Limit": String(PAGE_RATE.perKey), "X-RateLimit-Remaining": "0" }),
    },
  });
}

export const config = {
  matcher: [
    {
      // Pages only: not /_next assets, the API routes (they have their own limits) or any file
      // with an extension (images, robots.txt, sitemap.xml, llms.txt).
      source: "/((?!_next/|api/|.*\\.\\w+$).*)",
      // Link prefetches and client-side navigations aren't page loads; counting them would
      // throttle a real visitor scrolling past a page full of links.
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "rsc" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
