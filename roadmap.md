# MTDGC launch roadmap

> **Current plan and task status:** [`MTDGC_MASTER_PLAN.md`](./MTDGC_MASTER_PLAN.md) is the single source of truth.
>
> This file is preserved as a dated implementation and verification history. Checkboxes below record the status claimed by each historical pack when it was written; they are not a second live TODO register. When an old pack conflicts with the Master Plan, use the Master Plan and refresh the implementation evidence before changing task status.

## 5 Nov ordered pack
- [x] MT-0195: shared EmptyState/Skeleton loading, retry and empty presentation on catalog/category/product lists and product loading/errors; 390px failure-to-retry flow and unavailable purchase lock verified; protected home/global/cart/checkout states skipped; not published.
- [x] MT-0196: visible option focus, unique required-field descriptions, selection/result announcements, 44px tabs and mobile filter focus restoration; keyboard checks and reduced-motion axe audit passed at 390px/desktop; existing scroll-reveal contrast flags and protected global controls left unchanged; not published.
- [x] MT-0197: catalog eager images reduced to first two, remaining five lazy; existing 320px dimensions and async decoding verified; related art already lazy and fonts already self-hosted; script deferral skipped in protected root/router, JSON-LD retained; 20 regression tests and automatic build passed; not published.
- [ ] MT-0188: existing plan URL remains the selection source; back-navigation and reload verification pending; not published.
- [ ] MT-0189: product forms already render listing requirements only; restored and submitted fields now exclude unrelated keys; protected checkout contact fields and legacy cart-line cleanup skipped; verification pending; not published.
- [x] MT-0185: client-side brand/name/game/denomination search and FF/PUBG/ML/MLBB/NFX aliases; URL state retained; rule tests and real FF search passed; not published.
- [x] MT-0186: Relevance, Price low-high, Price high-low and Availability sorting using existing display prices and purchasability; rule tests, URL reload and automatic build passed; not published.
- [x] MT-0187: compact mobile filter row with categories/availability/prices in a bottom sheet; Matrix product tiles unchanged; 390px and desktop checks passed without overflow, first product starts at 344px; not published.
- [x] MT-0190: product page "How you pay" now lists the manual steps (QR/bank details at checkout, pay in NPR, upload screenshot/reference, verified then delivered); checkout is protected so it was left unchanged.
- [x] MT-0192: gift card pages with a listing region show a region notice and a required confirm checkbox; add/buy is blocked with a message until ticked; protected cart/checkout unchanged.
- [x] MT-0184: compact existing region, platform, delivery method and required customer details above desktop/mobile purchase actions; empty values omitted; Matrix design, protected files and listing data preserved; not published.
- [x] MT-0183 Price/variant parity audit: page, cart and checkout already matched (same price_minor, variant.name, formatNpr); card "from" price now skips archived options like the product page. Not changed: cart WhatsApp text in protected cart.tsx uses its own number format.
- [x] MT-0182: consistent Available now / Coming soon labels on product cards, options, pages and wishlist; catalog/category purchasable counts exclude upcoming and hidden-price records; coming-soon purchase actions remain disabled; rule tests and 390px checks passed; protected cart/checkout/product-help/router and existing data preserved; not published.

