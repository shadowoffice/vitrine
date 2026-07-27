# Exploitation de Vitrine

Vitrine tourne dans le conteneur `fichero-vitrine`, écoute sur
`127.0.0.1:3103` pour les contrôles locaux et sur l’adresse de service privée
`${VITRINE_PROXY_BIND_IP:-192.168.0.19}:3103` pour Nginx Proxy Manager. Elle
conserve ses files JSONL dans le bind mount `./data:/app/data`.
Fondation reste l’autorité pour la qualification commerciale, le paiement et
l’activation.

## Invariants de production

- Ne jamais embarquer `.env`, jetons, fichiers JSONL ou données Graphify dans
  l’image.
- Ne jamais déduire un paiement réussi depuis une URL de retour.
- Ne jamais supprimer le répertoire `./data` pendant un déploiement.
- Ne pas utiliser `docker compose down -v`.
- Ne jamais republier le port `3103` sur toutes les interfaces. La liaison LAN
  doit viser l’adresse privée explicite de Vitrine et la chaîne
  `DOCKER-USER` doit n’accepter que l’adresse du proxy
  (`192.168.0.38` actuellement); Nginx Proxy Manager reste l’unique frontière
  HTTP publique et le seul proxy de confiance.
- Conserver une image de rollback et une sauvegarde des données avant la
  bascule.
- Exécuter le conteneur en lecture seule; seul `/app/data` et le `tmpfs`
  `/tmp` sont inscriptibles.

Le Dockerfile épingle l’image Node par digest et inscrit les labels OCI
`revision`, `version` et `created`. Compose retire toutes les capacités Linux,
active `no-new-privileges`, limite mémoire et processus, utilise un init et
fait tourner ses journaux Docker.

## Santé

La vivacité confirme uniquement que le processus répond :

```bash
curl -fsS http://127.0.0.1:3103/healthz
```

La préparation valide aussi la configuration et l’écriture des trois files
JSONL :

```bash
curl -fsS http://127.0.0.1:3103/readyz
```

Une vivacité saine avec une préparation en échec signifie généralement :

- une variable serveur invalide;
- un endpoint Fondation présent sans jeton ou hors allowlist;
- un secret de devis signé absent alors que l’option est obligatoire;
- un propriétaire ou mode incorrect sur `./data`.

Après un déploiement :

```bash
docker compose ps
docker inspect fichero-vitrine --format '{{.State.Health.Status}}'
curl -fsS https://fichero.cloud/healthz
curl -fsS https://fichero.cloud/readyz
curl -fsSI https://fichero.cloud | sed -n '1,20p'
docker logs --tail 100 fichero-vitrine
```

## Configuration serveur

Toutes les valeurs sensibles restent dans l’environnement local et ne sont
jamais commitées. Compose transmet notamment :

- `NEXT_PUBLIC_SITE_URL`, l’URL de rendez-vous commercial et la variante
  marketing au stage de build, car Next.js fige ces valeurs publiques;
- les URLs intake, proposition, checkout, capture et statut Fondation;
- `FONDATION_ORDER_INTAKE_TOKEN`;
- l’allowlist des hôtes Fondation et le timeout réseau;
- les origines publiques autorisées et le nombre de proxies de confiance;
- l’activation des propositions, le responsable et courriel officiels, ainsi
  que la durée de conservation;
- l'activation du checkout, l'obligation des devis signés et leur secret;
- les chemins et limites des files JSONL.

`VITRINE_PROXY_BIND_IP` n’est pas un secret. Sa valeur par défaut correspond à
l’adresse privée documentée dans `OPENCLAW.md`; la changer exige de vérifier
simultanément l’upstream du proxy et la règle hôte `DOCKER-USER`.

`VITRINE_ENABLE_CHECKOUT` reste `false` par défaut. Pour le passer à `true`,
`VITRINE_REQUIRE_SIGNED_QUOTE=true`, un secret de signature valide, un endpoint
checkout autorisé et le jeton Fondation sont tous obligatoires. `/readyz`
refuse la bascule si un seul de ces éléments manque.

`VITRINE_ENABLE_PROPOSALS` reste aussi `false` par défaut. Sa mise à `true`
exige simultanément `VITRINE_PRIVACY_OFFICER_NAME`,
`VITRINE_PRIVACY_CONTACT_EMAIL`, une valeur
`VITRINE_PROPOSAL_RETENTION_DAYS` comprise entre `1` et `3650`, un
`FONDATION_PROPOSAL_INTAKE_URL` dont l’hôte est autorisé et le jeton Fondation.
Tant que la barrière est fermée, l’API répond `503` avant de lire ou persister
le corps, `/commander` ne rend aucun formulaire et `/readyz` ignore la file de
propositions inactive.

Les chemins par défaut dans le conteneur sont :

```text
/app/data/proposals.jsonl
/app/data/erp-orders.jsonl
/app/data/analytics-events.jsonl
```

Le répertoire hôte doit appartenir à l’UID/GID `1001:1001` ou lui être
inscriptible, et ne doit pas être servi par le proxy public.

## Résumé privé du tunnel

Le résumé analytics agrège uniquement des compteurs connus par journée en
heure de Toronto. Il n’affiche jamais les chemins visités, référents ou
contextes bruts :

```bash
npm run analytics:summary -- --days 30
```

Pour une copie ou un chemin différent :

```bash
npm run analytics:summary -- \
  --days 90 \
  --file /chemin/securise/analytics-events.jsonl
```

