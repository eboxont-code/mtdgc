import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { GIFT_CARD_PRICE_DISCLOSURE, isGiftCardCategory } from "./gift-card-pricing";

describe("gift card price presentation", () => {
  test("recognises only the gift-card category", () => {
    assert.equal(isGiftCardCategory("gift-cards"), true);
    assert.equal(isGiftCardCategory("game-top-ups"), false);
    assert.equal(isGiftCardCategory(null), false);
    assert.equal(isGiftCardCategory(undefined), false);
  });

  test("discloses face value, MTDGC selling price and separate provider charges", () => {
    assert.match(GIFT_CARD_PRICE_DISCLOSURE, /face value/i);
    assert.match(GIFT_CARD_PRICE_DISCLOSURE, /selling price/i);
    assert.match(GIFT_CARD_PRICE_DISCLOSURE, /bank or payment provider/i);
  });
});
