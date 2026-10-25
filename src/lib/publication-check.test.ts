import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { publicationBlockReason } from "./publication-check";

const ready = { name: "Product", summary: "Summary", description: "Description" };
describe("F11 publication safeguards", () => {
  test("blocks DRAFT names and summary prefixes", () => {
    assert.ok(publicationBlockReason({ ...ready, name: "DRAFT Product" }, []));
    assert.ok(publicationBlockReason({ ...ready, summary: "draft Summary" }, []));
  });
  test("blocks unfinished content in either descriptive field", () => {
    for (const marker of ["DRAFT", "TODO", "lorem", "editor's note"]) {
      assert.ok(publicationBlockReason({ ...ready, summary: `Text ${marker}` }, []));
      assert.ok(publicationBlockReason({ ...ready, description: `Text ${marker}` }, []));
    }
  });
  test("zero-priced active options block publishing but archived options do not", () => {
    assert.ok(publicationBlockReason(ready, [{ status: "coming_soon", price_minor: 0 }]));
    assert.equal(publicationBlockReason(ready, [{ status: "archived", price_minor: 0 }]), null);
    assert.equal(publicationBlockReason(ready, [{ status: "available", price_minor: 100 }]), null);
  });
});