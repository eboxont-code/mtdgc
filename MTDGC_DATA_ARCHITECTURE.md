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

### Order Status Flow
1. `PENDING`: Order created, awaiting payment.
2. `PAID`: Payment verified.
3. `PROCESSING`: Admin/System fulfilling the digital delivery.
4. `COMPLETED`: Item delivered to customer.
5. `CANCELLED`: Terminated before fulfillment.
6. `REFUNDED`: Payment returned to customer.

### Payment Status Flow
1. `PENDING`: Payment initiated.
2. `SUCCESS`: Verified by provider/admin.
3. `FAILED`: Declined or timed out.

## 5. Guest Checkout Architecture
- **No Account Required**: Orders are created with `user_id = NULL`.
- **Identity**: `guest_email` and `guest_whatsapp` are captured.
- **Security**: A unique `guest_access_token` (UUID) is generated for each order.
- **Tracking**: Users can view order status via a URL containing the `order_id` and `guest_access_token`.

## 6. Launch Strategy (Separation)

### Phase 1: MVP (Manual)
- **Payment**: Users select "Manual Transfer" (eSewa/Khalti) and provide a transaction ID/Screenshot.
- **Fulfillment**: Admins manually update status and send codes via WhatsApp/Email.
- **Architecture**: All tables present, but `payments.provider` is 'manual'.

### Phase 2: Automated
- **Payment**: Integration with eSewa/Khalti SDKs/Webhooks.
- **Fulfillment**: Automated delivery for products with pre-loaded digital codes.



## 7. Current authentication and authorisation boundaries — 7 November 2026

This section describes current GitHub main and the read-only production database inspection. It is not a claim that every current-main change is live in production.

- The authenticated route calls Supabase getUser and redirects signed-out visitors. Data access remains protected by server-function authentication and database RLS; the route/UI gate alone is not an authorization boundary.
- Global server-function middleware attaches the browser's Supabase access token. The server-side requireSupabaseAuth middleware validates the Bearer token with Supabase getClaims and places the subject ID and a user-scoped Supabase client in handler context.
- Every inspected admin server function requires authenticated context and independently checks the admin role through has_role. Direct admin-page reads use the authenticated client and rely on RLS.
- Customer profile, order, support-ticket and wishlist access is scoped by RLS to auth.uid(); support-ticket insertion must use the signed-in user's ID. Payment-proof rows and private payment-proof objects are readable only by the related order owner or an administrator. Payment QR objects are admin-only.
- Guest order access is deliberately separate from account authentication: the server resolves the order and checks its hashed order-specific access token, a verified account-owner bearer token, or saved order/contact verification. Authenticated order history uses a user-scoped server function and explicit user_id filter.
- The service-role key is isolated in the server-only client module and bypasses RLS; it must remain dynamically imported only inside trusted server handlers. Never import it into route components or browser code.
- Current production storage buckets payment-proofs and payment-qr are private. The payment-proofs read policy permits the order owner and admins; payment-qr object operations are admin-only.
- Supabase's current security advisor warns that public.has_role is SECURITY DEFINER and executable by anon and authenticated. It accepts an arbitrary user ID, so it can reveal whether a supplied UUID has a role. No role-write privilege is granted to client roles, and no privilege escalation was demonstrated. Any change must coordinate the function and policies that call it and must be applied only after the approved Supabase cutover/migration gate.
- order_lookup_attempts has RLS enabled but no policies; only service_role has table privileges. This is an intentional server-only access pattern under the observed grants.
- In current main, the order lookup/contact rate-limit paths do not fail closed if the attempt-count query or insert errors. This is a separate abuse-control follow-up and must be covered by focused tests before changing the flow.

Production deployment currently lags current main. Recheck the deployed commit before treating current-main authorization code as active on mtdgc.com.



### 7.1 Read-only verification recheck — 8 November 2026

The 8 November 2026 metadata recheck confirmed the access boundaries above against production project `eaomkkswslqtfunkceuc` (ACTIVE_HEALTHY; PostgreSQL 17.11.0.003):

