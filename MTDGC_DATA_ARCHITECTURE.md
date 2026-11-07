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



## 7. Payment-proof access boundaries (verified 7 November 2026)

- Customer proof submission resolves the order from its order number on the server and authorises it with the order-scoped access token, authenticated account-owner match or rate-limited contact fallback. The storage path, `payment_proofs.order_id` and amount are derived from the resolved order.
- Direct proof-row reads are restricted by RLS to the authenticated owner of the related order or an administrator. Authenticated table grants are SELECT-only; service-role operations remain server-side.
- The `payment-proofs` storage bucket is private. Its SELECT policy is limited to the authenticated related-order owner (order ID in the first path segment) or an administrator. No anonymous proof-object policy exists.
- Administrator proof retrieval is behind `requireSupabaseAuth` and an exact successful admin-role check. The signed URL lifetime is 300 seconds. Admin role RPC errors and ambiguous values fail closed.
- Migration-contract tests cover the row policy, object policy, grants and private bucket. Live production policies and bucket metadata were inspected read-only; no policy or storage setting was changed.
- The bucket still has no storage-level MIME allowlist and application upload validation checks only MIME/signature bytes, not full image decoding. Keep MT-0084 open until a maintained server-side decoder and malformed/truncated-image tests are available.
