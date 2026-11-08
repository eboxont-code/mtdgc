# MTDGC Brand Architecture

**Status:** Internal brand-architecture reference  
**Reviewed:** 9 November 2026  
**Scope:** Current Matrix Digital Goods & Commerce identity and the product families shown by MTDGC.

This document defines the existing name and catalogue hierarchy. It does not create a new legal entity, approve a new market, decide the commercial model, approve a supplier, or authorise new customer-facing claims.

## 1. Brand hierarchy

```text
Matrix
└── Matrix Digital Goods & Commerce (MTDGC)
    ├── Game Top-Ups
    ├── Gift Cards
    ├── Subscriptions
    └── Software
```

- **Matrix** is the umbrella brand element in the current name. This is a brand-identity description only; it is not evidence of a holding company, group structure, registered entity, or legal trading name.
- **Matrix Digital Goods & Commerce** is the canonical full brand name.
- **MTDGC** is the short form used for the digital-commerce storefront and project. It is not a separate company or a second sub-brand.
- The four product families below are catalogue categories under the same MTDGC identity. They are not separate brands, legal entities, or independently endorsed businesses.

Use **Matrix Digital Goods & Commerce (MTDGC)** on first formal mention, then **MTDGC**. Use **Matrix** alone only as the umbrella brand element where that distinction is genuinely useful; do not invent a “Matrix Group” or other corporate structure.

## 2. Product-family roles

| Catalogue family | Role within MTDGC | Boundary |
|---|---|---|
| **Game Top-Ups** | Digital game credits, currency and passes delivered through the exact player identifiers required by an eligible listing. | This is not an account-sale or account-access service. Never request a game password, OTP, recovery code or unnecessary account access. |
| **Gift Cards** | Issuer-specific digital gift cards and wallet codes, with denomination and redemption region stated for each eligible listing. | An issuer's code is not an MTDGC-issued product. A region label is not proof of compatibility, and this family must not be presented as remittance, cash-out or a general-purpose wallet. |
| **Subscriptions** | Digital subscription plans whose duration, renewal behaviour, account ownership, seat/household limits, region and delivery method are explained for the exact listing. | Do not imply shared/private account terms, renewal behaviour or customer control that have not been verified. A temporarily unavailable listing is not an approved offer. |
| **Software** | Software licences, keys or activation products only when the exact source, resale rights, region, device and activation conditions are evidenced. | Do not describe a product as genuine, authorised or officially distributed without evidence. Coming-soon listings are not approved supply. |

The category name describes the type of digital product, not its supplier, issuer, resale authority, availability, price or delivery guarantee.

## 3. Deals and future categories

- **Deals** is a merchandising or promotional collection, not a fifth product family or a sub-brand. The repository instructions keep the Deals route as a UI-only empty state until real sale data exists. Never infer a discount from a normal catalogue price or invent a promotion.
- AI tools, cloud services, mobile products and business services are possible future catalogue families mentioned in the strategy. They are not current launch promises and must not be presented as active products until the relevant sourcing, commercial, product and launch gates pass.
- A future family may be added under MTDGC without creating a separate brand. A new sub-brand, logo, domain or social identity requires an explicit owner decision.

## 4. Market journeys are not brands

The master plan separates three possible purchase journeys:

1. **Nepal domestic:** the first operating-stability priority, with NPR pricing.
2. **Australia buyer to Nepal recipient:** a separate future gifting journey with its own payer, recipient, payment and delivery requirements.
3. **Australia domestic:** a separate future market that remains gated on sourcing, AUD settlement, legal/tax, refund and support readiness.

These are market and checkout journeys, not separate brands or category names. Do not create “MTDGC Nepal”, “MTDGC Australia” or other market sub-brands merely to represent a different payer or recipient location.

The current public site contains Nepal-and-Australia positioning while the Terms describe sales to customers in Nepal. This document does not resolve that discrepancy. The supported-market decision remains with MT-0002 and MT-0202 and must not be changed through brand wording alone.

## 5. Third-party issuer and supplier names

Publisher, platform, software-vendor, gift-card issuer and supplier names identify the product or source being discussed. They are not MTDGC sub-brands and do not imply sponsorship, partnership, endorsement, official distribution or authorised-reseller status.

Use a third-party name only to identify the relevant product, subject to its naming rules. Make no affiliation or resale-authority claim unless the exact supplier/product/region scope has current evidence in the Supplier Register.

The Supplier Register currently has no verified supplier identity or approved product-scope records. Catalogue presence, a product logo, a price, a “Global” label or an available status does not create supplier approval.

## 6. Naming and presentation rules

1. Keep one Matrix / MTDGC brand identity across the current catalogue.
2. Use the canonical full name **Matrix Digital Goods & Commerce** and short form **MTDGC** consistently.
3. Keep the category labels **Game Top-Ups**, **Gift Cards**, **Subscriptions** and **Software**. Do not rename published URL slugs as part of this task.
4. Treat Deals as a collection, not a category or brand.
5. Do not create category-specific logos, legal names, domains, social accounts or sub-brands without owner approval.
6. Do not use “official”, “authorised reseller”, “issuer”, “publisher”, “global”, “available everywhere” or similar claims unless the exact claim is source-backed.
7. Do not use brand architecture to imply that MTDGC is a marketplace, payment intermediary, wallet, remittance service, issuer or registered corporate group. The marketplace-versus-single-operator decision remains MT-0010.
8. Do not change Terms, Privacy, Refund, Delivery or public market-positioning copy under this document. Those changes have separate owner and qualified-review gates.

## 7. Decisions deliberately left open

This architecture does **not** decide:

- The legal seller, registered entity, trading name, jurisdiction or invoice issuer (MT-0017 and the market/legal tasks).
- Whether the business model is marketplace-style or a curated single-operator store (MT-0010).
- Whether Australia is an active supported market or when the Australia-to-Nepal route launches (MT-0002, MT-0202 and the market launch gates).
- Which suppliers or issuers are authorised, which SKUs are orderable, or what prices and margins apply.
- Product-specific delivery promises, support hours, refund interpretation or service-level guarantees.
- Whether a future product family deserves a separate brand.

Those decisions require the owner, supplier/issuer evidence or qualified professional review where the master plan says so.

## 8. Evidence used

This definition is limited to the current repository strategy, catalogue taxonomy and public identity:

- [README and project direction](README.md)
- [Canonical MTDGC Master Plan](MTDGC_MASTER_PLAN.md)
- [Repository working rules](AGENTS.md)
- [Supplier Register](SUPPLIER_REGISTER.md)
- [Public About page](https://mtdgc.com/about)
- [Public catalogue](https://mtdgc.com/catalog)
- [Public Terms](https://mtdgc.com/policies/terms)

The current About page uses “Matrix Digital Goods and Commerce” and describes game top-ups, digital gift cards and subscriptions, with software and other services subject to sourcing. The public catalogue groups listings under Game Top-Ups, Gift Cards, Subscriptions and Software. The Terms currently describe sales to customers in Nepal. The repository's canonical plan remains the authority for project priorities and launch gates.

## 9. Acceptance checks

- One umbrella identity and one MTDGC storefront are defined.
- Each current product family has a bounded role.
- Deals is kept separate from the product taxonomy.
- Market journeys are kept separate from brand identities.
- Supplier/issuer names are not treated as MTDGC sub-brands or proof of authority.
- Legal entity, commercial model, market activation, supplier approval and customer promises remain explicitly outside this decision.

**Task result:** MT-0009 is complete as a current-state brand architecture definition. No public copy, product data, supplier status, legal entity, domain, logo or production setting was changed.
