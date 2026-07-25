# Vitrine Project Status

Last updated: 2026-07-21 America/Toronto.

## Executive Summary

Vitrine is the public website at `https://fichero.cloud`. Its public role is to
sell the ProJD construction ERP, show a credible product experience, present
pricing and start purchase intent.

The current branch is:

```text
feat/projd-sales-vitrine
```

## Current State

| Area | Status | Notes |
| --- | --- | --- |
| Public home page | redesigned | Shorter ProJD-only sales page with construction-site visual direction. |
| Product pages | updated | `/projd`, `/modules`, `/modules/[slug]`, `/tarifs`, `/demo`, `/statut` and `/commander`. |
| Legacy route | redirected | `/fondation` now redirects to `/projd`. |
| Purchase form | done | `/commander` collects company, contact, plan, seats, subdomain and provider. |
| Pricing catalog | done | Shared pricing module has starter/croissance/plateforme plans. |
| Stripe handoff | code ready | `/api/checkout` asks the internal provider bridge to create checkout. |
| PayPal handoff | partial | Checkout and return capture route exist; real provider validation remains. |
| Local fallback intake | done | `/api/erp-orders` can write JSONL backup when the provider bridge is unavailable. |
| Analytics | basic | First-party no-cookie endpoint exists. No dashboard yet. |
| Deployment | deployed previously | Docker service `fichero-vitrine` runs on port `3103`; NPM routes `fichero.cloud` to it. |
| Documentation | updated | README, project status, architecture and roadmap align with ProJD sales positioning. |

## Current Branch Contents

Scope:

- ProJD sales home page;
- construction-site hero, simplified home page and professional slider;
- dedicated detail pages for each ProJD module;
- updated public copy across product, modules, pricing, status, order and
  payment-return pages;
- public removal of the old platform-control-plane message;
- reusable slider component;
- refreshed README and docs;
- sitemap removal for the legacy platform page.

## Validation

Run before opening or updating a PR:

```bash
npm run lint
npm run typecheck
npm run build
git diff --check
```

Recommended visual smoke:

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
- `/statut`
- `/sitemap.xml`

## Known Blockers

Vitrine can collect and submit purchase intent, but the real payment flow is
only complete after provider validation is complete.

Blocked by provider configuration:

- Stripe secret key
- Stripe webhook secret
- PayPal client ID
- PayPal client secret
- PayPal webhook ID

## Next Recommended Work

1. Review and merge the ProJD sales redesign PR.
2. Rebuild and redeploy `fichero-vitrine`.
3. Smoke `https://fichero.cloud/`, `/commander`, `/tarifs` and `/healthz`.
4. Configure provider secrets and webhooks.
5. Run a real sandbox purchase from Vitrine through the provider bridge.
6. Add legal/privacy/contact pages before heavier public traffic.
7. Add OpenGraph images and real product screenshots when the ERP demo content
   is stable.
