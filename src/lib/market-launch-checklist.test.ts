import { readFileSync } from "node:fs";
import { describe, test } from "node:test";
import { strict as assert } from "node:assert";

const checklist = readFileSync(new URL("../../MARKET_LAUNCH_CHECKLIST.md", import.meta.url), "utf8");

describe("MT-0230 market launch checklist contract", () => {
  test("keeps the three planned purchase journeys separate", () => {
    assert.match(checklist, /### A\. Nepal domestic/);
    assert.match(checklist, /### B\. Australia-local/);
    assert.match(checklist, /### C\. Australia buyer to Nepal recipient/);
  });

  test("requires buyer, payer, recipient, delivery and redemption scope to remain distinct", () => {
    for (const field of ["Buyer country", "Payer identity and country", "Recipient country and relationship", "Delivery country and destination", "Product redemption / activation region"]) {
      assert.ok(checklist.includes(field), field);
    }
    assert.match(checklist, /Do not infer buyer, payer, recipient, delivery or redemption country from IP address/);
  });

  test("separates checkout, settlement, supplier and denomination currencies", () => {
    for (const field of ["Customer-facing and checkout currency", "Payment settlement currency and account country", "Supplier quote currency", "Code / gift-card face-value or product-denomination currency"]) {
      assert.ok(checklist.includes(field), field);
    }
    assert.match(checklist, /Never invent a rate, fee, tax, supplier cost, margin or selling price/);
  });

  test("requires qualified legal and tax review without making compliance claims", () => {
    assert.match(checklist, /qualified professional/);
    assert.match(checklist, /This checklist is not legal or tax advice and makes no compliance determination/);
    assert.match(checklist, /Non-excludable consumer rights are preserved/);
  });

  test("requires supplier evidence and an authorised end-to-end test before launch", () => {
    assert.match(checklist, /Supplier Register/);
    assert.match(checklist, /successful test order/);
    assert.match(checklist, /Any purchase, payment fee or other possible charge has explicit owner approval/);
    assert.match(checklist, /A preview, mock response, screenshot alone, incomplete transaction or another product's test is not a passed market test/);
  });

  test("defaults to not assessed and reserves approval for the owner", () => {
    assert.match(checklist, /Every applicable gate starts as \*\*NOT ASSESSED\*\*/);
    assert.match(checklist, /READY FOR OWNER REVIEW is not approval/);
    assert.match(checklist, /Only the owner may move an exact scope to APPROVED/);
  });

  test("keeps credentials and customer data out of the repository", () => {
    assert.match(checklist, /passwords, bank credentials, payment credentials, API keys, private supplier contacts or customer data/);
    assert.match(checklist, /Customer passwords, OTPs, payment PINs, recovery codes and unnecessary account access are never requested or stored/);
  });
});
