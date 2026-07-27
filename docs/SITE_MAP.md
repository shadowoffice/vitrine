# Carte du site Vitrine

## Navigation principale

- Produit → `/projd`
- Solutions → `/solutions`
- Modules → `/modules`
- Ressources → `/ressources`
- Tarifs → `/tarifs`
- CTA principal → `/commander`

Le pied de page donne aussi accès aux secteurs, comparaisons, scénarios,
présentation, documentation, guides, glossaire, démo, sécurité,
confidentialité, conditions et statut sans surcharger l’en-tête.

## Pages indexables

| Route | Rôle |
| --- | --- |
| `/` | Accueil commercial et orientation. |
| `/projd` | Présentation du produit ProJD. |
| `/solutions` | Index des parcours par rôle. |
| `/solutions/[slug]` | Problèmes, workflow, résultat attendu et modules d’un rôle. |
| `/secteurs` | Index des points de départ par secteur. |
| `/secteurs/[slug]` | Défis, périmètre pilote et modules d’un secteur. |
| `/modules` | Catalogue des dix modules et recherche accessible. |
| `/modules/[slug]` | État, preuves, limites, workflow et modules reliés. |
| `/tarifs` | Assistant de forfait, calcul de coût et matrice comparative. |
| `/ressources` | Hub documentation, guides, démo et sécurité. |
| `/presentation` | Présentation commerciale interactive en six diapositives. |
| `/documentation` | Référence fonctionnelle et état des modules. |
| `/guides` | Index recherchable des douze parcours pratiques. |
| `/guides/[slug]` | Procédure, contrôles, résultat et liens produit d’un guide. |
| `/comparer` | Index des comparaisons factuelles. |
| `/comparer/[slug]` | Frontière d’autorité entre ProJD et un outil existant. |
| `/glossaire` | Définitions construction et ERP, avec données structurées. |
| `/scenarios` | Trois scénarios de démonstration reproductibles et explicitement fictifs. |
| `/demo` | Capture de l’instance fictive, consignes et accès externe. |
| `/securite` | Garde-fous, données et limites assumées. |
| `/confidentialite` | Comportement actuel de collecte et limites à finaliser. |
| `/conditions` | Cadre d’utilisation des surfaces publiques. |
| `/statut` | Points d’accès et état public. |
| `/commander` | Demande de proposition en deux étapes. |

Chaque page indexable possède un titre, une description et un canonical. Le
sitemap utilise les dates de modification par famille de contenu. Les pages de
détail des modules, guides et secteurs génèrent une image Open Graph propre.
Les guides publient un schéma `Article`; les pages pertinentes publient aussi
FAQ, breadcrumbs, produit ou offres à partir du contenu visible.

## Slugs canoniques

### Rôles

- `direction`
- `projets`
- `estimation`
- `comptabilite`

### Secteurs

- `entrepreneurs-generaux`
- `entrepreneurs-specialises`
- `equipes-multiprojets`

### Modules

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

### Guides

- `demarrer-un-projet`
- `lancer-un-appel-offres`
- `suivre-un-budget`
- `traiter-une-facture`
- `preparer-une-revue-projet`
- `cadrer-une-integration`
- `qualifier-les-partenaires`
- `preparer-une-implantation-pilote`
- `documenter-un-avenant`
- `importer-un-budget-preliminaire`
- `recevoir-une-soumission`
- `preparer-un-rapport-hebdomadaire`

### Comparaisons

- `excel`
- `procore`
- `sharepoint`

Les recherches de `/modules` et `/guides` filtrent côté client des données déjà
rendues par le serveur. Elles sont insensibles aux accents et couvrent code,
catégorie, titre, description et métadonnées; les pages restent consultables
sans requête.

## Routes non indexables

| Route | Rôle |
| --- | --- |
| `/commander/achat` | Checkout historique, fermé par défaut et ouvert seulement avec configuration sûre et devis signé. |
| `/paiement/retour` | Capture éventuelle et vérification bornée du statut fournisseur. |

Ces routes ne doivent apparaître ni dans la navigation principale ni dans le
sitemap. Une présentation commerciale conduit vers `/commander`, pas
directement vers le checkout.

## Compatibilité et destinations externes

- `/fondation` redirige vers `/projd`;
- `/demo` explique le contexte avant d’ouvrir
  `demo.erp.fichero.cloud` dans un nouvel onglet;
- les données et scénarios de démonstration sont explicitement fictifs;
- `/healthz` et `/readyz` sont des routes techniques, pas des pages marketing.

## Routes serveur et techniques

| Méthode et route | Rôle |
| --- | --- |
| `POST /api/proposals` | Intake de proposition vers Fondation lorsque configuré, avec secours JSONL. |
| `POST /api/analytics` | Pages vues, tunnel et Web Vitals first-party. |
| `POST /api/checkout` | Création de checkout auprès de Fondation. |
| `POST /api/checkout/capture` | Capture PayPal auprès de Fondation. |
| `GET /api/checkout/status` | Statut serveur autoritaire lorsqu’il est configuré. |
| `POST /api/erp-orders` | Intake historique avec secours JSONL. |
| `GET /healthz` | Vivacité du processus. |
| `GET /readyz` | Préparation de la configuration et des files. |
| `GET /robots.txt` | Politique d’indexation. |
| `GET /sitemap.xml` | Routes publiques et dates de contenu. |

`/api/*`, `/healthz` et `/readyz` restent exclus de l’indexation.

## Règles d’évolution

- toute nouvelle page publique reçoit titre, description et canonical;
- toute nouvelle route indexable est ajoutée au sitemap avec une date de
  modification réelle;
- rôles, secteurs, comparaisons, modules, guides, glossaire et scénarios
  proviennent de `src/lib/site-content.ts`;
- tarifs et comparaisons de forfaits proviennent de `src/lib/pricing.ts`;
- une page dynamique conserve `generateStaticParams`, un état 404 sûr et les
  données structurées pertinentes;
- les pages paiement restent `noindex`;
- aucune identité légale, métrique client ou promesse commerciale n’est
  inventée.

Voir [IMPROVEMENTS_50_STATUS.md](IMPROVEMENTS_50_STATUS.md) pour l’état
d’exécution, [LEGAL_AND_COMMERCIAL_INPUTS.md](LEGAL_AND_COMMERCIAL_INPUTS.md)
pour les entrées externes, [QUALITY_GATES.md](QUALITY_GATES.md) pour les
barrières automatisées et [OPERATIONS.md](OPERATIONS.md) pour la production.
