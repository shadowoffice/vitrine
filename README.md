# Vitrine ProJD

Vitrine est le site public de vente de l’ERP construction ProJD sur
`https://fichero.cloud`.

La stratégie commerciale est une vente assistée :

1. le visiteur découvre le produit, les solutions, les tarifs et les guides;
2. `/commander` recueille une demande de proposition courte;
3. l’équipe ProJD qualifie le périmètre et prépare une présentation;
4. le checkout historique `/commander/achat` est utilisé seulement lorsqu’une
   proposition est déjà cadrée.

Vitrine ne confirme jamais elle-même un paiement, une licence ou une activation
ERP.

## Stack

- Next.js App Router, React, TypeScript strict et CSS global;
- pages publiques majoritairement rendues côté serveur;
- routes Node.js pour propositions, analytics et handoff de paiement;
- conteneur `fichero-vitrine`, exposé localement sur le port `3103`;
- Fondation comme autorité pour checkout, paiement, licence et activation;
- ProJD comme application ERP locataire.

## Contenu canonique

- `src/lib/site-content.ts` : navigation, solutions, modules, disponibilité,
  intégrations, ressources, documentation et guides;
- `src/lib/pricing.ts` : forfaits et calculs de panier;
- `src/lib/proposal.ts` : schéma de demande de proposition;
- `src/lib/erp-order.ts` : contrat du checkout historique.

Les niveaux publics sont :

- `available` — périmètre actuellement utilisable;
- `evolving` — première tranche utilisable, mais encore en évolution;
- `activation` — fonction dépendante du tenant, des licences, permissions ou
  connecteurs à valider.

Voir [CONTENT_TRUTH_MATRIX.md](docs/CONTENT_TRUTH_MATRIX.md) avant de modifier
une promesse produit.

## Routes principales

- `/` — accueil commercial court;
- `/projd` — présentation produit;
- `/solutions` — parcours par rôle;
- `/modules` et `/modules/[slug]` — catalogue fonctionnel;
- `/tarifs` — repères de prix et entrée vers la proposition;
- `/ressources` — hub documentation, guides, sécurité et démo;
- `/presentation` — présentation commerciale interactive en six diapositives;
- `/documentation` — référence fonctionnelle;
- `/guides` et `/guides/[slug]` — parcours pratiques;
- `/demo` — présentation guidée et accès à la démo fictive;
- `/securite`, `/confidentialite`, `/conditions`, `/statut` — confiance publique;
- `/commander` — demande de proposition assistée.

Routes opérationnelles non indexables :

- `/commander/achat` — checkout historique après qualification;
- `/paiement/retour` — état de retour fournisseur.

Redirection conservée :

- `/fondation` vers `/projd`.

La carte complète vit dans [SITE_MAP.md](docs/SITE_MAP.md).

## Routes serveur

- `POST /api/proposals` — valide et conserve une proposition dans une boîte
  JSONL locale;
- `POST /api/checkout` — demande à Fondation de créer un checkout fournisseur;
- `POST /api/checkout/capture` — handoff de capture PayPal;
- `POST /api/erp-orders` — intake historique avec fallback JSONL;
- `POST /api/analytics` — mesure first-party sans cookie;
- `/healthz`, `/robots.txt`, `/sitemap.xml`.

## Environnement

Valeurs serveur :

- `VITRINE_PROPOSAL_INBOX_PATH` — défaut `/app/data/proposals.jsonl`;
- `VITRINE_ORDER_INBOX_PATH`;
- `FONDATION_ORDER_INTAKE_URL`;
- `FONDATION_CHECKOUT_URL`;
- `FONDATION_CHECKOUT_CAPTURE_URL`;
- `FONDATION_ORDER_INTAKE_TOKEN`.

Valeur publique :

- `NEXT_PUBLIC_SITE_URL`.

Ne jamais déplacer un secret Fondation dans une variable `NEXT_PUBLIC_*`.

## Sécurité du paiement

- `/commander/achat` et `/paiement/retour` restent `noindex`;
- une URL de retour Stripe ne prouve jamais qu’un paiement est réussi;
- Stripe doit rester « en vérification » jusqu’à une confirmation serveur ou
  webhook provenant de Fondation;
- PayPal n’est confirmé qu’après la réponse serveur de capture;
- Vitrine ne crée ni abonnement, ni facture, ni licence, ni runtime ERP.

## Développement et validation

```bash
npm install
npm run dev
```

Avant PR ou déploiement :

```bash
npm run lint
npm run typecheck
npm run build
git diff --check
```

Pour le runtime :

```bash
docker compose up -d --build
docker compose ps
curl -fsS http://127.0.0.1:3103/healthz
```

Tester aussi les erreurs de proposition, l’absence de configuration Fondation,
les refus fournisseur, l’annulation du checkout et les retours Stripe/PayPal.
