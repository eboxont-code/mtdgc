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

## 7. Guest Order Tracking Access

### Public tracking route

- The public /track-order form requires both the order number and the email address or phone number used when the order was placed. The browser checks both fields, and the lookupOrder server input schema independently requires an order number of 4–40 characters and contact of 3–120 characters.
- The server normalises the order number to uppercase and resolves the order by that exact order_number. It then calls the shared hasOrderContactAccess helper before returning any order summary.
- The helper normalises email to lowercase and phone numbers to digits, then checks the order-scoped SHA-256 value created by placeOrder from the order number plus the selected contact. It also accepts an exact case-insensitive match to the saved guest_email.
- The contact check is bound to the resolved order number. A matching phone/email for a different order does not authorise access. Missing, blank or mismatched contact returns the same generic not_found result.
- The server function uses the server-only Supabase client; anonymous browsers do not receive direct SELECT access to public.orders. The live orders RLS policy grants reads to authenticated owners/admins only.

### Other order-view paths

- getOrderForViewer separately tries the order-specific access-token hash, then the authenticated account owner, then the same contact helper after its rate-limit check.
- submitPaymentProof uses the same order-scoped contact helper after its rate-limit check and still requires the resolved order to be pending_payment.
- These paths share the same contact matching logic; the public tracker does not treat the order number by itself as an authentication credential.

### Known rate-limit limitation

- lookupOrder currently reads and inserts order_lookup_attempts but does not check the returned database errors. If the count query fails, the current (count ?? 0) fallback can fail open; insert/cleanup failures are also not surfaced.
- This does not bypass the separate order-number/contact comparison, but it weakens abuse throttling. It is not claimed as fixed by MT-0105 and remains a separate security follow-up.

### Verification boundary

- The live public.orders table has RLS enabled. Its read policy is authenticated-owner/admin only; there is no anonymous SELECT policy.
- No production order, contact, token, payment, schema, storage or authentication data was changed. The live order snapshot was queried only as an aggregate; no personal field values were retrieved.