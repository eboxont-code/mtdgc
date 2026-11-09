import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

import {
  REGION_CHANGED_MESSAGE,
  REGION_COMPATIBILITY_CONFIRMATION_REQUIRED_MESSAGE,
  REGION_NOT_LISTED_MESSAGE,
  assertRegionCompatibilityConfirmed,
  getRegionCompatibilityWarning,
  isRegionSensitiveCategory,
  requiresRegionCompatibilityConfirmation,
} from "./region-compatibility";

describe("MT-0144 region compatibility warnings before payment", () => {
  test("applies the check to top-ups and gift cards, not unrelated categories", () => {
    assert.equal(isRegionSensitiveCategory("game-top-ups"), true);
    assert.equal(isRegionSensitiveCategory("gift-cards"), true);
    assert.equal(isRegionSensitiveCategory("software"), false);
    assert.equal(requiresRegionCompatibilityConfirmation([{ categorySlug: "game-top-ups", region: "Global" }]), true);
    assert.equal(requiresRegionCompatibilityConfirmation([{ categorySlug: "gift-cards", region: "Australia" }]), true);
    assert.equal(requiresRegionCompatibilityConfirmation([{ categorySlug: "software", region: "Australia" }]), false);
  });

  test("conservatively prompts legacy cart lines with region or delivery fields but no category", () => {
    assert.equal(requiresRegionCompatibilityConfirmation([{ region: "Global" }]), true);
    assert.equal(requiresRegionCompatibilityConfirmation([{ fields: { "Player ID": "12345" } }]), true);
    assert.equal(requiresRegionCompatibilityConfirmation([{ fields: {} }]), false);
    assert.equal(requiresRegionCompatibilityConfirmation([{ region: 123 }]), false);
  });

  test("warns that Global is a catalogue label, not issuer compatibility evidence", () => {
    const warning = getRegionCompatibilityWarning("Global");
    assert.match(warning, /catalogue label/i);
    assert.match(warning, /not a guarantee/i);
    assert.match(warning, /issuer's current redemption rules/i);
  });

  test("describes a specific listed region without claiming verified redemption", () => {
    const warning = getRegionCompatibilityWarning("Australia");
    assert.match(warning, /marked Australia/i);
    assert.match(warning, /not independent issuer verification/i);
    assert.match(warning, /If you cannot confirm compatibility, do not pay/i);
  });

  test("tells customers not to pay when no redemption region is listed", () => {
    assert.match(getRegionCompatibilityWarning(""), /Do not pay/i);
    assert.match(getRegionCompatibilityWarning(null), /region compatibility/i);
  });

  test("rejects missing region, stale cart region and missing acknowledgement", () => {
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

  test("accepts a current confirmed region and leaves unrelated categories ungated", () => {
    assert.doesNotThrow(() =>
      assertRegionCompatibilityConfirmed([{ categorySlug: "gift-cards", region: "Global", expectedRegion: "Global" }], true),
    );
    assert.doesNotThrow(() =>
      assertRegionCompatibilityConfirmed([{ categorySlug: "software", region: "Australia", expectedRegion: "Australia" }], false),
    );
  });

  test("normalises Unicode and whitespace before comparing saved and current regions", () => {
    assert.doesNotThrow(() =>
      assertRegionCompatibilityConfirmed([{ categorySlug: "game-top-ups", region: "Global", expectedRegion: "  ＧＬＯＢＡＬ  " }], true),
    );
  });
});
