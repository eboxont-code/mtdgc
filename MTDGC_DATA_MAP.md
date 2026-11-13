# MTDGC Personal Data Map

**Audit date:** 10 November 2026  
**Repository baseline:** `main` at `de1b11f540bf1933dc78ec2487392a0024a15de2`  
**Purpose:** Record personal-data fields visible in the application and production schema, their purpose, known processors/recipients, and evidenced access or storage locations.

> This is a technical data-flow inventory, not legal advice or a declaration of privacy-law compliance. Unknown processors, locations, access arrangements and retention periods are deliberately labelled **UNKNOWN**. No customer, order, payment, authentication-user or storage-object values were read for this audit.

## 1. Data-flow overview

1. A customer enters account, checkout, tracking, support or payment-proof information in the browser.
2. The application is hosted by Vercel. The inspected production deployment is READY at `dpl_4njU9xzd9RmCkGuYeQBDTLZV9Nay`, on current `main` commit `de1b11f540bf1933dc78ec2487392a0024a15de2`, in region `iad1` (US East).
3. Application data is sent to the connected Supabase project. Its observed project region is `ap-southeast-1` (Singapore); this is the evidenced region for the project's Postgres database, Auth and Storage services.
4. Google OAuth is offered through the Lovable Cloud Auth wrapper. The precise OAuth claims, provider configuration and processing locations are not available in repository source.
5. Some external contact routes are user-initiated links (WhatsApp). There is no verified supplier API or automated bank/payment gateway integration in the current application source.

**Location distinction:** Vercel's `iad1` is an observed application runtime region, not proof that every Vercel log or backup is stored there. Supabase's Singapore region is the observed project region, not proof of the location of every backup, replica or support access session.

## 2. Customer and account data

| Data and fields | Where captured or stored | Purpose | Known processor / recipient | Evidenced country or region |
|---|---|---|---|---|
| Account email; password credential; sign-up, confirmation, recovery and sign-in timestamps; account ID; optional phone; provider metadata | Sign-in/sign-up/reset forms; Supabase Auth `auth.users` | Create and secure an account, authenticate the customer, confirm email and recover access | Supabase Auth. Google is an OAuth provider through `@lovable.dev/cloud-auth-js` and the Lovable auth wrapper | Supabase: Singapore (`ap-southeast-1`). Google and Lovable: **UNKNOWN** |
| Password credential and authentication tokens | Supabase Auth `encrypted_password`, confirmation/recovery/email-change/reauthentication token columns, `auth.refresh_tokens` and `auth.sessions` | Password verification, account confirmation, recovery and session management | Supabase Auth | Singapore project region. Backup/replica location: **UNKNOWN** |
| Google identity attributes, including provider ID, email and provider-supplied identity metadata | Supabase Auth `auth.identities` (`provider_id`, `provider`, `email`, `identity_data`) and `auth.users.raw_user_meta_data` | Link a Google identity to the MTDGC account | Google OAuth and Lovable Cloud Auth; Supabase Auth stores the resulting identity | Supabase: Singapore. Google/Lovable: **UNKNOWN** |
| Session IP address and user-agent; session and refresh-token identifiers | Supabase Auth `auth.sessions` and `auth.refresh_tokens` | Maintain sessions, security and abuse investigation | Supabase Auth | Singapore. Additional provider log location/retention: **UNKNOWN** |
| Display name, phone number and delivery email | Account profile form; `public.profiles.display_name`, `phone`, `delivery_email` | Account contact details and delivery defaults | Supabase Postgres | Singapore |
| Profile preferences | `public.profiles.preferences` JSONB column exists; no current application write path was found in the inspected account code | Intended preference storage; actual current use was not inspected | Supabase Postgres if populated | Singapore; whether populated is **NOT VERIFIED** |
| Account ID and role | `public.user_roles.user_id`, `role` | Authorise account and staff capabilities | Supabase Postgres/Auth | Singapore |

