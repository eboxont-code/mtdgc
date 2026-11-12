import { readFileSync } from "node:fs";
import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

const orders = readFileSync(new URL("./orders.functions.ts", import.meta.url), "utf8");
const admin = readFileSync(new URL("./admin.functions.ts", import.meta.url), "utf8");
const panel = readFileSync(new URL("../components/admin/order-detail-panel.tsx", import.meta.url), "utf8");
const customerOrder = readFileSync(new URL("../routes/order.$orderNumber.tsx", import.meta.url), "utf8");
const tracking = readFileSync(new URL("../routes/track-order.tsx", import.meta.url), "utf8");

function section(source: string, start: string, end: string): string {
  const from = source.indexOf(start);
  assert.notEqual(from, -1, "missing source section: " + start);
  const to = source.indexOf(end, from + start.length);
  assert.notEqual(to, -1, "missing source boundary: " + end);
  return source.slice(from, to);
}

describe("MT-0109 internal order-note privacy boundary", () => {
  test("guest tracking returns only event status and timestamp", () => {
    const lookup = section(orders, "export const lookupOrder", "export const listMyOrders");
    assert.match(lookup, /order_status_events\(status, created_at\)/);
    assert.doesNotMatch(lookup, /order_status_events\([^)]*\b(?:note|created_by)\b/);
    assert.match(lookup, /events:\s*\(order\.order_status_events\s*\?\?\s*\[\]\)\.map\(\(e\) => \(\{ status: e\.status, at: e\.created_at \}\)\)/);
  });

  test("signed-in order history returns only event status and timestamp", () => {
    const list = section(orders, "export const listMyOrders", "export const getOrderForViewer");
    assert.match(list, /order_status_events\(status, created_at\)/);
    assert.doesNotMatch(list, /order_status_events\([^)]*\b(?:note|created_by)\b/);
    assert.match(list, /events:\s*\(o\.order_status_events\s*\?\?\s*\[\]\)\.map\(\(e\) => \(\{ status: e\.status, at: e\.created_at \}\)\)/);
  });

  test("single-order customer viewer does not fetch or return staff notes", () => {
    const viewer = section(orders, "export const getOrderForViewer", "export const getPaymentSettings");
    assert.doesNotMatch(viewer, /order_status_events|created_by|event\.note/);
  });

  test("staff note writes authenticate and authorize before inserting the note", () => {
    const addNote = section(admin, "export const addOrderNote", "export const approveReview");
    assert.match(addNote, /\.middleware\(\[requireSupabaseAuth\]\)/);
    const guard = addNote.indexOf("await assertAdmin(context as Ctx)");
    const insert = addNote.indexOf('.from("order_status_events").insert');
    assert.ok(guard >= 0 && insert > guard, "admin guard must run before the note insert");
    assert.match(addNote, /note: data\.note/);
    assert.match(addNote, /created_by: context\.userId/);
  });

  test("the administrator panel reads and displays notes while customer pages do not", () => {
    assert.match(panel, /order_status_events\(id, status, note, created_at\)/);
    assert.match(panel, /event\.note/);
    assert.doesNotMatch(customerOrder, /order_status_events|event\.note/);
    assert.doesNotMatch(tracking, /event\.note|order_status_events\([^)]*\bnote\b/);
  });
});
