# Vitrine Architecture

## Boundary

Vitrine is the public website. It does not own customers, tenants, provider
billing state, subscriptions, licenses, DNS/TLS or runtime provisioning.

Project split:

- Vitrine: public pages, pricing, purchase form and server-side handoff.
- Fondation: SaaS control plane and provider checkout authority.
- ProJD: tenant ERP runtime and business application.

## App Structure

Public pages live in `src/app`:

- `page.tsx` - home page
- `projd/page.tsx` - ERP product page
- `fondation/page.tsx` - SaaS control plane page
- `modules/page.tsx` - modules overview
- `tarifs/page.tsx` - pricing
- `commander/page.tsx` - purchase form
- `demo/page.tsx` - external ProJD demo entry
- `statut/page.tsx` - public status links
- `paiement/retour/page.tsx` - checkout return page

Reusable UI:

- `src/app/_components/SiteHeader.tsx`
- `src/app/_components/MarketingCta.tsx`
- `src/app/_components/ErpPreview.tsx`
- `src/app/_components/PrivacyAnalytics.tsx`

Shared content and schemas:

- `src/lib/site-content.ts`
- `src/lib/pricing.ts`
- `src/lib/erp-order.ts`

## Server Routes

| Route | Purpose |
| --- | --- |
| `/api/analytics` | No-cookie first-party analytics event capture. |
| `/api/erp-orders` | Token-gated Fondation intake handoff with local JSONL fallback. |
| `/api/checkout` | Creates provider checkout through Fondation. |
| `/api/checkout/capture` | PayPal return capture handoff to Fondation. |
| `/healthz` | Runtime health check. |

All routes that call Fondation run on the server and use server-only
environment variables.

## Purchase Flow

1. Visitor opens `/commander`.
2. Client component validates interaction state and submits to `/api/checkout`.
3. `/api/checkout` validates with `erpOrderSchema`.
4. It builds the pricing cart from `src/lib/pricing.ts`.
5. It calls Fondation `checkout-sessions` endpoint with the shared token.
6. Fondation returns a provider checkout URL.
7. Vitrine redirects the browser to Stripe or PayPal.
8. Payment completion is reconciled in Fondation, not Vitrine.

Fallback route `/api/erp-orders` exists for non-provider order intake and local
backup. It must not be treated as payment confirmation.

## Environment

Server-only:

- `FONDATION_ORDER_INTAKE_URL`
- `FONDATION_CHECKOUT_URL`
- `FONDATION_CHECKOUT_CAPTURE_URL`
- `FONDATION_ORDER_INTAKE_TOKEN`
- `VITRINE_ORDER_INBOX_PATH`

Browser-safe:

- `NEXT_PUBLIC_SITE_URL`

Security rule: never move Fondation tokens into `NEXT_PUBLIC_*`.

## Docker Runtime

Docker Compose:

- builds the Next.js app;
- exposes host port `3103`;
- mounts `./data` into `/app/data`;
- joins `fondation_default` so server routes can reach Fondation internally
  when configured that way.

Production edge routing lives outside this repo in Nginx Proxy Manager.

## Failure Behavior

Expected safe failures:

- Missing Fondation checkout env -> `/api/checkout` returns 503.
- Invalid form data -> 400 with safe validation message.
- Fondation provider failure -> 422 with safe error.
- Fondation intake unavailable -> `/api/erp-orders` stores JSONL backup if the
  local inbox path is writable.
- Local inbox unavailable -> 500 with no fake order success.

Never display provider secrets, tokens or raw stack traces to the visitor.
