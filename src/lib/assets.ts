import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Public URL for an image in /public, or `null` if the file isn't there.
 * Pages are statically generated, so this runs at build time: adding a file
 * and rebuilding is enough to make it appear, and a missing file never shows
 * up as a broken image.
 */
export function publicImage(url: string): string | null {
  return existsSync(path.join(process.cwd(), "public", url)) ? url : null;
}

/** Illustration for a case study story (see `src/content/stories.ts`). */
export const storyImage = (file: string) => (file ? publicImage(`/images/stories/${file}`) : null);
