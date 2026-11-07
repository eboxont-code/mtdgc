import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

import { requirementHelp } from "./product-help";
import {
  getTopUpIdentifierGuidance,
  shouldPrefillDeliveryEmail,
} from "./top-up-identifiers";

describe("MT-0145 game top-up identifier warnings", () => {
  test("warns customers to verify each Player/User ID from the game profile", () => {
    for (const label of ["Free Fire player ID", "Mobile Legends user ID", "PUBG Mobile player ID"]) {
      const guidance = getTopUpIdentifierGuidance(label);
      assert.ok(guidance);
      assert.equal(guidance.kind, "account");
      assert.match(guidance.message, /game's own profile/);
      assert.match(guidance.message, /different account/);
    }
  });

  test("treats a Player tag as the exact account identifier", () => {
    const guidance = getTopUpIdentifierGuidance("Player tag");
    assert.ok(guidance);
    assert.equal(guidance.kind, "account");
    assert.match(guidance.message, /exactly as displayed/);
  });

  test("explains Zone ID and Server are separate routing details", () => {
    for (const label of ["Zone ID", "Server"]) {
      const guidance = getTopUpIdentifierGuidance(label);
      assert.ok(guidance);
      assert.equal(guidance.kind, "routing");
      assert.match(guidance.message, /separate from the Player\/User ID/);
    }
  });

  test("makes clear that a nickname is a cross-check, not an account identifier", () => {
    const guidance = getTopUpIdentifierGuidance("In-game nickname for verification");
    assert.ok(guidance);
    assert.equal(guidance.kind, "verification");
    assert.match(guidance.message, /does not replace/);
  });

  test("keeps Supercell ID email separate from delivery email and credential requests", () => {
    const guidance = getTopUpIdentifierGuidance("Supercell ID email");
    assert.ok(guidance);
    assert.equal(guidance.kind, "account-email");
    assert.equal(shouldPrefillDeliveryEmail("Supercell ID email"), false);
    assert.match(requirementHelp("Supercell ID email") ?? "", /associated with the Supercell ID/);
    assert.match(guidance.message, /Never enter a password or verification code/);
  });

  test("continues to prefill generic delivery email and ignores unrelated labels", () => {
    assert.equal(shouldPrefillDeliveryEmail("Delivery email address"), true);
    assert.equal(shouldPrefillDeliveryEmail("Email"), true);
    assert.equal(shouldPrefillDeliveryEmail("Player ID"), false);
    assert.equal(getTopUpIdentifierGuidance("Delivery email address"), null);
    assert.equal(getTopUpIdentifierGuidance("Order number"), null);
  });
});
