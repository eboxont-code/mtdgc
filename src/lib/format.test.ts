import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { AVAILABILITY_LABEL, categoryTypeFromSlug, durationLabel, percentOff } from "./format";

describe("F7 catalog helpers", () => {
  test("formats months and complete years", () => {
    assert.equal(durationLabel(1), "1 month");
    assert.equal(durationLabel(3), "3 months");
    assert.equal(durationLabel(12), "1 year");
    assert.equal(durationLabel(0), null);
  });
  test("rounds savings down and rejects invalid compare-at prices", () => {
    assert.equal(percentOff(667, 1000), 33);
    assert.equal(percentOff(1000, 1000), null);
    assert.equal(percentOff(1000, null), null);
    assert.equal(percentOff(0, 1000), null);
  });
  test("limits availability to the two orderable statuses", () => {
    assert.equal(AVAILABILITY_LABEL["available"], "Available");
    assert.equal(AVAILABILITY_LABEL["low_stock"], "Limited");
    assert.equal(AVAILABILITY_LABEL["coming_soon"], "Unavailable");
    assert.equal(AVAILABILITY_LABEL["unknown"], "Unavailable");
  });
  test("maps existing category slugs without guessing other types", () => {
    assert.equal(categoryTypeFromSlug("software"), "software");
    assert.equal(categoryTypeFromSlug("subscriptions"), "subscription");
    assert.equal(categoryTypeFromSlug("gift-cards"), "gift_card");
    assert.equal(categoryTypeFromSlug("game-top-ups"), "game_top_up");
    assert.equal(categoryTypeFromSlug("deals"), null);
  });
});