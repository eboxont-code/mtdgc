export const ORDER_DETAILS_CONFIRMATION_CATEGORIES = ["game-top-ups", "gift-cards"] as const;

export const ORDER_DETAILS_CONFIRMATION_REQUIRED_MESSAGE =
  "Please review and confirm the delivery details before placing this order.";

export const REGION_COMPATIBILITY_CONFIRMATION_REQUIRED_MESSAGE =
  "Please review the listed region and confirm the issuer's redemption rules before placing this order.";
export const REGION_NOT_LISTED_MESSAGE =
  "A redemption region is not listed for this code. Contact MTDGC and wait for confirmation before paying.";
export const REGION_CHANGED_MESSAGE =
  "The product region changed after this item was added to your cart. Remove and re-add the item before placing the order.";

const PLAYER_IDENTIFIER_REQUIREMENT_PATTERNS = [
  /\b(?:player|user|account|character|game)\b.{0,24}\b(?:id|identifier|tag|name|email)\b/,
  /\b(?:zone|server)(?:\s+(?:id|identifier))?\b/,
  /\bsupercell\s+id\b/,
  /\bin\s+game\s+nickname\b/,
] as const;

/** Identify saved customer fields that route or verify a game top-up account. */
export function isPlayerIdentifierRequirement(requirement: unknown): requirement is string {
  if (typeof requirement !== "string") return false;
  const normalised = requirement
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return PLAYER_IDENTIFIER_REQUIREMENT_PATTERNS.some((pattern) => pattern.test(normalised));
}

/**
 * Show a wrong-account warning only for top-ups with saved account identifiers.
 * Older cart lines without a category are handled conservatively when their
 * saved field labels clearly identify a player/account/zone/server.
 */
export function getPlayerIdentifierWarning(categorySlug: unknown, requirements: readonly unknown[]): string | null {
  const labels = [...new Set(requirements.filter(isPlayerIdentifierRequirement).map((label) => label.trim()))];
  const slug = typeof categorySlug === "string" ? categorySlug.trim() : "";
  const isTopUp = slug === "game-top-ups" || (!slug && labels.length > 0);
  if (!isTopUp || labels.length === 0) return null;

  return `Double-check these details against the exact in-game account before confirming this top-up: ${labels.join(", ")}. For games that use both a user/player ID and a zone/server ID, verify the pair together. A typo can misdirect a top-up or delay fulfilment. No supplier-specific reversal process has been verified, so do not assume an incorrect top-up can be reversed. If any detail is uncertain, go back and correct it or contact MTDGC before paying.`;
}

export type OrderConfirmationLine = {
  categorySlug?: string | null | undefined;
  region?: string | null | undefined;
  fields?: Record<string, string> | undefined;
};

export type RegionConfirmationProduct = {
  categorySlug?: unknown;
  region?: unknown;
  expectedRegion?: unknown;
};

/** Categories whose current catalogue data identifies top-ups or emailed gift-card codes. */
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

/** Top-ups and gift-card codes must show and confirm their catalogue region. */
export function isRegionSensitiveCategory(categorySlug: unknown): boolean {
  return isOrderDetailsConfirmationCategory(categorySlug);
}

/**
 * Prompt current code categories and conservatively handle older cart lines that
 * have no saved category but do retain region or delivery-field metadata.
 */
export function requiresRegionCompatibilityConfirmation(lines: readonly OrderConfirmationLine[]): boolean {
  return lines.some(
    (line) =>
      isRegionSensitiveCategory(line.categorySlug) ||
      (!line.categorySlug && (Boolean(line.region?.trim()) || Object.keys(line.fields ?? {}).length > 0)),
  );
}

/**
 * A catalogue region is not issuer evidence. Keep the wording cautious for both
 * "Global" and specific labels; never claim compatibility from this field alone.
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
 * Compare the region shown in the cart with the current server-resolved product.
 * The client value is never used as the source of truth; it only detects stale carts.
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

/** Re-check the product category resolved from the database before order creation. */
export function assertOrderDetailsConfirmed(categorySlugs: readonly unknown[], confirmed: boolean): void {
  if (categorySlugs.some(isOrderDetailsConfirmationCategory) && !confirmed) {
    throw new Error(ORDER_DETAILS_CONFIRMATION_REQUIRED_MESSAGE);
  }
}
