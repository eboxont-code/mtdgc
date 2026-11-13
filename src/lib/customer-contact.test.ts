import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

import { validateCheckoutContact } from "./customer-contact";

const valid = (name: string, phone = "", email = "") =>
  validateCheckoutContact({ name, phone, email });

describe("Nepal and Australia checkout contact validation", () => {
  test("accepts Nepali Unicode names and Nepal phone formats", () => {
    assert.deepEqual(valid("रामबहादुर श्रेष्ठ", "+977 984-123-4567"), {});
    assert.deepEqual(valid("Sita Sharma", "9841234567"), {});
  });

  test("accepts Australian national and international phone formats", () => {
    assert.deepEqual(valid("Aarav Rai", "0412 345 678"), {});
    assert.deepEqual(valid("Maya Rai", "+61 412 345 678"), {});
    assert.deepEqual(valid("Maya Rai", "+61 (0) 412 345 678"), {});
  });

  test("accepts email-only and phone-only contact methods", () => {
    assert.deepEqual(valid("Maya Rai", "", " maya@example.com "), {});
    assert.deepEqual(valid("Maya Rai", "+977 984-123-4567", ""), {});
  });

  test("requires a name and at least one contact method", () => {
    assert.equal(valid("   ", "", "").name, "Please add your full name.");
    assert.equal(
      valid("Maya Rai", "", "").phone,
      "Add a mobile number or an email so we can reach you.",
    );
  });

  test("rejects malformed email and phone digit counts", () => {
    assert.equal(valid("Maya Rai", "123456", "").phone, "Mobile number must have 7 to 15 digits.");
    assert.equal(
      valid("Maya Rai", "1234567890123456", "").phone,
      "Mobile number must have 7 to 15 digits.",
    );
    assert.equal(valid("Maya Rai", "", "not-an-email").email, "That email address does not look right.");
  });

  test("matches the existing server length limits", () => {
    assert.deepEqual(valid("क".repeat(80), "9841234567", ""), {});
    assert.equal(
      valid("क".repeat(81), "9841234567", "").name,
      "Full name must be 80 characters or fewer.",
    );
    assert.equal(
      valid("Maya Rai", "1".repeat(25), "").phone,
      "Mobile number must be 24 characters or fewer.",
    );
    const overlongEmail = "a@" + "a".repeat(60) + "." + "b".repeat(54) + ".com";
    assert.equal(
      valid("Maya Rai", "", overlongEmail).email,
      "Email address must be 120 characters or fewer.",
    );
  });
});
