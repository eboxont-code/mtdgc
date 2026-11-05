import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { availabilityCounts, isComingSoon, isPurchasable } from "./product-availability";

const live = { slug: "real-product", status: "available", tags: [], variants: [{ status: "available", price_minor: 10000 }] };

describe("MT-0182 purchase availability", () => {
  test("coming-soon records never contribute to the purchasable count", () => {
    const soon = { ...live, status: "coming_soon" };
    assert.equal(isPurchasable(soon), false);
    assert.deepEqual(availabilityCounts([live, soon]), { available: 1, comingSoon: 1 });
  });
  test("requires an orderable positive-price option, not just an available product status", () => {
    assert.equal(isPurchasable({ ...live, variants: [{ status: "coming_soon", price_minor: 10000 }] }), false);
    assert.equal(isPurchasable({ ...live, variants: [{ status: "available", price_minor: 0 }] }), false);
    assert.equal(isPurchasable({ ...live, variants: [] }), false);
    assert.equal(isPurchasable({ ...live, status: "low_stock" }), true);
  });
  test("hidden sample prices never produce an available-now listing", () => {
    assert.equal(isPurchasable({ ...live, slug: "sample-product" }), false);
    assert.equal(isComingSoon({ ...live, tags: ["sample"] }), true);
  });
  test("out-of-stock listings are neither purchasable nor coming soon", () => {
    const soldOut = { ...live, status: "out_of_stock" };
    assert.deepEqual(availabilityCounts([soldOut]), { available: 0, comingSoon: 0 });
  });
});