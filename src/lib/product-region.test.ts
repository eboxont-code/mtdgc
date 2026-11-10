import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { listingRegion } from "./product-region";

describe("MT-0144 listing region", () => {
  test("keeps the saved region without inventing a market", () => {
    assert.equal(listingRegion("  Australia  "), "Australia");
    assert.equal(listingRegion("Global"), "Global");
    assert.equal(listingRegion("Nepal / India"), "Nepal / India");
  });
  test("omits warnings when listing region is absent", () => {
    assert.equal(listingRegion(undefined), null);
    assert.equal(listingRegion(null), null);
    assert.equal(listingRegion("  "), null);
  });
});