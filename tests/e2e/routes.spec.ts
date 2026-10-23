import { expect, test } from "@playwright/test";

/** Every URL in the sitemap, as paths on the test server. */
async function sitemapPaths(request: import("@playwright/test").APIRequestContext) {
  const xml = await (await request.get("/sitemap.xml")).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}

test.describe("routes and SEO", () => {
  test.skip(({ isMobile }) => isMobile, "server-level checks run once");

  test("every sitemap URL renders with a unique title, description and self canonical", async ({ request }) => {
    const paths = await sitemapPaths(request);
    expect(paths.length).toBeGreaterThan(20);
    const titles = new Map<string, string>();
    for (const path of paths) {
      const res = await request.get(path, { maxRedirects: 0 });
      expect(res.status(), path).toBe(200);
      const html = await res.text();
      const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
      expect(title, `${path} title`).toBeTruthy();
      expect(titles.get(title!), `duplicate title on ${path}`).toBeUndefined();
      titles.set(title!, path);
      expect(html, `${path} description`).toMatch(/<meta name="description" content="[^"]{50,}"/);
      expect(html, `${path} canonical`).toContain(`<link rel="canonical" href="https://lawprodigital.com${path}"`);
      expect(html, `${path} noindex`).not.toMatch(/<meta name="robots" content="[^"]*noindex/);
      expect(html.match(/<h1[\s>]/g)?.length, `${path} h1 count`).toBe(1);
    }
  });

  test("every internal link and in-page anchor on the site resolves", async ({ request }) => {
    const paths = await sitemapPaths(request);
    const links = new Map<string, string>();
    const broken: string[] = [];
    for (const path of paths) {
      const html = await (await request.get(path)).text();
      const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
      for (const [, href] of html.matchAll(/<a[^>]+href="([^"]+)"/g)) {
        if (/^(mailto:|tel:|https?:)/.test(href)) continue;
        const [target, hash] = href.split("#");
        if (!target && hash && !ids.has(hash)) broken.push(`${path} → #${hash} (missing id)`);
        if (target) links.set(target, path);
        if (target === "/" && hash) {
          const home = await (await request.get("/")).text();
          if (!home.includes(`id="${hash}"`)) broken.push(`${path} → /#${hash} (missing id on home)`);
        }
      }
    }
    for (const [href, from] of links) {
      const res = await request.get(href);
      if (res.status() !== 200) broken.push(`${from} → ${href} (${res.status()})`);
    }
    expect([...new Set(broken)]).toEqual([]);
  });

  test("robots.txt allows crawling and points at the sitemap", async ({ request }) => {
    const body = await (await request.get("/robots.txt")).text();
    expect(body).toContain("Allow: /");
    expect(body).toContain("Sitemap: https://lawprodigital.com/sitemap.xml");
  });

  test("legacy WordPress URLs redirect permanently", async ({ request }) => {
    const cases: [string, RegExp][] = [
      ["/about-us", /\/about-us\/$/],
      ["/booking/", /\/contact-us\/$/],
      ["/video-marketing/", /\/video-marketing-for-law-firms\/$/],
      ["/category/immigration/", /\/case-study\/$/],
      ["/how-we-helped-a-bankruptcy-law-firm-achieve-99-lead-conversion-in-6-months/", /\/case-study\/$/],
    ];
    for (const [from, to] of cases) {
      const res = await request.get(from, { maxRedirects: 0 });
      expect(res.status(), from).toBe(308);
      expect(res.headers().location, from).toMatch(to);
    }
  });

  test("unknown URLs return a real 404 page", async ({ request }) => {
    const res = await request.get("/this-page-does-not-exist/");
    expect(res.status()).toBe(404);
    const html = await res.text();
    expect(html).toContain("Error 404");
    expect(html).toMatch(/<meta name="robots" content="noindex/);
  });

  test("security headers are sent on pages", async ({ request }) => {
    const h = (await request.get("/")).headers();
    expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(h["content-security-policy"]).toContain("object-src 'none'");
    expect(h["strict-transport-security"]).toContain("max-age=");
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["x-frame-options"]).toBe("DENY");
    expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["x-powered-by"]).toBeUndefined();
  });

  test("no environment secrets leak into client JavaScript", async ({ request, page }) => {
    const scripts = new Set<string>();
    page.on("response", (r) => r.url().endsWith(".js") && scripts.add(r.url()));
    await page.goto("/contact-us/");
    await page.waitForLoadState("networkidle");
    for (const url of scripts) {
      const js = await (await request.get(url)).text();
      expect(js, url).not.toMatch(/SMTP_PASS|SMTP_USER|CONTACT_TO|OPENROUTER_API_KEY|sk-or-v1-/);
    }
  });

  test("the image optimizer resizes and converts images (sharp loads in the bundle)", async ({ request }) => {
    // s16 is a 559 KB JPEG; served untouched means sharp failed to load and every image ships full size.
    const res = await request.get("/_next/image/?url=%2Fimages%2Fstories%2Fs16-system.jpg&w=640&q=75", {
      headers: { Accept: "image/avif,image/webp,*/*" },
    });
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/image\/(avif|webp)/);
    expect((await res.body()).length).toBeLessThan(150_000);
  });

  test("the chat API is off without a key and validates its input", async ({ request }) => {
    expect(await (await request.get("/api/chat/")).json()).toEqual({ enabled: false });
    const res = await request.post("/api/chat/", { data: { messages: [{ role: "user", content: "hi" }] } });
    expect(res.status()).toBe(503);
    expect(res.headers()["cache-control"]).toContain("no-store");
  });
});
