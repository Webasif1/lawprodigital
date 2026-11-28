/**
 * "Add to calendar" links for a booked call, so the visitor can put it on their own
 * calendar themselves (Google, Outlook, Apple) even before or without our Google invite.
 */

export type CalendarEntry = {
  title: string;
  details: string;
  start: Date;
  end: Date;
  /** The Meet link when we have one. */
  location?: string | null;
};

/** 2026-11-29T15:00:00.000Z → 20261129T150000Z (the UTC form Google and iCalendar both read). */
export const utcStamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function googleCalendarUrl(e: CalendarEntry) {
  const url = new URL("https://calendar.google.com/calendar/render");
  url.search = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${utcStamp(e.start)}/${utcStamp(e.end)}`,
    details: e.details,
    ...(e.location && { location: e.location }),
  }).toString();
  return url.toString();
}

/** RFC 5545 TEXT escaping: backslash, semicolon, comma and newlines. */
const icsText = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** Lines longer than 75 octets are folded with CRLF + space. */
const fold = (line: string) => {
  const out: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    out.push(rest.slice(0, 74));
    rest = rest.slice(74);
  }
  out.push(rest);
  return out.join("\r\n ");
};

export function icsFile(e: CalendarEntry & { uid: string; now?: Date }) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Law Pro Digital//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.uid}`,
    `DTSTAMP:${utcStamp(e.now ?? new Date())}`,
    `DTSTART:${utcStamp(e.start)}`,
    `DTEND:${utcStamp(e.end)}`,
    `SUMMARY:${icsText(e.title)}`,
    `DESCRIPTION:${icsText(e.details)}`,
    ...(e.location ? [`LOCATION:${icsText(e.location)}`, `URL:${e.location}`] : []),
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder",
    "TRIGGER:-PT15M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}
