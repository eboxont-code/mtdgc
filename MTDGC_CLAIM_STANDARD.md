# MTDGC Customer-Facing Claims Standard

**Task:** MT-0013 · P1  
**Reviewed:** 9 November 2026  
**Audience:** Internal MTDGC product, operations and content owners  
**Status:** Internal working standard. This document does not approve a product, supplier, market, legal term, delivery SLA or public claim.

## 1. Purpose

Keep four different things separate:

1. **Customer-facing promise** — wording a customer can see or reasonably rely on, including the homepage, catalogue, product page, checkout, order page, email, support, social posts, search metadata and structured data.
2. **Verified fact** — a statement supported by current evidence for the exact product, variant, market, region and fulfilment route being described.
3. **Internal target** — an operational goal used by the team. It is not a customer guarantee and must stay internal unless separately approved and evidenced.
4. **Supplier estimate** — an upstream estimate or statement supplied by a supplier or intermediary. It is not, by itself, a measured MTDGC delivery result or a promise to a customer.

**Core rule:** Never turn an internal target, supplier estimate, catalogue status, marketing badge or unverified assumption into a customer-facing promise.

A claim is not approved merely because it already appears on the website.

## 2. Evidence and approval rules

Every customer-facing claim must have:

- Exact wording and the page or channel where it appears.
- Narrow scope: product/SKU, variant, issuing or delivery region, customer market and fulfilment method where relevant.
- A source that can be checked, its date, expiry or recheck date, and the person who checked it.
- Known limitations and the event that would make the claim inaccurate.
- Owner approval before publication. Obtain qualified legal, tax or other professional review where the claim concerns legal rights, market eligibility, tax, regulated activity or contractual terms.

Use the source that actually proves the claim:

| Claim type | Evidence required | Evidence that is not enough by itself |
|---|---|---|
| Issuer rights, authenticity or resale authority | Current issuer/rights-holder evidence or independently verifiable authorised-distributor evidence for the exact scope | A supplier's price list, chat message, invoice or self-description alone |
| Redemption region and compatibility | Current issuer rules for the exact code/product, account region, platform and denomination | A catalogue text label such as Global or a supplier estimate |
| Availability or stock | Dated supplier confirmation for the exact supplier SKU, region, denomination and delivery route, with an expiry/recheck time | An internal available flag, a product count or an old screenshot |
| Price and denomination | Current approved selling price and variant data, with face value/currency kept distinct from MTDGC's selling price | An expired supplier quote or a face value presented as the selling price |
| Delivery time | Measured completed-order history for the same product family/route plus demonstrated staff/supplier capacity and a clearly defined clock | A supplier estimate, an internal target, a free-text delivery field or a single successful test |
| Payment status | The actual event that occurred: proof submitted, staff review completed, or independent bank/provider settlement confirmed | A screenshot upload or transaction reference alone |
| Support hours and languages | Actual staffed coverage, named responsibility and an owner-approved schedule | A WhatsApp number, a support link or an aspiration to reply quickly |
| Refund, consumer, market or tax terms | Owner-approved policy and qualified professional review where required | A generic digital-goods template or an operational preference |

## 3. Delivery estimates, internal targets and customer promises

Keep these as three separate records:

### Supplier estimate — internal input

Record it in the Supplier Register against the exact supplier, product/SKU, region, denomination and delivery method. Include:

- The source document or secure evidence reference.
- Quote/estimate date and expiry.
- Time zone, cut-off hours, weekends and stated conditions.
- What starts and stops the supplier's clock.
- Failure, outage, refund and escalation terms.
- The person who verified the source.

Do not publish a supplier estimate as an MTDGC guarantee. A supplier estimate may be wrong, may exclude MTDGC payment checks and manual handling, and may not describe the customer's full journey.

### Internal target — team-only measure

An internal target must have a defined metric, owner, measurement window, baseline, exclusions and reporting source. Keep it labelled **INTERNAL TARGET — NOT A CUSTOMER PROMISE**.

