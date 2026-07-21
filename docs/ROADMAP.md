# Vitrine Roadmap

## Priority 1 - Merge And Deploy PR #1

- Review draft PR #1.
- Merge once ready.
- Rebuild `fichero-vitrine`.
- Smoke:
  - `/`
  - `/tarifs`
  - `/commander`
  - `/demo`
  - `/healthz`
  - `/sitemap.xml`

## Priority 2 - Real Provider Smoke

Depends on Fondation Stripe/PayPal configuration.

- Run Stripe sandbox purchase from `/commander`.
- Confirm redirect to Stripe.
- Confirm Fondation webhook reconciliation.
- Confirm invoice/subscription/license records in Fondation.
- Run PayPal sandbox order/capture.
- Confirm PayPal return page behavior.

## Priority 3 - Public Trust Content

- Add clearer implementation timeline copy.
- Add privacy/contact/legal pages when legal copy is ready.
- Add customer-facing FAQ about billing, support and data handling.
- Add real product screenshots or generated visual assets once the demo ERP
  content is stable.

## Priority 4 - Analytics And Intake Operations

- Add an internal view or export for local JSONL order backups.
- Add lightweight analytics summary for page views, checkout starts and failed
  checkouts.
- Add structured event names for pricing CTA clicks.
- Add bot/spam controls if public traffic increases.

## Priority 5 - SEO And Content Depth

- Expand module pages into deeper ProJD construction workflows.
- Add pages for estimation, documents, invoices, partners and reporting.
- Add OpenGraph images.
- Add richer schema metadata where appropriate.
- Keep sitemap and robots aligned with public launch state.

## Priority 6 - Ecosystem Links

- Keep `demo.erp.fichero.cloud` as the read-only ProJD demo entry.
- Keep `login.fichero.cloud` as the Fondation SaaS login entry.
- Avoid adding `app.fichero.cloud` until the proxy/runtime target is stable.
