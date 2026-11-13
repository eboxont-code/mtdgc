import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

import { restoreSupportIssueType, SUPPORT_ISSUE_TYPES } from "./support-issues";

describe("MT-0147 support ticket categories", () => {
  test("includes every required support category", () => {
    for (const category of [
      "Payment question",
      "Delayed delivery",
      "Invalid code",
      "Wrong item",
      "Refund request",
      "Account access",
    ]) {
      assert.ok((SUPPORT_ISSUE_TYPES as readonly string[]).includes(category), category);
    }
  });

  test("keeps the existing player-ID and general categories", () => {
    assert.ok(SUPPORT_ISSUE_TYPES.includes("Wrong player ID or UID"));
    assert.ok(SUPPORT_ISSUE_TYPES.includes("Something else"));
    assert.equal(new Set(SUPPORT_ISSUE_TYPES).size, SUPPORT_ISSUE_TYPES.length);
  });

  test("restores current saved choices unchanged", () => {
    assert.equal(restoreSupportIssueType("Invalid code"), "Invalid code");
    assert.equal(restoreSupportIssueType("Payment question"), "Payment question");
  });

  test("maps the previous delayed-order draft choice to the new category", () => {
    assert.equal(restoreSupportIssueType("Order not delivered"), "Delayed delivery");
  });

  test("falls back safely for missing or unknown saved values", () => {
    assert.equal(restoreSupportIssueType(null), SUPPORT_ISSUE_TYPES[0]);
    assert.equal(restoreSupportIssueType("Unknown category"), SUPPORT_ISSUE_TYPES[0]);
  });
});
