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

### 4.4 Customer credential collection boundary

- Product requirement labels are normalised before validation and rejected when they request passwords, passcodes/passkeys, OTP/2FA/MFA or authenticator codes, PINs, recovery/backup/seed secrets, account login/access credentials, session/access/refresh tokens, API/private/client secrets, security answers, remote access or payment-card credentials.
- The administrator product form and `saveProduct` server validator use the same policy. The product page suppresses every customer field and disables ordering if a saved requirement is unsafe; it does not display or autofill the unsafe label.
- `placeOrder` re-reads the selected product requirements from the server-resolved SKU and rejects malformed or unsafe requirement lists before creating an order. It also rejects unsafe client-supplied field keys, including stale carts.
- Product detail, checkout order-note and support free-text areas display a clear warning. Free-text descriptions are not automatically scanned or rejected, to avoid blocking legitimate troubleshooting; customers may still voluntarily type sensitive information despite the warning.
- A read-only production catalogue audit on 8 November 2026 found 36 published products and zero requirement labels matching the expanded credential policy. No customer/order values were queried. The Supplier Register contains no verified suppliers, so no supplier-side credential practice is claimed to have been screened.
- No schema migration is required. This application safeguard does not replace supplier due diligence or a response process for accidentally submitted secrets.

### 4.5 Region compatibility review before order creation

- game-top-ups and gift-cards use the server-resolved product region as a catalogue label that must be reviewed before payment. The value is not independent issuer/supplier evidence. In particular, Global is not treated as proof that redemption works in every country or account region.
- Product detail shows the warning alongside purchase actions and requires the customer to review the issuer's current redemption rules before adding an orderable code/top-up to the cart. Missing region metadata disables ordering.
- Checkout repeats the warning for every applicable cart line and requires an explicit acknowledgement before placeOrder can create the order.
- The server resolves category and region through the selected SKU. The cart's saved region is used only to detect a stale cart; it is compared with the current server value and never trusted as the product source of truth. Missing or changed region metadata is rejected before order creation.
- The acknowledgement is an accuracy control, not proof of issuer verification or a guarantee of compatibility. No supplier-specific region claim is made while the Supplier Register is empty. No schema migration is required.

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

