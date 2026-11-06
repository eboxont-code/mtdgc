import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { generateOrderReference, isSupportedOrderReference } from "./order-reference";

describe("MT-0082 order references", () => {
  test("generates a 128-bit uppercase hexadecimal reference", () => {
    const reference = generateOrderReference();
    assert.match(reference, /^MT[0-9A-F]{32}$/);
    assert.equal(reference.length, 34);
  });

  test("generates distinct references across a batch", () => {
    const references = Array.from({ length: 1_000 }, () => generateOrderReference());
    assert.equal(new Set(references).size, references.length);
  });

  test("accepts new and historical storefront reference formats", () => {
    assert.equal(isSupportedOrderReference("MT" + "a".repeat(32)), true);
    assert.equal(isSupportedOrderReference("MT123456"), true);
    assert.equal(isSupportedOrderReference("MTD-ABCD"), true);
    assert.equal(isSupportedOrderReference("MTDGC-ABCD"), true);
  });

  test("rejects malformed references", () => {
    for (const reference of ["MT12345", "MT" + "G".repeat(32), "MT" + "A".repeat(33), "123456"]) {
      assert.equal(isSupportedOrderReference(reference), false, reference);
    }
  });
});
