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

The customer progress helper now groups `payment_submitted`, `verified`, `processing`, and `delivered`/`fulfilled`/`completed` into four steps. Legacy `paid` is displayed separately and is not treated as proof submission or verification. The operational definitions and current limitations are recorded in section 4.6.


### 4.6 Customer-facing operational definitions (MT-0102)

These definitions describe what the current application records and displays. They do not create or imply an enforced state machine; MT-0104 remains responsible for approved transition rules and server-side gates.

| Customer label | Stored status | Operational meaning in the current implementation | Does not prove |
|---|---|---|---|
| Payment proof received | `payment_submitted` | The customer proof handler accepts a screenshot/reference submission, uploads the image, and conditionally changes the order from `pending_payment` to `payment_submitted`. The proof-row and event writes occur separately and their errors are not all checked. | That funds reached MTDGC, or that the proof metadata/event was persisted successfully. |
| Verified by staff | `verified` | An administrator has marked the order verified. The dedicated `reviewPayment` path can do this after loading a submitted proof, but the generic `updateOrderStatus` action can also set `verified` directly; proof metadata is updated separately. | Independent bank/provider settlement, or that the dedicated proof-review path and proof-row update definitely completed. |
| Processing | `processing` | An administrator has manually marked the order as processing. | A live supplier/API state, that a supplier accepted the order, or that the payment prerequisite was enforced. The generic updater currently permits this status from any existing state. |
| Delivered | `delivered` (legacy aliases: `fulfilled`, `completed`) | An administrator has manually marked the order delivered. The customer progress UI groups the legacy aliases with `delivered`. | A delivery-evidence record, customer receipt confirmation, or email dispatch. The live schema has no `order_deliveries` table, and no outbound email-sending integration was found in the repository source/dependencies. |
| Legacy payment status | `paid` | A legacy/manual target of the generic administrator status updater. It is excluded from the four-step progress sequence and displayed as “Legacy payment status”. | Proof submission, dedicated proof review, or independent settlement confirmation. |

The customer UI uses “Payment proof received” rather than “Payment received” because a screenshot/reference submission is not evidence that funds reached the receiving account. “Verified by staff” is deliberately a staff-marked status, not a bank/provider-confirmed settlement claim. “Processing” and “Delivered” describe manual staff status changes; neither is an automated supplier or delivery-evidence signal.

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

- Residual advisory: `public.has_role(uuid, app_role)` is a SECURITY DEFINER function executable by anon/authenticated and can disclose whether a supplied UUID has a role. The proof policies still scope reads to authenticated `auth.uid()` owners or admins, so this is a separate role-membership disclosure; fix it only with a coordinated policy/function migration because RLS policies depend on the function. `order_lookup_attempts` remains service-role-only with RLS enabled and no client policies.
