import { readFileSync } from "node:fs";
import { strict as assert } from "node:assert";
import { describe, test } from "node:test";

import { BRAND_DESCRIPTION, BRAND_FULL_NAME, BRAND_NAME, RESELLER_NOTICE } from "./brand";
import { formatAudGuide, NPR_PER_AUD_GUIDE, publicDeliveryMethod, publicDeliveryTime } from "./format";
import { LANDINGS } from "./landings";
import { reviewStructuredData } from "./reviews";

const BANNED = /emerging|startup|small-scale|recently established|request to buy|by hand|official partner|authorised partner|authorized partner|backed by|last updated \d/i;

describe("brand copy", () => {
  test("uses the repo's full name and avoids apologetic or partnership claims", () => {
    assert.equal(BRAND_NAME, "MTDGC");
    assert.equal(BRAND_FULL_NAME, "Matrix Digital Goods & Commerce");
    const copy = [BRAND_DESCRIPTION, RESELLER_NOTICE, ...LANDINGS.flatMap((landing) => [landing.title, landing.description, landing.h1, ...landing.paragraphs, ...landing.steps.flatMap((step) => [step.title, step.body]), ...landing.faqs.flatMap((faq) => [faq.q, faq.a])])].join("\n");
    assert.equal(BANNED.test(copy), false);
    assert.match(RESELLER_NOTICE, /independent reseller/i);
    assert.match(RESELLER_NOTICE, /trademarks belong to their owners/i);
  });

  test("customer pages do not publish policy dates or a request-to-buy line", () => {
    const files = [
      "src/routes/about.tsx",
      "src/routes/index.tsx",
      "src/routes/how-it-works.tsx",
      "src/routes/policies/terms.tsx",
      "src/routes/policies/delivery.tsx",
      "src/routes/policies/privacy.tsx",
      "src/routes/policies/refunds.tsx",
    ];
    for (const file of files) {
      const source = readFileSync(new URL(`../../${file}`, import.meta.url), "utf8");
      assert.equal(BANNED.test(source), false, file);
    }
  });
});

describe("AUD guide", () => {
  test("converts NPR minor units without replacing the NPR amount", () => {
    assert.equal(formatAudGuide(NPR_PER_AUD_GUIDE * 100), "≈ A$1.00 guide");
    assert.equal(formatAudGuide(0), null);
    assert.equal(formatAudGuide(-1), null);
  });

  test("replaces placeholder delivery copy", () => {
    assert.equal(publicDeliveryTime("Confirmed after order review"), "Delivered after payment is verified");
    assert.equal(publicDeliveryTime("Usually within a few hours"), "Usually within a few hours");
    assert.equal(publicDeliveryMethod("Manual digital fulfilment"), "Digital delivery after payment is verified");
  });
});

describe("reviews stay unpublished until real rows exist", () => {
  test("empty and blank reviews produce no structured data", () => {
    assert.equal(reviewStructuredData([]), null);
    assert.equal(reviewStructuredData(undefined), null);
    assert.equal(reviewStructuredData([{ id: "1", rating: 5, body: "  ", created_at: "2026-11-01T00:00:00.000Z", is_verified_purchase: true }]), null);
  });

  test("approved reviews produce an aggregate from those rows only", () => {
    const data = reviewStructuredData([
      { id: "1", rating: 5, body: "Fast top-up", created_at: "2026-11-01T00:00:00.000Z", is_verified_purchase: true },
      { id: "2", rating: 3, body: "Code arrived", created_at: "2026-11-02T00:00:00.000Z", is_verified_purchase: false },
    ]);
    assert.equal(data?.aggregateRating.reviewCount, 2);
    assert.equal(data?.aggregateRating.ratingValue, "4.0");
    assert.equal(data?.review.length, 2);
  });
});
