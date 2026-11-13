# MT-0144 and MT-0145: region and player-detail warnings

## What changes
- Reuse existing saved-region warnings above desktop and mobile purchase actions; verify their placement without inventing regions or additional restrictions.
- Add "Check your player ID, zone and server. Top-ups cannot be reversed once delivered." beside the existing top-up detail fields, and associate it with those fields for screen readers.
- Preserve Matrix tokens, existing product data, prices, cart, checkout, product-help, router/Sentry and server actions.
- Verify existing code and top-up pages at 390px first, then desktop, checking warning placement and horizontal overflow. Record evidence; do not publish.

## Technical details
- Scope the additive top-up notice using the existing game-top-up category, without changing requirements or purchase eligibility.
- Reuse the existing region-notice component and run its existing listing-region tests. No copy or snapshot tests.
