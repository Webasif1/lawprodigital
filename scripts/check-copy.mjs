// Flags banned "AI-sounding" and hype words in site copy. See src/content/COPY_RULES.md.
// Usage: node scripts/check-copy.mjs [paths...]   (defaults to src/content and src/components)
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const banned = [
  "seamless", "leverag", "elevate", "unlock", "empower", "robust", "cutting-edge", "game-chang",
  "supercharg", "effortless", "holistic", "synerg", "world-class", "next-level", "ever-evolving",
  "delve", "landscape", "realm", "tailored", "laser-focused", "inside out", "live and breathe",
  "glowing", "passionate", "compelling", "meaningful", "dominat", "powerhouse", "rockstar", "killer",
  "journey", "in today's", "in today’s", "not just", "proven",
];
const pattern = new RegExp(`\\b(${banned.map((w) => w.replace(/[-’']/g, "[-’' ]?")).join("|")})`, "i");

const roots = process.argv.slice(2).length ? process.argv.slice(2) : ["src/content", "src/components"];
const files = roots.flatMap(function walk(p) {
  return statSync(p).isDirectory() ? readdirSync(p).flatMap((f) => walk(join(p, f))) : /\.(ts|tsx)$/.test(p) ? [p] : [];
});

let hits = 0;
for (const file of files) {
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (line.trim().startsWith("//") || line.trim().startsWith("*")) return;
      const m = line.match(pattern);
      if (m) {
        hits++;
        console.log(`${relative(process.cwd(), file)}:${i + 1}  "${m[0]}"  ${line.trim().slice(0, 110)}`);
      }
    });
}
console.log(hits ? `\n${hits} banned word(s) found. See src/content/COPY_RULES.md.` : "Copy check passed.");
process.exit(hits ? 1 : 0);
