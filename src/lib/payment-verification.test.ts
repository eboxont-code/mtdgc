import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { hasDuplicatePaymentReference, hasVerifiedOrderPayment } from "./payment-verification";

describe("15 Nov payment safeguards", () => {
  const proof = { order_id: "order-a", status: "verified", amount_minor: 12500, reviewed_at: "2026-11-15T01:20:00Z", reviewed_by: "admin-a" };
  test("processing and delivery require a reviewed verified payment for the correct order and amount", () => {
    assert.equal(hasVerifiedOrderPayment("order-a", 12500, [proof]), true);
    assert.equal(hasVerifiedOrderPayment("order-b", 12500, [proof]), false);
    assert.equal(hasVerifiedOrderPayment("order-a", 12501, [proof]), false);
    assert.equal(hasVerifiedOrderPayment("order-a", 12500, [{ ...proof, status: "submitted" }]), false);
    assert.equal(hasVerifiedOrderPayment("order-a", 12500, [{ ...proof, reviewed_by: null }]), false);
    assert.equal(hasVerifiedOrderPayment("order-a", 12500, [{ ...proof, reviewed_at: null }]), false);
    assert.equal(hasVerifiedOrderPayment("order-a", 12500, []), false);
  });
  test("a transaction reference attached to another order cannot be silently verified", () => {
    const proofs = [{ order_id: "order-b", transaction_ref: " Tx-1234 " }];
    assert.equal(hasDuplicatePaymentReference("order-a", "TX-1234", proofs), true);
    assert.equal(hasDuplicatePaymentReference("order-b", "TX-1234", proofs), false);
    assert.equal(hasDuplicatePaymentReference("order-a", "TX-1235", proofs), false);
  });
});