import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

import {
  ORDER_NOTICE,
  ORDER_STATUS_LABELS,
  ORDER_STEPS,
  orderStatusLabel,
  orderStepIndex,
} from "./order-status";

const PRODUCTION_ORDER_STATUSES = [
  "pending",
  "processing",
  "paid",
  "failed",
  "cancelled",
  "refunded",
  "fulfilled",
  "completed",
  "pending_payment",
  "payment_submitted",
  "verified",
  "rejected",
  "delivered",
];

describe("canonical customer order status presentation", () => {
  test("provides a customer-facing label and notice for every production enum value", () => {
    for (const status of PRODUCTION_ORDER_STATUSES) {
      assert.ok(ORDER_STATUS_LABELS[status], `missing label for ${status}`);
      assert.ok(ORDER_NOTICE[status], `missing notice for ${status}`);
      assert.equal(orderStatusLabel(status), ORDER_STATUS_LABELS[status]);
    }
    assert.equal(Object.keys(ORDER_STATUS_LABELS).length, PRODUCTION_ORDER_STATUSES.length);
  });

  test("distinguishes proof submission, legacy payment received and manual proof review", () => {
    assert.equal(orderStatusLabel("payment_submitted"), "Payment proof submitted");
    assert.equal(orderStatusLabel("paid"), "Payment marked received");
    assert.equal(orderStatusLabel("verified"), "Payment proof reviewed");
    assert.match(ORDER_NOTICE["payment_submitted"], /manual review/i);
    assert.match(ORDER_NOTICE["payment_submitted"], /does not confirm that funds have settled/i);
    assert.match(ORDER_NOTICE["paid"], /legacy status/i);
    assert.match(ORDER_NOTICE["verified"], /manual review/i);
    assert.match(ORDER_NOTICE["verified"], /not an automatic bank-settlement confirmation/i);
  });

  test("normalises legacy delivery aliases without changing their stored values", () => {
    assert.equal(orderStatusLabel("delivered"), "Delivered");
    assert.equal(orderStatusLabel("fulfilled"), "Delivered");
    assert.equal(orderStatusLabel("completed"), "Delivered");
    assert.match(ORDER_NOTICE["fulfilled"], /legacy status/i);
    assert.match(ORDER_NOTICE["completed"], /legacy status/i);
  });

  test("uses the same safe fallback for unknown values instead of exposing raw enum text", () => {
    assert.equal(orderStatusLabel("unexpected_internal_value"), "Status update");
  });

  test("keeps unpaid orders in the payment step and terminal states outside fulfilment progress", () => {
    assert.equal(orderStepIndex("pending_payment"), 0);
    assert.equal(orderStepIndex("payment_submitted"), 0);
    assert.equal(orderStepIndex("verified"), 1);
    assert.equal(orderStepIndex("processing"), 2);
    assert.equal(orderStepIndex("delivered"), 3);
    assert.equal(orderStepIndex("cancelled"), -1);
    assert.equal(orderStepIndex("refunded"), -1);
    assert.match(ORDER_STEPS[0]?.body ?? "", /screenshot alone does not confirm/i);
    assert.match(ORDER_STEPS[3]?.body ?? "", /Staff have marked/i);
  });
});
