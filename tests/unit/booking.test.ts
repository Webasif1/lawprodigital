import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readBooking, validateBooking } from "@/app/book-a-call/validate";
import { dateKey, generateSlots, type SlotRules, zonedTimeToUtc } from "@/lib/booking/slots";

const rules: SlotRules = {
  timeZone: "America/New_York",
  durationMin: 30,
  stepMin: 30,
  bufferMin: 15,
  minNoticeMin: 12 * 60,
  windowDays: 14,
  hours: { 1: [["09:00", "17:00"]], 2: [["09:00", "17:00"]], 3: [["09:00", "17:00"]], 4: [["09:00", "17:00"]], 5: [["09:00", "17:00"]] },
};

// Monday 2026-11-09, 08:00 New York (13:00 UTC).
const NOW = Date.parse("2026-11-09T13:00:00Z");

describe("time zones", () => {
  it("converts wall-clock time to UTC on both sides of a DST change", () => {
    expect(new Date(zonedTimeToUtc(2026, 6, 1, 9 * 60, "America/New_York")).toISOString()).toBe("2026-07-01T13:00:00.000Z");
    expect(new Date(zonedTimeToUtc(2026, 11, 1, 9 * 60, "America/New_York")).toISOString()).toBe("2026-12-01T14:00:00.000Z");
    expect(new Date(zonedTimeToUtc(2026, 10, 2, 9 * 60, "America/New_York")).toISOString()).toBe("2026-11-02T14:00:00.000Z");
  });

  it("groups a slot by the visitor's local date", () => {
    expect(dateKey("2026-11-10T02:00:00.000Z", "America/New_York")).toBe("2026-11-09");
    expect(dateKey("2026-11-10T02:00:00.000Z", "Asia/Dhaka")).toBe("2026-11-10");
  });
});

describe("generateSlots", () => {
  const slots = generateSlots(rules, [], NOW);

  it("offers weekday working hours only, after the minimum notice", () => {
    // 12 h notice from 08:00 Monday rules out all of Monday.
    expect(slots[0]).toBe("2026-11-10T14:00:00.000Z");
    expect(slots.filter((s) => dateKey(s, rules.timeZone) === "2026-11-10")).toHaveLength(16);
    expect(slots.some((s) => [0, 6].includes(new Date(s).getUTCDay()) && dateKey(s, rules.timeZone).endsWith("-14"))).toBe(false);
    expect(slots.at(-1)! <= new Date(NOW + 14 * 86_400_000).toISOString()).toBe(true);
    // Last start is 16:30 so the call ends by 17:00.
    expect(slots).toContain("2026-11-10T21:30:00.000Z");
    expect(slots).not.toContain("2026-11-10T22:00:00.000Z");
  });

  it("fits each call length inside working hours on its own step", () => {
    const hour = generateSlots({ ...rules, durationMin: 60 }, [], NOW);
    expect(hour).toContain("2026-11-10T21:00:00.000Z"); // 16:00–17:00
    expect(hour).not.toContain("2026-11-10T21:30:00.000Z"); // would end 17:30
    const quarter = generateSlots({ ...rules, durationMin: 15, stepMin: 15 }, [], NOW);
    expect(quarter).toContain("2026-11-10T14:15:00.000Z");
    expect(quarter).toContain("2026-11-10T21:45:00.000Z"); // 16:45–17:00
  });

  it("supports round-the-clock hours, including weekends and the last slot before midnight", () => {
    const allDay = { ...rules, hours: Object.fromEntries([0, 1, 2, 3, 4, 5, 6].map((d) => [d, [["00:00", "24:00"]]])) } as SlotRules;
    const s = generateSlots(allDay, [], NOW);
    expect(s).toContain("2026-11-14T15:00:00.000Z"); // Saturday 10:00 NY
    expect(s).toContain("2026-11-11T04:30:00.000Z"); // Tuesday 23:30 NY, ends at midnight
    expect(s).toContain("2026-11-11T05:00:00.000Z"); // Wednesday 00:00 NY
    expect(new Set(s).size).toBe(s.length);
  });

  it("uses round-the-clock hours for the live call", async () => {
    const { bookingRules } = await import("@/content/booking");
    const r = bookingRules(30);
    expect(Object.keys(r.hours)).toHaveLength(7);
    expect(r.hours[6]).toEqual([["00:00", "24:00"]]);
  });

  it("removes slots overlapping busy time, including the buffer", () => {
    const busy = [{ start: "2026-11-10T16:00:00.000Z", end: "2026-11-10T17:00:00.000Z" }]; // 11:00–12:00 NY
    const free = generateSlots(rules, busy, NOW);
    expect(free).not.toContain("2026-11-10T15:30:00.000Z"); // ends 11:00, inside the 15 min buffer
    expect(free).not.toContain("2026-11-10T16:30:00.000Z");
    expect(free).not.toContain("2026-11-10T17:00:00.000Z"); // starts 12:00, inside the buffer
    expect(free).toContain("2026-11-10T15:00:00.000Z");
    expect(free).toContain("2026-11-10T17:30:00.000Z");
  });
});