## 31 Oct ordered pack (starting head 33534ec1)
- [x] Numbered 39: branded pending account state with a polite status and reduced-motion-aware spinner; existing session check and signed-out redirect unchanged. Automatic build OK, revision cdb348e. Desktop loading and phone signed-out redirect verified; loading is transient on phones. Publish requested.
- [x] Numbered 40: skipped because root route is explicitly protected; final developer error presentation unchanged.
- [x] Numbered 41: verified-order confirmation links to tracking with a validated order search parameter. Prefill never submits or bypasses required contact verification. Automatic build OK, revision 546229b; phone/desktop prefill, reload and missing-contact rejection verified without lookup requests. Populated confirmation remains unverified without an authorized real order.
- [x] Numbered 42: saved-settings-only admin notice for missing QR and bank details, within the existing Payments tab. No settings or server calls changed. Rule test passed and automatic build OK, revision 5e39a35. Authorized admin UI verification remains blocked by missing requester account.
- [x] U2: dropped; final header search remains unchanged.
- [x] U3: protected Matrix catalog retained; prior F23 URL type controls and existing search/sort flow are not redone. Any additional chip changes skipped under the protected listing rule.
- [x] U4 partial: shared order/track-result skeleton with stable placeholder dimensions and reduced-motion support, using the existing Skeleton component. Protected catalog/category/home/product surfaces skipped; admin tables deferred. Automatic build OK, revision e86be05; phone/desktop skeleton and contact gate verified without order exposure. Publish requested, completion unconfirmed.
- [ ] Next U5-U22, then G1-G6; authorized private order/admin checks remain blocked by missing requester account.
- [x] U5 partial: shared token-based EmptyState used by orders and wishlist, preserving their data reads and catalog action. Protected catalog/category/search surfaces skipped; admin lists deferred. Automatic validation pending; signed-in empty rows remain unverified without a requester account.
- [ ] Numbered 40-42, then U2-U22 and G1-G6 in order. Protected-file conflicts remain skipped.
- Starting credit balance: 5.00. Lovable manages revisions and item commit labels.

## 30 Oct ordered pack (starting head 6e83441a)
- [x] Numbered 27: additive global keyboard focus outline uses the existing primary token, 2px width and 2px offset, outside utility layers so outline-none cannot suppress it. Matrix palette and all protected layouts unchanged. Automatic build OK, revision 63f9845; computed focus verified at 390px with no overflow, desktop captured. Publishing requested.
- [x] Numbered 29: tracking inputs now have explicit IDs/labels, autocomplete off, contact guidance and associated error descriptions. Existing validation and privacy-protected lookup unchanged. Automatic build OK, revision 1798616; missing-contact error and associations verified at 390px and desktop without horizontal overflow.
- [x] Numbered 30: support form controls have explicit IDs and associated labels; textarea errors expose aria-invalid and aria-describedby. Visible input/select targets are 44px; unnecessary outline-none removed. Existing ticket submission unchanged. Automatic build OK, revision 686ee77; empty-description error, 44px fields and no horizontal overflow verified on phone and desktop.
- [x] Numbered 32: cart drawer keeps full-width mobile shell, scrolls only line items and pins existing actions below; quantity tools wrap below details on phones. Line images now have explicit 48px dimensions and meaningful alt text. No cart logic or payment copy changed. Automatic build OK, revision f06c625; real product details and Add to cart verified at 360px and desktop, no order placed, no horizontal overflow.
- [x] Numbered 33: already shipped by developer; icons, manifest and head links unchanged.
- [x] Numbered 34: existing result count now announces filter changes politely and atomically. Existing stable filter controls and focus behavior retained; no listing restyle. Automatic build OK, revision cee5795; keyboard Subscriptions selection announced 1 product and retained focus at 390px without overflow.
- [x] Numbered 35: empty catalog results now link each existing published category, alongside retained Clear filters, FAQ and Support actions. No records or categories invented. Automatic build OK, revision 3ac5425; real category links verified for empty search at 390px without horizontal overflow.
- [x] Numbered 38 partial: added missing delivery-location, renewal and activation-help answers using the existing accordion and shared FAQ/schema data. Unconditional prepaid renewal promise omitted because listing terms are not supplied. Existing payment, timing and guest-order answers preserved. Automatic validation pending.
- [ ] Next is numbered 39-42, then U2-U22 and G1-G6; private order data and prior protected-file conflicts remain blocked as documented.
- [ ] Next: numbered 29, 30, 32, 34, 35, 38-42, then U2-U22 and G1-G6. Numbered 28 dropped; 33 preserves final developer icons. Prior completed tasks are not reopened.
- Starting credit balance: 5.00. Revisions and item commit labels are managed by Lovable; no manual Git operations.

