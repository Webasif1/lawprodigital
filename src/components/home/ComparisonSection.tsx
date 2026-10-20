import Link from "next/link";
import { comparison } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowUpRightIcon, CheckIcon } from "@/components/ui/icons";

/** Law Pro vs a typical agency. A real table on wide screens, stacked cards on phones. */
export function ComparisonSection() {
  const { columns, rows } = comparison;
  return (
    <section aria-labelledby="compare-heading" className="bg-paper">
      <div className="container-x section-y">
        <SectionHeading align="split" eyebrow="Why firms switch" title={<span id="compare-heading">{comparison.heading}</span>} intro={comparison.intro} />

        <table data-reveal className="mt-14 hidden w-full border-collapse text-left md:table">
          <caption className="sr-only">
            {columns.us} compared with {columns.them.toLowerCase()}
          </caption>
          <thead>
            <tr className="border-b border-ink">
              <th scope="col" className="w-[22%] py-4 pr-6 text-sm font-semibold text-muted">
                <span className="sr-only">Topic</span>
              </th>
              <th scope="col" className="rounded-t-card bg-navy px-6 py-4 font-display text-lg font-bold text-white">
                {columns.us}
              </th>
              <th scope="col" className="px-6 py-4 font-display text-lg font-bold text-muted">
                {columns.them}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.topic} className="border-b border-line">
                <th scope="row" className="py-5 pr-6 align-top text-sm font-semibold">
                  {r.topic}
                </th>
                <td className={`on-dark bg-navy px-6 py-5 align-top text-white ${i === rows.length - 1 ? "rounded-b-card" : ""}`}>
                  <span className="flex gap-3">
                    <CheckIcon aria-hidden className="mt-0.5 size-5 shrink-0 text-gold" />
                    {r.us}
                  </span>
                </td>
                <td className="px-6 py-5 align-top text-muted">{r.them}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <ul className="mt-12 grid gap-4 md:hidden">
          {rows.map((r) => (
            <li key={r.topic} data-reveal className="rounded-card bg-surface p-5 ring-1 ring-line">
              <h3 className="eyebrow text-muted">{r.topic}</h3>
              <p className="mt-3 flex gap-3 font-semibold">
                <CheckIcon aria-hidden className="mt-0.5 size-5 shrink-0 text-brass" />
                <span>
                  <span className="sr-only">{columns.us}: </span>
                  {r.us}
                </span>
              </p>
              <p className="mt-2 border-t border-line pt-2 pl-8 text-sm text-muted">
                <span className="font-medium">{columns.them}:</span> {r.them}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-10">
          <Link href="/case-study/" className="inline-flex items-center gap-2 font-semibold text-navy-2 hover:text-brass">
            See all 16 case studies <ArrowUpRightIcon aria-hidden className="size-4" />
          </Link>
        </p>
      </div>
    </section>
  );
}
