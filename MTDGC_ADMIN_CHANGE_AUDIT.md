# MTDGC Sensitive Administrative Change Audit

**Task:** MT-0296 · P1 · DONE (audit only)  
**Audit date:** 9 November 2026 (UTC)  
**Repository baseline:** `main` at `de1b11f540bf1933dc78ec2487392a0024a15de2`  
**Production deployment:** `dpl_4njU9xzd9RmCkGuYeQBDTLZV9Nay` — READY on the same commit  
**Supabase project:** `mtdgc` (`eaomkkswslqtfunkceuc`) — ACTIVE_HEALTHY

## 1. Purpose and boundary

This audit checks whether sensitive administrative changes to product price and region, recipient details, payment state, refunds, digital-code reveal and supplier fulfilment record **who acted, when they acted and why**.

This is a source-and-schema audit only. It does not add audit logging, change application behaviour, run a migration, read customer/order/payment rows, inspect storage objects, or change production settings. The findings describe the current code and database metadata observed on the stated baseline; they are not a claim that every action is safely or atomically recorded.

## 2. Findings at a glance

| Sensitive action | Current evidence | Actor recorded? | Time recorded? | Reason recorded? | Audit result |
|---|---|---:|---:|---:|---|
| Change product region or product details | Admin-only `saveProduct`; `products.updated_at` is set on normal edits | No | Yes, on normal edit | No | Partial |
| Change product price, stock or variant status | Admin-only `saveVariant`; variant row has no audit fields | No | No | No | Missing |
| Archive a product or variant | Admin-only archive actions; no separate event is written | No | No reliable audit time | No | Missing |
| Change recipient/customer delivery details | Checkout stores details when the order is created; no edit action was found in the reviewed admin action module or order-detail panel | No edit event | No edit time | No | No supported edit audit |
| Change order/payment status | `updateOrderStatus` updates `orders.updated_at` and inserts `order_status_events` with `created_by` | Yes, in event if insert succeeds | Yes, event default `created_at` | Optional note | Partial |
| Review payment proof | `payment_proofs` has `reviewed_by`, `reviewed_at`, `review_note`; transaction reference is stored at submission | Yes, intended | Yes, intended | Required for rejection; optional for verification | Partial |
| Change payment instructions or QR | `savePaymentSettings` and QR upload set `updated_by` and `updated_at` | Yes | Yes | No | Partial; overwritten singleton, no history |
| Mark an order refunded | Generic admin status update accepts `refunded`; no separate refund record or provider action was found | Event actor only, if event insert succeeds | Event time only, if event insert succeeds | Optional note | Status label only; not refund evidence |
| Reveal/deliver a digital code | No dedicated code-reveal action, code table or code-storage bucket was found in the reviewed source/schema | No | No | No | Not implemented |
| Supplier fulfilment action | No supplier-order table or supplier fulfilment action was found; the supplier identity register remains empty | No | No | No | Not implemented |

## 3. Current controls and important limitations

### 3.1 Administrator authorization is present, but authorization is not an audit trail

The reviewed server actions in `src/lib/admin.functions.ts` use authenticated-session middleware and call `has_role` for the exact `admin` role before performing administrative writes. The production RLS policies also restrict writes to administrator roles for products, variants, orders and order-status events.

These controls restrict who may perform the write. They do not, by themselves, preserve a trustworthy history of what changed, the previous value, or the reason.

### 3.2 Product and variant changes are not fully attributable

- `saveProduct` sets `products.updated_at` for a normal edit, but does not store the acting administrator or a reason.
- `archiveProduct` changes publication/status fields without setting `updated_at` or writing an event.
- `saveVariant` and `archiveVariant` do not write actor, timestamp, reason or an audit event.
- Production metadata confirms `products` has `updated_at` but no `updated_by`; `product_variants` has neither `updated_at` nor `updated_by`.
- Price is stored on `product_variants`; region is stored on `products`. There is no before/after history for either.

### 3.3 Order-status history has useful fields, but is not a complete reliable audit log

- `order_status_events` contains `created_by`, `created_at` and an optional `note`.
- `updateOrderStatus` updates the order and then inserts an event. It does not check the event insert result, and the two writes are not one database transaction. An order status can therefore change even if its audit event fails.
- The reason/note is optional for generic status changes.
- `addOrderNote` writes to the same event table using the current status label. It is a note, not necessarily a status transition.
- The table stores a text status and note, not structured old/new values or a dedicated action type.
- The observed RLS policy grants administrators all operations on this table; no database trigger or append-only enforcement was found.

