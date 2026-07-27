# Architecture Vitrine

## Frontière d’autorité

Vitrine possède l’expérience publique : présentation, rôles, secteurs,
modules, tarifs, documentation, guides, proposition commerciale, mesure
first-party et handoff sécurisé.

- Vitrine ne possède pas l’état autoritaire de paiement, les abonnements,
  licences, domaines, TLS ou runtimes ERP.
- Fondation reste l’autorité SaaS et fournisseur pour l’intake durable, le
  checkout, le paiement et l’activation.
- ProJD reste l’application ERP et la source de vérité fonctionnelle.

La séparation et les activations encore externes sont suivies dans
[IMPROVEMENTS_50_STATUS.md](IMPROVEMENTS_50_STATUS.md). Les identités,
coordonnées, politiques et preuves commerciales non confirmées ne doivent pas
être déduites; voir
[LEGAL_AND_COMMERCIAL_INPUTS.md](LEGAL_AND_COMMERCIAL_INPUTS.md).

## App Router et rendu

Les surfaces vivent dans `src/app` :

- produit : `/`, `/projd`, `/presentation`, `/solutions`,
  `/solutions/[slug]`, `/secteurs`, `/secteurs/[slug]`, `/modules` et
  `/modules/[slug]`;
- décision : `/tarifs`, `/comparer`, `/comparer/[slug]`, `/glossaire` et
  `/scenarios`;
- ressources : `/ressources`, `/documentation`, `/guides`,
  `/guides/[slug]` et `/demo`;
- vente : `/commander`;
- confiance : `/securite`, `/confidentialite`, `/conditions` et `/statut`;
- opérationnel non indexable : `/commander/achat` et `/paiement/retour`;
- compatibilité : `/fondation` redirige vers `/projd`.

Les pages et contenus restent des Server Components par défaut. Les îlots
client sont limités à :

- `ContentFilter` pour les recherches modules et guides;
- `PricingExplorer` pour la recommandation et le calcul tarifaire;
- `ProposalForm` et `ErpOrderForm` pour les formulaires;
- `PaymentReturnClient` pour la capture et le polling borné;
- `PrivacyAnalytics` et `WebVitalsReporter` pour la mesure navigateur;
- les interactions de navigation et de présentation qui exigent un état local.

Le layout racine fournit l’en-tête, le pied de page, le lien d’évitement,
l’analytics App Router et les Web Vitals. La configuration Next.js ajoute CSP,
HSTS en production, anti-framing, `nosniff`, politique de référent et
permissions restreintes.

## Contenus, SEO et tarification

`src/lib/site-content.ts` est la source canonique des :

- navigation et piliers produit;
- quatre rôles et trois secteurs;
- dix modules et états `available`, `evolving`, `activation`;
- douze guides;
- trois comparaisons, glossaire et trois scénarios fictifs vérifiables;
- intégrations, ressources, sécurité, statut et dates de modification.

`src/lib/pricing.ts` porte les forfaits, les règles de sièges, le calcul de
première année et la matrice comparative. Les autres contrats canoniques sont :

- `src/lib/proposal.ts` pour les propositions;
- `src/lib/erp-order.ts` pour commande, checkout, capture et statut.

Il ne faut pas créer de second catalogue dans une page. Les routes dynamiques,
liens reliés, filtres, sitemap, images Open Graph et données structurées
consomment les mêmes sources.

## Frontière des requêtes publiques

`src/lib/server/request.ts` fournit le contrat commun des routes publiques :

1. crée ou valide `x-request-id`;
2. crée ou valide la clé `idempotency-key`;
3. vérifie l’origine canonique ou explicitement autorisée lorsque requise;
4. construit une empreinte anonyme selon la politique de proxies de confiance;
5. applique un rate limit en mémoire, borné en nombre d’entrées;
6. exige un type JSON pour les `POST`;
7. lit réellement le flux avec une limite d’octets;
8. détecte le honeypot configuré;
9. renvoie des erreurs sûres avec `cache-control: no-store`.

Les schémas Zod valident ensuite chaque payload. Les limites en mémoire
protègent une instance contre les doubles clics et abus courants, mais ne
remplacent pas l’idempotence et le rate limiting distribués dans Fondation ou
le proxy.

Les logs de `src/lib/server/logging.ts` sont des objets JSON. Les clés et
valeurs sensibles sont expurgées; les payloads, courriels, téléphones, adresses,
jetons et secrets ne doivent jamais être journalisés en clair.

## Client Fondation

`src/lib/server/foundation-client.ts` est la seule couche de transport
Fondation :

