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

### Current production order-status enum

The live `public.order_status` enum contains these 13 values. The list includes legacy values retained in the database; an enum value existing does not mean the current application creates or uses it in its normal flow.

| Status | Current meaning / observed use | Current writer or note |
|---|---|---|
| `pending` | Legacy initial-payment state. Current checkout creates `pending_payment` instead. | No current writer found in the inspected order/admin server functions. |
| `pending_payment` | Order created and waiting for customer payment/proof. It is also restored when a rejected proof is returned for resubmission. | `placeOrder`; `reviewPayment` when rejection requests a new proof. |
| `payment_submitted` | Customer has uploaded a proof and reference; the order is awaiting manual review. This is **not independent confirmation that funds were received**. | `submitPaymentProof`, conditional on the order still being `pending_payment`. |
| `paid` | Legacy/manual status. It is not written by the dedicated proof-review function and is no longer selectable through the generic admin status editor. | Retained in the enum for legacy compatibility; no current normal-flow writer. |
| `verified` | Admin accepted a submitted proof. Current implementation is manual; no gateway callback or bank-settlement reconciliation is performed. | `reviewPayment` only; generic admin status updates cannot set it. |
| `rejected` | Submitted proof/order was rejected. | `reviewPayment` only; generic admin status updates cannot set it. |
| `processing` | Admin marks fulfilment as in progress after manual proof review has set the order to `verified`. No automated supplier fulfilment is implied. | `updateOrderStatus`, guarded to allow only `verified` → `processing`. |
| `delivered` | Admin marks the order delivered after it has entered `processing`. No separate delivery-evidence check is enforced by the status setter. | `updateOrderStatus`, guarded to allow only `processing` → `delivered`. |
| `failed` | Legacy payment/order failure label. | No current writer found in the inspected order/admin server functions. |
| `cancelled` | Existing terminal enum value; no dedicated cancellation workflow or refund automation is implemented. | Retained for compatibility; no longer selectable through the generic admin status editor. |
| `refunded` | Existing terminal enum value; it does not itself execute or verify a refund. | Retained for compatibility; no longer selectable through the generic admin status editor. |
| `fulfilled` | Legacy delivery alias; customer-facing order page displays it as “Delivered”. | No current writer found in the inspected order/admin server functions. |
| `completed` | Legacy delivery alias; customer-facing order page displays it as “Delivered”. | No current writer found in the inspected order/admin server functions. |

### Implemented order transitions

These are the transitions implemented by the currently inspected application code, not a business-approved state machine:

1. **Order creation:** `placeOrder` creates an order as `pending_payment`.
2. **Proof submission:** `submitPaymentProof` conditionally changes `pending_payment` → `payment_submitted`. The update checks the current status to avoid moving an order that has already left the payment-pending state.
3. **Manual proof review:** `reviewPayment` conditionally changes `payment_submitted` →:
   - `verified` when an admin chooses Verify;
   - `pending_payment` when an admin rejects the proof and requests a replacement;
   - `rejected` when an admin rejects without requesting another proof.
4. **Generic admin fulfilment transitions:** `updateOrderStatus` now permits only `verified` → `processing` and `processing` → `delivered`. It reads the current status, checks the transition with the shared `canAdminTransitionOrder` guard, then performs a conditional update matching the previously read status so a concurrent status change cannot be overwritten. The order list and detail panel show only the valid next action. Generic updates cannot set `paid`, `verified`, `rejected`, `cancelled` or `refunded`; payment decisions remain in `reviewPayment`, while cancellation/refund require a dedicated workflow that is not yet implemented.
5. **Notes/history:** `addOrderNote` inserts an `order_status_events` row with caller-provided text; it does not change `orders.status`. The history table's `status` column is text, so a note/event label is not proof that a valid order transition occurred.

### Separate payment-proof record states

`payment_proofs.status` is constrained to `submitted`, `verified` or `rejected`. A proof can carry `resubmit_requested`; on that rejection path the order returns to `pending_payment`. The current proof amount is copied from the server-resolved order total. It is not an independent record of the amount actually settled into the receiving account.

### Database enforcement and known gap

The live order table has the enum type, primary key, unique order-number constraint and non-negative subtotal/discount/total checks. The read-only production inspection found **no order-status transition trigger or transition-specific constraint**. The enum limits the allowed labels, but it does not restrict which status may follow another. The new server-side guard protects the exposed generic admin application path; privileged service-role/manual SQL writes are not constrained at database level. Database-level transition enforcement remains subject to the documented Supabase cutover/migration gate. The remaining settlement-evidence dependency is tracked under MT-0086.

The current customer-facing label for `payment_submitted` is “Payment received, being checked”; operationally it means only that proof was submitted and awaits review. Do not interpret it as bank settlement confirmation.
 
### 4.1 Canonical customer-facing status presentation

