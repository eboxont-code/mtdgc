import { test } from "node:test";
import { strict as assert } from "node:assert";
import { countSupportCategories, supportTicketsPer100Orders } from "./support-metrics.ts";

test("MT-0226 counts every recorded issue category and sorts by frequency", () => {
  assert.deepEqual(
    countSupportCategories([
      { issue_type: "Payment question" },
      { issue_type: "Order not delivered" },
      { issue_type: "Payment question" },
      { issue_type: "Refund request" },
      { issue_type: "Order not delivered" },
    ]),
    [
      { category: "Order not delivered", count: 2 },
      { category: "Payment question", count: 2 },
      { category: "Refund request", count: 1 },
    ],
  );
});

test("MT-0226 trims category labels and keeps missing labels visible", () => {
  assert.deepEqual(
    countSupportCategories([
      { issue_type: " Payment question " },
      { issue_type: "" },
      { issue_type: "   " },
      { issue_type: null },
    ]),
    [
      { category: "Uncategorised", count: 3 },
      { category: "Payment question", count: 1 },
    ],
  );
});

test("MT-0226 returns an empty category list when no support tickets exist", () => {
  assert.deepEqual(countSupportCategories([]), []);
});

test("MT-0226 calculates support tickets per 100 orders to one decimal place", () => {
  assert.equal(supportTicketsPer100Orders(2, 8), 25);
  assert.equal(supportTicketsPer100Orders(1, 3), 33.3);
  assert.equal(supportTicketsPer100Orders(0, 8), 0);
});

test("MT-0226 does not invent a rate when the order denominator is zero or counts are invalid", () => {
  assert.equal(supportTicketsPer100Orders(0, 0), null);
  assert.equal(supportTicketsPer100Orders(1, 0), null);
  assert.equal(supportTicketsPer100Orders(-1, 8), null);
  assert.equal(supportTicketsPer100Orders(1.5, 8), null);
  assert.equal(supportTicketsPer100Orders(1, Number.POSITIVE_INFINITY), null);
});