La lecture est bornée aux 16 derniers Mio et à 250 000 lignes. Les lignes
invalides, trop longues, futures ou hors fenêtre sont comptées puis ignorées.
Les indicateurs `truncatedByBytes` et `truncatedByLines` signalent une synthèse
partielle. La sortie JSON va sur stdout et peut être redirigée vers une surface
interne protégée.

## Sauvegarde

Les propositions et commandes contiennent des renseignements personnels. Les
sauvegardes doivent être chiffrées au repos, limitées aux opérateurs autorisés
et ne jamais être copiées dans Git ou dans une image Docker.

Pour une sauvegarde cohérente avec une courte interruption :

```bash
install -d -m 700 backups
backup_stamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup_file="backups/vitrine-data-${backup_stamp}.tar.gz"

docker compose stop -t 20 vitrine
tar --create --gzip --file "$backup_file" --directory data .
chmod 600 "$backup_file"
sha256sum "$backup_file" > "${backup_file}.sha256"
docker compose start vitrine
curl -fsS http://127.0.0.1:3103/readyz
```

Sur un hôte offrant des snapshots cohérents, préférer un snapshot du volume
sans interruption. Tester régulièrement la restauration dans un répertoire
temporaire isolé :

```bash
restore_directory="$(mktemp -d)"
tar --extract --gzip --file "$backup_file" --directory "$restore_directory"
find "$restore_directory" -maxdepth 2 -type f -print
```

Inspecter les modes, le nombre de lignes et quelques objets strictement sur
l’hôte sécurisé; ne jamais afficher les lignes complètes dans un journal CI.

## Rotation, conservation et purge

L’application fait tourner automatiquement :

- propositions : 20 Mio, 10 rotations;
- commandes : 25 Mio, 10 rotations;
- analytics : 5 Mio et 5 rotations par défaut, configurables.

La rotation protège le disque, mais ne remplace pas une politique de
conservation. Le responsable de la vie privée doit approuver les durées pour
les prospects, commandes, analytics et sauvegardes.

Avant toute purge :

1. vérifier la dernière sauvegarde restaurable;
2. afficher uniquement les noms, dates et tailles des fichiers candidats;
3. déplacer les candidats dans une quarantaine chiffrée et restreinte;
4. attendre la fenêtre de récupération approuvée;
5. supprimer définitivement après validation du responsable.

Inventaire non destructif des rotations de plus de 90 jours :

```bash
find data -maxdepth 1 -type f -name '*.jsonl.*' -mtime +90 \
  -printf '%TY-%Tm-%Td %s %p\n' | sort
```

Ne pas automatiser la dernière étape tant que les durées légales et la
responsabilité opérationnelle ne sont pas confirmées.

## Construction et déploiement immuables

Préparer le SHA, la date déterministe du commit et une étiquette de rollback :

```bash
candidate_sha="$(git rev-parse HEAD)"
candidate_created="$(git show -s --format=%cI "$candidate_sha")"
rollback_tag="rollback-$(date -u +%Y%m%dT%H%M%SZ)"
running_image_id="$(docker inspect fichero-vitrine --format '{{.Image}}')"
docker image tag "$running_image_id" "fichero-vitrine:$rollback_tag"
```

Construire et tester la candidate :

```bash
VITRINE_IMAGE_TAG="$candidate_sha" \
VITRINE_IMAGE_REVISION="$candidate_sha" \
VITRINE_IMAGE_VERSION="$candidate_sha" \
VITRINE_IMAGE_CREATED="$candidate_created" \
  docker compose build --pull vitrine

scripts/docker-smoke.sh "fichero-vitrine:$candidate_sha"
```

Basculer sans reconstruire :

```bash
VITRINE_IMAGE_TAG="$candidate_sha" \
  docker compose up -d --no-build --force-recreate vitrine

docker compose ps
curl -fsS http://127.0.0.1:3103/readyz
curl -fsS https://fichero.cloud/healthz
```

Noter le SHA déployé et le tag de rollback dans le suivi de production.

## SBOM et vulnérabilités

La CI génère un artefact SPDX avec Syft et bloque sur les vulnérabilités HIGH
ou CRITICAL corrigibles avec Trivy.

Équivalent local si Syft et Trivy sont installés :

```bash
install -d -m 700 output
syft "fichero-vitrine:$candidate_sha" \
  --output "spdx-json=output/vitrine-${candidate_sha}.spdx.json"
trivy image --ignore-unfixed --severity HIGH,CRITICAL \
  --exit-code 1 "fichero-vitrine:$candidate_sha"
```

Conserver le SBOM avec les artefacts du déploiement. Lors d’une mise à jour du
digest Node, reconstruire, rescanner et refaire le smoke avant la bascule.

## Rollback

Le rollback ne touche pas `./data` :

```bash
VITRINE_IMAGE_TAG="$rollback_tag" \
  docker compose up -d --no-build --force-recreate vitrine

docker compose ps
curl -fsS http://127.0.0.1:3103/readyz
curl -fsS https://fichero.cloud/healthz
docker logs --tail 100 fichero-vitrine
```

Si la candidate a écrit un format incompatible dans `./data`, arrêter
Vitrine, restaurer uniquement depuis la sauvegarde validée, corriger les modes
et redémarrer l’image de rollback. Une restauration de données est une action
distincte et plus risquée qu’un simple rollback d’image.