The browser Supabase client persists authentication sessions. On the production custom domain the storage helper falls back to browser `localStorage`. On recognised Lovable preview hosts inside an editor frame, the helper can broker the session to the Lovable editor using validated `postMessage` origins. That preview-only session transfer is visible in source; the editor's country of access, storage and retention are **UNKNOWN**.

## 3. Checkout and order data

| Data and fields | Where captured or stored | Purpose | Known processor / recipient | Evidenced country or region |
|---|---|---|---|---|
| Customer name, phone, email and optional free-text note | Checkout form and `placeOrder`; `public.orders.customer_details` JSONB, `guest_email`, `guest_phone` and optional `user_id` | Identify the order, contact the customer and associate signed-in orders with an account | Vercel application runtime; Supabase Postgres | Vercel: US East (`iad1`). Supabase: Singapore |
| Product-required customer fields, dynamically defined by product requirements (examples visible in the product flow include player ID, zone/server identifiers and delivery email) | Product detail form; browser `localStorage` key `mtdgc-fields-v1`; submitted as checkout line `fields`; stored in `public.order_items.fields` JSONB | Deliver the selected digital product to the correct account, player or recipient | Browser storage, Vercel application runtime and Supabase Postgres. Any supplier receiving these values through later manual hand-off is **UNKNOWN** | Browser: customer's device. Vercel: US East. Supabase: Singapore. Supplier: **UNKNOWN** |
| Order number, order ID, account ID, order timestamps and order status | `public.orders` and related order records | Order management, tracking, fulfilment and support | Supabase Postgres; Vercel server functions process requests | Supabase: Singapore. Vercel: US East |
| Order access-token hash and verification hash | `public.orders.access_token_hash` and `verification_hash`; raw access token is returned to the customer at order creation | Prove access to the specific guest order without storing the raw token | Vercel server functions and Supabase Postgres | Vercel: US East. Supabase: Singapore |
| Product, variant, quantity, price and currency snapshots | `public.order_items` | Preserve what was ordered and calculate the order | Supabase Postgres | Singapore |
| Staff-entered order event note and staff actor ID | `public.order_status_events.note`, `created_by` | Order history and internal operational context | Supabase Postgres | Singapore. Free text may contain personal data if staff enter it |
| Staff payment-review note and reviewer ID | `public.payment_proofs.review_note`, `reviewed_by` | Record a payment-review decision or request for new proof | Supabase Postgres | Singapore. Free text may contain personal data if staff enter it |

Product requirement values are saved in browser `localStorage` as customers type them. The inspected product page reads those saved values back into matching fields. No expiry or explicit clear-after-order routine was found in that flow. They may remain on the customer's device until browser storage is cleared or the application changes them.

The checkout server also receives an optional bearer session token for signed-in orders. It resolves the account through Supabase Auth; the token is not a customer profile field in the public order table.

## 4. Order tracking and abuse prevention

| Data and fields | Where captured or stored | Purpose | Known processor / recipient | Evidenced country or region |
|---|---|---|---|---|
| Order number plus the email or phone used for the order | Guest tracking form and order-page access request; sent to a Vercel server function | Find the exact order and verify the supplied contact before returning its status | Vercel runtime and Supabase Postgres | Vercel: US East. Supabase: Singapore |
| Signed-in bearer token or order-specific access token | Browser session/order page request; server validates the token and order relationship | Preserve authenticated-owner or order-specific access | Vercel runtime and Supabase Auth/Postgres | Vercel: US East. Supabase: Singapore |
| Request IP-derived hash and timestamp | Tracking function reads the request IP header, hashes it and stores only the hash in `public.order_lookup_attempts.ip_hash` with `created_at` | Rate-limit repeated order lookups | Vercel request handling and Supabase Postgres | Vercel: US East. Supabase: Singapore |
| Authenticated session IP and user-agent | Supabase Auth `auth.sessions.ip` and `user_agent` | Session security and abuse investigation | Supabase Auth | Singapore project region |

The tracking-attempt table stores a hash rather than the raw IP. The function attempts to delete entries older than 24 hours during a later lookup; this is not evidence of a scheduled cleanup job or a guaranteed 24-hour deletion deadline. The proxy that supplies the IP headers and its own raw-IP log retention are **UNKNOWN**.

