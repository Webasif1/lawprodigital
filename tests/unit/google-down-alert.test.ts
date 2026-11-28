import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendMail = vi.fn(async () => ({}));
vi.mock("nodemailer", () => ({ default: { createTransport: () => ({ sendMail }) } }));

describe("Google-down owner alert", () => {
  beforeEach(() => {
    for (const [k, v] of Object.entries({ SMTP_HOST: "smtp.test.invalid", SMTP_USER: "site@test.invalid", SMTP_PASS: "x", CONTACT_TO: "inbox@test.invalid" })) vi.stubEnv(k, v);
    sendMail.mockClear();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("emails the owner once per 6 hours while Google fails", async () => {
    const { markGoogleDown, resetLocalBookings } = await import("@/lib/booking/availability");
    resetLocalBookings();
    const now = Date.parse("2026-11-28T10:00:00Z");
    expect(markGoogleDown(new Error("[google] token failed: 400 invalid_grant"), now)).toBe(true);
    expect(markGoogleDown(new Error("again"), now + 60 * 60_000)).toBe(true);
    await vi.waitFor(() => expect(sendMail).toHaveBeenCalledTimes(1));
    const mail = (sendMail.mock.calls[0] as unknown as [{ to: string; subject: string; text: string }])[0];
    expect(mail.to).toBe("inbox@test.invalid");
    expect(mail.subject).toContain("Google Calendar disconnected");
    expect(mail.text).toContain("In production");

    markGoogleDown(new Error("later"), now + 7 * 60 * 60_000);
    await vi.waitFor(() => expect(sendMail).toHaveBeenCalledTimes(2));
  });
});
