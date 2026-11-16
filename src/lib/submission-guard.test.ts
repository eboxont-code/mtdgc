import { test } from "node:test";
import { strict as assert } from "node:assert";
import { createSubmissionGuard } from "./submission-guard";

test("duplicate submission cannot enter while the first request is pending", () => {
  const guard = createSubmissionGuard();
  assert.equal(guard.begin(), true);
  assert.equal(guard.begin(), false);
  assert.equal(guard.pending(), true);
  guard.end();
  assert.equal(guard.pending(), false);
  assert.equal(guard.begin(), true);
});