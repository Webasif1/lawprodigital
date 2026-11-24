import { EMAIL_RE, MAX, PHONE_RE, escapeHtml, normalizeWebsite, oneLine } from "@/app/contact-us/validate";
import { durationLabel, isDuration } from "@/content/booking";
import { isTimeZone } from "@/lib/booking/slots";
import type { BookingField } from "./form-config";

/** Pure helpers for the booking server action (unit-tested in tests/unit/booking.test.ts). */

export const MAX_NOTES = 2000;

export type BookingValues = Record<BookingField, string> & { slot: string; timeZone: string; duration: number };

export function readBooking(formData: FormData): BookingValues {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  return {
    name: get("name"),
    email: get("email"),
    phone: get("phone"),
    firmWebsite: get("firmWebsite"),
    notes: get("notes"),
    slot: get("slot"),
    timeZone: get("timeZone"),
    duration: Number(get("duration")),
  };
}

/** Field errors, plus `slot` when the chosen time itself is malformed (not shown on a field). */
export function validateBooking(v: BookingValues) {
  const errors: Partial<Record<BookingField | "slot", string>> = {};
  if (!v.name) errors.name = "Please enter your name.";
  else if (v.name.length > MAX.name * 2) errors.name = "That name is too long.";
  if (!v.email) errors.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(v.email) || /[\r\n]/.test(v.email) || v.email.length > MAX.email) errors.email = "Please enter a valid email address.";
  if (v.phone && (v.phone.length > MAX.phone || !PHONE_RE.test(v.phone))) errors.phone = "Please enter a valid phone number.";
  if (v.firmWebsite && !normalizeWebsite(v.firmWebsite)) errors.firmWebsite = "Please enter a valid website, like yourfirm.com.";
  if (v.notes.length > MAX_NOTES) errors.notes = `Please keep this under ${MAX_NOTES} characters.`;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v.slot) || Number.isNaN(Date.parse(v.slot)) || !isDuration(v.duration))
    errors.slot = "Please pick a time.";
  return errors;
}

/** The visitor's zone if it is a real IANA zone, else the business zone. */
export const safeTimeZone = (tz: string, fallback: string) => (tz && tz.length < 64 && isTimeZone(tz) ? tz : fallback);

/** e.g. "Tuesday, November 10, 2026, 9:00 AM EST". */
export const formatInZone = (at: Date, timeZone: string) =>
  new Intl.DateTimeFormat("en-US", { timeZone, dateStyle: "full", timeStyle: "short" }).format(at) +
  ` (${timeZone.replace(/_/g, " ")})`;

export function describeBooking(v: BookingValues, start: Date, businessZone: string, ownerZone = businessZone) {
  const name = oneLine(v.name);
  const website = v.firmWebsite ? (normalizeWebsite(v.firmWebsite) ?? v.firmWebsite) : "";
  const zones = [...new Set([ownerZone, businessZone])];
  const rows: [string, string][] = [
    ["Name", name],
    ["Email", v.email],
    ["Phone", v.phone || "—"],
    ["Website", website || "—"],
    ...zones.map((z, i): [string, string] => [i === 0 ? "When (yours)" : "When (business hours)", formatInZone(start, z)]),
    ["When (client)", formatInZone(start, v.timeZone)],
    ["Length", durationLabel(v.duration)],
  ];
  const notes = v.notes || "—";
  const text = `${rows.map(([k, val]) => `${k}: ${val}`).join("\n")}\n\nNotes:\n${notes}`;
  return { name, website, rows, notes, text };
}

/**
 * The owner's "new booking" email: a big, scannable card with the time in the owner's zone,
 * a Join button and the client's details. Inline styles only, so Gmail renders it as designed.
 */
