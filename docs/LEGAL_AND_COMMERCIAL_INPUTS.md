# Entrées légales et commerciales à confirmer

Ce document sépare les améliorations qui peuvent être livrées dans la Vitrine
des affirmations qui exigent une décision humaine ou une source externe
vérifiable. Aucun contenu public ne doit deviner ces valeurs.

## Confidentialité et Loi 25

À faire confirmer par le responsable légal :

- nom légal de l'organisation qui exploite `fichero.cloud`;
- nom ou fonction du responsable de la protection des renseignements
  personnels;
- adresse courriel et adresse postale officielles;
- catégories de renseignements recueillis et finalités précises;
- fournisseurs et lieux d'hébergement applicables;
- transferts hors Québec, le cas échéant;
- durée de conservation des propositions, commandes et événements analytiques;
- processus et délai pour les demandes d'accès, de rectification et de
  suppression;
- mécanisme de plainte et date d'entrée en vigueur de la politique.

Tant que ces éléments ne sont pas approuvés, la page publique doit décrire
factuellement le comportement technique et indiquer qu'une validation juridique
reste requise. Elle ne doit pas présenter une politique provisoire comme un avis
juridique final.

Le comportement par défaut applique cette règle : `VITRINE_ENABLE_PROPOSALS`
reste à `false`, le formulaire n’est pas rendu et l’API ne lit, ne stocke ni ne
transmet une proposition. La réouverture exige les valeurs officielles et la
durée approuvée; aucune valeur d’exemple ne doit être utilisée en production.

## Preuves commerciales

Avant de publier une étude de cas ou un témoignage :

- obtenir l'autorisation écrite du client;
- confirmer le nom publiable et le rôle de la personne citée;
- conserver la source de chaque métrique avant/après;
- préciser la période mesurée et le périmètre ProJD concerné;
- éviter toute promesse de conformité, d'économie ou de rendement non démontrée.

Les scénarios fictifs peuvent expliquer un flux de travail, mais doivent rester
explicitement identifiés comme des exemples et ne jamais imiter un témoignage.

## Vente assistée

À confirmer avant d'activer les automatisations correspondantes :

- propriétaire de la file commerciale;
- délai de première réponse et heures de service;
- URL officielle de prise de rendez-vous;
- expéditeur transactionnel, domaine d'envoi et modèles approuvés;
- statuts du pipeline, règles d'assignation et politique d'escalade;
- conditions d'émission, de modification et d'expiration d'un devis signé.

## Paiement

La mise en production du parcours direct reste conditionnée à :

- un identifiant de devis signé et vérifié par Fondation;
- un statut de paiement serveur autoritaire;
- des webhooks Stripe et PayPal validés en sandbox;
- des tests de rejeu, doublon, annulation, retard et réconciliation;
- la confirmation que paiement, facture, licence et activation convergent dans
  Fondation.
