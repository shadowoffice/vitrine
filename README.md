# Vitrine ProJD

Vitrine est le site public de vente assistée de l’ERP construction ProJD,
accessible sur `https://fichero.cloud`.

Le parcours commercial reste volontairement séparé de l’autorité SaaS :

1. le visiteur découvre le produit, les rôles, les secteurs, les modules, les
   tarifs et les guides;
2. `/commander` recueille une demande de proposition en deux étapes;
3. l’équipe ProJD qualifie le périmètre et prépare une présentation ou un
   devis;
4. `/commander/achat` n’est utilisé qu’après ce cadrage;
5. Fondation demeure l’autorité pour le checkout, le paiement, la licence et
   l’activation.

Vitrine ne confirme jamais elle-même une licence ou une activation ERP. Un
retour fournisseur ne constitue pas non plus une preuve de paiement.

Le suivi détaillé des améliorations et de leurs dépendances externes se trouve
dans [IMPROVEMENTS_50_STATUS.md](docs/IMPROVEMENTS_50_STATUS.md).

## Stack

- Next.js 16 App Router, React 19, TypeScript strict et Zod;
- pages publiques rendues côté serveur, avec de petits îlots client pour les
  filtres, les formulaires, le calculateur et la mesure;
- routes Node.js pour les propositions, l’analytics et le handoff de paiement;
- Vitest pour les contrats métier et API;
- Playwright, Chromium et Axe pour les parcours bureau/mobile et
  l’accessibilité automatisée;
- conteneur `fichero-vitrine`, exposé localement sur le port `3103`;
- Fondation comme autorité commerciale et SaaS; ProJD comme application ERP
  locataire.

## Contenu canonique

- `src/lib/site-content.ts` : navigation, rôles, secteurs, comparaisons,
  modules, guides, glossaire, scénarios et dates de contenu;
- `src/lib/pricing.ts` : forfaits, calculs de panier et matrice comparative;
- `src/lib/proposal.ts` : contrat des demandes de proposition;
- `src/lib/erp-order.ts` : contrats du checkout, de la capture et du statut;
- `src/lib/server/env.ts` : validation des variables serveur;
- `src/lib/server/foundation-client.ts` : client Fondation typé unique.

Les niveaux publics des modules sont :

- `available` — périmètre actuellement utilisable;
- `evolving` — première tranche utilisable, mais encore en évolution;
- `activation` — fonction dépendante du tenant, des licences, permissions ou
  connecteurs à valider.

Voir [CONTENT_TRUTH_MATRIX.md](docs/CONTENT_TRUTH_MATRIX.md) avant de modifier
une promesse produit. Les renseignements légaux, preuves commerciales et
coordonnées qui restent à confirmer sont consignés dans
[LEGAL_AND_COMMERCIAL_INPUTS.md](docs/LEGAL_AND_COMMERCIAL_INPUTS.md).

## Surface publique

- `/` et `/projd` — accueil et présentation du produit;
- `/solutions` et `/solutions/[slug]` — parcours pour la direction, les
  projets, l’estimation et la comptabilité;
- `/secteurs` et `/secteurs/[slug]` — entrepreneurs généraux, entrepreneurs
  spécialisés et équipes multi-projets;
- `/modules` et `/modules/[slug]` — dix modules, avec recherche accessible;
- `/tarifs` — assistant de forfait, calcul de première année et comparaison;
- `/ressources`, `/documentation` et `/presentation` — ressources produit;
- `/guides` et `/guides/[slug]` — douze guides avec recherche accessible;
- `/comparer` et `/comparer/[slug]` — comparaisons factuelles avec Excel,
  Procore et SharePoint;
- `/glossaire` — définitions construction et ERP;
- `/scenarios` — scénarios reproductibles avec données fictives;
- `/demo` — capture réelle de l’instance de démonstration fictive et accès
  externe;
- `/securite`, `/confidentialite`, `/conditions` et `/statut` — confiance
  publique;
- `/commander` — demande de proposition assistée.

Routes opérationnelles non indexables :

- `/commander/achat` — checkout historique après qualification;
- `/paiement/retour` — capture éventuelle et vérification bornée du statut.

`/fondation` redirige vers `/projd`. La carte exhaustive, avec tous les slugs,
vit dans [SITE_MAP.md](docs/SITE_MAP.md).

## Routes serveur

| Méthode et route | Responsabilité |
| --- | --- |
| `POST /api/proposals` | Refuse par défaut; lorsqu’elle est explicitement activée avec les garanties obligatoires, valide puis livre à Fondation avec secours JSONL. |
| `POST /api/analytics` | Conserve pages vues, événements du tunnel et Web Vitals first-party sans cookie. |
| `POST /api/checkout` | Refuse par défaut; lorsqu'il est explicitement activé, recalcule le panier, exige le devis signé et demande un checkout à Fondation. |
| `POST /api/checkout/capture` | Refuse tant que le checkout sécurisé n’est pas activé; sinon demande la capture PayPal à Fondation avec protection locale contre le rejeu. |
| `GET /api/checkout/status` | Interroge le statut autoritaire configuré; sinon retourne un état indisponible sûr. |
| `POST /api/erp-orders` | Transmet l’intake historique à Fondation, avec secours JSONL rotatif. |
| `GET /healthz` | Vivacité du processus, sans dépendances externes. |
| `GET /readyz` | Cohérence de configuration et écriture des files JSONL actives. |
| `GET /robots.txt`, `GET /sitemap.xml` | Indexation publique. |