- `src/lib/order-status.ts` is the single source for customer-facing order-status labels, explanatory notices and progress-step membership.
- Account summary, authenticated order history, public guest tracking and the individual order page use `orderStatusLabel` and the shared `ORDER_NOTICE` map. The older exports remain re-exported from `format.ts` for compatibility with existing callers.
- All 13 production enum values are mapped. `payment_submitted` means proof submitted and awaiting manual review; legacy `paid` means staff marked payment received; `verified` means an administrator accepted the submitted proof. None of these labels implies automatic bank settlement reconciliation.
- `delivered`, `fulfilled` and `completed` display as `Delivered`, while legacy values remain unchanged in storage. The customer copy says staff marked the order delivered and does not claim automatic email or order-page delivery.
- Unknown enum values use a generic `Status update` label rather than exposing raw internal status text.
- This is a presentation-only change. It does not add status values, alter transitions, write production data or change payment/fulfilment evidence requirements.
### 4.2 Order-time pre-fulfilment snapshot

- New order items store a versioned `__mtdgc_snapshot` object inside the existing `order_items.fields` JSONB. The snapshot contains the product's server-read `region` and the product's exact `requirements` labels at order creation.
- Customer-provided values remain top-level string fields. The server fetches region/requirements through the selected variant's product relation; the browser cannot supply or overwrite the reserved snapshot key.
- `order_items.variant_name` already records the selected option/denomination, so no extra denomination column or migration is introduced.
- The admin order detail sheet builds a per-item checklist from the saved snapshot: selected option, order-time product region, each required field and recorded/missing state. Extra saved customer fields remain visible.
- The checklist never joins the current product record to reconstruct historical requirements or region. An item without a valid snapshot is explicitly marked as not captured/unrecognised; missing historical requirements are not guessed.
- The snapshot is rendered only in the admin order detail view. Existing public order-summary responses do not expose the customer fields or internal snapshot.
- This is an order-data snapshot and review aid, not a supplier runbook or proof of fulfilment readiness. Supplier-specific instructions remain blocked until independently verified evidence exists.

## 5. Guest Checkout and Order Tracking Architecture

### Order identity at creation

- Guest checkout does not require an account; `orders.user_id` may be NULL. Authenticated checkout can associate the order with the resolved user ID.
- Checkout stores the supplied `guest_email` and `guest_phone` values where provided. At least one contact is required by the order input schema.
- The server creates a high-entropy order number and a separate 256-bit guest access token. The order stores SHA-256 hashes (`verification_hash` and `access_token_hash`), not the raw access token.
- `verification_hash` is derived from the order number plus the normalised primary contact (phone when supplied, otherwise email). The raw access token is returned to the customer at order creation and is kept in browser local/session storage for the order confirmation route; it is not embedded in the readable order-number URL.

### Public tracking lookup

- The public `/track-order` form requires both an order number and the email address or phone number used at checkout.
- The browser and server share the same contact-format validator: a syntactically valid email or a phone-like value containing 7–15 digits after removing formatting characters.
- The server also validates the order reference against the supported current and historical formats; browser-only validation is not relied upon.
- The lookup loads the order by its order number and returns order details only when the supplied contact matches that same order. It checks the hash of the upper-cased order number plus the normalised contact, and supports a case-insensitive saved-email match when email was also collected. A wrong order/contact pair returns the same generic not-found result as an unknown order.
- Phone matching normalises punctuation and spacing to digits. It does not infer or add a missing country calling code; customers should use the same underlying number supplied at checkout.
- The lookup response contains order status, timestamps, total and item summaries; it does not return the stored email, phone, access-token hash or verification hash.

### Separate order-confirmation access

- `/order/:orderNumber` can also resolve an order using the raw high-entropy access token held in browser storage, an authenticated account-owner check, or the rate-limited contact fallback. The readable order number alone is not sufficient.
- The guest access token is a bearer secret scoped by its stored hash. Do not place it in a public URL, analytics event, support message or log.
- Stored payment-proof images remain private; the guest tracking permission does not grant direct proof-image access.

### Rate limiting and storage controls

- Public tracking hashes the request IP and records attempts in `order_lookup_attempts`. The current threshold is 10 attempts per 10 minutes per derived IP hash; old rows are cleaned up after 24 hours.
- If the attempt-count query or attempt insert fails, the lookup returns an unavailable response instead of proceeding without a working rate-limit record. The count-plus-insert sequence is not atomic, so concurrent requests can still exceed the threshold; database-atomic enforcement requires a reviewed migration/RPC after the documented Supabase cutover.
- Production inspection confirmed `orders` and `order_lookup_attempts` have RLS enabled. The lookup-attempt table has no direct role policies; the server-side service-role function performs its access. Its `(ip_hash, created_at)` index supports the time-window count.
- No production test order was created for this verification.

## 6. Launch Strategy (Separation)

### Phase 1: MVP (Manual)
- **Payment**: Users select "Manual Transfer" (eSewa/Khalti) and provide a transaction ID/Screenshot.
- **Fulfillment**: Admins manually update status and send codes via WhatsApp/Email.
- **Architecture**: All tables present, but `payments.provider` is 'manual'.

### Phase 2: Automated
- **Payment**: Integration with eSewa/Khalti SDKs/Webhooks.
- **Fulfillment**: Automated delivery for products with pre-loaded digital codes.

