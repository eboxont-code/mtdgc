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


## 8. Payment-proof access boundaries

- Direct reads of `public.payment_proofs` are available only to authenticated users whose `auth.uid()` matches the `user_id` of the related order, or to administrators. RLS is enabled; authenticated clients receive SELECT only for this table, while service-role writes remain server-side.
- Direct reads from `storage.objects` for the private `payment-proofs` bucket are limited to authenticated related-order owners or administrators. The object path's first folder segment is the server-resolved order ID. No anonymous policy is present for this bucket.
- The administrator payment-review queue and signed proof-URL function require a validated Supabase session and an exact successful administrator-role result before any proof lookup or signed URL creation. Signed URLs expire after 300 seconds.
- `has_role` remains a SECURITY DEFINER function that Supabase's advisor reports as executable by anon/authenticated. Treat its role-membership disclosure as a separate issue; change function execution and dependent policies only through the approved coordinated Supabase migration gate.
- Guest order access is mediated by server-side order access checks and is not a direct proof-row/object RLS grant. Cross-customer order lookup/contact-fallback isolation remains tracked separately under MT-0162.
