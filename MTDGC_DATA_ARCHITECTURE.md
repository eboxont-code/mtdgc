# MTDGC Data Architecture Design

## 1. Overview
MTDGC (Matrix Digital Goods & Commerce) is a digital marketplace for Nepal. This architecture is designed for security, scalability, and ease of expansion beyond game top-ups into other digital product lines.

## 2. Secure Data Model

### 2.1 Catalog System
- **Categories**: Logical grouping (e.g., "Battle Royale", "Gift Cards").
- **Products**: The main entity (e.g., "PUBG Mobile UC").
- **Variants**: Specific SKUs (e.g., "60 UC", "325 UC").
- **Metadata**: JSONB field in products to define required customer inputs (e.g., `{"requires_player_id": true, "id_label": "Player ID"}`).

### 2.2 Order & Payment System
- **Orders**: Tracks the transaction, status, and delivery details. Supports both registered and guest users.
- **Order Items**: Snapshots of products/variants at the time of purchase (price, title).
- **Payments**: Decoupled from orders to allow multiple payment attempts or methods for a single order.

### 2.3 User & Support System
- **Profiles**: Extended user data.
- **Reviews**: Product feedback with moderation.
- **Support Tickets**: Integrated customer service.

## 3. RLS & Auth Boundaries

| Table | Public | Authenticated (User) | Admin/Moderator |
|-------|--------|----------------------|-----------------|
| Categories | Read | Read | Read/Write |
| Products | Read | Read | Read/Write |
| Orders | None | Read/Create (Own) | Read/Update (All) |
| Reviews | Read (Approved) | Create | Read/Update (All) |
| Tickets | None | Read/Create (Own) | Read/Update (All) |

## 4. Order & Payment State Model

### 4.1 Live order-status enum

The live `public.order_status` enum contains 13 values. Legacy labels remain in the database for compatibility; an enum value existing does not mean the current application writes it in its normal flow.

| Order status | Current writer / use | Notes |
|---|---|---|
| `pending` | Database default only; no current checkout writer. | Legacy initial state; current checkout explicitly writes `pending_payment`. |
| `pending_payment` | `placeOrder`; proof rejection when resubmission is requested. | Current order-created/payment-pending state. |
| `payment_submitted` | `submitPaymentProof`. | Screenshot/reference submitted for manual review; not independent settlement confirmation. |
| `paid` | Generic administrator status update. | Legacy/manual label; not written by the dedicated proof-review action. |
| `verified` | `reviewPayment` after an administrator decision; generic admin update also accepts it. | Manual proof-review result, not an automated bank/provider match. |
| `rejected` | `reviewPayment` or generic admin update. | Proof/order rejection; may return to `pending_payment` when a new proof is requested. |
| `processing` | Generic administrator status update. | Staff-marked fulfilment in progress. |
| `delivered` | Generic administrator status update. | Staff-marked delivered; no delivery evidence is required by the status setter. |
| `failed` | No current order/admin writer found. | Legacy enum value. |
| `cancelled` | Generic administrator status update. | Status only; no cancellation/refund automation is implied. |
| `refunded` | Generic administrator status update. | Status only; does not execute or verify a refund. |
| `fulfilled` | No current order/admin writer found. | Legacy alias displayed with Delivered. |
| `completed` | No current order/admin writer found. | Legacy alias displayed with Delivered. |

### 4.2 Transitions currently written by the application

These are observed code paths, not an approved business state machine.

| Trigger | Starting state | Result | Guard / limitation |
|---|---|---|---|
| `placeOrder` | New order | `pending_payment` | Explicit initial state. |
| `submitPaymentProof` | `pending_payment` | `payment_submitted` | Conditional update requires the current status to remain `pending_payment`. |
| `reviewPayment` — verify | `payment_submitted` | `verified` | Conditional update requires `payment_submitted`; manual admin decision. |
| `reviewPayment` — reject and request new proof | `payment_submitted` | `pending_payment` | Returns the order for proof resubmission. |
| `reviewPayment` — reject | `payment_submitted` | `rejected` | Conditional update requires `payment_submitted`. |
| `updateOrderStatus` | Any current state | `paid`, `verified`, `rejected`, `processing`, `delivered`, `cancelled`, `refunded` | Admin-only but has no previous-state, proof-review or payment prerequisite; can jump directly to fulfilment. |
| `addOrderNote` | Any | No order-state change | Writes a free-text event label only. |

