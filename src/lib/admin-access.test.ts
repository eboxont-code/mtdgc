import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

import { isAdminRoleConfirmed } from "./admin-access";

describe("MT-0085 administrator payment-proof access gate", () => {
  test("only a successful exact true role result grants administrator access", () => {
    assert.equal(isAdminRoleConfirmed(true, null), true);
    assert.equal(isAdminRoleConfirmed(false, null), false);
    assert.equal(isAdminRoleConfirmed(null, null), false);
    assert.equal(isAdminRoleConfirmed(undefined, null), false);
    assert.equal(isAdminRoleConfirmed("true", null), false);
  });

  test("an RPC error denies access even if its data field is true", () => {
    assert.equal(isAdminRoleConfirmed(true, new Error("role lookup failed")), false);
  });

  test("a missing error value does not make an ambiguous role result valid", () => {
    assert.equal(isAdminRoleConfirmed(1, undefined), false);
    assert.equal(isAdminRoleConfirmed({}, undefined), false);
  });
});
