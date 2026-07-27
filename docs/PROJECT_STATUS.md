# État du projet Vitrine

Dernière mise à jour : 2026-07-26, America/Toronto.

Branche de travail :

```text
feat/vitrine-50-improvements
```

## Résumé

La refonte B2B multipage est en production. La branche courante consolide
cinquante améliorations autour de la sécurité commerciale, de la conversion,
du contenu, de l'accessibilité, de la mesure et de l'exploitation.

Le détail vérifiable, y compris les dépendances externes qui ne doivent pas être
inventées, se trouve dans `docs/IMPROVEMENTS_50_STATUS.md`.

## État actuel

| Domaine | État | Note |
| --- | --- | --- |
| Shell global | en place | En-tête, menu mobile, pied de page et skip link refondus. |
| Accueil | en place | Cinq blocs courts avec aperçu ERP et renvois spécialisés. |
| Produit et solutions | en place | `/projd`, `/solutions`, `/modules` et détails réécrits. |
| Vérité produit | en place | `site-content.ts` porte `available`, `evolving`, `activation`. |
| Ressources | en place | `/ressources`, `/presentation`, `/documentation`, `/guides` et `/demo`. |
| Confiance | renforcée | En-têtes HTTP, origine, limites, logs redacted, runbooks; validation juridique finale requise. |
| Proposition | fermée par défaut | Formulaire progressif prêt; l’UI et l’API restent fermées sans gouvernance PII complète, endpoint Fondation autorisé et jeton. |
| Checkout historique | fermé par défaut | `/commander/achat` est `noindex`; formulaire et API exigent activation explicite et devis signé. |
| Retour Stripe | sûr et préparé | Polling d'un état autoritaire; reste différé sans endpoint Fondation. |
| Retour PayPal | renforcé, partiel | Capture serveur et anti-rejeu local; validation fournisseur réelle requise. |
| SEO | enrichi | 12 guides, secteurs, rôles, comparaisons, glossaire, sitemap daté et schémas spécialisés. |
| Visuels | enrichi | Capture réelle de la démo fictive et images sociales dynamiques. |
| Analytics | renforcé | App Router, tunnel, attribution limitée, Web Vitals et résumé privé sans PII. |
| Qualité | automatisée | Vitest, Playwright desktop/mobile, Axe, audit, build, Docker smoke et CI. |
| Exploitation | durcie | `/readyz`, image immuable, runtime non-root en lecture seule, SBOM et rollback. |

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
npm test
npm run build
npm run test:e2e
npm audit --omit=dev --audit-level=high
docker compose config --quiet
git diff --check
```

Les résultats finaux de la branche doivent être inscrits dans la pull request
et le suivi de déploiement, après exécution sur l'état Git exact publié.

Smoke recommandé :

- `/`
- `/projd`
- `/solutions`
- `/solutions/direction`
- `/secteurs`
- `/comparer`
- `/glossaire`
- `/scenarios`
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
- `/readyz`

Scénarios d’échec :

- payload de proposition invalide, volumineux ou honeypot;
- boîte JSONL non inscriptible;
- configuration Fondation absente;
- checkout refusé;
- paiement annulé;
- retour Stripe sans confirmation serveur;
- capture PayPal refusée.

## Suivis de production

- avant toute activation, valider le contenu légal, le responsable, la méthode
  de contact officielle et la durée de conservation;
- après activation, traiter, sécuriser, sauvegarder et purger la boîte de
  secours `VITRINE_PROPOSAL_INBOX_PATH`;
- faire valider juridiquement confidentialité et conditions;
- produire la vidéo guidée complémentaire à la capture réelle de la démo
  fictive;
- exécuter les achats Stripe et PayPal en sandbox avec webhooks réels;
- confirmer que Fondation réconcilie paiement, licence et activation;
- surveiller les journaux, les demandes reçues et les retours de paiement après
  la mise en ligne.
