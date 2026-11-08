# MTDGC Supplier Register

**Owner:** MTDGC  
**Register version:** 1.2  
**Created:** 6 November 2026  
**Updated:** 9 November 2026  
**Canonical use:** Supplier identity, authority, product scope and verification evidence for MTDGC digital goods.

> **Important:** This is an internal due-diligence register, not a list of approved suppliers. No supplier is considered verified merely because a product exists in the catalogue, a price is available, a supplier claims to be a wholesaler, or a test message is received.

## 1. Operating rules

1. Maintain one supplier record per legal contracting entity. If a group has multiple entities, record the actual entity invoicing and supplying MTDGC.
2. Verify at the narrowest practical scope: supplier + product family/SKU + issuing region + denomination + delivery method. A supplier verified for one product or country is not automatically verified for another.
3. Never invent missing legal names, contacts, reseller status, contracts, product origins, delivery times or supplier prices. Use `Not supplied`, `Not verified` or `Not applicable`.
4. Do not mark a supplier or product scope `VERIFIED` without current evidence of authority, regional compatibility, supply origin, commercial terms and an accountable operational contact.
5. Never request or store customer passwords, passcodes, one-time passwords (OTPs), authenticator/2FA codes, recovery or backup codes, payment/bank/card PINs, session cookies, access tokens or unnecessary account access. Reject any supplier workflow that requires these.
6. Keep private credentials, API keys, bank credentials and customer data out of this Markdown file and Git history. Store operational secrets only in the approved secret manager once an owner-approved integration exists.
7. A completed register does not itself approve a product for sale. Product, pricing, legal, payment, region and test-order launch gates still apply.
8. Preserve published Git history. Correct records with a forward commit; never rewrite shared history to conceal or alter supplier evidence.


### 1.1 Automatic rejection — customer credentials and unsafe account access

A supplier and the affected product scope must be marked `REJECTED` if fulfilment requires the customer to disclose or transfer any of the following:

- Account, game, subscription or email passwords/passcodes.
- OTPs, one-time/verification codes, authenticator or 2FA codes.
- Payment, bank, card or other account PINs; card security codes; or bank/card login credentials.
- Recovery/backup codes or phrases, session cookies, access tokens, private keys or other authentication secrets.
- Remote access/control of a customer's device or account, or handing over account ownership/control when that is not an issuer-authorised product flow.

Do not onboard or test that workflow, and do not ask the customer to send the credential to MTDGC or the supplier. Record only the non-sensitive evidence reference and rejection reason; never copy the credential itself into the register, a support ticket or Git history. If the supplier's requirements are unclear, keep the scope `NOT ASSESSED` and do not make it orderable until clarified through legitimate evidence.

Only product identifiers and delivery contact details that are strictly necessary for the exact product's official fulfilment route may be requested. A customer email address for delivery is not permission to request the email account password.

## 2. Supplier identity register

No verified supplier records were found in the current repository or the current MTDGC database schema during the initial register build on 6 November 2026. The table is intentionally empty until source documents or owner-provided supplier details can be checked.

| Supplier ID | Legal entity name | Trading name | Registration country | Operating country | Official website/domain | Primary contact and role | Business email | Business phone | Product scope | Verification status | Last verified (UTC) | Evidence location | Reviewer / notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | NOT ASSESSED | | | |

## 3. Product-scope and authority register

Create one row per supplier/product/region combination. Multiple products or regions from the same supplier require separate scope rows where their authority, denomination, terms or fulfilment differ.

| Scope ID | Supplier ID | MTDGC product / SKU | Product family | Issuer / brand | Source type | Issuing region | Allowed customer region | Denomination / variant | Delivery method | Resale / distribution authority evidence | Source-of-origin evidence | Supplier terms / restrictions | Status | Last checked (UTC) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | | | | NOT ASSESSED | |

**Source types:** issuer-direct, issuer-authorised distributor, authorised reseller, documented wholesale partner, official API, manual supply, other (describe), unknown. These labels describe the claimed route; they are not proof of authority.

