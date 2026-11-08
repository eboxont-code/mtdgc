# MTDGC Prohibited Products and Fulfilment Rules

**Policy version:** 1.0  
**Recorded:** 9 November 2026  
**Owner:** MTDGC business owner  
**Use:** Internal product acceptance, supplier review and fulfilment control

> This is an internal operating policy. It is not legal advice, an issuer approval, a supplier verification or proof that any current catalogue listing is authorised. It does not approve any product for sale.

## Purpose

MTDGC sells specified digital products. It does not sell account access, credentials, stolen digital value, circumvention services or money movement. A product must not become orderable merely because it appears in the catalogue, has a price or can be delivered manually.

Apply this policy to the exact supplier, product/SKU, issuer, region, denomination, delivery method and customer-data requirements. Approval for one scope never transfers automatically to another.

## 1. Hard prohibitions — reject and do not test

The following offers and fulfilment methods are not acceptable. Do not list them as orderable, onboard them, run a test transaction or ask a customer to participate.

### 1.1 Unauthorised account access or transfer

Never sell, rent, share or transfer:
- Pre-created, stolen, compromised or otherwise unauthorised game, email, streaming, software or platform accounts.
- Shared logins, rented profiles, account takeovers, account ownership transfers or access to an account controlled by another person.
- An account or subscription arrangement that depends on MTDGC or a supplier handing the customer someone else's login or taking control of the customer's account.

An official issuer code, entitlement or subscription benefit redeemed on the customer's own account may be assessed separately only when the exact issuer-authorised route is documented and does not require credential sharing or account transfer. This is not an exception for account resale.

### 1.2 Customer credentials and authentication secrets

Never request, receive, store, forward or enter on a customer's behalf:
- Account, game, subscription or email passwords, passcodes or passphrases.
- OTPs, one-time or verification codes, authenticator codes, 2FA codes or sign-in tokens.
- Payment, bank or card PINs; card security codes (CVV/CVC); or bank/card login credentials.
- Recovery or backup codes/phrases, session cookies, access tokens, private keys or other authentication secrets.
- Remote control of a customer's device or account for the purpose of entering or obtaining credentials.

This repeats the mandatory rejection control in the [Supplier Register](./SUPPLIER_REGISTER.md) and the server-side customer-requirement safeguards in `src/lib/supplier-safety.ts`. A supplier that requires any of these must be marked `REJECTED` for the affected scope. Do not test the workflow.

A delivery email address or a game/player/zone/server identifier is not permission to request the password for that email or game account.

### 1.3 Stolen, compromised or already-used digital codes

Never knowingly sell or fulfil a code, voucher, key or top-up that is confirmed to be:
- Stolen, fraudulently obtained, sourced from a compromised account or linked to payment fraud.
- Previously redeemed, duplicated, revoked, tampered with or invalidated by the issuer.
- Supplied through a source that the evidence shows is not entitled to distribute it.

If the origin or redemption state is unknown, do not label the item stolen by assumption; place the exact scope on hold and do not make it orderable until traceable evidence is supplied. If theft, fraud, prior redemption or compromise is confirmed, reject the scope and quarantine affected stock. Do not attempt resale or a customer test.

### 1.4 Counterfeit, pirated or unauthorised software

Never sell cracked, pirated, counterfeit or tampered software, key generators, activation bypasses, or licence keys that are known to be stolen or unauthorised. Do not resell a licence or key where the issuer's terms or evidence prohibit that transfer, including a non-transferable or restricted licence presented as a transferable retail licence.

If the licence type, transfer rights, source or activation restrictions are not documented, hold the scope. Do not describe it as genuine, retail, transferable or authorised without evidence.

### 1.5 Circumvention and misrepresentation

Never sell an offer whose fulfilment requires MTDGC or the customer to:
- Bypass an issuer's region, account, platform, activation, age/eligibility, security or payment controls.
- Misstate the customer's country, identity, account ownership or eligibility.
- Use a VPN, false account region or another workaround to evade a published issuer restriction.
- Hide a material region, denomination, renewal, account-sharing or redemption restriction.

A region-specific product is not prohibited merely because it has a regional restriction. It must remain on hold until the exact issuing region, eligible customer/account region and redemption rules are supported by current issuer or authorised-supplier evidence. A catalogue label such as `Global` is not proof of compatibility.

### 1.6 Money movement and cash-out services

MTDGC does not offer remittance, peer-to-peer money transfer, cash-out, withdrawal, wallet funding or a service that transfers a customer's money or balance to another person.

A named issuer gift card or digital code may be considered only as the sale of that specified digital product, with verified source, denomination, currency, region and redemption terms. Do not describe a gift card as cash, a cash-equivalent payout, a transferable wallet or a way to move money between people.

### 1.7 Resale that is expressly unauthorised

Do not sell a product where current issuer/supplier terms or other reliable evidence expressly prohibit the proposed resale, territory, delivery method or customer use. Do not claim authorised-reseller status without evidence.

Missing authority documents are not proof that a supplier is unlawful; they mean the scope is **not approved**. Keep it on hold. If evidence establishes that the proposed resale is prohibited, reject it.

## 2. Hold — not orderable until evidence is complete

The following are not automatically proof of misconduct, but they are release blockers. Use the existing Supplier Register statuses `NOT ASSESSED`, `EVIDENCE REQUESTED`, `UNDER REVIEW` or `EXPIRED`; do not create a new approval status to work around missing evidence.

