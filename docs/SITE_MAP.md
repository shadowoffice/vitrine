# Carte du site Vitrine

## Navigation principale

- Produit → `/projd`
- Solutions → `/solutions`
- Modules → `/modules`
- Ressources → `/ressources`
- Tarifs → `/tarifs`
- CTA principal → `/commander`

Le footer expose présentation, documentation, guides, démo, sécurité,
confidentialité, conditions et statut sans surcharger l’en-tête.

## Pages indexables

| Route | Rôle |
| --- | --- |
| `/` | Accueil commercial court et orientation. |
| `/projd` | Présentation du produit ProJD. |
| `/solutions` | Valeur par rôle : direction, projets, estimation, comptabilité. |
| `/modules` | Catalogue et niveaux de disponibilité. |
| `/modules/[slug]` | Détail, preuves, limites et modules reliés. |
| `/tarifs` | Repères de prix et accès à la proposition. |
| `/ressources` | Hub documentation, guides, démo et sécurité. |
| `/presentation` | Présentation commerciale interactive en six diapositives. |
| `/documentation` | Référence fonctionnelle et état des modules. |
| `/guides` | Index des parcours pratiques. |
| `/guides/[slug]` | Guide court par tâche. |
| `/demo` | Présentation guidée et accès externe à la démo fictive. |
| `/securite` | Garde-fous, données et limites assumées. |
| `/confidentialite` | Données recueillies par la vitrine. |
| `/conditions` | Cadre d’utilisation des surfaces publiques. |
| `/statut` | Points d’accès et état public. |
| `/commander` | Demande de proposition assistée. |

Slugs de modules canoniques :

- `projets`
- `budgets`
- `contrats`
- `estimation-bid`
- `documents`
- `factures-ocr`
- `partenaires`
- `portail-collaboration`
- `rapports`
- `integrations`

Slugs de guides :

- `demarrer-un-projet`
- `lancer-un-appel-offres`
- `suivre-un-budget`
- `traiter-une-facture`

## Routes non indexables

| Route | Rôle |
| --- | --- |
| `/commander/achat` | Checkout historique après proposition approuvée. |
| `/paiement/retour` | Retour fournisseur et vérification. |

Ces routes ne doivent pas apparaître dans la navigation principale ni dans le
sitemap.

## Compatibilité et destinations externes

- `/fondation` redirige vers `/projd`;
- `/demo` contient le contexte de présentation avant d’ouvrir
  `demo.erp.fichero.cloud` dans un nouvel onglet;
- `/healthz` est une route technique, pas une page marketing.

## Routes serveur

- `POST /api/proposals`
- `POST /api/analytics`
- `POST /api/checkout`
- `POST /api/checkout/capture`
- `POST /api/erp-orders`
- `GET /healthz`
- `GET /robots.txt`
- `GET /sitemap.xml`

`/api/*` reste exclu de l’indexation.

## Règles d’évolution

- toute nouvelle page publique reçoit un titre, une description et un
  canonical;
- toute nouvelle route indexable est ajoutée au sitemap;
- modules, guides, solutions et statuts proviennent de
  `src/lib/site-content.ts`;
- les pages paiement restent `noindex`;
- une présentation commerciale conduit vers `/commander`, pas directement vers
  un checkout non qualifié.