### 4.3 Separate payment-proof state

`payment_proofs.status` is a separate text field constrained to `submitted`, `verified` and `rejected`. The `resubmit_requested` boolean is not an order status. The proof amount is copied from the order total and is not independent evidence of funds received.

### 4.4 Event-history semantics

`order_status_events.status` is plain text. The history table can contain a label or note that does not correspond to an actual `orders.status` transition; in particular, `addOrderNote` accepts caller-provided event text without updating the order row.

### 4.5 Enforcement boundary

The enum restricts valid status labels only. The live database has no non-internal `public.orders` transition trigger or transition-specific constraint. The dedicated proof submission/review actions have conditional status checks, but the generic admin updater accepts its seven target values from any existing state. Do not treat this observed map as an approved allowed-transition policy; MT-0104 owns transition enforcement after the business rules and payment prerequisites are resolved.

The customer progress helper groups `payment_submitted`/`paid`, `verified`, `processing`, and `delivered`/`fulfilled`/`completed` into four steps. The order page and tracking page retain individual labels for the legacy values. MT-0102/MT-0106 own the operational wording and display consistency work.

### 4.6 Payment-proof image ingestion

- Treat browser MIME and file-name extensions as untrusted hints. The server resolves the actual JPEG, PNG or WebP format with the pinned `sharp@0.35.5` decoder and requires the declared MIME to match.
- Decode with strict warning handling, a 20-megapixel input ceiling and a four-channel ceiling. Empty, malformed, truncated, mismatched, multi-page and over-limit inputs are rejected.
- Apply EXIF orientation and store a lossless WebP re-encoding. Default Sharp output strips source metadata. The normalized output must remain within the existing 5 MiB storage limit.
- The server derives the `.webp` storage extension and `image/webp` content type from the normalized result; the browser cannot choose the stored MIME or extension.
- The production `payment-proofs` bucket remains private and unchanged. Its existing storage-level 5 MiB cap is retained; application-side server validation remains the MIME/content gate because the bucket's `allowed_mime_types` setting is NULL. Only the trusted server upload path writes proof objects.

## 5. Guest Checkout Architecture
- **No Account Required**: Guest orders are created with `user_id = NULL`.
- **Identity**: The order stores the supplied `guest_email` and `guest_phone`. `verification_hash` stores a SHA-256 digest of the order number plus the normalised primary contact; it is not a replacement for the saved contact fields.
- **Order access token**: Checkout generates a per-order 256-bit bearer token, stores only its SHA-256 digest in `access_token_hash`, and returns the token to the customer.
- **Public tracking**: The `/track-order` form requires the order number and the email or phone used on that order. The server resolves the exact order first and then checks the order-scoped contact proof. The browser does not query `public.orders` directly.
- **Other order views**: `getOrderForViewer` accepts the order-specific access token, the authenticated account owner, or a contact fallback after its rate-limit check.

## 6. Launch Strategy (Separation)

### Phase 1: MVP (Manual)
- **Payment**: Users select "Manual Transfer" (eSewa/Khalti) and provide a transaction ID/Screenshot.
- **Fulfillment**: Admins manually update status and send codes via WhatsApp/Email.
- **Architecture**: All tables present, but `payments.provider` is 'manual'.

### Phase 2: Automated
- **Payment**: Integration with eSewa/Khalti SDKs/Webhooks.
- **Fulfillment**: Automated delivery for products with pre-loaded digital codes.



## 7. Catalogue price and checkout snapshot integrity

