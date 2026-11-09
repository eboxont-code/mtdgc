import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import {
  findUnsafeCustomerRequirement,
  getSafeCustomerRequirements,
  isSafeCustomerRequirements,
} from "./supplier-safety";

describe("MT-0126 customer credential collection safeguards", () => {
  test("rejects explicit game, subscription, password, OTP, PIN and payment credential requests", () => {
    const unsafe = [
      "Account password",
      "Game password",
      "Subscription password",
      "Email password",
      "Subscription passcode",
      "Passphrase",
      "Passkey",
      "OTP",
      "One-time verification code",
      "2FA code",
      "MFA",
      "Authenticator code",
      "Payment PIN",
      "Bank account PIN",
      "Card PIN",
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

  test("normalises separators and rejects less-obvious authentication secrets", () => {
    const unsafe = [
      "2-factor authentication code",
      "Authentication app code",
      "Security question answer",
      "Recovery key",
      "Backup key",
      "API_key",
      "API token",
      "Client token",
      "Developer token",
      "OAuth_refresh_token",
      "Screen_lock_code",
      "Sign_in_to_your_game",
      "Payment_card_security_code",
      "Bank_account_PIN",
      "Session_token",
      "Client_secret",
      "Game_account_login",
      "MFA",
      "Ｐａｓｓｗｏｒｄ",
      "pass_word",
    ];
    for (const label of unsafe) {
      assert.equal(findUnsafeCustomerRequirement([label]), label, label);
    }
  });

  test("allows product identifiers, regions and necessary delivery contact details", () => {
    const safe = [
      "Free Fire player ID",
      "Mobile Legends user ID",
      "Player account ID",
      "Zone ID",
      "Server ID",
      "In-game nickname for verification",
      "Supercell ID email",
      "Delivery email address",
      "Steam account region",
      "Gift card redemption code",
      "Subscription duration",
    ];
    assert.equal(findUnsafeCustomerRequirement(safe), null);
    assert.equal(isSafeCustomerRequirements(safe), true);
  });

  test("returns the first unsafe original label and ignores empty requirements", () => {
    assert.equal(findUnsafeCustomerRequirement(["Player ID", "", "Password"]), "Password");
    assert.equal(findUnsafeCustomerRequirement([]), null);
  });

  test("suppresses every public customer field when any saved requirement is unsafe", () => {
    assert.deepEqual(getSafeCustomerRequirements(["Player ID", "Game password"]), []);
  });

  test("returns a copy of safe fields and rejects malformed or unsafe server requirements", () => {
    const safe = ["Player ID", "Delivery email address"];
    const copy = getSafeCustomerRequirements(safe);
    assert.deepEqual(copy, safe);
    assert.notEqual(copy, safe);
    assert.equal(isSafeCustomerRequirements(null), false);
    assert.equal(isSafeCustomerRequirements(["Player ID", 7]), false);
    assert.equal(isSafeCustomerRequirements(["Player ID", "OAuth refresh token"]), false);
    assert.deepEqual(getSafeCustomerRequirements(null), []);
    assert.deepEqual(getSafeCustomerRequirements(["Player ID", 7]), []);
  });
});
