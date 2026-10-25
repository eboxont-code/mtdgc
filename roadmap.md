# MTDGC launch roadmap

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
