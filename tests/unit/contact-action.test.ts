import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// No real email: nodemailer is replaced by a stub whose sendMail each test controls.
const sendMail = vi.fn();
const createTransport = vi.fn(() => ({ sendMail }));
vi.mock("nodemailer", () => ({ default: { createTransport } }));

let currentHeaders = new Headers();
vi.mock("next/headers", () => ({ headers: async () => currentHeaders }));

let ipCounter = 0;

function form(fields: Record<string, string>) {
  currentHeaders = new Headers({ "x-forwarded-for": `10.8.0.${++ipCounter}` });
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

const valid = {
  firstName: "Ana",
  lastName: "Ruiz",
  email: "ana@example.com",
  firmWebsite: "ruizlaw.example.com",
  message: "<script>alert(1)</script> Hello",
  startedAt: String(Date.now() - 10_000),
};

describe("submitContact (server action)", () => {
  beforeEach(() => {
    vi.resetModules();
    sendMail.mockReset();
    createTransport.mockClear();
    for (const [k, v] of Object.entries({ SMTP_HOST: "smtp.test.invalid", SMTP_PORT: "465", SMTP_USER: "site@test.invalid", SMTP_PASS: "test-pass-not-real", CONTACT_TO: "inbox@test.invalid" })) vi.stubEnv(k, v);
  });
  afterEach(() => vi.unstubAllEnvs());

  const load = async () => (await import("@/app/contact-us/actions")).submitContact;

  it("sends one escaped email with the visitor as Reply-To", async () => {
    sendMail.mockResolvedValue({ messageId: "x" });
    const result = await (await load())({ status: "idle" }, form(valid));
    expect(result.status).toBe("success");
    expect(sendMail).toHaveBeenCalledTimes(1);
    const mail = sendMail.mock.calls[0][0];
    expect(mail.to).toBe("inbox@test.invalid");
    expect(mail.replyTo).toEqual({ name: "Ana Ruiz", address: "ana@example.com" });
    expect(mail.html).not.toContain("<script>");
    expect(mail.html).toContain("&lt;script&gt;");
  });

  it("shows a generic error and keeps the values when the provider fails", async () => {
    sendMail.mockRejectedValue(Object.assign(new Error("535 auth failed for site@test.invalid / test-pass-not-real"), { code: "EAUTH", responseCode: 535 }));
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await (await load())({ status: "idle" }, form(valid));
    expect(result.status).toBe("error");
    expect(result.message).toBe("Something went wrong sending your message. Please try again shortly.");
    expect(JSON.stringify(result)).not.toContain("535");
    expect(result.values?.email).toBe("ana@example.com");
    spy.mockRestore();
  });

  it("never claims success when SMTP isn't configured", async () => {
    vi.stubEnv("SMTP_PASS", "");
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await (await load())({ status: "idle" }, form(valid));
    expect(result.status).toBe("error");
    expect(sendMail).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("drops bots (honeypot, instant submit) without sending", async () => {
    const submit = await load();
    expect((await submit({ status: "idle" }, form({ ...valid, website: "spam.example" }))).status).toBe("error");
    expect((await submit({ status: "idle" }, form({ ...valid, startedAt: String(Date.now()) }))).status).toBe("error");
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("validates on the server: empty, whitespace-only and invalid email", async () => {
    const submit = await load();
    const empty = await submit({ status: "idle" }, form({}));
    expect(Object.keys(empty.errors ?? {})).toEqual(expect.arrayContaining(["firstName", "email", "firmWebsite"]));
    const spaces = await submit({ status: "idle" }, form({ ...valid, firstName: "   ", email: "  " }));
    expect(spaces.errors?.firstName).toBeDefined();
    expect(spaces.errors?.email).toBeDefined();
    const bad = await submit({ status: "idle" }, form({ ...valid, email: "ana@example.com\r\nBcc: x@evil.example" }));
    expect(bad.errors?.email).toBeDefined();
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("rate limits repeated submissions from one IP", async () => {
    sendMail.mockResolvedValue({ messageId: "x" });
    const submit = await load();
    const fd = () => {
      const f = form(valid);
      currentHeaders = new Headers({ "x-forwarded-for": "10.7.7.7" });
      return f;
    };
    const results = [];
    for (let i = 0; i < 6; i++) results.push((await submit({ status: "idle" }, fd())).status);
    expect(results.slice(0, 5)).toEqual(Array(5).fill("success"));
    expect(results[5]).toBe("error");
    expect(sendMail).toHaveBeenCalledTimes(5);
  });
});
