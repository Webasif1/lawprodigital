import { serviceOptions, type ContactField } from "./form-config";

/**
 * Pure helpers for the contact server action, kept out of the "use server" file so
 * they can be unit-tested (see tests/unit/contact.test.ts).
 */

export const MAX = { name: 80, email: 200, website: 200, phone: 40, city: 80, message: 5000 } as const;
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
    firmWebsite: get("firmWebsite"),
    phone: get("phone"),
    city: get("city"),
    service: get("service"),
    message: get("message"),
  };
}

/**
 * The firm's site as a full URL, or null if it isn't one. Visitors usually type a bare
 * domain ("smithlaw.com"), so https:// is assumed when no scheme is given.
 */
export function normalizeWebsite(input: string): string | null {
  if (!input || input.length > MAX.website || /\s/.test(input)) return null;
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(input) ? input : `https://${input}`);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (!/^[a-z\d-]+(\.[a-z\d-]+)*\.[a-z]{2,}$/i.test(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** Honeypot filled, or the form was submitted faster than a person could fill it. */
export function looksAutomated(formData: FormData, now = Date.now()) {
  const honeypot = String(formData.get("website") ?? "").trim();
  // The timestamp is set by JS, so it is only enforced when present (no-JS posts still work).
  const startedAt = Number(formData.get("startedAt") ?? 0);
  return Boolean(honeypot) || (startedAt > 0 && now - startedAt < MIN_FILL_MS);
}

/** Required: first name, email and the firm's website (the audit needs it). Everything else is optional. */
export function validateContact(values: ContactValues) {
  const errors: Partial<Record<ContactField, string>> = {};
  if (!values.firstName) errors.firstName = "Please enter your first name.";
  else if (values.firstName.length > MAX.name) errors.firstName = "That name is too long.";
  if (values.lastName.length > MAX.name) errors.lastName = "That name is too long.";
  if (!values.email) errors.email = "Please enter your email address.";
  // Line breaks in the address would let a sender inject mail headers via Reply-To.
  else if (!EMAIL_RE.test(values.email) || /[\r\n]/.test(values.email) || values.email.length > MAX.email)
    errors.email = "Please enter a valid email address.";
  if (!values.firmWebsite) errors.firmWebsite = "Please enter your firm’s website so we can run the audit.";
  else if (!normalizeWebsite(values.firmWebsite)) errors.firmWebsite = "Please enter a valid website, like yourfirm.com.";
  if (values.phone && (values.phone.length > MAX.phone || !PHONE_RE.test(values.phone))) errors.phone = "Please enter a valid phone number.";
  if (values.city.length > MAX.city) errors.city = "Please shorten the city name.";
  if (values.service && !serviceOptions.includes(values.service)) errors.service = "Please choose a service from the list.";
  if (values.message.length > MAX.message) errors.message = `Please keep your message under ${MAX.message} characters.`;
  return errors;
}

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export function buildEnquiryEmail(values: ContactValues) {
  const fullName = oneLine(`${values.firstName} ${values.lastName}`);
  const message = values.message || "—";
  const rows: [string, string][] = [
    ["Name", fullName],
    ["Email", values.email],
    ["Website", normalizeWebsite(values.firmWebsite) ?? values.firmWebsite],
    ["Phone", values.phone || "—"],
    ["City", oneLine(values.city) || "—"],
    ["Service", values.service || "—"],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nMessage:\n${message}`;
  const html = `<table cellpadding="6">${rows
    .map(([k, v]) => `<tr><th align="left">${k}</th><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table><p><strong>Message</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`;
  const subject = oneLine(`New enquiry from ${fullName}${values.service ? ` — ${values.service}` : ""}`);
  return { fullName, subject, text, html };
}
