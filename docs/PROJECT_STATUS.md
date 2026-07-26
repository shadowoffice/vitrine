# État du projet Vitrine

Dernière mise à jour : 2026-07-26, America/Toronto.

Branche de travail :

```text
feat/projd-professional-vitrine
```

## Résumé

La refonte transforme Vitrine en site B2B multipage et place la vente assistée
avant le paiement. `/commander` prépare maintenant une proposition courte;
l’ancien parcours de commande est isolé sous `/commander/achat` et reste
`noindex`.

La refonte a été fusionnée dans `main` au commit `6fb688d` et déployée sur
`https://fichero.cloud` le 2026-07-26. Le conteneur public est sain et l'image
précédente est conservée localement pour rollback.

## État actuel

| Domaine | État | Note |
| --- | --- | --- |
| Shell global | en place | En-tête, menu mobile, pied de page et skip link refondus. |
| Accueil | en place | Cinq blocs courts avec aperçu ERP et renvois spécialisés. |
| Produit et solutions | en place | `/projd`, `/solutions`, `/modules` et détails réécrits. |
| Vérité produit | en place | `site-content.ts` porte `available`, `evolving`, `activation`. |
| Ressources | en place | `/ressources`, `/presentation`, `/documentation`, `/guides` et `/demo`. |
| Confiance | en place | Sécurité, confidentialité et conditions existent; validation juridique finale requise. |
| Proposition | en place | `/commander` vers `/api/proposals` et boîte JSONL locale. |
| Checkout historique | isolé | `/commander/achat` est `noindex`; Fondation reste l’autorité. |
| Retour Stripe | sûr côté message | Affiche une vérification, jamais un succès déduit de l’URL. |
| Retour PayPal | partiel | Capture serveur présente; validation fournisseur réelle requise. |
| SEO | en place | Canonicals, sitemap, robots, image OG, 404 et données structurées de l’accueil. |
| Visuels | en place, à enrichir | Identité et aperçu ERP fictif en CSS; vraie capture ProJD encore souhaitable. |
| Analytics | basique | Page views first-party; pas encore de tableau de bord conversion. |

## Contrats importants

- `src/lib/site-content.ts` reste le contenu public canonique.
- Les forfaits restent `starter`, `croissance`, `plateforme`.
- La proposition est l’entrée commerciale prioritaire.
- Le checkout ne doit jamais activer directement ProJD.
- Une URL Stripe ne confirme jamais la transaction.
- OCR, connecteurs et activation sont décrits selon leur niveau réel.

## Validation requise

```bash
npm run lint
npm run typecheck
npm run build
git diff --check
```

Validation locale du 2026-07-26 :

- ESLint réussi;
- TypeScript strict réussi;
- build Next.js réussi, 44 pages générées;
- `git diff --check` réussi;
- Chromium vérifié à 1440 × 1000 et 390 × 844;
- aucun débordement global sur les routes principales;
- menu mobile et clavier de la présentation vérifiés;
- proposition acceptée localement, origine étrangère refusée et honeypot sans
  écriture;
- démo externe et `/healthz` répondent HTTP 200.
- image Docker de production vérifiée sans `.env`, données locales, cache
  Graphify ni dépendance native Sharp;
- smoke public réussi sur les routes principales, la validation des API et
  `/healthz`;
- rendu public vérifié avec Chromium en desktop et mobile, menu mobile inclus,
  sans erreur de console.

Smoke recommandé :

- `/`
- `/projd`
- `/solutions`
- `/modules`
- `/modules/projets`
- `/modules/factures-ocr`
- `/modules/integrations`
- `/tarifs`
- `/ressources`
- `/presentation`
- `/documentation`
- `/guides`
- `/guides/demarrer-un-projet`
- `/demo`
- `/securite`
- `/confidentialite`
- `/conditions`
- `/commander`
- `/commander/achat`
- `/paiement/retour`
- `/statut`
- `/sitemap.xml`
- `/healthz`

Scénarios d’échec :

- payload de proposition invalide, volumineux ou honeypot;
- boîte JSONL non inscriptible;
- configuration Fondation absente;
- checkout refusé;
- paiement annulé;
- retour Stripe sans confirmation serveur;
- capture PayPal refusée.

## Suivis de production

- traiter, sécuriser, sauvegarder et purger la boîte
  `VITRINE_PROPOSAL_INBOX_PATH`;
- valider le contenu légal et une méthode de contact officielle;
- faire valider juridiquement confidentialité et conditions;
- remplacer ou compléter l’aperçu CSS par une vraie capture ProJD avec données
  fictives;
- exécuter les achats Stripe et PayPal en sandbox avec webhooks réels;
- confirmer que Fondation réconcilie paiement, licence et activation;
- surveiller les journaux, les demandes reçues et les retours de paiement après
  la mise en ligne.
