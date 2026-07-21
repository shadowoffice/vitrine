# Vitrine Roadmap

## Priority 1 - Merge And Deploy ProJD Sales Redesign

- Review the `feat/projd-sales-vitrine` branch.
- Merge once validation passes.
- Rebuild `fichero-vitrine`.
- Smoke:
  - `/`
  - `/projd`
  - `/modules`
  - `/tarifs`
  - `/commander`
  - `/demo`
  - `/healthz`
  - `/sitemap.xml`

## Priority 2 - Real Provider Smoke

Depends on Stripe/PayPal configuration in the internal provider bridge.

- Run Stripe sandbox purchase from `/commander`.
- Confirm redirect to Stripe.
- Confirm webhook reconciliation.
- Confirm invoice/subscription/license records.
- Run PayPal sandbox order/capture.
- Confirm PayPal return page behavior.

## Priority 3 - Public Trust Content

- Add privacy, contact and legal pages when legal copy is ready.
- Add implementation timeline copy for buyers.
- Add customer-facing FAQ about billing, support and data handling.
- Add real product screenshots or generated product visuals once the ERP demo
  content is stable.

## Priority 4 - Analytics And Intake Operations

- Add an internal view or export for local JSONL order backups.
- Add lightweight analytics summary for page views, checkout starts and failed
  checkouts.
- Add structured event names for pricing CTA clicks and slider engagement.
- Add bot/spam controls if public traffic increases.

## Priority 5 - SEO And Content Depth

- Expand module pages into deeper ProJD construction workflows.
- Add pages for estimation, documents, invoices, partners and reporting.
- Add OpenGraph images.
- Add richer schema metadata where appropriate.
- Keep sitemap and robots aligned with public launch state.

## Priority 6 - Ecosystem Links

- Keep `demo.erp.fichero.cloud` as the read-only ProJD demo entry.
- Keep public navigation focused on ProJD.
- Avoid adding direct app/runtime entry points until routing and support process
  are stable.
