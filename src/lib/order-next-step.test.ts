import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { getOrderNextStep } from "./order-next-step";

describe("customer actions follow existing order status capabilities", () => {
  test("only pending_payment offers payment proof submission", () => {
    assert.equal(getOrderNextStep("pending_payment").action, "payment_proof");
    for (const status of ["pending", "payment_submitted", "paid", "verified", "processing", "delivered", "fulfilled", "completed", "rejected", "failed", "cancelled", "refunded"]) {
      assert.notEqual(getOrderNextStep(status).action, "payment_proof", status);
    }
  });
  test("submitted and manually paid orders wait rather than ask for another payment", () => {
    assert.equal(getOrderNextStep("payment_submitted").action, "wait");
    assert.equal(getOrderNextStep("paid").action, "wait");
  });
  test("verified and processing orders require no customer action", () => {
    assert.equal(getOrderNextStep("verified").action, "wait");
    assert.equal(getOrderNextStep("processing").action, "wait");
  });
  test("delivery aliases ask the customer to check their item", () => {
    for (const status of ["delivered", "fulfilled", "completed"]) assert.equal(getOrderNextStep(status).action, "check_delivery");
  });
  test("rejected, failed and legacy pending orders require support, not an unsupported upload", () => {
    for (const status of ["rejected", "failed", "pending"]) assert.equal(getOrderNextStep(status).action, "support");
  });
  test("cancelled orders do not request payment and refunds require checking", () => {
    assert.equal(getOrderNextStep("cancelled").action, "none");
    assert.equal(getOrderNextStep("refunded").action, "check_delivery");
  });
  test("unknown statuses use support rather than assume payment or delivery", () => {
    assert.equal(getOrderNextStep("unknown").action, "support");
  });
});