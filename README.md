# Vitrine ProJD

Vitrine is the public sales website for the ProJD construction ERP at
`https://fichero.cloud`.

The public positioning is now focused on ProJD only: projects, budgets, BID,
documents, invoices, partners, reporting, pricing and purchase intent. Internal
activation and payment services stay behind server routes and are not part of
the marketing story.

## Project Snapshot

- Framework: Next.js App Router, React, TypeScript and plain CSS.
- Runtime: public pages plus Node.js server routes.
- Public domain: `https://fichero.cloud`.
- Docker service: `fichero-vitrine`.
- Local exposed port: `3103`.
- Internal bridge: token-gated server-to-server calls for order intake and
  provider checkout.

## Current Status

Implemented:

- professional ProJD sales home page with construction-site visual direction;
- product slider for budgets, BID, invoices and documents;
- dedicated module detail pages under `/modules/[slug]`;
- pages for `/projd`, `/modules`, `/tarifs`, `/demo`, `/statut` and
  `/commander`;
- legacy `/fondation` route redirected to `/projd`;
- reusable header, CTA, ERP preview and analytics components;
- `/commander` purchase form with plan, seat count, desired ERP subdomain and
  payment provider selection;
- `/api/checkout` server route for provider checkout creation;
- `/api/checkout/capture` PayPal return capture handoff;
- `/api/erp-orders` fallback order intake route;
- `/paiement/retour` payment-return page;
- first-party no-cookie analytics endpoint;
- Docker Compose deployment to port `3103`;
- repo-local `AGENTS.md` and `OPENCLAW.md`.

Remaining production gate:

- real Stripe/PayPal provider validation, webhook signatures and sandbox smoke
  tests must pass before the public purchase flow is considered fully live.

## Documentation

- `docs/PROJECT_STATUS.md` - current state, validation and blockers.
- `docs/ARCHITECTURE.md` - routes, data flow, environment and safety model.
- `docs/ROADMAP.md` - next work for public site and purchase flow.
- `AGENTS.md` - agent rules for working in this repository.
- `OPENCLAW.md` - branch, PR, validation and deployment workflow.

## Routes

Public pages:

- `/`
- `/projd`
- `/modules`
- `/modules/projets`
- `/modules/budgets`
- `/modules/estimation-bid`
- `/modules/documents`
- `/modules/factures-ocr`
- `/modules/partenaires`
- `/modules/rapports`
- `/modules/integrations`
- `/tarifs`
- `/commander`
- `/demo`
- `/statut`
- `/paiement/retour`

Redirect:

- `/fondation` -> `/projd`

Server routes:

- `/api/analytics`
- `/api/erp-orders`
- `/api/checkout`
- `/api/checkout/capture`
- `/healthz`
- `/robots.txt`
- `/sitemap.xml`

## Environment

Server-only values:

- `FONDATION_ORDER_INTAKE_URL`
- `FONDATION_CHECKOUT_URL`
- `FONDATION_CHECKOUT_CAPTURE_URL`
- `FONDATION_ORDER_INTAKE_TOKEN`
- `VITRINE_ORDER_INBOX_PATH`

Browser-safe values:

- `NEXT_PUBLIC_SITE_URL`

The `FONDATION_*` names are internal deployment configuration. Do not expose the
private intake token through `NEXT_PUBLIC_*` variables or public page content.

## Local Development

Install dependencies:

```bash
npm install
```

Run the local dev server:

```bash
npm run dev
```

Default local URL:

```text
http://localhost:3000
```

## Validation

Run before opening or updating a PR:

```bash
npm run lint
npm run typecheck
npm run build
git diff --check
```

When checkout/order behavior changes, also test:

- missing internal checkout environment values;
- invalid purchase form data;
- provider bridge returning a non-2xx response;
- Stripe return URL shape;
- PayPal capture route failure.

## Docker

Build and start:

```bash
docker compose up -d --build
docker compose ps
curl -fsS http://127.0.0.1:3103/healthz
```

Production routing is handled by Nginx Proxy Manager on TrueNAS:

```text
fichero.cloud -> http://192.168.0.19:3103
```

Public smoke:

```bash
curl -fsSI https://fichero.cloud | sed -n '1,12p'
curl -fsS https://fichero.cloud/healthz
```

## Checkout Safety

Vitrine does not complete purchases by itself.

The safe flow is:

1. visitor submits `/commander`;
2. Vitrine validates the payload;
3. Vitrine calls the internal checkout/order endpoint from a server route with
   the private intake token;
4. the internal service creates the preparation record and provider checkout
   session;
5. Vitrine redirects to the provider checkout URL returned by that service;
6. payment completion is reconciled by provider webhooks or PayPal capture.

Vitrine must never activate a subscription, invoice, license or ERP runtime
directly.
