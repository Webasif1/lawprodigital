// One-time helper: signs in to Google in your browser and prints GOOGLE_REFRESH_TOKEN for the
// booking calendar and leads sheet. Run it on your own computer, not on the server:
//
//   GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... node scripts/google-auth.mjs
//
// The redirect is http://127.0.0.1:53682/callback (GOOGLE_AUTH_PORT changes the port). A "Desktop app"
// OAuth client accepts it as is; for a "Web application" client, add that exact URL under
// Authorized redirect URIs first, or Google answers "Error 400: redirect_uri_mismatch".
import { createServer } from "node:http";
import { randomBytes } from "node:crypto";

const { GOOGLE_CLIENT_ID: clientId, GOOGLE_CLIENT_SECRET: clientSecret } = process.env;
if (!clientId || !clientSecret) {
  console.error("Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET first (see docs/CPANEL_DEPLOYMENT.md).");
  process.exit(1);
}

const scopes = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.freebusy",
  "https://www.googleapis.com/auth/spreadsheets",
];
const state = randomBytes(16).toString("hex");

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://127.0.0.1");
  if (url.pathname !== "/callback") return res.writeHead(404).end();
  const code = url.searchParams.get("code");
  if (url.searchParams.get("state") !== state || !code) {
    res.writeHead(400).end("Sign-in failed or was cancelled. Run the script again.");
    return finish(1, url.searchParams.get("error") ?? "state mismatch");
  }
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri(), grant_type: "authorization_code" }),
  });
  const data = await tokenRes.json();
  if (!data.refresh_token) {
    res.writeHead(500).end("No refresh token returned. See the terminal.");
    return finish(1, JSON.stringify(data));
  }
  res.writeHead(200, { "Content-Type": "text/plain" }).end("Done. You can close this tab and go back to the terminal.");
  console.log(`\nAdd this to the app's environment variables (keep it secret):\n\nGOOGLE_REFRESH_TOKEN=${data.refresh_token}\n`);
  finish(0);
});

const redirectUri = () => `http://127.0.0.1:${server.address().port}/callback`;
const finish = (code, reason) => {
  if (reason) console.error(`Failed: ${reason}`);
  server.close();
  process.exitCode = code;
};

server.listen(Number(process.env.GOOGLE_AUTH_PORT || 53682), "127.0.0.1", () => {
  const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  auth.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri(),
    response_type: "code",
    scope: scopes.join(" "),
    access_type: "offline",
    prompt: "consent",
    state,
  }).toString();
  console.log(`Open this URL in your browser and sign in with the account whose calendar takes bookings:\n\n${auth}\n`);
});
