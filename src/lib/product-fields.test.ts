import { test } from "node:test";
import { strict as assert } from "node:assert";
import { requiredProductFields } from "./product-fields";

test("MT-0189 only the current product's required fields reach the order summary", () => {
  assert.deepEqual(requiredProductFields(["Player ID"], { "Player ID": "123456", "Zone ID": "789", Email: "buyer@example.test" }), { "Player ID": "123456" });
});
test("MT-0189 products without requirements carry no delivery fields", () => {
  assert.deepEqual(requiredProductFields([], { "Player ID": "123456" }), {});
});
test("MT-0189 missing required fields stay empty for existing validation", () => {
  assert.deepEqual(requiredProductFields(["Player ID", "Zone ID"], { "Player ID": "123456" }), { "Player ID": "123456", "Zone ID": "" });
});