## 28 Oct ordered pack (starting head 01687045)
- [x] Numbered 26 (29 Oct): About contact block links Support and Track order, with a conditional support-only WhatsApp button using the existing helper. No contact details invented. Automatic validation pending.
- 29 Oct checkpoints: automatic build OK for numbered 15 (f8830ed), 16 fallback (bd1bfe2), 17 (9ac458c), 18 partial (1f0afaf), 22 (2e25840) and 23 partial (10e6322). Support answers and honeypot tested at 390px and desktop without overflow. Private populated admin/account/orders/wishlist checks blocked by missing requester account. Publish requested; custom-domain deployment unconfirmed. Next is numbered 27, then the remaining numbered, U and G tasks; partial 16/18 require richer existing data, not invented matching.
- [x] Numbered 23 partial (29 Oct): support-only hidden honeypot blocks client submission when filled. Checkout skipped because it is explicitly protected; no server action changed. Automatic validation pending.
- [x] Numbered 22 (29 Oct): seven native support answers in the requested order, with listing-specific replacement terms, payment fallback and verification, privacy-safe tracking and no invented refund timing. Existing developer icon cards preserved. Automatic validation pending.
- [x] Numbered 18 partial (29 Oct): wishlist loading, retryable load errors, empty state and failed-removal feedback; one-column phone rows, option/details product link and missing-product removal. Direct default-option addition omitted because existing wishlist rows contain no variants or requirements; product page safely handles eligibility and details. Automatic validation pending; private verification blocked by missing requester account.
- [x] Numbered 17 (29 Oct): existing profile form/save path retained; delivery email uses native email validation, optional phone uses tel input, trimmed values, save failures no longer show false success, saved feedback announced and cleared on edits. Orders/Wishlist/Support navigation added; existing empty states retained. Automatic validation pending; signed-in save verification blocked by absent requester account.
- [x] Numbered 16 partial (29 Oct): added an honest catalog fallback for reordering. Existing listMyOrders returns display names and totals, not product IDs, variant IDs, slugs or requirements. Safe cart reconstruction and direct product links cannot be supplied without a forbidden server change; no name-based matching or invented eligibility. Automatic validation pending.
- [x] D2 follow-ups / F4 / F21 / F28: waiting Deals links added to footer Shop, category navigation and About. Automatic build OK, revision a1b731a. Phone and desktop links reach the real Deals empty state; HTTP 200, no overflow or browser errors. Existing styles and final developer copy preserved.
- [x] D3: automatic build OK including existing validated plan selection; product page unchanged. Prior real option/reload check preserved.
- [x] P8: skipped protected checkout/cart conflict. Current Buy now uses the existing cart path; isolated checkout would require editing the explicitly protected checkout. No misleading half-implementation added.
- [x] P12: skipped protected cart route and cart library conflict; no cart storage, eligibility or checkout changes.
- [x] P15: existing on-site copy preserved. Targeted order, tracking, drawer, how-it-works and FAQ check found only support-only WhatsApp links in order/tracking. Checkout and product-help remain protected; prior developer fixes not redone.
- [x] S3: skipped protected cart route conflict; no recommendations or catalog rows invented.
- [x] S4: skipped conflict with final developer disabled Coming soon labels; unavailable-product design preserved.
- [x] S6: Support already has ContactPage, contactPoint and matching breadcrumbs, preserved. About now uses AboutPage with the existing Organization as mainEntity and visible Home > About breadcrumbs. Existing SEO helpers reused; no business facts added. Automatic build OK, revision ece3f75; schema and matching visible breadcrumbs checked at 390px and desktop with no overflow.
- [x] S7 partial: existing WebPage helpers on how-it-works, tracking and four policy pages and existing FAQPage/breadcrumbs preserved. Each has matching visible Home > Page breadcrumbs. Policies middle destination omitted because no Policies index exists; do not invent a breadcrumb URL to an unavailable page. No final developer JSON-LD redone.
- [x] Numbered 2 and 3: skipped explicit protected cart route conflict; developer's rebuilt cart unchanged.
- [x] Numbered 15 extraction: Catalog, Orders, Support and Reviews moved into focused panels, alongside existing Payments and Verify panels. Scrollable mobile tabs preserve actions, reads and staff access checks. Automatic build OK, revision f8830ed; publishing requested. Populated admin verification blocked: session minting confirms no app account matches the requester. Existing failed-action toasts retained; no protected files or server actions changed.
- Publishing requested for green changes. Live check: both origins returned HTTP 200, but neither served the updated AboutPage schema at the time checked; mtdgc.com also lacked the new Deals link. Custom-domain deployment not confirmed. Latest publish schedules the current revision for https://mtdgc.lovable.app; no domain or hosting changes made.
- [ ] Next: finish numbered 15, then numbered 16-18, 22-23, 26-27, 29-30, 32, 34-35, 38-42, then U and G in order. Item 33 is already shipped by the developer's final icons and manifest links; preserve them. Protected-file conflicts above remain skipped, not implemented.
- Revisions and commit labels are managed automatically by Lovable; no manual Git commits.