describe("validateBooking", () => {
  const fd = (o: Record<string, string>) => {
    const f = new FormData();
    for (const [k, v] of Object.entries(o)) f.set(k, v);
    return f;
  };
  const good = { name: "Ana Ruiz", email: "ana@example.com", slot: "2026-11-10T14:00:00.000Z", duration: "30", timeZone: "America/Chicago" };

  it("only accepts the offered call lengths", () => {
    expect(validateBooking(readBooking(fd({ ...good, duration: "45" }))).slot).toBeDefined();
    expect(validateBooking(readBooking(fd({ ...good, duration: "" }))).slot).toBeDefined();
    expect(validateBooking(readBooking(fd({ ...good, duration: "60" })))).toEqual({});
  });

  it("accepts a minimal booking", () => {
    expect(validateBooking(readBooking(fd(good)))).toEqual({});
  });

  it("rejects bad fields and header injection", () => {
    const e = validateBooking(readBooking(fd({ ...good, name: " ", email: "a@b.co\r\nBcc: x@y.z", phone: "abc", firmWebsite: "not a site", slot: "tomorrow" })));
    expect(Object.keys(e).sort()).toEqual(["email", "firmWebsite", "name", "phone", "slot"]);
  });
});

describe("ownerBookingEmail", () => {
  it("leads with the owner's local time and escapes client text", async () => {
    const { describeBooking, ownerBookingEmail, readBooking } = await import("@/app/book-a-call/validate");
    const f = new FormData();
    for (const [k, val] of Object.entries({ name: "Ana <b>Ruiz</b>", email: "ana@example.com", slot: "2026-11-19T18:00:00.000Z", duration: "30", timeZone: "America/Chicago", notes: "<script>x</script>" }))
      f.set(k, val);
    const start = new Date("2026-11-19T18:00:00.000Z");
    const info = describeBooking(readBooking(f), start, "America/New_York", "Asia/Dhaka");
    const mail = ownerBookingEmail({ info, start, durationMin: 30, ownerZone: "Asia/Dhaka", meetLink: "https://meet.google.com/abc", eventLink: null });
    expect(mail.subject).toBe("📅 New booking: Ana <b>Ruiz</b>, Friday, November 20 at 12:00 AM (30 min)");
    expect(mail.html).toContain("12:00 AM");
    expect(mail.html).toContain("Join Google Meet");
    expect(mail.html).not.toContain("<script>");
    expect(mail.html).not.toContain("<b>Ruiz");
  });
});

