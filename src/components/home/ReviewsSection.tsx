import { publishedReviews, type Review } from "@/content/testimonials";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StarIcon } from "@/components/ui/icons";

function Stars({ rating }: { rating: number }) {
  return (
    <p className="flex gap-0.5 text-brass" role="img" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: rating }, (_, i) => (
        <StarIcon key={i} aria-hidden className="size-4" />
      ))}
    </p>
  );
}

function Attribution({ review, dark = false }: { review: Review; dark?: boolean }) {
  return (
    <figcaption className="mt-auto pt-6">
      <p className="font-display font-bold">{review.name}</p>
      <p className={`text-sm ${dark ? "text-mist" : "text-muted"}`}>
        {review.role}, {review.company} · {review.location}
      </p>
    </figcaption>
  );
}

/**
 * Written client reviews: featured quotes up top, the rest as a compact grid.
 * Renders nothing until at least one review is published.
 */
export function ReviewsSection() {
  if (publishedReviews.length === 0) return null;

  let featured = publishedReviews.filter((r) => r.featured);
  if (featured.length === 0) featured = publishedReviews.slice(0, 1);
  const rest = publishedReviews.filter((r) => !featured.includes(r));

  return (
    <section aria-labelledby="reviews-heading" className="bg-paper">
      <div className="container-x section-y">
        <SectionHeading
          eyebrow="Client reviews"
          title={<span id="reviews-heading">What law firms say about working with us</span>}
          intro="Partners and marketing leads at firms across the US and Canada, in their own words."
          align="split"
        />

        <ul className={`mt-14 grid gap-4 ${featured.length > 1 ? "lg:grid-cols-3" : ""}`}>
          {featured.map((r, i) => {
            const dark = i === 0;
            return (
              <li key={r.id} data-reveal style={{ ["--reveal-i" as string]: i }} className="flex">
                <figure className={`flex w-full flex-col rounded-card p-8 ${dark ? "on-dark bg-navy text-white" : "bg-surface ring-1 ring-line"}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Stars rating={r.rating} />
                    <p className={`eyebrow ${dark ? "text-gold" : "text-muted"}`}>{r.service}</p>
                  </div>
                  <blockquote className="mt-6 font-display text-xl font-semibold leading-snug tracking-tight text-pretty">
                    &ldquo;{r.quote}&rdquo;
                  </blockquote>
                  <Attribution review={r} dark={dark} />
                </figure>
              </li>
            );
          })}
        </ul>

        {rest.length > 0 && (
          <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((r, i) => (
              <li key={r.id} data-reveal style={{ ["--reveal-i" as string]: i % 3 }} className="flex">
                <figure className="flex w-full flex-col rounded-card bg-surface p-7 ring-1 ring-line">
                  <Stars rating={r.rating} />
                  <blockquote className="mt-4 leading-relaxed text-muted">&ldquo;{r.quote}&rdquo;</blockquote>
                  <Attribution review={r} />
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
