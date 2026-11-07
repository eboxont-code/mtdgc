import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

import {
  MAX_SUPPLIER_REFERENCE_LENGTH,
  SUPPLIER_REFERENCE_EVENT_STATUS,
  canRecordSupplierReference,
  getSupplierReferenceFromEvent,
  isSupplierReferenceEvent,
  isSupplierReferenceEventStatus,
  normaliseSupplierReference,
} from "./supplier-reference";

describe("MT-0124 supplier transaction and redemption references", () => {
  test("allows recording only once supplier fulfilment is in progress or complete", () => {
    for (const status of ["processing", "delivered", "fulfilled", "completed"]) {
      assert.equal(canRecordSupplierReference(status), true, status);
    }
    for (const status of ["pending", "pending_payment", "payment_submitted", "verified", "rejected", "cancelled", "refunded", "failed"]) {
      assert.equal(canRecordSupplierReference(status), false, status);
    }
  });

  test("trims outer whitespace while preserving the supplied reference", () => {
    assert.equal(normaliseSupplierReference("  TxN / AbC-123  "), "TxN / AbC-123");
    assert.equal(normaliseSupplierReference("Ref  With  Spaces"), "Ref  With  Spaces");
  });

  test("rejects missing, whitespace-only and overlong references", () => {
    assert.equal(normaliseSupplierReference(null), null);
    assert.equal(normaliseSupplierReference("   "), null);
    assert.equal(normaliseSupplierReference("x".repeat(MAX_SUPPLIER_REFERENCE_LENGTH + 1)), null);
  });

  test("recognises the internal reference event without treating it as an order status", () => {
    assert.equal(SUPPLIER_REFERENCE_EVENT_STATUS, "supplier_reference");
    assert.equal(isSupplierReferenceEventStatus("supplier_reference"), true);
    assert.equal(isSupplierReferenceEventStatus("delivered"), false);
    assert.equal(isSupplierReferenceEvent({ status: "supplier_reference", note: "TX-123" }), true);
    assert.equal(isSupplierReferenceEvent({ status: "delivered", note: "TX-123" }), false);
  });

  test("extracts only non-empty references from supplier-reference events", () => {
    assert.equal(getSupplierReferenceFromEvent({ status: "supplier_reference", note: "TX-123" }), "TX-123");
    assert.equal(getSupplierReferenceFromEvent({ status: "supplier_reference", note: "   " }), null);
    assert.equal(getSupplierReferenceFromEvent({ status: "delivered", note: "ordinary note" }), null);
  });
});