describe("sheetIdFrom", () => {
  it("accepts the bare ID or the full sheet URL", async () => {
    const { sheetIdFrom } = await import("@/lib/google");
    expect(sheetIdFrom("https://docs.google.com/spreadsheets/d/1tRj-vB_bq/edit?usp=sharing")).toBe("1tRj-vB_bq");
    expect(sheetIdFrom(" 1tRj-vB_bq ")).toBe("1tRj-vB_bq");
    expect(sheetIdFrom("")).toBeUndefined();
  });
});

describe("availability with Google", () => {
  const freeBusy = vi.fn(async () => []);
  beforeEach(() => {
    vi.resetModules();
    vi.doMock("@/lib/google", () => ({ isCalendarConfigured: () => true, freeBusy }));
    vi.doMock("@/lib/mail", () => ({ smtpConfig: () => null }));
  });
  afterEach(() => {
    vi.doUnmock("@/lib/google");
    vi.doUnmock("@/lib/mail");
  });

  it("frees a slot cancelled on the calendar once the short grace period ends", async () => {
    const a = await import("@/lib/booking/availability");
    a.rememberBooking("2026-11-10T16:00:00.000Z", 30, NOW);
    expect((await a.availableSlots({ fresh: true, now: NOW + 60_000 }))[30]).not.toContain("2026-11-10T16:00:00.000Z");
    // Ten minutes later the calendar (which no longer has the event) is the only source.
    expect((await a.availableSlots({ fresh: true, now: NOW + 10 * 60_000 }))[30]).toContain("2026-11-10T16:00:00.000Z");
  });
});

describe("availability without Google (email mode)", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.doMock("@/lib/google", () => ({ isCalendarConfigured: () => false, freeBusy: vi.fn() }));
    vi.doMock("@/lib/mail", () => ({ smtpConfig: () => ({ to: "owner@test.invalid" }) }));
  });
  afterEach(() => {
    vi.doUnmock("@/lib/google");
    vi.doUnmock("@/lib/mail");
  });

  it("offers working hours and blocks a booked call plus its buffer", async () => {
    const a = await import("@/lib/booking/availability");
    expect(a.bookingMode()).toBe("email");
    const before = await a.availableSlots({ fresh: true, now: NOW });
    expect(before[30]).toContain("2026-11-10T16:00:00.000Z");
    a.rememberBooking("2026-11-10T16:00:00.000Z", 30, NOW); // 11:00–11:30 NY
    const after = await a.availableSlots({ now: NOW });
    expect(after[30]).not.toContain("2026-11-10T16:00:00.000Z");
    expect(after[30]).not.toContain("2026-11-10T15:30:00.000Z"); // ends inside the 15-minute buffer
    expect(after[60]).not.toContain("2026-11-10T15:30:00.000Z");
    expect(after[30]).toContain("2026-11-10T17:00:00.000Z");
  });
});

