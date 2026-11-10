import { bookingEvent, bookingRules, type Duration } from "@/content/booking";
import { freeBusy, isCalendarConfigured } from "@/lib/google";
import { smtpConfig } from "@/lib/mail";
import { generateSlots, slotRange, type Interval } from "./slots";

export type SlotsByDuration = Record<Duration, string[]>;

/**
 * "google": free time comes from Google Calendar and bookings become Meet events.
 * "email": no Google keys yet, so slots are the working hours alone and each booking is
 * emailed to the owner to confirm by hand. "off": neither is set up.
 */
export type BookingMode = "google" | "email" | "off";

export const bookingMode = (): BookingMode => (isCalendarConfigured() ? "google" : smtpConfig() ? "email" : "off");

/**
 * Calls booked through this process. In email mode nothing else knows about them, so they
 * are the only busy time; it resets when the app restarts, which is acceptable only until
 * Google Calendar is connected. In Google mode the calendar is the truth (a call cancelled
 * there must free its slot), so they only count for a few minutes, until freeBusy shows the event.
 */
const MAX_LOCAL = 500;
const GOOGLE_GRACE_MS = 5 * 60_000;
let bookedLocally: (Interval & { at: number })[] = [];

export function rememberBooking(startIso: string, durationMin: number, now = Date.now()) {
  const start = Date.parse(startIso);
  bookedLocally = [
    ...bookedLocally.filter((b) => Date.parse(b.end) > now),
    { start: startIso, end: new Date(start + durationMin * 60_000).toISOString(), at: now },
  ].slice(-MAX_LOCAL);
  cache = null;
}

const localBusy = (google: boolean, now: number): Interval[] =>
  bookedLocally.filter((b) => !google || now - b.at < GOOGLE_GRACE_MS).map(({ start, end }) => ({ start, end }));

/**
 * Free slots for every call length, cached briefly so page views don't each cost a
 * freeBusy call. Bookings always re-check with `fresh`.
 */
const TTL_MS = 60_000;
let cache: { at: number; slots: SlotsByDuration } | null = null;

export async function availableSlots({ fresh = false, now = Date.now() } = {}): Promise<SlotsByDuration> {
  if (!fresh && cache && now - cache.at < TTL_MS) return cache.slots;
  const { timeMin, timeMax } = slotRange(bookingRules(bookingEvent.durations[0]), now);
  const google = bookingMode() === "google";
  const busy = [...(google ? await freeBusy(timeMin, timeMax) : []), ...localBusy(google, now)];
  const slots = Object.fromEntries(bookingEvent.durations.map((d) => [d, generateSlots(bookingRules(d), busy, now)])) as SlotsByDuration;
  cache = { at: now, slots };
  return slots;
}

/** Drop the cache after a booking so the next visitor doesn't see the slot just taken. */
export function invalidateSlots() {
  cache = null;
}

/** Test helper: forget local bookings and the cache. */
export function resetLocalBookings() {
  bookedLocally = [];
  cache = null;
}
