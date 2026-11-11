import { strict as assert } from "node:assert";
import { describe, test } from "node:test";
import { categoryListingSeo, listingCanonical, productListingSeo } from "./listing-seo";

describe("listing metadata identity", () => {
  test("product identities and saved restrictions produce distinct metadata", () => {
    const base = { slug: "code-a", name: "Code A", category: { name: "Gift cards" } };
    const first = productListingSeo({ ...base, region: "Region A", platform: "Platform A" });
    const second = productListingSeo({ ...base, slug: "code-b", name: "Code B" });
    assert.notEqual(first.title, second.title);
    assert.notEqual(first.description, second.description);
    for (const value of [base.name, base.category.name, "Region A", "Platform A"]) {
      assert.ok(first.title.includes(value));
      assert.ok(first.description.includes(value));
    }
  });

  test("missing and whitespace-only fields fall back to saved slugs without missing-value leakage", () => {
    const first = productListingSeo({ slug: "product-a", name: "  ", region: null });
    const second = productListingSeo({ slug: "product-b", platform: "  " });
    assert.notEqual(first.title, second.title);
    assert.notEqual(first.description, second.description);
    assert.ok(first.title.includes("product a"));
    assert.ok(first.description.length > 0);
    assert.ok(!/undefined|null/.test(first.description));
    const empty = productListingSeo({ slug: "" });
    assert.ok(empty.title.length > 0);
    assert.ok(empty.description.length > 0);
  });

  test("category descriptions stay unique even with shared or empty descriptions", () => {
    for (const description of ["Shared listing details.", "", null]) {
      const first = categoryListingSeo({ slug: "category-a", name: "Category A", description });
      const second = categoryListingSeo({ slug: "category-b", name: "Category B", description });
      assert.notEqual(first.title, second.title);
      assert.notEqual(first.description, second.description);
      if (description) assert.ok(first.description.includes(description));
    }
    assert.ok(categoryListingSeo({ slug: "category-a", name: " " }).title.includes("category a"));
  });

  test("canonical URLs exclude filter, sort, plan and fragment state", () => {
    assert.equal(listingCanonical("products", "free-fire?plan=FF-115&sort=price#options"), "https://mtdgc.com/products/free-fire");
    assert.equal(listingCanonical("categories", "gift-cards?sort=price&region=AU"), "https://mtdgc.com/categories/gift-cards");
  });
});