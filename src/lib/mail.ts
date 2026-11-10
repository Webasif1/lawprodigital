import nodemailer from "nodemailer";

/** SMTP settings from the server env, or null until SMTP_HOST, SMTP_USER, SMTP_PASS and CONTACT_TO are set. */
export function smtpConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO, CONTACT_FROM, SMTP_SECURE } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) return null;
  const port = Number(SMTP_PORT ?? 465);
  return {
    transport: { host: SMTP_HOST, port, secure: SMTP_SECURE ? SMTP_SECURE === "true" : port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } },
    to: CONTACT_TO,
    from: CONTACT_FROM ?? SMTP_USER,
  };
}

/** Emails the site owner (CONTACT_TO), replying to the visitor. Throws if SMTP fails. */
export async function sendOwnerMail(
  config: NonNullable<ReturnType<typeof smtpConfig>>,
  mail: { replyTo: { name: string; address: string }; subject: string; text: string; html: string },
) {
  const transporter = nodemailer.createTransport(config.transport);
  await transporter.sendMail({ from: { name: "Law Pro Digital website", address: config.from }, to: config.to, ...mail });
}

/** The reason only: nodemailer errors can carry the SMTP command and response. */
export function smtpErrorSummary(err: unknown) {
  const e = err as { code?: string; responseCode?: number; message?: string };
  return `${e.code ?? "error"} ${e.responseCode ?? ""} ${e.message ?? ""}`.trim();
}