- code `server-only`;
- endpoint nommé et allowlist d’hôtes;
- jeton Bearer conservé côté serveur;
- propagation de `x-request-id` et `idempotency-key`;
- timeout via `AbortSignal`;
- redirections refusées;
- réponses JSON lues avec plafond de `128 KiB`;
- validation Zod de chaque réponse;
- traduction des erreurs vers des états HTTP et messages sûrs.

`FONDATION_CHECKOUT_URL` et `FONDATION_CHECKOUT_CAPTURE_URL` peuvent être
dérivées d’une URL d’intake se terminant par `/erp-orders`. Les endpoints de
proposition et de statut ne sont jamais devinés et doivent être configurés
explicitement. L’hôte de l’intake de commande alimente l’allowlist; tout autre
hôte doit apparaître dans `FONDATION_ALLOWED_HOSTS`.

## Parcours de proposition

1. `VITRINE_ENABLE_PROPOSALS=false` ferme par défaut `/commander` et
   `POST /api/proposals` sans lire le corps, écrire la file ou appeler
   Fondation.
2. L’activation exige le responsable et le courriel officiels, une conservation
   de `1` à `3650` jours, l’endpoint de proposition autorisé et le jeton
   Fondation; `/readyz` refuse toute activation partielle.
3. `/commander` préremplit éventuellement forfait, modules et contexte depuis
   la query string lorsque cette barrière est complète.
4. `ProposalForm` recueille d’abord besoins et équipe, puis entreprise,
   contact et consentement; les erreurs sont reliées aux champs et le focus est
   restauré.
5. `POST /api/proposals` applique le contrat public et valide avec Zod.
6. La route tente `FONDATION_PROPOSAL_INTAKE_URL` avec une clé d’idempotence.
7. Si Fondation accepte ou met en file, la réponse `202` confirme cette
   livraison.
8. Sinon, la proposition est ajoutée à une file JSONL rotative, mode `0600`,
   sous `VITRINE_PROPOSAL_INBOX_PATH`.
9. Si Fondation et le secours local échouent, la route répond `503` et
   n’affiche aucun faux succès.

La référence de proposition est dérivée de la clé d’idempotence. Le formulaire
peut afficher un rendez-vous seulement si une URL HTTPS officielle a été
injectée au build.

## Analytics respectueux

`PrivacyAnalytics` suit chaque navigation App Router et respecte Do Not Track.
Le collecteur accepte uniquement :

- une page vue avec chemin sans query, origine du référent, classe de viewport
  et UTM normalisés;
- l’un des neuf événements de tunnel autorisés;
- les Web Vitals `LCP`, `INP` et `CLS`.

Les événements sont validés puis ajoutés à une file JSONL rotative. Le script
`npm run analytics:summary` produit uniquement des compteurs agrégés et bornés
pour une surface privée; il ne constitue pas un CRM.

## Checkout et paiement

`/commander/achat` reste `noindex` et sert uniquement un dossier déjà cadré.

1. `VITRINE_ENABLE_CHECKOUT=false` ferme par défaut la page et l'API sans
   appeler Fondation.
2. Une activation n'est prête que si le devis signé est obligatoire, son
   secret est valide, l'endpoint checkout est autorisé et le jeton Fondation
   est présent; `/readyz` refuse toute configuration partielle.
3. `POST /api/checkout` valide la commande et recalcule le panier depuis
   `src/lib/pricing.ts`.
4. Un jeton HMAC versionné est obligatoire. Il lie `quoteId`, `orderRef`, plan,
   sièges, courriel et expiration. L’émission appartient à un service de
   confiance.
5. Le formulaire transmet le jeton et conserve une clé d'idempotence stable
   tant que son contenu ne change pas.
6. Le client Fondation crée une session Stripe ou PayPal et Vitrine accepte
   uniquement une URL HTTPS sans identifiants ni fragment.
7. Au retour PayPal, `POST /api/checkout/capture` applique la même barrière
   d’activation, bloque les rejeux courants en mémoire et propage la clé à
   Fondation.
8. `GET /api/checkout/status` interroge exclusivement
   `FONDATION_CHECKOUT_STATUS_URL`.
9. `PaymentReturnClient` effectue au plus six lectures, avec timeout par
   requête, puis passe à un état différé en cas d’indisponibilité.

Règle absolue : aucune query string de retour, capture locale ou URL fournisseur
ne confirme à elle seule un paiement. Seul un statut serveur autoritaire
`paid` permet l’affichage « Paiement confirmé »; licence et activation restent
des étapes distinctes.

## Files JSONL et observabilité

Les trois files par défaut sont :

