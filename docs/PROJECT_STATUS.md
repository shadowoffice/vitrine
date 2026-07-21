# Vitrine Project Status

Last updated: 2026-07-20 America/Toronto.

## Executive Summary

Vitrine is the public Fichero website at `https://fichero.cloud`. It now acts as
the front door for the ProJD ERP offer instead of a static landing page. It
explains the product split, shows pricing, links to the public ERP demo and
starts purchase intent through Fondation.

The current PR is draft PR #1:

```text
https://github.com/shadowoffice/vitrine/pull/1
```

## Current State

| Area | Status | Notes |
| --- | --- | --- |
| Public home page | done | Fichero/Fondation/ProJD positioning and primary CTAs exist. |
| Product pages | done | `/projd`, `/fondation`, `/modules`, `/tarifs`, `/demo`, `/statut`. |
| Purchase form | done | `/commander` collects company, contact, plan, seats, subdomain and provider. |
| Pricing catalog | done | Shared pricing module has starter/croissance/plateforme plans. |
| Stripe handoff | code ready | `/api/checkout` asks Fondation to create provider checkout. |
| PayPal handoff | partial | Checkout and return capture route exist; real PayPal provider validation happens in Fondation. |
| Local fallback intake | done | `/api/erp-orders` can write JSONL backup when Fondation intake is unavailable. |
| Analytics | basic | First-party no-cookie endpoint exists. No dashboard yet. |
| Deployment | deployed previously | Docker service `fichero-vitrine` runs on port `3103`; NPM routes `fichero.cloud` to it. |
| Documentation | improving | README, `AGENTS.md`, `OPENCLAW.md` and status docs now exist. |

## Current PR Contents

Branch:

```text
feat/vitrine-public-purchase-flow
```

Commit:

```text
8f08062 feat: add Fichero public purchase flow
```

Scope:

- public pages and SEO metadata;
- reusable header, CTA, ERP preview and analytics components;
- pricing and order schemas;
- `/commander` purchase form;
- `/api/checkout` and `/api/checkout/capture`;
- `/api/erp-orders` fallback intake;
- Docker Compose Fondation integration environment;
- repo-local agent and OpenClaw workflow docs.

## Latest Validation

```bash
npm run lint
npm run typecheck
npm run build
git diff --check
```

Latest build generated static/dynamic routes for:

- `/`
- `/commander`
- `/demo`
- `/fondation`
- `/modules`
- `/paiement/retour`
- `/projd`
- `/statut`
- `/tarifs`
- `/api/analytics`
- `/api/checkout`
- `/api/checkout/capture`
- `/api/erp-orders`
- `/healthz`

## Known Blockers

Vitrine can collect and submit purchase intent, but the real payment flow is
only complete after Fondation provider validation is complete.

Blocked by Fondation provider secrets:

- Stripe secret key
- Stripe webhook secret
- PayPal client ID
- PayPal client secret
- PayPal webhook ID

## Next Recommended Work

1. Merge and deploy PR #1.
2. Smoke `https://fichero.cloud/commander` after deploy.
3. Configure Fondation provider secrets and webhooks.
4. Run a real sandbox purchase from Vitrine through Fondation.
5. Add a small operator-facing analytics/status report for orders and failed
   checkout attempts.
6. Add final product screenshots or generated visual assets once the ERP demo
   content is stable.