Do not invent numerical targets before a reliable baseline exists. The Master Plan's core-metrics section explicitly says not to set numerical targets until the baseline is reliable.

### Customer-facing delivery wording

Only publish a usual delivery range when the evidence covers the same product/route and the team can maintain it. Before approval, define:

- Whether the clock starts at order placement, payment verification, or acceptance of all required customer details.
- Whether weekends, public holidays, supplier cut-offs or outages pause the clock.
- Whether the stated range is an observed usual time or a contractual commitment.
- What the customer should do if the order exceeds the stated range.

Do not use instant, guaranteed, always in stock, 24/7 or a fixed delivery promise without evidence and explicit approval. A product's free-text delivery field is descriptive catalogue data, not an SLA by itself.

## 4. Payment and order-status wording

Keep the actual events distinct:

- **Payment proof received:** the customer uploaded a screenshot/reference. This does not prove that funds reached MTDGC.
- **Verified by staff:** an administrator manually reviewed and marked the proof/order verified. Do not describe this as an independent bank or payment-provider settlement match unless such evidence exists.
- **Processing:** staff marked fulfilment as in progress. Do not imply a live supplier API status.
- **Delivered:** staff marked the order delivered. Do not imply that a delivery-evidence record or email dispatch exists unless it was actually recorded.

The current payment flow is manual QR/bank transfer with customer proof submission and staff review. The documented audit found no bank-statement feed or payment-provider settlement callback. Customer wording must not overstate that control.

## 5. Other claim-specific safeguards

- **Markets:** Do not describe Australia-local sales or Australia-to-Nepal gifting as available until the separate seller, legal, tax, payment, sourcing, refund, support and checkout gates pass. The existing public Nepal/Australia wording is a known discrepancy, not approval to operate both markets.
- **Availability:** A catalogue status is not supplier stock confirmation. Keep coming-soon and temporarily unavailable products out of checkout.
- **Region:** A region label is not issuer compatibility evidence. Verify each exact product and redemption route.
- **Software authenticity:** Do not call a licence genuine, authorised or legitimate without source and resale-rights evidence for that SKU.
- **Popularity:** Best seller, popular, ratings, reviews, customer counts and sales claims need real data, a defined measurement period and an auditable source. A manually assigned badge is not proof.
- **Email delivery:** Do not promise that a code or subscription detail will be emailed until the sender, delivery route and actual test are verified.
- **Support:** Publishing a contact channel does not establish staffed hours, response times or 24/7 coverage.
- **Refunds and statutory rights:** Do not change or broaden refund/legal claims under this task. Obtain owner approval and qualified review before changing policy wording.
- **Security:** Keep the password/OTP/PIN prohibition. Do not claim that every supplier's behaviour has been verified while the Supplier Register has no verified supplier records.

## 6. Current public claims observed on 9 November 2026

The following is an evidence register, **not an approval list**. Published means the wording was observed; it does not mean its underlying claim has passed approval.

| Area | Published wording or presentation observed | Evidence status and required next step |
|---|---|---|
| Market scope | The Terms and footer describe customers/marketplace coverage in Nepal and Australia. | Conflicts with the Nepal-first plan and gated future Australia journeys. Requires the owner's operating-market decision and qualified review. Do not change legal or market wording under MT-0013. |
| Delivery time | Delivery policy and FAQ say each listing shows its usual delivery time. | The production product table has a free-text delivery_time field, while the Supplier Register has no verified supplier or delivery-time records. No product-level delivery SLA is approved by this document. |
| Payment | The site says payments are checked/verified by hand before delivery. | Consistent with a manual staff-review process only. It is not independent bank/provider settlement confirmation. |
| Email delivery | How-it-works and FAQ say codes/subscription details are sent to the delivery email. | The sender and DNS/SPF/DMARC setup remain an owner decision. Do not treat email delivery as tested for every product family. |
| Availability | Product cards show labels such as Available now, Coming soon and Temporarily unavailable. | These are catalogue states. Supplier stock confirmation is still absent from the Supplier Register; do not equate an internal flag with confirmed supplier stock. |
| Region | Product pages and policies display a region for codes and gift cards. | The Master Plan states that a Global or other catalogue label is not issuer compatibility proof. Require exact issuer evidence. |
| Software | The homepage describes software licences/keys as genuine; current software listings are presented as coming soon. | No verified supplier or product-scope evidence is recorded. Do not treat the category description as approval of any software SKU. |
| Popularity | The homepage displays Best Seller and Popular labels. | The labels themselves are not evidence. Retain a dated sales source and measurement period before making factual popularity claims. |
| Support | The site publishes a WhatsApp support route and says customers can contact the team. | A contact channel is visible; no approved service hours, language coverage or response-time target is recorded. |
| Security | The site says MTDGC will not ask for passwords, OTPs or payment PINs. | This is an internal policy and application safeguard. Supplier-side practices remain unverified until suppliers and exact product scopes are assessed. |

