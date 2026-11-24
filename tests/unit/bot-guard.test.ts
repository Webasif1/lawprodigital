import { describe, expect, it } from "vitest";
import { PAGE_RATE, blockedAgent, createPageGuard } from "@/lib/bot-guard";

const chrome = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";

describe("blockedAgent", () => {
  it.each(["", "python-requests/2.32", "Go-http-client/1.1", "curl/8.4.0", "Scrapy/2.11", "Mozilla/5.0 HeadlessChrome/120.0", "Bytespider"])(
    "blocks %j",
    (ua) => expect(blockedAgent(ua)).toBe(true),
  );

  it.each([
    chrome,
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
    "Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
  ])("allows %j", (ua) => expect(blockedAgent(ua)).toBe(false));

  it("treats a missing user agent as blocked", () => expect(blockedAgent(null)).toBe(true));
});

describe("createPageGuard", () => {
  it("allows a burst up to the limit, then answers 429 until the window passes", () => {
    const check = createPageGuard();
    const t = 1_000_000;
    for (let i = 0; i < PAGE_RATE.perKey; i++) expect(check("203.0.113.5", chrome, t + i).status).toBe(200);
    expect(check("203.0.113.5", chrome, t + 100).status).toBe(429);
    expect(check("198.51.100.7", chrome, t + 100).status).toBe(200);
    expect(check("203.0.113.5", chrome, t + PAGE_RATE.windowMs + 100).status).toBe(200);
  });

  it.each(["unknown", "127.0.0.1", "::1", "::ffff:127.0.0.1"])(
    "never rate limits %j (no real client IP: one bucket would lock everyone out)",
    (ip) => {
      const check = createPageGuard();
      for (let i = 0; i < PAGE_RATE.perKey * 2; i++) expect(check(ip, chrome, i).status).toBe(200);
    },
  );

  it("still blocks scraper user agents with no client IP", () => {
    expect(createPageGuard()("127.0.0.1", "python-requests/2.32").status).toBe(403);
  });

  it("logs the first block per IP per window, not every request", () => {
    const check = createPageGuard();
    expect(check("192.0.2.1", "curl/8", 0)).toEqual({ status: 403, log: true });
    expect(check("192.0.2.1", "curl/8", 10)).toEqual({ status: 403, log: false });
    expect(check("192.0.2.1", "curl/8", PAGE_RATE.windowMs)).toEqual({ status: 403, log: true });
  });
});