Les contrats publics partagent les mêmes garde-fous : contenu JSON, lecture en
flux avec plafond d’octets, origine canonique, rate limit borné, honeypot,
identifiant de requête et clé d’idempotence. Le rate limit et l’anti-rejeu
PayPal sont locaux au processus; l’idempotence durable demeure une
responsabilité de Fondation.

Le client Fondation reste `server-only`. Il vérifie l’allowlist des hôtes,
refuse les redirections, applique un timeout, borne la réponse et valide le
JSON reçu avec Zod. Les logs sont structurés et expurgent les champs sensibles.

## Environnement

Valeurs publiques figées au build :

- `NEXT_PUBLIC_SITE_URL` — défaut `https://fichero.cloud`;
- `NEXT_PUBLIC_SALES_BOOKING_URL` — URL HTTPS facultative du calendrier
  commercial;
- `NEXT_PUBLIC_MARKETING_VARIANT` — `control` ou `clarity`, facultatif.

Fondation, serveur seulement :

- `FONDATION_ORDER_INTAKE_URL`;
- `FONDATION_PROPOSAL_INTAKE_URL`;
- `FONDATION_CHECKOUT_URL`;
- `FONDATION_CHECKOUT_CAPTURE_URL`;
- `FONDATION_CHECKOUT_STATUS_URL`;
- `FONDATION_ORDER_INTAKE_TOKEN`;
- `FONDATION_ALLOWED_HOSTS` — hôtes supplémentaires séparés par des virgules;
- `FONDATION_REQUEST_TIMEOUT_MS` — défaut `8000`.

Sécurité et stockage, serveur seulement :

- `VITRINE_ALLOWED_ORIGINS`;
- `VITRINE_TRUST_PROXY_HOPS`;
- `VITRINE_ENABLE_PROPOSALS` — défaut `false`;
- `VITRINE_PRIVACY_OFFICER_NAME` — responsable officiel requis à l’activation;
- `VITRINE_PRIVACY_CONTACT_EMAIL` — contact officiel requis à l’activation;
- `VITRINE_PROPOSAL_RETENTION_DAYS` — durée requise, de `1` à `3650` jours;
- `VITRINE_ENABLE_CHECKOUT` — défaut `false`;
- `VITRINE_REQUIRE_SIGNED_QUOTE` — doit être `true` pour activer le checkout;
- `VITRINE_QUOTE_SIGNING_SECRET` — requis pour activer le checkout;
- `VITRINE_PROPOSAL_INBOX_PATH` — défaut
  `/app/data/proposals.jsonl`;
- `VITRINE_ORDER_INBOX_PATH` — défaut `/app/data/erp-orders.jsonl`;
- `VITRINE_ANALYTICS_INBOX_PATH` — défaut
  `/app/data/analytics-events.jsonl`;
- `VITRINE_ANALYTICS_MAX_FILE_BYTES` — défaut `5242880`;
- `VITRINE_ANALYTICS_ROTATION_FILES` — défaut `5`.

`FONDATION_CHECKOUT_URL` et `FONDATION_CHECKOUT_CAPTURE_URL` peuvent être
dérivées d’une `FONDATION_ORDER_INTAKE_URL` terminant par `/erp-orders`. Les
URLs de proposition et de statut doivent être configurées explicitement. Ne
jamais déplacer un secret Fondation dans une variable `NEXT_PUBLIC_*`.

La collecte de propositions demeure fermée si un seul des éléments suivants
manque : activation explicite, responsable et courriel officiels, durée de
conservation, endpoint de proposition autorisé et jeton Fondation. Dans cet
état, `/commander` n’affiche aucun formulaire et l’API répond `503` sans lire,
stocker ni transmettre la proposition.

Les variables `VITRINE_IMAGE_NAME`, `VITRINE_IMAGE_TAG`,
`VITRINE_IMAGE_REVISION`, `VITRINE_IMAGE_VERSION` et
`VITRINE_IMAGE_CREATED` pilotent les images immuables et leurs métadonnées OCI.

## Contrats sûrs du paiement

- `/commander/achat` et `/paiement/retour` restent `noindex`;
- le checkout direct est désactivé par défaut et aucune configuration partielle
  ne permet d'afficher son formulaire;
- un devis signé utilise un jeton HMAC versionné liant devis, commande, plan,
  sièges, courriel et expiration; son émission appartient au service de
  confiance;
- Stripe reste en vérification jusqu’à un statut serveur `paid`;
- le polling de statut est borné et revient à « vérification différée » en cas
  d’absence ou de panne;
- PayPal n’affiche une capture que sur réponse serveur `captured`, puis demande
  aussi le statut autoritaire;
- paiement, facture, licence et activation restent des états distincts.

L’activation complète du tunnel dépend encore d’entrées légales, commerciales
et Fondation. Ne pas lever ces barrières sans les preuves listées dans
[IMPROVEMENTS_50_STATUS.md](docs/IMPROVEMENTS_50_STATUS.md).

## Développement et qualité

```bash
npm ci
npm run dev
```

Barrières avant fusion :

```bash
npm run lint
npm run typecheck
npm run test:unit
npm audit --omit=dev --audit-level=high
npm run build
npm run test:e2e
git diff --check
```

Validation du conteneur :

```bash
docker compose config --quiet
docker compose build --pull vitrine
scripts/docker-smoke.sh fichero-vitrine:latest
```

La CI GitHub exécute trois jobs : qualité/build, Playwright Chromium et
smoke/scan du conteneur avec SBOM. Les détails de validation sont dans
[QUALITY_GATES.md](docs/QUALITY_GATES.md); les procédures de santé, sauvegarde,
déploiement immuable et rollback sont dans
[OPERATIONS.md](docs/OPERATIONS.md).
