import { bookingEvent, bookingTimeZone } from "@/content/booking";
import { bookingMode, slotAvailability } from "@/lib/booking/availability";

/**
 * Bookable start times per call length for the booking calendar. With neither Google nor
 * SMTP configured the calendar reports itself as disabled and is hidden (or points to the form).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

export async function GET() {
  const mode = bookingMode();
  if (mode === "off") return json({ enabled: false });
  try {
    // `taken`: times that clash with an existing booking or event. Only their start times are
    // sent (never what or whose), so the picker can show them greyed out as "Booked".
    const { slots, taken } = await slotAvailability();
    return json({ enabled: true, mode, timeZone: bookingTimeZone(), durations: bookingEvent.durations, slots, taken });
  } catch (err) {
    console.error(err instanceof Error ? err.message : "[booking] slots failed");
    return json({ enabled: true, error: "unavailable", slots: {} }, 502);
  }
}
