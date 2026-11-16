import { expect, test } from "bun:test";
import { createSubmissionGuard } from "./submission-guard";

test("duplicate submission cannot enter while the first request is pending", () => {
  const guard = createSubmissionGuard();
  expect(guard.begin()).toBe(true);
  expect(guard.begin()).toBe(false);
  expect(guard.pending()).toBe(true);
  guard.end();
  expect(guard.pending()).toBe(false);
  expect(guard.begin()).toBe(true);
});