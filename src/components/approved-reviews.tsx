import type { PublicReview } from "@/lib/catalog.functions";
import { reviewStructuredData } from "@/lib/reviews";

/** Renders nothing until approved reviews exist. No empty state and no sample quotes. */
export function ApprovedReviews({ reviews }: { reviews: PublicReview[] | null | undefined }) {
  const published = reviewStructuredData(reviews);
  if (!published || !reviews?.length) return null;
  return (
    <section className="mt-10" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="font-display text-lg font-medium">Customer reviews</h2>
      <ul className="mt-3 divide-y divide-border">
        {reviews.filter((review) => review.body.trim()).map((review) => (
          <li key={review.id} className="py-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
              {review.rating} out of 5{review.is_verified_purchase ? " · Verified purchase" : ""}
            </p>
            <p className="mt-1 text-sm text-foreground/85">{review.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
