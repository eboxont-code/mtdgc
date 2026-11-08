import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { BRAND } from "./brand.ts";

describe("canonical MTDGC brand description", () => {
  test("matches the approved repository description and brand name", () => {
    assert.equal(BRAND.name, "MTDGC");
    assert.equal(BRAND.legalName, "Matrix Digital Goods & Commerce");
    assert.equal(BRAND.title, "MTDGC | Digital Goods & Commerce");
    assert.equal(
      BRAND.description,
      "Matrix Digital Goods & Commerce is a digital-goods storefront for game top-ups, gift cards, subscriptions and software.",
    );
    assert.equal(
      BRAND.imageAlt,
      "MTDGC, a digital-goods storefront for game top-ups, gift cards, subscriptions and software.",
    );
  });

  test("does not imply an active market, live availability or fulfilment promise", () => {
    assert.doesNotMatch(BRAND.description, /Nepal|Australia|available now|authori[sz]ed reseller|instant delivery/i);
  });
});
