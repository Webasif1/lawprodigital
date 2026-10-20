"use server";

import { headers } from "next/headers";
import nodemailer from "nodemailer";
import type { ContactState } from "./form-config";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import { buildEnquiryEmail, looksAutomated, readValues, validateContact } from "./validate";

// 5 messages per IP and 30 in total per 10 minutes.
const rateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, perKey: 5, global: 30 });

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

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = readValues(formData);

  // Spam traps: a hidden field humans never fill, and a minimum time on the form.
  if (looksAutomated(formData)) {
    return { status: "error", message: "Your message could not be sent. Please try again.", values };
  }

  const errors = validateContact(values);
  if (Object.keys(errors).length) {
    return { status: "error", message: "Please check the highlighted fields.", errors, values };
  }

  const h = await headers();
  if (rateLimited(clientIp(h.get("x-forwarded-for"), h.get("x-real-ip")))) {
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
    const transporter = nodemailer.createTransport(config.transport);
    await transporter.sendMail({
      from: { name: "Law Pro Digital website", address: config.from },
      to: config.to,
      replyTo: { name: fullName, address: values.email },
      subject,
      text,
      html,
    });
  } catch (err) {
    // Log the reason only: nodemailer errors can carry the SMTP command and response.
    const e = err as { code?: string; responseCode?: number; message?: string };
    console.error(`[contact] Failed to send email: ${e.code ?? "error"} ${e.responseCode ?? ""} ${e.message ?? ""}`.trim());
    return { status: "error", message: "Something went wrong sending your message. Please try again shortly.", values };
  }

  return { status: "success", message: "Thanks — your message has been sent. We’ll be in touch shortly." };
}
