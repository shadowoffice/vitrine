# Feuille de route Vitrine

## Priorité 1 — Déployer la refonte multipage

- publier la version validée de la branche de refonte;
- refaire les smoke tests sur l’URL publique;
- vérifier les journaux de propositions, d’analytics et de checkout;
- confirmer que l’accueil public reste court après le déploiement.

## Priorité 2 — Opérer la vente assistée

- traiter `/commander` comme CTA commercial principal;
- documenter le responsable et le délai de suivi des propositions;
- protéger, sauvegarder, faire tourner et purger
  `VITRINE_PROPOSAL_INBOX_PATH`;
- ajouter une exportation ou une vue interne des propositions;
- mesurer proposition commencée, envoyée et échouée sans identifiant visiteur;
- ajouter protection anti-abus si le trafic le justifie.

## Priorité 3 — Consolider la vérité produit

- synchroniser `docs/CONTENT_TRUTH_MATRIX.md` avec l’état réel de ProJD;
- garder `site-content.ts` comme contenu canonique;
- identifier clairement `available`, `evolving` et `activation`;
- ne jamais présenter OCR, conformité ou connecteurs comme universellement
  actifs;
- ajouter de vraies captures utilisant uniquement les données fictives de démo.

## Priorité 4 — Consolider confiance et SEO

- valider confidentialité et conditions avec le responsable légal;
- ajouter une méthode de contact officielle;
- maintenir les nouvelles routes dans le sitemap;
- enrichir les données structurées au besoin;
- vérifier les canonicals et maintenir `noindex` sur
  `/commander/achat` et `/paiement/retour`;
- transformer les guides en points d’entrée SEO utiles, sans contenu générique.

## Priorité 5 — Qualifier le checkout historique

- conserver `/commander/achat` après la proposition, jamais comme CTA principal;
- tester Stripe et PayPal en sandbox;
- vérifier signatures webhook, idempotence et erreurs fournisseur;
- ne jamais confirmer Stripe à partir d’un paramètre URL;
- afficher un succès uniquement depuis un état serveur autoritaire;
- confirmer facture, abonnement, licence et activation dans Fondation.

## Priorité 6 — Exploitation

- rebuild et redéployer `fichero-vitrine`;
- vérifier `https://fichero.cloud` et `/healthz`;
- surveiller les erreurs de proposition, checkout et analytics;
- tenir `README.md`, `SITE_MAP.md`, `ARCHITECTURE.md` et l’état projet alignés
  après chaque changement de parcours.
