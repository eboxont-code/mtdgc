import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { hasCheckoutPriceSnapshotChanges, type ExpectedCheckoutPriceLine, type ResolvedCheckoutPriceLine } from "./checkout-price-snapshot";

const expected: ExpectedCheckoutPriceLine[] = [{
  sku: "FF-25",
  expectedProductName: "Free Fire Diamonds",
  expectedVariantName: "25 Diamonds",
  expectedPriceMinor: 3000,
}];
const resolved: ResolvedCheckoutPriceLine[] = [{
  sku: "FF-25",
  productName: "Free Fire Diamonds",
  variantName: "25 Diamonds",
  priceMinor: 3000,
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
      sku: "PUBG-60",
      expectedProductName: "PUBG Mobile UC",
      expectedVariantName: "60 UC",
      expectedPriceMinor: 2000,
    };
    const secondResolved: ResolvedCheckoutPriceLine = {
      sku: "PUBG-60",
      productName: "PUBG Mobile UC",
      variantName: "60 UC",
      priceMinor: 2000,
    };
    assert.equal(hasCheckoutPriceSnapshotChanges(expected, [{ ...resolved[0]!, sku: "FF-115" }]), true);
    assert.equal(hasCheckoutPriceSnapshotChanges([{ ...expected[0]!, sku: "FF-115" }], resolved), true);
    assert.equal(hasCheckoutPriceSnapshotChanges([...expected, secondExpected], [secondResolved, resolved[0]!]), true);
    assert.equal(hasCheckoutPriceSnapshotChanges([...expected, secondExpected], [...resolved, secondResolved]), false);
    assert.equal(hasCheckoutPriceSnapshotChanges([...expected, secondExpected], resolved), true);
  });
});
