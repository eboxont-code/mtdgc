/** Listing-only region display; never infer a market from category or currency. */
export function listingRegion(region: string | null | undefined): string | null {
  return region?.trim() || null;
}