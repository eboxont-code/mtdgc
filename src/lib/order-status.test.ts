import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

import { ORDER_STEPS, orderStatusLabel } from "./format";

describe("MT-0106 canonical customer order status labels", () => {
  test("maps all current and legacy order statuses to one customer-facing label", () => {
    const cases: Array<[string, string]> = [
      ["pending", "Waiting for payment"],
      ["pending_payment", "Waiting for payment"],
      ["payment_submitted", ORDER_STEPS[0]!.title],
      ["paid", ORDER_STEPS[0]!.title],
      ["verified", ORDER_STEPS[1]!.title],
      ["processing", ORDER_STEPS[2]!.title],
      ["delivered", ORDER_STEPS[3]!.title],
      ["fulfilled", ORDER_STEPS[3]!.title],
      ["completed", ORDER_STEPS[3]!.title],
      ["rejected", "Rejected"],
      ["failed", "Failed"],
      ["cancelled", "Cancelled"],
      ["refunded", "Refunded"],
    ];

    for (const [status, expected] of cases) {
      assert.equal(orderStatusLabel(status), expected, status);
    }
  });

  test("keeps an unknown future status visible rather than hiding it", () => {
    assert.equal(orderStatusLabel("future_status"), "future_status");
  });
});
