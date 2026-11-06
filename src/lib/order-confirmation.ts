export const ORDER_DETAILS_CONFIRMATION_CATEGORIES = ["game-top-ups", "gift-cards"] as const;

export const ORDER_DETAILS_CONFIRMATION_REQUIRED_MESSAGE =
  "Please review and confirm the delivery details before placing this order.";

export type OrderConfirmationLine = {
  categorySlug?: string | null | undefined;
  fields?: Record<string, string> | undefined;
};

/** Categories whose current checkout data identifies game top-ups or emailed gift-card codes. */
export function isOrderDetailsConfirmationCategory(categorySlug: unknown): boolean {
  return (
    typeof categorySlug === "string" &&
    (ORDER_DETAILS_CONFIRMATION_CATEGORIES as readonly string[]).includes(categorySlug)
  );
}

/**
 * Require an extra customer review for known top-up/code categories.
 * Older persisted carts may not contain categorySlug; if they contain delivery
 * fields, conservatively ask for confirmation rather than silently skipping it.
 */
export function requiresOrderDetailsConfirmation(lines: readonly OrderConfirmationLine[]): boolean {
  return lines.some(
    (line) =>
      isOrderDetailsConfirmationCategory(line.categorySlug) ||
      (!line.categorySlug && Object.keys(line.fields ?? {}).length > 0),
  );
}

/** Re-check the product category resolved from the database before order creation. */
export function assertOrderDetailsConfirmed(categorySlugs: readonly unknown[], confirmed: boolean): void {
  if (categorySlugs.some(isOrderDetailsConfirmationCategory) && !confirmed) {
    throw new Error(ORDER_DETAILS_CONFIRMATION_REQUIRED_MESSAGE);
  }
}
