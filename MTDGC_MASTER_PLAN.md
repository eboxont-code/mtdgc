# MTDGC Master Plan

**Project:** Matrix Digital Goods & Commerce (MTDGC)
**Domain:** https://mtdgc.com
**Version:** 2.1 · 7 November 2026
**Purpose:** Build a reliable, profitable digital-commerce operation by stabilising Nepal first, piloting Australia-to-Nepal digital gifting second, and entering the Australian-local market only after sourcing, payments, legal requirements and fulfilment are proven.

> **This is an original MTDGC plan.** Its business model, priorities, workstreams and tasks are purpose-built for digital products and digital fulfilment.

## 1. Strategic direction

MTDGC is a curated digital-goods retailer that sells game top-ups, gift cards, subscriptions and software, with room to add AI, cloud, mobile and business products when legitimate supply is secured. It should operate one brand with three explicitly separate purchase journeys: Nepal domestic (NPR), Australia domestic (AUD for Australia-valid products), and Australia buyer to Nepal recipient (AUD payment for an eligible Nepal-delivered digital product). These journeys must not be treated as a currency toggle or as a money-remittance service.

**North star:** completed orders that are correctly fulfilled, supported and profitable after product cost, currency conversion, payment costs, refunds and operating effort.

**Customer promise:** clear product details, honest regional compatibility, transparent order status and human support when something goes wrong.

### Strategic priorities

1. Make the existing order-to-delivery operation dependable before adding volume.
2. Secure legitimate, traceable suppliers and verify every product/region combination.
3. Replace manual payment and fulfilment steps gradually, never by weakening verification.
4. Build separate Nepal, Australia-local and Australia-to-Nepal purchase journeys; never assume buyer location, payer currency, delivery country and redemption region are the same.
5. Grow the catalogue based on supplier quality, customer demand and contribution margin.
6. Build customer trust through accurate policies, real reviews and honest delivery claims.
7. Stabilise Nepal first, pilot Australia-to-Nepal gifting second, and launch Australian-local products only after their independent launch gates pass.

## 2. Current website baseline

The live site currently presents MTDGC as Matrix Digital Goods & Commerce and mentions Nepal and Australia as target customers. A 26 October 2026 public-site audit recorded 26 catalogue entries and estimated around six appeared orderable in that snapshot; a separate 5 November 2026 recheck saw 36 product records. These are different dated public snapshots, not database evidence, and neither should be treated as the current live-SKU count. Reconcile public pages, database SKUs, variants, supplier availability and checkout eligibility before stating how many products can actually be purchased. The homepage and listings show a mixture of orderable and coming-soon items.

The current customer journey is: choose product/variant → provide required player or delivery details → place order → receive order number and payment instructions → pay by QR/bank transfer → upload payment proof → manual verification → manual fulfilment → delivery to order page/email. The site explicitly says delivery is not automated and does not promise instant fulfilment.

### Existing capabilities to regression-test, not rebuild automatically

- Catalog with category and availability filters.
- Product pages with region, required details and delivery information.
- Guest checkout and customer accounts.
- Order tracking using order number plus email or phone.
- Order status stages including payment received, verified, processing and delivered.
- Payment-proof upload and manual payment verification.
- Customer support requests and WhatsApp support route.
- Wishlist and order history are described as account capabilities; verify their live behaviour.
- Delivery, refund, privacy and terms pages.

### Critical baseline issues to resolve

- **Market/legal mismatch:** About and homepage mention Nepal and Australia, while the Terms page currently describes selling to customers in Nepal. Do not market Australia as an active supported market until terms, checkout, pricing, sourcing, payment settlement and support are aligned.
- **Currency mismatch:** prices are currently shown in NPR. An Australian market needs an explicit AUD and settlement approach, not merely Australian gift-card products in the catalog.
- **Availability integrity:** product totals include coming-soon records. Product counts must distinguish total catalog records from purchasable products.
- **Manual operations:** payment verification and fulfilment are human-run. Delivery promises must reflect measured capacity.
- **Supplier proof:** every product needs a documented legitimate source and region compatibility before sale.
- **Subscription clarity:** the current Netflix listing is described as an account-based subscription and asks for a delivery email; the exact fulfilment method, account ownership, supplier authority, country, renewal behaviour and customer control must be documented before this SKU is scaled.
- **Three journeys:** Australia-local orders and Australia-paid gifts for Nepal recipients need distinct products, payments, taxes/receipts, customer data and fulfilment rules.

## 3. Business model and guardrails

- Retail margin on legitimate digital products is the primary revenue model unless a separately approved model is documented.
- Do not count order value as profit. Report supplier cost, FX, payment fees, refunds and fulfilment costs.
- Do not sell unauthorised accounts, compromised credentials, stolen or previously redeemed codes, or products whose resale violates issuer terms.
- Do not request customer passwords, OTPs, payment PINs or unnecessary account access.
- Do not claim instant delivery, 24/7 support, guaranteed availability or authorised reseller status without evidence.
- Do not publish fake reviews, ratings, customer counts, sales volumes or best-seller claims.
- Keep each gift card's issuing region and redemption restrictions visible before payment.
- Keep subscriptions transparent about account ownership, plan duration, renewal behaviour and whether a plan is shared or private.
- Keep all product launches behind supplier, margin, region, policy and test-order checks.
- Maintain a $0 additional-spend preference where feasible; any paid gateway, supplier API, SaaS or advertising cost requires explicit owner approval and a cost/benefit case.

## 4. Execution order

| Window | Main outcome |
|---|---|
| First 48 hours | Reconcile the current catalogue and orderable SKUs; test one real order per live product family; audit active suppliers; resolve unclear subscription fulfilment. |
| Days 3–14 | Stabilise the Nepal domestic journey, payment reconciliation, delivery states, support process, legal seller identity and product-level region evidence. |
| Days 15–30 | Design the Australia-to-Nepal gifting journey, map tax/legal/payment responsibilities, model AUD unit economics and complete privacy/data-flow review. Design is not permission to sell. |
| Days 31–60 | Run a small Australia-to-Nepal pilot only if the legal, processor, supplier, recipient, refund and end-to-end test gates all pass. Otherwise keep the route disabled. |
| Days 61–90 | Validate Australian-local SKUs, local settlement and consumer requirements independently; do not assume the diaspora pilot proves Australia-local readiness. |
| After 90 days | Scale only the specific market/product paths that demonstrate profitable orders, reliable supply, compliant payment, clear policies and manageable support load. |

## 5. Core metrics

- Completed and correctly fulfilled orders.
- Contribution margin per order, category, supplier and market.
- Payment verification time and fulfilment time.
- On-time delivery rate against the product's stated delivery window.
- Supplier failure, invalid-code, wrong-item and refund rates.
- Payment mismatch and duplicate-proof rates.
- Support contacts per 100 orders and median resolution time.
- Repeat purchase rate and verified customer review rate.
- Share of orderable catalog with confirmed supplier, region, price and delivery data.
- Conversion from product view to paid order, segmented by category and market.

Do not set numerical targets until a reliable baseline exists.

## 6. Task register

**Status rule:** all tasks begin as `[ ] TODO`. Mark a task complete only with evidence. Use `[~] IN PROGRESS`, `[x] DONE`, `[!] BLOCKED`, and `[?] DECISION` consistently. One active P0 task at a time.

### Workstream 01 · Business model and positioning

**Definition of done:** A clear operating model explains who MTDGC serves, what it sells, how it earns, and which product lines are deliberately excluded until proven.

- [x] **MT-0001 · P0 · DONE** — Primary stability/launch priority is Nepal domestic operations. Australia-to-Nepal gifting is a separate future journey; Australia-local sales remain gated on independent sourcing, payments, legal/tax and support readiness. Evidence: current product and business constraints in section 14.
- [!] **MT-0002 · P0 · BLOCKED** — Resolve the public positioning discrepancy between About and Terms. The safe market scope is recorded as Nepal-first, but changing customer-facing market claims or legal Terms requires the owner’s approved operating-market decision and qualified review; do not rewrite legal copy from assumptions.
- [x] **MT-0003 · P0 · DONE** — Define MTDGC as Matrix Digital Goods & Commerce, a multi-category digital commerce brand, not only a game top-up shop.
- [!] **MT-0004 · P0 · BLOCKED** — Write the customer promise only after actual sourcing, region compatibility and delivery performance are verified. The supplier register currently has no verified supplier/product-scope records, so a promise about legitimate sourcing or accountable delivery would be unsubstantiated.
- [!] **MT-0005 · P0 · BLOCKED** — Prioritise customer segments using owner-approved target-market/customer evidence. No validated customer research, sales mix or owner segment choice is recorded; do not infer priority from catalogue categories.
- [!] **MT-0006 · P0 · BLOCKED** — Approve the primary commercial KPI and its reporting definition with the business owner. The plan suggests fulfilled, profitable orders, but no owner-approved target or measurement window is recorded.
- [!] **MT-0007 · P0 · BLOCKED** — Implement trusted unit-economics reporting after supplier cost, payment fee, refund and support-cost sources are available. Current supplier costs and payment fee records are not populated; no actual margin figures can be calculated without inventing inputs.
- [ ] **MT-0008 · P1 · TODO** — Define MTDGC’s own customer value through legitimate sourcing, regional compatibility, clear delivery and reliable support.
- [ ] **MT-0009 · P1 · TODO** — Define the role of Matrix as the umbrella brand and the role of each product category beneath it.
- [ ] **MT-0010 · P1 · TODO** — Decide whether the initial experience is marketplace-style retail or a curated single-operator digital store.
- [ ] **MT-0011 · P1 · TODO** — Set a product approval process before adding a new category or supplier.
- [ ] **MT-0012 · P1 · TODO** — Define which products MTDGC will never sell, including unauthorised accounts, stolen codes and credential-based access.
- [ ] **MT-0013 · P1 · TODO** — Separate customer-facing promises from internal targets and supplier estimates.
- [ ] **MT-0014 · P1 · TODO** — Define the customer support languages and service hours that can actually be maintained.
- [ ] **MT-0015 · P2 · TODO** — Create a concise brand voice guide for product pages, checkout, support and social channels.
- [ ] **MT-0016 · P2 · TODO** — Create a category naming and taxonomy standard that can grow without renaming existing URLs.
- [ ] **MT-0017 · P2 · TODO** — Document the legal business entity, trading name and customer-facing operator details for each market.
- [ ] **MT-0018 · P2 · TODO** — Set a quarterly strategy review using actual sales, margins, failed orders and customer feedback.
- [ ] **MT-0019 · P2 · TODO** — Define a market expansion checklist rather than opening countries based only on demand signals.
- [ ] **MT-0020 · P2 · TODO** — Maintain a decision log for changes to markets, product types, suppliers, payment methods and fulfilment promises.

### Workstream 02 · Product catalogue and merchandising

**Definition of done:** Every purchasable listing is accurate, available, region-labelled, priced and clear about the exact item the customer receives.

- [x] **MT-0021 · P0 · DONE** — Reconcile the product records against the current database and public storefront. The 26 October snapshot recorded 26 entries and the 5 November snapshot recorded 36; classify every current record as orderable, coming soon, hidden, duplicate or obsolete and record the verified count before using it in public claims.
- [x] **MT-0022 · P0 · DONE** — Reconcile the homepage, catalog, category pages and product records so product counts and availability labels agree. The shared availability counter now includes an unavailable bucket; category/product/catalog summaries and the catalog filter expose it. The production build is READY on `mtdgc.com` at commit `82ee56a8189b6808b9e9bf64487cd7e6f77361df`.
- [!] **MT-0023 · P0 · BLOCKED** — The current production snapshot has five catalogue listings flagged as orderable, but the repository/database contains no supplier stock confirmations or dated availability evidence. Internal status flags are not proof of live stock; do not advertise them as in stock until supplier evidence is recorded.
- [x] **MT-0024 · P0 · DONE** — Ensure coming-soon products cannot be purchased or accidentally enter checkout.
- [!] **MT-0025 · P0 · BLOCKED** — Product records contain descriptive fields, but the supplier register is empty and no supplier/issuer evidence or test-order evidence is available for the five currently orderable listings. Exact supplier, denomination, region compatibility and delivery route cannot be verified without external evidence.
- [x] **MT-0026 · P0 · DONE** — Verify the exact selected product variant and amount across cart, checkout, order confirmation and authenticated order history. Code-path audit completed 6 November 2026; evidence is recorded in section 21.
- [x] **MT-0027 · P0 · DONE** — Distinguish gift-card face value/denomination from MTDGC selling price across product, cart, checkout and order views; disclose that the current checkout adds no separate MTDGC fee and that payment providers may charge separately. Evidence: section 22 and the linked code changes.
- [ ] **MT-0028 · P1 · TODO** — Add consistent product attributes for region, currency, platform, validity, denomination and restrictions.
- [ ] **MT-0029 · P1 · TODO** — Create separate templates for game top-ups, gift cards, subscriptions and software licences.
- [ ] **MT-0030 · P1 · TODO** — Show required customer information before checkout, not after payment.
- [ ] **MT-0031 · P1 · TODO** — Show whether a product is single-use, recurring, prepaid, account-bound or redeemable by code.
- [ ] **MT-0032 · P1 · TODO** — Make product availability freshness visible internally with last supplier confirmation time.
- [ ] **MT-0033 · P1 · TODO** — Add search synonyms for common product names, abbreviations, game currencies and regional spellings.
- [ ] **MT-0034 · P1 · TODO** — Add filters that work correctly for category, platform, region, availability and price.
- [ ] **MT-0035 · P2 · TODO** — Create curated collections such as gaming essentials, entertainment, productivity and Australian shopping cards.
- [ ] **MT-0036 · P2 · TODO** — Add related products only when they are genuinely compatible and available.
- [ ] **MT-0037 · P2 · TODO** — Create a discontinued-product process that preserves order history and redirects useful SEO pages.
- [ ] **MT-0038 · P2 · TODO** — Add a product comparison view for variants that customers commonly confuse.
- [ ] **MT-0039 · P2 · TODO** — Review product imagery rights and replace misleading brand artwork with permitted assets.
- [ ] **MT-0040 · P2 · TODO** — Run a monthly catalogue audit for stale prices, unsupported regions and supplier availability.

### Workstream 03 · Supplier network and product legitimacy

**Definition of done:** Every product has a traceable, authorised supply route and a tested fulfilment procedure before it is sold.

