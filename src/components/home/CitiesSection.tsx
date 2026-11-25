import Link from "next/link";
import { locationHref, locations, practiceHubs, type Practice } from "@/content/locations";
import { SectionHeading } from "@/components/ui/SectionHeading";

const groups: { practice: Practice; title: string }[] = [
  { practice: "immigration", title: "Immigration law firm marketing" },
  { practice: "personal-injury", title: "Personal injury and bankruptcy law firm marketing" },
];

/** Links every city page from the homepage, grouped by practice and state, so each one is a click from the home page. */
export function CitiesSection() {
  return (
    <section aria-labelledby="cities-heading" className="bg-surface">
      <div className="container-x section-y">
        <SectionHeading eyebrow="Locations" title={<span id="cities-heading">Law firm marketing in your city</span>} />
        <p data-reveal className="mt-6 max-w-2xl text-lead text-muted">
          Local SEO, Google Business Profile, ads and AI search for law firms across the United States. Pick your city to see the plan for your market.
        </p>
        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          {groups.map((g) => {
            const list = locations.filter((l) => l.practice === g.practice);
            const states = [...new Set(list.map((l) => l.state))].sort();
            return (
              <div key={g.practice} data-reveal>
                <h3 className="font-display text-xl font-bold">
                  <Link href={`/${practiceHubs[g.practice].slug}/`} className="hover:text-brass">
                    {g.title}
                  </Link>
                </h3>
                {states.map((state) => (
                  <div key={state} className="mt-6">
                    <p className="eyebrow text-muted">{state}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {list
                        .filter((l) => l.state === state)
                        .sort((a, b) => a.city.localeCompare(b.city))
                        .map((l) => (
                          <li key={l.slug}>
                            <Link href={locationHref(l)} className="inline-block rounded-full bg-paper px-4 py-2 text-sm font-semibold ring-1 ring-line hover:ring-gold">
                              {l.city}, {l.stateCode}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
