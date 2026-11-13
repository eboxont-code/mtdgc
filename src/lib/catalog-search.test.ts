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

const catalogueProduct = (
  name: string,
  options: {
    brand?: string;
    region?: string;
    tags?: string[];
    currency?: string;
    variantNames?: string[];
    variantCurrency?: string;
  } = {},
) => ({
  ...product(name, options.brand ?? name),
  region: options.region ?? "Global",
  tags: options.tags ?? [],
  currency: options.currency ?? "NPR",
  variants: (options.variantNames ?? ["100 Diamonds"]).map((variantName, index) => ({
    name: variantName,
    sku: `TEST-${index}`,
    status: "available",
    price_minor: 10000,
    currency: options.variantCurrency ?? "NPR",
  })),
});

describe("MT-0033 catalog search synonyms", () => {
  const aliases = [
    ["freefire", catalogueProduct("Free Fire Diamonds", { brand: "Garena", tags: ["free fire", "diamonds"] })],
    ["pubgmobileuc", catalogueProduct("PUBG Mobile UC", { brand: "Krafton", tags: ["pubg", "uc"], variantNames: ["60 UC"] })],
    ["mobilelegendsdiamonds", catalogueProduct("Mobile Legends Diamonds", { brand: "Moonton", tags: ["mobile legends", "mlbb", "diamonds"] })],
    ["clashofclans", catalogueProduct("Clash of Clans Passes", { brand: "Supercell", tags: ["clash of clans"], variantNames: ["Gold Pass"] })],
    ["valorantpoints", catalogueProduct("Valorant Points", { brand: "Riot Games", tags: ["valorant"], variantNames: ["475 VP"] })],
    ["robloxgiftcard", catalogueProduct("Roblox Gift Card", { brand: "Roblox", tags: ["robux", "gift card"], variantNames: ["USD 10 Card"] })],
    ["steamwalletcode", catalogueProduct("Steam Wallet Code", { brand: "Valve", tags: ["steam", "wallet", "gift card"], variantNames: ["USD 10 Wallet Code"] })],
    ["netflixsubscription", catalogueProduct("Netflix Subscription", { brand: "Netflix", region: "Nepal", tags: ["streaming", "subscription"], variantNames: ["1 Month Plan"] })],
    ["microsoft365", catalogueProduct("Microsoft 365", { brand: "Microsoft", tags: ["office", "onedrive"], variantNames: ["Personal, 12 months"] })],
    ["chatgptplus", catalogueProduct("ChatGPT Plus", { brand: "OpenAI", tags: ["chatgpt", "ai"], variantNames: ["1 month"] })],
    ["pubgm", catalogueProduct("PUBG Mobile UC", { brand: "Krafton", tags: ["pubg", "uc"], variantNames: ["60 UC"] })],
    ["UC", catalogueProduct("PUBG Mobile UC", { brand: "Krafton", tags: ["pubg", "uc"], variantNames: ["60 UC"] })],
    ["mlbb", catalogueProduct("Mobile Legends Diamonds", { brand: "Moonton", tags: ["mobile legends", "mlbb", "diamonds"], variantNames: ["Weekly Diamond Pass"] })],
    ["ml", catalogueProduct("Mobile Legends Diamonds", { brand: "Moonton", tags: ["mobile legends", "mlbb", "diamonds"] })],
    ["coc", catalogueProduct("Clash of Clans Passes", { brand: "Supercell", tags: ["clash of clans"], variantNames: ["Gold Pass", "Event Pass"] })],
    ["goldpass", catalogueProduct("Clash of Clans Passes", { brand: "Supercell", tags: ["clash of clans"], variantNames: ["Gold Pass", "Event Pass"] })],
    ["eventpass", catalogueProduct("Clash of Clans Passes", { brand: "Supercell", tags: ["clash of clans"], variantNames: ["Gold Pass", "Event Pass"] })],
    ["weeklypass", catalogueProduct("Mobile Legends Diamonds", { brand: "Moonton", tags: ["mobile legends", "mlbb", "diamonds"], variantNames: ["Weekly Diamond Pass"] })],
    ["vp", catalogueProduct("Valorant Points", { brand: "Riot Games", tags: ["valorant"], variantNames: ["475 VP"] })],
    ["robux", catalogueProduct("Roblox Gift Card", { brand: "Roblox", tags: ["robux", "gift card"], variantNames: ["USD 10 Card"] })],
    ["steamwallet", catalogueProduct("Steam Wallet Code", { brand: "Valve", tags: ["steam", "wallet", "gift card"], variantNames: ["USD 10 Wallet Code"] })],
    ["nfx", catalogueProduct("Netflix Subscription", { brand: "Netflix", region: "Nepal", tags: ["streaming", "subscription"], variantNames: ["1 Month Plan"] })],
    ["disneyplus", catalogueProduct("Disney+ Hotstar", { brand: "Disney", tags: ["hotstar", "streaming"], variantNames: ["3 months"] })],
    ["m365", catalogueProduct("Microsoft 365", { brand: "Microsoft", tags: ["office", "onedrive"], variantNames: ["Personal, 12 months"] })],
    ["gpt", catalogueProduct("ChatGPT Plus", { brand: "OpenAI", tags: ["chatgpt", "ai"], variantNames: ["1 month"] })],
    ["ytpremium", catalogueProduct("YouTube Premium", { brand: "Google", tags: ["youtube", "streaming"], variantNames: ["1 month"] })],
    ["googleone", catalogueProduct("Google One 100 GB", { brand: "Google", tags: ["google one", "cloud storage"], variantNames: ["12 months"] })],
    ["adobecc", catalogueProduct("Adobe Creative Cloud", { brand: "Adobe", tags: ["photoshop", "illustrator"], variantNames: ["1 month"] })],
    ["capcutpro", catalogueProduct("CapCut Pro", { brand: "ByteDance", tags: ["capcut", "video editing"], variantNames: ["1 month"] })],
  ] as const;

  for (const [query, item] of aliases) {
    test(`${query} finds its current catalogue product`, () => {
      assert.ok(searchScore(item, query) > 0);
    });
  }

  test("keeps game-currency aliases scoped to the matching product", () => {
    assert.equal(searchScore(catalogueProduct("Free Fire Diamonds"), "UC"), 0);
  });

  test("supports regional abbreviations and currency codes", () => {
    const australia = catalogueProduct("Amart Furniture Gift Card (Australia)", {
      region: "Australia",
      tags: ["australian gift cards", "gift card", "australia"],
      currency: "AUD",
      variantNames: [],
    });
    const nepal = catalogueProduct("Netflix Subscription", { region: "Nepal", currency: "NPR" });

    assert.ok(searchScore(australia, "AUS") > 0);
    assert.ok(searchScore(nepal, "NP") > 0);
    assert.ok(searchScore(australia, "AUD") > 0);
    assert.ok(searchScore(nepal, "NPR") > 0);
  });

  test("normalizes common spacing and regional spelling variants", () => {
    const windows = catalogueProduct("Windows 11 Pro", { brand: "Microsoft", tags: ["windows", "licence key"] });
    const freeFire = catalogueProduct("Free Fire Diamonds", { tags: ["top up"] });
    const roblox = catalogueProduct("Roblox Gift Card", { tags: ["robux", "gift card"] });

    assert.ok(searchScore(windows, "license key") > 0);
    assert.ok(searchScore(windows, "licenses") > 0);
    assert.ok(searchScore(freeFire, "topup") > 0);
    assert.ok(searchScore(roblox, "giftcard") > 0);
    assert.ok(searchScore(roblox, "giftcards") > 0);
  });
});