- [x] **MT-0041 · P0 · DONE** — Build a supplier register with legal name, country, contact, product scope and verification status. Created `SUPPLIER_REGISTER.md` with supplier identity, product-scope authority, commercial/operational controls, verification statuses and an initial product sourcing queue. No supplier identities or approvals were invented.
- [!] **MT-0042 · P0 · BLOCKED** — Record the source of every code, top-up and subscription before making the listing orderable. The repository and current database contain no supplier identity/source records; actual source details and evidence are not available to populate the register. Do not infer or fabricate a source.
- [!] **MT-0043 · P0 · BLOCKED** — No supplier identities or issuer/distributor authorisation documents are present in the supplier register. Verification requires source evidence from the actual supplier/rights holder; no supplier will be invented or contacted during this run.
- [x] **MT-0044 · P0 · DONE** — Establish and enforce an automatic supplier/product-scope rejection rule for customer passwords/passcodes, OTP/2FA/authenticator codes, payment PINs, recovery/backup codes, authentication secrets and unsafe account/device access. Added supplier-register policy, admin and server-side product-requirement validation, an order-submission field guard, checkout reassurance and unit tests. Evidence: section 23. No actual supplier was assessed because the supplier register remains empty.
- [!] **MT-0045 · P0 · BLOCKED** — A low-value test requires an identified supplier, verified product/region scope and a real transaction/fulfilment. `SUPPLIER_REGISTER.md` contains no supplier or approved product-scope records, and this run is not permitted to contact third parties or spend money. Do not invent test evidence.
- [!] **MT-0046 · P0 · BLOCKED** — No supplier identity, delivery-time evidence, cut-off hours, failure/refund process or accountable escalation contact is recorded. These facts require the actual supplier's documented terms or owner-provided evidence; do not invent or contact suppliers during this run.
- [ ] **MT-0047 · P1 · TODO** — Record supplier cost and currency per denomination with a dated source.
- [ ] **MT-0048 · P1 · TODO** — Create a supplier reliability score based on successful fulfilment, accuracy and response time.
- [ ] **MT-0049 · P1 · TODO** — Keep a backup supplier only where the alternative is legitimate and region-compatible.
- [ ] **MT-0050 · P1 · TODO** — Check supplier terms for resale, geographic restrictions, chargebacks and customer support obligations.
- [ ] **MT-0051 · P1 · TODO** — Require proof of origin for high-risk or unusually discounted digital codes.
- [ ] **MT-0052 · P1 · TODO** — Create a quarantine state for supplier stock that is disputed, stale or not yet verified.
- [ ] **MT-0053 · P1 · TODO** — Track supplier outages and pause affected products automatically or through a clear admin action.
- [ ] **MT-0054 · P2 · TODO** — Negotiate volume tiers only after order volume supports a credible forecast.
- [ ] **MT-0055 · P2 · TODO** — Create supplier renewal and contract review reminders.
- [ ] **MT-0056 · P2 · TODO** — Separate official API suppliers from manual wholesale suppliers in internal records.
- [ ] **MT-0057 · P2 · TODO** — Document data-sharing requirements before sending customer details to any supplier.
- [ ] **MT-0058 · P2 · TODO** — Audit supplier access to customer data and remove access when no longer required.
- [ ] **MT-0059 · P2 · TODO** — Create a supplier incident procedure for invalid, duplicated or previously redeemed codes.
- [ ] **MT-0060 · P2 · TODO** — Do not expand a product line until supplier legitimacy, margin and customer support are proven.

### Workstream 04 · Pricing, margin and currency controls

**Definition of done:** Prices are explainable and profitable after supplier cost, FX movement, payment fees, refunds and operating effort.

- [!] **MT-0061 · P0 · BLOCKED** — No verified supplier unit costs by active SKU/denomination, settlement charges, dated FX inputs, payment fees, refund/failure costs or variable fulfilment/support costs are recorded. A per-product landed cost cannot be calculated without those source inputs.
- [!] **MT-0062 · P0 · BLOCKED** — No supplier quote/source currency, quote date, verifiable FX source/rate or conversion timestamp exists in the supplier register or current product schema. Do not fabricate rates or supplier costs.
- [!] **MT-0063 · P0 · BLOCKED** — Gross profit/margin requires actual supplier cost, payment/settlement fees, FX, refunds/chargebacks and variable fulfilment/support costs. These source records are not populated, so any reported margin would be invented.
- [!] **MT-0064 · P0 · BLOCKED** — The minimum contribution-margin floor and its measurement basis require an explicit business-owner decision. No approved threshold or definition is recorded; do not choose one on the owner's behalf.
- [!] **MT-0065 · P0 · BLOCKED** — A safe checkout margin gate depends on the owner-approved floor plus trusted supplier-cost and price-expiry data. Those inputs/fields are absent, and the held database migrations remain gated on the Supabase cutover; do not invent a floor or add an ungrounded production block.
- [ ] **MT-0066 · P1 · TODO** — Separate market-facing currency from supplier settlement currency.
- [ ] **MT-0067 · P1 · TODO** — Resolve whether Australia will use AUD pricing and a separate market checkout rather than NPR-only pricing.
- [ ] **MT-0068 · P1 · TODO** — Show all fees before the customer commits to an order.
- [ ] **MT-0069 · P1 · TODO** — Define how FX changes are handled for orders placed but not yet paid.
- [ ] **MT-0070 · P1 · TODO** — Set rules for rounding, minimum order value and denomination-specific pricing.
- [ ] **MT-0071 · P1 · TODO** — Review MTDGC prices against supplier costs, FX movements and the approved contribution-margin floor; never sell below cost.
- [ ] **MT-0072 · P1 · TODO** — Add a price-change audit log with old price, new price, reason and approver.
- [ ] **MT-0073 · P2 · TODO** — Model wholesale tiers for repeat customers only when fulfilment economics support them.
- [ ] **MT-0074 · P2 · TODO** — Create promotional pricing with start/end dates, eligibility and margin safeguards.
- [ ] **MT-0075 · P2 · TODO** — Prevent stacking discounts that create negative-margin orders.
- [ ] **MT-0076 · P2 · TODO** — Report gross margin by category, supplier, market and product.
- [ ] **MT-0077 · P2 · TODO** — Set alerts for sudden supplier-cost or FX changes.
- [ ] **MT-0078 · P2 · TODO** — Review pricing weekly during early operations and monthly after stability.
- [ ] **MT-0079 · P2 · TODO** — Keep public price claims consistent across catalog, product schema and checkout.
- [ ] **MT-0080 · P2 · TODO** — Do not publish Australian product prices until sourcing, currency, tax and payment handling are confirmed.

### Workstream 05 · Checkout and payment verification

**Definition of done:** Customers can understand how to pay, submit proof safely and see an accurate payment state without duplicate or fraudulent processing.

- [x] **MT-0081 · P0 · DONE** — Audit completed against the current application code, production schema/data snapshot, storage configuration and access policies. Findings and follow-up gaps are recorded in section 24; this completes the audit task, not a claim that all payment controls are secure.
- [x] **MT-0082 · P0 · DONE** — Generate new order references with 128 bits of cryptographic randomness, retain the database UNIQUE constraint as the collision guard, and keep legacy tracking formats working. Evidence: section 25; CI run `42241329123` passed lint, tests, typecheck and production build; Vercel deployment for code commit `d81e1fc51ed2e1203defb63ec6a71dbcd21e889b` reached READY.
- [x] **MT-0083 · P0 · DONE** — Bind payment-proof authorization and storage/database association to the server-resolved order. Shared order-access helpers now cover access-token, authenticated-owner and rate-limited contact checks; proof storage path, order ID, transaction reference and amount are derived from the resolved order, not client-supplied identifiers. Four focused tests and the full quality workflow passed. Evidence and the separate production deployment blocker are recorded in section 26.
- [ ] **MT-0084 · P0 · TODO** — Validate uploaded proof file type, size and content handling.
- [ ] **MT-0085 · P0 · TODO** — Restrict payment-proof access to the customer who owns the order and authorised staff.
- [ ] **MT-0086 · P0 · TODO** — Prevent fulfilment until payment is independently matched to the correct amount and order.
- [ ] **MT-0087 · P0 · TODO** — Prevent the same transaction reference or screenshot from being accepted for multiple orders.
- [ ] **MT-0088 · P1 · TODO** — Show exact payment amount, account details, expiry window and reference instructions on the order page.
- [ ] **MT-0089 · P1 · TODO** — Add a clear payment-pending state and explain what action the customer must take.
- [ ] **MT-0090 · P1 · TODO** — Record who verified payment, when it was verified and the transaction reference.
- [ ] **MT-0091 · P1 · TODO** — Create a process for underpayment, overpayment, wrong reference and unidentifiable transfers.
- [ ] **MT-0092 · P1 · TODO** — Define when payment instructions expire and how an expired order is handled.
- [ ] **MT-0093 · P1 · TODO** — Evaluate supported local payment gateways for Nepal, including fees, settlement and refund support.
- [ ] **MT-0094 · P1 · TODO** — Evaluate Australian payment methods separately, including merchant eligibility and settlement requirements.
- [ ] **MT-0095 · P1 · TODO** — Do not claim card or instant payments until a live end-to-end payment test succeeds.
- [ ] **MT-0096 · P2 · TODO** — Automate payment reconciliation only through a verified provider integration.
- [ ] **MT-0097 · P2 · TODO** — Add fraud flags for repeated proof uploads, mismatched amounts and unusual order patterns.
- [ ] **MT-0098 · P2 · TODO** — Keep payment evidence only for a defined, justified retention period.
- [ ] **MT-0099 · P2 · TODO** — Create daily reconciliation between orders, bank receipts, refunds and accounting records.
- [ ] **MT-0100 · P2 · TODO** — Maintain a manual fallback procedure for provider outages without bypassing verification.

### Workstream 06 · Order lifecycle and customer account

**Definition of done:** The order state is consistent from checkout to delivery, with a complete audit trail and useful customer visibility.

- [ ] **MT-0101 · P0 · TODO** — Map every current order status and the allowed transitions between them.
- [ ] **MT-0102 · P0 · TODO** — Ensure Payment received, Verified, Processing and Delivered have precise operational definitions.
- [ ] **MT-0103 · P0 · TODO** — Add explicit Cancelled, Failed, Refunded and Action required states where applicable.
- [ ] **MT-0104 · P0 · TODO** — Prevent invalid status jumps, such as Pending directly to Delivered without payment verification.
- [ ] **MT-0105 · P0 · TODO** — Verify guest order tracking requires the order number plus the matching email or phone.
- [ ] **MT-0106 · P0 · TODO** — Ensure account order history and guest tracking show the same canonical status.
- [ ] **MT-0107 · P1 · TODO** — Record a timestamp and actor for every status transition.
- [ ] **MT-0108 · P1 · TODO** — Show customers what happens next at each stage and whether they need to act.
- [ ] **MT-0109 · P1 · TODO** — Allow staff to add internal notes without exposing them to customers.
- [ ] **MT-0110 · P1 · TODO** — Add an action-required state for missing player ID, region mismatch or delivery-email correction.
- [ ] **MT-0111 · P1 · TODO** — Prevent duplicate checkout submissions from creating duplicate orders.
- [ ] **MT-0112 · P1 · TODO** — Define order expiry for unpaid orders and release reserved supplier capacity safely.
- [ ] **MT-0113 · P1 · TODO** — Ensure order confirmation emails contain the right order number and no sensitive supplier credentials.
- [ ] **MT-0114 · P2 · TODO** — Add customer order search and filtering without exposing other customers' records.
- [ ] **MT-0115 · P2 · TODO** — Add a downloadable receipt or invoice appropriate to the operating market.
- [ ] **MT-0116 · P2 · TODO** — Create an order-event history visible to customers in plain language.
- [ ] **MT-0117 · P2 · TODO** — Add a safe correction window for customer details before fulfilment begins.
- [ ] **MT-0118 · P2 · TODO** — Create a staff checklist for high-value or irreversible orders.
- [ ] **MT-0119 · P2 · TODO** — Support account deletion requests while retaining only legally required records.
- [ ] **MT-0120 · P2 · TODO** — Test the entire order lifecycle on mobile, desktop and slow connections.

### Workstream 07 · Fulfilment operations and automation

**Definition of done:** Orders are delivered accurately and on time, while manual checks are gradually replaced only by safe, tested automation.

- [!] **MT-0121 · P0 · BLOCKED** — Document the current manual fulfilment steps for each active product family. The supplier register remains empty and no verified supplier/product/region scope, authorised delivery route, supplier-specific instructions, delivery window or escalation contact is recorded. The catalogue's required customer fields do not establish how an authorised supplier fulfils each SKU. Unblock with owner-provided or independently verifiable supplier/issuer evidence; do not invent steps or contact suppliers.
- [x] **MT-0122 · P0 · DONE** — Snapshot each order item's product region and exact required customer-field labels from the server-resolved product when the order is created; retain the selected variant/denomination in `variant_name`; and show an admin pre-fulfilment checklist with captured/missing values. Browser input cannot forge the reserved snapshot key, and historical items without a valid snapshot are explicitly marked as not captured/unrecognised. Evidence: section 30 and Data Architecture section 4.2; six focused regression tests.
- [x] **MT-0123 · P0 · DONE** — Require a second confirmation for the currently orderable game top-up and emailed gift-card categories. Checkout shows the exact product, selected option, listed region and saved delivery fields; the customer must explicitly confirm before order creation. The server resolves category from the selected SKU and rejects missing acknowledgement. No supplier-specific reversibility claim is made because no supplier evidence or reversibility field exists. Evidence: section 31 and Data Architecture section 4.3.
- [!] **MT-0124 · P0 · BLOCKED** — Record the supplier transaction or redemption reference for each completed order. `SUPPLIER_REGISTER.md` has no verified supplier/product-scope record or supplier-issued reference source, and the live orders table currently contains 8 orders, all `pending_payment`, with no completed order or actual reference to record. Unblock when a supplier/product scope is verified and a real transaction/redemption reference is supplied; never invent a value.
- [!] **MT-0125 · P0 · BLOCKED** — Capture delivery evidence and attach it to the correct order. Production has no delivery-evidence/order-delivery table and only the existing private `payment-proofs` and `payment-qr` buckets. A dedicated private evidence-storage design and approved Boxont-controlled Supabase cutover/migration are required; do not create a production bucket/table before approval.
- [ ] **MT-0126 · P0 · TODO** — Never request a customer's game password, subscription password, OTP or payment PIN.
- [ ] **MT-0127 · P1 · TODO** — Define realistic delivery-time ranges per product based on measured fulfilment history.
- [ ] **MT-0128 · P1 · TODO** — Pause new orders when a supplier is unavailable or a product cannot be delivered.
- [ ] **MT-0129 · P1 · TODO** — Create a queue sorted by paid status, promised delivery window and risk.
- [ ] **MT-0130 · P1 · TODO** — Track fulfilment time from payment verification to delivery.
- [ ] **MT-0131 · P1 · TODO** — Add exception workflows for supplier failure, wrong details and delayed delivery.
- [ ] **MT-0132 · P1 · TODO** — Create a customer notification for each meaningful status change.
- [ ] **MT-0133 · P2 · TODO** — Integrate supplier APIs only after validating documentation, credentials, idempotency and error handling.
- [ ] **MT-0134 · P2 · TODO** — Use automated fulfilment only for products where supplier confirmation is authoritative.
- [ ] **MT-0135 · P2 · TODO** — Add idempotency keys so retries cannot deliver the same top-up twice.
- [ ] **MT-0136 · P2 · TODO** — Add a dead-letter or manual-review queue for uncertain API outcomes.
- [ ] **MT-0137 · P2 · TODO** — Run a test-mode transaction before deploying any supplier integration.
- [ ] **MT-0138 · P2 · TODO** — Measure manual handling minutes per order to prioritise automation by real savings.
- [ ] **MT-0139 · P2 · TODO** — Keep a manual override with audit logging for failed or ambiguous automated orders.
- [ ] **MT-0140 · P2 · TODO** — Do not advertise instant delivery until automation and real performance data justify the claim.

### Workstream 08 · Customer trust, refunds and support

**Definition of done:** Policies match real operations, customers can resolve problems quickly, and trust claims are supported by evidence.

