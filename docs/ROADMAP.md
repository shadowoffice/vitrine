# Feuille de route Vitrine

## Priorité 1 — Activer les dépendances commerciales

- fournir l'endpoint Fondation durable pour les propositions;
- définir le propriétaire, le SLA, les statuts et l'escalade de la file;
- configurer l'URL officielle de rendez-vous et l'expéditeur transactionnel;
- approuver les entrées légales listées dans
  `docs/LEGAL_AND_COMMERCIAL_INPUTS.md`;
- activer les devis signés seulement avec un émetteur et une rotation de secret;
- exposer un statut de paiement autoritaire depuis Fondation.

## Priorité 2 — Qualifier les paiements

- tester Stripe et PayPal en sandbox;
- vérifier signatures webhook, idempotence, rejeu, annulation et retard;
- confirmer facture, abonnement, licence et activation dans Fondation;
- conserver l'état « vérification différée » tant que le statut autoritaire
  n'est pas disponible.

## Priorité 3 — Publier les barrières qualité

- publier la version validée de la branche de refonte;
- refaire les smoke tests sur l'URL publique;
- vérifier les journaux de propositions, d'analytics et de checkout;
- rendre les trois jobs CI obligatoires dans la protection de `main`;
- conserver le SHA, le SBOM et le tag de rollback de chaque déploiement.

## Priorité 4 — Consolider la vérité produit

- synchroniser `docs/CONTENT_TRUTH_MATRIX.md` avec l’état réel de ProJD;
- garder `site-content.ts` comme contenu canonique;
- identifier clairement `available`, `evolving` et `activation`;
- ne jamais présenter OCR, conformité ou connecteurs comme universellement
  actifs;
- ajouter de vraies captures utilisant uniquement les données fictives de démo.

## Priorité 5 — Consolider confiance, contenu et SEO

- valider confidentialité et conditions avec le responsable légal;
- ajouter une méthode de contact officielle;
- maintenir les nouvelles routes dans le sitemap;
- enrichir les données structurées au besoin;
- vérifier les canonicals et maintenir `noindex` sur
  `/commander/achat` et `/paiement/retour`;
- transformer les guides en points d'entrée SEO utiles, sans contenu générique.
- ajouter des études de cas seulement avec métriques sourcées et autorisations;
- produire une courte vidéo guidée depuis des données de démo fictives;
- ajouter une recherche dédiée aux parcours par rôle si le volume le justifie.

## Priorité 6 — Performance et maintenance

- fractionner progressivement `globals.css` par famille de pages;
- mesurer les budgets CSS/JavaScript et les Web Vitals en production;
- remplacer les limites mémoire par un magasin partagé si plusieurs réplicas
  sont déployés;
- brancher métriques et alertes sur les événements serveur structurés;
- tenir `README.md`, `SITE_MAP.md`, `ARCHITECTURE.md`,
  `IMPROVEMENTS_50_STATUS.md` et l'état projet alignés.
