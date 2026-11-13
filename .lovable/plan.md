# MT-0031: listing-based product usage labels

## What changes
- Reuse saved delivery-method and explicit usage-tag data to show short usage labels on existing product cards, rows and product purchase summaries.
- Direct delivery to a saved player/account ID is labelled account-bound; saved digital-code delivery is labelled redeemable by code. Single-use, recurring and prepaid labels appear only when explicitly stated in saved usage tags, never from category, brand or plan length.
- Show nothing when no supported usage information exists. Keep Matrix styling, availability and pricing unchanged.
- Verify current products at 390px first, then desktop; record dated MT-0031 evidence in the Master Plan. Do not publish.

## Technical details
- Add a browser-safe pure usage-label helper with conservative exact matching and tests for the five labels, unsupported/absent data and no category-based guessing.
- Reuse the helper in existing card presentation and the existing details block above mobile and desktop purchase actions. No protected cart, checkout, router/Sentry, server action or listing-data changes.
