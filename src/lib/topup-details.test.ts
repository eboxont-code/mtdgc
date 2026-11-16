import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { isTopup, productIdentifierHelp, validateProductDetails, validateProductIdentifier } from "./topup-details";

describe("top-up details", () => {
  test("only the existing top-up category qualifies", () => {
    assert.equal(isTopup("game-top-ups"), true);
    assert.equal(isTopup("gift-cards"), false);
    assert.equal(isTopup(null), false);
  });
  test("required IDs reject empty, letters and combined zone values", () => {
    for (const label of ["Player ID", "User ID", "Zone ID"]) {
      assert.notEqual(validateProductIdentifier(label, ""), null);
      assert.notEqual(validateProductIdentifier(label, "abc"), null);
      assert.notEqual(validateProductIdentifier(label, "123456 (1234)"), null);
      assert.equal(validateProductIdentifier(label, "123456"), null);
    }
  });
  test("recipient email and server format checks", () => {
    assert.notEqual(validateProductIdentifier("Recipient email", "bad@"), null);
    assert.equal(validateProductIdentifier("Recipient email", "buyer@example.com"), null);
    assert.notEqual(validateProductIdentifier("Server", "<script>"), null);
    assert.equal(validateProductIdentifier("Server", "Asia 1"), null);
  });
  test("checks only current required fields and reports missing ones", () => {
    assert.deepEqual(validateProductDetails(["Player ID", "Zone ID"], { "Player ID": "123", Email: "bad" }), { "Zone ID": "Please enter zone id." });
  });
  test("Mobile Legends separates first user number from bracketed zone", () => {
    assert.ok((productIdentifierHelp("Mobile Legends Diamonds", "User ID") ?? "").includes("first number"));
    assert.ok((productIdentifierHelp("Mobile Legends Diamonds", "Zone ID") ?? "").includes("without brackets"));
    assert.equal(productIdentifierHelp("PUBG Mobile UC", "Player ID"), null);
  });
});