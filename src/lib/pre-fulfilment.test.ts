import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

import {
  ORDER_ITEM_SNAPSHOT_KEY,
  buildOrderItemFieldsSnapshot,
  getPreFulfilmentChecklist,
  hasReservedOrderItemField,
} from "./pre-fulfilment";

describe("MT-0122 pre-fulfilment order-item snapshot", () => {
  test("stores server-sourced region and required labels without changing customer values", () => {
    const fields = buildOrderItemFieldsSnapshot(
      { "Mobile Legends user ID": "123456", "Zone ID": "9988" },
      " Australia ",
      ["Mobile Legends user ID", "Zone ID", "Zone ID", " Delivery email address "],
    );

    assert.deepEqual(fields, {
      "Mobile Legends user ID": "123456",
      "Zone ID": "9988",
      [ORDER_ITEM_SNAPSHOT_KEY]: {
        version: 1,
        region: "Australia",
        requiredFields: ["Mobile Legends user ID", "Zone ID", "Delivery email address"],
      },
    });
  });

  test("rejects browser-supplied snapshot metadata and malformed product metadata", () => {
    assert.equal(hasReservedOrderItemField({ [ORDER_ITEM_SNAPSHOT_KEY]: "forged" }), true);
    assert.equal(hasReservedOrderItemField({ "Player ID": "123" }), false);
    assert.throws(
      () => buildOrderItemFieldsSnapshot({ [ORDER_ITEM_SNAPSHOT_KEY]: "forged" }, "Global", []),
      /Reserved order metadata/,
    );
    assert.throws(() => buildOrderItemFieldsSnapshot({}, null, []), /Product region/);
    assert.throws(() => buildOrderItemFieldsSnapshot({}, "Global", ["Player ID", 7]), /Product requirements/);
  });

  test("shows only order-time requirements and flags missing player, zone and email values", () => {
    const fields = buildOrderItemFieldsSnapshot(
      { "PUBG Mobile player ID": " 7654321 ", "Zone ID": "" },
      "Global",
      ["PUBG Mobile player ID", "Zone ID", "Server", "Delivery email address"],
    );
    const checklist = getPreFulfilmentChecklist(fields, "UC 325");

    assert.equal(checklist.snapshotStatus, "captured");
    assert.equal(checklist.region, "Global");
    assert.equal(checklist.selectedOption, "UC 325");
    assert.deepEqual(checklist.requiredFields, [
      { label: "PUBG Mobile player ID", value: "7654321", missing: false },
      { label: "Zone ID", value: "", missing: true },
      { label: "Server", value: "", missing: true },
      { label: "Delivery email address", value: "", missing: true },
    ]);
    assert.equal(checklist.missingRequiredCount, 3);
    assert.deepEqual(checklist.capturedFields, [["PUBG Mobile player ID", "7654321"], ["Zone ID", ""]]);
  });

  test("reports no missing fields when the saved product had no requirements", () => {
    const fields = buildOrderItemFieldsSnapshot({}, "Global", []);
    const checklist = getPreFulfilmentChecklist(fields, "1 Month");

    assert.equal(checklist.snapshotStatus, "captured");
    assert.equal(checklist.region, "Global");
    assert.equal(checklist.missingRequiredCount, 0);
    assert.deepEqual(checklist.requiredFields, []);
  });

  test("does not infer historical region or missing requirements from current catalog data", () => {
    const checklist = getPreFulfilmentChecklist({ "Delivery email address": "buyer@example.com" }, "AUD 100");

    assert.equal(checklist.snapshotStatus, "not_captured");
    assert.equal(checklist.region, null);
    assert.equal(checklist.selectedOption, "AUD 100");
    assert.equal(checklist.missingRequiredCount, null);
    assert.deepEqual(checklist.requiredFields, []);
    assert.deepEqual(checklist.capturedFields, [["Delivery email address", "buyer@example.com"]]);
  });

  test("treats unknown snapshot versions as unrecognised instead of silently trusting them", () => {
    const checklist = getPreFulfilmentChecklist({
      "Player ID": "123",
      [ORDER_ITEM_SNAPSHOT_KEY]: { version: 2, region: "Nepal", requiredFields: ["Player ID"] },
    }, "Top-up");

    assert.equal(checklist.snapshotStatus, "unrecognised");
    assert.equal(checklist.region, null);
    assert.equal(checklist.missingRequiredCount, null);
    assert.deepEqual(checklist.capturedFields, [["Player ID", "123"]]);
  });
});
