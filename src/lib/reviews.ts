import type { PublicReview } from "@/lib/catalog.functions";

/** Structured review data only when approved reviews exist. Empty input publishes nothing. */
export function reviewStructuredData(reviews: PublicReview[] | null | undefined) {
  const published = (reviews ?? []).filter((review) => review.body.trim() && review.rating >= 1 && review.rating <= 5);
  if (!published.length) return null;
  const ratingValue = published.reduce((sum, review) => sum + review.rating, 0) / published.length;
  return {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: ratingValue.toFixed(1),
      reviewCount: published.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: published.map((review) => ({
      "@type": "Review",
      reviewBody: review.body,
      datePublished: review.created_at.slice(0, 10),
      reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: 5, worstRating: 1 },
    })),
  };
}
