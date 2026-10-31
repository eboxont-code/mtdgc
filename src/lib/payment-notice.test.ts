import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { needsPaymentDetailsNotice } from "./payment-notice";

describe("Numbered 42 saved payment notice", () => {
  test("shows only when no saved QR or bank details exist", () => {
    assert.equal(needsPaymentDetailsNotice(null), true);
    assert.equal(needsPaymentDetailsNotice({ bank_name: "  ", qr_image_path: "" }), true);
    assert.equal(needsPaymentDetailsNotice({ qr_image_path: "saved-image" }), false);
    for (const key of ["bank_name", "account_name", "account_number"] as const) {
      assert.equal(needsPaymentDetailsNotice({ [key]: "saved-value" }), false);
    }
  });
});