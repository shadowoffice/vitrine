# Barrières qualité de Vitrine

Ce document décrit les vérifications requises avant fusion et avant
déploiement. La référence d’exécution est Node.js 22 avec les dépendances
verrouillées par `package-lock.json`.

## Validation locale

Installer exactement les dépendances verrouillées, puis exécuter les barrières
rapides :

```bash
npm ci
npm run lint
npm run typecheck
npm run test:unit
npm audit --omit=dev --audit-level=high
npm run build
git diff --check
```

`npm test` est un alias de `npm run test:unit`. Les tests unitaires utilisent
Vitest en environnement Node.js et couvrent :

- les calculs de forfaits et de sièges;
- la normalisation des domaines ERP et codes promotionnels;
- les schémas de propositions et commandes;
- les garde-types des réponses Fondation;
- les contrats d’erreur, d’origine et d’indisponibilité des routes publiques;
- le résumé analytics sans dimensions brutes.

Les modules marqués `server-only` restent protégés en production. Vitest
résout uniquement ce marqueur vers un module vide de test; aucune fonction
serveur n’est remplacée.

## Parcours navigateur

Playwright vise Chromium en profils bureau et mobile. La suite vérifie la page
d’accueil, la navigation, le menu mobile, les parcours clavier, les contraintes
du formulaire, une soumission simulée et les en-têtes HTTP. Axe analyse
l’accueil, les tarifs et la proposition en profil bureau; toute violation
automatisée `serious` ou `critical` bloque la suite.

Playwright lance `next start` sur le port `3104`; un build doit donc exister :

```bash
npm run build
npx playwright install chromium
npm run test:e2e
```

La CI utilise plutôt :

```bash
npx playwright install --with-deps chromium
```

Pour vérifier une candidate déjà accessible sans démarrer un serveur local :

```bash
PLAYWRIGHT_BASE_URL=https://candidate.example.test npm run test:e2e
```

La route de proposition est interceptée dans le navigateur; cette vérification
n’écrit donc pas de prospect réel, même contre une URL distante.

Les rapports et traces sont déposés sous `output/`, déjà ignoré par Git.

## Image et Compose

Valider la syntaxe Compose, construire une candidate puis exécuter son smoke
durci :

```bash
docker compose config --quiet

candidate_sha="$(git rev-parse HEAD)"
candidate_created="$(git show -s --format=%cI "$candidate_sha")"
docker build --pull \
  --build-arg BUILD_DATE="$candidate_created" \
  --build-arg VCS_REF="$candidate_sha" \
  --build-arg VERSION="$candidate_sha" \
  --tag "fichero-vitrine:$candidate_sha" \
  .

scripts/docker-smoke.sh "fichero-vitrine:$candidate_sha"
```

Le smoke démarre un conteneur temporaire sans capacités Linux, en lecture
seule, avec limites de mémoire et de processus. Il confirme :

- la réponse de santé;
- les en-têtes CSP, anti-framing et `nosniff`;
- l’impossibilité d’écrire dans la racine du conteneur;
- la possibilité d’écrire dans `/app/data`;
- l’absence de `.env` dans l’image.
- la fermeture sûre du checkout direct dans la configuration par défaut.
- la fermeture sûre de la collecte de propositions par défaut.

## CI GitHub

Le workflow `.github/workflows/ci.yml` s’exécute sur chaque pull request et
chaque push vers `main`. Il publie trois résultats distincts :

- `lint-type-test-build`;
- `chromium-e2e`;
- `container-smoke-scan`.

Les paramètres de protection de `main` dans GitHub doivent rendre ces trois
résultats obligatoires. Le fichier de workflow ne peut pas activer lui-même la
protection de branche.

Le job conteneur :

1. construit une image portant le SHA Git et la date du commit;
2. exécute le smoke durci;
3. produit un SBOM SPDX comme artefact;
4. bloque sur les vulnérabilités runtime HIGH ou CRITICAL corrigibles.

Les actions tierces sont épinglées à leurs SHA Git.

## Politique CSP

La CSP est définie dans `next.config.ts` pour conserver la génération statique.
Next.js et les blocs JSON-LD rendent encore des scripts intégrés; la politique
autorise donc `script-src 'unsafe-inline'` et les styles intégrés, mais :

- n’autorise jamais `unsafe-eval` en production;
- interdit les scripts dans les attributs;
- interdit objets et iframes;
- limite formulaires, connexions, images et polices aux sources nécessaires;
- ajoute `upgrade-insecure-requests` et HSTS seulement en production.

Une CSP avec nonce serait plus stricte, mais Next.js 16 imposerait alors le
rendu dynamique de toutes les pages et désactiverait l’optimisation statique.
Ce changement doit faire l’objet d’une décision d’architecture et de mesures
de performance.

## Entretien des dépendances

Le digest multiarchitecture de `node:22-alpine` est épinglé dans le Dockerfile.
Pour le mettre à jour :

```bash
docker buildx imagetools inspect node:22-alpine
```

Une mise à jour du digest doit passer l’ensemble des barrières et le scan
Trivy. L’audit obligatoire porte sur les dépendances livrées en production.
L’audit complet peut aussi signaler des vulnérabilités dans les outils de
développement; elles doivent être suivies sans forcer une version majeure
incompatible d’ESLint ou de ses plugins.
