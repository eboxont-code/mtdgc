# MTDGC Supplier Register

**Owner:** MTDGC  
**Register version:** 1.0  
**Created:** 6 November 2026  
**Canonical use:** Supplier identity, authority, product scope and verification evidence for MTDGC digital goods.

> **Important:** This is an internal due-diligence register, not a list of approved suppliers. No supplier is considered verified merely because a product exists in the catalogue, a price is available, a supplier claims to be a wholesaler, or a test message is received.

## 1. Operating rules

1. Maintain one supplier record per legal contracting entity. If a group has multiple entities, record the actual entity invoicing and supplying MTDGC.
2. Verify at the narrowest practical scope: supplier + product family/SKU + issuing region + denomination + delivery method. A supplier verified for one product or country is not automatically verified for another.
3. Never invent missing legal names, contacts, reseller status, contracts, product origins, delivery times or supplier prices. Use `Not supplied`, `Not verified` or `Not applicable`.
4. Do not mark a supplier or product scope `VERIFIED` without current evidence of authority, regional compatibility, supply origin, commercial terms and an accountable operational contact.
5. Do not request or store customer passwords, one-time passwords (OTPs), payment PINs or unnecessary account access. Reject a supplier workflow that requires these.
6. Keep private credentials, API keys, bank credentials and customer data out of this Markdown file and Git history. Store operational secrets only in the approved secret manager once an owner-approved integration exists.
7. A completed register does not itself approve a product for sale. Product, pricing, legal, payment, region and test-order launch gates still apply.
8. Preserve published Git history. Correct records with a forward commit; never rewrite shared history to conceal or alter supplier evidence.

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
- [ ] Supplier does not require customer passwords, OTPs, payment PINs, recovery codes or unsafe account access.
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

**Initial status:** Register structure created. Actual supplier population and verification remain separate evidence-dependent tasks under MT-0042–MT-0046 and MT-0043 in particular.
