import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { catalogFacetOptions, compareCatalogProducts, matchesCatalogFacets, searchScore } from "./catalog-search";

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

describe("MT-0034 catalog platform and region filters", () => {
  const products = [
    { ...product("Free Fire"), platform: "Mobile", region: "Global" },
    { ...product("PUBG"), platform: "PC", region: "Australia" },
    { ...product("Netflix"), platform: " Web and mobile ", region: "Nepal" },
    { ...product("PC gift"), platform: "pc", region: "Global" },
    { ...product("Unknown platform"), platform: null, region: "Global" },
    { ...product("Blank platform"), platform: "   ", region: "   " },
  ];

  test("platform choices are derived, trimmed, deduplicated and sorted", () => {
    assert.deepEqual(catalogFacetOptions(products, "platform"), ["Mobile", "PC", "Web and mobile"]);
  });

  test("region choices include only real non-empty catalogue values", () => {
    assert.deepEqual(catalogFacetOptions(products, "region"), ["Australia", "Global", "Nepal"]);
  });

  test("platform and region filters combine without changing other products", () => {
    assert.equal(matchesCatalogFacets(products[1], { platform: "PC", region: "Australia" }), true);
    assert.equal(matchesCatalogFacets(products[0], { platform: "PC", region: "Australia" }), false);
    assert.equal(matchesCatalogFacets(products[0], { platform: "Mobile", region: "Global" }), true);
  });

  test("matching ignores surrounding whitespace and letter case", () => {
    assert.equal(matchesCatalogFacets(products[1], { platform: " pc ", region: "australia" }), true);
  });

  test("All keeps products with an empty platform visible", () => {
    assert.equal(matchesCatalogFacets(products[4], { platform: "all", region: "Global" }), true);
    assert.equal(matchesCatalogFacets(products[4], { platform: "Mobile", region: "Global" }), false);
  });
});