describe("bookCall (server action)", () => {
  const createMeetEvent = vi.fn();
  const logRow = vi.fn();
  const sendOwnerMail = vi.fn();
  const rememberBooking = vi.fn();
  let open = ["2026-11-10T14:00:00.000Z"];
  let mode: "google" | "email" | "off" = "google";

  beforeEach(() => {
    vi.resetModules();
    createMeetEvent.mockReset().mockResolvedValue({ id: "evt1", meetLink: "https://meet.google.com/abc-defg-hij" });
    logRow.mockReset();
    sendOwnerMail.mockReset().mockResolvedValue(undefined);
    rememberBooking.mockReset();
    open = ["2026-11-10T14:00:00.000Z"];
    mode = "google";
    vi.doMock("next/headers", () => ({ headers: async () => new Headers({ "x-forwarded-for": `10.9.0.${Math.random() * 250 | 0}` }) }));
    vi.doMock("@/lib/google", () => ({ createMeetEvent, logRow }));
    vi.doMock("@/lib/mail", () => ({ smtpConfig: () => (mode === "off" ? null : { to: "owner@test.invalid" }), sendOwnerMail, smtpErrorSummary: () => "x" }));
    vi.doMock("@/lib/booking/availability", () => ({
      bookingMode: () => mode,
      rememberBooking,
      availableSlots: async () => ({ 15: open, 30: open, 60: open.slice(1) }),
    }));
  });
  afterEach(() => {
    vi.doUnmock("@/lib/google");
    vi.doUnmock("@/lib/mail");
    vi.doUnmock("@/lib/booking/availability");
  });

  it("email mode: emails the owner, holds the slot and creates no event", async () => {
    mode = "email";
    const res = await (await load())({ status: "idle" }, form());
    expect(res.status).toBe("success");
    expect(res.booking).toMatchObject({ mode: "email", meetLink: null });
    expect(sendOwnerMail).toHaveBeenCalledTimes(1);
    expect(sendOwnerMail.mock.calls[0][1].subject).toMatch(/call request/i);
    expect(rememberBooking).toHaveBeenCalledWith(open[0], 30);
    expect(createMeetEvent).not.toHaveBeenCalled();
    expect(logRow).toHaveBeenCalledWith("Bookings", expect.arrayContaining(["requested"]));
  });

  it("email mode: a failed email fails the booking and holds nothing", async () => {
    mode = "email";
    sendOwnerMail.mockRejectedValue(new Error("smtp down"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await (await load())({ status: "idle" }, form());
    expect(res.status).toBe("error");
    expect(rememberBooking).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("is unavailable with neither Google nor SMTP", async () => {
    mode = "off";
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await (await load())({ status: "idle" }, form());
    expect(res.status).toBe("error");
    expect(sendOwnerMail).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  const form = (o: Record<string, string> = {}) => {
    const f = new FormData();
    for (const [k, v] of Object.entries({ name: "Ana Ruiz", email: "ana@example.com", slot: open[0], duration: "30", timeZone: "America/Chicago", startedAt: String(Date.now() - 20_000), ...o }))
      f.set(k, v);
    return f;
  };
  const load = async () => (await import("@/app/book-a-call/actions")).bookCall;

  it("creates the Meet event and logs a Bookings row", async () => {
    const res = await (await load())({ status: "idle" }, form());
    expect(res.status).toBe("success");
    expect(res.booking?.meetLink).toContain("meet.google.com");
    expect(createMeetEvent).toHaveBeenCalledWith(expect.objectContaining({ attendee: { email: "ana@example.com", name: "Ana Ruiz" } }));
    expect(logRow).toHaveBeenCalledWith("Bookings", expect.arrayContaining(["Ana Ruiz", "ana@example.com", "evt1", "booked"]));
  });

  it("books the chosen length and records it", async () => {
    open = ["2026-11-10T14:00:00.000Z", "2026-11-10T15:00:00.000Z"];
    const res = await (await load())({ status: "idle" }, form({ slot: open[1], duration: "60" }));
    expect(res.status).toBe("success");
    const { start, end, summary } = createMeetEvent.mock.calls[0][0];
    expect(end.getTime() - start.getTime()).toBe(60 * 60_000);
    expect(summary).toContain("1 hr");
    expect(logRow.mock.calls[0][1]).toContain(60);
  });

  it("refuses a length that isn't free at that time", async () => {
    const res = await (await load())({ status: "idle" }, form({ duration: "60" }));
    expect(res.status).toBe("taken");
    expect(createMeetEvent).not.toHaveBeenCalled();
  });

  it("refuses a slot that is no longer free", async () => {
    const res = await (await load())({ status: "idle" }, form({ slot: "2026-11-10T15:00:00.000Z" }));
    expect(res.status).toBe("taken");
    expect(createMeetEvent).not.toHaveBeenCalled();
  });

  it("drops bots without booking", async () => {
    const res = await (await load())({ status: "idle" }, form({ website: "spam.example" }));
    expect(res.status).toBe("error");
    expect(createMeetEvent).not.toHaveBeenCalled();
  });
});
