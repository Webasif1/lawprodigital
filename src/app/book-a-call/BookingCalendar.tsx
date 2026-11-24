"use client";

import Image from "next/image";
import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef, useState, type ReactNode, type RefObject, type SVGProps } from "react";
import { ButtonArrow, ButtonLink, buttonClasses } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";
import { bookingEvent, durationLabel } from "@/content/booking";
import { site } from "@/content/site";
import { trackLead } from "@/lib/analytics";
import { dateKey, zonedParts } from "@/lib/booking/slots";
import { bookCall } from "./actions";
import type { BookingField, BookingState } from "./form-config";

type SlotsResponse =
  | { enabled: false }
  | {
      enabled: true;
      mode?: "google" | "email";
      timeZone?: string;
      durations?: number[];
      slots: Record<string, string[]>;
      /** Already-booked start times, shown greyed out so the day's grid has no gaps. */
      taken?: Record<string, string[]>;
      error?: string;
    };

const initial: BookingState = { status: "idle" };
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const inputClass =
  "mt-2 block w-full rounded-field border-0 bg-surface px-4 py-3 text-ink ring-1 ring-line transition-shadow placeholder:text-muted/70 hover:ring-ink/30 focus:outline-none focus:ring-2 focus:ring-navy aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-600";

const timeFormat = (tz: string, hour12: boolean) => new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit", hour12 });
const longDate = (iso: string, tz: string) =>
  new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date(iso));
const keyToUtc = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
const monthKey = (y: number, m0: number) => `${y}-${String(m0 + 1).padStart(2, "0")}`;
const shortDuration = (min: number) => (min % 60 === 0 ? `${min / 60}h` : `${min}m`);

function timeZones(current: string) {
  const all = typeof Intl.supportedValuesOf === "function" ? Intl.supportedValuesOf("timeZone") : [];
  return all.includes(current) ? all : [current, ...all];
}

/**
 * The strategy-call booker, laid out like Cal.com: pick a day on the month calendar, then
 * how long the call should be, then a time, then a short details step and a confirmation.
 * Times are shown in the visitor's zone (switchable); the server only receives the UTC start.
 */