```text
/app/data/proposals.jsonl
/app/data/erp-orders.jsonl
/app/data/analytics-events.jsonl
```

Les écritures sont sérialisées par chemin, créées en mode restreint et
effectuent une rotation avant dépassement du plafond. Le bind mount
`./data:/app/data` les persiste hors de l’image.

- `/healthz` vérifie uniquement la vivacité du processus;
- `/readyz` valide l’environnement, la cohérence endpoint/jeton/allowlist, le
  secret de devis lorsqu’il est exigé et l’écriture des trois files;
- les réponses et logs portent un identifiant de requête;
- les alertes, la relève commerciale et la politique de conservation restent
  des responsabilités d’exploitation.

Les sauvegardes, rotations, purges, diagnostics et rollbacks sont décrits dans
[OPERATIONS.md](OPERATIONS.md).

## Environnement

Variables publiques, figées au build :

- `NEXT_PUBLIC_SITE_URL`;
- `NEXT_PUBLIC_SALES_BOOKING_URL`;
- `NEXT_PUBLIC_MARKETING_VARIANT`.

Endpoints et transport Fondation, serveur seulement :

- `FONDATION_ORDER_INTAKE_URL`;
- `FONDATION_PROPOSAL_INTAKE_URL`;
- `FONDATION_CHECKOUT_URL`;
- `FONDATION_CHECKOUT_CAPTURE_URL`;
- `FONDATION_CHECKOUT_STATUS_URL`;
- `FONDATION_ORDER_INTAKE_TOKEN`;
- `FONDATION_ALLOWED_HOSTS`;
- `FONDATION_REQUEST_TIMEOUT_MS`.

Sécurité et persistance, serveur seulement :

- `VITRINE_ALLOWED_ORIGINS`;
- `VITRINE_TRUST_PROXY_HOPS`;
- `VITRINE_ENABLE_PROPOSALS`;
- `VITRINE_PRIVACY_OFFICER_NAME`;
- `VITRINE_PRIVACY_CONTACT_EMAIL`;
- `VITRINE_PROPOSAL_RETENTION_DAYS`;
- `VITRINE_ENABLE_CHECKOUT`;
- `VITRINE_REQUIRE_SIGNED_QUOTE`;
- `VITRINE_QUOTE_SIGNING_SECRET`;
- `VITRINE_ORDER_INBOX_PATH`;
- `VITRINE_PROPOSAL_INBOX_PATH`;
- `VITRINE_ANALYTICS_INBOX_PATH`;
- `VITRINE_ANALYTICS_MAX_FILE_BYTES`;
- `VITRINE_ANALYTICS_ROTATION_FILES`.

Le schéma `src/lib/server/env.ts` est chargé à la demande pour que le build ne
requière aucun secret de production. Une configuration incohérente produit un
échec sûr et rend `/readyz` indisponible.

## Qualité, CI et conteneur

Vitest couvre les prix, normalisations, schémas, devis signés, garde-types,
contrats API et agrégats analytics. Playwright couvre Chromium bureau/mobile,
navigation, clavier, formulaire, en-têtes et Axe WCAG 2.2 AA sur les pages
critiques.

La CI GitHub publie trois jobs :

- `lint-type-test-build`;
- `chromium-e2e`;
- `container-smoke-scan`.

Le conteneur utilise une base Node 22 Alpine épinglée par digest, un runtime
non-root et en lecture seule, aucune capacité Linux, `no-new-privileges`, un
`tmpfs` restreint, des limites mémoire/processus et des labels OCI. La CI
construit au SHA, vérifie l’absence de `.env`, produit un SBOM SPDX et bloque
les vulnérabilités runtime HIGH ou CRITICAL corrigibles.

Voir [QUALITY_GATES.md](QUALITY_GATES.md) pour les commandes et limites de ces
barrières.

## Échecs attendus

- configuration invalide : `503`;
- média non JSON : `415`;
- origine refusée : `403`;
- payload invalide : `400`;
- payload trop volumineux : `413`;
- rate limit atteint : `429` avec `Retry-After`;
- proposition ou commande non livrée et file locale indisponible : `503`;
- endpoint Fondation absent, hors allowlist ou expiré : erreur sûre, jamais de
  payload fournisseur brut;
- statut de paiement non configuré : `503` et vérification différée;
- retour Stripe sans statut autoritaire : jamais de succès;
- capture PayPal refusée ou déjà en cours : état non confirmé;
- préparation échouée : `/healthz` peut rester `200`, mais `/readyz` répond
  `503`.

Ne jamais afficher de jeton, secret, payload fournisseur brut, renseignement
personnel ou stack trace.
