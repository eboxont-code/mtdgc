import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

import { evaluateOrderLookupRateLimit, ORDER_LOOKUP_ATTEMPT_LIMIT } from "./order-lookup-rate-limit";

describe("MT-0295 order lookup rate-limit decisions", () => {
  test("allows a successful count below the per-IP window limit", () => {
    assert.equal(evaluateOrderLookupRateLimit(0, null), "allowed");
    assert.equal(evaluateOrderLookupRateLimit(9, null), "allowed");
  });

  test("blocks at and above the configured attempt limit", () => {
    assert.equal(ORDER_LOOKUP_ATTEMPT_LIMIT, 10);
    assert.equal(evaluateOrderLookupRateLimit(10, null), "limited");
    assert.equal(evaluateOrderLookupRateLimit(11, null), "limited");
  });

  test("fails closed when the count query returns an error", () => {
    assert.equal(evaluateOrderLookupRateLimit(0, new Error("count failed")), "unavailable");
  });

  test("fails closed when the count is missing or invalid", () => {
    assert.equal(evaluateOrderLookupRateLimit(null, null), "unavailable");
    assert.equal(evaluateOrderLookupRateLimit(-1, null), "unavailable");
    assert.equal(evaluateOrderLookupRateLimit(1.5, null), "unavailable");
    assert.equal(evaluateOrderLookupRateLimit(Number.NaN, null), "unavailable");
  });

  test("fails closed when recording the attempt fails", () => {
    assert.equal(evaluateOrderLookupRateLimit(0, null, new Error("insert failed")), "unavailable");
  });
});
