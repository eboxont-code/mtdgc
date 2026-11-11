import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

import { ORDER_NOTICE, ORDER_STATUS_LABEL, ORDER_STEPS, orderStepIndex } from "./format";

describe("MT-0102 operational order milestone definitions", () => {
  test("payment proof submission is not described as money received", () => {
    const step = ORDER_STEPS.find((item) => item.statuses.includes("payment_submitted"));
    assert.equal(step?.title, "Payment proof received");
    assert.deepEqual(step?.statuses, ["payment_submitted"]);
    assert.match(step?.body ?? "", /does not confirm that funds reached our account/i);
    assert.equal(ORDER_STATUS_LABEL.payment_submitted, "Payment proof received");
  });

  test("legacy paid status is not treated as proof review or settlement confirmation", () => {
    assert.equal(ORDER_STATUS_LABEL.paid, "Legacy payment status");
    assert.equal(orderStepIndex("paid"), -1);
    assert.match(ORDER_NOTICE.paid ?? "", /not independent confirmation that funds reached MTDGC/i);
  });

  test("verified is explicitly a staff-marked status without independent settlement confirmation", () => {
    const step = ORDER_STEPS.find((item) => item.statuses.includes("verified"));
    assert.equal(step?.title, "Verified by staff");
    assert.equal(ORDER_STATUS_LABEL.verified, "Marked verified by staff");
    assert.match(step?.body ?? "", /administrator has marked this order as verified/i);
    assert.match(step?.body ?? "", /does not receive independent bank or payment-provider settlement confirmation/i);
  });

  test("processing is described as a manual staff update, not a supplier signal", () => {
    const step = ORDER_STEPS.find((item) => item.statuses.includes("processing"));
    assert.equal(step?.title, "Processing");
    assert.match(step?.body ?? "", /manual staff update/i);
    assert.match(step?.body ?? "", /not a live supplier\/API signal/i);
  });

  test("delivered is staff-marked and does not promise email dispatch", () => {
    const step = ORDER_STEPS.find((item) => item.statuses.includes("delivered"));
    assert.equal(step?.title, "Delivered");
    assert.deepEqual(step?.statuses, ["delivered", "fulfilled", "completed"]);
    assert.match(step?.body ?? "", /team has marked this order as delivered/i);
    assert.doesNotMatch(step?.body ?? "", /email/i);
  });
});
