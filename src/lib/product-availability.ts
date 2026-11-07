import { isOrderable, STATUS_LABEL } from "./format";
import { pricesHidden } from "./price-visibility";

export type AvailabilityVariant = {
  sku: string;
  status: string;
  price_minor: number;
  currency: string;
  is_default?: boolean;
  sort_order?: number;
};

export type AvailabilityProduct = {
  slug: string;
  status: string;
  currency: string;
  tags?: readonly string[] | null;
  variants: readonly AvailabilityVariant[];
};

/** Variants that can actually be purchased and whose price uses the storefront's NPR currency. */
export function purchasableVariants(product: AvailabilityProduct): AvailabilityVariant[] {
  if (pricesHidden(product) || !isOrderable(product.status) || product.currency !== "NPR") return [];
  return product.variants.filter((variant) =>
    isOrderable(variant.status) && variant.price_minor > 0 && variant.currency === "NPR"
  );
}

export function isPurchasableVariant(product: AvailabilityProduct, variant: AvailabilityVariant): boolean {
  return purchasableVariants(product).some((candidate) => candidate.sku === variant.sku);
}

/** Lowest purchasable variant; used by both the catalog card and the product-page initial selection. */
export function lowestPurchasableVariant(product: AvailabilityProduct): AvailabilityVariant | null {
  return [...purchasableVariants(product)].sort((a, b) =>
    a.price_minor - b.price_minor || (a.sort_order ?? 0) - (b.sort_order ?? 0)
  )[0] ?? null;
}

export function lowestPurchasablePrice(product: AvailabilityProduct): number | null {
  return lowestPurchasableVariant(product)?.price_minor ?? null;
}

/** Keep an explicitly requested orderable option; otherwise select the same lowest option shown on the card. */
export function selectProductVariant(product: AvailabilityProduct, requestedSku?: string): AvailabilityVariant | null {
  const eligible = purchasableVariants(product);
  if (eligible.length) {
    return eligible.find((variant) => variant.sku === requestedSku) ?? lowestPurchasableVariant(product);
  }
  return product.variants.find((variant) => variant.sku === requestedSku) ??
    product.variants.find((variant) => variant.is_default) ??
    product.variants[0] ??
    null;
}

/** Presentation only: mirror the existing product-page purchase requirements. */
export function isPurchasable(product: AvailabilityProduct): boolean {
  return purchasableVariants(product).length > 0;
}

export function isComingSoon(product: AvailabilityProduct): boolean {
  return pricesHidden(product) || (isOrderable(product.status) && !isPurchasable(product) &&
    product.variants.some((variant) => variant.status === "coming_soon"));
}

/** Published products that are neither currently orderable nor marked as coming soon. */
export function isUnavailable(product: AvailabilityProduct): boolean {
  return !isPurchasable(product) && !isComingSoon(product);
}

export function availabilityLabel(product: AvailabilityProduct): string {
  if (isPurchasable(product)) return "Available now";
  if (isComingSoon(product)) return "Coming soon";
  return isOrderable(product.status) ? "Unavailable" : STATUS_LABEL[product.status] ?? "Unavailable";
}

/** Counts the supplied product set using the same purchasability rules as cards and pages. */
export function availabilityCounts(products: readonly AvailabilityProduct[]) {
  const available = products.filter(isPurchasable).length;
  const comingSoon = products.filter(isComingSoon).length;
  return {
    available,
    comingSoon,
    unavailable: products.length - available - comingSoon,
  };
}
