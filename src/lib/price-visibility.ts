/**
 * Sample and coming-soon listings never show a price anywhere on the public site.
 * Keyed off the `sample-` slug prefix, a `sample` tag, or the `coming_soon` status,
 * so it works without any database change.
 */
export const PRICE_COMING_SOON = "Price coming soon";

export function pricesHidden(product: { slug: string; status: string; tags?: readonly string[] | null | undefined }): boolean {
  if (product.status === "coming_soon") return true;
  if (product.slug.startsWith("sample-")) return true;
  return (product.tags ?? []).some((tag) => tag.toLowerCase() === "sample");
}