- The storefront formats selling prices as NPR. A product/variant is purchasable only when both product and variant statuses are `available` or `low_stock`, the variant price is a positive minor-unit integer, both currency fields are `NPR`, and the product is not hidden as a sample/coming-soon listing.
- The catalog card's “From” price and the product page's initial option use the same lowest purchasable variant. A valid explicit SKU selection is preserved. Unavailable variants remain visible with an availability label, but cannot be selected and do not expose a purchasable price. Product structured offers include only purchasable variants.
- The cart stores a display snapshot (product name, variant name and unit price). Current checkout submits that snapshot as an expectation only; it is never used as the order price. The server re-resolves each SKU and its current price from the catalogue. If the snapshot changed, it returns current line values before inserting an order; the client updates the cart and requires a fresh customer submission.
- On success, the server returns the exact line snapshots used for order-item insertion. Checkout's success summary renders those server-resolved values, not the stale browser snapshot.
- Legacy clients may omit the optional expectation fields for backwards compatibility. They still receive server-calculated order prices, but the explicit stale-snapshot refresh/review handshake is provided by the current checkout client.
- The current implementation supports NPR only. Non-NPR product/variant rows fail closed in storefront purchasability and server order creation; no foreign-currency conversion or exchange-rate assumption is made.
- No schema change or migration is required for this control.


## 8. Payment-proof access boundaries

- Direct reads of `public.payment_proofs` are available only to authenticated users whose `auth.uid()` matches the `user_id` of the related order, or to administrators. RLS is enabled; authenticated clients receive SELECT only for this table, while service-role writes remain server-side.
- Direct reads from `storage.objects` for the private `payment-proofs` bucket are limited to authenticated related-order owners or administrators. The object path's first folder segment is the server-resolved order ID. No anonymous policy is present for this bucket.
- The administrator payment-review queue and signed proof-URL function require a validated Supabase session and an exact successful administrator-role result before any proof lookup or signed URL creation. Signed URLs expire after 300 seconds.
- `has_role` remains a SECURITY DEFINER function that Supabase's advisor reports as executable by anon/authenticated. Treat its role-membership disclosure as a separate issue; change function execution and dependent policies only through the approved coordinated Supabase migration gate.
- Guest order access is mediated by server-side order access checks and is not a direct proof-row/object RLS grant. Cross-customer order lookup/contact-fallback isolation remains tracked separately under MT-0162.

## 9. Current authentication and authorisation audit — 10 November 2026

This section records current-main source inspection and read-only production policy/grant evidence. It is not a remediation or permission-change record.

### Session, route and client boundaries

- src/start.ts registers attachSupabaseAuth globally for server functions and installs CSRF middleware for server-function requests.
- The client middleware attaches the active session's Bearer token. requireSupabaseAuth validates it with Supabase Auth getClaims, rejects missing/malformed tokens and missing subjects, and passes the validated user ID plus a user-scoped client to the handler.
- The authenticated route calls supabase.auth.getUser() and redirects signed-out visitors. Route protection is a user-experience gate; database RLS and server-function authorization remain the data boundary.
- The browser client uses only Supabase URL and publishable-key configuration. The service-role client lives in client.server.ts, bypasses RLS, and is dynamically imported only inside trusted server handlers.
- Account/profile/order/wishlist pages use the authenticated browser client and rely on production RLS. The support form requires a signed-in user and sets support_tickets.user_id from the current session; RLS independently enforces the owner predicate.
- The admin page's browser-side role check controls visible UI only. All 14 exported admin server functions require authenticated middleware and call assertAdmin(context) before any handler operation. The server guard accepts only a successful exact boolean true from the role RPC.

### Production RLS and grants

Production Supabase project eaomkkswslqtfunkceuc (mtdgc) reported ACTIVE_HEALTHY in ap-southeast-1, PostgreSQL 17.11.0.003. All 14 public application tables have RLS enabled.

- Profiles: owner-only INSERT/SELECT/UPDATE.
- Orders: owner SELECT; administrator ALL. Authenticated UPDATE grant is still constrained by the administrator-only write policy.
- Order items: owner/admin SELECT; authenticated SELECT only, with service-role writes.
- Support tickets: owner INSERT/SELECT and administrator ALL.
- User roles: owner SELECT; service-role writes only.
- Wishlist items: owner ALL.
- Reviews: approved/own/admin SELECT; owner INSERT only when unapproved and not verified-purchase; administrator UPDATE.
- Order status events: administrator ALL, even though authenticated has INSERT/SELECT grants.
- Payment proofs: owner/admin SELECT; service-role writes only.
- Order lookup attempts: RLS enabled with no client policies and grants only to service_role, which matches the current server-only access path.

### Known security finding

Supabase's security advisor reports WARN for public.has_role(uuid, app_role): it is SECURITY DEFINER and executable by anon/authenticated. Because the function accepts an arbitrary user ID, it can disclose whether that ID has a role. No role-write privilege or privilege escalation was demonstrated. Multiple RLS policies depend on this function; changing it requires a coordinated function/policy migration after the approved Supabase cutover. No production grant, function or policy was changed in this audit.

