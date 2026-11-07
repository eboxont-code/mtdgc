import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

import {
  ORDER_DETAILS_CONFIRMATION_REQUIRED_MESSAGE,
  REGION_CHANGED_MESSAGE,
  REGION_COMPATIBILITY_CONFIRMATION_REQUIRED_MESSAGE,
  REGION_NOT_LISTED_MESSAGE,
  assertOrderDetailsConfirmed,
  assertRegionCompatibilityConfirmed,
  getRegionCompatibilityWarning,
  isOrderDetailsConfirmationCategory,
  isRegionSensitiveCategory,
  requiresOrderDetailsConfirmation,
  requiresRegionCompatibilityConfirmation,
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


describe("MT-0144 region compatibility warnings before payment", () => {
  test("applies the region check to top-up and gift-card categories, not unrelated products", () => {
    assert.equal(isRegionSensitiveCategory("game-top-ups"), true);
    assert.equal(isRegionSensitiveCategory("gift-cards"), true);
    assert.equal(isRegionSensitiveCategory("software"), false);
    assert.equal(requiresRegionCompatibilityConfirmation([{ categorySlug: "game-top-ups", region: "Global" }]), true);
    assert.equal(requiresRegionCompatibilityConfirmation([{ categorySlug: "gift-cards", region: "Australia" }]), true);
    assert.equal(requiresRegionCompatibilityConfirmation([{ categorySlug: "software", region: "Australia" }]), false);
  });

  test("conservatively prompts legacy cart lines that retain region or delivery fields but no category", () => {
    assert.equal(requiresRegionCompatibilityConfirmation([{ region: "Global" }]), true);
    assert.equal(requiresRegionCompatibilityConfirmation([{ fields: { "Player ID": "12345" } }]), true);
    assert.equal(requiresRegionCompatibilityConfirmation([{ fields: {} }]), false);
  });

  test("warns that Global is only a catalogue label and not issuer compatibility evidence", () => {
    const warning = getRegionCompatibilityWarning("Global");
    assert.match(warning, /catalogue label/i);
    assert.match(warning, /not a guarantee/i);
    assert.match(warning, /issuer's current redemption rules/i);
  });

  test("describes a specific listed region without claiming that redemption is verified", () => {
    const warning = getRegionCompatibilityWarning("Australia");
    assert.match(warning, /marked Australia/i);
    assert.match(warning, /not independent issuer verification/i);
    assert.match(warning, /If you cannot confirm compatibility, do not pay/i);
  });

  test("tells customers not to pay when no redemption region is listed", () => {
    assert.match(getRegionCompatibilityWarning(""), /Do not pay/i);
    assert.match(getRegionCompatibilityWarning(null), /region compatibility/i);
  });

  test("server rejects missing region, stale cart region and missing acknowledgement", () => {
    assert.throws(
      () => assertRegionCompatibilityConfirmed([{ categorySlug: "gift-cards", region: "", expectedRegion: "" }], true),
      (error: unknown) => error instanceof Error && error.message === REGION_NOT_LISTED_MESSAGE,
    );
    assert.throws(
      () => assertRegionCompatibilityConfirmed([{ categorySlug: "gift-cards", region: "Global", expectedRegion: "Australia" }], true),
      (error: unknown) => error instanceof Error && error.message === REGION_CHANGED_MESSAGE,
    );
    assert.throws(
      () => assertRegionCompatibilityConfirmed([{ categorySlug: "game-top-ups", region: "Global", expectedRegion: "Global" }], false),
      (error: unknown) => error instanceof Error && error.message === REGION_COMPATIBILITY_CONFIRMATION_REQUIRED_MESSAGE,
    );
  });

  test("server accepts a current confirmed region and leaves unrelated categories ungated", () => {
    assert.doesNotThrow(() =>
      assertRegionCompatibilityConfirmed([{ categorySlug: "gift-cards", region: "Global", expectedRegion: "Global" }], true),
    );
    assert.doesNotThrow(() =>
      assertRegionCompatibilityConfirmed([{ categorySlug: "software", region: "Australia", expectedRegion: "Australia" }], false),
    );
  });
});
