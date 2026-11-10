"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { looksAutomated } from "@/app/contact-us/validate";
import { bookingEvent, bookingTimeZone, durationLabel, ownerTimeZone, type Duration } from "@/content/booking";
import { availableSlots, bookingMode, rememberBooking } from "@/lib/booking/availability";
import { createMeetEvent, logRow } from "@/lib/google";
import { sendOwnerMail, smtpConfig, smtpErrorSummary } from "@/lib/mail";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import type { BookingState } from "./form-config";
import { describeBooking, formatInZone, ownerBookingEmail, readBooking, safeTimeZone, validateBooking } from "./validate";

// 3 bookings per IP and 20 in total per hour.
const rateLimited = createRateLimiter({ windowMs: 60 * 60 * 1000, perKey: 3, global: 20 });

// Slots being booked right now. The app is one Node process on cPanel, so this stops
// two visitors who confirm the same time at once from both getting it.
const inFlight = new Set<string>();

export async function bookCall(_prev: BookingState, formData: FormData): Promise<BookingState> {
  const v = readBooking(formData);
  const values = { name: v.name, email: v.email, phone: v.phone, firmWebsite: v.firmWebsite, notes: v.notes };
  const h = await headers();
  const ip = clientIp(h.get("x-forwarded-for"), h.get("x-real-ip"));

  const automated = looksAutomated(formData);
  if (automated) {
    console.warn(`[booking] blocked reason=${automated} ip=${ip}`);
    return { status: "error", message: "Your booking could not be completed. Please try again.", values };
  }

  const { slot, ...errors } = validateBooking(v);
  if (slot) return { status: "taken", message: "Please pick a time again." };
  if (Object.keys(errors).length) return { status: "error", message: "Please check the highlighted fields.", errors, values };

  const mode = bookingMode();
  if (mode === "off") {
    console.error("[booking] Neither Google nor SMTP is configured: set the GOOGLE_* or SMTP_* variables.");
    return { status: "error", message: "Online booking is temporarily unavailable. Please use our contact form instead.", values };
  }

  if (rateLimited(ip)) {
    console.warn(`[booking] blocked reason=rate-limit ip=${ip}`);
    return { status: "error", message: "Too many bookings in a short time. Please try again later.", values };
  }

  // validateBooking has checked the length is one of bookingEvent.durations.
  const duration = v.duration as Duration;
  // Overlapping requests for the same start would collide whatever their length.
  if (inFlight.has(v.slot)) return { status: "taken", message: "Someone just booked that time. Please choose another." };
  inFlight.add(v.slot);
  try {
    const businessZone = bookingTimeZone();
    const timeZone = safeTimeZone(v.timeZone, businessZone);
    // Re-check against the live calendar, not the cached list the picker showed.
    if (!(await availableSlots({ fresh: true }))[duration].includes(v.slot)) {
      return { status: "taken", message: "That time is no longer available. Please choose another." };
    }

    const start = new Date(v.slot);
    const end = new Date(start.getTime() + duration * 60_000);
    const ownerZone = ownerTimeZone();
    const info = describeBooking({ ...v, timeZone }, start, businessZone, ownerZone);
    const ownerMail = (meetLink: string | null, eventLink: string | null, confirmByHand: boolean) => ({
      replyTo: { name: info.name, address: v.email },
      ...ownerBookingEmail({ info, start, durationMin: duration, ownerZone, meetLink, eventLink, confirmByHand }),
    });
    const when = formatInZone(start, businessZone);
    const row = (meetLink: string, eventId: string, status: string) => [
      new Date().toISOString(),
      when,
      start.toISOString(),
      timeZone,
      duration,
      info.name,
      v.email,
      v.phone,
      info.website,
      v.notes,
      meetLink,
      eventId,
      status,
    ];
    const booking = { start: start.toISOString(), end: end.toISOString(), durationMin: duration, name: info.name, email: v.email, mode };

    if (mode === "email") {
      // No calendar yet: the owner's inbox is the only record, so a failed email fails the booking.
      await sendOwnerMail(smtpConfig()!, ownerMail(null, null, true));
      rememberBooking(v.slot, duration);
      await logRow("Bookings", row("", "", "requested"));
      return { status: "success", booking: { ...booking, meetLink: null } };
    }

    const event = await createMeetEvent({
      // A marker up front so website bookings are easy to spot among the owner's own events.
      summary: `📞 BOOKED: ${info.name} · ${bookingEvent.title} (${durationLabel(duration)})`,
      description: info.text,
      start,
      end,
      attendee: { email: v.email, name: info.name },
      requestId: randomUUID(),
    });
    rememberBooking(v.slot, duration);
    await logRow("Bookings", row(event.meetLink ?? "", event.id, "booked"));

    // Google already puts the call on the owner's calendar; the email is the inbox heads-up.
    const mail = smtpConfig();
    if (mail) {
      await sendOwnerMail(mail, ownerMail(event.meetLink, event.htmlLink, false)).catch((err) =>
        console.error(`[booking] Failed to send email: ${smtpErrorSummary(err)}`),
      );
    }

    return { status: "success", booking: { ...booking, meetLink: event.meetLink } };
  } catch (err) {
    console.error(err instanceof Error ? err.message : "[booking] failed");
    return { status: "error", message: "Something went wrong booking your call. Please try again shortly.", values };
  } finally {
    inFlight.delete(v.slot);
  }
}