Cross-customer contact fallback remains a separate task (MT-0162). This audit does not claim to resolve it.

## 9. Customer credential collection safeguards

- The supplier register's mandatory rejection policy is backed by a shared application deny-list in `src/lib/supplier-safety.ts`. Requirement labels are Unicode-normalised and separator-normalised before checking for passwords/passcodes/passkeys, OTP/2FA/MFA/authenticator codes, PINs, recovery/backup/seed secrets, security answers, account access, session/access tokens, API/client/developer keys and tokens, remote access and payment-card credentials.
- The administrator product form uses the shared message for guidance; the `saveProduct` server schema independently rejects unsafe requirement labels. Client-side form validation is not the security boundary.
- Product detail uses a fail-closed projection: null, malformed or unsafe saved requirements yield no customer fields, no field autofill, a review-required unavailable state and disabled variant/purchase actions. Safe identifiers and delivery contacts remain available.
- `placeOrder` re-reads the current requirements from the product joined to the server-resolved SKU and rejects malformed/unsafe requirements before constructing an order row. It also rejects unsafe client-supplied field keys, including stale carts.
- Checkout and support free-text areas display the same warning. Free-text order notes and support descriptions are not keyword-blocked because legitimate troubleshooting may mention passwords/reset flows; the warning cannot prevent a customer from voluntarily typing a secret.
- Production `public.products.requirements` is JSONB. No supplier table or verified supplier/product-scope records are present in the current register/schema, so this safeguard does not claim supplier-side practices have been screened or authorised.
- No schema migration is required. This is an application input-collection safeguard, not proof of supplier legitimacy, payment settlement, product authority or safe account-sharing fulfilment.
## 9. Guest order access and account-order isolation

> **Release status — 10 November 2026:** The guest-only contact fallback and exact authenticated-owner checks described below are implemented in draft PR #27, refreshed to current main. They are not live in production until the exact-head quality checks and repository release requirements pass and the change is merged and deployed.

### 9.1 Account-owned order isolation

- Contact-based access is guest-only. The shared `hasOrderContactAccess` helper denies every order with a non-null `user_id`, even when the supplied phone/email matches the saved contact and verification hash.
- Account-owned orders require either the order-specific access-token hash or a Supabase-authenticated Bearer token whose verified subject exactly matches the order's `user_id`.
- Public `lookupOrder` now selects the server-resolved `user_id`. For account orders it validates the optional Bearer token with Supabase Auth and checks the exact owner; it never falls back to contact matching. For guest orders it retains the existing order-number-plus-contact check.
- The tracking page forwards the current session token when one exists. The order-detail and payment-proof paths already pass the session token; their shared contact fallback is now denied for account-owned orders while guest contact access remains unchanged.
- No order ID, owner ID or access decision is accepted from the browser. The service-role client still bypasses RLS, so these explicit server checks are required. No RLS policy or database schema change is part of this task.
## 11. Secrets and payment configuration boundaries — 8 November 2026

This refresh uses current GitHub `main` at `ca01edaafa42b5b859089ce18d5decaf6fbd4db3`, read-only Vercel environment metadata with decryption disabled, and read-only production Supabase schema/policy metadata.

### Repository and application key separation

- Current `main` has no tracked root `.env`; the contents lookup returned NOT_FOUND. `.gitignore` ignores `.env` and `.env.*` while explicitly allowing `.env.example`.
- All seven assignments in `.env.example` are blank. The browser Supabase client uses only the Supabase URL and publishable key; it does not reference the service-role key or migration URL.
- The server-only Supabase client reads `SUPABASE_SERVICE_ROLE_KEY` from `process.env`, disables session persistence, and documents that it bypasses RLS. It is not a browser client and must remain confined to trusted server handlers.
- The CI workflow supplies a non-secret placeholder for the service-role variable. No production key is copied into CI configuration or the tracked environment template.
- The supplier register has no verified supplier identities or credentials and explicitly prohibits storing passwords, API keys, bank credentials, access tokens or customer secrets.

### Vercel environment metadata — owner action required

