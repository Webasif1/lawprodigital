"use server";

import { headers } from "next/headers";
import type { ContactState } from "./form-config";
import { logRow } from "@/lib/google";
import { sendOwnerMail, smtpConfig, smtpErrorSummary } from "@/lib/mail";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import { buildEnquiryEmail, looksAutomated, normalizeWebsite, readValues, validateContact } from "./validate";

// 5 messages per IP and 30 in total per 10 minutes.
const rateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, perKey: 5, global: 30 });

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = readValues(formData);
  const h = await headers();
  const ip = clientIp(h.get("x-forwarded-for"), h.get("x-real-ip"));
  // One line per blocked post in stderr.log, so bot attempts can be told apart from bots that only looked.
  const logBlocked = (reason: string) =>
    console.warn(`[contact] blocked reason=${reason} ip=${ip} ua=${JSON.stringify((h.get("user-agent") ?? "").slice(0, 160))}`);

  // Spam traps: a hidden field humans never fill, and a minimum time on the form.
  const automated = looksAutomated(formData);
  if (automated) {
    logBlocked(automated);
    return { status: "error", message: "Your message could not be sent. Please try again.", values };
  }

  const errors = validateContact(values);
  if (Object.keys(errors).length) {
    return { status: "error", message: "Please check the highlighted fields.", errors, values };
  }

  if (rateLimited(ip)) {
    logBlocked("rate-limit");
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

  const { fullName, subject, text, html } = buildEnquiryEmail(values);

  try {
    await sendOwnerMail(config, { replyTo: { name: fullName, address: values.email }, subject, text, html });
  } catch (err) {
    console.error(`[contact] Failed to send email: ${smtpErrorSummary(err)}`);
    return { status: "error", message: "Something went wrong sending your message. Please try again shortly.", values };
  }

  // The email is the record of truth; the sheet row is a convenience and never fails the send.
  await logRow("Leads", [
    new Date().toISOString(),
    values.firstName,
    values.lastName,
    values.email,
    values.phone,
    normalizeWebsite(values.firmWebsite) ?? values.firmWebsite,
    values.city,
    values.service,
    values.message,
  ]);

  return { status: "success", message: "Thanks — your message has been sent. We’ll be in touch shortly." };
}