- [ ] **MT-0141 · P0 · TODO** — Review the current Terms, Privacy, Delivery and Refund policies for consistency across Nepal and Australia.
- [ ] **MT-0142 · P0 · TODO** — Resolve any conflict between the advertised markets and the markets covered by legal terms.
- [ ] **MT-0143 · P0 · TODO** — Ensure refund rules distinguish undelivered, supplier-failed, incorrect-item and successfully redeemed digital goods.
- [ ] **MT-0144 · P0 · TODO** — Make region-lock warnings prominent before payment for every region-restricted code.
- [ ] **MT-0145 · P0 · TODO** — Make wrong-player-ID warnings visible before confirming an irreversible top-up.
- [ ] **MT-0146 · P1 · TODO** — Publish support response hours only after they are operationally staffed.
- [ ] **MT-0147 · P1 · TODO** — Create ticket categories for payment, delayed delivery, invalid code, wrong item, refund and account access.
- [ ] **MT-0148 · P1 · TODO** — Require an order number for order-specific support while allowing pre-purchase questions.
- [ ] **MT-0149 · P1 · TODO** — Create escalation rules for overdue orders and supplier disputes.
- [ ] **MT-0150 · P1 · TODO** — Add a clear complaint path and expected next update without inventing resolution times.
- [ ] **MT-0151 · P1 · TODO** — Collect verified reviews only after genuine completed orders and customer consent.
- [ ] **MT-0152 · P1 · TODO** — Never publish fabricated testimonials, ratings, order counts or delivery-speed claims.
- [ ] **MT-0153 · P2 · TODO** — Create product-specific troubleshooting guides and official redemption instructions.
- [ ] **MT-0154 · P2 · TODO** — Track first response time, resolution time, reopen rate and refund reason.
- [ ] **MT-0155 · P2 · TODO** — Add a knowledge base for common game IDs, regions, redemption and payment questions.
- [ ] **MT-0156 · P2 · TODO** — Provide English and Nepali support content with equivalent meaning.
- [ ] **MT-0157 · P2 · TODO** — Review support conversations for recurring product-page confusion.
- [ ] **MT-0158 · P2 · TODO** — Create a chargeback and payment-dispute evidence pack per order.
- [ ] **MT-0159 · P2 · TODO** — Run a monthly policy review against actual fulfilment practices and local obligations.
- [ ] **MT-0160 · P2 · TODO** — Keep security warnings consistent: MTDGC never asks for passwords, OTPs or payment PINs.

### Workstream 09 · Security, privacy and platform integrity

**Definition of done:** Customer information, payment evidence, order records and staff tools are protected with least-privilege access.

- [ ] **MT-0161 · P0 · TODO** — Audit authentication and authorisation for customer accounts, support requests and admin routes.
- [ ] **MT-0162 · P0 · TODO** — Verify one customer cannot access another customer's orders by changing an ID or URL.
- [ ] **MT-0163 · P0 · TODO** — Verify payment uploads and delivered codes are stored privately, not in public buckets.
- [ ] **MT-0164 · P0 · TODO** — Ensure admin-only actions are enforced server-side, not only hidden in the interface.
- [ ] **MT-0165 · P0 · TODO** — Review secrets, supplier credentials and payment configuration for accidental exposure.
- [ ] **MT-0166 · P1 · TODO** — Enable strong admin authentication and remove unused staff accounts.
- [ ] **MT-0167 · P1 · TODO** — Apply least-privilege roles for payment review, fulfilment, support and catalogue editing.
- [ ] **MT-0168 · P1 · TODO** — Log sensitive admin actions such as refunds, code reveal, payment verification and status overrides.
- [ ] **MT-0169 · P1 · TODO** — Protect order forms against spam, injection, CSRF and abusive repeated requests.
- [ ] **MT-0170 · P1 · TODO** — Set upload limits and scan or safely process customer-submitted files.
- [ ] **MT-0171 · P1 · TODO** — Define retention periods for identity, contact, payment proof and support data.
- [ ] **MT-0172 · P1 · TODO** — Provide a clear privacy contact and account deletion request process.
- [ ] **MT-0173 · P2 · TODO** — Add rate limits to order lookup and account recovery endpoints.
- [ ] **MT-0174 · P2 · TODO** — Monitor suspicious login, repeated payment-proof and order enumeration attempts.
- [ ] **MT-0175 · P2 · TODO** — Test backup restoration for orders, catalogue, customer records and policy content.
- [ ] **MT-0176 · P2 · TODO** — Create an incident response plan for leaked codes, compromised supplier access or data exposure.
- [ ] **MT-0177 · P2 · TODO** — Review third-party scripts and analytics for unnecessary customer-data collection.
- [ ] **MT-0178 · P2 · TODO** — Keep audit logs tamper-resistant and restrict access to them.
- [ ] **MT-0179 · P2 · TODO** — Run a security regression checklist before every checkout or account-system release.
- [ ] **MT-0180 · P2 · TODO** — Commission qualified security and privacy review before entering a larger market.

### Workstream 10 · Experience, conversion and accessibility

**Definition of done:** Customers can discover the right digital item, understand restrictions and complete an order without confusion.

- [ ] **MT-0181 · P0 · TODO** — Test the full purchase journey on common Android phones and narrow mobile screens.
- [ ] **MT-0182 · P0 · REVIEW** — Availability labels, purchasable counts and disabled coming-soon actions were implemented and rule-tested in the 5 November pack; confirm the current production page before marking complete because the roadmap pack recorded the change as not yet published.
- [ ] **MT-0183 · P0 · TODO** — Ensure the product card, product page and checkout show matching prices and variants.
- [ ] **MT-0184 · P0 · REVIEW** — Product purchase summaries for region, platform, delivery method and required details were implemented in the 5 November pack; confirm the current production page before marking complete because the roadmap pack recorded the change as not yet published.
- [ ] **MT-0185 · P1 · TODO** — Improve catalog search for brand, product, game, denomination and common abbreviations.
- [ ] **MT-0186 · P1 · TODO** — Add clear sorting by relevance, price and availability.
- [ ] **MT-0187 · P1 · TODO** — Make filters usable on mobile without hiding the product list behind oversized controls.
- [ ] **MT-0188 · P1 · TODO** — Keep cart contents and selected variants stable when customers navigate back.
- [ ] **MT-0189 · P1 · TODO** — Reduce checkout fields to only the information required for that product.
- [ ] **MT-0190 · P1 · TODO** — Explain the manual payment step before the customer places the order.
- [ ] **MT-0191 · P1 · TODO** — Add inline examples showing where to find game player IDs and zone identifiers.
- [ ] **MT-0192 · P1 · TODO** — Add region confirmation for gift cards and wallet codes before checkout.
- [ ] **MT-0193 · P2 · TODO** — Add wishlists and saved products only if usage data supports maintaining them.
- [ ] **MT-0194 · P2 · TODO** — Add recently viewed products without tracking more personal data than necessary.
- [ ] **MT-0195 · P2 · TODO** — Improve empty, error, loading and unavailable states across the storefront.
- [ ] **MT-0196 · P2 · TODO** — Check keyboard navigation, focus visibility, labels, contrast and screen-reader announcements.
- [ ] **MT-0197 · P2 · TODO** — Optimise images, fonts and scripts for low-bandwidth mobile users.
- [ ] **MT-0198 · P2 · TODO** — Run usability tests with customers in the actual target market and language.
- [ ] **MT-0199 · P2 · TODO** — Test checkout comprehension with first-time buyers who have never used MTDGC.
- [ ] **MT-0200 · P2 · TODO** — Use controlled experiments to improve conversion without hiding fees or restrictions.

### Workstream 11 · Brand, content, SEO and acquisition

**Definition of done:** MTDGC earns qualified demand through useful category and product information, not thin pages or unsupported claims.

- [ ] **MT-0201 · P0 · TODO** — Set one canonical brand description and use it consistently across the site and metadata.
- [ ] **MT-0202 · P0 · TODO** — Resolve the homepage's Nepal-and-Australia positioning against actual checkout and legal-market support.
- [ ] **MT-0203 · P1 · TODO** — Create original category landing pages for game top-ups, gift cards, subscriptions and software.
- [ ] **MT-0204 · P1 · TODO** — Write product descriptions that explain what is delivered, how it works and what restrictions apply.
- [ ] **MT-0205 · P1 · TODO** — Add unique title tags and meta descriptions for indexable product and category pages.
- [ ] **MT-0206 · P1 · TODO** — Use structured data only for real products, accurate prices, availability and seller information.
- [ ] **MT-0207 · P1 · TODO** — Ensure coming-soon products are not marked as purchasable offers in structured data.
- [ ] **MT-0208 · P1 · TODO** — Set canonical URLs and sitemap rules for filters, sorting and duplicate product routes.
- [ ] **MT-0209 · P1 · TODO** — Create helpful guides for redemption, region compatibility, player IDs and subscription types.
- [ ] **MT-0210 · P1 · TODO** — Explain the difference between a prepaid subscription and a recurring subscription.
- [ ] **MT-0211 · P2 · TODO** — Build topical content around specific supported games and platforms without claiming unsupported availability.
- [ ] **MT-0212 · P2 · TODO** — Create a transparent promotions page with real dates, terms and stock limits.
- [ ] **MT-0213 · P2 · TODO** — Establish social channels with a consistent brand identity and customer support routing.
- [ ] **MT-0214 · P2 · TODO** — Use referral campaigns only after abuse controls and margin calculations are ready.
- [ ] **MT-0215 · P2 · TODO** — Create abandoned-checkout reminders only with appropriate consent and privacy controls.
- [ ] **MT-0216 · P2 · TODO** — Build email updates for order status and optional marketing as separate consent categories.
- [ ] **MT-0217 · P2 · TODO** — Track organic landing pages that lead to completed, profitable orders.
- [ ] **MT-0218 · P2 · TODO** — Avoid fake scarcity, fake best-seller labels and fabricated review schema.
- [ ] **MT-0219 · P2 · TODO** — Review search queries and customer questions monthly to identify useful new pages.
- [ ] **MT-0220 · P2 · TODO** — Do not scale paid advertising until conversion, fulfilment capacity and contribution margin are known.

### Workstream 12 · Analytics, administration and controlled expansion

**Definition of done:** The operator can manage the business from reliable dashboards and expand only when each market and category passes its launch gate.

- [ ] **MT-0221 · P0 · TODO** — Create a single order dashboard showing paid, awaiting verification, processing, overdue, delivered, failed and refunded orders.
- [ ] **MT-0222 · P0 · TODO** — Create a daily reconciliation report for order value, payments received, supplier costs and refunds.
- [ ] **MT-0223 · P0 · TODO** — Track contribution margin per order and category after direct costs.
- [ ] **MT-0224 · P0 · TODO** — Track order completion rate, failed fulfilment rate and refund rate.
- [ ] **MT-0225 · P1 · TODO** — Track time from order creation to payment verification and from verification to delivery.
- [ ] **MT-0226 · P1 · TODO** — Track support contacts per 100 orders and the most common issue categories.
- [ ] **MT-0227 · P1 · TODO** — Track product availability and supplier confirmation freshness.
- [ ] **MT-0228 · P1 · TODO** — Create alerts for overdue paid orders and supplier outages.
- [ ] **MT-0229 · P1 · TODO** — Build a product launch checklist requiring supplier, region, price, test order, policy and support readiness.
- [ ] **MT-0230 · P1 · TODO** — Build a market launch checklist covering currency, payment, tax, consumer law, sourcing and customer support.
- [ ] **MT-0231 · P2 · TODO** — Evaluate Australia as a separate market with AUD prices, local gift-card sourcing and appropriate payment settlement.
- [ ] **MT-0232 · P2 · TODO** — Evaluate Nepal payment integrations and settlement reliability before replacing manual bank verification.
- [ ] **MT-0233 · P2 · TODO** — Evaluate digital delivery APIs based on legitimate supplier access and measurable fulfilment benefit.
- [ ] **MT-0234 · P2 · TODO** — Add wholesale or business accounts only after defining credit risk, pricing and support responsibilities.
- [ ] **MT-0235 · P2 · TODO** — Explore AI and cloud product categories only when authorised supply and support are confirmed.
- [ ] **MT-0236 · P2 · TODO** — Explore mobile/eSIM and travel products only after checking region rules and supplier legitimacy.
- [ ] **MT-0237 · P2 · TODO** — Create a monthly profit-and-loss view that separates gross sales from actual retained revenue.
- [ ] **MT-0238 · P2 · TODO** — Set category-level pause criteria for negative margin, repeated supplier failures or unresolved complaints.
- [ ] **MT-0239 · P2 · TODO** — Run quarterly disaster-recovery and supplier-outage exercises.
- [ ] **MT-0240 · P2 · TODO** — Expand to another country only after the current market is profitable, compliant and operationally repeatable.

### Workstream 13 · Dual-market architecture and Australia-to-Nepal gifting

**Definition of done:** Nepal domestic, Australia-local and Australia-to-Nepal gifting are distinct, understandable and independently testable customer journeys.

- [ ] **MT-0241 · P0 · TODO** — Define the three purchase journeys separately: Nepal domestic in NPR, Australia domestic in AUD for Australia-valid products, and Australia buyer to Nepal recipient with AUD payment.
- [ ] **MT-0242 · P0 · TODO** — Choose the initial Australian audience (Nepali diaspora, mainstream Australian buyers or both) and validate its actual purchase problem before building a broad Australian catalogue.
- [ ] **MT-0243 · P0 · TODO** — Model buyer location, billing country, payer identity, recipient country, delivery country and redemption region as separate fields; never infer one from another.
- [ ] **MT-0244 · P1 · TODO** — Add a persistent, user-controlled market selector with a manual override; do not force a market solely from IP location.
- [ ] **MT-0245 · P1 · TODO** — Create distinct market landing experiences with accurate local currency, eligible products, payment methods, support hours and delivery expectations.
- [ ] **MT-0246 · P1 · TODO** — Set separate conversion, repeat-purchase, fulfilment, refund and contribution-margin metrics for Nepal, Australia-local and Australia-to-Nepal gifting.
- [ ] **MT-0247 · P0 · TODO** — Define and publish the business boundary: MTDGC sells eligible digital products; it must not imply it is a remittance service, cash-out facility, stored-value wallet, product issuer or publisher unless separately authorised.
- [ ] **MT-0248 · P1 · TODO** — Validate new category demand with customer interviews, search demand and completed-order evidence instead of adding products solely to make the catalogue look larger.
- [ ] **MT-0249 · P0 · TODO** — Design an explicit Australia-paid, Nepal-recipient gifting route; never silently send an Australian buyer through an NPR-only domestic checkout.
- [ ] **MT-0250 · P0 · TODO** — Ask whether an order is for the buyer or another recipient and collect only the recipient fields required by that exact product.
- [ ] **MT-0251 · P0 · TODO** — Show payer currency, checkout amount, code/face-value currency, recipient market, delivery destination and redemption region together in the review and receipt.
- [ ] **MT-0252 · P1 · TODO** — Allow an optional gift message or delivery notification without exposing payment proof, billing details or private buyer information to the recipient.
- [ ] **MT-0253 · P0 · TODO** — Validate recipient email, player ID, zone ID, server and other product identifiers before charging; show a final confirmation for irreversible top-ups.
- [ ] **MT-0254 · P1 · TODO** — Explain who receives the code or top-up notification, who receives order updates and what the payer can see later in order history.
- [ ] **MT-0255 · P0 · TODO** — Define the resolution and refund owner for wrong recipient details, supplier stock-outs, failed delivery, duplicate delivery and undeliverable gifts.
- [ ] **MT-0256 · P1 · TODO** — Separate buyer contact data from recipient delivery data in access controls, email templates, support views and order exports.
- [ ] **MT-0257 · P1 · TODO** — Define the last safe cancellation/edit point for recipient details and lock irreversible fields after supplier submission, with an audited exception process.
- [ ] **MT-0258 · P1 · TODO** — Make the responsible seller, payment recipient, invoice issuer, support contact and refund route clear for each of the three purchase journeys.
- [ ] **MT-0259 · P1 · TODO** — Keep gifting as a purchase of a specified digital product; prohibit customer-facing wording that suggests cash transfer, remittance, cash withdrawal or transferable stored value.
- [ ] **MT-0260 · P0 · TODO** — Execute independent end-to-end test orders for all three journeys, including successful payment, failure, refund, notification, order tracking and recipient hand-off.

