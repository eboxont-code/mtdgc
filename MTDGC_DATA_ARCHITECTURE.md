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


### 4.2 Order-time pre-fulfilment snapshot

- New order items store a versioned `__mtdgc_snapshot` object inside the existing `order_items.fields` JSONB. The snapshot contains the product's server-read `region` and exact `requirements` labels at order creation.
- Customer-provided values remain top-level string fields. The server resolves the selected SKU's product and reads region/requirements from that product row; the browser cannot supply or overwrite the reserved snapshot key.
- `order_items.variant_name` already records the selected option/denomination, so no additional denomination column or migration is required.
- The admin order detail panel builds a per-item checklist from the saved snapshot: selected option, order-time product region, each required field and recorded/missing state. Other saved customer fields remain visible.
- The checklist never joins the current product record to reconstruct historical requirements or region. Items without a valid snapshot are explicitly marked as not captured/unrecognised; missing historical requirements are not guessed.
- The checklist is shown only in the administrator order-detail view. Existing order-item RLS remains unchanged; the snapshot contains product metadata and requirement labels, not new credentials or payment secrets. The public guest order-summary function does not select or return the `fields` JSONB.
- This is a data snapshot and review aid, not a supplier runbook or proof of fulfilment readiness. Supplier-specific instructions remain blocked until independently verified evidence exists.

### 4.3 Final checkout confirmation for current top-up and emailed-code categories

- The current production catalogue identifies `game-top-ups` and `gift-cards` as the only currently orderable categories requiring this additional review. The current read-only snapshot found four orderable game top-up products and one orderable Roblox gift card; software/subscription listings were not treated as active code-release products.
- `src/lib/order-confirmation.ts` centralises the category policy. Older cart lines with delivery fields but no saved category are conservatively prompted for confirmation.
- Before order creation, checkout shows the exact cart product, selected option/face value, quantity, listed region and saved delivery-field values in an explicit confirmation dialog. Desktop and mobile order actions share the same path.
- The server resolves each selected SKU's product category from the database relation and requires the `detailsConfirmed` acknowledgement for `game-top-ups` and `gift-cards`. The client-supplied category label is not trusted for the server decision.
- The acknowledgement is an accuracy safeguard, not authentication or cryptographic proof of human review; a deliberate direct API caller can set the boolean. It does not verify payment settlement, supplier authority, fulfilment or delivery.
- No supplier-specific reversibility claim is made: the product schema has no supplier irreversibility field and the Supplier Register has no verified product-scope records. No schema migration or production write is needed for this UI/server-input check.

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

