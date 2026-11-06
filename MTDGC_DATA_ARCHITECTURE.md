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