export function BookingCalendar({
  header,
  footer,
  bodyClassName,
  fallback,
}: {
  /** Shown above and below the booker, and replaced along with it by `fallback`. */
  header?: ReactNode;
  footer?: ReactNode;
  /** Wrapper around the booker itself, e.g. the page container. */
  bodyClassName?: string;
  /** Rendered instead of the "use the contact form" card when booking is off, e.g. the form itself. */
  fallback?: ReactNode;
} = {}) {
  const [data, setData] = useState<SlotsResponse | null>(null);
  const [reload, setReload] = useState(0);
  // Read from the browser on first render. The server render only ever shows the loading
  // skeleton, which doesn't depend on these, so there is no hydration mismatch.
  const [tz, setTz] = useState(() => (typeof window === "undefined" ? "America/New_York" : Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York"));
  const [hour12, setHour12] = useState(
    () => typeof navigator === "undefined" || !/^(en-GB|de|fr|es|it|nl|pt|ru|pl|sv|da|nb|fi|cs|tr|ja|zh|ko)/i.test(navigator.language),
  );
  const [now] = useState(() => Date.now());
  const [month, setMonth] = useState<{ y: number; m0: number } | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [step, setStep] = useState<"pick" | "details">("pick");
  const [notice, setNotice] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState(bookCall, initial);
  const startedAt = useRef<number>(0);
  const sideRef = useRef<HTMLDivElement>(null);
  const formTop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // A "taken" result sends the visitor back to the picker with fresh times.
  const [handled, setHandled] = useState(state);
  if (state !== handled) {
    setHandled(state);
    if (state.status === "taken") {
      setStep("pick");
      setSlot(null);
      setNotice(state.message ?? "That time is no longer available.");
      setReload((n) => n + 1);
    }
  }

  useEffect(() => {
    let live = true;
    fetch("/api/booking/slots/", { cache: "no-store" })
      .then((r) => r.json() as Promise<SlotsResponse>)
      .then((d) => live && setData(d))
      .catch(() => live && setData({ enabled: true, error: "unavailable", slots: {} }));
    return () => {
      live = false;
    };
  }, [reload]);

  // Someone else may book while this page sits open: refresh the times every two minutes
  // and when the visitor comes back to the tab, but not while they fill in the form.
  useEffect(() => {
    if (step !== "pick") return;
    const refresh = () => document.visibilityState === "visible" && setReload((n) => n + 1);
    const timer = window.setInterval(refresh, 2 * 60_000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [step]);

  useEffect(() => {
    if (state.status === "success") trackLead();
    if (state.status !== "idle") formTop.current?.focus();
  }, [state]);

  const frame = (node: ReactNode) => (
    <>
      {header}
      {bodyClassName ? <div className={bodyClassName}>{node}</div> : node}
      {footer}
    </>
  );
  const unavailable = (node: ReactNode) => (fallback !== undefined ? fallback : frame(node));

  if (state.status === "success" && state.booking) return frame(<Confirmation booking={state.booking} tz={tz} />);
  if (!data) return frame(<Shell info={<EventInfo />}><CalendarSkeleton /></Shell>);
  if (!data.enabled) return unavailable(<Unavailable title="Online booking isn’t open yet" />);
  if (data.error) return unavailable(<Unavailable title="We couldn’t load available times" retry={() => setReload((n) => n + 1)} />);

  const durations = data.durations?.length ? data.durations : [...bookingEvent.durations];
  // Day → length → start times, all in the visitor's zone: bookable ones, and booked ones.
  const group = (source: Record<string, string[]> | undefined) => {
    const out = new Map<string, Map<number, string[]>>();
    for (const d of durations) {
      for (const s of source?.[String(d)] ?? []) {
        const k = dateKey(s, tz);
        const lengths = out.get(k) ?? new Map<number, string[]>();
        lengths.set(d, [...(lengths.get(d) ?? []), s]);
        out.set(k, lengths);
      }
    }
    return out;
  };
  const byDay = group(data.slots);
  const takenByDay = group(data.taken);
  const days = [...byDay.keys()].sort();
  if (!days.length) return unavailable(<Unavailable title="No times are open in the next few weeks" />);

  const today0 = zonedParts(now, tz);
  const [firstY, firstM] = days[0].split("-").map(Number);
  const [lastY, lastM] = days.at(-1)!.split("-").map(Number);
  const shown = month ?? { y: firstY, m0: firstM - 1 };
  const minMonth = monthKey(today0.y, today0.m0);
  const maxMonth = monthKey(lastY, lastM - 1);
  const shownKey = monthKey(shown.y, shown.m0);
  const shiftMonth = (by: number) => {
    const d = new Date(Date.UTC(shown.y, shown.m0 + by, 1));
    setMonth({ y: d.getUTCFullYear(), m0: d.getUTCMonth() });
  };
  const today = `${minMonth}-${String(today0.d).padStart(2, "0")}`;
  const selectedDay = day && byDay.has(day) ? day : null;
  const taken = new Set(selectedDay && duration ? (takenByDay.get(selectedDay)?.get(duration) ?? []) : []);
  // ISO strings sort chronologically, so the merged list stays in time order.
  const times = selectedDay && duration ? [...(byDay.get(selectedDay)!.get(duration) ?? []), ...taken].sort() : [];
  const openCount = times.length - taken.size;
  const fmt = timeFormat(tz, hour12);

  const pickDay = (k: string) => {
    setDay(k);
    setSlot(null);
    setNotice(null);
    if (window.matchMedia("(max-width: 1023px)").matches) {
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      requestAnimationFrame(() => sideRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" }));
    }
  };

  if (step === "details" && slot && duration) {
    return frame(
      <Shell wide={false} info={<EventInfo when={`${longDate(slot, tz)}, ${fmt.format(new Date(slot))}`} duration={duration} tzLabel={tz} />}>
        <DetailsForm
          emailMode={data.mode === "email"}
          state={state}
          pending={pending}
          formTop={formTop}
          onBack={() => setStep("pick")}
          onSubmit={(fd) => {
            fd.set("slot", slot);
            fd.set("duration", String(duration));
            fd.set("timeZone", tz);
            fd.set("startedAt", String(startedAt.current));
            startTransition(() => formAction(fd));
          }}
        />
      </Shell>,
    );
  }

  const daysInMonth = new Date(Date.UTC(shown.y, shown.m0 + 1, 0)).getUTCDate();
  const lead = new Date(Date.UTC(shown.y, shown.m0, 1)).getUTCDay();
  const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const monthName = new Intl.DateTimeFormat("en-US", { month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(shown.y, shown.m0, 1)));

  return frame(
    <Shell
      info={
        <EventInfo
          duration={duration ?? undefined}
          durations={durations}
          tzPicker={
            <TimeZonePicker
              value={tz}
              onChange={(z) => {
                setTz(z);
                setSlot(null);
              }}
            />
          }
        />
      }
    >
      {/* Step 1: the day. */}
      <div className="p-5 sm:p-7">
        <div ref={formTop} tabIndex={-1} aria-live="polite" className="outline-none empty:hidden">
          {notice && <p className="mb-5 rounded-field bg-gold-wash px-4 py-3 text-sm font-medium text-ink ring-1 ring-gold/40">{notice}</p>}
        </div>
        <div className="mx-auto max-w-[26rem]">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold tracking-tight">
              {monthName} <span className="font-normal text-muted">{shown.y}</span>
            </h3>
            <div className="flex">
              <IconButton label="Previous month" disabled={shownKey <= minMonth} onClick={() => shiftMonth(-1)}>
                <ChevronIcon className="size-4 rotate-180" />
              </IconButton>
              <IconButton label="Next month" disabled={shownKey >= maxMonth} onClick={() => shiftMonth(1)}>
                <ChevronIcon className="size-4" />
              </IconButton>
            </div>
          </div>
          <div role="grid" aria-label={`${monthName} ${shown.y}`} className="mt-4 grid grid-cols-7 gap-1.5 text-center">
            <div role="row" className="contents">
              {WEEKDAYS.map((w, i) => (
                <abbr role="columnheader" key={i} title={WEEKDAY_NAMES[i]} className="pb-1.5 text-xs font-semibold text-muted no-underline">
                  {w}
                </abbr>
              ))}
            </div>
            <div role="row" className="contents">
              {cells.map((d, i) => {
                if (d === null) return <span role="gridcell" key={`e${i}`} />;
                const k = `${shownKey}-${String(d).padStart(2, "0")}`;
                const open = byDay.has(k);
                const selected = k === selectedDay;
                return (
                  <span role="gridcell" key={k}>
                    <button
                      type="button"
                      disabled={!open}
                      aria-pressed={selected}
                      aria-label={`${longDate(keyToUtc(k).toISOString(), "UTC")}${open ? ", available" : ", unavailable"}`}
                      onClick={() => pickDay(k)}
                      className={`relative grid aspect-square w-full place-items-center rounded-tag text-[0.95rem] tabular-nums transition-[background-color,box-shadow,color] duration-(--dur-fast) ${
                        selected
                          ? "bg-ink font-bold text-paper"
                          : open
                            ? "bg-wash font-bold text-ink hover:ring-2 hover:ring-ink/70 hover:ring-inset"
                            : "cursor-default text-muted/60"
                      }`}
                    >
                      {d}
                      {k === today && <span aria-hidden className={`absolute bottom-1 size-1 rounded-full ${selected ? "bg-gold" : "bg-ink/50"}`} />}
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Steps 2 and 3: how long, then the time. */}
      <div ref={sideRef} className="scroll-mt-24 p-5 sm:p-7 lg:flex lg:max-h-[36rem] lg:flex-col">
        {selectedDay ? (
          <>
            <h3 className="font-display text-lg font-bold tracking-tight">
              {new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" }).format(keyToUtc(selectedDay))}{" "}
              <span className="font-normal text-muted">{keyToUtc(selectedDay).getUTCDate()}</span>
            </h3>

            <p id="length-label" className="mt-5 text-sm font-semibold">
              How long do you need?
            </p>
            <div role="group" aria-labelledby="length-label" className="mt-2 grid grid-cols-3 gap-1 rounded-tag bg-wash p-1">
              {durations.map((d) => {
                const active = duration === d;
                const none = !byDay.get(selectedDay)!.get(d)?.length;
                return (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={active}
                    aria-label={`${durationLabel(d)}${none ? ", no times this day" : ""}`}
                    onClick={() => {
                      setDuration(d);
                      setSlot(null);
                    }}
                    className={`min-h-10 rounded-[8px] text-sm font-semibold transition-[background-color,color,box-shadow] duration-(--dur-fast) ${
                      active ? "bg-ink text-paper shadow-sm" : none ? "text-muted/60 hover:text-muted" : "text-ink hover:bg-surface"
                    }`}
                  >
                    {shortDuration(d)}
                  </button>
                );
              })}
            </div>

            {duration ? (
              <>
                <div className="mt-6 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Pick a time</p>
                  <div role="group" aria-label="Time format" className="flex rounded-tag bg-wash p-0.5 text-xs font-semibold">
                    {[true, false].map((h12) => (
                      <button
                        key={String(h12)}
                        type="button"
                        aria-pressed={hour12 === h12}
                        onClick={() => setHour12(h12)}
                        className={`rounded-[8px] px-2.5 py-1.5 transition-colors duration-(--dur-fast) ${hour12 === h12 ? "bg-surface text-ink shadow-sm ring-1 ring-line" : "text-muted hover:text-ink"}`}
                      >
                        {h12 ? "12h" : "24h"}
                      </button>
                    ))}
                  </div>
                </div>
                {openCount === 0 && (
                  <p className="mt-3 rounded-field bg-wash px-4 py-3 text-sm text-muted">
                    No {duration}-minute times left this day. Try a shorter call or another day.
                  </p>
                )}
                {times.length > 0 && (
                  <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:-mr-2 lg:grid-cols-2 lg:overflow-y-auto lg:pr-2 lg:pb-1">
                    {times.map((s) => {
                      const label = fmt.format(new Date(s)).toLowerCase().replace(" ", "");
                      if (taken.has(s)) {
                        return (
                          <li key={s}>
                            <button
                              type="button"
                              disabled
                              aria-label={`${label}, already booked`}
                              className="flex min-h-11 w-full cursor-not-allowed flex-col items-center justify-center rounded-tag bg-wash text-sm font-semibold text-muted/60 tabular-nums"
                            >
                              <span className="leading-tight line-through decoration-muted/50">{label}</span>
                              <span aria-hidden className="text-[0.6rem] leading-tight font-bold tracking-[0.08em] uppercase">
                                Booked
                              </span>
                            </button>
                          </li>
                        );
                      }
                      return slot === s ? (
                        <li key={s} className="col-span-full grid grid-cols-2 gap-2">
                          <span className="grid min-h-11 place-items-center rounded-tag bg-ink text-sm font-semibold text-paper tabular-nums">{label}</span>
                          <button type="button" onClick={() => setStep("details")} className={buttonClasses("gold", "min-h-11! px-3! text-sm")}>
                            Next
                          </button>
                        </li>
                      ) : (
                        <li key={s}>
                          <button
                            type="button"
                            onClick={() => setSlot(s)}
                            className="min-h-11 w-full rounded-tag text-sm font-semibold tabular-nums ring-1 ring-line transition-[box-shadow,background-color] duration-(--dur-fast) ring-inset hover:bg-wash hover:ring-ink/40"
                          >
                            {label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            ) : (
              <p className="mt-6 text-sm leading-relaxed text-muted">Choose a length to see open times.</p>
            )}
          </>
        ) : (
          <p className="text-sm leading-relaxed text-muted lg:mt-1">Pick a highlighted day to get started.</p>
        )}
      </div>
    </Shell>,
  );
}

function Shell({ info, children, wide = true }: { info: ReactNode; children: ReactNode; wide?: boolean }) {
  return (
    <div
      className={`grid divide-y divide-line overflow-hidden rounded-card bg-surface shadow-[0_30px_80px_-40px_rgba(11,21,39,0.35)] ring-1 ring-line lg:divide-x lg:divide-y-0 ${
        wide ? "lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)_minmax(0,17rem)]" : "lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]"
      }`}
    >
      {info}
      {children}
    </div>
  );
}

function EventInfo({
  when,
  duration,
  durations = bookingEvent.durations,
  tzLabel,
  tzPicker,
}: {
  when?: string;
  duration?: number;
  durations?: readonly number[];
  tzLabel?: string;
  tzPicker?: ReactNode;
}) {
  return (
    <div className="p-5 sm:p-7">
      <div className="flex items-center gap-3">
        <Image src={site.logo.src} alt="" width={40} height={40} className="size-10 rounded-full bg-navy p-1" />
        <span className="text-sm font-semibold text-muted">{site.name}</span>
      </div>
      <h2 className="mt-4 font-display text-2xl font-bold tracking-tight">{bookingEvent.title}</h2>
      <ul className="mt-5 grid gap-3 text-[0.95rem] font-medium">
        {when && (
          <Meta icon={<CalendarIcon />}>
            <span>{when}</span>
          </Meta>
        )}
        <Meta icon={<ClockIcon />}>{duration ? durationLabel(duration) : durations.map(durationLabel).join(" · ")}</Meta>
        <Meta icon={<VideoIcon />}>{bookingEvent.location}</Meta>
        <Meta icon={<GlobeIcon />}>{tzPicker ?? <span>{tzLabel?.replace(/_/g, " ")}</span>}</Meta>
      </ul>
      <p className="mt-6 text-sm leading-relaxed text-muted">{bookingEvent.description}</p>
    </div>
  );
}

function Meta({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span aria-hidden className="mt-0.5 shrink-0 text-muted">
        {icon}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </li>
  );
}

function TimeZonePicker({ value, onChange }: { value: string; onChange: (tz: string) => void }) {
  return (
    <label className="block">
      <span className="sr-only">Time zone</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="-mx-1.5 -my-1 w-full max-w-full truncate rounded-[8px] bg-transparent px-1.5 py-1 font-medium hover:bg-wash focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
      >
        {timeZones(value).map((z) => (
          <option key={z} value={z}>
            {z.replace(/_/g, " ")}
          </option>
        ))}
      </select>
    </label>
  );
}

function DetailsForm({
  state,
  pending,
  formTop,
  onBack,
  emailMode,
  onSubmit,
}: {
  state: BookingState;
  pending: boolean;
  formTop: RefObject<HTMLDivElement | null>;
  onBack: () => void;
  emailMode: boolean;
  onSubmit: (fd: FormData) => void;
}) {
  const err = (f: BookingField) => (state.status === "error" ? state.errors?.[f] : undefined);
  const field = (f: BookingField) => ({
    id: `b-${f}`,
    name: f,
    defaultValue: state.values?.[f] ?? "",
    "aria-invalid": err(f) ? true : undefined,
    "aria-describedby": err(f) ? `b-${f}-error` : undefined,
  });
  const label = (f: BookingField, text: string, optional = false) => (
    <label htmlFor={`b-${f}`} className="text-sm font-semibold">
      {text}
      {optional ? <span className="font-normal text-muted"> (optional)</span> : <span aria-hidden className="text-brass"> *</span>}
    </label>
  );
  const error = (f: BookingField) =>
    err(f) ? (
      <p id={`b-${f}-error`} className="mt-1.5 text-sm font-medium text-red-700">
        {err(f)}
      </p>
    ) : null;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(new FormData(e.currentTarget));
      }}
      className="relative grid content-start gap-5 p-5 sm:p-7"
    >
      <div ref={formTop} tabIndex={-1} aria-live="polite" className="outline-none empty:hidden">
        {state.status === "error" && state.message && (
          <p className="rounded-field bg-red-50 px-4 py-3 font-medium text-red-800 ring-1 ring-red-200">{state.message}</p>
        )}
      </div>
      {/* Spam trap, hidden from people and assistive tech. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="b-website">Website</label>
        <input id="b-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        {label("name", "Your name")}
        <input {...field("name")} type="text" autoComplete="name" required maxLength={160} className={inputClass} />
        {error("name")}
      </div>
      <div>
        {label("email", "Email address")}
        <input {...field("email")} type="email" autoComplete="email" required maxLength={200} className={inputClass} />
        {error("email")}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          {label("phone", "Phone", true)}
          <input {...field("phone")} type="tel" autoComplete="tel" maxLength={40} className={inputClass} />
          {error("phone")}
        </div>
        <div>
          {label("firmWebsite", "Firm website", true)}
          <input {...field("firmWebsite")} type="text" inputMode="url" autoComplete="url" placeholder="yourfirm.com" maxLength={200} className={inputClass} />
          {error("firmWebsite")}
        </div>
      </div>
      <div>
        {label("notes", "What would you like to discuss?", true)}
        <textarea {...field("notes")} rows={4} maxLength={2000} className={`${inputClass} resize-y`} placeholder="Practice areas, cities, current marketing…" />
        {error("notes")}
      </div>
      <p className="text-sm text-muted">
        By booking you agree to our{" "}
        <Link href="/privacy-policy/" className="font-medium text-navy-2 underline underline-offset-4">
          privacy policy
        </Link>
        . {emailMode ? "We’ll email you to confirm and send the meeting link." : "We’ll email a calendar invitation with the Google Meet link."}
      </p>
      <div className="flex flex-wrap items-center justify-end gap-3">
        <button type="button" onClick={onBack} className={buttonClasses("ghost-light")}>
          Back
        </button>
        <button type="submit" disabled={pending} className={buttonClasses("gold", "disabled:cursor-wait disabled:opacity-70")}>
          <span>{pending ? "Booking…" : "Confirm booking"}</span>
          <ButtonArrow />
        </button>
      </div>
    </form>
  );
}

function Confirmation({ booking, tz }: { booking: NonNullable<BookingState["booking"]>; tz: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.focus(), []);
  const start = new Date(booking.start);
  const time = (d: Date) => timeFormat(tz, true).format(d).toLowerCase();
  const rows: [string, ReactNode][] = [
    ["What", `${bookingEvent.title} (${durationLabel(booking.durationMin)}) between ${site.name} and ${booking.name}`],
    ["When", <>{longDate(booking.start, tz)}<br />{time(start)} – {time(new Date(booking.end))} <span className="text-muted">({tz.replace(/_/g, " ")})</span></>],
    ["Who", <>{site.name} team<br /><span className="break-all">{booking.name} · {booking.email}</span></>],
    [
      "Where",
      booking.meetLink ? (
        <a href={booking.meetLink} target="_blank" rel="noopener noreferrer" className="font-semibold break-all text-navy-2 underline underline-offset-4">
          Google Meet<span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : (
        booking.mode === "email" ? "Google Meet (link sent when we confirm)" : "Google Meet (link in your invitation)"
      ),
    ],
  ];
  return (
    <div ref={ref} tabIndex={-1} role="status" className="mx-auto max-w-2xl rounded-card bg-surface p-7 text-center ring-1 ring-line outline-none sm:p-12">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-gold text-ink">
        <CheckIcon className="size-6" />
      </span>
      <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {booking.mode === "email" ? "Your call is requested" : "This meeting is scheduled"}
      </h2>
      <p className="mt-3 text-muted">
        {booking.mode === "email"
          ? `We’ve held this time for you and will confirm by email at ${booking.email} shortly.`
          : `We sent a calendar invitation with all the details to ${booking.email}.`}
      </p>
      <dl className="mt-8 grid border-t border-line text-left">
        {rows.map(([k, v]) => (
          <div key={k} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[6rem_1fr] sm:gap-4">
            <dt className="font-semibold">{k}</dt>
            <dd className="leading-relaxed">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-8 text-sm text-muted">
        {booking.mode === "email"
          ? "Need to change the time? Just reply to our confirmation email."
          : "Need to change the time? Use the links in your invitation, or reply to it and we’ll sort it out."}
      </p>
      <ButtonLink href="/" variant="ghost-light" className="mt-6">
        Back to the homepage
      </ButtonLink>
    </div>
  );
}

function Unavailable({ title, retry }: { title: string; retry?: () => void }) {
  return (
    <div className="mx-auto max-w-2xl rounded-card bg-surface p-7 text-center ring-1 ring-line sm:p-12">
      <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      <p className="mt-3 text-muted">Send us a few details instead and we’ll get back to you with a time that works.</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/contact-us/">Request a call</ButtonLink>
        {retry && (
          <button type="button" onClick={retry} className={buttonClasses("ghost-light")}>
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

function CalendarSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading available times" className="p-5 sm:p-7 lg:col-span-2">
      <div className="h-6 w-40 rounded-tag bg-wash motion-safe:animate-pulse" />
      <div className="mt-8 grid grid-cols-7 gap-1.5">
        {Array.from({ length: 35 }, (_, i) => (
          <div key={i} className="aspect-square rounded-tag bg-wash/70 motion-safe:animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function IconButton({ label, children, ...props }: { label: string; children: ReactNode; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      {...props}
      className="grid size-10 place-items-center rounded-tag text-ink transition-colors duration-(--dur-fast) hover:bg-wash disabled:cursor-default disabled:text-muted/40 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

const icon = (path: ReactNode) =>
  function Icon(props: SVGProps<SVGSVGElement>) {
    return (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-4" {...props}>
        {path}
      </svg>
    );
  };
const ClockIcon = icon(<><circle cx="8" cy="8" r="6.2" /><path d="M8 4.8V8l2.2 1.4" /></>);
const VideoIcon = icon(<><rect x="1.5" y="4" width="9" height="8" rx="1.6" /><path d="m10.5 7 4-2.2v6.4l-4-2.2" /></>);
const GlobeIcon = icon(<><circle cx="8" cy="8" r="6.2" /><path d="M1.8 8h12.4M8 1.8c1.7 1.8 2.5 3.8 2.5 6.2S9.7 12.4 8 14.2C6.3 12.4 5.5 10.4 5.5 8S6.3 3.6 8 1.8Z" /></>);
const CalendarIcon = icon(<><rect x="2" y="3" width="12" height="11" rx="1.8" /><path d="M2 6.5h12M5.5 1.8v2.4M10.5 1.8v2.4" /></>);
const ChevronIcon = icon(<path d="m6 3.5 4.5 4.5L6 12.5" />);