## 4. Commercial and operational controls

| Supplier ID | Supplier SKU / reference | Supplier unit cost | Cost currency | Price source / document | Quote date (UTC) | Quote expiry | Minimum order | Settlement method / currency | Expected delivery time | Cut-off hours / timezone | Failure and refund process | Escalation contact | Data shared with supplier | Data location / retention | Notes |
|---|---|---:|---|---|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | | | | | | |

Do not put payment account numbers, card details, API tokens, passwords or other secrets in this register. Record only a secure reference to the approved internal record where necessary.

## 5. Verification statuses

| Status | Meaning | May MTDGC order from this scope? |
|---|---|---|
| NOT ASSESSED | No review started or evidence not supplied | No |
| EVIDENCE REQUESTED | Required documents/details requested but not received | No |
| UNDER REVIEW | Evidence is being checked; scope not approved | No |
| VERIFIED — LIMITED SCOPE | Evidence supports only the specific products, regions, variants and route listed | Only within the explicitly approved scope and after all other launch gates pass |
| VERIFIED | Current evidence supports the full recorded scope and operational controls | Only within the recorded scope and after all other launch gates pass |
| REJECTED | Evidence failed, authority is absent, or unacceptable risk was found | No |
| SUSPENDED | Evidence expired, supplier incident occurred, or a control is no longer reliable | No |
| EXPIRED | Time-limited evidence or commercial terms are no longer current | No |

A status never transfers automatically from the supplier identity row to every product-scope row. Record the status and evidence at the relevant scope row.

## 6. Minimum evidence checklist

Before approving a product scope, record references to evidence for all applicable items:

- [ ] Legal entity name and registration country match the contracting/invoicing counterparty.
- [ ] Official website, business contact and accountable escalation contact are verified independently.
- [ ] Issuer or rights-holder documentation permits this entity to distribute/resell the exact product, or the issuer's official partner/distributor directory lists it.
- [ ] Resale territory, redemption/activation country, currency, platform, account type and denomination are compatible with the exact customer journey.
- [ ] Product origin and chain of supply are traceable; unusually discounted or high-risk digital codes have proof of origin.
- [ ] Supplier terms permit the proposed resale, marketing, payment method, fulfilment and customer support model.
- [ ] Customer data shared with the supplier is necessary, disclosed, protected and subject to documented retention/deletion controls.
- [ ] Supplier does not require customer passwords, OTPs/2FA codes, payment/bank/card PINs, recovery/backup codes, session cookies, access tokens or unsafe account access. If any are required, mark the supplier and affected scope REJECTED and stop; do not run a test transaction.
- [ ] Unit cost, currency, quote date/expiry, settlement route, fees and refund/failure allocation are recorded.
- [ ] Delivery steps, realistic service window, cut-off hours, outage process and escalation path are documented.
- [ ] A low-value end-to-end test passes for this exact product family and region, with the evidence recorded in the operational test log.

A website, chat screenshot, invoice, price list or supplier declaration alone does not prove issuer authorisation. Validate claims with the rights holder or an independently verifiable official source wherever possible.

## 7. Initial MTDGC coverage queue

The following are product families in the catalogue that need traceable sourcing records. These are **not supplier assignments** and the register intentionally does not imply that any source has been verified.

| Product family / listing | Current catalogue state at initial review | Supplier identity recorded? | Authority evidence recorded? | Next action |
|---|---|---|---|---|
| Free Fire Diamonds | Available | No | No | Identify and verify exact top-up source and player/account requirements |
| PUBG Mobile UC | Available | No | No | Identify and verify exact top-up source, region/server and player requirements |
| Mobile Legends Diamonds | Available | No | No | Identify and verify exact top-up source, region/server and user/zone requirements |
| Clash of Clans Passes | Available | No | No | Identify and verify exact supply route; do not collect account passwords or OTPs |
| Roblox Gift Card | Available | No | No | Identify and verify code origin, issuing region and redemption currency/territory |
| Netflix Subscription | Temporarily unavailable (production hold, 6 November 2026) | No | No | Keep unavailable until exact authorised supply/account model is evidenced and tested |

