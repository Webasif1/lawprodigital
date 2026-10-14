import { existsSync } from "node:fs";
import path from "node:path";

const CASE_STUDY_DIR = "/images/case-studies/";

/**
 * Public URL for a case-study image, or `null` if the file isn't in /public.
 * Pages are statically generated, so this runs at build time: adding the
 * original screenshots and rebuilding is enough to make them appear.
 */
export function caseStudyImage(file: string): string | null {
  const url = CASE_STUDY_DIR + file;
  return existsSync(path.join(process.cwd(), "public", url)) ? url : null;
}
