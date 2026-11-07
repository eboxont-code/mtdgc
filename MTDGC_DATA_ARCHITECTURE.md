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



## 7. Secret and payment configuration boundaries

- Keep .env and all .env.* files ignored; .env.example is the only tracked environment template and must contain blank values only.
- Browser code may use Supabase URLs and publishable keys only. The service-role key and migration connection string are server/developer-only; they must never receive a VITE_ prefix or enter a browser bundle.
- src/integrations/supabase/client.server.ts is the server-only service-role client. Import it dynamically inside trusted server handlers and authorize each operation before using its RLS-bypassing client.
- Customer-visible payment instructions are not gateway credentials. The public payment-settings response must keep an explicit allowlist of bank/QR/instruction fields; never add merchant API secrets, passwords, tokens or supplier credentials to payment_settings or its public response.
- Payment-setting mutations and QR storage operations require authenticated administrator authorization. The production payment-qr and payment-proofs buckets are private; QR writes are admin-only and proof reads are owner/admin-controlled.
- Vercel environment metadata currently shows a sensitive SUPABASE_SERVICE_ROLE_KEY for both Production and Preview. Until separate Preview credentials/project are owner-verified, treat Preview as potentially privileged against production data. This is a release/configuration blocker; do not change environment values without owner approval.
- The MT-0165 regression test checks environment-template hygiene, server/client key separation, known high-confidence credential patterns in current text files, public payment field allowlists and administrator guards. It does not replace full Git-history scanning or secret-manager controls.
