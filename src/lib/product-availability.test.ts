import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { availabilityCounts, availabilityLabel, getRegionCompatibilityWarning, isComingSoon, isPurchasable, isUnavailable } from "./product-availability";

const live = { slug: "real-product", status: "available", tags: [], variants: [{ status: "available", price_minor: 10000 }] };

describe("MT-0182 purchase availability", () => {
  test("coming-soon records never contribute to the purchasable count", () => {
    const soon = { ...live, status: "coming_soon" };
    assert.equal(isPurchasable(soon), false);
    assert.deepEqual(availabilityCounts([live, soon]), { available: 1, comingSoon: 1, unavailable: 0 });
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
  test("out-of-stock and temporarily unavailable listings are counted as unavailable", () => {
    const soldOut = { ...live, status: "out_of_stock" };
    const paused = { ...live, status: "temporarily_unavailable" };
    assert.equal(isUnavailable(soldOut), true);
    assert.equal(isUnavailable(paused), true);
    assert.equal(availabilityLabel(paused), "Temporarily unavailable");
    assert.deepEqual(availabilityCounts([soldOut, paused]), { available: 0, comingSoon: 0, unavailable: 2 });
  });
});


describe("MT-0144 region compatibility warnings", () => {
  test("shows a cautious warning for a specifically listed region", () => {
    const warning = getRegionCompatibilityWarning("Australia");
    assert.equal(warning?.region, "Australia");
    assert.match(warning?.message ?? "", /issuer's current compatibility information/);
    assert.match(warning?.confirmationLabel ?? "", /Australia/);
  });

  test("trims surrounding whitespace while preserving the recorded region", () => {
    const warning = getRegionCompatibilityWarning("  Nepal  ");
    assert.equal(warning?.region, "Nepal");
  });

  test("does not treat the Global catalogue label as a specific region lock", () => {
    assert.equal(getRegionCompatibilityWarning("Global"), null);
    assert.equal(getRegionCompatibilityWarning(" global "), null);
  });

  test("does not invent a restriction when region data is absent", () => {
    for (const region of [null, undefined, "", "   "]) {
      assert.equal(getRegionCompatibilityWarning(region), null);
    }
  });

  test("warns for each recorded non-Global region without hard-coded country assumptions", () => {
    for (const region of ["Nepal", "Australia", "EU", "US"]) {
      assert.equal(getRegionCompatibilityWarning(region)?.region, region);
    }
  });
});
