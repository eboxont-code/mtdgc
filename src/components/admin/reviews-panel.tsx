import { Button } from "@/components/ui/button";
import type { ReviewRow } from "./panel-types";
export function ReviewsPanel({ pendingReviews, approveReview }: { pendingReviews: ReviewRow[]; approveReview: (id: string) => void }) {
 return (
            <section className="mt-8">
              <h2 className="font-display text-lg font-medium">Reviews awaiting approval</h2>
              {pendingReviews.length ? (
                <ul className="mt-2 space-y-3 text-sm">
                  {pendingReviews.map((r) => (
                    <li key={r.id} className="rounded-lg border border-glass-border bg-glass-bg p-3">
                      <p className="font-display">{r.rating} out of 5</p>
                      <p className="mt-1 text-muted-foreground">{r.body}</p>
                      <Button size="sm" className="mt-2" onClick={() => approveReview(r.id)}>Approve</Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">Nothing to moderate.</p>
              )}
            </section>
 );
}
