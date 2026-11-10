/**
 * Pure slot maths for the booking calendar, shared by the server (what can be booked)
 * and the browser (grouping slots by day in the visitor's time zone). No date library:
 * Intl does the time-zone work, including daylight-saving changes.
 */

export type Interval = { start: string; end: string };

/** Opening hours per weekday (0 = Sunday), as "HH:MM" ranges in the business time zone. */
export type WeeklyHours = Partial<Record<0 | 1 | 2 | 3 | 4 | 5 | 6, [string, string][]>>;

export type SlotRules = {
  timeZone: string;
  durationMin: number;
  /** Gap between possible start times. */
  stepMin: number;
  /** Free time kept before and after every existing event. */
  bufferMin: number;
  minNoticeMin: number;
  windowDays: number;
  hours: WeeklyHours;
};

const MIN = 60_000;
const DAY = 24 * 60 * MIN;

const formatters = new Map<string, Intl.DateTimeFormat>();
function partsFormatter(timeZone: string) {
  let f = formatters.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    formatters.set(timeZone, f);
  }
  return f;
}

/** Wall-clock fields of an instant in a time zone. */
export function zonedParts(at: number, timeZone: string) {
  const p = Object.fromEntries(partsFormatter(timeZone).formatToParts(new Date(at)).map((x) => [x.type, x.value]));
  return { y: Number(p.year), m0: Number(p.month) - 1, d: Number(p.day), h: Number(p.hour), min: Number(p.minute), s: Number(p.second) };
}

/** How far the zone's wall clock is ahead of UTC at that instant, in ms. */
export function tzOffsetMs(at: number, timeZone: string) {
  const p = zonedParts(at, timeZone);
  return Date.UTC(p.y, p.m0, p.d, p.h, p.min, p.s) - Math.floor(at / 1000) * 1000;
}

/** The instant a wall-clock time (minutes after midnight) happens in a zone. */
export function zonedTimeToUtc(y: number, m0: number, d: number, minutes: number, timeZone: string) {
  const wall = Date.UTC(y, m0, d) + minutes * MIN;
  // Two passes: the offset can differ between the guess and the answer around a DST change.
  const guess = wall - tzOffsetMs(wall, timeZone);
  return wall - tzOffsetMs(guess, timeZone);
}

/** "YYYY-MM-DD" of an instant in a zone. */
export function dateKey(at: number | string, timeZone: string) {
  const { y, m0, d } = zonedParts(typeof at === "string" ? Date.parse(at) : at, timeZone);
  return `${y}-${String(m0 + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function isTimeZone(tz: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** The span to ask the calendar about: from now to the end of the booking window. */
export function slotRange(rules: SlotRules, now: number) {
  return { timeMin: new Date(now), timeMax: new Date(now + (rules.windowDays + 1) * DAY) };
}

/** Start times (UTC ISO strings, ascending) that are inside opening hours, far enough ahead and clear of busy time. */
export function generateSlots(rules: SlotRules, busy: Interval[], now: number): string[] {
  const earliest = now + rules.minNoticeMin * MIN;
  const latest = now + rules.windowDays * DAY;
  const blocked = busy.map((b) => [Date.parse(b.start) - rules.bufferMin * MIN, Date.parse(b.end) + rules.bufferMin * MIN]);
  const today = zonedParts(now, rules.timeZone);
  const out: string[] = [];

  for (let i = 0; i <= rules.windowDays; i++) {
    const day = new Date(Date.UTC(today.y, today.m0, today.d + i));
    const [y, m0, d] = [day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate()];
    const ranges = rules.hours[day.getUTCDay() as keyof WeeklyHours] ?? [];
    for (const [from, to] of ranges) {
      const close = toMinutes(to);
      for (let m = toMinutes(from); m + rules.durationMin <= close; m += rules.stepMin) {
        const start = zonedTimeToUtc(y, m0, d, m, rules.timeZone);
        const end = start + rules.durationMin * MIN;
        if (start < earliest || start > latest) continue;
        if (blocked.some(([bs, be]) => bs < end && be > start)) continue;
        out.push(new Date(start).toISOString());
      }
    }
  }
  return out;
}
