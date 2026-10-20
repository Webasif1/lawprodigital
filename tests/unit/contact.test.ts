import { describe, expect, it } from "vitest";
import {
  MAX,
  buildEnquiryEmail,
  clientIp,
  createRateLimiter,
  escapeHtml,
  looksAutomated,
  readValues,
  validateContact,
  type ContactValues,
} from "@/app/contact-us/validate";
import { cityOptions, serviceOptions } from "@/app/contact-us/form-config";

const valid: ContactValues = {
  firstName: "Test",
  lastName: "Person",
  email: "test@example.com",
  phone: "+1 (555) 010-0000",
  city: cityOptions[0],
  service: serviceOptions[0],
  message: "We are a two-attorney immigration firm.",
};

const form = (fields: Record<string, string>) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
};

describe("validateContact", () => {
  it("accepts a complete, valid enquiry", () => {
    expect(validateContact(valid)).toEqual({});
  });

  it("accepts the optional fields left empty", () => {
    expect(validateContact({ ...valid, lastName: "", phone: "", city: "", service: "" })).toEqual({});
  });

  it("requires first name, email and message", () => {
    const errors = validateContact({ ...valid, firstName: "", email: "", message: "" });
    expect(Object.keys(errors).sort()).toEqual(["email", "firstName", "message"]);
  });

  it.each(["not-an-email", "a@b", "a b@example.com", "a@example.com\r\nBcc: x@evil.test"])("rejects email %j", (email) => {
    expect(validateContact({ ...valid, email }).email).toBeDefined();
  });

  it("rejects over-long fields", () => {
    const errors = validateContact({
      ...valid,
      firstName: "x".repeat(MAX.name + 1),
      lastName: "x".repeat(MAX.name + 1),
      email: `${"x".repeat(MAX.email)}@example.com`,
      phone: "1".repeat(MAX.phone + 1),
      message: "x".repeat(MAX.message + 1),
    });
    expect(Object.keys(errors).sort()).toEqual(["email", "firstName", "lastName", "message", "phone"]);
  });

  it("rejects phone numbers with letters", () => {
    expect(validateContact({ ...valid, phone: "call me maybe" }).phone).toBeDefined();
  });

  it("only allows cities and services from the lists", () => {
    const errors = validateContact({ ...valid, city: "Atlantis", service: "<script>" });
    expect(errors.city).toBeDefined();
    expect(errors.service).toBeDefined();
  });
});

describe("readValues", () => {
  it("trims values and defaults missing fields to empty strings", () => {
    expect(readValues(form({ firstName: "  Ana  " }))).toMatchObject({ firstName: "Ana", email: "", message: "" });
  });
});

describe("looksAutomated", () => {
  const now = 1_000_000;
  it("flags a filled honeypot", () => {
    expect(looksAutomated(form({ website: "http://spam.test" }), now)).toBe(true);
  });
  it("flags submissions faster than the minimum fill time", () => {
    expect(looksAutomated(form({ startedAt: String(now - 500) }), now)).toBe(true);
  });
  it("passes a normal submission and a no-JS submission", () => {
    expect(looksAutomated(form({ startedAt: String(now - 10_000) }), now)).toBe(false);
    expect(looksAutomated(form({}), now)).toBe(false);
  });
});

describe("createRateLimiter", () => {
  it("blocks a key after its limit and frees it after the window", () => {
    const limited = createRateLimiter({ windowMs: 1000, perKey: 2, global: 100 });
    expect(limited("a", 0)).toBe(false);
    expect(limited("a", 1)).toBe(false);
    expect(limited("a", 2)).toBe(true);
    expect(limited("b", 3)).toBe(false);
    expect(limited("a", 1500)).toBe(false);
  });

  it("enforces a global ceiling across keys (IP rotation)", () => {
    const limited = createRateLimiter({ windowMs: 1000, perKey: 5, global: 3 });
    expect([limited("1", 0), limited("2", 0), limited("3", 0), limited("4", 0)]).toEqual([false, false, false, true]);
  });

  it("evicts least recently used keys instead of resetting everyone", () => {
    const limited = createRateLimiter({ windowMs: 1000, perKey: 1, global: 1000, maxKeys: 3 });
    limited("x1", 0);
    limited("victim", 0);
    limited("x2", 0);
    limited("x3", 1); // map full: evicts x1, the oldest
    expect(limited("victim", 2)).toBe(true);
    expect(limited("x1", 2)).toBe(false);
  });
});

describe("clientIp", () => {
  it("uses the hop appended by the nearest proxy", () => {
    expect(clientIp("1.1.1.1, 203.0.113.9", null)).toBe("203.0.113.9");
  });
  it("falls back to x-real-ip, then 'unknown'", () => {
    expect(clientIp(null, "198.51.100.2")).toBe("198.51.100.2");
    expect(clientIp(null, null)).toBe("unknown");
  });
});

describe("email output", () => {
  it("escapes HTML", () => {
    expect(escapeHtml(`<img src=x onerror="a('b')">&`)).toBe("&lt;img src=x onerror=&quot;a(&#39;b&#39;)&quot;&gt;&amp;");
  });

  it("keeps the subject on one line and escapes the HTML body", () => {
    const email = buildEnquiryEmail({ ...valid, firstName: "Eve\r\nBcc: x@evil.test", message: "<b>hi</b>\nthere" });
    expect(email.subject).not.toMatch(/[\r\n]/);
    expect(email.html).not.toContain("<b>hi</b>");
    expect(email.html).toContain("&lt;b&gt;hi&lt;/b&gt;<br>there");
  });
});