### 3.4 Payment review records actor and time in principle, but write failures are not handled consistently

- `payment_proofs` contains `transaction_ref`, `reviewed_by`, `reviewed_at` and nullable `review_note`.
- `reviewPayment` requires a note for rejection, but a verification note is optional.
- The order-status update is checked. The subsequent payment-proof update and status-event inserts do not check their returned errors, and the sequence is not atomic.
- Consequently, the schema has the intended reviewer/time fields, but the current action does not guarantee that all related audit records succeed together.

### 3.5 Payment settings have a current updater, not a history

The `payment_settings` row has `updated_by` and `updated_at`, and both settings-save and QR-upload actions populate them. There is no reason field or immutable history of prior values. The singleton row is overwritten.

### 3.6 Recipient, refund, code and supplier actions are not represented as audited workflows

- The reviewed checkout path writes recipient/contact information when an order is created. The reviewed admin order-detail panel displays those details but does not edit them.
- `refunded` is an allowed generic order status. No refund transaction, provider response, refund reference or dedicated refund record was found. A status value must not be treated as proof that money was returned.
- The production public schema has no dedicated audit, refund, supplier-order, delivery-evidence or delivered-code table. The only public storage buckets observed are private `payment-proofs` and `payment-qr`; no delivered-code bucket was found.
- `SUPPLIER_REGISTER.md` has an empty supplier identity table and no verified product scopes. No supplier fulfilment actor, transaction reference or delivery evidence can currently be audited.

## 4. Read-only production metadata reviewed

The following metadata was inspected without selecting customer, order, payment or support record values:

- Public tables and column names for `products`, `product_variants`, `orders`, `order_status_events`, `payment_proofs`, `payment_settings` and `support_tickets`.
- Relevant RLS policy definitions.
- Database triggers on those tables: none were returned.
- Public routines with an audit-related name: none were returned.
- Public table names matching audit, supplier, refund, delivery or code: none were returned.
- Storage bucket metadata: `payment-proofs` is private with a 5 MiB cap; `payment-qr` is private with a 2 MiB cap. Neither bucket has a storage-level MIME allowlist configured in the observed metadata.

The public schema contained 14 tables at inspection. This is a metadata snapshot, not a claim about records or objects stored outside the inspected schema/buckets.

## 5. Required follow-up and release boundary

1. Keep this task as **audit complete**, not “audit logging implemented”.
2. Do not add an audit table or run a production migration against the current Supabase project. A coordinated schema change remains behind the documented Boxont-controlled Supabase cutover and migration gate (MT-0303/MT-0304).
3. When that gate is cleared, design an append-only audit record with a server-derived actor, server timestamp, action/entity, redacted before/after values, mandatory reason where appropriate, and a correlation reference. Do not store passwords, tokens, payment credentials or unnecessary customer data in audit records.
4. Make status/proof updates and their audit events atomic; a successful business-state update must not silently outlive a failed audit write.
5. Keep product/variant changes, recipient edits, refunds, code reveal and supplier fulfilment unavailable as “audited” workflows until the corresponding actions and evidence actually exist.

Implementation work is separately tracked by MT-0168 (sensitive admin-action logging) and MT-0072 (price-change history). This audit does not complete those implementation tasks.

## 6. Verification record

- GitHub source baseline: `de1b11f540bf1933dc78ec2487392a0024a15de2`.
- Production deployment: `dpl_4njU9xzd9RmCkGuYeQBDTLZV9Nay`, READY, deployed commit `de1b11f540bf1933dc78ec2487392a0024a15de2`.
- Supabase project status: ACTIVE_HEALTHY.
- Read-only SQL inspected schema columns, RLS policies, triggers, routines, table names and storage bucket metadata only.
- No customer/order/payment rows or storage objects were read.
- No application code, production database/schema, records, credentials, authentication, hosting, DNS or billing settings were changed.
- Additional spend: $0.

**Outcome:** MT-0296 audit DONE. Sensitive-change audit logging is not implemented; the remaining gaps and migration dependency are recorded above.
