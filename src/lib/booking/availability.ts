import { bookingEvent, bookingRules, type Duration } from "@/content/booking";
import { freeBusy, isCalendarConfigured } from "@/lib/google";
import { sendOwnerMail, smtpConfig, smtpErrorSummary } from "@/lib/mail";
import { slotRange, slotStates, type Interval } from "./slots";

export type SlotsByDuration = Record<Duration, string[]>;

/**
 * "google": free time comes from Google Calendar and bookings become Meet events.
 * "email": no Google keys yet, so slots are the working hours alone and each booking is
 * emailed to the owner to confirm by hand. "off": neither is set up.
 */
export type BookingMode = "google" | "email" | "off";

export const bookingMode = (): BookingMode => (isCalendarConfigured() ? "google" : smtpConfig() ? "email" : "off");

/** How long to stay in email mode after a Google failure before trying Google again. */
const GOOGLE_RETRY_MS = 5 * 60_000;

/**
 * The mode to use right now. Like bookingMode, but while Google is failing (an expired
 * refresh token, an outage) it drops to email mode when SMTP is set up, so the calendar
 * keeps taking requests instead of vanishing from the site.
 */
export const liveBookingMode = (now = Date.now()): BookingMode => {
  const mode = bookingMode();
  return mode === "google" && store.googleDownUntil > now && smtpConfig() ? "email" : mode;
};

/** Record a Google failure. Returns true when email mode can take over. */
export function markGoogleDown(err: unknown, now = Date.now()) {
  console.error(err instanceof Error ? err.message : "[booking] Google failed");
  if (!smtpConfig()) return false;
  console.error("[booking] Google Calendar unavailable, using email mode. Check GOOGLE_REFRESH_TOKEN.");
  store.googleDownUntil = now + GOOGLE_RETRY_MS;
  store.cache = null;
  alertOwner(err, now);
  return true;
}

/** How often, at most, to email the owner that Google is down. */
const ALERT_EVERY_MS = 6 * 60 * 60_000;

/**
 * Tells the owner Google has dropped out, so bookings don't silently arrive without Meet
 * links for days (a refresh token from an OAuth app left in "Testing" dies after 7 days).
 * Fire-and-forget: it never delays or fails a booking.
 */
function alertOwner(err: unknown, now: number) {
  const mail = smtpConfig();
  if (!mail || now - store.alertedAt < ALERT_EVERY_MS) return;
  store.alertedAt = now;
  const reason = (err instanceof Error ? err.message : String(err)).slice(0, 400);
  const expired = /invalid_grant/.test(reason);
  const text = [
    "Google Calendar is disconnected from the booking page on lawprodigital.com.",
    "Bookings still come in, but as email requests: no Google Meet link and no calendar invite for the client.",
    "",
    `Cause: ${reason}`,
    "",
    expired
      ? "The refresh token has expired or was revoked. In Google Cloud console make sure the OAuth consent screen is \"In production\" (not Testing), then run scripts/google-auth.mjs on your computer, put the new GOOGLE_REFRESH_TOKEN in cPanel (Setup Node.js App > Environment variables) and restart the app."
      : "Run `npm run google:check` on the server (or locally with the same GOOGLE_* values) to see what is wrong.",
    "",
    "You will get this email at most once every 6 hours while the problem lasts.",
  ].join("\n");
  const html = `<pre style="font:14px/1.5 system-ui,sans-serif;white-space:pre-wrap">${text.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!)}</pre>`;
  sendOwnerMail(mail, {
    replyTo: { name: "Law Pro Digital website", address: mail.to },
    subject: "⚠️ Booking: Google Calendar disconnected (no Meet links)",
    text,
    html,
  }).catch((e) => console.error(`[booking] Failed to send Google-down alert: ${smtpErrorSummary(e)}`));
}

/**
 * State shared by the booking server action and the slots API route. Next bundles those
 * two separately, each with its own copy of this module, so plain module variables would
 * leave the picker showing a just-booked slot until its cache expired. globalThis is the
 * one object both see in the single cPanel Node process.
 *
 * `booked`: calls booked through this process. In email mode nothing else knows about
 * them, so they are the only busy time (until the app restarts). In Google mode the
 * calendar is the truth (a call cancelled there must free its slot), so they only count
 * for a few minutes, until freeBusy shows the event.
 */
type Store = {
  booked: (Interval & { at: number })[];
  cache: { at: number; mode: BookingMode; slots: SlotsByDuration; taken: SlotsByDuration } | null;
  googleDownUntil: number;
  /** When the owner was last emailed that Google is down. */
  alertedAt: number;
};
const store: Store = ((globalThis as { __lawproBooking?: Store }).__lawproBooking ??= { booked: [], cache: null, googleDownUntil: 0, alertedAt: 0 });

const MAX_LOCAL = 500;
const GOOGLE_GRACE_MS = 5 * 60_000;

export function rememberBooking(startIso: string, durationMin: number, now = Date.now()) {
  const start = Date.parse(startIso);
  store.booked = [
    ...store.booked.filter((b) => Date.parse(b.end) > now),
    { start: startIso, end: new Date(start + durationMin * 60_000).toISOString(), at: now },
  ].slice(-MAX_LOCAL);
  store.cache = null;
}

const localBusy = (google: boolean, now: number): Interval[] =>
  store.booked.filter((b) => !google || now - b.at < GOOGLE_GRACE_MS).map(({ start, end }) => ({ start, end }));

/**
 * Free slots for every call length, cached briefly so page views don't each cost a
 * freeBusy call. Bookings always re-check with `fresh`.
 */
const TTL_MS = 60_000;

export async function availableSlots(opts: { fresh?: boolean; now?: number } = {}): Promise<SlotsByDuration> {
  return (await slotAvailability(opts)).slots;
}

/** Bookable times (`slots`) and already-booked ones (`taken`, shown greyed out), per call length. */
export async function slotAvailability({ fresh = false, now = Date.now() } = {}) {
  if (!fresh && store.cache && now - store.cache.at < TTL_MS) return store.cache;
  const { timeMin, timeMax } = slotRange(bookingRules(bookingEvent.durations[0]), now);
  let mode = liveBookingMode(now);
  let calendarBusy: Interval[] = [];
  if (mode === "google") {
    try {
      calendarBusy = await freeBusy(timeMin, timeMax);
    } catch (err) {
      if (!markGoogleDown(err, now)) throw err;
      mode = "email";
    }
  }
  const google = mode === "google";
  const busy = [...calendarBusy, ...localBusy(google, now)];
  const states = bookingEvent.durations.map((d) => [d, slotStates(bookingRules(d), busy, now)] as const);
  const pick = (k: "open" | "booked") => Object.fromEntries(states.map(([d, s]) => [d, s[k]])) as SlotsByDuration;
  store.cache = { at: now, mode, slots: pick("open"), taken: pick("booked") };
  return store.cache;
}

/** Drop the cache after a booking so the next visitor doesn't see the slot just taken. */
export function invalidateSlots() {
  store.cache = null;
}

/** Test helper: forget local bookings and the cache. */
export function resetLocalBookings() {
  store.booked = [];
  store.cache = null;
  store.googleDownUntil = 0;
  store.alertedAt = 0;
}
