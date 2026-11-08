import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { compareCatalogProducts, searchScore } from "./catalog-search";

const product = (name: string, brand = name) => ({
  name, brand, summary: "", region: "Nepal", platform: "Android", category: { name: "Game top-ups" }, tags: [], currency: "NPR",
  variants: [{ name: "100 Diamonds", sku: "PACK-100", status: "available", price_minor: 10000, currency: "NPR" }],
  slug: "real-product", status: "available", featured_rank: null, created_at: "2026-11-07",
});

describe("MT-0185 catalog matching", () => {
  for (const [query, name] of [["FF", "Free Fire"], ["PUBG", "PUBG Mobile"], ["ML", "Mobile Legends"], ["MLBB", "Mobile Legends"], ["NFX", "Netflix"]] as const) {
    test(`${query} matches ${name}`, () => {
      assert.ok(searchScore(product(name), query) > 0);
      assert.equal(searchScore(product("Unrelated"), query), 0);
    });
  }
  test("matches brand, game and denomination across fields", () => {
    assert.ok(searchScore(product("Diamond pack", "Free Fire"), "FF 100 diamonds") > 0);
    assert.equal(searchScore(product("Free Fire"), "FF 200"), 0);
    assert.ok(searchScore({ ...product("Wallet"), variants: [{ name: "AUD 1,000", sku: "AUD", status: "available", price_minor: 10000, currency: "NPR" }] }, "1000") > 0);
  });
  test("archived denominations are not search results", () => {
    assert.equal(searchScore({ ...product("Free Fire"), variants: [{ name: "999 Diamonds", sku: "OLD", status: "archived", price_minor: 10000, currency: "NPR" }] }, "999"), 0);
  });
});

describe("MT-0186 catalog sorting", () => {
  const cheap = product("Free Fire");
  const expensive = { ...product("PUBG"), variants: [{ name: "200 UC", sku: "PUBG-200", status: "available", price_minor: 20000, currency: "NPR" }] };
  const hidden = { ...product("Gift card"), slug: "sample-gift", status: "coming_soon" };
  const price = (p: typeof cheap) => p.slug.startsWith("sample-") ? null : p.variants[0]?.price_minor ?? null;
  test("price low-high orders visible prices and leaves hidden prices last", () => {
    assert.deepEqual([hidden, expensive, cheap].sort((a, b) => compareCatalogProducts(a, b, "price-asc", "", price)), [cheap, expensive, hidden]);
  });
  test("price high-low orders visible prices and leaves hidden prices last", () => {
    assert.deepEqual([hidden, cheap, expensive].sort((a, b) => compareCatalogProducts(a, b, "price-desc", "", price)), [expensive, cheap, hidden]);
  });
  test("availability puts purchasable listings first", () => {
    assert.deepEqual([hidden, cheap].sort((a, b) => compareCatalogProducts(a, b, "availability", "", price)), [cheap, hidden]);
  });
  test("relevance prioritizes title and brand over summary", () => {
    const incidental = { ...product("Other"), summary: "Free Fire" };
    assert.ok(compareCatalogProducts(cheap, incidental, "relevance", "FF", price) < 0);
  });
});