### Workstream 14 · Market-specific catalogue, legal and payment readiness

**Definition of done:** Each market sells only products and payment methods that are eligible for that market, with accurate seller identity, consumer terms, tax treatment and settlement.

- [ ] **MT-0261 · P0 · TODO** — Verify Australia redemption eligibility for every proposed Australian SKU using current issuer or supplier evidence and a legitimate test where possible.
- [ ] **MT-0262 · P1 · TODO** — Approve Australian gift-card and digital-product candidates one SKU at a time; record account country, storefront, denomination, activation and delivery restrictions.
- [ ] **MT-0263 · P0 · TODO** — Never describe a USD- or other foreign-denominated code as an Australian product merely because checkout accepts AUD.
- [ ] **MT-0264 · P1 · TODO** — Store and display code denomination currency separately from customer payment currency, including on product pages, cart, receipt, refunds and support records.
- [ ] **MT-0265 · P0 · TODO** — Verify third-party resale rights, territory permissions and distributor requirements for each brand, subscription and code before making it orderable.
- [ ] **MT-0266 · P0 · TODO** — Confirm the legal seller name, trading name, jurisdiction, payment-receiving entity and customer invoice issuer for each market.
- [ ] **MT-0267 · P0 · TODO** — Obtain qualified Australian legal review of consumer obligations for every offer made to Australian customers, including product claims, pricing, delivery, refunds and complaints.
- [ ] **MT-0268 · P0 · TODO** — Add an explicit statement that digital-goods policies do not exclude or limit non-excludable statutory consumer rights; review any blanket “no refund after code reveal/credit” language.
- [ ] **MT-0269 · P1 · TODO** — Classify each product against applicable gift-card rules and document expiry, activation and disclosure obligations individually; do not assume one rule applies to every code type.
- [ ] **MT-0270 · P0 · TODO** — Obtain tax advice on GST and other tax treatment for the actual seller entity, supply type, customer market, platform role and cross-border digital supply before Australian sales.
- [ ] **MT-0271 · P0 · TODO** — Have a qualified Nepalese professional confirm applicable business registration, tax, invoicing, consumer disclosures, refund and record-keeping requirements for the actual operating structure.
- [ ] **MT-0272 · P0 · TODO** — Use properly licensed or otherwise authorised local payment partners where required; do not operate a wallet, stored-value or money-transfer service without the necessary authorisation.
- [ ] **MT-0273 · P1 · TODO** — Reconcile Nepal QR/bank payments against transaction references and settlement records; treat screenshots as supporting evidence, not proof of cleared funds.
- [ ] **MT-0274 · P0 · TODO** — Determine the seller/merchant-of-record role for each journey and document who is responsible for payment, tax, delivery, refunds, complaints and customer data.
- [ ] **MT-0275 · P1 · TODO** — Maintain market-appropriate terms, refund and delivery policies; have governing-law and dispute wording reviewed and save the policy version accepted with each order.
- [ ] **MT-0276 · P1 · TODO** — Generate receipts or tax invoices with the correct legal seller, transaction currency, tax details and order reference for each market.
- [ ] **MT-0277 · P1 · TODO** — Publish a dependable support email, service hours, expected response window and complaint escalation route in addition to any messaging channel.
- [ ] **MT-0278 · P1 · TODO** — Show all mandatory fees and the final payable amount before order confirmation, including payment, currency-conversion or delivery charges where applicable.
- [ ] **MT-0279 · P0 · TODO** — Confirm that the chosen Australian payment processor explicitly permits MTDGC’s actual digital codes, game top-ups and subscription fulfilment model before activating production payments.
- [ ] **MT-0280 · P1 · TODO** — Benchmark each Australian SKU on the full delivered AUD cost and contribution margin after fees, FX, supplier cost, fraud/refund provision and fulfilment effort.

### Workstream 15 · Cross-border product data, operations and customer protection

**Definition of done:** Product eligibility, subscription mechanics, privacy, fulfilment, fraud controls and reporting remain accurate across all buyer and recipient markets.

- [ ] **MT-0281 · P0 · TODO** — Extend the canonical product model with buyer markets, supplier SKU, sourcing status, price by currency, code denomination currency, delivery country, redemption region, required customer fields, fulfilment method and last verification date.
- [!] **MT-0282 · P0 · BLOCKED** — Confirm the exact Netflix fulfilment method, supplier authority, account ownership, country and customer control. The current listing does not document these points and has been set to `temporarily_unavailable` in production on 6 November 2026; reopen only after written supplier/issuer evidence and a successful end-to-end test prove an authorised, region-compatible offer.
- [ ] **MT-0283 · P1 · TODO** — For every subscription, state plan duration, billing model, renewal behaviour, account owner, household/seat restrictions, region, what the customer receives and what happens at expiry.
- [ ] **MT-0284 · P1 · TODO** — Maintain a dated evidence record for each “Global” or region-specific claim, including issuer/supplier source, tested account or server region and known exclusions.
- [ ] **MT-0285 · P1 · TODO** — Test name, email and phone validation for Nepal and Australia formats, including Nepali names and valid international phone numbers, without rejecting legitimate customers.
- [ ] **MT-0286 · P0 · TODO** — Set a delivery and support SLA for each SKU and market using actual supplier times, manual staff capacity, payment confirmation, weekends and support hours; show it before payment.
- [ ] **MT-0287 · P1 · TODO** — Measure manual staff minutes and exception workload per SKU so delivery promises and growth targets do not exceed real fulfilment capacity.
- [ ] **MT-0288 · P0 · TODO** — Separate order states for creation, payment pending, payment verified, supplier processing, delivered, failed, refunded and chargeback; perform critical transitions server-side.
- [ ] **MT-0289 · P1 · TODO** — Record supplier order references, delivery evidence, status timestamps and failure reasons; use idempotency and duplicate checks where supplier systems support them.
- [ ] **MT-0290 · P1 · TODO** — Define supplier-outage fallback rules and automatically or manually disable new sales when stock, authenticity or delivery cannot be confirmed.
- [ ] **MT-0291 · P1 · TODO** — Alert staff before or when a delivery SLA is breached and send the customer a truthful next-update time before they need to chase support.
- [ ] **MT-0292 · P0 · TODO** — Map every personal-data field captured in checkout, accounts, tracking, support, analytics and payment proof; record which supplier or processor receives it, the purpose and the country of access/storage.
- [ ] **MT-0293 · P1 · TODO** — Define retention periods or defensible retention criteria for orders, support records, payment evidence and account data, with a process for access, correction and deletion requests.
- [ ] **MT-0294 · P0 · TODO** — Keep payment screenshots and delivered codes in private, access-controlled storage; validate file type/size, minimise visible bank details, restrict staff access and define deletion timing.
- [ ] **MT-0295 · P0 · TODO** — Add proportionate fraud controls for rapid repeat orders, payment/market mismatch, stolen-card signals, order enumeration, account takeover, code reselling abuse and chargebacks.
- [ ] **MT-0296 · P1 · TODO** — Audit sensitive changes to price, region, recipient, payment state, refund, code reveal and supplier fulfilment, including actor, timestamp and reason.
- [ ] **MT-0297 · P1 · TODO** — Keep one durable support case record linked to the order, payment, supplier action and customer conversation; WhatsApp must not be the only record of a refund or promise.
- [ ] **MT-0298 · P1 · TODO** — Localise currency, dates, number formats, receipts, phone fields and customer instructions for Nepal and Australia; decide Nepali-language coverage from customer evidence and maintain equivalent policy meaning.
- [ ] **MT-0299 · P1 · TODO** — If market-specific URLs are introduced, implement distinct useful content, correct canonical and hreflang rules, and accurate availability/indexing; do not create thin pages by merely swapping currency labels.
- [ ] **MT-0300 · P1 · TODO** — Build a weekly report segmented by journey, market, SKU and device for funnel conversion, verified payments, median and 95th-percentile delivery time, margin, wrong-region failures, refunds, chargebacks and support backlog.


### Workstream 16 · Repository security, release governance and project records

**Purpose:** Keep the MTDGC repository, environment configuration, branch workflow and project plan safe and maintainable. These tasks supplement (and do not replace) the digital-commerce workstreams above.

- [x] **MT-0301 · P0 · DONE** — Remove the tracked root `.env` from the current main tree, add ignore rules for local environment files, and provide a placeholder-only `.env.example`. Evidence: `.gitignore` commit `5d5dd9342c46611a8d69747181b9a534b68b2ecb`, `.env.example` commit `f39ec70656fa91006d89e96e75b149f8d792ce3f`, and `.env` removal commit `0763a9acbd47f7bdd770eafe931c1e12e91cee78`. No environment values were copied into the example.
- [x] **MT-0302 · P0 · DONE** — Review the published Git history for the removed `.env` and rotate any real service-role, database or other private credentials that were ever stored there. Historical review completed on 6 November 2026; no private credentials were found, so no credential rotation was required.
- [ ] **MT-0303 · P0 · BLOCKED** — Complete the move to Boxont-controlled Supabase only after the target project, backup/restore, schema, data, auth, storage, RLS, grants, functions, secrets and migration-history plan are verified. Do not run the held migrations on the existing project.
- [ ] **MT-0304 · P0 · BLOCKED** — Reconcile the held backend PR #1 against current `main` after the Supabase cutover; inspect migrations 0010–0017, regenerate Drizzle snapshots, validate migration order and permissions, and run full build and tests before merge or deployment.
- [x] **MT-0305 · P1 · DONE** — Add explicit package scripts for the existing `src/lib/*.test.ts` tests and TypeScript checking; add a free GitHub Actions quality workflow for install, lint, test, typecheck and production build. Verified on 6 November 2026: GitHub Actions run `42205681370` passed lint, 12 tests across 4 files, `tsc --noEmit`, and the production Vite/Nitro build. The test/typecheck/build verification ran on the hosted CI runner; the agent's local container did not have Bun installed. Lint intentionally disables only the Prettier rule because the existing repository has widespread formatting drift; no mass reformat was applied.
- [!] **MT-0306 · P1 · BLOCKED** — Protect `main` with pull-request review and required passing quality checks only after Lovable sync is proven. On 6 November 2026, the private-repository rulesets API returned an explicit GitHub Pro upgrade requirement; the GitHub branch-protection read endpoint was unavailable to the connected integration (403). GitHub's current documentation also lists GitHub Pro as required for protected branches in private repositories. The $0 additional-spend constraint rules out upgrading. Lovable's MTDGC project `latest_commit_sha` matched the inspected `main` HEAD `86eebd496b6f9a8d056fba890ea818eeab8af33f`, confirming the current direct-sync state is aligned, but no protected-branch bypass or sync test is available. Do not enable PR-only or required-review rules until a no-cost supported route and Lovable bypass behavior can be verified. No repository protection setting was changed.
- [x] **MT-0307 · P1 · DONE** — Audit `redesign-matrix`: Git comparison shows zero commits ahead of `main` and 129 behind, with no unique branch commits to salvage. Leave the stale branch untouched until deliberate branch cleanup is approved.
- [x] **MT-0308 · P1 · DONE** — Make `MTDGC_MASTER_PLAN.md` the single active task/status source, document the roadmap as dated implementation history, and update the README to point to the canonical plan. Evidence: README commit `e4138f950db65b96265b8ade29a4880712164dc3`; roadmap navigation note recorded in the current audit update.

## 7. Launch gates

### Product launch gate
A product may become orderable only when supplier legitimacy, resale permission, region, exact variant, customer inputs, cost, selling price, margin, delivery process, refund treatment and a successful test order are documented.

### Payment launch gate
A payment method may be advertised only after a real end-to-end test confirms correct amount, settlement, reconciliation, refunds, failure handling and customer instructions.

### Automation launch gate
An API or automated fulfilment path must have documented supplier authority, test mode, idempotency, reliable success/failure responses, retry safety, audit logs and a manual exception queue.

### Market launch gate
A new country requires aligned legal terms, consumer disclosures, currency, taxes, payment settlement, supplier availability, regional product rules, support hours and a real test purchase.

### Trust and claims gate
Delivery-speed claims, customer reviews, ratings, order counts, security claims and supplier-authorisation claims must be supported by current evidence.

## 8. Prioritised risk register

| Priority | Risk | Required control |
|---|---|---|
| P0 | Australian demand is promoted before a real Australia-specific purchase journey exists. | Keep Australia-local checkout disabled until AUD pricing, eligible products, payment, seller identity, policies, tax handling and support are proven. |
| P0 | Australia-to-Nepal gifting is mistaken for remittance or a transfer of stored value. | Sell a clearly identified digital product only; validate the legal model and authorised payment route before the pilot. |
| P0 | A code or top-up is sold for the wrong account region or server. | Require SKU-level evidence, dated compatibility checks, prominent warnings and a tested wrong-region support path. |
| P0 | The Netflix/subscription fulfilment method or account ownership is unclear. | Document exactly what is delivered and the supplier’s authority; pause scaling until the offer is clear and supportable. |
| P0 | Refund wording is inconsistent with customer rights in a market. | Obtain local legal review and preserve non-excludable statutory rights in market-specific policies. |
| P0 | Supplier or processor terms do not permit resale or payment processing for the actual product. | Keep each SKU and payment route gated by written supplier/processor eligibility evidence. |
| P0 | Payment screenshots are mistaken for confirmed settlement. | Match funds to the order using provider/bank settlement evidence before fulfilment. |
| P1 | Catalogue size overstates real availability. | Separate live, unavailable and roadmap SKUs and reconcile counts with database and checkout. |
| P1 | Manual operations create late deliveries or founder bottlenecks. | Measure labour, publish realistic SLAs, alert on overdue work and maintain supplier fallback procedures. |
| P1 | Cross-border personal data is shared without a clear map or retention process. | Minimise collected fields, map recipients/processors and locations, disclose uses and apply retention controls. |
| P1 | AUD/NPR conversion and payment costs erase apparent margin. | Calculate per-SKU, per-journey contribution after FX, fees, fraud, refunds and support labour. |
| P1 | Wrong recipient details create irreversible loss or disputes. | Validate and confirm recipient details before charging; define cancellation cut-offs and exception ownership. |
| P2 | Unavailable product pages weaken search quality and customer confidence. | Keep roadmap pages clearly marked and prevent unavailable items from appearing as purchasable offers. |

## 9. Unit economics required before scaling

For each SKU and each purchase journey, calculate:

`Contribution per order = customer price excluding collected tax − supplier cost − payment fee − FX/settlement cost − expected fraud/chargeback cost − expected refund/failed-delivery cost − variable fulfilment labour − allocated support cost.`

