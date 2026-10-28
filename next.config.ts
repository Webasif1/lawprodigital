import type { NextConfig } from "next";
import { legacyCaseStudyRedirects } from "./src/content/stories";
import { analyticsCspSources } from "./src/lib/analytics";

const isDev = process.env.NODE_ENV !== "production";

// Pages are prerendered, so a per-request nonce isn't available: Next's inline
// bootstrap/RSC scripts need 'unsafe-inline'. Everything else is locked to this origin,
// plus the click-to-load YouTube player and whichever analytics tools have an ID set
// (src/lib/analytics.ts).
const extra = analyticsCspSources();
const more = (d: keyof typeof extra) => (extra[d].length ? ` ${extra[d].join(" ")}` : "");
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${more("script-src")}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${more("img-src")}`,
  "font-src 'self'",
  "media-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}${more("connect-src")}`,
  `frame-src https://www.youtube-nocookie.com${more("frame-src")}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Vercel added HSTS itself; on cPanel the app has to send it.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // Self-contained server bundle for the cPanel Node.js app (see docs/CPANEL_DEPLOYMENT.md).
  output: "standalone",
  outputFileTracingIncludes: {
    // The chat route reads the case study library at runtime for its facts; ship it with the server.
    "/api/chat": ["./src/content/source/case-studies.md"],
    // sharp's native libvips libraries (DLLs on Windows, a separate sharp-libvips-* package on Linux)
    // aren't picked up by tracing. Without them sharp can't load and next/image silently serves
    // every original image, unresized. Only the current platform's packages are installed.
    "/*": ["./node_modules/@img/**/*"],
  },

  // The previous WordPress site served every page with a trailing slash; keep the exact URLs.
  trailingSlash: true,
  poweredByHeader: false,

  images: {
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
    // Source images are at most 1344px wide and next/image never upscales, so the default
    // 1920/2048/3840 widths were identical files that still cost a resize each. The cPanel
    // plan caps memory, so keep the work down: fewer widths, and keep results for 7 days.
    deviceSizes: [640, 750, 828, 1080, 1200, 1440],
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  async redirects() {
    const caseStudies = "/case-study/";
    return [
      // The previous case studies were replaced by the story library; each old URL
      // points to the story that answers the same question (or the library itself).
      ...Object.entries(legacyCaseStudyRedirects).map(([slug, story]) => ({
        source: `/${slug}/`,
        destination: story ? `${caseStudies}${story}/` : caseStudies,
        permanent: true,
      })),
      // Duplicate / dated permalinks of the old bankruptcy case study.
      {
        source: "/how-we-helped-a-bankruptcy-law-firm-achieve-99-lead-conversion-in-6-months/",
        destination: `${caseStudies}bankruptcy-lawyer-marketing-from-scratch/`,
        permanent: true,
      },
      {
        source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/how-we-helped-a-bankruptcy-law-firm-achieve-99-lead-conversion-in-6-months/",
        destination: `${caseStudies}bankruptcy-lawyer-marketing-from-scratch/`,
        permanent: true,
      },
      // The live site's "Get A Free Call" buttons pointed here.
      { source: "/booking/", destination: "/contact-us/", permanent: true },
      // Alternate URL of the video marketing service page.
      { source: "/video-marketing/", destination: "/video-marketing-for-law-firms/", permanent: true },
      // WordPress archive pages that only listed the case studies.
      { source: "/category/:slug/", destination: caseStudies, permanent: true },
      { source: "/author/:slug/", destination: caseStudies, permanent: true },
      { source: "/feed/", destination: "/", permanent: false },
      { source: "/comments/feed/", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
