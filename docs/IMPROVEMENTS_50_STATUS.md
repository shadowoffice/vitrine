# Suivi des 50 améliorations

Dernière mise à jour : 2026-07-26, America/Toronto.

Ce suivi distingue le code livrable dans Vitrine des décisions qui appartiennent
à Fondation, aux fournisseurs de paiement ou aux responsables légaux et
commerciaux.

- `livré` : présent dans Vitrine et couvert par une barrière adaptée;
- `préparé` : contrat et comportement sûr présents, activation externe requise;
- `partiel` : gain réel livré, périmètre restant explicitement identifié;
- `externe` : aucune valeur ni preuve n'est inventée dans le site public.

## Sécurité commerciale

| # | Amélioration | État | Résultat ou prochaine condition |
| --- | --- | --- | --- |
| 1 | Intake durable des propositions | préparé | Collecte fermée par défaut; toute ouverture exige endpoint autorisé, jeton, gouvernance PII, client typé, idempotence et secours JSONL. |
| 2 | File commerciale privée | externe | Propriétaire, statuts, SLA, notes et audit doivent vivre dans la surface privée Fondation/CRM. |
| 3 | Confidentialité conforme à la Loi 25 | préparé | Entrées manquantes consignées; aucun formulaire ni API de collecte ne s’ouvre sans responsable, contact et durée officiels. |
| 4 | Cycle de vie des renseignements | partiel | Activation exige une durée bornée; fichiers mode `0600`, rotation, sauvegarde/restauration et purge documentées; chiffrement et exécution de la purge restent opérationnels. |
| 5 | Protection anti-abus uniforme | partiel | Origine, proxy de confiance, rate limit borné et honeypot partagés; défi adaptatif à ajouter seulement si le risque le justifie. |
| 6 | Limite réelle des requêtes | livré | Requêtes et réponses Fondation lues en flux avec plafond d'octets. |
| 7 | Devis signé avant paiement | préparé | Checkout fermé par défaut; toute activation exige vérification HMAC liée au devis, plan, sièges et courriel. L'émission reste dans Fondation. |
| 8 | Idempotence de bout en bout | préparé | Clés stables par tentative générées/propagées et rejeu PayPal bloqué localement; persistance autoritaire à confirmer dans Fondation. |
| 9 | Statut Stripe autoritaire | préparé | Route de statut et polling borné livrés; sans endpoint Fondation, l'interface reste honnêtement en vérification différée. |
| 10 | PayPal fiable | partiel | Capture serveur et anti-rejeu local livrés; sandbox, webhooks et réconciliation réels restent à valider. |

## Conversion et ventes

| # | Amélioration | État | Résultat ou prochaine condition |
| --- | --- | --- | --- |
| 11 | Prise de rendez-vous qualifiée | préparé | CTA affiché seulement avec une URL HTTPS officielle configurée au build. |
| 12 | Accusé de réception transactionnel | préparé | Référence et prochaine étape sont affichées; expéditeur, domaine et modèles courriel restent à fournir. |
| 13 | Formulaire par étapes | partiel | Deux étapes, progression, valeurs conservées après erreur, validation et focus accessible; aucune PII n'est persistée dans le navigateur. |
| 14 | Assistant de choix de forfait | livré | Recommandation selon équipe et priorités, sans modifier la source tarifaire canonique. |
| 15 | Calculateur de coût | livré | Sièges, mensuel, implantation et première année sont détaillés. |
| 16 | Matrice comparative | livré | Modules, accès, accompagnement et limites comparés par forfait. |
| 17 | Prix transparents | livré | Aujourd'hui, récurrence, accès additionnels, taxes, renouvellement et exclusions sont explicités. |
| 18 | Modules dans la proposition | livré | Modules et contexte d'arrivée préremplis et validés. |
| 19 | Études de cas vérifiées | préparé | Scénarios reproductibles explicitement fictifs livrés; témoignages réels attendent preuves et autorisations. |
| 20 | Démonstration visuelle réelle | partiel | Capture réelle de l'instance de démo fictive intégrée; vidéo guidée à produire ultérieurement. |

## Contenu et SEO