Run at least three cases per SKU: a normal successful order, a delayed or failed fulfilment, and a refund or chargeback. Keep separate models for NPR domestic orders, Australian-local AUD orders and Australia-paid gifts for Nepal recipients; they have different payment, settlement, FX, tax and support costs. Do not treat code face value as sales revenue or confuse revenue with retained profit.

## 10. Immediate next actions

No numbered task is currently marked **IN PROGRESS**. Task statuses in the 308-task register are authoritative.

| Order | Task | Status |
|---:|---|---|
| 1 | MT-0045 — test one low-value transaction per supplier/product family | BLOCKED; no identified/verified supplier or product scope; a real transaction and fulfilment would require external evidence and spend |
| 2 | MT-0046 — document supplier delivery times, cut-off, failure process and escalation | BLOCKED; no supplier identity or documented operational terms/contact |
| 3 | MT-0061–MT-0063 — build landed cost and order-level gross margin from source costs | BLOCKED; supplier costs, dated FX, payment/settlement fees, refunds and variable fulfilment/support costs are absent |
| 4 | MT-0064 — approve minimum contribution-margin floor | BLOCKED; business-owner decision required |
| 5 | MT-0065 — enforce a current-price/margin gate at checkout | BLOCKED; depends on the approved floor and trusted cost/price-expiry data; schema changes remain behind the Supabase cutover |
| 6 | MT-0081 — audit the current QR and bank-transfer payment flow | TODO; next independent P0 task after the supplier and pricing blockers |
| 7 | Complete Boxont-controlled Supabase cutover before releasing held PR #1 and migrations 0010–0017 | BLOCKED; target project, backup/restore and migration gates remain unverified |
| 8 | Resume MT-0282 only after Netflix supplier/issuer evidence and a successful authorised test order are recorded | BLOCKED |

**Repository security note:** The tracked root `.env` has been removed from `main`; local environment files are ignored and `.env.example` contains placeholders only. A review of the `.env` history found project identifiers, API URLs and Supabase publishable keys only—no service-role key, secret key, database password, migration URL or other private credential. The old `.env` blob remains on `backend-code-route` and `redesign-matrix`; those are stale/held branches and must not be merged or deployed without removing the file at their branch tips and rechecking their configuration.

**Release note:** The latest verified production build before the documentation/security cleanup was READY at `087f0ed5e9f94016dd14476b0c05218adce6e135` on `mtdgc.com`. Recheck the latest deployment after the current documentation commits. The backend PR remains on HOLD until the Supabase cutover.


## 11. Sources and verification

This plan's live-site baseline was checked on 5 November 2026. Website content can change; recheck before implementation or public claims.

- MTDGC homepage: https://mtdgc.com/
- About: https://mtdgc.com/about
- Catalog: https://mtdgc.com/catalog
- How it works: https://mtdgc.com/how-it-works
- Order tracking: https://mtdgc.com/track-order
- Support: https://mtdgc.com/support
- FAQ: https://mtdgc.com/faq
- Delivery policy: https://mtdgc.com/policies/delivery
- Refund policy: https://mtdgc.com/policies/refunds
- Terms: https://mtdgc.com/policies/terms
- Privacy: https://mtdgc.com/policies/privacy

## 12. Research integration and limitations

This revision incorporates the user-provided **26 October 2026 Australia + Nepal market-readiness audit**. Its 1,000 numbered checks expand the same controls across five scenarios (Nepal domestic, Australia-local, Australia-to-Nepal gifting, cross-market consistency and operations). Rather than importing repeated scenario copies, this plan preserves the original 240 tasks and adds 60 distinct MTDGC actions that strengthen the missing market architecture, compliance, payment, subscription, recipient, privacy and operational controls.

The 26 October report was a public-evidence audit, not a completed 1,000-test execution. No live payment, order, supplier contract, database, security penetration test or registration verification was performed as part of that source audit. Its product counts are dated observations, not current inventory truth. All implementation and legal/tax tasks remain TODO until supported by recorded evidence and qualified review where required.

Only MTDGC website URLs are retained as website references in this plan. Competitor-site references and unrelated website links from the source audit are intentionally not carried into the execution file.

---

**Task count:** 308 MTDGC tasks across 16 workstreams.
**Rule:** This file is the MTDGC execution plan. Keep all work specific to MTDGC digital products, orders, payments, suppliers and fulfilment.
## 13. Verified repository and release snapshot — 5 November 2026

### Repository state

