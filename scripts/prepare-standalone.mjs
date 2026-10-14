// Copies the assets that `output: "standalone"` leaves out (public/ and .next/static/)
// into .next/standalone so that folder can be uploaded and run on its own
// with `node server.js`. See DEPLOYMENT.md.
import { cpSync, existsSync, rmSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const standalone = path.join(root, ".next", "standalone");

if (!existsSync(path.join(standalone, "server.js"))) {
  console.error("No .next/standalone/server.js found — run `next build` first.");
  process.exit(1);
}

for (const [from, to] of [
  ["public", "public"],
  [path.join(".next", "static"), path.join(".next", "static")],
]) {
  const target = path.join(standalone, to);
  rmSync(target, { recursive: true, force: true });
  cpSync(path.join(root, from), target, { recursive: true });
  console.log(`copied ${from} -> .next/standalone/${to}`);
}