- All 14 public application tables have RLS enabled. Customer profile, order, order-item, support-ticket, role, wishlist, review and payment-proof policies remain scoped as described in section 7.
- Authenticated has some table-level privileges that are constrained by RLS: `orders` UPDATE and `order_status_events` INSERT/SELECT are available at the grant layer, but their only write-capable policy is administrator-only. `payment_proofs` grants authenticated SELECT only; anon has no proof-row grants. `order_lookup_attempts` has no client policies and only service-role/database-owner grants.
- Both storage buckets are private. `payment-proofs` has a 5 MiB cap; `payment-qr` has a 2 MiB cap. The proof bucket has no storage-level MIME allowlist, so upload validation remains an application responsibility.
- `public.has_role(uuid, app_role)` remains SECURITY DEFINER and executable by anon/authenticated. The security advisor reports WARN for both roles. Because several RLS policies call it, remediation requires a coordinated function/policy migration after the approved Supabase cutover; no live change was made.
- Current main's admin server functions all require authenticated middleware and call the admin role guard. The admin page's browser-side role check is only a UI gate; server handlers and RLS remain the enforcement boundaries. PR #2 separately tightens the guard to accept only an exact boolean `true` and includes regression tests; it is still an unmerged draft.
- GitHub main remains at `9c745dda3951bc8af616ea09061cb828e16f89d6`; its Quality run [42323805501](https://github.com/eboxont-code/mtdgc/actions/runs/42323805501) passed. Production remains on READY Vercel deployment [`dpl_4nELrLJ21wEGvAAtVbs2g6UPsNhC`](https://vercel.com/boxont/mtdgc/4nELrLJ21wEGvAAtVbs2g6UPsNhC) from older commit `779d2da9f42fd55acb66e1015b7c1ecfe29ee1d7`; main's Vercel status is blocked by the free deployment-rate limit.
- This is metadata/source verification only. No customer or payment records, auth-user records, storage objects, secrets or service-role values were read; no database, storage, auth, deployment or billing writes were performed.

## 8. Cross-customer order isolation — 8 November 2026

Account-owned and guest orders use distinct access paths:

- Account orders: authenticated server functions validate the Supabase bearer token and compare its subject to `orders.user_id`; authenticated order history also filters by the validated context user ID. Production RLS applies the same owner predicate to `orders` and related `order_items`.
- Guest orders: the server resolves an order by its unique order number and requires either the order-specific access-token hash or the saved contact verification. The contact fallback is not available for an order with a non-null `user_id`.
- The public tracking function accepts an optional bearer for account orders. It validates that token with Supabase Auth and allows the order only when the authenticated subject equals the stored owner. Guest tracking continues to require the saved email/phone.
- Payment-proof submission uses the same guest-only contact helper; account-owned orders require the order token or authenticated owner. Proof row ID, amount and storage path continue to come from the server-resolved order.
- The service-role client bypasses RLS, so these server-side checks are mandatory. It remains server-only and dynamically imported inside handlers.

Production metadata rechecked read-only: RLS is enabled on `orders`, `order_items` and `order_status_events`; owner SELECT on orders is bound to `auth.uid() = user_id`; order-item SELECT is bound to the related order owner or admin; status events are administrator-only. No customer/order/payment data was queried and no production write or migration was performed.

Synthetic tests cover order-scoped tokens, account owner versus another user, order-number/contact matching, denial of contact fallback for account-owned orders, and server-derived payment-proof association. GitHub Actions Quality run [42405248193](https://github.com/eboxont-code/mtdgc/actions/runs/42405248193) passed lint, full Bun tests, TypeScript and production build on the application commit.

Known separate limitations: the guest lookup rate limiter's database errors are not consistently fail-closed; the `has_role` SECURITY DEFINER warning remains gated on the approved Supabase cutover. No delivered-code storage exists yet; MT-0163 remains blocked pending an approved private storage design and cutover.