Coming-soon listings are not sourcing approvals. Add each one to the product-scope table only when a real supplier and exact SKU/region route is identified for due diligence.

## 8. Register governance

- **Record owner:** MTDGC operator (to be assigned in the internal operating process).
- **Approval authority:** business owner; no automatic approval based on data entry.
- **Review cadence:** before first order, on any change to supplier/product/region/variant/terms, at evidence expiry, after an incident, and at least quarterly for active suppliers.
- **Evidence retention:** retain contracts, authorisation letters, official directory records, invoices, test-order evidence and incident records in access-controlled storage. Put document references—not credentials or customer secrets—in this file.
- **Change history:** update through normal commits with dated notes. Do not edit away a rejected or suspended history; record the reason and decision.

## 9. Initial audit note — 6 November 2026

- Repository search found no supplier register, supplier identity record or supplier integration.
- The inspected product, variant and order schema has no supplier foreign key or supplier table. The MTDGC data architecture document does not define one either.
- No supplier legal entity, country, contact, resale authority, source-of-origin proof or documented product-scope mapping could be substantiated from the available repository/database evidence.
- This register is therefore created with an empty supplier identity table and an explicit product sourcing queue. It does not invent supplier names or convert existing catalogue products into verified supply.
- A persistent supplier table/migration was not added. The repository master plan holds backend migrations until the Boxont-controlled Supabase cutover and database reconciliation are complete. Keep this register in Git until that migration gate is formally cleared.

**Initial status:** Register structure and mandatory credential-rejection policy created. No supplier has been screened or rejected because the supplier identity register remains empty; actual supplier population, evidence review and test transactions remain separate dependency-gated tasks under MT-0042–MT-0046.


## 10. Product and supplier approval workflow — 9 November 2026

This workflow is mandatory before MTDGC adds a new public product category, onboards a supplier for commercial use, makes a new product/SKU orderable, or expands an existing approval to another issuer, denomination, region, platform, account type or delivery route.

**A completed form or a supplier status by itself is not approval.** The exact product scope must pass every applicable gate below, and the business owner must approve the recorded scope before it can be made orderable.

### 10.1 Open a scoped proposal

Record the proposal before changing the public catalogue:

- For a new category: the customer need, evidence of demand (customer interviews, search demand or completed-order evidence), proposed product families, target market/journey and why an existing category is not suitable.
- For a supplier: the actual legal contracting/invoicing entity and a supplier identity row. A trading name or chat contact alone is not enough.
- For each product scope: issuer/brand, exact product family and SKU, denomination/variant, issuing and redemption region, allowed customer region, platform/account type, currency, required customer inputs and delivery method.
- Record unknown facts as “Not supplied”, “Not verified” or “NOT ASSESSED”. Do not fill gaps from catalogue copy, a supplier claim, a price listing or assumptions.

A category may be kept as an internal proposal while evidence is gathered. Do not present a new category as a purchasable offer until at least one product in it has passed the product launch gate. A public roadmap/coming-soon label must remain truthful and must not enable checkout.

### 10.2 Pass the approval gates in order