- Vercel project `mtdgc` is linked to `eboxont-code/mtdgc`. Environment-variable metadata was read with decryption disabled; no environment values were requested or printed.
- The returned variable names include `SUPABASE_SERVICE_ROLE_KEY` as a sensitive secret for both Production and Preview. Separate entries exist, but because neither value was decrypted this audit cannot determine whether the values are identical or independently scoped.
- Supabase URL, project ID and publishable-key configuration entries exist for Production and Preview. `VITE_SENTRY_DSN` is marked plain/public. No eSewa, Khalti, Stripe, PayPal or supplier API credential variable name was present in the returned metadata; no migration URL variable was present.
- **Owner-only blocker:** until the owner verifies that Preview uses a separate non-production Supabase project and service-role credential, treat Preview code as potentially able to access production Supabase with service-role privileges. Resolve only with owner-approved isolation evidence or an explicit owner-approved environment change. Do not decrypt, rotate, remove or edit any Vercel variable during this audit.

### Payment configuration and storage

- The production `public.payment_settings` schema contains only `id`, QR path, bank name, account name/number, customer instructions, Fonepay enabled flag and audit timestamps/user. No gateway API key, merchant secret, password or supplier credential column exists.
- A read-only count found zero payment-settings rows. No bank account, instruction, QR, customer, order or payment-proof values were read.
- Public `getPaymentSettings` selects only QR path, bank name, account name/number, instructions and Fonepay flag, then returns a 3,600-second signed QR URL. These are intended customer-facing payment instructions, not merchant API credentials.
- `getAdminPaymentSettings`, `savePaymentSettings` and `uploadPaymentQr` use authenticated middleware and call the administrator guard before database or storage access. The save schema accepts only the customer-facing bank/instruction fields and Fonepay flag.
- Production `payment-qr` and `payment-proofs` buckets are private. QR object operations are administrator-only; proof reads remain limited to the related order owner or an administrator.

### Historical environment-file boundary and scanner limits

- Current main does not contain `.env`. The stale held branches `backend-code-route` and `redesign-matrix` still contain the same historical `.env` blob `122c165e8c74b43be3765b9cb4e35a1a44a5e459` previously reviewed on 7 November. That earlier read-only review found only project identifiers, Supabase URLs and publishable keys, not private credentials. Keep both branches held; neither is safe to merge without a fresh branch-tip review.
- The added `security-config.test.ts` regression guard checks blank environment-template values, ignore rules, browser/server key separation, CI placeholders, high-confidence credential patterns in current text files, public payment field allowlists, administrator guards and the payment-settings type shape.
- The scanner skips generated/dependency directories, binary files and text files over 5 MiB. It does not scan all historical Git objects or external secret stores, and GitHub's private code-search index is unavailable. It reports paths/categories only, never matched values.

### Verification and safety

