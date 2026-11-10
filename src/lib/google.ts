/**
 * Google Calendar + Sheets over plain REST, authorised as the site owner with an OAuth
 * refresh token (see scripts/google-auth.mjs). No googleapis package: it is ~100 MB and
 * the cPanel plan caps memory, while the four calls used here are a few lines each.
 *
 * Server env: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN,
 * GOOGLE_CALENDAR_ID (default "primary") and GOOGLE_SHEET_ID.
 */

import type { Interval } from "@/lib/booking/slots";

const env = () => ({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
  sheetId: sheetIdFrom(process.env.GOOGLE_SHEET_ID),
});

/** Accepts the bare ID or the whole sheet URL (docs.google.com/spreadsheets/d/<ID>/edit…). */
export function sheetIdFrom(value: string | undefined) {
  const v = value?.trim();
  return v?.match(/\/spreadsheets\/d\/([\w-]+)/)?.[1] ?? (v || undefined);
}

const hasAuth = () => {
  const e = env();
  return Boolean(e.clientId && e.clientSecret && e.refreshToken);
};

/** Booking needs the calendar; the sheet is optional (rows are skipped without it). */
export const isCalendarConfigured = hasAuth;
export const isSheetConfigured = () => hasAuth() && Boolean(env().sheetId);

let token: { value: string; expiresAt: number } | null = null;

async function accessToken() {
  if (token && token.expiresAt > Date.now() + 60_000) return token.value;
  const { clientId, clientSecret, refreshToken } = env();
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId!, client_secret: clientSecret!, refresh_token: refreshToken!, grant_type: "refresh_token" }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new GoogleError("token", res.status, await res.text());
  const data = (await res.json()) as { access_token: string; expires_in: number };
  token = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return token.value;
}

export class GoogleError extends Error {
  constructor(
    readonly call: string,
    readonly status: number,
    body: string,
  ) {
    // Google error bodies carry a reason, never the token; keep them short for the log.
    super(`[google] ${call} failed: ${status} ${body.slice(0, 300)}`);
  }
}

async function call<T>(name: string, url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new GoogleError(name, res.status, await res.text());
  return (await res.json()) as T;
}

/** Busy intervals on the booking calendar between two instants. */
export async function freeBusy(timeMin: Date, timeMax: Date): Promise<Interval[]> {
  const { calendarId } = env();
  const data = await call<{ calendars: Record<string, { busy?: Interval[]; errors?: unknown[] }> }>(
    "freeBusy",
    "https://www.googleapis.com/calendar/v3/freeBusy",
    { timeMin: timeMin.toISOString(), timeMax: timeMax.toISOString(), items: [{ id: calendarId }] },
  );
  const cal = data.calendars[calendarId] ?? Object.values(data.calendars)[0];
  if (!cal || cal.errors?.length) throw new GoogleError("freeBusy", 200, JSON.stringify(cal?.errors ?? "no calendar"));
  return cal.busy ?? [];
}

/**
 * Website bookings are filled in Google's "Banana" (colorId 5), the nearest of its 11 event
 * colours to the brand gold, so they stand out as solid blocks. GOOGLE_EVENT_COLOR (1–11) overrides it.
 */
const eventColor = () => (/^(?:[1-9]|1[01])$/.test(process.env.GOOGLE_EVENT_COLOR ?? "") ? process.env.GOOGLE_EVENT_COLOR! : "5");

/**
 * The owner's reminders for a booked call: Google emails the calendar's Gmail a day and an
 * hour before, and pops up on their phone and desktop 30 and 10 minutes before.
 */
const OWNER_REMINDERS = [
  { method: "email", minutes: 24 * 60 },
  { method: "email", minutes: 60 },
  { method: "popup", minutes: 30 },
  { method: "popup", minutes: 10 },
];

/** Creates the call on the owner's calendar with a Meet link; Google emails the invite to the attendee. */
export async function createMeetEvent(input: {
  summary: string;
  description: string;
  start: Date;
  end: Date;
  attendee: { email: string; name: string };
  requestId: string;
}) {
  const { calendarId } = env();
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?conferenceDataVersion=1&sendUpdates=all`;
  const event = await call<{ id: string; htmlLink: string; hangoutLink?: string }>("createEvent", url, {
    summary: input.summary,
    description: input.description,
    start: { dateTime: input.start.toISOString() },
    end: { dateTime: input.end.toISOString() },
    // Booking with the calendar's own address (e.g. a test) would leave the owner's copy
    // "unanswered", which Google draws as a faint outline instead of a filled block.
    attendees: [
      {
        email: input.attendee.email,
        displayName: input.attendee.name,
        ...(input.attendee.email.toLowerCase() === calendarId.toLowerCase() && { responseStatus: "accepted" }),
      },
    ],
    conferenceData: { createRequest: { requestId: input.requestId, conferenceSolutionKey: { type: "hangoutsMeet" } } },
    colorId: eventColor(),
    reminders: { useDefault: false, overrides: OWNER_REMINDERS },
  });
  return { id: event.id, meetLink: event.hangoutLink ?? null, htmlLink: event.htmlLink };
}

/**
 * Appends one row to a tab of the leads sheet. RAW input, so a visitor typing
 * "=HYPERLINK(...)" is stored as text instead of becoming a live formula.
 */
export async function appendRow(tab: "Bookings" | "Leads", row: (string | number)[]) {
  const { sheetId } = env();
  const range = encodeURIComponent(`${tab}!A1`);
  await call("appendRow", `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
    values: [row],
  });
}

/** appendRow that never throws: a Sheets outage must not lose the enquiry or booking itself. */
export async function logRow(tab: "Bookings" | "Leads", row: (string | number)[]) {
  if (!isSheetConfigured()) return;
  try {
    await appendRow(tab, row);
  } catch (err) {
    console.error(err instanceof Error ? err.message : `[google] appendRow failed`);
  }
}
