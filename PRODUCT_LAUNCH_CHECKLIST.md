# Product launch readiness checklist

**Use one completed copy for each exact product, supplier, variant and region.** Approval for one supplier, denomination, platform or country does not carry over to another.

> **Template only.** This checklist does not approve a product, supplier, resale right, market or purchase. Every item starts as NOT ASSESSED.

## 1. Record the exact scope

- Product name and slug:
- Product family:
- Supplier legal entity:
- Supplier source / official reference:
- Exact product or service:
- Platform and recipient type:
- Country / region:
- Variant, denomination and SKU:
- Currency:
- Product owner:
- Reviewer:
- Private evidence location:
- Review date:
- Revalidation date:
- Status: **NOT ASSESSED** (default)

Do not put supplier passwords, API keys, private contact details, customer data or payment credentials in this repository. Store sensitive evidence only in an approved private location with access limited to the people who need it.

## 2. Supplier identity and resale rights

- [ ] The supplier's legal entity and official source have been independently checked.
- [ ] The supplier is authorised to supply this exact product family and scope.
- [ ] Resale or distribution rights for this exact product, region and channel are evidenced.
- [ ] The evidence identifies the relevant platform, denomination, recipient and any geographic restrictions.
- [ ] Supplier terms, delivery method, failure handling and escalation route are recorded.
- [ ] The evidence is current, dated and has a revalidation date.
- [ ] No supplier credential or customer authentication secret is requested or stored.

**Evidence required:** source reference, legal-entity reference, authorisation or rights evidence, exact product scope, terms and verification date. A supplier name or an unsupported claim is not sufficient.

## 3. Region, platform and variant

- [ ] The exact country or region in which the product can be used is confirmed by a reliable source.
- [ ] The recipient's platform, account type and any eligibility restrictions are documented.
- [ ] Each denomination or variant has its own verified SKU and source-backed description.
- [ ] Currency and any region-lock or account-country restrictions are clear.
- [ ] Customer-facing availability and delivery wording matches the verified scope.
- [ ] No region, compatibility or instant-delivery claim is inferred from a different variant or market.

**Evidence required:** official product or supplier reference for the exact region, platform, denomination and SKU.

## 4. Source-backed price and margin

- [ ] A current supplier quote or official price source exists for the exact variant and region.
- [ ] The source currency, unit cost, quote date and expiry/revalidation date are recorded.
- [ ] Applicable payment, settlement, foreign-exchange and supplier fees are evidenced rather than guessed.
- [ ] The proposed selling price and margin calculation can be reproduced from those inputs.
- [ ] The customer-facing currency and final amount are clear before checkout.
- [ ] No live price or availability change is made from an estimate or an expired quote.

**Evidence required:** dated source, cost inputs, fee assumptions with sources, calculation and proposed selling price. Do not invent taxes, fees, margins or legal conclusions.

## 5. Availability and fulfilment

- [ ] The supplier confirms current availability for the exact variant and region.
- [ ] The fulfilment method and the steps staff must perform are documented.
- [ ] The expected delivery window is supported by evidence; no unsupported “instant” or guaranteed promise is shown.
- [ ] Required customer fields are limited to what fulfilment genuinely needs.
- [ ] The process for supplier outage, delay, incorrect details and failed delivery is documented.
- [ ] Staff know how to record the result and escalate an unresolved order.

**Evidence required:** dated availability confirmation, fulfilment instructions, delivery evidence standard and outage/escalation process.

## 6. Controlled end-to-end test order

- [ ] A test account and test method are approved for this exact product, variant and region.
- [ ] Any purchase, fee or other possible charge has explicit owner approval before the test begins.
- [ ] The test confirms the selected SKU, denomination, currency and amount remain consistent through checkout.
- [ ] Payment instructions and the existing payment-review process are checked without treating a screenshot as independent settlement evidence.
- [ ] The supplier fulfilment step completes and the delivered item matches the exact test scope.
- [ ] Tracking, customer instructions and the support route are checked.
- [ ] Failure, cancellation and refund handling are exercised where a safe, authorised test path exists.
- [ ] The test result, date, scope and evidence reference are recorded without customer data or secrets.

A preview build, mock response, screenshot alone or an uncompleted test is not a passed test order. Never use a real customer's order as test data. This checklist does not authorise a purchase or test order.

## 7. Policy and customer disclosures

- [ ] The relevant product, delivery, cancellation and refund terms are available to the customer before payment.
- [ ] Region, platform, account and denomination restrictions are stated accurately.
- [ ] Required customer information and its purpose are explained.
- [ ] Product compatibility, authorised-reseller, availability and delivery claims are supported by evidence.
- [ ] Any legal, tax, privacy or consumer-law interpretation that needs specialist review has been referred to a qualified reviewer; this checklist makes no legal-compliance determination.
- [ ] The published wording matches the verified supplier and test-order evidence.

**Evidence required:** exact policy/page references, review date and any qualified-review record. Do not promise a refund time, delivery time or legal entitlement that has not been verified.

## 8. Support readiness and safe data handling

- [ ] A working support route is published and staff can access the relevant order context.
- [ ] Common issue categories and the escalation owner are documented.
- [ ] Staff have a procedure for delayed, failed, incorrect or unavailable fulfilment.
- [ ] Any response-time promise is supported by an approved operating commitment.
- [ ] Customer instructions ask only for necessary order and delivery details.
- [ ] Staff and suppliers are told never to request passwords, one-time codes, OTPs, 2FA codes, payment PINs, recovery codes, session tokens or private keys.
- [ ] Payment proof and other sensitive evidence remain in private, access-controlled storage.

**Evidence required:** support page or procedure reference, escalation route and data-handling check.

## 9. Evidence ledger

Complete one row for every required item. Link to evidence; do not paste secrets, payment credentials, customer details or private supplier credentials into the ledger.

| Requirement | Evidence reference | Verified by | Verified on | Revalidate by | Result |
|---|---|---|---|---|---|
| Supplier identity and rights | | | | | NOT ASSESSED |
| Region, platform and variant | | | | | NOT ASSESSED |
| Price and margin | | | | | NOT ASSESSED |
| Availability and fulfilment | | | | | NOT ASSESSED |
| Controlled test order | | | | | NOT ASSESSED |
| Policy and disclosures | | | | | NOT ASSESSED |
| Support and data handling | | | | | NOT ASSESSED |

## 10. Decision and publication gate

Use only these checklist states:

- **NOT ASSESSED** — evidence has not been reviewed.
- **HOLD** — a required item is missing, expired, inconsistent or unresolved.
- **READY FOR OWNER REVIEW** — every required item is evidenced, the controlled test has passed, and the evidence ledger is complete.
- **APPROVED** — the owner has explicitly approved this exact product, supplier, variant and region after review.
- **REJECTED** — the exact scope fails a prohibited-product, rights, safety or evidence requirement.

A product must remain unpublished or unavailable for ordering while any required item is NOT ASSESSED or on HOLD. READY FOR OWNER REVIEW is not approval. Only the owner can move the exact scope to APPROVED. This document does not change product records, availability, prices, database schema or publication settings.

Re-run the checklist when the supplier, source, rights, region, platform, SKU, denomination, price, availability, fulfilment method, policy or support process changes, or when evidence reaches its revalidation date.
