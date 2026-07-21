# OPENCLAW.md - Vitrine Workflow

## Project

- Local path: `/root/.openclaw/workspace/Vitrine`
- GitHub repo: `shadowoffice/vitrine`
- Public domain: `https://fichero.cloud`
- Runtime container: `fichero-vitrine`
- Local exposed port: `3103`

Vitrine is the public website. It should stay separate from Fondation and ProJD:

- Vitrine: public site, pricing, order capture, demo/status links.
- Fondation: SaaS control plane, customers, tenants, billing, licenses, DNS/TLS,
  provisioning, audit.
- ProJD: tenant ERP application.

## Branch And PR Workflow

1. Keep `main` as the deployable baseline.
2. Create focused branches such as `feat/vitrine-public-checkout` or
   `docs/vitrine-agent-workflow`.
3. Commit local changes with a clear conventional message.
4. Push the branch and open a draft PR against `main`.
5. Include validation results and any runtime smoke evidence in the PR body.

If the GitHub CLI is unavailable or unauthenticated, use the GitHub connector
for PR metadata after pushing with git.

## Required Checks

Run these before a PR:

```bash
npm run lint
npm run typecheck
npm run build
git diff --check
```

For deployed changes:

```bash
curl -fsS http://127.0.0.1:3103/healthz
curl -fsSI https://fichero.cloud | sed -n '1,12p'
```

## Environment

Server-only values:

- `FONDATION_ORDER_INTAKE_URL`
- `FONDATION_CHECKOUT_URL`
- `FONDATION_CHECKOUT_CAPTURE_URL`
- `FONDATION_ORDER_INTAKE_TOKEN`
- `VITRINE_ORDER_INBOX_PATH`

Browser-safe values:

- `NEXT_PUBLIC_SITE_URL`

Never commit real tokens, provider secrets, webhook secrets, or local JSONL data.

## Deployment

Docker Compose runs the Next.js app and mounts `./data` for local order backup:

```bash
docker compose up -d --build
docker compose ps
curl -fsS http://127.0.0.1:3103/healthz
```

Production routing is owned outside this repo by Nginx Proxy Manager:

```text
fichero.cloud -> http://192.168.0.19:3103
```

Do not change proxy, DNS, TLS, or server scheduler configuration from this repo
without inspecting the existing state first.

## Checkout Safety

The checkout path must stay provider-backed:

- Vitrine submits validated order/cart payloads to Fondation.
- Fondation creates Stripe/PayPal provider sessions.
- Vitrine redirects to provider URLs only after Fondation returns a created
  checkout session.
- Vitrine never marks a payment, subscription, invoice, license, or tenant as
  active by itself.

When provider secrets are missing, the expected behavior is a safe failure with
no fake activation.