| # | Amélioration | État | Résultat ou prochaine condition |
| --- | --- | --- | --- |
| 21 | Pages par métier et secteur | livré | Parcours par rôle et par secteur avec contenu spécialisé. |
| 22 | Douze guides utiles | livré | Catalogue porté de 4 à 12 guides reliés au produit. |
| 23 | Comparaisons factuelles | livré | Pages Excel, SharePoint et approche généraliste sans promesse invérifiable. |
| 24 | Glossaire construction/ERP Québec | livré | Définitions métier reliées aux modules et guides pertinents. |
| 25 | Données structurées FAQ | livré | `FAQPage` généré depuis les questions visibles. |
| 26 | Schémas enrichis | livré | Breadcrumbs, articles, produit et offres structurés selon le type de page. |
| 27 | Images sociales par page | livré | Images Open Graph dynamiques pour guides, modules et secteurs. |
| 28 | Sitemap précis | livré | Nouvelles familles incluses avec dates de modification explicites. |
| 29 | Recherche et filtres internes | partiel | Recherche accessible sur guides et modules; navigation spécialisée conservée pour les solutions. |
| 30 | Maillage éditorial | livré | Guides, modules, solutions, scénarios, tarifs et CTA se renvoient mutuellement. |

## Mesure, UX et performance

| # | Amélioration | État | Résultat ou prochaine condition |
| --- | --- | --- | --- |
| 31 | Pages vues App Router | livré | Chaque changement de chemin ou de recherche produit une nouvelle page vue. |
| 32 | Tunnel complet | livré | Neuf événements couvrent proposition, recommandation, calcul, retour et statut du paiement. |
| 33 | Tableau de conversion privé | partiel | Résumé CLI agrégé, borné et sans PII; interface privée graphique non incluse dans Vitrine. |
| 34 | Attribution respectueuse | livré | UTM limités à une allowlist de dimensions, sans identifiant persistant. |
| 35 | Expérimentation contrôlée | préparé | Variante `control`/`clarity` propagée; hypothèse, durée et décision restent à consigner avant activation. |
| 36 | Web Vitals réels | livré | LCP, INP et CLS envoyés au collecteur first-party avec chemin seulement. |
| 37 | Erreurs de formulaire accessibles | livré | Erreurs par champ, résumé, focus, `aria-invalid` et `aria-describedby`. |
| 38 | Barrière WCAG 2.2 AA | livré | Axe bloquant, clavier, profils desktop/mobile, contraste et reduced motion automatisés. |
| 39 | Réduction du JavaScript client | partiel | Pages et contenu restent serveur; seuls filtres, analytics, calculateur et formulaires sont interactifs. |
| 40 | Modularisation des styles | partiel | Nouvelles familles regroupées et budgets de qualité documentés; `globals.css` reste à fractionner. |

## Ingénierie et exploitation

| # | Amélioration | État | Résultat ou prochaine condition |
| --- | --- | --- | --- |
| 41 | Validation des variables | livré | Schéma Zod `server-only`, erreurs de préparation explicites et valeurs publiques transmises au build. |
| 42 | Client Fondation typé | livré | Une seule couche valide destination, jeton, requête et réponse d'exécution. |
| 43 | Timeouts et destinations | livré | AbortSignal, plafond de réponse, redirection refusée et allowlist d'hôtes. |
| 44 | Observabilité exploitable | partiel | Request IDs, logs JSON redacted, `/healthz` et `/readyz`; alertes externes à brancher. |
| 45 | Tests unitaires métier | livré | Tarifs, sièges, validation, normalisation, devis signé et résumé analytics couverts. |
| 46 | Tests d'intégration API | livré | Origine, média, payload, configuration, indisponibilité et contrats Fondation testés. |
| 47 | Tests Playwright | livré | Parcours desktop/mobile, clavier, formulaire, en-têtes et Axe. |
| 48 | CI obligatoire | préparé | Trois jobs CI livrés; protection de `main` à activer dans les paramètres GitHub. |
| 49 | En-têtes HTTP sécurisés | livré | CSP, anti-framing, `nosniff`, HSTS, referrer et permissions testés. |
| 50 | Déploiements Docker immuables | livré | Base épinglée, runtime non-root/lecture seule, SHA OCI, SBOM, scan, smoke et rollback documenté. |

## Gates externes avant activation complète

Les entrées restantes ne bloquent pas la publication des améliorations
éditoriales, UX, qualité ou de sécurité à comportement sûr. Elles bloquent
toute prétention à un tunnel commercial complètement automatisé :

1. identité et contact officiels du responsable de la vie privée;
2. propriétaire, SLA et traitement durable des propositions;
3. URL officielle de rendez-vous et expéditeur transactionnel;
4. émission de devis signés et endpoint de statut dans Fondation;
5. validations Stripe/PayPal sandbox, webhooks et réconciliation;
6. protection de branche GitHub rendant les trois jobs CI obligatoires.
