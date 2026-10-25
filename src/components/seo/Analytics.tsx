import Script from "next/script";
import { analyticsIds } from "@/lib/analytics";

/** Only the IDs here may reach the inline snippets, so reject anything that isn't a plain token. */
const safe = (id: string | undefined) => (id && /^[A-Za-z0-9_-]+$/.test(id) ? id : undefined);

/** GTM's fallback for visitors without JavaScript; Google wants it right after the opening <body>. */
export function GtmNoscript() {
  const gtm = safe(analyticsIds.gtm);
  if (!gtm) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtm}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}

/**
 * GTM loader as a plain inline script, rendered first inside <head>. Search Console's
 * "Google Tag Manager" verification only passes when the snippet sits in <head>, so it
 * must not go through next/script (which injects it late, at the end of <body>).
 */
export function GtmHead() {
  const gtm = safe(analyticsIds.gtm);
  if (!gtm) return null;
  return (
    // A plain <script> on purpose: Search Console's GTM verification needs it in <head>.
    // eslint-disable-next-line @next/next/next-script-for-ga
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`,
      }}
    />
  );
}

/** GA4, Meta Pixel and Microsoft Clarity, each loaded only when its ID is set (GTM loads from GtmHead). */
export function Analytics() {
  const ga4 = safe(analyticsIds.ga4);
  const pixel = safe(analyticsIds.metaPixel);
  const clarity = safe(analyticsIds.clarity);

  return (
    <>
      {ga4 && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga4}');`}
          </Script>
        </>
      )}
      {pixel && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');`}
        </Script>
      )}
      {clarity && (
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarity}");`}
        </Script>
      )}
    </>
  );
}
