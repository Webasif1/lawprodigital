import { cityOptions, serviceOptions, type ContactField } from "./form-config";

/**
 * Pure helpers for the contact server action, kept out of the "use server" file so
 * they can be unit-tested (see tests/unit/contact.test.ts).
 */

export const MAX = { name: 80, email: 200, phone: 40, message: 5000 } as const;
export const MIN_FILL_MS = 2500;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d\s().-]{6,}$/;

export type ContactValues = Record<ContactField, string>;

export function readValues(formData: FormData): ContactValues {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  return {
    firstName: get("firstName"),
    lastName: get("lastName"),
    email: get("email"),
    phone: get("phone"),
    city: get("city"),
    service: get("service"),
    message: get("message"),
  };
}

/** Honeypot filled, or the form was submitted faster than a person could fill it. */
export function looksAutomated(formData: FormData, now = Date.now()) {
  const honeypot = String(formData.get("website") ?? "").trim();
  // The timestamp is set by JS, so it is only enforced when present (no-JS posts still work).
  const startedAt = Number(formData.get("startedAt") ?? 0);
  return Boolean(honeypot) || (startedAt > 0 && now - startedAt < MIN_FILL_MS);
}

export function validateContact(values: ContactValues) {
  const errors: Partial<Record<ContactField, string>> = {};
  if (!values.firstName) errors.firstName = "Please enter your first name.";
  else if (values.firstName.length > MAX.name) errors.firstName = "That name is too long.";
  if (values.lastName.length > MAX.name) errors.lastName = "That name is too long.";
  if (!values.email) errors.email = "Please enter your email address.";
  // Line breaks in the address would let a sender inject mail headers via Reply-To.
  else if (!EMAIL_RE.test(values.email) || /[\r\n]/.test(values.email) || values.email.length > MAX.email)
    errors.email = "Please enter a valid email address.";
  if (values.phone && (values.phone.length > MAX.phone || !PHONE_RE.test(values.phone))) errors.phone = "Please enter a valid phone number.";
  if (values.city && !cityOptions.includes(values.city)) errors.city = "Please choose a city from the list.";
  if (values.service && !serviceOptions.includes(values.service)) errors.service = "Please choose a service from the list.";
  if (!values.message) errors.message = "Please tell us a little about your firm and goals.";
  else if (values.message.length > MAX.message) errors.message = `Please keep your message under ${MAX.message} characters.`;
  return errors;
}

/**
 * Sliding-window limiter, per key plus a global ceiling. The global cap bounds how many
 * emails the form can send even if a sender rotates IPs or spoofs X-Forwarded-For.
 * In memory is enough: the app runs as one long-lived Node process on cPanel.
 */
export function createRateLimiter({ windowMs, perKey, global, maxKeys = 5000 }: { windowMs: number; perKey: number; global: number; maxKeys?: number }) {
  const hits = new Map<string, number[]>();
  let all: number[] = [];

  return function limited(key: string, now = Date.now()) {
    all = all.filter((t) => now - t < windowMs);
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= perKey || all.length >= global) {
      hits.set(key, recent);
      return true;
    }
    recent.push(now);
    all.push(now);
    hits.delete(key);
    hits.set(key, recent);
    // Evict the least recently used keys instead of clearing everything,
    // so flooding the map with fake IPs can't reset everyone's counters.
    while (hits.size > maxKeys) hits.delete(hits.keys().next().value!);
    return false;
  };
}

/** Client IP for rate limiting: the hop appended by the nearest proxy, not the client-supplied first entry. */
export function clientIp(forwardedFor: string | null, realIp: string | null) {
  const hops = forwardedFor?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  return hops.at(-1) || realIp?.trim() || "unknown";
}

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export function buildEnquiryEmail(values: ContactValues) {
  const fullName = oneLine(`${values.firstName} ${values.lastName}`);
  const rows: [string, string][] = [
    ["Name", fullName],
    ["Email", values.email],
    ["Phone", values.phone || "—"],
    ["City", values.city || "—"],
    ["Service", values.service || "—"],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nMessage:\n${values.message}`;
  const html = `<table cellpadding="6">${rows
    .map(([k, v]) => `<tr><th align="left">${k}</th><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table><p><strong>Message</strong></p><p>${escapeHtml(values.message).replace(/\n/g, "<br>")}</p>`;
  const subject = oneLine(`New enquiry from ${fullName}${values.service ? ` — ${values.service}` : ""}`);
  return { fullName, subject, text, html };
}