- Current-main Quality run [42437058568](https://github.com/eboxont-code/mtdgc/actions/runs/42437058568) passed on the base commit. The previous MT-0165 draft's full Quality run [42415852547](https://github.com/eboxont-code/mtdgc/actions/runs/42415852547) passed on its old base `9c745dda3951bc8af616ea09061cb828e16f89d6`, but that branch is 63 commits behind current main and is not current-head verification.
- The current Vercel production deployment remains READY on older commit `3de811c7cfce91eb262cf79523d8053995bfb777`. The Preview service-role risk is not remediated by this audit.
- No environment values were decrypted, printed, copied or changed. No production database/schema, RLS, storage, authentication, credentials, DNS, hosting or billing settings were modified. No supplier/customer contact, purchase or additional spend occurred. Additional spend: $0.


## 12. MT-0165 current environment and payment metadata recheck — 9 November 2026

This recheck used Vercel environment-variable metadata with decryption disabled and read-only Supabase schema/storage metadata. It does not inspect or disclose secret values.

### Vercel Preview and Production scope

- `SUPABASE_URL` and `SUPABASE_PROJECT_ID` each appear as one variable entry targeting both `preview` and `production`; publishable-key entries also target both. These shared entries apply the same configured value to both environments.
- `SUPABASE_SERVICE_ROLE_KEY` appears as two sensitive entries, separately targeted to Production and Preview. Neither value was decrypted, so the audit cannot establish whether they are identical or separately scoped to different projects.
- The current metadata therefore does not demonstrate an isolated Preview Supabase project: Preview and Production share the same URL/project-ID entries. Owner confirmation and, if required, an approved non-production project/configuration are needed before claiming isolation. Do not decrypt or change environment variables as part of this audit.

### Payment settings and storage metadata

- Production `public.payment_settings` has RLS enabled, zero rows and only nine customer-facing/audit columns: `id`, QR path, bank name, account name/number, instructions, Fonepay flag, updated timestamp and updated user. No gateway, merchant or supplier credential columns exist.
- `payment-proofs` and `payment-qr` storage buckets are private, with 5 MiB and 2 MiB limits respectively. Their `allowed_mime_types` metadata is NULL, so application-side file validation remains necessary.
- The payment QR bucket has authenticated administrator insert/read/update/delete policies. The payment-proof bucket has an authenticated related-order-owner/admin read policy. No storage objects, bank details, payment values or customer records were read.
- The supplier identity and product-scope registers remain empty/NOT ASSESSED; the supplier register explicitly prohibits storing passwords, API keys, bank credentials, access tokens or customer secrets.

No environment values, database rows, storage objects, credentials or production settings were changed. Additional spend: $0.

## 9. Administrator server-function authorization contract

- The current `src/lib/admin.functions.ts` exposes 14 administrator server functions. Every export uses `requireSupabaseAuth` middleware and awaits `assertAdmin(context)` as the first handler statement, before any read or mutation.
- `assertAdmin` queries `has_role` for the validated `context.userId` and role `admin`. It delegates the result to `isAdminRoleConfirmed`; the helper permits access only when the RPC has no error and returns the exact boolean `true`.
- The AST regression contract in `src/lib/admin-authorization.test.ts` pins the 14-function inventory, checks authenticated middleware and first-statement authorization, and verifies the guard/helper contract. Existing `admin-access.test.ts` tests exact-true success and false, missing, ambiguous and error-bearing denial cases.
- The administrator page's browser-side role check remains a navigation/presentation gate only. The server middleware and handler guard are the enforcement boundary; database RLS remains a separate defence for direct authenticated-client access.
- Residual finding: production `public.has_role(uuid, app_role)` remains SECURITY DEFINER and executable by `anon` and `authenticated`. Remediation must coordinate function privileges and dependent RLS policies after the approved Supabase cutover. No production function, policy, grant or role was changed.
- Evidence: current-main source audit at commit `de1b11f540bf1933dc78ec2487392a0024a15de2` and read-only Supabase policy/function metadata on 10 November 2026; production deployment `dpl_4njU9xzd9RmCkGuYeQBDTLZV9Nay` is READY on the same commit. Draft PR #31 contains the regression contract; full exact-head quality verification is still required before this task can be marked DONE.

## 9. Guest order tracking access and verification

- The public server function requires a trimmed order number (4–40 characters) and contact (3–120 characters). It uppercases the order number, queries only that exact order, then invokes the shared `hasOrderContactAccess` helper.
- The helper normalises email to lowercase and phone numbers to digits. It accepts the SHA-256 hash of the uppercased order number plus normalised contact, or an exact case-insensitive match to the saved `guest_email`. A phone match is therefore tied to the exact order number and cannot be reused to open a different order.
- Missing orders and mismatched contacts return the same generic `not_found` response. The order number alone is not an authentication credential.
- Read-only production policy/grant inspection on 10 November 2026 confirmed RLS is enabled on `public.orders`. The SELECT policy applies only to authenticated users and requires `auth.uid() = user_id` or administrator role; table grants include no `anon` SELECT privilege. Guest tracking is mediated by the server-only lookup function.
- Read-only production inspection also confirmed `public.order_lookup_attempts` has RLS enabled, no client policies and table grants only for `service_role`; browser roles have no direct access to the lookup-attempt records. The server-side guest lookup uses the service client for its rate-limit counter. This does not resolve the separate fail-open handling of counter-query errors.
- The lookup-attempt counter is a separate abuse-throttling control. Its current count-query fallback can fail open if the database query errors, and insert/cleanup errors are not surfaced. The contact proof still applies, but rate-limit error handling remains a separate hardening task.
- No production order, contact, token, payment or customer values were read for this verification. No production schema, RLS policy or grant was changed.
