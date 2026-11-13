import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { test } from "node:test";

const checklist = readFileSync(new URL("../../PRODUCT_LAUNCH_CHECKLIST.md", import.meta.url), "utf8");

test("product launch checklist covers every required launch gate", () => {
  for (const heading of [
    "Supplier identity and resale rights",
    "Region, platform and variant",
    "Source-backed price and margin",
    "Controlled end-to-end test order",
    "Policy and customer disclosures",
    "Support readiness and safe data handling",
    "Evidence ledger",
    "Decision and publication gate",
  ]) {
    assert.ok(checklist.includes(heading), "Missing launch gate: " + heading);
  }
});

test("checklist is not approved by default and requires owner sign-off", () => {
  assert.match(checklist, /Status: \*\*NOT ASSESSED\*\* \(default\)/);
  assert.match(checklist, /Only the owner can move the exact scope to APPROVED/);
  assert.doesNotMatch(checklist, /Status: \*\*APPROVED\*\* \(default\)/);
});

test("checklist forbids unsafe credentials and unauthorised test purchases", () => {
  assert.match(checklist, /never to request passwords, one-time codes, OTPs, 2FA codes, payment PINs, recovery codes, session tokens or private keys/i);
  assert.match(checklist, /does not authorise a purchase or test order/i);
  assert.match(checklist, /Never use a real customer's order as test data/);
});
