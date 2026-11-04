# MTDGC Master Plan

**Project:** Matrix Digital Goods & Commerce (MTDGC)
**Domain:** https://mtdgc.com
**Version:** 1.0 · 5 November 2026
**Purpose:** Build a reliable, profitable and expandable digital-commerce operation for Nepal first, with Australia and further markets introduced only when sourcing, payments, legal requirements and fulfilment are ready.

> **This is an original MTDGC plan.** Its business model, priorities, workstreams and tasks are purpose-built for digital products and digital fulfilment.

## 1. Strategic direction

MTDGC is not a neighbourhood directory or a website-lead funnel. It is a curated digital-goods retailer that sells game top-ups, gift cards, subscriptions and software, with room to add AI, cloud, mobile and business products when legitimate supply is secured.

**North star:** completed orders that are correctly fulfilled, supported and profitable after product cost, currency conversion, payment costs, refunds and operating effort.

**Customer promise:** clear product details, honest regional compatibility, transparent order status and human support when something goes wrong.

### Strategic priorities

1. Make the existing order-to-delivery operation dependable before adding volume.
2. Secure legitimate, traceable suppliers and verify every product/region combination.
3. Replace manual payment and fulfilment steps gradually, never by weakening verification.
4. Build market-specific experiences for Nepal and Australia instead of assuming one currency or payment flow fits both.
5. Grow the catalogue based on supplier quality, customer demand and contribution margin.
6. Build customer trust through accurate policies, real reviews and honest delivery claims.
7. Expand categories and countries only after operational launch gates are passed.

## 2. Current website baseline

The live site currently presents MTDGC as Matrix Digital Goods & Commerce and describes Nepal and Australia as target customers. The catalog reports 36 product records across subscriptions, gift cards, game top-ups and software. The homepage and product listings show a mixture of orderable and coming-soon items; the currently visible orderable set must be rechecked before being used as an operational count.

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
| First 48 hours | Reconcile product availability, test checkout/payment proof/order tracking, resolve market/legal inconsistency, audit active suppliers. |
| Days 3–14 | Fix order-state defects, payment reconciliation, customer notifications, support and fulfilment checklists. |
| Days 15–30 | Establish true product margins, supplier scorecards, pricing controls and product launch gates. |
| Days 31–60 | Improve catalog UX, product data, SEO, mobile checkout and support knowledge base. |
| Days 61–90 | Pilot safe automation, evaluate local payment integrations and decide whether Australia is operationally ready. |
| After 90 days | Expand categories/markets only when profitability, supplier reliability, compliance and support capacity are proven. |

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

- [ ] **MT-0001 · P0 · TODO** — Choose the primary launch market and define whether Nepal or Australia is the first operational priority.
- [ ] **MT-0002 · P0 · TODO** — Resolve the public positioning discrepancy: About says Nepal and Australia, while Terms currently describe sales to Nepal.
- [ ] **MT-0003 · P0 · TODO** — Define MTDGC as Matrix Digital Goods & Commerce, a multi-category digital commerce brand, not only a game top-up shop.
- [ ] **MT-0004 · P0 · TODO** — Write a one-sentence customer promise based on verified sourcing, clear regions, transparent pricing and accountable delivery.
- [ ] **MT-0005 · P0 · TODO** — Define the first customer segments separately: gamers, gift-card buyers, subscription users and software buyers.
- [ ] **MT-0006 · P0 · TODO** — Define the primary commercial metric as fulfilled, profitable orders, not catalog size or website visits.
- [ ] **MT-0007 · P0 · TODO** — Separate revenue, gross margin, supplier cost, payment cost, refunds and support cost in reporting.
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

