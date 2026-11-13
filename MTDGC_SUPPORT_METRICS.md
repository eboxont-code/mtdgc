# MTDGC support metrics — MT-0226

**Status:** Implemented on a feature branch; not merged or live. The pull request and required GitHub checks are held until the owner confirms that GitHub Actions is enabled and free included usage remains.

## What the dashboard measures

- **Recorded support tickets per 100 orders** = all rows in `public.support_tickets` divided by all rows in `public.orders`, multiplied by 100 and rounded to one decimal place.
- If there are no recorded orders, the dashboard displays an unavailable marker rather than inventing a zero rate.
- The category list groups the saved `issue_type` labels, sorts by count (highest first), uses alphabetical order for ties, and shows the five most common categories.
- Blank or missing category labels are shown as **Uncategorised**.
- Each ticket is counted, including requests without an order number.

This is deliberately labelled as a **recorded support-ticket** rate. The support page also links to WhatsApp, but WhatsApp conversations and other off-platform contacts are not stored in `support_tickets`; they are excluded and must not be presented as part of an all-channel contact rate.

## Access and privacy

- The metrics appear only in the existing admin overview after its signed-in user and admin-role check.
- The category query uses the signed-in Supabase client and existing row-level security. It selects only `issue_type`, in pages of 500 rows ordered by creation time and ID.
- It does not fetch ticket descriptions, customer IDs, order numbers, payment screenshots, phone numbers or email addresses for the category report.
- The existing latest-ticket panel is unchanged.

## Read-only production evidence

On 13 November 2026, schema metadata showed:

- `public.orders`: 8 rows.
- `public.support_tickets`: 0 rows.
- Both tables have row-level security enabled. The support-ticket policies allow admin reads and owner-scoped ticket access/submission.
- No support-ticket rows or customer details were queried.

The observed baseline is therefore **0.0 recorded support tickets per 100 orders**, with no categories to rank. This is a schema-metadata baseline, not a claim about WhatsApp or other off-platform contacts.

## Verification

- Five focused helper tests passed locally under Node 22.
- Strict TypeScript checking of the standalone metrics helper passed.
- The full repository lint, full typecheck, full test suite and production build were not run because Bun and the repository dependencies are not installed in this workspace.
- No new GitHub Actions run was triggered. Opening a pull request would start the required workflow; that is being held until the owner confirms the free Actions allowance and settings.

## Release and safety

- Implementation branch: `automation/mt-0226-support-metrics-20261113-run11`.
- No pull request has been opened, no merge has occurred, and this change is not live.
- No production rows, customer records, payment records, schema, migrations, credentials, secrets, environment variables, hosting settings or DNS were changed.
- Additional spend: **$0**.
