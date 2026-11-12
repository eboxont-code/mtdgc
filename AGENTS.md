<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Admin order details live in a focused sheet component and use existing role-protected actions; keep status options aligned with the existing validator.
- Responsive product images map original asset URLs to CDN WebP pointers in a browser-safe helper; never rewrite listing records to optimize presentation.
- Mount mobile navigation and reduced-motion-aware scroll reveals within the root cart provider so shared navigation can access the existing cart without changing checkout flows.
- Catalog display labels and pure duration/discount helpers live in format.ts; keep them independent of catalog records and price visibility so presentation never changes stored offers.
- Client publication safeguards use publication-check.ts and saved variant rows reported by VariantsEditor; server saveProduct remains unchanged, so UI checks are not a replacement for server authorization.
- The Deals route is a UI-only empty state until real sale data is available; never infer or invent deals from catalog prices.

- Admin tabs render focused presentation panels with typed props; keep existing data reads, access checks and action callbacks in the admin route to preserve authorization behavior.
- Authenticated layout loading uses its route pending component so session checks retain existing redirects while showing accessible branded feedback.
- The admin payment fallback notice derives from successfully loaded or saved settings, never unsaved input or a failed read, to avoid misreporting checkout configuration.
- Order and tracking loading share a browser-safe skeleton with accessible status and reduced-motion support; it never renders invented order data.
- Account empty states use the shared EmptyState presentation with existing Matrix surface tokens and a caller-supplied action, leaving reads and eligibility in each route.
- Public availability labels, filters and purchasable counts share the browser-safe product-availability helper, mirroring product/option eligibility without modifying catalog data or cart rules.
- Product purchase summaries reuse existing listing fields above desktop and mobile actions, omitting empty values without changing purchase eligibility or listing data.
- Catalog search and sorting use browser-safe pure helpers with query-only aliases and the existing display-price callback; URL state and mobile filter sheets never mutate listing records or hidden-price rules.
- Product delivery fields are projected from the current listing requirements on restoration and before adding a line; this prevents unrelated fields leaking between products without changing protected cart or checkout logic.
- Product region notices share a listing-only presentation above desktop/mobile actions; gift-card confirmation is scoped to the current product and saved region so navigation cannot reuse a different confirmation.
- Product and category head metadata use the browser-safe listing-seo helper with saved identity fields and query-free canonicals so view-state parameters never create duplicate page identities.
- Storefront loader presentation uses shared route pending/error components and existing EmptyState/Skeleton primitives; retries invalidate existing reads without changing server actions or eligibility.
- Customer order details and guest tracking share browser-safe status-to-next-action guidance; it mirrors existing proof-upload eligibility without authorizing transitions or assuming settlement/delivery evidence.
