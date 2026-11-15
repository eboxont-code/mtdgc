import { test } from "node:test";
import { strict as assert } from "node:assert";
import { dashboardMetrics, matchesDashboardFilter, sortFulfilmentQueue, OVERDUE_THRESHOLD_MS, type DashboardOrder } from "./order-dashboard";
const base: DashboardOrder = { id: "a", order_number: "test-a", status: "verified", total_minor: 100, created_at: "2026-11-15T00:00:00Z", verifiedAt: "2026-11-15T01:00:00Z", events: [], topUp: false };
test("dashboard rates use existing statuses and evidence of failure after verification", () => {
  const metrics = dashboardMetrics([
    { ...base, status: "delivered", events: [{ status: "delivered", created_at: "2026-11-15T03:00:00Z" }] },
    { ...base, id: "b", status: "failed", events: [{ status: "failed", created_at: "2026-11-15T02:00:00Z" }] },
    { ...base, id: "c", status: "refunded", verifiedAt: null },
    { ...base, id: "d", status: "failed", verifiedAt: null },
  ]);
  assert.equal(metrics.completionRate, 25);
  assert.equal(metrics.failedFulfilmentRate, 50);
  assert.equal(metrics.refundRate, 25);
  assert.equal(metrics.verificationMedianMs, 3600000);
  assert.equal(metrics.deliveryMedianMs, 7200000);
});
test("missing timestamps and empty counts never generate invented durations or rates", () => {
  const empty = dashboardMetrics([]);
  assert.equal(empty.completionRate, null);
  assert.equal(empty.failedFulfilmentRate, null);
  assert.equal(empty.refundRate, null);
  assert.equal(empty.verificationMedianMs, null);
  assert.equal(empty.deliveryMedianMs, null);
  assert.equal(dashboardMetrics([{ ...base, verifiedAt: null }]).verificationMedianMs, null);
});
test("queue puts paid or verified orders first then oldest waiting, with top-up ties flagged", () => {
  const queue = sortFulfilmentQueue([{ ...base, id: "processing", status: "processing" }, { ...base, id: "new", created_at: "2026-11-15T00:30:00Z" }, { ...base, id: "older" }, { ...base, id: "risk", topUp: true }, { ...base, id: "done", status: "delivered" }]);
  assert.deepEqual(queue.map((order) => order.id), ["risk", "older", "new", "processing"]);
});
test("filters distinguish statuses and do not invent overdue thresholds", () => {
  assert.equal(matchesDashboardFilter(base, "Paid"), true);
  assert.equal(matchesDashboardFilter({ ...base, status: "payment_submitted" }, "Awaiting verification"), true);
  assert.equal(matchesDashboardFilter({ ...base, status: "completed" }, "Delivered"), true);
  assert.equal(matchesDashboardFilter(base, "Overdue"), false);
  assert.equal(OVERDUE_THRESHOLD_MS, null);
});