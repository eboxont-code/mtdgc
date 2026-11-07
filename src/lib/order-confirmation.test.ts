import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

import {
  ORDER_DETAILS_CONFIRMATION_REQUIRED_MESSAGE,
  assertOrderDetailsConfirmed,
  isOrderDetailsConfirmationCategory,
  requiresOrderDetailsConfirmation,
} from "./order-confirmation";

describe("MT-0123 second confirmation for top-ups and code delivery", () => {
  test("identifies only categories supported by current catalogue data", () => {
    assert.equal(isOrderDetailsConfirmationCategory("game-top-ups"), true);
    assert.equal(isOrderDetailsConfirmationCategory("gift-cards"), true);
    assert.equal(isOrderDetailsConfirmationCategory("software"), false);
    assert.equal(isOrderDetailsConfirmationCategory("subscriptions"), false);
    assert.equal(isOrderDetailsConfirmationCategory(undefined), false);
  });

  test("requires a second review for game top-ups and gift-card codes", () => {
    assert.equal(requiresOrderDetailsConfirmation([{ categorySlug: "game-top-ups" }]), true);
    assert.equal(requiresOrderDetailsConfirmation([{ categorySlug: "gift-cards" }]), true);
    assert.equal(
      requiresOrderDetailsConfirmation([{ categorySlug: "software", fields: { Email: "a@example.com" } }]),
      false,
    );
    assert.equal(
      requiresOrderDetailsConfirmation([{ categorySlug: "other", fields: { Email: "a@example.com" } }]),
      false,
    );
  });

  test("conservatively reviews legacy cart lines with delivery fields but no saved category", () => {
    assert.equal(requiresOrderDetailsConfirmation([{ fields: { "Player ID": "12345" } }]), true);
    assert.equal(requiresOrderDetailsConfirmation([{ fields: {} }]), false);
  });

  test("server-side category resolution rejects an unconfirmed top-up or code order", () => {
    assert.throws(
      () => assertOrderDetailsConfirmed(["game-top-ups"], false),
      new RegExp(ORDER_DETAILS_CONFIRMATION_REQUIRED_MESSAGE),
    );
    assert.throws(
      () => assertOrderDetailsConfirmed(["gift-cards"], false),
      new RegExp(ORDER_DETAILS_CONFIRMATION_REQUIRED_MESSAGE),
    );
  });

  test("server-side category resolution accepts confirmation and leaves unrelated categories ungated", () => {
    assert.doesNotThrow(() => assertOrderDetailsConfirmed(["game-top-ups", "gift-cards"], true));
    assert.doesNotThrow(() => assertOrderDetailsConfirmed(["software", "subscriptions"], false));
    assert.doesNotThrow(() => assertOrderDetailsConfirmed([undefined, null], false));
  });
});
