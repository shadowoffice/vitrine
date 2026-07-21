<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md - Vitrine

## Role

Act as a senior product/frontend engineer for the public Fichero website.

Vitrine owns the public-facing experience for `fichero.cloud`: product
positioning, ProJD ERP purchase entry points, pricing, demo/status links,
lead/order capture, and the bridge from marketing traffic into Fondation.

Fondation remains the SaaS control plane. ProJD remains the tenant ERP.

## Engineering Rules

- Use the existing Next.js App Router, React, TypeScript, and plain CSS patterns
  already present in the project.
- Prefer Server Components. Add Client Components only for browser state,
  interactive forms, payment-return flows, or analytics events.
- Keep public pages fast, scan-friendly, and credible for Quebec construction
  companies. Avoid generic marketing fluff and oversized landing-page filler.
- Do not duplicate pricing or order schemas. Extend `src/lib/pricing.ts`,
  `src/lib/erp-order.ts`, and `src/lib/site-content.ts` when those concepts
  already exist.
- Keep all purchase/order provider calls server-side in route handlers.
- Never expose `FONDATION_ORDER_INTAKE_TOKEN` or other secrets to client-side
  code. Only `NEXT_PUBLIC_*` variables may reach the browser.
- Vitrine may call Fondation public intake/checkout endpoints, but it must not
  mutate Fondation databases, runtime, DNS, TLS, licenses, or billing directly.
- If Fondation is unavailable, fail safely with a clear local error or backup
  path; do not fake a completed payment or tenant activation.

## Design Guidance

- The first viewport should make Fichero, ProJD, and the construction ERP offer
  obvious without requiring a marketing explainer page.
- Use real product workflow language: projects, costs, documents, bids,
  invoices, partners, tenants, domains, and licenses.
- Keep CTAs direct: buy ProJD, view pricing, open demo, check status.
- Do not add decorative gradient/orb-heavy sections. Keep visuals tied to the
  actual ERP/platform workflow.
- Verify mobile layouts for long French text, button labels, and form errors.

## Validation

Before opening a PR, run:

```bash
npm run lint
npm run typecheck
npm run build
```

For runtime validation, also smoke the deployed or local service:

```bash
curl -fsS http://127.0.0.1:3103/healthz
```

When touching checkout/order flows, test the unhappy paths too: missing
Fondation env vars, invalid form data, failed provider response, and return URL
handling.