## 5. Payment proof and payment instructions

| Data and fields | Where captured or stored | Purpose | Known processor / recipient | Evidenced country or region |
|---|---|---|---|---|
| Customer-entered transaction reference | Payment-proof form; `public.payment_proofs.transaction_ref` | Help staff identify the manual transfer being reviewed | Vercel runtime and Supabase Postgres | Vercel: US East. Supabase: Singapore. Bank/payment network: **UNKNOWN** |
| Payment screenshot image | Payment-proof form; private Supabase Storage bucket `payment-proofs`; related `storage_path` in `public.payment_proofs` | Provide supporting evidence for manual payment review | Vercel runtime and Supabase Storage | Vercel: US East. Supabase: Singapore |
| Order link, amount, proof status, resubmission flag, creation/review timestamps, reviewer ID and review note | `public.payment_proofs` | Associate proof with the correct order and record staff review | Supabase Postgres | Singapore |
| MTDGC bank name, account name, account number, payment instructions and QR-image path | `public.payment_settings` and private `payment-qr` Storage bucket | Display the merchant's manual payment instructions to customers | Supabase Postgres/Storage; selected customer-facing fields are returned by the public payment-settings function | Singapore. These are merchant/recipient details, not customer-submitted payment data |

The screenshot processor fully decodes accepted JPEG/PNG/WebP uploads, checks the detected format against the declared MIME, rejects empty/damaged/mismatched/animated files and images above 20 megapixels, and stores a metadata-free lossless WebP re-encoding. The upload limit is 5 MiB. The source image's actual content was not read during this audit. Depending on what the customer includes, a screenshot may reveal a payer name, account details, transaction reference, amount or transaction time.

Both observed storage buckets, `payment-proofs` and `payment-qr`, are private. The current bucket limits are 5 MiB and 2 MiB respectively; neither has a Storage-level MIME allowlist. Production policies restrict payment-proof object reads to the related authenticated order owner or an administrator; payment QR object operations are administrator-only, while the customer-facing function returns a time-limited signed QR URL. The administrator proof-review function creates a 300-second signed proof URL.

The current application describes manual QR/bank payment and staff verification. No active payment-gateway API or automated bank-settlement integration was found in the inspected source. The actual bank, payment network, settlement processor and their countries are **UNKNOWN**.

## 6. Support, reviews and saved products

| Data and fields | Where captured or stored | Purpose | Known processor / recipient | Evidenced country or region |
|---|---|---|---|---|
| Support issue type, order number, free-text description and account ID | Signed-in support form; `public.support_tickets.user_id`, `order_number`, `issue_type`, `description`, `status` | Respond to order, payment, delivery and refund questions | Vercel runtime and Supabase Postgres | Vercel: US East. Supabase: Singapore |
| Support draft issue type, order number and description | Browser `sessionStorage` key `mtdgc-support-draft` while the visitor is redirected to sign in | Temporarily preserve a draft before sign-in | Customer's browser only, before submission | Customer's device; no server transfer until signed-in submission |
| Support screenshot path | `public.support_tickets.screenshot_path` column exists | Schema allows a screenshot reference | No current support-form upload or write path was found | Actual use and location: **NOT VERIFIED** |
| WhatsApp support message, sometimes prefilled with an order number | User-initiated external WhatsApp link from support/order pages | Let the customer contact support outside the site | WhatsApp/Meta after the customer chooses to open/send the message | Provider processing country and retention: **UNKNOWN** |
| Review rating, review text and account/product IDs | `public.reviews` schema; administrator panel reads pending review text | Product feedback and moderation | Supabase Postgres | Singapore. A current customer-facing review submission writer was not found in the inspected source |
| Saved product IDs and account ID | `public.wishlist_items` | Customer wishlist | Supabase Postgres | Singapore |

