import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const keyPages = ["/", "/law-firm-seo/", "/case-study/", "/about-us/", "/pricing/", "/contact-us/", "/privacy-policy/"];

test.describe("pages in the browser", () => {
  for (const path of keyPages) {
    test(`${path} loads without console errors, failed requests or serious a11y violations`, async ({ page }) => {
      const problems: string[] = [];
      page.on("console", (m) => m.type() === "error" && problems.push(`console: ${m.text()}`));
      page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
      page.on("requestfailed", (r) => problems.push(`failed: ${r.url()}`));
      page.on("response", (r) => r.status() >= 400 && problems.push(`${r.status()}: ${r.url()}`));

      await page.goto(path);
      await page.waitForLoadState("networkidle");
      // Let idle-loaded GSAP / 3D settle.
      await page.waitForTimeout(800);
      expect(problems).toEqual([]);

      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      const serious = axe.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(", ")}`)).toEqual([]);
    });
  }

  test("pages don't scroll horizontally", async ({ page }) => {
    for (const path of keyPages) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, path).toBeLessThanOrEqual(1);
    }
  });
});

test.describe("navigation", () => {
  test("desktop services menu opens and links to a service page", async ({ page, isMobile }) => {
    test.skip(isMobile);
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    await nav.getByRole("button", { name: /services/i }).click();
    await nav.getByRole("link", { name: /Law Firm SEO/i }).first().click();
    await expect(page).toHaveURL(/\/law-firm-seo\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
  });

  test("mobile menu opens, traps a link click and closes", async ({ page, isMobile }) => {
    test.skip(!isMobile);
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("link", { name: "Case Studies" }).click();
    await expect(page).toHaveURL(/\/case-study\/$/);
    await expect(dialog).toBeHidden();
  });

  test("keyboard users can skip to content and see focus", async ({ page, isMobile }) => {
    test.skip(isMobile);
    await page.goto("/");
    await page.keyboard.press("Tab");
    const outline = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const s = getComputedStyle(el);
      return { tag: el.tagName, outline: s.outlineStyle, shadow: s.boxShadow };
    });
    expect(outline.tag).toBe("A");
    expect(outline.outline !== "none" || outline.shadow !== "none").toBe(true);
  });
});

test.describe("contact form", () => {
  test("shows field errors for an empty submission", async ({ page }) => {
    await page.goto("/contact-us/");
    await page.waitForTimeout(2600); // past the minimum fill time
    await page.getByRole("button", { name: /Request my free AI lead audit/i }).click();
    await expect(page.getByText("Please check the highlighted fields.")).toBeVisible();
    await expect(page.locator("#firstName")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#email")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#message")).toHaveAttribute("aria-invalid", "true");
  });

  test("keeps typed values and rejects an invalid email", async ({ page }) => {
    await page.goto("/contact-us/");
    await page.fill("#firstName", "Test");
    await page.fill("#email", "not-an-email");
    await page.fill("#message", "Hello");
    await page.waitForTimeout(2600);
    await page.getByRole("button", { name: /Request my free AI lead audit/i }).click();
    await expect(page.locator("#email-error")).toHaveText("Please enter a valid email address.");
    await expect(page.locator("#firstName")).toHaveValue("Test");
  });

  test("never reports success when email delivery isn't configured", async ({ page, isMobile }) => {
    test.skip(isMobile, "uses the shared rate limit once");
    await page.goto("/contact-us/");
    await page.fill("#firstName", "Test");
    await page.fill("#email", "test@example.com");
    await page.fill("#message", "Automated test — SMTP is disabled for this run.");
    await page.waitForTimeout(2600);
    await page.getByRole("button", { name: /Request my free AI lead audit/i }).click();
    await expect(page.getByText("Our contact form is temporarily unavailable. Please try again later.")).toBeVisible();
    await expect(page.getByText("Message sent")).toHaveCount(0);
  });
});
