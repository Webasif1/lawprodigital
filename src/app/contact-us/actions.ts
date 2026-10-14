"use server";

import { headers } from "next/headers";
import nodemailer from "nodemailer";
import { cityOptions, serviceOptions, type ContactField, type ContactState } from "./form-config";

const MAX = { name: 80, email: 200, phone: 40, message: 5000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FILL_MS = 2500;

// Basic per-IP throttle. The app runs as a single long-lived Node process on cPanel,
// so in-memory state is sufficient to stop casual abuse.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > LIMIT;
}

function smtpConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO, CONTACT_FROM, SMTP_SECURE } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) return null;
  const port = Number(SMTP_PORT ?? 465);
  return {
    transport: { host: SMTP_HOST, port, secure: SMTP_SECURE ? SMTP_SECURE === "true" : port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } },
    to: CONTACT_TO,
    from: CONTACT_FROM ?? SMTP_USER,
  };
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const values = {
    firstName: get("firstName"),
    lastName: get("lastName"),
    email: get("email"),
    phone: get("phone"),
    city: get("city"),
    service: get("service"),
    message: get("message"),
  };

  // Spam traps: a hidden field humans never fill, and a minimum time on the form.
  // The timestamp is set by JS, so it is only enforced when present (no-JS posts still work).
  const startedAt = Number(get("startedAt"));
  if (get("website") || (startedAt && Date.now() - startedAt < MIN_FILL_MS)) {
    return { status: "error", message: "Your message could not be sent. Please try again.", values };
  }

  const errors: Partial<Record<ContactField, string>> = {};
  if (!values.firstName) errors.firstName = "Please enter your first name.";
  else if (values.firstName.length > MAX.name) errors.firstName = "That name is too long.";
  if (values.lastName.length > MAX.name) errors.lastName = "That name is too long.";
  if (!values.email) errors.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(values.email) || values.email.length > MAX.email) errors.email = "Please enter a valid email address.";
  if (values.phone && (values.phone.length > MAX.phone || !/^[+\d\s().-]{6,}$/.test(values.phone))) errors.phone = "Please enter a valid phone number.";
  if (values.city && !cityOptions.includes(values.city)) errors.city = "Please choose a city from the list.";
  if (values.service && !serviceOptions.includes(values.service)) errors.service = "Please choose a service from the list.";
  if (!values.message) errors.message = "Please tell us a little about your firm and goals.";
  else if (values.message.length > MAX.message) errors.message = `Please keep your message under ${MAX.message} characters.`;

  if (Object.keys(errors).length) {
    return { status: "error", message: "Please check the highlighted fields.", errors, values };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return { status: "error", message: "Too many messages in a short time. Please wait a few minutes and try again.", values };
  }

  const config = smtpConfig();
  if (!config) {
    console.error("[contact] SMTP is not configured: set SMTP_HOST, SMTP_USER, SMTP_PASS and CONTACT_TO.");
    return {
      status: "error",
      message: "Our contact form is temporarily unavailable. Please try again later.",
      values,
    };
  }

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

  try {
    const transporter = nodemailer.createTransport(config.transport);
    await transporter.sendMail({
      from: { name: "Law Pro Digital website", address: config.from },
      to: config.to,
      replyTo: { name: fullName, address: values.email },
      subject: oneLine(`New enquiry from ${fullName}${values.service ? ` — ${values.service}` : ""}`),
      text,
      html,
    });
  } catch (err) {
    console.error("[contact] Failed to send email:", err);
    return { status: "error", message: "Something went wrong sending your message. Please try again shortly.", values };
  }

  return { status: "success", message: "Thanks — your message has been sent. We’ll be in touch shortly." };
}
