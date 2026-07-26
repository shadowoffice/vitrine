# Architecture Vitrine

## Frontière

Vitrine possède l’expérience publique : présentation, solutions, tarifs,
documentation, guides, proposition commerciale et handoff sécurisé.

- Vitrine ne possède pas l’état de paiement, les abonnements, licences,
  domaines, TLS ou runtimes ERP.
- Fondation reste l’autorité SaaS et fournisseur.
- ProJD reste l’application ERP et la source de vérité fonctionnelle.

## App Router

Les pages publiques vivent dans `src/app` :

- présentation : `/`, `/projd`, `/presentation`, `/solutions`, `/modules`,
  `/modules/[slug]`;
- vente : `/tarifs`, `/commander`;
- ressources : `/ressources`, `/documentation`, `/guides`,
  `/guides/[slug]`, `/demo`;
- confiance : `/securite`, `/confidentialite`, `/conditions`, `/statut`;
- opérationnel non indexable : `/commander/achat`, `/paiement/retour`;
- compatibilité : `/fondation` redirige vers `/projd`.

Le layout racine fournit l’en-tête, le pied de page, le lien d’évitement et
l’analytics first-party.

## Contenus et contrats

`src/lib/site-content.ts` est le contenu canonique du site. Il centralise :

- navigation et piliers produit;
- rôles et solutions;
- catalogue des modules et slugs;
- niveaux `available`, `evolving`, `activation`;
- intégrations, ressources, documentation, guides, sécurité et statut.

Il ne faut pas créer un second catalogue dans une page. Les pages dynamiques,
liens reliés, sitemap et données structurées doivent consommer ces données.

Les autres contrats canoniques sont :

- `src/lib/pricing.ts` pour les forfaits et montants;
- `src/lib/proposal.ts` pour la proposition;
- `src/lib/erp-order.ts` pour le checkout historique.

## Parcours de vente assistée

1. Le visiteur ouvre `/commander`.
2. `ProposalForm` recueille entreprise, contact, taille d’équipe, priorité,
   outils actuels et contexte facultatif.
3. `POST /api/proposals` limite la taille, vérifie l’origine, valide avec Zod et
   absorbe les soumissions honeypot.
4. La demande valide est ajoutée à
   `VITRINE_PROPOSAL_INBOX_PATH`, par défaut
   `/app/data/proposals.jsonl`.
5. La réponse confirme uniquement l’enregistrement de la demande.

Ce parcours ne demande aucune donnée fiscale ou de paiement et ne crée aucun
environnement ERP.

## Checkout historique

`/commander/achat` reste disponible pour une proposition déjà approuvée et est
explicitement `noindex`.

1. Le formulaire soumet à `POST /api/checkout`.
2. Vitrine valide le contrat et recalcule le panier côté serveur.
3. La route appelle Fondation avec le jeton serveur.
4. Fondation retourne, si possible, une URL Stripe ou PayPal.
5. Le navigateur est redirigé vers le fournisseur.
6. La réconciliation reste du ressort de Fondation et des webhooks.

Règle absolue : les paramètres d’une URL de retour Stripe ne constituent jamais
une confirmation de paiement. La page doit rester en état de vérification tant
qu’aucun statut serveur autoritaire n’est disponible.

Le retour PayPal peut appeler `/api/checkout/capture`, mais affiche un succès
uniquement après une réponse serveur `captured`.

## Routes serveur

| Route | Responsabilité |
| --- | --- |
| `/api/proposals` | Validation et boîte JSONL des propositions. |
| `/api/analytics` | Événements de page sans cookie. |
| `/api/checkout` | Création de checkout par Fondation. |
| `/api/checkout/capture` | Capture PayPal par Fondation. |
| `/api/erp-orders` | Intake historique et fallback JSONL. |
| `/healthz` | Santé du runtime Vitrine. |

Toutes les communications Fondation restent côté serveur.

## Environnement

Serveur seulement :

- `VITRINE_PROPOSAL_INBOX_PATH`;
- `VITRINE_ORDER_INBOX_PATH`;
- `FONDATION_ORDER_INTAKE_URL`;
- `FONDATION_CHECKOUT_URL`;
- `FONDATION_CHECKOUT_CAPTURE_URL`;
- `FONDATION_ORDER_INTAKE_TOKEN`.

Navigateur :

- `NEXT_PUBLIC_SITE_URL`.

Le volume Docker `./data:/app/data` persiste les boîtes JSONL. Leur accès,
relève, rotation et suppression sont des responsabilités d’exploitation.

## Échecs attendus

- proposition invalide : `400`;
- origine de proposition refusée : `403`;
- proposition trop volumineuse : `413`;
- boîte de propositions indisponible : `503`, sans faux succès;
- checkout non configuré : `503`;
- refus fournisseur : erreur sûre, sans activation;
- retour Stripe : vérification en cours, jamais succès déduit de l’URL;
- capture PayPal refusée : état d’erreur, sans activation.

Ne jamais afficher de jeton, secret, payload fournisseur brut ou stack trace.