## October 18 strict gate
- [x] R0.8: Matrix tokens, glass surfaces and 44px controls applied to account, orders, wishlist, order, tracking and admin. Classes and markup only. Build OK; all six pages checked at 390px with no horizontal overflow. Private pages correctly redirect to sign-in. Tracking rejects missing contact; an order number alone stays locked. Auth redirect has existing 40px inputs and 20px text buttons, outside this styling unit. Private populated states were not checked. Publishing requested. Code revision: 2ad3d0e (automatic Lovable commit; custom commit labels unavailable).
- [x] R0.9: measured current Matrix tokens using browser Canvas sRGB conversion and WCAG relative luminance, compositing glass over background. All table pairs meet 4.5:1. Destructive badge foreground was 3.50:1; only its lightness changed from 0.98 to 0.22, preserving hue and chroma. No palette or layout redesign. Build OK; code revision 7971d60; publishing requested. Placeholder opacity and hover compositing remain unverified.
- [x] 0c: static sitemap matched current published category/product flags using a read-only data query; removed coming-soon Steam listing. 21 sitemap pages plus /products checked in server HTML: HTTP 200, self canonicals except /products -> /catalog, no duplicate titles or descriptions. Robots already has required disallows and sitemap URL, unchanged. Home metadata unchanged. Static snapshot requires updates when publication flags change; no backend generation added. Build OK; code revision 912f84d. Private metadata inheritance remains A16.
- [x] A16: every route now emits its own twitter:title and twitter:description matching its og tags; root head keeps og:url from the leaf canonical. Verified in server HTML on /, /cart, /auth, /catalog. Build OK.
- [x] A17: 120-200 word intros for subscriptions, gift-cards and game-top-ups below the category description, with a link to /how-it-works. Build OK.
- [ ] A18-A20, F items, D2/D3, P/S items, numbered items, U2-U22, G1-G6: blocked until preceding item is checked and committed.
- Git state and commit messages are managed by Lovable. Record each automatic code revision before advancing the gate.

## October 17 ordered UI pack
- [x] R0: dark glass theme, cards, header, CSS grid hero, category tiles, search-to-catalog, reduced-motion reveals and bottom navigation; mobile home/search/cart/checkout checked, account checked signed out. Published revision requested.
- [x] 0c: removed /products sitemap entry; 22 remaining live entries return 200, self canonicals and unique titles. Full private-route and published-row comparison unavailable in this check; robots unchanged. Reported limitation before proceeding.
- [ ] A13, A16-A20, F items, D2/D3, P/S items, numbered items, U items, G items in requested order
- [x] A13: individual offers only, seller, item condition and policy link; no sale_ends_at field exists, so validity omitted.
- [ ] A16 partial: sharing defaults added and root images removed; initial rendered cart check still shows fallback metadata, so route-specific inheritance remains open.
- [ ] R0 remaining verification: product and authenticated views, measured contrast; Search slot currently opens catalog rather than U2 sheet.

