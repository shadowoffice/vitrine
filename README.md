# Vitrine

Vitrine is the public Fichero website for `https://fichero.cloud`.

It presents the ProJD construction ERP offer, explains the Fondation SaaS
control plane, exposes pricing, links to the public ERP demo, and routes
purchase intent into Fondation through server-side intake and checkout routes.

## Project Snapshot

- Framework: Next.js App Router, React, TypeScript and plain CSS.
- Runtime: Node.js server routes plus static public pages.
- Public domain: `https://fichero.cloud`.
- Docker service: `fichero-vitrine`.
- Local exposed port: `3103`.
- Fondation bridge: token-gated server-to-server calls to Fondation public
  order and checkout endpoints.

Vitrine is intentionally separate from Fondation and ProJD:

- Vitrine owns the public website, pricing pages and purchase form.
- Fondation owns customers, tenants, billing, licenses, DNS/TLS, runtime and
  audit.
- ProJD owns the tenant ERP product.

## Current Status

The project has moved beyond a simple landing page. The current branch contains
the public Fichero purchase flow and supporting docs.

Implemented:

- home page with Fichero/Fondation/ProJD positioning;
- product pages for ProJD and Fondation;
- modules, pricing, status and demo pages;
- `/commander` purchase form with plan, seat count, subdomain and provider
  selection;
- `/api/checkout` server route for provider checkout creation through
  Fondation;
- `/api/checkout/capture` PayPal return capture handoff;
- `/api/erp-orders` fallback order intake route;
- `/paiement/retour` payment-return page;
- first-party no-cookie analytics endpoint;
- Docker Compose deployment to port `3103`;
- repo-local `AGENTS.md` and `OPENCLAW.md`.

Remaining production gate:

- Real Stripe/PayPal provider validation must happen in Fondation before the
  public purchase flow is considered fully live.

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
- `/fondation`
- `/modules`
- `/tarifs`
- `/commander`
- `/demo`
- `/statut`
- `/paiement/retour`

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

Do not expose the Fondation intake token through `NEXT_PUBLIC_*` variables.

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

- missing Fondation environment values;
- invalid purchase form data;
- Fondation returning a non-2xx response;
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
3. Vitrine calls Fondation from a server route with the private intake token;
4. Fondation creates the customer/tenant preparation record and provider
   checkout session;
5. Vitrine redirects to the provider checkout URL returned by Fondation;
6. Fondation reconciles payment through provider webhook or PayPal capture.

Vitrine must never activate a subscription, invoice, license, tenant or ERP
runtime directly.
