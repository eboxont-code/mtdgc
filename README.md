# MTDGC

**Matrix Digital Goods & Commerce** is a digital-goods storefront for game top-ups, gift cards, subscriptions and software. The product strategy is to operate one brand with clearly separated purchase routes and honest region, availability and delivery information.

**Live website:** https://mtdgc.com  
**Live app preview:** https://mtdgc.lovable.app

## Product and market direction

1. Stabilise the Nepal domestic order, payment-verification and fulfilment journey first.
2. Design and validate Australia-paid gifting for Nepal recipients as a separate journey.
3. Enable Australia-local products only after sourcing, AUD settlement, legal, tax, refund and support requirements are independently verified.

A product must not become orderable until its supplier, resale rights, region, variant, price, margin, delivery method and refund handling are documented and a test order passes. Coming-soon products must remain out of checkout. Never claim instant delivery, authorised-reseller status or product compatibility without evidence.

## Project planning

- [MTDGC Master Plan](./MTDGC_MASTER_PLAN.md) — canonical strategy, workstreams, status register, launch gates, risks and next actions.
- [Supplier Register](./SUPPLIER_REGISTER.md) — internal supplier identity, source, authorisation, product-scope and fulfilment due diligence register.
- [Roadmap history](./roadmap.md) — dated implementation notes and verification records; the Master Plan is authoritative for current task status.
- [Data architecture](./MTDGC_DATA_ARCHITECTURE.md) — current order, payment, identity and access-control design.
- [Sensitive admin change audit](./MTDGC_ADMIN_CHANGE_AUDIT.md) — current actor, timestamp and reason coverage, plus the remaining audit-log gaps.
- [Repository working rules](./AGENTS.md) — Lovable sync and code-boundary guidance.

Read the Master Plan before starting work. Update it with evidence when a task changes status. Do not maintain a competing TODO list.

## Development

The repository uses Bun and the committed `bun.lock` lockfile.

```sh
bun install --frozen-lockfile
cp .env.example .env
bun run dev
```

Available package scripts:

```sh
bun run build
bun run lint
```

Focused rule tests live under `src/lib/*.test.ts`. Run `bun run test` and `bun run typecheck` locally. The free GitHub Actions quality workflow at `.github/workflows/quality.yml` runs install, lint, tests, typecheck and production build for pushes to `main` and pull requests.

### Environment variables

Copy `.env.example` to `.env` and populate only local values. Keep real `.env` files untracked. The service-role key and migration connection string are server/developer-only secrets and must never use a `VITE_` prefix or enter browser code.

Production environment values are configured in the deployment environment. Never commit credentials, access tokens, database URLs or service-role keys.

## Release and database safety

- Do not merge or deploy the held backend migration branch before the documented move to Boxont-controlled Supabase is complete.
- Back up and verify the target database, auth settings, storage, RLS, grants, functions and migration history before cutover.
- Do not run migrations against the existing project simply to make the held branch build.
- Test payment verification, order tracking, support and manual fulfilment before advertising new product or market routes.
- Preserve a $0 additional-spend preference. **Ask for explicit approval before any action that could create a charge.**
