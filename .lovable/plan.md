# MT-0102: clear order-status meanings

## Scope
- Clarify the four existing milestones in shared customer wording: Payment received means proof or a payment record received, not independently confirmed funds; Verified means staff approved the payment review; Processing means staff marked preparation underway; Delivered means staff marked delivery complete.
- Reuse those same definitions in tracking, the how-it-works page and four FAQ answers. Keep existing components and Matrix tokens.
- Verify visible wording at 390px first, then desktop, with no horizontal overflow. Record tests and browser evidence in the Master Plan.
- Leave protected files, server actions, order data, pricing and status permissions unchanged. Do not publish.

## Technical details
- Reuse `ORDER_STEPS` in `format.ts` as the shared definition source; keep existing status mappings unchanged.
- Add existing-component presentation to how-it-works and derive FAQ answer text from the shared definitions so tracking and help cannot drift.
- Run existing order-guidance and formatting tests; no copy or snapshot tests.

## Historical plan (not part of this task)
Upgrade the existing MTDGC storefront into a data-driven digital marketplace without replacing its brand or warm retail design. Launch with the seven configured product lines and researched catalog candidates kept as unpublished drafts until MTDGC confirms pricing, regions, stock, fulfilment, and refund rules.

## What will be built

### 1. Commerce foundation
- Move products, categories, variants, prices, regions, availability, badges, requirements, delivery facts, redemption details, and SEO fields into Lovable Cloud.
- Seed the seven existing product lines with honest availability. Add broader researched catalog candidates only as unpublished admin drafts.
- Add multiple-currency fields with NPR as the active launch currency.
- Build reusable catalog, product, price, availability, breadcrumb, facts, recommendation, and empty/error/loading components.
- Add global search across name, brand, game, category, keywords, SKU, and tags; category filters; and Popular, Newest, Price, Best selling, and Recommended sorting. Rankings remain evidence-based, never fabricated.

### 2. Storefront and discovery
- Preserve and refine the current MTDGC visual identity, typography, colors, imagery, and mobile-first layout.
- Create crawlable routes for the home page, catalog/category pages, every configured product, cart, checkout, tracking, help, contact, FAQs, guides, policies, auth, and customer account.
- Build dedicated product pages with variants, dynamic pricing, availability, regional restrictions, requirements, delivery facts, refund eligibility, redemption steps, product FAQs, related products, and recently viewed items.
- Do not expose empty roadmap categories as purchasable. They may appear only in factual company/category roadmap content where clearly labelled.

### 3. Cart and honest launch checkout
- Replace the in-memory cart with a session-persistent cart supporting variants, quantities, removal, saved state, promo-code validation hooks, automatic-discount rules, and server-recalculated totals.
- Add a mini cart and full cart page.
- Build a focused guest and signed-in checkout with product-specific Player ID, UID, Server/Zone, region, platform, or delivery-email fields.
- Add validation, duplicate-submit protection, a final details confirmation, order summary, human-readable order number, and professional confirmation/failure states.
- Launch order submission through persisted request/WhatsApp fulfilment until a payment provider is connected. The UI will not claim that online payment or automatic delivery is available.
- Model pending, processing, paid, failed, cancelled, refunded, fulfilled, and completed states so a payment/provider integration can be added without redesigning checkout.

### 4. Accounts, orders, and support
- Enable email/password and Google sign-in while preserving guest checkout.
- Add full customer profiles with display name, phone, saved delivery details, preferences, wishlist, and secure owner-only access.
- Add account pages for profile, orders, order detail/timeline, reorder, eligible delivery history, wishlist, and support requests.
- Add public order tracking using order number plus verification data, without exposing customer data.
- Add order-help and support-ticket flows with issue type, description, order reference, and private screenshot upload.
- Keep WhatsApp prominent. Add email support only after MTDGC supplies a real support address.

### 5. Trust, reviews, policies, and knowledge
- Replace unsupported claims such as “secure payment” or guaranteed speed with precise statements supported by the live fulfilment flow.
- Add the security notice: “We will never ask for your password, OTP or payment PIN.”
- Build product-linked reviews with star rating, date, moderation, and verified-purchase badges granted only from eligible completed orders. No seed reviews or ratings.
- Add real-statistics slots driven only by stored data; hide them until meaningful.
- Build global, category, and product FAQs plus guide architecture for IDs, redemption, subscriptions, payments, refunds, delivery, security, regions, and troubleshooting.
- Publish terms, privacy, refund, delivery, and contact pages only with factual rules. Missing MTDGC-specific policy facts will be clearly marked as launch blockers rather than invented.

### 6. Admin-ready operations
- Create a separate role table and server-verified admin access.
- Add protected management surfaces for products, categories, variants, prices, availability, orders, customers, reviews, coupons, promotions, FAQs, guides/content, support tickets, delivery settings, payment settings, and factual analytics.
- Apply least-privilege row policies to public catalog data, customer-owned data, moderation data, and administrative actions.
- Validate all writes on the server, sanitize user content, protect private files, and avoid exposing credentials or customer information.

### 7. SEO and AI-readable content
- Add unique titles, descriptions, canonical URLs, Open Graph tags, and Twitter cards to every public content route.
- Add visible and structured breadcrumbs, Product and Offer schema for real offers, Organization and WebSite schema, SearchAction, and Article schema for guides.
- Add review/aggregate fields only when legitimate review data exists. Keep FAQs semantically structured without adding unsupported rich-result claims.
- Add a generated sitemap and correct robots rules for public routes; exclude auth, checkout, account, admin, tracking results, and private order pages.
- Keep critical product facts and answers in server-rendered semantic HTML with clear internal links among products, categories, guides, policies, and support.
- Add authoritative factual pages covering MTDGC, products sold, delivery, payment status, refunds, regions, security, and support.

### 8. Quality and launch audit
- Test desktop and mobile navigation, search, filters, sorting, product variants/forms, cart persistence, checkout, guest and account flows, tracking, review eligibility, support upload, unavailable products, empty/loading/network/failure states, 404s, and keyboard operation.
- Audit labels, focus order, contrast, alt text, headings, dialogs, forms, screen-reader output, image loading, layout stability, and unnecessary JavaScript.
- Validate metadata, canonical URLs, structured data, sitemap, robots, internal links, public/private data boundaries, database policies, and browser console/network errors.
- Publish only after checks pass, then verify the public MTDGC URL.

## Technical approach
- TanStack Start routes and server functions remain the application foundation.
- Lovable Cloud stores catalog, accounts, carts, orders, reviews, coupons, content, tickets, roles, and private uploads.
- Public catalog reads use narrow public access; customer and admin actions require server-validated identity and row policies.
- The catalog and checkout use shared validation schemas, typed data access, and server-authoritative prices.
- Local storage is limited to non-sensitive convenience state such as recently viewed items and an anonymous cart identifier.

## Required launch inputs and external dependencies
- MTDGC must provide the real support email, delivery windows, refund eligibility/rules, legal business/contact details, and confirmed product variants/prices/regions.
- A real payment method requires choosing and configuring a provider. Until then, checkout creates a trackable order request and continues through WhatsApp without claiming payment acceptance.
- Automatic digital delivery requires a provider/API and credentials. The architecture will be ready, but fulfilment remains manual until connected.
- A large researched catalog can be prepared as drafts, but no researched item becomes publicly available without MTDGC confirmation.