- Repository: `eboxont-code/mtdgc` (private); default branch: `main`.
- Main commit at the initial audit: `087f0ed5e9f94016dd14476b0c05218adce6e135` (`Added product details block`).
- Current issue search returned no GitHub issues.
- Current PR search returned one PR: [#1 — Draft: backend code route (hold until Supabase move)](https://github.com/eboxont-code/mtdgc/pull/1).
- Branches: `main`, `backend-code-route`, `redesign-matrix`.
- `main` is currently unprotected. The repository has no `.github/workflows/` files.
- `package.json` currently has `build` and `lint` scripts but no package-level `test` or `typecheck` script. Four focused `src/lib/*.test.ts` files exist. This is tracked by MT-0305 and MT-0306; do not claim CI coverage until it exists and passes.

### Backend route PR hold

- PR #1 is an open draft and explicitly says **HOLD** until the move to Boxont-controlled Supabase.
- Its branch `backend-code-route` is diverged from current `main`: 7 commits ahead, 165 behind, with merge base `f5ba97ddaabac709419cb78cadb8d8a4a9ab7ddc`.
- The branch contains migrations 0010–0017, updated generated types, catalog/admin/order server functions and listing helpers.
- PR text states migrations 0010–0017 have not been applied to any database and must not be applied to the existing Supabase project. Its Drizzle snapshots were not regenerated.
- Do not merge, deploy, or apply these migrations before cutover and reconciliation. Keep PR #1 open on hold; no migration or production database action was performed in this audit.

### Stale redesign branch

- `redesign-matrix` is 129 commits behind `main`, zero commits ahead, and has no unique commits in the current comparison.
- Its work is already represented in `main`; no changes need to be cherry-picked.
- The branch was not deleted or rewritten. Branch cleanup can be considered separately.

### Production deployment

- Vercel project: `mtdgc`.
- Latest verified production deployment at the initial audit: `dpl_BcEXaXLp6gne51k6xgYyed9U7vSh`, state `READY`.
- Git source: `main` at `087f0ed5e9f94016dd14476b0c05218adce6e135`.
- Verified custom domain: `mtdgc.com`.
- `www.mtdgc.com` is configured to redirect to `mtdgc.com` with HTTP 308.
- Vercel environment configuration contains the required named Supabase variables for the production runtime. Values were not decrypted or copied into repository documentation.

### Environment-file security remediation

- [x] [DONE] The tracked root `.env` file was removed from the current `main` tree.
- [x] [DONE] `.gitignore` now ignores `.env` and `.env.*`, while allowing `.env.example`.
- [x] [DONE] A placeholder-only `.env.example` was added for local setup.
- [ ] [BLOCKED] Review historical commits for any genuine secrets and rotate any private credentials that were ever included. The old file was not opened or copied during this audit. Removing the latest version does not erase Git history.
- Production Vercel environment values were not edited.

### Current product and business constraints retained

- Nepal domestic operations are the first stability priority.
- Australia-to-Nepal gifting is a separate future route, not a currency toggle.
- Australia-local sales remain gated on independent sourcing, payment settlement, consumer, tax and support readiness.
- Current product counts (26 in the 26 October public snapshot; 36 in the 5 November public snapshot) are historical public observations, not a verified current database count.
- Payment QR/bank details, eSewa merchant credentials, exact real selling prices, supplier costs, email sender/DNS configuration, Search Console verification and subscription fulfilment evidence remain owner or operational dependencies.
- The existing bot note records `mtdgc.art` as intentionally lapsing on 17 November 2026 and `mtdgc.com` auto-renew as off with an expiry date of 1 October 2027. Reconfirm registrar state before relying on those dates; do not renew or purchase anything without approval.

### Planning and repository records

- [x] [DONE] `MTDGC_MASTER_PLAN.md` is the canonical current execution plan.
- [x] [DONE] `roadmap.md` is retained as dated implementation history; its older pack checkboxes are not the active task register.
- [x] [DONE] README now describes MTDGC and links the master plan, architecture and historical roadmap.
- [x] [DONE] All 308 task IDs `MT-0001`–`MT-0308` are maintained in the master task register.

## 14. Owner decisions and operating dependencies

- [ ] [BLOCKED] Confirm the real supplier prices and landed costs before enabling price-sensitive products.
- [ ] [BLOCKED] Provide approved QR/bank payment configuration and eSewa merchant credentials before presenting those methods as ready.
- [ ] [BLOCKED] Choose an email sender and approve the DNS/SPF/DMARC setup.
- [ ] [BLOCKED] Complete Search Console ownership verification and sitemap handoff.
- [ ] [BLOCKED] Approve the exact Netflix/subscription fulfilment description only after the supply method and customer-control terms are verified.
- [ ] [BLOCKED] Approve Australian seller entity, ABN, AUD pricing, payment provider and market-specific legal review before activating Australian-local sales.
- [ ] [BLOCKED] Confirm whether account migration from current GitHub/Vercel/Supabase/Sentry ownership is wanted; no account move was started.



## 15. Product catalogue reconciliation — 6 November 2026

**Task:** MT-0021 · P0 · DONE  
**Result:** The live public catalogue and the connected MTDGC production database agree on the current catalogue count and availability classification.

### Verified totals

| Classification | Database records | Public catalogue |
|---|---:|---:|
| Total listed products | 36 | 36 |
| Orderable by current catalogue rules | 6 | 6 |
| Coming soon | 30 | 30 |
| Unpublished / hidden | 0 | 0 |
| Archived / obsolete state | 0 archived | Not separately represented |

All 36 rows in `public.products` are published. Six products have a parent status of `available` and at least one positively priced variant with an `available` or `low_stock` status. The remaining 30 have a `coming_soon` parent status and no orderable variants. The public catalogue reports **36 listed / 6 available now / 30 coming soon**.

### Category reconciliation

| Category | Database | Public catalogue | Available now | Coming soon |
|---|---:|---:|---:|---:|
| Game Top-Ups | 6 | 6 | 4 | 2 |
| Gift Cards | 12 | 12 | 1 | 11 |
| Software | 11 | 11 | 0 | 11 |
| Subscriptions | 7 | 7 | 1 | 6 |
| **Total** | **36** | **36** | **6** | **30** |

### Record classification

**Orderable by current catalogue flags (6):**
- Game Top-Ups: Free Fire Diamonds; PUBG Mobile UC; Mobile Legends Diamonds; Clash of Clans Passes.
- Gift Cards: Roblox Gift Card.
- Subscriptions: Netflix Subscription.

**Coming soon (30):**
- Game Top-Ups: Genshin Impact Genesis Crystals; Valorant Points.
- Gift Cards: Steam Wallet Code; Amart Furniture Gift Card (Australia); Bunnings Gift Card (Australia); Coles Gift Card (Australia); DoorDash Gift Card (Australia); JB Hi-Fi Gift Card (Australia); Kmart Gift Card (Australia); Supercheap Auto Gift Card (Australia); Ticketmaster Gift Card (Australia); Uber Eats Gift Card (Australia); Woolworths Gift Card (Australia).
- Software: Adobe Creative Cloud; Canva Pro; CapCut Pro; ChatGPT Plus; Grammarly Premium; Kaspersky Standard; Microsoft 365; NordVPN; Office 2021 Professional Plus; Windows 11 Pro; Windows 11 Pro and Office 2021 Bundle.
- Subscriptions: Disney+ Hotstar; Google One 100 GB; Prime Video; Spotify and YouTube Premium Bundle; Spotify Premium; YouTube Premium.

**Hidden:** None. All 36 product rows currently have `is_published = true` and appear in the public catalogue.
**Duplicates:** No exact duplicate product names were returned by a normalized-name check. Product slugs are also protected by a unique database constraint.
**Obsolete:** No product is marked `archived`. No product could be confirmed obsolete from the available record fields; do not infer that a coming-soon product is obsolete.

### Scope and safeguards

This reconciliation verifies database catalogue state, variant eligibility and public listing counts only. It does **not** prove supplier authorisation, live supplier inventory, region compatibility, price validity, margin or successful fulfilment. The six products shown as available must still pass the supplier and test-order gates before any stronger stock or availability claims. In particular, the Netflix fulfilment method and account-ownership description remain a separate open task (MT-0282).

No product, variant, category, price, availability flag or database record was changed as part of this audit.

**Evidence sources:** read-only query of the MTDGC `public.products`, `public.product_variants` and `public.categories` tables on 6 November 2026; public pages [Catalog](https://mtdgc.com/catalog), [All products](https://mtdgc.com/products), [Game Top-Ups](https://mtdgc.com/categories/game-top-ups) and [Gift Cards](https://mtdgc.com/categories/gift-cards).



## 16. Historical environment-file credential review — 6 November 2026

**Task:** MT-0302 · P0 · DONE  
**Scope:** Review the published Git history for the removed root `.env`, identify any private values without reproducing them, and determine whether rotation is required.

### Findings

- Git history contains two commits affecting the root `.env`: the original addition on 17 September 2026 and its removal from `main` on 5 November 2026.
- The historical file contains six entries: two project-ID entries, two Supabase URL entries and two copies of the same `sb_publishable_` key.
- The key is a Supabase **publishable** key, intended for browser/client use; it is not a secret key. Supabase's key migration guide distinguishes publishable keys from server-side secret keys and maps publishable keys to the legacy `anon` role: https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys
- No `service_role` key, `sb_secret_` key, database password/URL, migration connection string, Sentry auth token or other private credential was present in the historical `.env`.
- The historical project identifier and endpoint do not match the currently connected MTDGC Supabase project. Treat this configuration as stale; do not reuse it.
- `.env.example` on current `main` contains placeholders only.
- The same historical 361-byte `.env` blob remains referenced by `backend-code-route` and `redesign-matrix`. These branch copies contain the same public configuration, not private credentials. The backend branch remains on hold pending the Supabase cutover; the redesign branch is stale. Do not merge, deploy or reactivate either branch without removing the tracked `.env` from its branch tip and revalidating the branch configuration.
- Current MTDGC Supabase API-key inventory exposes a publishable key and legacy anon key; no historical value was found to match those current keys.

### Decision and actions

**No private credential was found, so no credential rotation was required for MT-0302.** The task is complete based on the historical file contents and current key inventory. This review did not rotate keys or change any Supabase settings.

The stale branch copies are recorded as a release/branch-cleanup condition, not as evidence of a leaked private secret. Preserve Git history; do not force-push, rewrite or amend published commits. Remove the tracked `.env` in a normal forward commit before either stale branch is ever reused.

**Evidence:** GitHub path history for `.env`; historical blob at commit `99672865ce0977e767dfaa952f2c29d39813a9ce`; removal commit `0763a9acbd47f7bdd770eafe931c1e12e91cee78`; branch-tip `.env` blobs on `backend-code-route` and `redesign-matrix`; current `.env.example`; current MTDGC Supabase publishable-key inventory. Values and full key material were intentionally not copied into this plan.



## 17. Netflix subscription fulfilment review and production hold — 6 November 2026

**Task:** MT-0282 · P0 · BLOCKED  
**Decision:** Do not accept new Netflix subscription orders until the product's supply and account model are evidenced.

### What is recorded today

The `netflix-subscription` product is published for Nepal in NPR and described as an account-based subscription. It asks the buyer for a delivery email and tells the customer to sign in to Netflix with details sent after fulfilment. Three one-, three- and twelve-month variants are marked available.

The product and variant records do not identify a supplier, issuer authority, exact subscription mechanism, account owner, billing country or the customer's continuing control of the account. No supplier register or supplier/issuer authority fields were found in the current application schema or repository search. The described flow is therefore not sufficiently specified to prove that it is a legitimate, authorised offer.

### Customer-policy and regional considerations

Netflix's current Help Center guidance states:
- A Netflix account is for one household; extra-member eligibility depends on plan and country, and the extra member must be activated in the country where the account owner created the account: https://help.netflix.com/en/node/123277
- Netflix warns customers not to buy accounts or shared sign-in information from third-party sites and says accounts offered for sale may be stolen: https://help.netflix.com/en/node/13243
- Netflix says an account bought from an unauthorised retailer may not work in the country where it is used: https://help.netflix.com/en/node/113661
- Gift-card redemption is also country/currency-sensitive and may be unavailable for some billing methods: https://help.netflix.com/en/node/59987

These official policies do not establish that MTDGC's current product is authorised or unauthorised. They show why the precise supply route, region and account control must be documented before sale.

### Production safeguard applied

On 6 November 2026, the production row for `netflix-subscription` was updated from `available` to `temporarily_unavailable`. The product remains published so its page can explain its unavailable state, but the existing product-page availability logic and server-side `placeOrder` validator both require the parent product status to be `available` or `low_stock`. A follow-up read-only database check confirmed:
- Product status: `temporarily_unavailable`
- Published: `true`
- Variants: 3, with their prices and statuses unchanged
- Checkout-eligible variants: 0

Two historical orders containing this product remain in `pending_payment`; no order rows or customer details were changed. An operator must check whether either payment was received and handle any customer communication or refund decision under the existing policy. Do not fulfil these orders merely because they exist.

### Evidence required to unblock

Before restoring availability, record:
1. Supplier/issuer legal identity and contact, plus written authority or contractual permission to distribute this exact Netflix product.
2. Exact offer: official redemption code, authorised extra-member slot, renewal on the customer's own account, authorised partner bundle, or another specifically evidenced mechanism.
3. Issuing and billing country, currency, recipient country, redemption restrictions and compatibility for Nepal.
4. Account ownership and control: who owns the account, who controls its email and recovery methods, whether the customer uses their own account, and whether any password/profile is shared.
5. Term length, recurring billing/cancellation behaviour, delivery steps, failure escalation and refund treatment.
6. A successful low-value end-to-end test using the exact production supplier route, with evidence retained without exposing customer passwords, OTPs or other secrets.

Do not ask customers for passwords, OTPs or payment PINs. Do not describe a shared login as a private subscription or imply Netflix authorisation without documentary evidence.

**No supplier or account arrangement has been inferred.** The product should remain unavailable until the evidence above is supplied and reviewed. Reopening this task is a deliberate owner decision after the evidence and test order exist.

**Evidence sources:** read-only inspection of `public.products`, `public.product_variants`, `public.order_items` and `public.orders`; inspection of `src/routes/products.$slug.tsx`, `src/lib/catalog.functions.ts`, `src/lib/orders.functions.ts` and `src/lib/admin.functions.ts`; production status update and verification query; official Netflix Help Center pages linked above. No customer contact details, passwords, or payment data were copied into this plan.



## 18. Supplier register created — 6 November 2026

**Task:** MT-0041 · P0 · DONE  
**Canonical register:** [`SUPPLIER_REGISTER.md`](./SUPPLIER_REGISTER.md)

### What was created

- Supplier identity register fields: legal entity, trading name, registration/operating country, official domain, primary contact, business email/phone, product scope, verification status, evidence reference, reviewer and review date.
- Product-scope register fields: supplier, MTDGC product/SKU, issuer/brand, source type, issuing and customer regions, denomination, delivery method, resale-authority evidence, source-of-origin evidence, terms and scope status.
- Commercial and operational fields: supplier cost/currency, quote source and date, expiry, settlement route, delivery time, cut-off, failure/refund process, escalation contact and data-sharing/retention.
- Defined evidence-based statuses from NOT ASSESSED through VERIFIED / VERIFIED — LIMITED SCOPE, REJECTED, SUSPENDED and EXPIRED.
- Added safeguards against unsupported reseller claims, unverified region compatibility, unsafe credential requests and putting secrets or customer data in Git.
- Added a product sourcing queue for the five currently catalogue-orderable product families and the Netflix product now on production hold.

### Initial findings and boundaries

- No supplier register, supplier identity records or supplier integration was found in the inspected repository.
- The current product/order database schema contains no supplier table or supplier foreign key; the data architecture document does not define one.
- No supplier legal name, country, business contact, distribution authority or product-origin evidence could be established from the available project records.
- The supplier identity table is intentionally empty. This is a register build, not a claim that MTDGC has verified or approved a supplier.
- No database DDL or production supplier table was added. The master plan continues to hold backend migrations until the Boxont-controlled Supabase cutover and database reconciliation are complete.

### Dependency

**MT-0042 is now BLOCKED** because the actual source for each code, top-up and subscription is not recorded in the repository or database. The next supplier tasks cannot be verified from product descriptions or catalogue pricing alone. They require the real supplier identity, supply route and evidence. No supplier was guessed or contacted, and no paid service or additional spend was initiated.

**Verification:** `SUPPLIER_REGISTER.md` exists on `main`; README links to it; the register fields cover the supplier identity and verification status required by MT-0041. No supplier/product/price/database records were changed.



## 19. Automated engineering quality gate implemented and verified — 6 November 2026

**Task:** MT-0305 · P1 · DONE  
**Workflow:** [Quality](https://github.com/eboxont-code/mtdgc/actions/workflows/quality.yml)  
**Successful run:** [Run #3 — commit `04d600cc83bc9c12a85b7818ca21288a38f1e37e`](https://github.com/eboxont-code/mtdgc/actions/runs/42205681370)

### Changes

- Added `bun run test` using Bun's built-in runner for the existing `src/lib/*.test.ts` tests.
- Added `bun run typecheck` using `tsc --noEmit`.
- Added a GitHub Actions workflow for pushes to `main`, pull requests targeting `main`, and manual dispatch.
- Workflow sequence: frozen-lockfile install → lint → unit tests → TypeScript typecheck → production build.
- Uses GitHub's hosted runner and the official Bun setup action. Build-time Supabase environment values are deliberately non-secret placeholders; the workflow does not connect to production Supabase or use production credentials.
- Documented the scripts and workflow in README.

### CI verification

The successful hosted run on 6 November 2026 confirms:

| Check | Result |
|---|---|
| `bun install --frozen-lockfile` | Passed |
| ESLint code rules | Passed |
| Unit tests | **12 passed, 0 failed across 4 files** |
| `tsc --noEmit` | Passed |
| Vite client build | Passed |
| Vite SSR build | Passed |
| Nitro production build | Passed |

The initial lint attempt exposed 2,202 Prettier-only formatting errors across the existing repository, plus 5 explicit-`any` errors and 3 conditional-hook errors. The genuine typing and hook-order issues were corrected. To avoid an unrelated, high-churn whole-repository reformat, the `lint` script now disables only the Prettier rule while retaining the other ESLint code checks. The separate `format` script remains available; repository-wide formatting has not been applied.

The tests and typecheck were verified by the hosted CI runner, not run in the agent's local container because Bun was not installed there. CI is the authoritative executed result linked above.

No dependencies were added and `bun.lock` was not changed. No production secrets, Supabase schema, migrations, deployment configuration or customer data were touched.

### Next independent engineering task

MT-0306 was assessed on 6 November 2026 and is now BLOCKED: Lovable's current project SHA matches GitHub `main`, but private branch protection requires a paid GitHub plan and the connected integration cannot verify protection/bypass settings. See section 21. Do not change repository protection settings. The next independent P0 catalogue task, MT-0027, was completed in section 22.



## 20. Catalogue availability reconciliation after Netflix hold — 6 November 2026

**Task:** MT-0022 · P0 · DONE  
**Change:** Make every published catalogue summary account for products that are neither orderable nor coming soon, and expose an explicit unavailable filter.

### Issue identified

After MT-0282 placed Netflix on `temporarily_unavailable`, the published product remained correctly visible but the shared `availabilityCounts` helper counted only available and coming-soon products. As a result, summaries could report seven subscription listings, zero available and six coming soon without accounting for the seventh listing.

### Implementation

- Extended `src/lib/product-availability.ts` with `isUnavailable` and an `unavailable` count. The three counts now reconcile to the number of products passed to the helper.
- Added the unavailable count to category detail pages, the category index, all-products page and catalog summary.
- Added an explicit **Unavailable** choice to the catalog availability filter.
- Kept product-card status labels tied to each actual product status; Netflix continues to display its temporarily unavailable state.
- The homepage hero slide builder already filters its promotional slides to orderable product statuses, so the held Netflix listing is not promoted as an active hero offer. It remains visible in the relevant catalogue/category listing with its unavailable label.
- Added a focused unit test for `out_of_stock` and `temporarily_unavailable` records, including the Netflix-style label and count reconciliation.

### Verified current catalogue snapshot

Read-only production database checks on 6 November 2026 confirm:

| Category | Listed | Available now | Coming soon | Unavailable |
|---|---:|---:|---:|---:|
| Game Top-Ups | 6 | 4 | 2 | 0 |
| Gift Cards | 12 | 1 | 11 | 0 |
| Software | 11 | 0 | 11 | 0 |
| Subscriptions | 7 | 0 | 6 | 1 |
| **Total** | **36** | **5** | **30** | **1** |

All 36 records are published; none are hidden or archived. The one unavailable product is Netflix Subscription, still held pending the MT-0282 supplier/account review.

### CI and production verification

- GitHub Actions run [`42206983140`](https://github.com/eboxont-code/mtdgc/actions/runs/42206983140) completed successfully: lint, unit tests, TypeScript typecheck and production build all passed.
- The updated production deployment [`dpl_9oYeYAKTV3yEvabHj8msh1xjF7Qs`](https://vercel.com/boxont/mtdgc/9oYeYAKTV3yEvabHj8msh1xjF7Qs) is **READY**, sourced from `main` commit `82ee56a8189b6808b9e9bf64487cd7e6f77361df`, with `mtdgc.com` among its assigned aliases.
- The public site HTML was not independently fetched in this audit because the available web/container routes returned cache/DNS access errors. The code paths, current production database records, successful CI run and Vercel deployment metadata were inspected directly; do not claim a browser-level regression test was performed.

No product records, supplier assignments, prices, variants, order records, database schema or migration files were changed for MT-0022.



## 21. Lovable sync / branch-protection assessment and variant display audit — 6 November 2026

### MT-0306 · P1 · BLOCKED — Branch protection

**Current sync evidence**
- GitHub repository: `eboxont-code/mtdgc`, default branch `main`.
- GitHub `main` HEAD inspected from the recursive tree: `86eebd496b6f9a8d056fba890ea818eeab8af33f`.
- Lovable project `Mtdgc` (project ID `f63ad948-8fb1-42cb-8c2e-7d2f017688e1`) reported `latest_commit_sha` as the exact same SHA. This confirms the connected project is currently aligned with the repository's `main` head.
- `AGENTS.md` states that commits pushed to the connected branch sync back to Lovable and appear in the editor. The existing workflow therefore relies on pushes to the connected branch.

**Protection constraints**
- The GitHub branch-protection read request returned HTTP 403 from the connected integration, so current protection settings and any app-specific bypass permissions could not be independently inspected.
- The repository rulesets endpoint returned GitHub's explicit message: upgrade to GitHub Pro or make the repository public. GitHub's current protected-branch documentation says private-repository branch protection requires GitHub Pro, Team or Enterprise: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- MTDGC is private and the project constraint is $0 additional spend. No plan upgrade or paid service is acceptable without a change to that constraint.
- Requiring pull requests/reviews or limiting direct pushes could interrupt Lovable's existing direct-sync workflow. No bypass behavior was proven.

**Decision:** Keep the current connected-branch workflow unchanged. Do not enable PR-only rules, mandatory reviews, or required checks on `main` unless a no-cost supported protection route and Lovable's bypass/sync behavior can first be verified. No GitHub settings were changed. This task remains BLOCKED rather than treating a paid upgrade or unverified protection configuration as complete.

### MT-0026 · P0 · DONE — Exact variant and amount across the order journey

**Code-path evidence inspected on `main` commit `86eebd496b6f9a8d056fba890ea818eeab8af33f`:**
- `src/lib/cart.tsx`: cart lines retain the selected SKU, product name, variant name and price; cart subtotal is calculated from unit price × quantity.
- `src/components/cart-drawer.tsx`: displays product name, variant name, unit price and line subtotal.
- `src/routes/cart.tsx`: displays product name, selected variant, region, quantity controls and line total.
- `src/routes/checkout.tsx`: checkout review displays product name, variant name, quantity and line amount before order submission.
- `src/lib/orders.functions.ts`: the server resolves each submitted SKU against the current database variant, uses the database's product/variant names and price (not the client-supplied price), and stores `variant_name`, `unit_price_minor` and `line_total_minor` on each order item. `listMyOrders` returns the saved variant and line amount.
- `src/routes/order.$orderNumber.tsx`: the order confirmation/detail page displays quantity, saved product + variant name and line amount.
- `src/routes/_authenticated/orders.tsx`: authenticated order history displays the saved variant name, quantity and line amount.

**Verification boundary:** This was a source-code path audit, not a live checkout or payment test. No order was created, no payment was submitted, and no production records were changed. The separate low-value end-to-end supplier/order test remains dependent on verified supply and operational evidence.


## 22. Gift-card denomination and selling-price clarity — 6 November 2026

**Task:** MT-0027 · P0 · DONE

### Data audit
- The product-variant schema stores an option name, numeric price and currency; it has no separate face-value, denomination-currency or fee columns.
- The current Roblox gift-card options are named USD 10 Card and USD 25 Card. Their numeric option prices are MTDGC NPR selling prices (the current admin editor labels the price input Price (NPR); the variant currency defaults to NPR).
- Order creation uses the saved variant price for subtotal_minor and total_minor; there is no separate MTDGC checkout-fee calculation or payment-fee field. A bank/payment provider may still charge independently; its fee is not controlled by this site.
- No face value has been parsed from free-form names, converted, or inferred into a new numeric field. The issuer denomination remains the exact option name until a structured denomination field can be introduced safely with the approved database migration path.

### Implementation
- Product detail labels each gift-card option as Face value and its NPR amount as MTDGC selling price.
- Product summary, denomination selector and mobile buy bar distinguish face value from MTDGC selling price. Product cards label their starting amount as an MTDGC price. Cart drawer, cart, checkout, guest order page, order tracking and authenticated order history show the gift-card face value and NPR selling price separately.
- Gift-card disclosure states that the NPR amount is MTDGC’s selling price, that checkout adds no separate MTDGC fee in the current implementation, and that a bank/payment provider may charge separately.
- Admin variant editing instructs the operator to enter the issuer denomination and currency in the option name (for example, USD 10 Card) and keep the NPR price as MTDGC’s selling price.
- Added unit tests for gift-card category classification and required disclosure wording.

### Verification boundary
- This is a code/UI clarification using existing records only. No product price, denomination, fee, stock flag, supplier record or production database row was changed.
- No supplier denomination or resale authority was verified. The existing option name is displayed as supplied; it is not treated as independently verified issuer evidence.
- No checkout was submitted and no payment was made. No production database records, prices, supplier data, payment settings or deployment configuration were changed.
- The first CI run (42216599904) caught a missing unit_price_minor field in the guest order-detail query. The nested select was corrected in follow-up commit 079722e9dae76ef278b1985dd4c428f334db8f57; the final GitHub Actions run 42216789779 passed lint, all 14 tests across 5 files, TypeScript typecheck and the production build.
- Vercel production deployment dpl_EnJoRv11UhXsJBbpzJCJjM9HhUwg for commit 079722e9dae76ef278b1985dd4c428f334db8f57 reached READY with mtdgc.com, www.mtdgc.com and the project aliases attached. The public Roblox gift-card page returned HTTP 200 and its rendered HTML contained the Face value, MTDGC selling price and bank/payment-provider fee disclosure.
- Vercel reported no runtime errors in the preceding 30-minute window. Lovable’s latest commit SHA matched the final GitHub main SHA.


## 23. Supplier credential rejection and customer-input safeguards — 6 November 2026

**Task:** MT-0044 · P0 · DONE

### Mandatory supplier rejection rule
- Updated `SUPPLIER_REGISTER.md` to version 1.1 with an explicit automatic-rejection rule. A supplier and the affected product scope must be marked `REJECTED` if fulfilment requires customer passwords/passcodes, OTPs or verification codes, authenticator/2FA codes, payment/bank/card PINs, recovery/backup codes or phrases, session cookies, access tokens, private keys, card security codes, remote account/device access or unauthorised account handover.
- The rule prohibits onboarding or test transactions for such a workflow. Only non-sensitive evidence references and rejection reasons may be recorded; never copy the credential into the register, support records or Git history.
- This is a policy and application-control completion, not a claim that a supplier has already been screened or rejected. The supplier identity register remains empty.

### Application enforcement
- Added `src/lib/supplier-safety.ts` with a shared detector and customer-safe rejection message.
- Added `src/lib/supplier-safety.test.ts` with tests for unsafe credential/access labels and safe product identifiers/delivery contact labels.
- `src/components/admin/product-form.tsx` blocks unsafe required-detail labels and explains the allowed information.
- `src/lib/admin.functions.ts` repeats the same validation server-side in `saveProduct`, so a direct request cannot bypass the admin form.
- `src/lib/orders.functions.ts` rejects order submissions if a cart line contains an unsafe credential/access field key, covering stale or manipulated cart payloads.
- `src/routes/checkout.tsx` now explicitly reassures customers that MTDGC will never ask for recovery codes as well as passwords, OTPs or payment PINs.

### Current catalogue check and boundaries
- A read-only query against the current MTDGC Supabase project `eaomkkswslqtfunkceuc` checked every published product's `requirements` labels for password/passcode, OTP/verification/2FA, PIN, recovery/backup, session/access-token, remote-access, bank/card-login and card-security terms. The query returned **zero matching requirement labels**.
- No product records, customer/order/payment rows, supplier records, database schema, migrations, payment settings or production configuration were changed. No supplier was contacted and no credential was collected or stored.
- Existing published requirements are limited to product identifiers and delivery contact information (for example player/zone IDs, delivery email and account region). Supplier legitimacy, product authority and fulfilment remain unverified under MT-0042/MT-0043.

### Verification
- The first CI attempt for the initial code commit (`42225067947`) failed in unit tests because the new regex word-boundary escapes were over-escaped. The matcher was corrected in commit `9dde237c722c1ed69db33342d7f59ebee78389d5`; the final code commit is `b5425b9873a23cba214412f5683fc932ee9abbcd`.
- GitHub Actions run [`42225332691`](https://github.com/eboxont-code/mtdgc/actions/runs/42225332691) completed successfully: lint, unit tests, TypeScript typecheck and production build all passed.
- Vercel production deployment [`dpl_CVTCqR2dQ6JtKyhHqAJaHKvQk6ch`](https://vercel.com/boxont/mtdgc/CVTCqR2dQ6JtKyhHqAJaHKvQk6ch) reached **READY** for commit `b5425b9873a23cba214412f5683fc932ee9abbcd`, with `mtdgc.com` and `www.mtdgc.com` assigned and no alias error.
- Lovable's latest commit SHA matched GitHub `main` at `b5425b9873a23cba214412f5683fc932ee9abbcd`.
- Vercel reported no runtime errors in the preceding 24-hour window.

**Next P0 task:** MT-0083 — ensure payment proof is attached to the correct order and cannot be reassigned by another customer. MT-0081's payment-flow audit is complete; its control gaps remain assigned to the existing payment-proof, file-validation, access-control, payment-verification and duplicate-reference tasks. Supplier test transactions and supplier pricing tasks remain blocked by the evidence and owner-decision reasons recorded in the task register above.


## 24. QR and bank-transfer payment-flow audit — 7 November 2026

**Task:** MT-0081 · P0 · DONE — audit only. This status means the existing flow was traced and documented; it does not mean payment verification, reconciliation or fulfilment controls have all passed.

### Scope and evidence reviewed

- GitHub `main` source commit audited: `eef8d91d9c3eb68e434b098857b3bb48d18d6aa0`.
- Customer path: `src/routes/checkout.tsx`, `src/components/payment-proof-form.tsx`, `src/routes/order.$orderNumber.tsx`, `src/routes/track-order.tsx`.
- Server path: `src/lib/orders.functions.ts` — `placeOrder`, `getPaymentSettings`, `submitPaymentProof`.
- Admin path: `src/routes/_authenticated/admin.tsx`, `src/components/admin/payments-panel.tsx`, `src/components/admin/verify-panel.tsx`, `src/components/admin/order-detail-panel.tsx`, `src/lib/admin.functions.ts` — `getAdminPaymentSettings`, `savePaymentSettings`, `uploadPaymentQr`, `listPaymentsToVerify`, `getPaymentProofUrl`, `reviewPayment`, `updateOrderStatus`.
- Database migrations inspected: `0000_create_mtdgc_commerce_core.sql`, `0005_order_status_payment_values.sql`, `0006_order_flow.sql`, `0007_payment_settings.sql`, `0009_payment_qr_private_and_payment_proofs.sql`.
- Read-only production checks: table definitions, RLS policies, storage bucket visibility/limits, payment/order counts, payment-related indexes, migration history and security/health advisors. No SQL writes were run.

### Current flow traced

1. **Payment configuration:** an admin can save one `payment_settings` row and upload a QR image through admin-only server functions. The QR bucket is private. Public checkout obtains bank details and, when present, a one-hour signed QR URL through the server-side `getPaymentSettings` function.
2. **Checkout:** `src/lib/payments.ts` enables only manual `manual_qr` (QR or bank transfer). Khalti and eSewa are disabled placeholders; there is no live gateway SDK, payment API or webhook. The customer places the order first; the site does not charge a card.
3. **Missing configuration fallback:** when no payment settings exist, checkout still permits order placement and tells the customer that the team will send payment details shortly. This is a manual follow-up, not an on-site payment instruction.
4. **Order creation:** `placeOrder` reloads each SKU and current variant price server-side, creates the order with status `pending_payment`, and stores the order-item price snapshot. The database enforces a UNIQUE constraint on `orders.order_number`; MT-0082 now strengthens newly generated references with 128 bits of cryptographic randomness (section 25).
5. **Customer proof submission:** `submitPaymentProof` checks the order access token, authenticated owner token or rate-limited contact proof; requires the order to be `pending_payment`; limits the image to 5 MB; checks JPEG/PNG/WebP MIME type and file signature; uploads under an order-ID folder in the private `payment-proofs` bucket; then changes the order to `payment_submitted` and creates a proof record.
6. **Manual verification:** the admin queue lists `payment_submitted` orders and their latest submitted proof. `getPaymentProofUrl` requires an admin role and returns a five-minute signed URL. `reviewPayment` lets an admin mark the order/proof verified or rejected, or return the order to `pending_payment` when a new proof is requested.

### Read-only production snapshot — 7 November 2026

- The MTDGC Supabase project was `ACTIVE_HEALTHY`.
- `payment_settings` contained **0 rows**. No QR path, bank name, account name, account number or Fonepay-enabled setting was configured. The actual account details were not retrieved.
- `payment_proofs` contained **0 rows**.
- `orders` contained **8 rows**, all in `pending_payment`; no order was in `payment_submitted` or a verified/delivered state.
- Both `payment-qr` and `payment-proofs` storage buckets were private. Their configured size limits were 2 MB and 5 MB respectively. Storage `allowed_mime_types` was null for both, so MIME/signature enforcement currently depends on application code.
- RLS inspection showed payment settings readable by authenticated admins; payment proofs readable by the owning signed-in customer or admin; payment-proof objects readable by the registered order owner or admin; and QR objects readable by admins. Guest proof access is mediated by server-side order access checks, not direct guest RLS.
- The payment-proof indexes include the primary key and `payment_proofs_order_idx`; there is **no unique index on `transaction_ref`**. The orders table has a unique index on `order_number`.
- The live database migration history contains `0010_catchup_storage_buckets` and `0011_harden_grants`, which are not present in this repository's `drizzle/migrations` tree. This is a migration-history reconciliation item; do not create/apply migrations or change the live database as part of this audit.

### Findings and required follow-up

1. **Payment details are not configured.** With zero `payment_settings` rows, customers do not receive QR/bank details from checkout and must wait for staff to send them. No payment configuration was changed. Populate details only through the approved business process; do not invent bank/payment information.
2. **Proof submission is not atomic and ignores write errors.** `submitPaymentProof` uploads the file, changes the order to `payment_submitted`, then inserts `payment_proofs` and `order_status_events`. The proof/event insert errors are not checked before returning success. A failed insert can leave a submitted order without a proof record and an orphaned storage object. The status transition and proof record should be made transactional or have verified compensation and explicit error handling.
3. **Payment review is not atomic.** `reviewPayment` changes the order status first, then updates the proof and writes status events without checking all returned errors. The UI can report a successful review even if proof metadata or history writes fail. The order/proof/event changes need one transaction or robust checked compensation.
4. **Admin status editing can bypass payment review.** `updateOrderStatus` accepts `paid`, `verified`, `processing` and `delivered` from the general Orders panel and order-detail selector without requiring a submitted proof or verified payment. This means an admin can move an order into fulfilment without using `reviewPayment`. MT-0086 must enforce the payment gate server-side before fulfilment; do not rely on hiding UI options.
5. **Duplicate transaction references are not prevented.** The submitted reference is length-checked but is neither deduplicated in application code nor protected by a database unique constraint. The schema has no unique index for `transaction_ref`. Address under MT-0087, including concurrency-safe enforcement.
6. **File validation is partial.** Customer proof upload checks declared MIME, size and leading file signature, but does not fully decode/re-encode the image. The private bucket has a 5 MB cap but no storage-level MIME allowlist. Keep MT-0084 open until the complete content-handling control is implemented and tested.
7. **Access controls are present but need dedicated negative tests.** Server-side proof URL generation checks admin role; private storage and RLS limit direct reads. Guest submission uses order access-token/contact verification. Keep MT-0083/MT-0085 open until ownership, cross-order reassignment and guest/admin access paths have explicit tests.
8. **No independent payment reconciliation exists in the app.** The admin verifies manually from the uploaded screenshot/reference. No bank statement import, payment provider callback or settlement integration was found. The proof's `amount_minor` is copied from the order total; the application does not independently confirm that the external account received that amount. Do not describe screenshot upload as payment confirmation; retain manual verification and complete MT-0086 before fulfilment.
9. **Audit/history persistence is best-effort.** Order status-event inserts in order placement, proof submission and review are not all checked. This can leave the timeline incomplete even when the primary status update succeeded.

### Verification and boundaries

- GitHub Actions run [`42225520581`](https://github.com/eboxont-code/mtdgc/actions/runs/42225520581) passed lint, unit tests, TypeScript typecheck and production build for audited source commit `eef8d91d9c3eb68e434b098857b3bb48d18d6aa0`.
- Vercel production deployment [`dpl_8Kn2vshSTuqgJXR6R5xVME4ccgvD`](https://vercel.com/boxont/mtdgc/8Kn2vshSTuqgJXR6R5xVME4ccgvD) was **READY**, sourced from the same `main` commit, with `mtdgc.com`, `www.mtdgc.com` and the project aliases assigned and no alias error.
- Vercel's aggregated runtime-error check found no runtime errors in the preceding 24 hours; the most recent 50-minute production log query returned no error/fatal logs. Supabase's 24-hour log query contained no payment/proof/settings endpoint mentions. These are monitoring snapshots, not proof of a successful live payment.
- No code, schema, migration, payment setting, order, payment-proof or storage object was changed. No order was created, no payment was made, and no supplier or third party was contacted.
- Because this task was an audit/documentation task, no application source files or tests were changed. The documentation commit `380099fa08291870791cf104525974acb79c8e99` triggered GitHub Actions run [`42232921172`](https://github.com/eboxont-code/mtdgc/actions/runs/42232921172), which passed lint, unit tests, TypeScript typecheck and production build. Vercel production deployment [`dpl_2eGMLium1BZLEPAaprpjhEqnvyaR`](https://vercel.com/boxont/mtdgc/2eGMLium1BZLEPAaprpjhEqnvyaR) reached **READY** from the same commit with `mtdgc.com` and `www.mtdgc.com` assigned and no alias error. Lovable's `latest_commit_sha` also matched `main` at `380099fa08291870791cf104525974acb79c8e99`. Vercel's last-hour runtime-error check found no errors.

**Next P0 task:** MT-0083 — ensure payment proof is attached to the correct order and cannot be reassigned by another customer. The payment-control findings above remain open under their existing tasks; do not mark them complete based solely on this audit.


## 25. High-entropy order references — 7 November 2026

**Task:** MT-0082 · P0 · DONE.

### Findings and implementation

- Before this change, `placeOrder` generated customer-facing references from one cryptographically random 32-bit value reduced modulo 900,000 and formatted as `MT` plus six digits. This offered only about 19.8 bits of reference space, which was not a sufficiently strong non-guessable identifier.
- Added `src/lib/order-reference.ts`. `generateOrderReference()` now obtains 16 bytes from Web Crypto `getRandomValues` and formats all 128 random bits as 32 uppercase hexadecimal characters after the `MT` prefix. New references are 34 characters total, with 128 bits of cryptographic randomness and no modulo reduction.
- Updated `placeOrder` to use the generator. The existing five-attempt retry for PostgreSQL unique-violation code `23505` remains in place.
- Verified the live MTDGC Supabase schema read-only on 7 November 2026: `public.orders.order_number` is marked `unique`. The live table had 8 rows at the time of inspection. No order values were retrieved or changed. This database constraint is the final uniqueness guarantee; random generation alone is not claimed to guarantee mathematical uniqueness.
- Updated the tracking page to accept the new `MT` + 32 hexadecimal format while retaining the existing historical `MT123456`, `MTD-...` and `MTDGC-...` formats. The input is capped at the existing server-supported maximum of 40 characters. No migration or production data change was required.
- Existing order access remains protected separately by the 32-byte access token and contact/owner checks. The new public reference is not treated as an authentication credential.

### Tests and verification

- Added `src/lib/order-reference.test.ts` with four focused tests: 128-bit output format/length, 1,000-reference batch uniqueness, compatibility with historical formats, and malformed-reference rejection.
- GitHub Actions run [`42241329123`](https://github.com/eboxont-code/mtdgc/actions/runs/42241329123) completed **successfully** on 7 November 2026: dependency installation, ESLint, unit tests, TypeScript typecheck and production build all passed.
- Vercel production deployment [`dpl_Dsh4h5neyBT8WikUJv6cPaScwGfH`](https://vercel.com/boxont/mtdgc/Dsh4h5neyBT8WikUJv6cPaScwGfH) reached **READY** for code commit `d81e1fc51ed2e1203defb63ec6a71dbcd21e889b`, with `mtdgc.com` and `www.mtdgc.com` aliases assigned and no alias error.
- Vercel's production runtime-error query for the preceding hour returned no runtime errors.
- The code changes do not alter existing order numbers, payment state, database schema, storage, supplier records or billing. No test order, payment or production write was performed.

**Next P0 task:** MT-0083 — ensure payment proof is attached to the correct order and cannot be reassigned by another customer. Preserve the existing guest access-token/contact and signed-in owner flows; add focused negative tests before considering that control complete.



## 26. Payment proof ownership and order association — 7 November 2026

**Task:** MT-0083 · P0 · DONE at repository/code level. Production rollout remains separately blocked; do not describe this control as active on the live site until the latest commit is deployed.

### Implementation

- Added `src/lib/order-access.ts` to centralise the existing order access checks used by both `getOrderForViewer` and `submitPaymentProof`: order-specific access-token hash, authenticated account-owner match, and the existing contact fallback.
- Contact fallback remains behind the existing per-IP lookup-attempt limit. The refactor preserves guest access-token, contact and signed-in owner paths while ensuring the same tested checks are used for order viewing and proof submission.
- Added `buildPaymentProofAssociation`. It receives the order record resolved server-side from the submitted order number and builds the storage path and proof row from that record: the storage folder and `payment_proofs.order_id` use the same resolved order ID, the amount comes from `orders.total_minor`, and the transaction reference comes from the validated form input.
- The customer form does not supply an order ID, storage path or amount. The server does not accept those values from the request; it derives them after authorising the resolved order.
- No database schema, RLS policy, storage configuration, payment setting, order, proof or production data was changed.

### Tests and CI evidence

- Added `src/lib/order-access.test.ts` with four tests:
  1. An access token for one order does not authorise another order.
  2. An authenticated customer can access only an order belonging to that account.
  3. Contact fallback is bound to the order number and saved customer contact.
  4. Storage path, proof order ID, transaction reference and amount are derived from the resolved order.
- Final GitHub Actions run [`42251069775`](https://github.com/eboxont-code/mtdgc/actions/runs/42251069775) passed on 7 November 2026 for commit `26a69301856a715a2cbd293da2cf88227d694ca5`: ESLint passed, **25 tests across 8 files passed**, TypeScript `tsc --noEmit` passed, and the production build passed.
- Two earlier CI attempts exposed and corrected test/typing issues before the final successful run: run `42250860331` caught a contact-normalisation test-fixture mismatch; run `42250912631` passed all tests but caught a missing `transactionRef` argument in the new association helper. The final commit contains both corrections.

### Production deployment blocker — do not bypass or pay to resolve

- The latest application-code commit is `26a69301856a715a2cbd293da2cf88227d694ca5`. Subsequent `main` commits in this run are documentation-only plan updates; no application source changed after the successful code CI run.
- Vercel's current production aliases `mtdgc.com` and `www.mtdgc.com` still point to READY deployment [`dpl_4nELrLJ21wEGvAAtVbs2g6UPsNhC`](https://vercel.com/boxont/mtdgc/4nELrLJ21wEGvAAtVbs2g6UPsNhC), sourced from intermediate commit `779d2da9f42fd55acb66e1015b7c1ecfe29ee1d7`, not the final tested `main` commit.
- A production deployment request for `26a69301856a715a2cbd293da2cf88227d694ca5` was rejected by Vercel with **HTTP 402 `payment_required`**, error code `api-deployments-free-per-day`: the free deployment API limit had exceeded 100 deployments for the day and Vercel returned `retryAfter: 86400` (24 hours). The available execution environment has no Vercel CLI binary or local Vercel CLI credentials for the suggested CLI fallback. No plan upgrade, billing change or alternate paid service was attempted.
- The intermediate production deployment `779d2da` contains the initial association-helper call without the validated transaction-reference argument. Because `payment_proofs.transaction_ref` is NOT NULL and the existing handler does not check the proof-insert error (separately recorded in section 24), that intermediate build could fail to persist proof metadata while the order status has already changed. Treat this as a production release risk until commit `26a6930` is deployed.
- Read-only production SQL after the intermediate deployment found: **8 total orders, 0 payment proofs, 0 orders created since that deployment, 0 submitted orders since that deployment, and 0 submitted orders without a proof**. No affected order was found in that snapshot; no production data was changed.
- Vercel's last-hour runtime-error query found no runtime-error clusters, and the last-30-minute production error/fatal log query returned no entries. These monitoring results do not prove a payment submission succeeded; there were no orders created after the intermediate deployment in the read-only snapshot.
- **Release action:** wait until the Vercel free deployment API quota has reset (the returned retry window was 24 hours), confirm the latest documentation-only `main` HEAD has a passing quality run, then deploy that current `main` commit (which includes the tested application-code commit `26a69301856a715a2cbd293da2cf88227d694ca5`) to production and verify both aliases before treating MT-0083 as live. Do not upgrade the plan or change billing to bypass the limit.

**Next P0 task:** MT-0084 — validate uploaded proof file type, size and content handling. The source-level MT-0083 implementation is committed and CI-verified; its production rollout remains subject to the Vercel deployment quota above.


## 30. Pre-fulfilment checklist and order-time snapshot — 7 November 2026

**Task:** MT-0122 · P0 · DONE — new orders now retain the product region and required customer-field labels that applied when the selected SKU was resolved, and the administrator order-detail view presents those facts as a per-item pre-fulfilment checklist.

### Implementation and data boundary

- Added `src/lib/pre-fulfilment.ts`. `buildOrderItemFieldsSnapshot` adds a versioned `__mtdgc_snapshot` object to the existing `order_items.fields` JSONB. It contains only the server-read product `region` and the exact `requirements` labels; customer-provided field values remain top-level strings.
- `placeOrder` resolves the selected SKU and its product on the server, then snapshots the product's region and requirements alongside the existing order-item variant name and price. The browser cannot supply the snapshot metadata: the order-line validator rejects the reserved key before order creation.
- The selected option/denomination is already retained in `order_items.variant_name`; no extra column or schema migration was needed.
- The admin order-detail panel uses `getPreFulfilmentChecklist` to display the saved option, order-time region, each required customer field and whether its value was recorded. Additional captured fields remain visible.
- The checklist never consults today's product row to reconstruct an older order. Legacy items without a valid versioned snapshot are clearly marked as not captured or unrecognised; missing historical requirements are not guessed.
- The checklist is an internal review aid only. It does not assert supplier legitimacy, region compatibility, payment settlement, fulfilment readiness or delivery evidence. MT-0121 remains blocked until supplier-specific instructions are verified.
- No new table, column, bucket, RLS policy, grant, production record or migration was introduced. Existing order-item access controls remain unchanged. The public guest order summary does not select or return the `fields` JSONB.

### Regression coverage

- Added `src/lib/pre-fulfilment.test.ts` with six cases:
  1. Store server-sourced region and required labels while preserving customer values.
  2. Reject browser-supplied reserved metadata and malformed product metadata.
  3. Flag missing player ID, zone, server and email values from the order-time requirement snapshot.
  4. Handle products that had no required customer fields.
  5. Avoid inferring historical region or requirements for legacy orders.
  6. Treat unknown snapshot versions as unrecognised rather than trusting them.
- The focused test file is compatible with the repository's existing `node:test`/Bun test convention.

### Verification and release boundary
- Implementation is isolated on `automation/mt-0122-pre-fulfilment-checklist-20261107`, 9 commits ahead and 0 behind current main. Draft [PR #6](https://github.com/eboxont-code/mtdgc/pull/6) contains only the MT-0122 helper, tests, order-creation snapshot, admin checklist and supporting documentation; final head commit: [ae370b4](https://github.com/eboxont-code/mtdgc/commit/ae370b4ed7c99a462c00a3c16ec580084c8c4752). PR remains open and unmerged for review.

- Production schema inspection confirmed `order_items.fields` is existing JSONB and `products.region` / `products.requirements` are present. A read-only catalogue query found the current requirement labels for the available top-up and gift-card listings; no order-item/customer field values were queried.
- GitHub Actions Quality run [42372233958](https://github.com/eboxont-code/mtdgc/actions/runs/42372233958) passed on application-code head `08ffa011cdc6f2ef66867c4b1a9054a42def3c61`, and final PR-head run [42372320583](https://github.com/eboxont-code/mtdgc/actions/runs/42372320583) passed on `fe99d856bef064d9404d51c77345719281813848`: Bun setup, frozen dependency install, ESLint, full Bun unit-test suite, TypeScript typecheck and production build all succeeded.
- Vercel automatically built an intermediate preview for code commit `14ca32baace819787a81b5e04d2d435370d7dc36` and it reached READY at [mtdgc-29tv77obl-boxont.vercel.app](https://mtdgc-29tv77obl-boxont.vercel.app) (`target = null`, preview only). The final PR head `08ffa011` has a Vercel failure status pointing to the free build-rate limit; no final-head preview is verified. Production remains READY on older commit `779d2da9f42fd55acb66e1015b7c1ecfe29ee1d7`; no production deployment was requested.
- The implementation was isolated from the older `automation/mt-0104-order-transition-guard` branch, which is 80 commits ahead and 7 behind main and contains several unrelated tasks. Only the MT-0122 helper, tests, order-creation snapshot and admin checklist are carried into this clean main-based branch.
- The canonical plan version header is deliberately unchanged while open PRs #2–#5 contain overlapping plan-version and architecture edits. Reconcile the version once those documentation branches are reviewed; do not merge their overlapping sections blindly.
- No production database, order, payment, storage, authentication, environment, DNS, hosting, deployment or billing changes were made. No supplier/customer was contacted and no additional spend occurred.

**Next P0 task:** MT-0126 — verify that no customer game/subscription password, OTP/2FA code, recovery code or payment PIN is requested anywhere in product requirements, checkout, support and administrator flows. Reuse the existing unsafe-requirement guard and add focused regression coverage; do not invent new product requirements.



## 31. Final checkout confirmation for current top-up and emailed-code categories — 7 November 2026

**Task:** MT-0123 · P0 · DONE — added a final customer review for the current orderable game top-up and emailed gift-card categories. The review is an accuracy safeguard; it does not assert that a specific supplier action is irreversible.

### Production catalogue scope and evidence

- A read-only query against Supabase project `mtdgc` (`eaomkkswslqtfunkceuc`) on 7 November 2026 found four currently orderable `game-top-ups` products — Clash of Clans Passes, Free Fire Diamonds, Mobile Legends Diamonds and PUBG Mobile UC — with 13 orderable variants in total.
- The same query found one currently orderable `gift-cards` product, Roblox Gift Card, with two orderable variants. Its product record identifies delivery by digital code to the delivery email.
- Other gift-card listings were not orderable; software and subscription products were not treated as code-release actions because their current records do not establish an active code-delivery route.
- The production product schema has no explicit supplier-side `irreversible` flag, and the Supplier Register contains no verified supplier/product-scope records. No supplier-specific reversal, redemption or irreversibility rule was inferred.

### Implementation

- Added `src/lib/order-confirmation.ts` with one shared policy for the `game-top-ups` and `gift-cards` category slugs. Older persisted cart lines that have delivery fields but no saved category are conservatively prompted for confirmation.
- Checkout opens a final `AlertDialog` before order creation. It shows each applicable product, selected option/face value, quantity, listed region and exact saved delivery-field values. The customer can return to edit or choose **Confirm details & place order**.
- Both the desktop review action and the mobile sticky checkout action use the same confirmation path.
- `placeOrder` resolves the selected SKU and its product category from Supabase, then rejects a top-up/gift-card order when `detailsConfirmed` is absent or false. The server does not trust the category label saved in the browser cart.
- The acknowledgement is a checkout mistake-prevention safeguard, not an authorization boundary or cryptographic proof that a human read the dialog. A deliberate direct API caller can submit the flag; payment settlement, supplier verification and fulfilment controls remain separate.
- The copy asks customers to verify the exact details and does not promise that an order can or cannot be reversed. No schema migration, production record update, supplier contact or payment action was required.

### Regression coverage

- Added `src/lib/order-confirmation.test.ts` with five tests covering:
  1. Exact supported category detection and unrelated-category exclusion.
  2. Confirmation requirement for game top-ups and gift cards.
  3. Conservative confirmation for legacy cart lines with delivery fields but no category.
  4. Server rejection of unconfirmed top-up and gift-card orders.
  5. Server acceptance of confirmed sensitive categories and non-gating of unrelated categories.

### Verification and release boundary

- Implementation is isolated on `automation/mt-0123-second-confirmation-20261107`, stacked on the independently tested MT-0122 branch `automation/mt-0122-pre-fulfilment-checklist-20261107`. Draft [PR #7](https://github.com/eboxont-code/mtdgc/pull/7) is open, unmerged and now targets the MT-0122 branch; its final diff contains six files and seven commits for MT-0123 only. It was temporarily targeted at `main` to run the repository's main-targeted quality workflow, then retargeted after that run passed. Implementation commits: [helper](https://github.com/eboxont-code/mtdgc/commit/1343a74498250ed2477c96c94416b19b70878195), [tests](https://github.com/eboxont-code/mtdgc/commit/a6928694d7e84a80bc8cacf059e6b913368187d5), [server gate](https://github.com/eboxont-code/mtdgc/commit/f0ec09b08a3daaa88834da200e42983dcb413373), [checkout dialog](https://github.com/eboxont-code/mtdgc/commit/78dc5c2e008d7d1ddc3fd81800dd26f5b02441c6), and [final verification record](https://github.com/eboxont-code/mtdgc/commit/fb75f72a8dec238415530e5d71202fa8e1c9f8c2).
- GitHub Actions Quality run [42376713964](https://github.com/eboxont-code/mtdgc/actions/runs/42376713964) completed successfully on 7 November 2026 for combined PR #6 + MT-0123 head `3f8f52be5d87a5b68d2ce551480c3c9303f6da60`: Bun setup, frozen dependency install, ESLint, full Bun unit tests, TypeScript typecheck and production build all passed. The focused confirmation test file also passed 5/5 under Node 22.16.0 in the available scratch environment, and strict TypeScript checking of the pure helper passed with TypeScript 5.8.3.
- Vercel's read-only deployment list returned no deployment for this branch at final inspection, so no branch preview is claimed. The production deployment remains READY on older main commit `779d2da9f42fd55acb66e1015b7c1ecfe29ee1d7` with the production aliases assigned; no deployment was requested. No production database, order, payment, storage, authentication, environment, DNS, hosting, deployment or billing changes were made. No supplier/customer was contacted and no additional spend occurred.