The support form does not currently upload a screenshot; the screenshot path is only a schema field in the evidence reviewed. Support and order notes are free text and may contain extra personal information that a customer or staff member chooses to type. The interface warns customers not to send passwords, one-time codes or payment PINs.

## 7. Analytics, diagnostics and other runtime processing

| Component | Evidence and data potentially handled | Purpose | Processor / location |
|---|---|---|---|
| Application analytics | No analytics event call site was found in the inspected current-main source. The `track` member in the Lovable event type is only a type declaration in the inspected file | No active product-analytics collection is confirmed by this source audit | Active analytics provider and country: **NOT IDENTIFIED** |
| Lovable error hooks | The React error reporter can call injected `window.__lovableEvents.captureException` with the error, route path and context. It also calls `window.__lovableReportRuntimeError`, documented in source as present only in the editor preview | Error diagnosis | Runtime event destination, data fields beyond the call context, country and retention: **UNKNOWN** |
| Sentry configuration | Vercel environment metadata contains a public `VITE_SENTRY_DSN` entry for Production and Preview whose host indicates the US Sentry ingest service. The inspected current-main source has the Sentry package dependency but no `Sentry.init` or direct Sentry capture call | Potential error reporting configuration; active collection is **NOT VERIFIED** | If used, the configured ingest endpoint is in the United States. Actual runtime use and payload are **UNKNOWN** |
| Hosting/request processing | Application requests and server-function payloads pass through Vercel; observed production deployment region is `iad1` | Host the website and run server-side handlers | Vercel runtime: US East. Vercel request-log contents, storage location, staff access and retention: **UNKNOWN** |

No advertising pixel or active product analytics provider was identified in the inspected application source. This does not rule out provider-side infrastructure logs or scripts injected outside the repository.

## 8. Suppliers, delivery email and manual payment recipients

- The supplier register contains no verified supplier identity or product-scope record. No supplier API integration was found in the inspected current-main source.
- Product-required values may be needed by a supplier to fulfil an order, but the actual supplier, exact fields transferred, transfer channel, access country and retention are **UNKNOWN**. The privacy policy says details are shared with a supplier only when needed; the current register does not identify that supplier.
- The application stores delivery email addresses, but no order-delivery email sender or transactional email integration was found in the inspected source. Do not treat the presence of a delivery email field as proof that an email is sent.
- Supabase Auth sends account confirmation and password-recovery email flows. The configured SMTP/email delivery provider and its processing country were not available in repository source or the metadata inspected.
- Manual QR/bank transfer is shown to customers. The bank/payment network and its location are **UNKNOWN**. No gateway credential or automated settlement integration was identified in the inspected application source.
- WhatsApp links are customer-initiated. No automated WhatsApp API integration or webhook was found.

## 9. Verified access and storage boundaries

- The observed Supabase project region is Singapore (`ap-southeast-1`); the inspected production Vercel deployment runs in US East (`iad1`).
- The production `payment-proofs` and `payment-qr` buckets are private.
- Production RLS metadata shows owner/admin-scoped access for profiles, orders, order items, support tickets, payment proofs, wishlist items, reviews and user-role records. No anonymous direct SELECT policy was observed for orders or payment proofs.
- The server-only Supabase client uses the service-role key and bypasses RLS. It is used by trusted server handlers; its key must never enter browser code.
- Vercel environment metadata shows separate sensitive `SUPABASE_SERVICE_ROLE_KEY` entries for Production and Preview. The same `SUPABASE_URL`, `SUPABASE_PROJECT_ID`, publishable-key and browser-prefixed Supabase URL/project-ID entries are scoped to both Preview and Production. No values were decrypted, so the actual endpoint identity was not confirmed. Until the owner verifies that Preview uses a separate non-production project and credential, Preview must be treated as potentially production-connected. This remains the MT-0165 owner-only blocker; this audit did not change or decrypt any variable.
- No customer, order, payment, auth-user or storage-object values were read. Schema, policy, bucket and project-location metadata only were inspected.

## 10. Retention and unresolved evidence