| Gate | Evidence required | Stop condition |
|---|---|---|
| 1. Category and market fit | Documented customer need and demand evidence; intended Nepal, Australia-local or Australia-to-Nepal journey; proposed category and product scope. | No owner-approved category decision or no evidence that the category serves a real customer need: keep it internal; do not expand the public catalogue. |
| 2. Supplier identity | Legal entity, registration/operating country, official domain, independently checked business contact and the entity that will contract and invoice MTDGC. | Identity or contracting party is unknown or inconsistent: supplier remains NOT ASSESSED; no orderable product. |
| 3. Authority and origin | Rights-holder/issuer authorisation or an independently verifiable official partner/distributor record for the exact product and territory; traceable source of origin; applicable resale and supplier terms. | A supplier's unsupported statement, website, invoice or chat alone is not proof of issuer authority. Missing or failed authority evidence means NOT ASSESSED or REJECTED; no test transaction or sale. |
| 4. Product and region compatibility | Exact SKU, denomination, issuing/redemption country, permitted customer region, currency, platform, account type, activation restrictions and required customer fields. | Any material region, account, denomination or platform fact is unknown: do not claim compatibility or make the scope orderable. |
| 5. Customer safety and data | Only the identifiers/contact details needed for the exact official fulfilment route; documented supplier data sharing, access, location and retention; no password, OTP, PIN, recovery code, token or unsafe account/device access. | Any supplier flow requires prohibited credentials or unsafe access: REJECT the supplier and affected scope under section 1.1. Unclear requirements remain NOT ASSESSED. |
| 6. Commercial and operational readiness | Dated supplier cost and currency, quote source/expiry, minimum order, settlement route/fees, refund/failure allocation, delivery steps/window, cut-off/timezone, outage process and accountable escalation contact. | Missing or expired costs/terms, unsupported delivery promises or no accountable escalation route: no margin claim, SLA or orderable status. Apply the owner-approved margin floor when one exists. |
| 7. Market, policy and payment readiness | Correct seller/operator, customer terms, refund/delivery/privacy disclosures, tax/payment review where required, permitted payment method and support responsibilities for the exact journey. | Owner decision, processor eligibility or qualified legal/tax review is missing where required: keep that market/journey disabled. Do not interpret legal requirements on the owner's behalf. |
| 8. Technical and security readiness | Correct product/variant/region/price/customer-field data; server-side purchase validation; unavailable-item protection; private storage and least-privilege access; regression tests for the exact journey. | Any checkout, access-control, data-protection or migration prerequisite is unresolved: do not publish or bypass the release gate. Schema work remains subject to the approved Supabase cutover. |
| 9. Test and owner approval | A successful low-value end-to-end test for the exact product family and region, plus documented failure/refund handling; evidence references recorded without customer secrets. Explicit business-owner approval for the exact supplier + SKU/denomination + region + delivery route + market. | No test evidence or owner sign-off: the scope stays UNDER REVIEW or NOT ASSESSED and cannot be made orderable. |

### 10.3 Record the decision and its limits

For every decision, retain a dated record with:

- Supplier ID and scope ID.
- Exact MTDGC product/SKU, issuer, denomination, region, platform/account type and delivery route.
- Reviewer and business-owner decision-maker.
- Evidence references and the date each item was checked.
- Outcome, approved limitations, rejected conditions and next review/expiry date.

Use the existing statuses in section 5. VERIFIED — LIMITED SCOPE applies only to the exact approved rows and restrictions; it does not approve other SKUs, countries, denominations or routes. Even VERIFIED does not bypass the separate product, payment, market, policy, technical and test-order launch gates.

Only after all applicable gates and the recorded owner approval pass may an authorised operator request the normal reviewed catalogue release that makes the exact scope orderable. Do not change production product status, prices, supplier records or database schema as part of this documentation process.

### 10.4 Re-review and pause rules

Reopen the relevant gates whenever the legal supplier, source, issuer, SKU, denomination, region, platform/account model, price/quote, payment route, customer data shared, fulfilment method or supplier terms change; when evidence expires; or after an invalid/duplicate code, payment dispute, delivery failure or security incident. Suspend the affected scope while material evidence is rechecked. Preserve prior decisions and record the new outcome as a forward-dated change.

### 10.5 Current status

This workflow defines the approval process only. The supplier identity and product-scope tables above remain empty; no supplier, new category, product or market has been approved by this document. No supplier/customer was contacted, no purchase or test transaction was made, and no production catalogue or database record was changed. The register remains in Git until the approved Supabase cutover permits a separately reviewed persistent supplier model.