### Read-only evidence snapshot

- The Supplier Register's supplier identity and product-scope tables remain empty; no supplier delivery estimates are recorded as verified.
- Read-only Supabase metadata on 9 November 2026 showed 36 product rows and 54 variant rows. The production products.delivery_time column is text. These counts are not orderable-product counts or delivery-performance evidence.
- The same metadata showed zero rows in payment_settings and payment_proofs at inspection time. This is a configuration/data snapshot, not a reason to invent payment details or assume a proof was verified.
- Public pages checked: [Delivery policy](https://mtdgc.com/policies/delivery), [How it works](https://mtdgc.com/how-it-works), [FAQ](https://mtdgc.com/faq), [Terms](https://mtdgc.com/policies/terms) and [homepage](https://mtdgc.com/).
- No customer, order, payment, authentication-user or storage-object values were read for this document.

## 7. Claim record template

Create one record for each distinct claim and scope:

| Field | Required value |
|---|---|
| Claim ID | Unique internal reference |
| Exact wording | The precise sentence, badge or numerical statement |
| Surface | Page, component, email, support script, social post or advertisement |
| Scope | Product/SKU, variant, market, region and fulfilment route |
| Claim class | Verified fact, customer promise, internal target or supplier estimate |
| Evidence reference | Source/document/record reference, not a secret or customer value |
| Evidence date and expiry | When checked and when it must be checked again |
| Limitations | Conditions, exclusions and known uncertainty |
| Evidence status | UNVERIFIED, VERIFIED or EXPIRED |
| Approval status | NOT REVIEWED, OWNER REVIEW, QUALIFIED REVIEW REQUIRED or APPROVED |
| Publication status | NOT PUBLISHED, PUBLISHED or WITHDRAWN |
| Owner/reviewer | Accountable person and any qualified reviewer |
| Recheck trigger | Supplier, SKU, region, price, policy, market, delivery route or service change |

If any required evidence is missing or expired, keep the claim UNVERIFIED and do not expand it. Withdraw or correct an existing claim through the separate owner-approved content/legal task when it is inaccurate.

## 8. Owner-only dependencies

The following cannot be settled by documentation or inference:

- Approved operating markets, seller identity and legal terms.
- Verified supplier identity, resale authority, product origin, regional scope and delivery terms.
- Email sender selection and DNS/SPF/DMARC approval.
- Actual support languages, staffing and service hours.
- Independent payment-settlement evidence or an owner-approved manual verification standard.
- Reliable completed-order delivery history and staff-capacity baseline.
- Qualified legal/tax review for market, refund and consumer-rights wording.

No supplier/customer was contacted, no purchase or test order was made, and no paid service is required for this standard.

## 9. Scope boundary

MT-0013 defines how claims must be classified, evidenced and approved. It does not:

- Rewrite public pages, Terms, Privacy, Delivery or Refund policies.
- Approve Australia as an active market.
- Approve a supplier, product, price, stock level, region or delivery time.
- Set an internal delivery target or customer SLA.
- Claim that payment settlement, email delivery or supplier fulfilment is automated.

Those changes remain gated by their own evidence, owner decisions and qualified reviews.
