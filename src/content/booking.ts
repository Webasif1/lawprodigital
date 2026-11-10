import type { SlotRules } from "@/lib/booking/slots";

/**
 * The bookable strategy call. Visitors can book any time, day or night, that is free on
 * the Google Calendar: busy time there removes slots automatically, so block sleep, days
 * off and holidays in the calendar rather than here. Visitors see slots in their own zone.
 */
export const bookingEvent = {
  title: "Free Strategy Call",
  /** Call lengths the visitor can choose, in minutes. */
  durations: [15, 30, 60] as const,
  location: "Google Meet",
  description:
    "A call with our team: we walk you through how your firm shows up on Google, Maps and ChatGPT, and where you’re losing leads after hours.",
};

export type Duration = (typeof bookingEvent.durations)[number];

export const isDuration = (n: number): n is Duration => (bookingEvent.durations as readonly number[]).includes(n);

export const durationLabel = (min: number) => (min % 60 === 0 ? `${min / 60} hr` : `${min} min`);

/** Server-side only: BOOKING_TIMEZONE is read at request time. */
export function bookingRules(durationMin: Duration): SlotRules {
  return {
    timeZone: bookingTimeZone(),
    durationMin,
    // Short calls can start on the quarter hour; longer ones on :00 and :30.
    stepMin: durationMin < 30 ? 15 : 30,
    bufferMin: 15,
    minNoticeMin: 12 * 60,
    windowDays: 30,
    // Open around the clock, every day; the calendar's busy time does the narrowing.
    hours: Object.fromEntries([0, 1, 2, 3, 4, 5, 6].map((d) => [d, ALL_DAY])),
  };
}

const ALL_DAY: [string, string][] = [["00:00", "24:00"]];

export const bookingTimeZone = () => process.env.BOOKING_TIMEZONE || "America/New_York";

/** Where the owner actually is, for the "your time" line in booking emails (Google Calendar shows GMT+6). */
export const ownerTimeZone = () => process.env.OWNER_TIMEZONE || "Asia/Dhaka";
