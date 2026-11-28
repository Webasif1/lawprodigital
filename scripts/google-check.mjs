// Checks that the booking page can reach Google Calendar with the configured keys, and says
// what to fix if not. Run it on the server (cPanel Terminal, in the app folder, with the app's
// environment) or locally:
//
//   npm run google:check            (reads .env.local if present)
//
// It never prints the token or secret.
import { existsSync, readFileSync } from "node:fs";

// Local runs: load .env.local without overriding real environment variables.
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const { GOOGLE_CLIENT_ID: clientId, GOOGLE_CLIENT_SECRET: clientSecret, GOOGLE_REFRESH_TOKEN: refreshToken } = process.env;
const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

const fail = (msg) => {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
};

const missing = Object.entries({ GOOGLE_CLIENT_ID: clientId, GOOGLE_CLIENT_SECRET: clientSecret, GOOGLE_REFRESH_TOKEN: refreshToken })
  .filter(([, v]) => !v)
  .map(([k]) => k);
if (missing.length) {
  fail(
    `Not configured: ${missing.join(", ")} ${missing.length > 1 ? "are" : "is"} empty.\n` +
      "  Without them the booking page runs in email mode (no Meet link, no calendar invite).\n" +
      "  Set them in cPanel → Setup Node.js App → Environment variables (see docs/CPANEL_DEPLOYMENT.md), then restart.",
  );
}

console.log("1/2 Exchanging the refresh token…");
const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: "refresh_token" }),
  signal: AbortSignal.timeout(15_000),
}).catch((e) => fail(`Could not reach Google: ${e.message}`));
const token = await tokenRes.json().catch(() => ({}));
if (!tokenRes.ok) {
  const code = token.error ?? tokenRes.status;
  if (code === "invalid_grant") {
    fail(
      "invalid_grant: GOOGLE_REFRESH_TOKEN has expired or was revoked.\n" +
        "  Usual cause: the OAuth consent screen is in \"Testing\", where tokens die after 7 days.\n" +
        "  Fix: Google Cloud console → OAuth consent screen → Publish app (\"In production\"),\n" +
        "  then run `node scripts/google-auth.mjs` on your computer, put the new token in cPanel and restart the app.",
    );
  }
  if (code === "invalid_client" || code === "unauthorized_client") {
    fail(`${code}: GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are wrong, or the token was made with a different OAuth client.`);
  }
  fail(`Token exchange failed: ${code} ${token.error_description ?? ""}`);
}
console.log("    ✓ token OK");

console.log(`2/2 Reading free/busy for calendar "${calendarId}"…`);
const now = new Date();
const fbRes = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
  method: "POST",
  headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json" },
  body: JSON.stringify({ timeMin: now.toISOString(), timeMax: new Date(now.getTime() + 86_400_000).toISOString(), items: [{ id: calendarId }] }),
  signal: AbortSignal.timeout(15_000),
});
const fb = await fbRes.json().catch(() => ({}));
const cal = fb.calendars?.[calendarId] ?? Object.values(fb.calendars ?? {})[0];
if (!fbRes.ok || !cal || cal.errors?.length) {
  const why = fb.error?.message ?? JSON.stringify(cal?.errors ?? fb);
  fail(
    `Calendar check failed: ${why.slice(0, 300)}\n` +
      "  Check the Google Calendar API is enabled for the project and GOOGLE_CALENDAR_ID is a calendar this account can edit.\n" +
      "  If the token predates the calendar scopes, re-run scripts/google-auth.mjs.",
  );
}
console.log(`    ✓ calendar OK (${cal.busy?.length ?? 0} busy block(s) in the next 24h)`);
console.log("\n✓ Google is connected. Bookings will create a Meet link and email the client a calendar invite.");
console.log("  If the live site still says \"Your call is requested\", restart the Node app so it retries Google.\n");