- Unknown supplier identity, source of origin, chain of supply or issuer/distributor authority.
- Unknown or conflicting issuing region, redemption region, account country, currency, denomination, platform, activation or expiry rules.
- An unsupported `Global` claim or a product whose exact account/server compatibility has not been evidenced.
- Unclear subscription ownership, duration, renewal, cancellation, household/seat limits, customer control or expiry behaviour.
- Customer information requested by a supplier that is not clearly necessary for the exact product. Do not collect additional identity, financial or account data until the business owner has approved the need and the privacy/data-handling review is complete.
- Missing supplier cost, price source, delivery process, failure/refund allocation, support escalation or data-sharing/retention terms.
- A product whose availability, delivery time or redemption claim cannot be substantiated.

A held product must not be promoted as available, offered for payment or manually fulfilled. Do not infer missing evidence from a product description, price list, chat message or the fact that an earlier order exists.

## 3. Product-family boundaries

| Product family | May be considered only when | Reject or hold when |
|---|---|---|
| Game top-ups | The exact top-up route and supplier authority are documented; required player ID, zone and server fields are limited to what that route needs; account/server compatibility is evidenced. | Any password, OTP or account access is requested; the source or server/region route is unknown; or the supplier asks the customer to bypass an issuer restriction. |
| Gift cards and digital codes | Code origin, issuer, denomination, currency, issuing region, eligible redemption region, activation/expiry rules and resale authority are evidenced for the exact SKU. | Origin or prior-redemption state is unknown; the code is confirmed stolen, duplicated, redeemed, revoked or counterfeit; or the region/denomination is misrepresented. |
| Subscriptions | The exact issuer-authorised product is clear, including who owns the account, what the customer receives, duration, renewal/cancellation, region and any seat/household limits. | The offer is an account sale, rented/shared login, credential handover, unauthorised slot or unclear account-control arrangement. |
| Software and licences | The exact edition, platform, licence type, source, transfer/resale rights, region and activation restrictions are documented. | The offer is cracked, pirated, counterfeit, stolen or an unauthorised/non-transferable key represented as a retail licence. |
| Other digital goods | A product-specific review defines the legitimate source, exact customer entitlement, restrictions, data fields and support/refund route. | The product type, source, customer entitlement or fulfilment method is not understood. Keep it not assessed. |

## 4. Decision and status rules

1. **REJECTED** — a hard prohibition applies, or reliable evidence confirms theft, fraud, counterfeit supply, unauthorised account access or prohibited resale. Do not test or fulfil.
2. **NOT ASSESSED / EVIDENCE REQUESTED / UNDER REVIEW / EXPIRED** — evidence is missing, incomplete, conflicting or out of date. The scope is on hold and is not orderable.
3. **SUSPENDED** — a previously reviewed scope has a supplier incident, suspected compromise, changed issuer terms, expired authority, region mismatch or other loss of a required control. Stop new sales while it is investigated.
4. **VERIFIED — LIMITED SCOPE / VERIFIED** — evidence supports only the exact scope recorded in the Supplier Register. These statuses do not by themselves make a product launch-ready; every other product, payment, pricing, policy, support and test-order gate must also pass, with business-owner approval.

No supplier-wide, brand-wide or category-wide approval is implied by one verified SKU. Record evidence references and the review date; never copy credentials, customer data or private payment details into Git.

## 5. Minimum evidence before a product can be approved

For the exact supplier/SKU/region/denomination/delivery route, the review must record:
- The contracting supplier's legal identity and independently verifiable business contact.
- Issuer or rights-holder authority for the proposed resale and territory.
- Traceable product origin and the exact item the customer receives.
- Issuing country, redemption country/account region, currency, denomination, platform, activation, expiry and other material restrictions.
- Necessary customer fields and why each is required; confirmation that no prohibited credential or unsafe account access is involved.
- Supplier cost/currency, dated quote, MTDGC selling price, payment/settlement route and margin review.
- Delivery steps, realistic measured service window, failure handling, refund responsibility and escalation contact.
- Customer-data recipients, purpose, access/storage location and retention/deletion handling.
- A successful, authorised low-value end-to-end test for that exact product family and region, where the test is permitted and can be performed safely.

Do not run a test transaction for a hard-prohibited workflow. Do not contact a supplier or customer, make a purchase or incur spend as part of an automated review.

## 6. Operator response to a suspected prohibited offer

1. Do not add or continue promoting the affected scope as orderable.
2. Do not test, fulfil, reveal or resell the affected code/account/access.
3. Preserve only non-sensitive evidence references and the reason for the hold/rejection; do not copy credentials or customer secrets into Git or support notes.
4. Refer owner-only, supplier, refund or customer decisions to the business owner through the approved operating process. Do not invent a remedy or contact a third party on the automation's behalf.
5. Do not change production product, order, payment, customer, storage or supplier records as part of this policy document.

## 7. Current MTDGC boundary

The current [Supplier Register](./SUPPLIER_REGISTER.md) has no verified supplier identity or product-scope entries. This policy therefore approves **no current listing** and does not establish that any existing catalogue product has legitimate supply, resale rights or region compatibility. A catalogue status or public price is not supplier evidence.

The Netflix subscription remains on the existing production hold recorded under MT-0282. This policy is not permission to restore it or to substitute an unverified account-sharing arrangement.

## 8. Governance and related records

- The business owner approves any change to this policy and the exact product scope that may proceed.
- Obtain qualified advice where a decision requires legal, tax, consumer-protection or issuer-terms interpretation; this document does not make that interpretation.
- Reassess the exact scope whenever the supplier, issuer, SKU, region, denomination, delivery route, terms or customer-data requirements change, and after any suspected incident.
- Keep the [MTDGC Master Plan](./MTDGC_MASTER_PLAN.md), [Supplier Register](./SUPPLIER_REGISTER.md) and server-side [customer-requirement safeguard](./src/lib/supplier-safety.ts) aligned with this policy.