## October 16 UI pack
- [x] Item 0a/b: listings unchanged; legacy redirects verified 301. Trailing slash remains router-managed 307.
- [ ] Item 0c: added private-page canonicals; sitemap published-state verification not completed (files unchanged).
- [x] T0: skipped; react-start is already 1.168.61
- [x] P7: order detail slide-over using existing actions; signed-in verification blocked by unavailable account session
- [x] A2: published Lovable badge hidden
- [x] A4: responsive CDN WebP product images
- [x] A5: self-hosted fonts with preload and swap
- [x] A6: reserved plan, availability and requirement space; stable price button width
- [ ] Remaining A, F, D, P, S, numbered, U and G items in requested order
- [ ] Publish green changes and report credits and revision

- [ ] Commerce schema, access policies, and launch catalog migration
- [ ] Shared storefront shell, catalog search/filter/sort, product pages
- [ ] Persistent cart, checkout, orders, confirmation, and tracking
- [ ] Email/Google auth, customer profiles, account, wishlist, order history
- [ ] Reviews, support tickets, private uploads, and admin operations
- [ ] FAQs, guides, policies, contact, SEO/AEO metadata and structured data
- [ ] Sitemap, robots, accessibility, performance, security, and responsive audit
- [ ] Publish and verify the public MTDGC site
- [ ] Blocked: real payment integration awaits provider selection/configuration
- [ ] Blocked: final legal/support copy awaits MTDGC business details
- [ ] Blocked: public catalog expansion awaits verified offers and fulfilment data

## Current launch pack
- [ ] Force Lovable project display name to MTDGC and verify
- [ ] Complete MTDGC identity sweep, favicon, manifest, inner-route metadata
- [ ] Ship catalog, product detail, persistent cart, honest checkout, account/admin surfaces
- [ ] Add sitemap.xml and verify HTTP 200
- [ ] Final mobile, accessibility, asset, metadata, navigation, and brand smoke test
- [ ] Publish and report shipped, rolled, blockers, commit, URL, and credits

### R0.9 measured contrast
Body/input text and outline badges use foreground; muted text and inactive navigation use muted-foreground; links and active navigation use primary; prices use price. Default badges and primary buttons use primary-foreground on primary; secondary badges/buttons use secondary-foreground on secondary. Glass values are composited over the page background. Values measure token pairs, not disabled opacity or image overlays.

| Foreground token | Background token | Ratio | AA normal text |
| --- | --- | ---: | --- |
| foreground | background | 17.94:1 | Pass |
| foreground | card | 17.09:1 | Pass |
| foreground | panel | 17.09:1 | Pass |
| foreground | popover | 16.45:1 | Pass |
| foreground | secondary | 15.41:1 | Pass |
| foreground | muted | 15.41:1 | Pass |
| foreground | glass-bg | 16.82:1 | Pass |
| muted-foreground | background | 8.78:1 | Pass |
| muted-foreground | card | 8.36:1 | Pass |
| muted-foreground | panel | 8.36:1 | Pass |
| muted-foreground | popover | 8.05:1 | Pass |
| muted-foreground | secondary | 7.54:1 | Pass |
| muted-foreground | muted | 7.54:1 | Pass |
| muted-foreground | glass-bg | 8.23:1 | Pass |
| primary | background | 14.03:1 | Pass |
| primary | card | 13.36:1 | Pass |
| primary | panel | 13.36:1 | Pass |
| primary | popover | 12.87:1 | Pass |
| primary | secondary | 12.05:1 | Pass |
| primary | muted | 12.05:1 | Pass |
| primary | glass-bg | 13.15:1 | Pass |
| price | background | 15.68:1 | Pass |
| price | card | 14.94:1 | Pass |
| price | panel | 14.94:1 | Pass |
| price | popover | 14.38:1 | Pass |
| price | secondary | 13.47:1 | Pass |
| price | muted | 13.47:1 | Pass |
| price | glass-bg | 14.70:1 | Pass |
| success | background | 12.21:1 | Pass |
| success | card | 11.63:1 | Pass |
| success | panel | 11.63:1 | Pass |
| success | popover | 11.20:1 | Pass |
| success | secondary | 10.49:1 | Pass |
| success | muted | 10.49:1 | Pass |
| success | glass-bg | 11.45:1 | Pass |
| warn | background | 11.32:1 | Pass |
| warn | card | 10.79:1 | Pass |
| warn | panel | 10.79:1 | Pass |
| warn | popover | 10.39:1 | Pass |
| warn | secondary | 9.73:1 | Pass |
| warn | muted | 9.73:1 | Pass |
| warn | glass-bg | 10.62:1 | Pass |
| deal | background | 6.28:1 | Pass |
| deal | card | 5.99:1 | Pass |
| deal | panel | 5.99:1 | Pass |
| deal | popover | 5.76:1 | Pass |
| deal | secondary | 5.40:1 | Pass |
| deal | muted | 5.40:1 | Pass |
| deal | glass-bg | 5.89:1 | Pass |
| destructive | background | 5.40:1 | Pass |
| destructive | card | 5.14:1 | Pass |
| destructive | panel | 5.14:1 | Pass |
| destructive | popover | 4.95:1 | Pass |
| destructive | secondary | 4.64:1 | Pass |
| destructive | muted | 4.64:1 | Pass |
| destructive | glass-bg | 5.06:1 | Pass |
| primary-foreground | primary | 14.03:1 | Pass |
| secondary-foreground | secondary | 15.41:1 | Pass |
| accent-foreground | accent | 12.09:1 | Pass |
| destructive-foreground | destructive | 4.66:1 | Pass |