- [ ] **MT-0021 · P0 · TODO** — Audit all 36 currently indexed product records and classify each as orderable, coming soon, hidden, duplicate or obsolete.
- [ ] **MT-0022 · P0 · TODO** — Reconcile the homepage, catalog, category pages and product records so product counts and availability labels agree.
- [ ] **MT-0023 · P0 · TODO** — Confirm the exact six products currently shown as available before advertising them as in stock.
- [ ] **MT-0024 · P0 · TODO** — Ensure coming-soon products cannot be purchased or accidentally enter checkout.
- [ ] **MT-0025 · P0 · TODO** — For each orderable item, verify supplier, denomination, region, platform and delivery method.
- [ ] **MT-0026 · P0 · TODO** — Show the exact product variant and amount in cart, checkout, confirmation and order history.
- [ ] **MT-0027 · P0 · TODO** — Distinguish gift card face value from MTDGC selling price and any fees.
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

- [ ] **MT-0041 · P0 · TODO** — Build a supplier register with legal name, country, contact, product scope and verification status.
- [ ] **MT-0042 · P0 · TODO** — Record the source of every code, top-up and subscription before making the listing orderable.
- [ ] **MT-0043 · P0 · TODO** — Verify that each supplier is authorised to resell or distribute the relevant product.
- [ ] **MT-0044 · P0 · TODO** — Reject suppliers who require customer passwords, OTPs, payment PINs or unsafe account access.
- [ ] **MT-0045 · P0 · TODO** — Test one low-value transaction per supplier and product family before scaling orders.
- [ ] **MT-0046 · P0 · TODO** — Document supplier delivery time, cut-off hours, failure process and escalation contact.
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

- [ ] **MT-0061 · P0 · TODO** — Create a landed-cost calculation for every active product and denomination.
- [ ] **MT-0062 · P0 · TODO** — Record supplier currency, exchange rate, conversion timestamp and NPR selling price.
- [ ] **MT-0063 · P0 · TODO** — Calculate gross profit and gross margin per order, not only markup percentage.
- [ ] **MT-0064 · P0 · TODO** — Set a minimum contribution-margin rule with the owner before enabling automatic price updates.
- [ ] **MT-0065 · P0 · TODO** — Prevent checkout when the current price is missing, expired or below the approved margin floor.
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

- [ ] **MT-0081 · P0 · TODO** — Audit the current QR and bank-transfer payment flow from checkout through payment verification.
- [ ] **MT-0082 · P0 · TODO** — Verify each order receives a unique, non-guessable order reference.
- [ ] **MT-0083 · P0 · TODO** — Ensure payment proof is attached to the correct order and cannot be reassigned by another customer.
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

- [ ] **MT-0121 · P0 · TODO** — Document the current manual fulfilment steps for each active product family.
- [ ] **MT-0122 · P0 · TODO** — Create a pre-fulfilment checklist for player ID, zone, server, region, denomination and email.
- [ ] **MT-0123 · P0 · TODO** — Require a second confirmation for irreversible top-ups and code releases.
- [ ] **MT-0124 · P0 · TODO** — Record the supplier transaction or redemption reference for each completed order.
- [ ] **MT-0125 · P0 · TODO** — Capture delivery evidence and attach it to the correct order.
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
- [ ] **MT-0182 · P0 · TODO** — Make the distinction between Available now and Coming soon unambiguous.
- [ ] **MT-0183 · P0 · TODO** — Ensure the product card, product page and checkout show matching prices and variants.
- [ ] **MT-0184 · P0 · TODO** — Show region, platform, delivery method and required customer details above the purchase action.
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

## 8. Immediate next actions

1. Reconcile the 36 product records against actual orderability and supplier availability.
2. Test one complete low-value order for each currently orderable product family.
3. Resolve the Nepal/Australia positioning and Terms mismatch before expanding Australian promotion.
4. Build a supplier and margin register for every orderable product.
5. Verify order tracking, payment proof security, payment matching and status transitions.
6. Record a baseline for margin, payment time, fulfilment time, failure rate and support burden.

## 9. Sources and verification

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

---

**Task count:** 240 original MTDGC tasks across 12 workstreams.
**Rule:** This file is the MTDGC execution plan. Keep all work specific to MTDGC digital products, orders, payments, suppliers and fulfilment.