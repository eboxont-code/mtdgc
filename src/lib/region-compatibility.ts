export const REGION_COMPATIBILITY_CONFIRMATION_REQUIRED_MESSAGE =
  "Please review the listed region and confirm the issuer's redemption rules before placing this order.";
export const REGION_NOT_LISTED_MESSAGE =
  "A redemption region is not listed for this item. Contact MTDGC and wait for confirmation before paying.";
export const REGION_CHANGED_MESSAGE =
  "The product region changed after this item was added to your cart. Remove and re-add the item before placing the order.";

export type RegionConfirmationLine = {
  categorySlug?: string | null | undefined;
  region?: string | null | undefined;
  fields?: Record<string, string> | undefined;
};

export type RegionConfirmationProduct = {
  categorySlug?: unknown;
  region?: unknown;
  expectedRegion?: unknown;
};

/** Categories whose products can depend on an account or redemption region. */
export function isRegionSensitiveCategory(categorySlug: unknown): boolean {
  return categorySlug === "game-top-ups" || categorySlug === "gift-cards";
}

/**
 * Prompt known top-up/code lines. Older saved cart lines without a category are
 * handled conservatively when they still contain region or delivery details.
 */
export function requiresRegionCompatibilityConfirmation(lines: readonly RegionConfirmationLine[]): boolean {
  return lines.some(
    (line) =>
      isRegionSensitiveCategory(line.categorySlug) ||
      (!line.categorySlug && (Boolean(line.region?.trim()) || Object.keys(line.fields ?? {}).length > 0)),
  );
}

/**
 * Catalogue region labels are not independent issuer evidence. Never infer
 * universal compatibility from "Global" or from a specific market label.
 */
export function getRegionCompatibilityWarning(region: unknown): string {
  const label = typeof region === "string" ? region.trim() : "";
  if (!label) {
    return "No redemption region is listed for this item. Do not pay until MTDGC confirms the intended account's region compatibility.";
  }
  if (label.toLowerCase() === "global") {
    return "This listing is marked Global. Global is a catalogue label, not a guarantee of redemption in every country or account region. Check the issuer's current redemption rules for the account that will receive the code before paying.";
  }
  return `This listing is marked ${label}. A catalogue label is not independent issuer verification. Check the issuer's current redemption rules for the intended account/store country before paying. If you cannot confirm compatibility, do not pay.`;
}

function normaliseRegion(value: unknown): string {
  return typeof value === "string"
    ? value.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase()
    : "";
}

/**
 * The server resolves category/region from the selected SKU. The cart's saved
 * region is comparison-only and detects stale carts; it is never authoritative.
 */
export function assertRegionCompatibilityConfirmed(
  products: readonly RegionConfirmationProduct[],
  confirmed: boolean,
): void {
  const relevant = products.filter((product) => isRegionSensitiveCategory(product.categorySlug));
  if (!relevant.length) return;

  for (const product of relevant) {
    const actualRegion = normaliseRegion(product.region);
    if (!actualRegion) throw new Error(REGION_NOT_LISTED_MESSAGE);
    const expectedRegion = normaliseRegion(product.expectedRegion);
    if (!expectedRegion || expectedRegion !== actualRegion) throw new Error(REGION_CHANGED_MESSAGE);
  }

  if (!confirmed) throw new Error(REGION_COMPATIBILITY_CONFIRMATION_REQUIRED_MESSAGE);
}