## 24 Oct run
- [x] F2-check: typecheck green, no changes needed
- [x] F4: footer Shop links and blurb (Deals link waits for D2)
- [x] burn-test marker added to __root.tsx as a JSX comment
- [ ] F7 onward still open

## 25 Oct ordered pack (starting head f4364c73)
- [x] F2-check: editor and mounting unchanged; automatic validation reports build OK. Revision 440f101. Manual builds/typechecks and custom Git commits are managed by Lovable, not shell commands.
- [x] F3: dropped; final Matrix header preserved.
- [x] F4: existing footer already has the requested Shop links except Deals, which waits for D2. Preserve the developer's final Nepal and Australia blurb instead of replacing it with older Nepal-only wording.
- [ ] F7 onward: next ordered work. Preserve the developer's Nepal and Australia copy where older task wording conflicts.
- [x] F7: added display labels, category mapping, duration and discount helpers; four focused tests pass and automatic validation reports build OK. Revision e20fb7b. These helpers do not change displayed prices or catalog data.
- [x] F11: client-only publication safeguards and Drafts filter added; three focused tests pass, automatic validation reports build OK; revision 852b129. No server changes. Signed-in admin UI check blocked: session minting found no matching account for the requester; do not modify real listing data just to test.
- [x] F13 (partial): software/subscriptions show existing delivery method and timing in labelled rows; empty values and placeholder timing suppressed. Duration omitted because getProductBySlug has no duration field. Automatic build OK, revision 12687ea. Existing game product checked at 390px and desktop with no overflow; software/subscription branch not verified with populated live data. Netflix listing data untouched.
- [x] F14: dropped; final Matrix option tiles and stepped flow preserved.
- [x] F16: skipped conflict with final 339da6e7 single footer security notice and listing-specific refunds tab. Do not duplicate the notice or invent an unconditional refund promise.
- [x] F17: dropped; final Matrix product tiles preserved.
- [x] F18: skipped; product-help.ts is explicitly protected and prepaid renewal terms cannot be invented without listing data.
- [ ] F20 onward, D2/D3, P/S, numbered, U and G items remain open in strict order.
- [ ] F20: preserved developer's final five-step icon layout; added required-details rows, payment fallback and transaction reference guidance, activation/tracking links and matching WebPage description. Validation pending. Existing delivery promises unchanged.

