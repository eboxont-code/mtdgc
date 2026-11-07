import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

import {
  buildPaymentProofAssociation,
  hasOrderAccessToken,
  hasOrderContactAccess,
  isAuthenticatedOrderOwner,
  normaliseContact,
  sha256Hex,
} from "./order-access";

describe("MT-0083 payment proof ownership and association", () => {
  test("an access token authorises only the order whose hash it matches", async () => {
    const tokenA = "a".repeat(64);
    const orderA = { access_token_hash: await sha256Hex(tokenA) };
    const orderB = { access_token_hash: await sha256Hex("b".repeat(64)) };

    assert.equal(await hasOrderAccessToken(orderA, tokenA), true);
    assert.equal(await hasOrderAccessToken(orderB, tokenA), false);
    assert.equal(await hasOrderAccessToken(orderA, undefined), false);
  });

  test("an authenticated customer can access only their own account order", () => {
    const order = { user_id: "customer-a" };

    assert.equal(isAuthenticatedOrderOwner(order, "customer-a"), true);
    assert.equal(isAuthenticatedOrderOwner(order, "customer-b"), false);
    assert.equal(isAuthenticatedOrderOwner(order, null), false);
    assert.equal(isAuthenticatedOrderOwner({ user_id: null }, "customer-a"), false);
  });

  test("contact fallback is bound to the order number and saved customer contact", async () => {
    const orderA = {
      verification_hash: await sha256Hex("MTA" + normaliseContact("+61 412 345 678")),
      guest_email: "buyer-a@example.com",
    };
    const orderB = {
      verification_hash: await sha256Hex("MTB" + normaliseContact("0411111111")),
      guest_email: "buyer-b@example.com",
    };

    assert.equal(await hasOrderContactAccess(orderA, "MTA", "+61 412 345 678"), true);
    assert.equal(await hasOrderContactAccess(orderA, "MTA", "BUYER-A@example.com"), true);
    assert.equal(await hasOrderContactAccess(orderA, "MTB", "+61 412 345 678"), false);
    assert.equal(await hasOrderContactAccess(orderB, "MTB", "buyer-a@example.com"), false);
    assert.equal(await hasOrderContactAccess(orderA, "MTA", "attacker@example.com"), false);
  });

  test("proof storage path, order ID and amount all come from the resolved order", () => {
    const association = buildPaymentProofAssociation(
      { id: "resolved-order-a", total_minor: 1299 },
      "a".repeat(32),
      "png",
      "TXN-12345",
    );

    assert.deepEqual(association, {
      storagePath: `resolved-order-a/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.png`,
      proof: {
        order_id: "resolved-order-a",
        transaction_ref: "TXN-12345",
        amount_minor: 1299,
      },
    });
    assert.throws(() => buildPaymentProofAssociation({ id: "resolved-order-a", total_minor: 1299 }, "not-random", "png", "TXN-12345"));
  });
});

describe("MT-0105 guest order tracking", () => {
  test("requires the same order number and a matching saved email or phone", async () => {
    const order = {
      verification_hash: await sha256Hex("MTA" + normaliseContact("+61 412 345 678")),
      guest_email: "buyer-a@example.com",
    };

    assert.equal(await hasOrderContactAccess(order, "MTA", "+61 412 345 678"), true);
    assert.equal(await hasOrderContactAccess(order, "MTA", "BUYER-A@example.com"), true);
    assert.equal(await hasOrderContactAccess(order, "MTB", "+61 412 345 678"), false);
    assert.equal(await hasOrderContactAccess(order, "MTA", "attacker@example.com"), false);
    assert.equal(await hasOrderContactAccess(order, "MTA", undefined), false);
    assert.equal(await hasOrderContactAccess(order, "MTA", "   "), false);
  });
});
