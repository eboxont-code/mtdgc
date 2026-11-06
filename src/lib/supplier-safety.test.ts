import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { findUnsafeCustomerRequirement } from "./supplier-safety";

describe("MT-0044 supplier credential safeguards", () => {
  test("rejects password, OTP, PIN and account-access requirements", () => {
    const unsafe = [
      "Account password",
      "Subscription passcode",
      "OTP",
      "One-time verification code",
      "2FA code",
      "Payment PIN",
      "Recovery code",
      "Backup phrase",
      "Bank login credentials",
      "Session cookie",
      "Access token",
      "Remote account access",
      "CVV",
      "Credit card number",
    ];
    for (const label of unsafe) {
      assert.equal(findUnsafeCustomerRequirement([label]), label, label);
    }
  });

  test("allows product identifiers and necessary delivery contact details", () => {
    const safe = [
      "Free Fire player ID",
      "Mobile Legends user ID",
      "Zone ID",
      "In-game nickname for verification",
      "Supercell ID email",
      "Delivery email address",
      "Steam account region",
    ];
    assert.equal(findUnsafeCustomerRequirement(safe), null);
  });

  test("returns the first unsafe field and ignores empty requirements", () => {
    assert.equal(findUnsafeCustomerRequirement(["Player ID", "", "Password"]), "Password");
    assert.equal(findUnsafeCustomerRequirement([]), null);
  });
});