No complete retention schedule or automated account-deletion workflow was found in the inspected source/schema. The privacy page says customers can request account-data deletion through support, but the actual deletion process and exceptions were not evidenced here.

The following remain **UNKNOWN / OWNER OR PROVIDER EVIDENCE REQUIRED**:

1. Actual supplier identities, product-specific data recipients, manual hand-off channel, access countries and supplier retention.
2. Supabase Auth SMTP/email provider, sub-processors, region and message-retention details.
3. Google OAuth/Lovable Cloud Auth data fields, processing locations and retention.
4. WhatsApp/Meta account recipient, data-transfer locations and retention.
5. Whether Sentry is initialised outside the inspected source, what payload is sent and what retention applies; the public DSN environment entry alone does not prove active collection.
6. Lovable preview/editor telemetry destination, fields, region and retention.
7. Vercel request/log retention, backup location and support-access countries.
8. Supabase backup/replica locations and provider support-access countries.
9. A business-approved retention/deletion schedule for orders, payment proof, support, account and operational notes.

These gaps belong to the relevant supplier, privacy, retention, security and cutover decisions. This map does not invent answers or authorise a new data-sharing practice. MT-0293 remains the separate retention task; MT-0165 retains the Preview isolation blocker.

## 11. Source and verification references

Repository sources inspected on current `main` include:

- [Account registration and recovery](./src/routes/auth.tsx)
- [Lovable OAuth wrapper](./src/integrations/lovable/index.ts)
- [Browser Supabase client and session persistence](./src/integrations/supabase/client.ts)
- [Lovable preview session broker](./src/integrations/supabase/previewAuthStorage.ts)
- [Account profile, order and support reads](./src/routes/_authenticated/account.tsx)
- [Product-required fields and browser persistence](./src/routes/products.$slug.tsx)
- [Checkout, order creation, guest tracking and payment-proof submission](./src/lib/orders.functions.ts)
- [Tracking page](./src/routes/track-order.tsx)
- [Order page and WhatsApp support link](./src/routes/order.$orderNumber.tsx)
- [Payment-proof form](./src/components/payment-proof-form.tsx)
- [Payment screenshot normalization](./src/lib/payment-proof-image.ts)
- [Support form and draft storage](./src/routes/support.tsx)
- [Administrator payment-proof and payment-settings operations](./src/lib/admin.functions.ts)
- [Administrator role confirmation](./src/lib/admin-access.ts)
- [Supabase authentication middleware](./src/integrations/supabase/auth-middleware.ts)
- [Lovable error-reporting hooks](./src/lib/lovable-error-reporting.ts)
- [In-memory server error capture](./src/lib/error-capture.ts)
- [Privacy policy](./src/routes/policies/privacy.tsx)
- [Supplier due-diligence register](./SUPPLIER_REGISTER.md)
- [Data architecture](./MTDGC_DATA_ARCHITECTURE.md)

Read-only production evidence refreshed on 10 November 2026:

- Supabase project metadata: project region `ap-southeast-1`, status ACTIVE_HEALTHY.
- Supabase `information_schema`: public and auth table column names/types only; no row values.
- Supabase `pg_policies`: policy definitions only.
- Supabase Storage metadata: both observed MTDGC buckets are private; no objects were listed or opened.
- Vercel production deployment metadata: READY at [`dpl_4njU9xzd9RmCkGuYeQBDTLZV9Nay`](https://vercel.com/boxont/mtdgc/4njU9xzd9RmCkGuYeQBDTLZV9Nay), commit `de1b11f540bf1933dc78ec2487392a0024a15de2`, region `iad1`; environment variable names/targets inspected with decryption disabled.
- GitHub current main: `de1b11f540bf1933dc78ec2487392a0024a15de2`; current production is deployed from the same commit.

**Safety:** No production records, files, secrets or environment values were read or changed. No database migration, schema, RLS, storage, authentication, hosting, DNS or billing setting was changed. No supplier/customer was contacted. No purchase or test order was made. Additional spend: **$0**.

## 12. Current production schema and access metadata — 10 November 2026

This refresh used metadata-only queries. No row values were selected from customer, order, payment, authentication or Storage-object tables.

### Personal-data columns confirmed

- `public.profiles`: `display_name`, `phone`, `delivery_email`, `preferences`, account ID and timestamps.
- `public.orders`: `user_id`, `guest_email`, `guest_phone`, `customer_details` JSONB, `verification_hash`, `access_token_hash`, status, totals and timestamps. The checkout source writes name, phone, email and an optional free-text note into `customer_details`.
- `public.order_items`: `fields` JSONB stores product-required identifiers or delivery details alongside product/variant snapshots.
- `public.payment_proofs`: order ID, storage path, transaction reference, amount, status, resubmission flag, review note, reviewer ID and review timestamps.
- `public.support_tickets`: optional account ID, order number, issue type, free-text description, optional screenshot path and status. The inspected support form writes the description but no current screenshot upload path was found.
- `public.order_status_events`: free-text note and staff actor ID. `public.order_lookup_attempts`: IP-derived hash and timestamp only.
- `public.reviews`: account/product IDs, rating, free-text body and moderation flags. `public.wishlist_items`: account/product IDs. `public.user_roles`: account ID and role.
- `public.payment_settings`: merchant bank name, account name/number, instructions and QR-image path; these are merchant/recipient details, not customer-submitted payment data.
- Supabase Auth metadata includes email, phone, encrypted password, confirmation/recovery/email-change token columns, provider metadata, identity data, session IP/user-agent and refresh-token fields. Only column names/types were inspected; no auth-user, identity, session or token values were read.

### Current access-policy observations

- `public.payment_proofs` has RLS enabled, no anonymous SELECT privilege, and an authenticated SELECT grant subject to the owner-or-admin policy joining the proof to its order.
- `storage.objects` has RLS enabled; its role-level SELECT grant includes anon, but there is no anonymous policy for the private payment buckets. The payment-proof SELECT policy is authenticated-only and requires either the matching order owner or an administrator. The payment-QR policies allow authenticated administrators to read/insert/update/delete objects.
- `public.order_lookup_attempts` has RLS enabled and no client policies; the application accesses it through the server-only service-role client.
- The public `has_role` function is SECURITY DEFINER and executable by anon and authenticated roles. Supabase's security advisor flags this. It can disclose role-membership results and should be handled under the separate coordinated migration/security task; no function or grant was changed here.

### Current Storage and upload observations

- `payment-proofs`: private, 5 MiB bucket limit, `allowed_mime_types` is NULL.
- `payment-qr`: private, 2 MiB bucket limit, `allowed_mime_types` is NULL.
- Payment-proof uploads are decoded and normalized server-side with Sharp to metadata-free WebP, with a 5 MiB and 20-megapixel limit. The absence of a Storage MIME allowlist means the application-side validator remains an important control. The administrator QR upload path is a separate flow and was not changed or tested in this data-map task.

### Current provider and location evidence

- Supabase project: ACTIVE_HEALTHY, `ap-southeast-1` (Singapore), Postgres 17.11.0.003.
- Vercel production: READY, `iad1` (US East), deployment `dpl_4njU9xzd9RmCkGuYeQBDTLZV9Nay`, deployed commit `de1b11f540bf1933dc78ec2487392a0024a15de2`.
- `VITE_SENTRY_DSN` is configured for Preview and Production, but no `Sentry.init` or direct Sentry capture call was found in the inspected source. Active Sentry collection is not confirmed.
- The optional Lovable error hooks can receive an error object, route/context, message, stack and filename. The downstream processor, access location and retention remain UNKNOWN.
- No active product analytics event call, transactional email sender, supplier API, automated WhatsApp API or bank-settlement gateway was found in the inspected application source. This does not rule out provider-side infrastructure logs or processing outside the repository.

**Scope and safety:** This is a technical data-flow inventory, not legal advice or a compliance declaration. No customer/order/payment/auth-user values or Storage objects were read; no environment values were decrypted; no production schema, RLS, bucket, secret, hosting or billing setting was changed.
