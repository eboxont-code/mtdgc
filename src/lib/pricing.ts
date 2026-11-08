import type { CatalogProduct, Variant } from "@/lib/catalog.functions";
import { purchasableVariants } from "@/lib/product-availability";

/**
 * Real previous prices, keyed by variant SKU, in minor units (paisa).
 * Only add an entry when MTDGC actually sold that option at the higher price.
 * Discount badges and the deals strip read from here and stay hidden while it is empty.
 */
export const COMPARE_AT_MINOR: Record<string, number> = {};

export function compareAt(variant: Pick<Variant, "sku" | "price_minor">): number | null {
  const was = COMPARE_AT_MINOR[variant.sku];
  return was && was > variant.price_minor ? was : null;
}

export function discountPercent(variant: Pick<Variant, "sku" | "price_minor">): number | null {
  const was = compareAt(variant);
  return was ? Math.round(((was - variant.price_minor) / was) * 100) : null;
}

/** The best real discount on a product, or null. */
export function bestDeal(product: CatalogProduct): { variant: Variant; was: number; percent: number } | null {
  let best: { variant: Variant; was: number; percent: number } | null = null;
  for (const variant of purchasableVariants(product)) {
    const was = compareAt(variant);
    const percent = discountPercent(variant);
    if (was && percent && (!best || percent > best.percent)) best = { variant, was, percent };
  }
  return best;
}
