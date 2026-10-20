import type { NextConfig } from "next";
import { legacyCaseStudyRedirects } from "./src/content/stories";

const isDev = process.env.NODE_ENV !== "production";

// Pages are prerendered, so a per-request nonce isn't available: Next's inline
// bootstrap/RSC scripts need 'unsafe-inline'. Everything else is locked to this origin,
// plus the click-to-load YouTube player. See docs/SECURITY_REPORT.md.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "media-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "frame-src https://www.youtube-nocookie.com",
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

  // Self-contained server bundle for the cPanel Node.js app (see DEPLOYMENT.md).
  output: "standalone",

  // The previous WordPress site served every page with a trailing slash; keep the exact URLs.
  trailingSlash: true,
  poweredByHeader: false,

  images: {
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  async redirects() {
    const caseStudies = "/case-study/";
    return [
      // The previous case studies were replaced by the 16-story library; each old URL
      // points to the story that answers the same question (or the library itself).
      ...Object.entries(legacyCaseStudyRedirects).map(([slug, story]) => ({
        source: `/${slug}/`,
        destination: story ? `${caseStudies}${story}/` : caseStudies,
        permanent: true,
      })),
      // Duplicate / dated permalinks of the old bankruptcy case study.
      {
        source: "/how-we-helped-a-bankruptcy-law-firm-achieve-99-lead-conversion-in-6-months/",
        destination: caseStudies,
        permanent: true,
      },
      {
        source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/how-we-helped-a-bankruptcy-law-firm-achieve-99-lead-conversion-in-6-months/",
        destination: caseStudies,
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
