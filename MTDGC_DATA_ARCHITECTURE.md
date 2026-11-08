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

### 4.1 Payment-proof image ingestion

- Treat browser MIME and file-name extensions as untrusted hints. The server resolves the actual JPEG, PNG or WebP format with the pinned `sharp@0.35.5` decoder and requires the declared MIME to match.
- Decode with strict warning handling, a 20-megapixel input ceiling and a four-channel ceiling. Empty, malformed, truncated, mismatched, multi-page and over-limit inputs are rejected.
- Apply EXIF orientation and store a lossless WebP re-encoding. Default Sharp output strips source metadata. The normalized output must remain within the existing 5 MiB storage limit.
- The server derives the `.webp` storage extension and `image/webp` content type from the normalized result; the browser cannot choose the stored MIME or extension.
- The production `payment-proofs` bucket remains private and unchanged. Its existing storage-level 5 MiB cap is retained; application-side server validation remains the MIME/content gate because the bucket's `allowed_mime_types` setting is NULL. Only the trusted server upload path writes proof objects.

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



## 7. Catalogue price and checkout snapshot integrity

- The storefront formats selling prices as NPR. A product/variant is purchasable only when both product and variant statuses are `available` or `low_stock`, the variant price is a positive minor-unit integer, both currency fields are `NPR`, and the product is not hidden as a sample/coming-soon listing.
- The catalog card's “From” price and the product page's initial option use the same lowest purchasable variant. A valid explicit SKU selection is preserved. Unavailable variants remain visible with an availability label, but cannot be selected and do not expose a purchasable price. Product structured offers include only purchasable variants.
- The cart stores a display snapshot (product name, variant name and unit price). Current checkout submits that snapshot as an expectation only; it is never used as the order price. The server re-resolves each SKU and its current price from the catalogue. If the snapshot changed, it returns current line values before inserting an order; the client updates the cart and requires a fresh customer submission.
- On success, the server returns the exact line snapshots used for order-item insertion. Checkout's success summary renders those server-resolved values, not the stale browser snapshot.
- Legacy clients may omit the optional expectation fields for backwards compatibility. They still receive server-calculated order prices, but the explicit stale-snapshot refresh/review handshake is provided by the current checkout client.
- The current implementation supports NPR only. Non-NPR product/variant rows fail closed in storefront purchasability and server order creation; no foreign-currency conversion or exchange-rate assumption is made.
- No schema change or migration is required for this control.
