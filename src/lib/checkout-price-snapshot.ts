export type ExpectedCheckoutPriceLine = {
  sku: string;
  expectedProductName?: string | undefined;
  expectedVariantName?: string | undefined;
  expectedPriceMinor?: number | undefined;
};

export type ResolvedCheckoutPriceLine = {
  sku: string;
  productName: string;
  variantName: string;
  priceMinor: number;
};

/**
 * Compare the cart snapshot shown to the customer with the server-resolved
 * catalogue values. Missing snapshot fields are accepted for older clients;
 * current checkout sends all three fields.
 */
export function hasCheckoutPriceSnapshotChanges(
  expected: readonly ExpectedCheckoutPriceLine[],
  resolved: readonly ResolvedCheckoutPriceLine[],
): boolean {
  if (expected.length !== resolved.length) return true;

  return expected.some((line, index) => {
    const current = resolved[index];
    if (!current || line.sku !== current.sku) return true;
    if (line.expectedProductName !== undefined && line.expectedProductName !== current.productName) return true;
    if (line.expectedVariantName !== undefined && line.expectedVariantName !== current.variantName) return true;
    if (line.expectedPriceMinor !== undefined && line.expectedPriceMinor !== current.priceMinor) return true;
    return false;
  });
}
