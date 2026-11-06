import { isOrderable, STATUS_LABEL } from "./format";
import { pricesHidden } from "./price-visibility";

type AvailabilityProduct = {
  slug: string;
  status: string;
  tags?: readonly string[] | null;
  variants: readonly { status: string; price_minor: number }[];
};

/** Presentation only: mirror the existing product-page purchase requirements. */
export function isPurchasable(product: AvailabilityProduct): boolean {
  return !pricesHidden(product) && isOrderable(product.status) &&
    product.variants.some((variant) => isOrderable(variant.status) && variant.price_minor > 0);
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

export function availabilityCounts(products: readonly AvailabilityProduct[]) {
  const available = products.filter(isPurchasable).length;
  const comingSoon = products.filter(isComingSoon).length;
  return {
    available,
    comingSoon,
    unavailable: products.length - available - comingSoon,
  };
}
