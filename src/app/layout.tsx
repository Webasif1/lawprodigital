import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { GsapScenes } from "@/components/motion/GsapScenes";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { ChatMount } from "@/components/chat/ChatMount";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppLink";
import { serviceLabels } from "@/content/services";
import { Analytics, GtmHead, GtmNoscript } from "@/components/seo/Analytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { noindex, site } from "@/content/site";
import { founderJsonLd, ogImage, organizationJsonLd } from "@/lib/seo";
import "./globals.css";

// Headlines and figures: a geometric grotesk with confident bold weights.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

// Body and UI: highly legible at small sizes and in dense data.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Digital Marketing for Law Firms | Grow Clients & Revenue",
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: { siteName: site.name, type: "website", locale: "en_US", images: [ogImage] },
  twitter: { card: "summary_large_image", images: [ogImage.url] },
  formatDetection: { telephone: false },
  // Search Console ownership (property https://lawprodigital.com/). Keep it, or verification is lost.
  verification: { google: "cJuGdHm8uP5yiHG6PMSV7nRRoU20faMH9tvTwfoj7hw" },
  ...(noindex ? { robots: { index: false, follow: false } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#0f1f3d",
};

/** Runs before first paint: enables reveal styles only when JS is available. */
const bootScript = `document.documentElement.classList.add('js')`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} ${inter.variable} antialiased`}>
      <head>
        <GtmHead />
      </head>
      <body className="flex min-h-dvh flex-col">
        <GtmNoscript />
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={founderJsonLd()} />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <RevealObserver />
        <GsapScenes />
        <WhatsAppButton services={serviceLabels} />
        <ChatMount />
        <Analytics />
      </body>
    </html>
  );
}
