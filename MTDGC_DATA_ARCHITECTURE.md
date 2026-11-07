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
