import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import {
  availabilityCounts,
  availabilityLabel,
  isComingSoon,
  isPurchasable,
  isUnavailable,
  lowestPurchasablePrice,
  lowestPurchasableVariant,
  purchasableVariants,
  selectProductVariant,
} from "./product-availability";

const live = {
  slug: "real-product",
  status: "available",
  currency: "NPR",
  tags: [],
  variants: [{ sku: "SKU-1", name: "Default option", status: "available", price_minor: 10000, currency: "NPR", is_default: true, sort_order: 1 }],
};

describe("MT-0182 purchase availability", () => {
  test("coming-soon records never contribute to the purchasable count", () => {
    const soon = { ...live, status: "coming_soon" };
    assert.equal(isPurchasable(soon), false);
    assert.deepEqual(availabilityCounts([live, soon]), { available: 1, comingSoon: 1, unavailable: 0 });
  });
  test("requires an orderable positive-price option, not just an available product status", () => {
    assert.equal(isPurchasable({ ...live, variants: [{ sku: "SOON", name: "Soon", status: "coming_soon", price_minor: 10000, currency: "NPR" }] }), false);
    assert.equal(isPurchasable({ ...live, variants: [{ sku: "ZERO", name: "Zero", status: "available", price_minor: 0, currency: "NPR" }] }), false);
    assert.equal(isPurchasable({ ...live, variants: [] }), false);
    assert.equal(isPurchasable({ ...live, status: "low_stock" }), true);
  });
  test("hidden sample prices never produce an available-now listing", () => {
    assert.equal(isPurchasable({ ...live, slug: "sample-product" }), false);
    assert.equal(isComingSoon({ ...live, tags: ["sample"] }), true);
  });
  test("out-of-stock and temporarily unavailable listings are counted as unavailable", () => {
    const soldOut = { ...live, status: "out_of_stock" };
    const paused = { ...live, status: "temporarily_unavailable" };
    assert.equal(isUnavailable(soldOut), true);
    assert.equal(isUnavailable(paused), true);
    assert.equal(availabilityLabel(paused), "Temporarily unavailable");
    assert.deepEqual(availabilityCounts([soldOut, paused]), { available: 0, comingSoon: 0, unavailable: 2 });
  });
  test("card starting price and product-page initial option use the same lowest purchasable variant", () => {
    const product = {
      ...live,
      variants: [
        { sku: "GOLD", name: "Gold Pass", status: "available", price_minor: 39900, currency: "NPR", is_default: true, sort_order: 1 },
        { sku: "EVENT", name: "Event Pass", status: "available", price_minor: 24900, currency: "NPR", is_default: false, sort_order: 2 },
        { sku: "EARLY", name: "Early Pass", status: "coming_soon", price_minor: 10000, currency: "NPR", is_default: false, sort_order: 3 },
      ],
    };
    assert.equal(lowestPurchasablePrice(product), 24900);
    assert.equal(lowestPurchasableVariant(product)?.sku, "EVENT");
    assert.equal(selectProductVariant(product)?.sku, "EVENT");
    assert.equal(selectProductVariant(product, "GOLD")?.sku, "GOLD");
    assert.equal(selectProductVariant(product, "EARLY")?.sku, "EVENT");
  });
  test("product-level unavailability and unsupported currencies suppress purchasable prices", () => {
    const paused = { ...live, status: "temporarily_unavailable" };
    const unsupportedProduct = { ...live, currency: "USD" };
    const unsupportedVariant = { ...live, variants: [{ ...live.variants[0], currency: "USD" }] };
    assert.deepEqual(purchasableVariants(paused), []);
    assert.equal(lowestPurchasablePrice(paused), null);
    assert.equal(isPurchasable(unsupportedProduct), false);
    assert.equal(isPurchasable(unsupportedVariant), false);
    assert.equal(lowestPurchasablePrice(unsupportedVariant), null);
  });
});
