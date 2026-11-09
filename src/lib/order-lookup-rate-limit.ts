export const ORDER_LOOKUP_ATTEMPT_LIMIT = 10;

export type OrderLookupRateLimitDecision = "allowed" | "limited" | "unavailable";

/**
 * Fail closed when the attempt count cannot be trusted or the new attempt
 * cannot be recorded. This is a per-IP best-effort window, not an atomic quota.
 */
export function evaluateOrderLookupRateLimit(
  count: number | null,
  countError: unknown,
  attemptError: unknown = null,
): OrderLookupRateLimitDecision {
  if (countError != null || attemptError != null) return "unavailable";
  if (typeof count !== "number" || !Number.isSafeInteger(count) || count < 0) return "unavailable";
  return count >= ORDER_LOOKUP_ATTEMPT_LIMIT ? "limited" : "allowed";
}
