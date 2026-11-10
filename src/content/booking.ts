import type { SlotRules } from "@/lib/booking/slots";

/**
 * The bookable strategy call. Hours are in the business time zone; visitors see every
 * slot converted to their own zone. Busy time on the Google Calendar removes slots
 * automatically, so block holidays and days off there rather than here.
 *
 * TODO(owner): confirm hours, lengths, buffer and notice.
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
    hours: {
      1: [["09:00", "17:00"]],
      2: [["09:00", "17:00"]],
      3: [["09:00", "17:00"]],
      4: [["09:00", "17:00"]],
      5: [["09:00", "17:00"]],
    },
  };
}

export const bookingTimeZone = () => process.env.BOOKING_TIMEZONE || "America/New_York";

/** Where the owner actually is, for the "your time" line in booking emails (Google Calendar shows GMT+6). */
export const ownerTimeZone = () => process.env.OWNER_TIMEZONE || "Asia/Dhaka";