export function ownerBookingEmail(input: {
  info: ReturnType<typeof describeBooking>;
  start: Date;
  durationMin: number;
  ownerZone: string;
  meetLink: string | null;
  eventLink?: string | null;
  /** Email mode: the owner has to confirm and send the meeting link by hand. */
  confirmByHand?: boolean;
}) {
  const { info, start, durationMin, ownerZone, meetLink, eventLink, confirmByHand } = input;
  const day = new Intl.DateTimeFormat("en-US", { timeZone: ownerZone, weekday: "long", month: "long", day: "numeric" }).format(start);
  const time = new Intl.DateTimeFormat("en-US", { timeZone: ownerZone, hour: "numeric", minute: "2-digit" }).format(start);
  const length = durationLabel(durationMin);
  const subject = oneLine(`📅 ${confirmByHand ? "Call request" : "New booking"}: ${info.name}, ${day} at ${time} (${length})`);

  const button = (href: string, label: string, primary: boolean) =>
    `<a href="${escapeHtml(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 20px;border-radius:10px;font-weight:600;text-decoration:none;${
      primary ? "background:#d6ad3b;color:#0b1527" : "background:#ffffff;color:#0f1f3d;border:1px solid #dbe1ea"
    }">${label}</a>`;
  const buttons = [
    meetLink && button(meetLink, "Join Google Meet", true),
    eventLink && button(eventLink, "Open in Google Calendar", !meetLink),
    button(`mailto:${info.rows.find(([k]) => k === "Email")![1]}`, "Email the client", false),
  ]
    .filter(Boolean)
    .join("");
  const detailRows = info.rows
    .map(
      ([k, val]) =>
        `<tr><td style="padding:10px 0;border-top:1px solid #e9edf3;color:#566176;width:150px;vertical-align:top">${k}</td><td style="padding:10px 0;border-top:1px solid #e9edf3;color:#0b1527;font-weight:600">${escapeHtml(val)}</td></tr>`,
    )
    .join("");

  const html = `<div style="background:#f4f6f9;padding:24px 12px;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #dbe1ea">
<div style="background:#0f1f3d;padding:28px 28px 24px;color:#f4f6f9">
<div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#d6ad3b;font-weight:700">${confirmByHand ? "Call request — please confirm" : "New call booked"}</div>
<div style="font-size:30px;line-height:1.2;font-weight:700;margin-top:10px">${escapeHtml(day)}</div>
<div style="font-size:44px;line-height:1.1;font-weight:700;color:#d6ad3b;margin-top:4px">${escapeHtml(time)}</div>
<div style="font-size:15px;color:#a9b5ca;margin-top:8px">${escapeHtml(length)} · your time (${escapeHtml(ownerZone.replace(/_/g, " "))})</div>
</div>
<div style="padding:24px 28px">
<div style="font-size:22px;font-weight:700;color:#0b1527">${escapeHtml(info.name)}</div>
${confirmByHand ? `<p style="margin:12px 0 0;padding:12px 14px;background:#f6ecd0;border-radius:10px;color:#0b1527">No calendar invite was sent automatically. Reply to this email to confirm and send the meeting link.</p>` : ""}
<div style="margin-top:18px">${buttons}</div>
<table style="width:100%;border-collapse:collapse;margin-top:12px;font-size:14px">${detailRows}</table>
<div style="margin-top:18px;font-size:13px;color:#566176;text-transform:uppercase;letter-spacing:.08em;font-weight:700">Notes</div>
<div style="margin-top:6px;font-size:15px;color:#0b1527;white-space:pre-wrap">${escapeHtml(info.notes)}</div>
</div></div>
<p style="max-width:560px;margin:14px auto 0;font-size:12px;color:#566176;text-align:center">Booked on lawprodigital.com. Reply to this email to reach the client.</p>
</div>`;

  const text = `${confirmByHand ? "CALL REQUEST (please confirm)" : "NEW CALL BOOKED"}\n${day} at ${time} (${length}, your time)\n\n${info.text}${
    meetLink ? `\n\nJoin: ${meetLink}` : ""
  }${confirmByHand ? "\n\nNo calendar invite was sent automatically. Reply to confirm and send the meeting link." : ""}`;
  return { subject, text, html };
}
