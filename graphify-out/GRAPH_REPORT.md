# Graph Report - .  (2026-07-25)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 229 nodes · 347 edges · 21 communities (16 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d29fccf7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 20

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `ErpOrderForm()` - 10 edges
3. `SiteHeader()` - 9 edges
4. `POST()` - 8 edges
5. `MarketingCta()` - 7 edges
6. `submitCheckout()` - 7 edges
7. `POST()` - 7 edges
8. `include` - 7 edges
9. `scripts` - 6 edges
10. `buildPricingCart()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `formatOrderIssues()`  [EXTRACTED]
  src/app/api/checkout/route.ts → src/lib/erp-order.ts
- `POST()` --calls--> `buildPricingCart()`  [EXTRACTED]
  src/app/api/checkout/route.ts → src/lib/pricing.ts
- `ErpOrderForm()` --calls--> `isCheckoutResponse()`  [EXTRACTED]
  src/app/commander/ErpOrderForm.tsx → src/lib/erp-order.ts
- `generateMetadata()` --calls--> `getModuleBySlug()`  [EXTRACTED]
  src/app/modules/[slug]/page.tsx → src/lib/site-content.ts
- `POST()` --calls--> `isCheckoutCaptureResponse()`  [EXTRACTED]
  src/app/api/checkout/capture/route.ts → src/lib/erp-order.ts

## Import Cycles
- None detected.

## Communities (21 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (32): MarketingCta(), MarketingCtaProps, ProductShowcaseSlider(), SiteHeader(), SiteHeaderProps, metadata, metadata, startSteps (+24 more)

### Community 1 - "Community 1"
Cohesion: 0.13
Nodes (24): checkoutProviderLabel(), ErpOrderForm(), ErpOrderFormProps, getFormText(), orderCopy, SubmitState, toOrderPayload(), checkoutProviders (+16 more)

### Community 2 - "Community 2"
Cohesion: 0.10
Nodes (20): next, dependencies, next, react, react-dom, zod, name, overrides (+12 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 4 - "Community 4"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 5 - "Community 5"
Cohesion: 0.22
Nodes (12): captureSchema, captureUrl(), POST(), ProviderCaptureResponse, readJson(), readProviderResponse(), getInitialState(), PaymentReturnClient() (+4 more)

### Community 6 - "Community 6"
Cohesion: 0.28
Nodes (12): checkoutUrl(), isCheckoutProvider(), orderRef(), payloadPaymentProvider(), PaymentProvider, POST(), ProviderCheckoutResponse, publicSiteUrl() (+4 more)

### Community 7 - "Community 7"
Cohesion: 0.29
Nodes (11): orderRef(), POST(), ProviderOrderResponse, readJson(), readProviderResponse(), storeLocalOrder(), submitToProviderBridge(), ErpOrderResponse (+3 more)

### Community 8 - "Community 8"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.39
Nodes (6): generateMetadata(), getRelatedModules(), ModuleDetailPage(), ModulePageProps, getModuleBySlug(), ModuleContent

### Community 10 - "Community 10"
Cohesion: 0.43
Nodes (4): getReferrerOrigin(), getViewportBucket(), PrivacyAnalytics(), metadata

### Community 11 - "Community 11"
Cohesion: 0.60
Nodes (4): analyticsEventSchema, POST(), readJson(), storeAnalyticsEvent()

### Community 12 - "Community 12"
Cohesion: 0.50
Nodes (4): firstQueryValue(), metadata, OrderPage(), OrderPageProps

### Community 13 - "Community 13"
Cohesion: 0.40
Nodes (4): bidItems, budgetRows, ErpPreview(), portalItems

## Knowledge Gaps
- **91 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+86 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 4` to `Community 2`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `SiteHeader()` connect `Community 0` to `Community 9`, `Community 12`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `compilerOptions` connect `Community 3` to `Community 8`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _91 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06980392156862746 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.12698412698412698 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._