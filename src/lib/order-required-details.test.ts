import { test } from "node:test";
import { strict as assert } from "node:assert";
import { assertRequiredOrderDetails } from "./order-required-details";

test("current required player, zone and server identifiers reject missing and malformed values", () => {
  for (const label of ["Player ID", "Zone ID", "Server"]) {
    assert.throws(() => assertRequiredOrderDetails([label], {}), new RegExp(label));
    assert.throws(() => assertRequiredOrderDetails([label], { [label]: "<invalid>" }));
  }
  assert.throws(() => assertRequiredOrderDetails(["Player ID"], { "Player ID": "abc" }));
  assert.doesNotThrow(() => assertRequiredOrderDetails(["Player ID", "Zone ID", "Server"], { "Player ID": "123", "Zone ID": "12", Server: "Asia 1" }));
});
test("recipient email and region must be supplied only when required by the listing", () => {
  assert.throws(() => assertRequiredOrderDetails(["Recipient email"], { "Recipient email": "bad@" }));
  assert.throws(() => assertRequiredOrderDetails(["Region"], { Region: "  " }));
  assert.doesNotThrow(() => assertRequiredOrderDetails(["Recipient email", "Region"], { "Recipient email": "buyer@example.com", Region: "Nepal" }));
  assert.doesNotThrow(() => assertRequiredOrderDetails([], {}));
});
test("unsafe or malformed listing requirements fail closed", () => {
  assert.throws(() => assertRequiredOrderDetails(["Password"], { Password: "123" }));
  assert.throws(() => assertRequiredOrderDetails(null, {}));
});