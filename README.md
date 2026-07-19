# Vitrine

Public-facing Fichero website for `fichero.cloud`.

## Local Development

```bash
npm run dev
```

## Validation

```bash
npm run lint
npm run typecheck
npm run build
```

## Docker

```bash
docker compose up -d --build
curl http://127.0.0.1:3103/healthz
```

Production routing is handled by Nginx Proxy Manager on TrueNAS:

```text
fichero.cloud -> http://192.168.0.19:3103
```
