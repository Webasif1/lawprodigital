import { bookingEvent, bookingTimeZone } from "@/content/booking";
import { availableSlots, bookingMode } from "@/lib/booking/availability";

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
    return json({ enabled: true, mode, timeZone: bookingTimeZone(), durations: bookingEvent.durations, slots: await availableSlots() });
  } catch (err) {
    console.error(err instanceof Error ? err.message : "[booking] slots failed");
    return json({ enabled: true, error: "unavailable", slots: {} }, 502);
  }
}
