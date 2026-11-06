import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

import { canAdminTransitionOrder, getAdminOrderStatusOptions } from "./order-transitions";

describe("generic admin order transitions", () => {
  test("allows only verified to processing and processing to delivered", () => {
    assert.equal(canAdminTransitionOrder("verified", "processing"), true);
    assert.equal(canAdminTransitionOrder("processing", "delivered"), true);
    assert.deepEqual(getAdminOrderStatusOptions("verified"), ["processing"]);
    assert.deepEqual(getAdminOrderStatusOptions("processing"), ["delivered"]);
  });

  test("does not allow pending or payment-submitted orders to enter fulfilment", () => {
    for (const status of ["pending", "pending_payment", "payment_submitted", "paid", "rejected"]) {
      assert.equal(canAdminTransitionOrder(status, "processing"), false, status);
      assert.equal(canAdminTransitionOrder(status, "delivered"), false, status);
    }
  });

  test("does not allow skipping verification or processing", () => {
    assert.equal(canAdminTransitionOrder("verified", "delivered"), false);
    assert.equal(canAdminTransitionOrder("pending_payment", "delivered"), false);
    assert.equal(canAdminTransitionOrder("paid", "processing"), false);
  });

  test("keeps terminal and legacy statuses without generic next actions", () => {
    for (const status of ["delivered", "cancelled", "refunded", "failed", "fulfilled", "completed", "rejected", "pending"]) {
      assert.deepEqual(getAdminOrderStatusOptions(status), [], status);
    }
  });

  test("rejects unknown statuses and transitions", () => {
    assert.equal(canAdminTransitionOrder("unknown", "processing"), false);
    assert.equal(canAdminTransitionOrder("verified", "refunded"), false);
    assert.equal(canAdminTransitionOrder("processing", "cancelled"), false);
  });
});
