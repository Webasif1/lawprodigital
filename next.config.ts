import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
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

  async redirects() {
    const caseStudies = "/case-study/";
    return [
      // Duplicate / dated permalinks of the bankruptcy case study.
      {
        source: "/how-we-helped-a-bankruptcy-law-firm-achieve-99-lead-conversion-in-6-months/",
        destination: "/bankruptcy-law-firm-99-percent-lead-conversion/",
        permanent: true,
      },
      {
        source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/how-we-helped-a-bankruptcy-law-firm-achieve-99-lead-conversion-in-6-months/",
        destination: "/bankruptcy-law-firm-99-percent-lead-conversion/",
        permanent: true,
      },
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
