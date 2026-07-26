# Matrice de vérité produit

Source publique canonique : `src/lib/site-content.ts`.

Dernière vérification : 2026-07-26, à partir du contenu Vitrine et de
`ProJD/docs/PROJECT_STATUS.md`.

## Niveaux

- `available` / Disponible : le périmètre décrit est utilisable maintenant.
  Cela ne signifie pas que chaque configuration client ou intégration est
  active.
- `evolving` / En évolution : une première tranche fonctionne, mais une partie
  importante reste à approfondir. Le texte doit distinguer le présent du
  prochain jalon.
- `activation` / Sur activation : la fondation existe, mais l’usage dépend du
  tenant, des licences, permissions fournisseur, données et tests
  d’implantation.

## Modules

| Module | Niveau | Preuve publique acceptable | Limite à dire clairement |
| --- | --- | --- | --- |
| Projets et coordination | `available` | Cockpit, kit de démarrage, RFIs/submittals et rapport hebdomadaire. | Certaines synchronisations externes restent dépendantes des accès. |
| Finance construction | `available` | Phases, codes, budgets, engagements, coûts directs, sommaires et CSV. | Ne pas revendiquer une comptabilité générale ou conformité automatique. |
| Contrats | `evolving` | Contrat-chantier, directives, avenants, addenda, import de devis et première analyse. | Facturation contractuelle et parité complète continuent d’évoluer. |
| Estimation et BID | `available` | Import XLSX, assistant BID, courriels M365, documents, portail et comparaison. | Les connecteurs documentaires avancés peuvent demander une activation. |
| Documents et synchronisation | `evolving` | Mappages, aperçu, sync/no-sync et contrôles privés. | Ne pas promettre une synchronisation universelle ou bidirectionnelle. |
| Comptes fournisseurs | `evolving` | Fournisseurs, factures PDF, ventilation, approbation et âge des comptes. | OCR automatisé non disponible; validation humaine obligatoire. |
| Réseau partenaires | `available` | Imports autorisés, contacts, spécialités, statuts et historique. | Ne pas présenter le répertoire comme une validation légale des partenaires. |
| Portail partenaires | `available` | Liens ciblés et expirants, documents, accusés, réponses et dépôts privés. | Ne pas promettre un portail SSO complet pour tous les clients. |
| Rapports et direction | `available` | Vues exécutives, sommaires financiers, rapports hebdomadaires, impression et CSV. | Les exports et rapports continuent de s’enrichir. |
| Intégrations et API | `activation` | Fondations Procore, Microsoft Graph, mappages et API ERP en lecture avec audit. | Activation selon tenant, scopes, licences, permissions et tests. |

## Règles transversales

- Les données et métriques de `/demo` sont fictives et doivent être nommées
  comme telles.
- Aucune conformité CCQ, RBQ, CNESST, Revenu Québec ou fiscale ne doit être
  garantie sans validation juridique et workflow vérifié.
- L’OCR ne doit jamais être décrit comme comptabilisant automatiquement une
  facture.
- Procore, SharePoint et Microsoft 365 restent des systèmes connectés; ProJD
  conserve le workflow, la décision, la provenance et le reporting ERP.
- Les tarifs sont des repères commerciaux. `/commander` qualifie le périmètre
  avant le checkout historique.
- `VITRINE_PROPOSAL_INBOX_PATH` confirme seulement la réception d’une demande,
  jamais une commande, un paiement ou une activation.
- `/commander/achat` est réservé aux propositions déjà cadrées et reste
  `noindex`.
- Une URL de retour Stripe ne prouve jamais un paiement. Seul un état serveur
  autoritaire peut confirmer la transaction.
- PayPal ne peut être présenté comme capturé qu’après la réponse serveur de
  capture.

## Processus de mise à jour

1. Vérifier l’état réel dans ProJD.
2. Mettre à jour le module dans `src/lib/site-content.ts`.
3. Ajuster cette matrice dans le même changement.
4. Vérifier `/modules`, le détail concerné, `/documentation`, `/demo` et les
   guides reliés.
5. Abaisser le niveau en cas de doute; ne jamais combler une incertitude par une
   promesse commerciale.
