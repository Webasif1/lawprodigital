import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3100);

/**
 * End-to-end tests run against the production standalone bundle — the same
 * `node server.js` that cPanel/Passenger starts. Build it first:
 *   npm run build:standalone && npm run test:e2e
 * SMTP and OpenRouter variables are blanked so tests never send email or call the model.
 */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "node .next/standalone/server.js",
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: { PORT: String(PORT), HOSTNAME: "127.0.0.1", SMTP_HOST: "", SMTP_USER: "", SMTP_PASS: "", CONTACT_TO: "", OPENROUTER_API_KEY: "" },
  },
});
