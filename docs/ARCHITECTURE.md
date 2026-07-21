# Vitrine Architecture

## Boundary

Vitrine is the public ProJD website. It owns marketing pages, pricing
presentation, purchase intent and safe server-side handoff. It does not own
provider billing state, subscriptions, licenses, DNS/TLS or ERP runtime
provisioning.

Project split:

- Vitrine: public pages, pricing, purchase form and server-side handoff.
- Internal provider bridge: customer preparation, checkout authority and
  payment reconciliation.
- ProJD: ERP runtime and business application.

## App Structure

Public pages live in `src/app`:

- `page.tsx` - ProJD sales home page
- `projd/page.tsx` - ERP product page
- `modules/page.tsx` - modules overview
- `tarifs/page.tsx` - pricing
- `commander/page.tsx` - purchase form
- `demo/page.tsx` - external ProJD demo entry
- `statut/page.tsx` - public status links
- `paiement/retour/page.tsx` - checkout return page
- `fondation/page.tsx` - legacy redirect to `/projd`

Reusable UI:

- `src/app/_components/SiteHeader.tsx`
- `src/app/_components/MarketingCta.tsx`
- `src/app/_components/ProductShowcaseSlider.tsx`
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
| `/api/erp-orders` | Token-gated order intake handoff with local JSONL fallback. |
| `/api/checkout` | Creates provider checkout through the internal bridge. |
| `/api/checkout/capture` | PayPal return capture handoff. |
| `/healthz` | Runtime health check. |

All routes that call the provider bridge run on the server and use server-only
environment variables.

## Purchase Flow

1. Visitor opens `/commander`.
2. Client component validates interaction state and submits to `/api/checkout`.
3. `/api/checkout` validates with `erpOrderSchema`.
4. It builds the pricing cart from `src/lib/pricing.ts`.
5. It calls the internal checkout endpoint with the shared token.
6. The bridge returns a provider checkout URL.
7. Vitrine redirects the browser to Stripe or PayPal.
8. Payment completion is reconciled outside Vitrine.

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

Security rule: never move internal checkout tokens into `NEXT_PUBLIC_*`.

## Docker Runtime

Docker Compose:

- builds the Next.js app;
- exposes host port `3103`;
- mounts `./data` into `/app/data`;
- joins the internal network needed by the checkout/order bridge when
  configured that way.

Production edge routing lives outside this repo in Nginx Proxy Manager.

## Failure Behavior

Expected safe failures:

- Missing checkout env -> `/api/checkout` returns 503.
- Invalid form data -> 400 with safe validation message.
- Provider bridge failure -> 422 with safe error.
- Order intake unavailable -> `/api/erp-orders` stores JSONL backup if the
  local inbox path is writable.
- Local inbox unavailable -> 500 with no fake order success.

Never display provider secrets, tokens or raw stack traces to the visitor.
