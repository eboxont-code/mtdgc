import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

import { customerContactFields, hasCustomerContact } from "./customer-contact-schema";

describe("server checkout contact schema", () => {
  test("accepts Nepali Unicode names and Nepal phone formats", () => {
    assert.equal(
      customerContactFields.safeParse({
        name: "रामबहादुर श्रेष्ठ",
        phone: "+977 984-123-4567",
        email: "",
      }).success,
      true,
    );
    assert.equal(
      customerContactFields.safeParse({
        name: "Sita Sharma",
        phone: "9841234567",
        email: "",
      }).success,
      true,
    );
  });

  test("accepts Australian national and international phone formats", () => {
    assert.equal(
      customerContactFields.safeParse({
        name: "Aarav Rai",
        phone: "0412 345 678",
        email: "",
      }).success,
      true,
    );
    assert.equal(
      customerContactFields.safeParse({
        name: "Maya Rai",
        phone: "+61 412 345 678",
        email: "",
      }).success,
      true,
    );
  });

  test("accepts valid email-only and phone-only contact fields", () => {
    assert.equal(
      customerContactFields.safeParse({
        name: "Maya Rai",
        phone: "",
        email: "buyer+orders@example.com",
      }).success,
      true,
    );
    assert.equal(
      customerContactFields.safeParse({
        name: "Maya Rai",
        phone: "+977 984-123-4567",
        email: "",
      }).success,
      true,
    );
  });

  test("rejects blank names, malformed emails and phone digit counts outside 7 to 15", () => {
    assert.equal(customerContactFields.safeParse({ name: " ", phone: "9841234567", email: "" }).success, false);
    assert.equal(customerContactFields.safeParse({ name: "Maya Rai", phone: "123456", email: "" }).success, false);
    assert.equal(
      customerContactFields.safeParse({ name: "Maya Rai", phone: "9841234567", email: "not-an-email" }).success,
      false,
    );
  });

  test("requires at least one contact method at the order-schema boundary", () => {
    assert.equal(hasCustomerContact({ phone: "", email: "" }), false);
    assert.equal(hasCustomerContact({ phone: "9841234567", email: "" }), true);
    assert.equal(hasCustomerContact({ phone: "", email: "buyer@example.com" }), true);
  });
});
