import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { hasCheckoutPriceSnapshotChanges, type ExpectedCheckoutPriceLine, type ResolvedCheckoutPriceLine } from "./checkout-price-snapshot";

// Synthetic fixtures only; these are not production product names or prices.
const expected: ExpectedCheckoutPriceLine[] = [{
  sku: "TEST-A",
  expectedProductName: "Fixture Product A",
  expectedVariantName: "Fixture Option A",
  expectedPriceMinor: 1234,
}];
const resolved: ResolvedCheckoutPriceLine[] = [{
  sku: "TEST-A",
  productName: "Fixture Product A",
  variantName: "Fixture Option A",
  priceMinor: 1234,
}];

describe("MT-0183 checkout price snapshots", () => {
  test("accepts an unchanged product, variant and price snapshot", () => {
    assert.equal(hasCheckoutPriceSnapshotChanges(expected, resolved), false);
  });

  test("detects a changed server price before order creation", () => {
    assert.equal(hasCheckoutPriceSnapshotChanges(expected, [{ ...resolved[0]!, priceMinor: 3500 }]), true);
  });

  test("detects product or variant renames even when the price is unchanged", () => {
    assert.equal(hasCheckoutPriceSnapshotChanges(expected, [{ ...resolved[0]!, productName: "Free Fire" }]), true);
    assert.equal(hasCheckoutPriceSnapshotChanges(expected, [{ ...resolved[0]!, variantName: "30 Diamonds" }]), true);
  });

  test("accepts legacy clients that do not send a price snapshot", () => {
    assert.equal(hasCheckoutPriceSnapshotChanges([{ sku: "FF-25" }], resolved), false);
  });

  test("rejects a changed SKU, reordered lines or a changed line count", () => {
    const secondExpected: ExpectedCheckoutPriceLine = {
      sku: "TEST-B",
      expectedProductName: "Fixture Product B",
      expectedVariantName: "Fixture Option B",
      expectedPriceMinor: 5678,
    };
    const secondResolved: ResolvedCheckoutPriceLine = {
      sku: "TEST-B",
      productName: "Fixture Product B",
      variantName: "Fixture Option B",
      priceMinor: 5678,
    };
    assert.equal(hasCheckoutPriceSnapshotChanges(expected, [{ ...resolved[0]!, sku: "TEST-A-CHANGED" }]), true);
    assert.equal(hasCheckoutPriceSnapshotChanges([{ ...expected[0]!, sku: "FF-115" }], resolved), true);
    assert.equal(hasCheckoutPriceSnapshotChanges([...expected, secondExpected], [secondResolved, resolved[0]!]), true);
    assert.equal(hasCheckoutPriceSnapshotChanges([...expected, secondExpected], [...resolved, secondResolved]), false);
    assert.equal(hasCheckoutPriceSnapshotChanges([...expected, secondExpected], resolved), true);
  });
});
