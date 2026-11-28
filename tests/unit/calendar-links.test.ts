import { describe, expect, it } from "vitest";
import { googleCalendarUrl, icsFile, utcStamp } from "@/lib/booking/calendar-links";

const entry = {
  title: "Free Strategy Call (30 min)",
  details: "Hi, team; notes, here\nline two",
  start: new Date("2026-11-29T15:00:00Z"),
  end: new Date("2026-11-29T15:30:00Z"),
  location: "https://meet.google.com/abc-defg-hij",
};

describe("calendar links", () => {
  it("formats UTC stamps", () => {
    expect(utcStamp(entry.start)).toBe("20261129T150000Z");
  });

  it("builds a Google Calendar template link", () => {
    const url = new URL(googleCalendarUrl(entry));
    expect(url.searchParams.get("action")).toBe("TEMPLATE");
    expect(url.searchParams.get("dates")).toBe("20261129T150000Z/20261129T153000Z");
    expect(url.searchParams.get("location")).toBe(entry.location);
    expect(url.searchParams.get("details")).toBe(entry.details);
  });

  it("omits location without a Meet link", () => {
    expect(new URL(googleCalendarUrl({ ...entry, location: null })).searchParams.has("location")).toBe(false);
  });

  it("writes an escaped, folded ICS event", () => {
    const ics = icsFile({ ...entry, uid: "x@lawprodigital.com", now: entry.start });
    expect(ics).toContain("DTSTART:20261129T150000Z\r\n");
    expect(ics).toContain("DTEND:20261129T153000Z\r\n");
    expect(ics).toContain("DESCRIPTION:Hi\\, team\\; notes\\, here\\nline two");
    expect(ics).toContain("LOCATION:https://meet.google.com/abc-defg-hij");
    for (const line of ics.split("\r\n")) expect(line.length).toBeLessThanOrEqual(75);
  });
});