## 26 Oct ordered pack
- [x] Prior F2-check, F3/F4, F7, F11 and F14/F17 preserved; F16/F18 remain skipped for the documented conflicts.
- [x] F13: duration remains unavailable in the existing returned fields; omit it instead of changing server data. Prior delivery rows preserved.
- [x] F20: existing required-details rows, payment fallback, screenshot/reference guidance and tracking link verified at 390px and desktop without overflow. Automatic build OK; prior five-step design preserved. Revision 5862e9f.
- [ ] F21 onward in the requested order. Preserve Sentry in protected router.tsx and all final developer changes.
- [x] F21: existing description under heading preserved; empty category now invites a support request; other published categories use existing catalog data in sort_order, plus FAQ. Deals link deferred until D2 creates its route; no premature link or protected redesign. Automatic build OK, revision 2d1df76. Subscriptions navigation checked at 390px and desktop without overflow. Software currently unavailable as a public category, so its empty state was not verified against live data.
- [x] F22: categories and products indexes explicitly use sort_order and show the live published-product count next to category names. Existing product tiles and hidden prices unchanged. Automatic build OK, revision 8ca3f9a; live counts verified (4 game top-ups, 2 gift cards, 1 subscription) at 390px and desktop without overflow.
- [x] F23: additive type controls in the requested order, using existing category slugs and URL updates. Brand and tags already participate in search, preserved without touching listings or price visibility. Automatic build OK after matching the existing Button variants, revision 3565167. Real subscription filtering and reset verified at 390px and desktop without overflow.
- [x] F24: requested software/subscriptions title and description applied to homepage head and matching social tags only. Nepal/Australia visible copy, carousel, layout and JSON-LD unchanged. Automatic build OK, revision 1ea3ac9; exact title and descriptions verified in server-rendered HTML.
- [x] F25: dropped as requested; existing Matrix home rails preserved.
- [x] F26 partial: home FAQs now cover payment, delivery timing, delivery location, renewal and activation help without WhatsApp ordering language. Unconditional prepaid renewal claim omitted without listing evidence. Organization/WebSite relocation deferred to avoid undoing final developer JSON-LD and touching protected root code. Validation pending.
- [ ] Next: F27-F30, D2/D3, P8/P12/P15, S3/S4/S6/S7, numbered items, U2-U22 and G1-G6. F21 Deals link waits for D2; F13 duration waits for existing product data. Custom commit labels remain platform-managed.

## 27 Oct ordered pack (starting head 55f1f6c5)
- [x] F27: helpful FAQ wording and QR/bank payment, missing-details fallback, screenshot/reference verification. FAQPage continues to derive directly from the visible answers. Icons, manifest links, Sentry, checkout and cart untouched. Automatic build OK; payment accordion and matching schema checked at 390px and desktop without overflow or browser errors. Revision f51f601; publishing requested, not yet confirmed.
- [ ] F28-F30, D2/D3, P/S, numbered, U and G remain in strict order.
- Custom Git operations are unavailable: revisions and commit messages are managed by Lovable.
- [x] D3: selected option reads the validated optional plan SKU; unknown SKUs fall back to the existing default. Option changes replace the URL without touching cart or checkout. Real option selection survived reload at 390px. Initial required-search typing corrected without editing protected callers; final automatic build pending.
- [x] D2: added UI-only Deals route with requested empty state, existing Software/Subscriptions destinations, unique metadata, canonical and matching breadcrumbs. No sale prices or records invented. Automatic build OK, revision 04b449c; HTTP 200 and phone/desktop checks pass without overflow. Earlier Deals links remain follow-up work.
- [x] F30 partial: empty/whitespace SEO title falls back to the product name plus price in Nepal, consistently across title and social titles. Existing product image and price hiding untouched. Category image fallback skipped because sharing tags must match the image actually shown, not a different category cover. Automatic build OK, revision 4ef799f; existing Free Fire title preserved consistently in rendered title/OG/Twitter. Empty-title branch not exercised against a real listing; no catalog records changed.
- [x] F29: added product-type delivery/refund sections in store priority order and matching WebPage descriptions. Only listing-specific replacement periods referenced, no durations invented. Existing cancellation/full-refund terms preserved. Automatic build OK, revision 2d03bc0; both pages return 200 and have ordered headings at 390px and desktop without overflow.
- [x] F28 partial: What we sell now lists software, subscriptions, deals, gift cards and game top-ups in order, using existing destinations. Deals remains unlinked until D2 creates its route; software uses the catalog filter because the public category is unavailable. No customer counts or business credentials invented. Automatic build OK, revision 0f54009; list and Software link checked at 390px and desktop without overflow.
