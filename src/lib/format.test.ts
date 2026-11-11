import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { AVAILABILITY_LABEL, ORDER_STEPS, categoryTypeFromSlug, durationLabel, orderStepIndex, percentOff } from "./format";

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

describe("MT-0102 customer order milestones", () => {
  test("maps current and legacy order statuses to the observed four-step progress display", () => {
    assert.equal(orderStepIndex("payment_submitted"), 0);
    assert.equal(orderStepIndex("paid"), 0);
    assert.equal(orderStepIndex("verified"), 1);
    assert.equal(orderStepIndex("processing"), 2);
    assert.equal(orderStepIndex("delivered"), 3);
    assert.equal(orderStepIndex("fulfilled"), 3);
    assert.equal(orderStepIndex("completed"), 3);
    assert.equal(orderStepIndex("pending_payment"), -1);
  });

  test("explains manual proof review and staff status markers without claiming settlement or redemption", () => {
    assert.match(ORDER_STEPS[0].body, /reviewed manually/i);
    assert.match(ORDER_STEPS[0].body, /do not independently confirm/i);
    assert.match(ORDER_STEPS[1].body, /manual staff decision/i);
    assert.match(ORDER_STEPS[1].body, /not an automated bank or payment-provider settlement check/i);
    assert.match(ORDER_STEPS[2].body, /does not confirm supplier acceptance or delivery/i);
    assert.match(ORDER_STEPS[3].body, /does not confirm redemption or successful use/i);
  });
});