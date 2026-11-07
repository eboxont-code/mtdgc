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



## 7. Payment-proof access boundary — verified 7 November 2026

Production verification for MT-0085 confirmed the following read paths:

| Resource | Authenticated order owner | Administrator | Guest order holder | Anonymous |
|---|---|---|---|---|
| public.payment_proofs rows | SELECT only for proofs linked to the user's own orders | SELECT | No direct row read | No table grant/policy |
| payment-proofs storage objects | SELECT only when the first storage folder segment identifies an order owned by the user | SELECT | No direct object read | No matching policy |
| Signed proof URL | Not exposed by customer routes | Admin-only server action; 300-second expiry | Not exposed | Not exposed |

The payment-proofs bucket is private and limited to 5 MiB. RLS is enabled on both public.payment_proofs and storage.objects. The payment-proof storage bucket has a single SELECT policy scoped to authenticated owners or administrators; no payment-proof INSERT, UPDATE or DELETE policy exists for client roles. The server uses the service role for the application-controlled upload path.

Guest order access-token/contact checks authorize guest order viewing and proof submission, but do not grant direct proof-row or proof-object reads. Keep that distinction explicit. Do not create guest signed URLs without a separate order-token/contact validation design and short-lived URL issuance.

The Supabase security advisor separately warns that public.has_role is SECURITY DEFINER and executable by anon/authenticated. Existing RLS policies depend on it, so any correction must coordinate the function and dependent policies in an approved migration after the Supabase cutover. The storage-level allowed_mime_types setting is currently NULL; complete image-content validation remains MT-0084 and is not implied by this access-control verification.
