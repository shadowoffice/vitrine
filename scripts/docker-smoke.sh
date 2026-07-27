#!/usr/bin/env bash

set -euo pipefail

image_ref="${1:?Usage: scripts/docker-smoke.sh <image-ref>}"
run_id="${GITHUB_RUN_ID:-local}"
run_attempt="${GITHUB_RUN_ATTEMPT:-$$}"
container_name="vitrine-smoke-${run_id}-${run_attempt}"
container_created=0

cleanup() {
  if [[ "$container_created" -eq 1 ]]; then
    docker rm --force "$container_name" >/dev/null 2>&1 || true
  fi
}

show_failure() {
  docker logs "$container_name" 2>&1 || true
}

trap cleanup EXIT INT TERM

docker image inspect "$image_ref" >/dev/null

docker run \
  --cap-drop ALL \
  --detach \
  --init \
  --memory 768m \
  --name "$container_name" \
  --pids-limit 256 \
  --read-only \
  --security-opt no-new-privileges \
  --tmpfs /app/data:rw,nosuid,nodev,size=16m,mode=1777 \
  --tmpfs /tmp:rw,noexec,nosuid,nodev,size=64m,mode=1777 \
  "$image_ref" >/dev/null
container_created=1

ready=0
for _attempt in $(seq 1 30); do
  if docker exec "$container_name" node -e "
    fetch('http://127.0.0.1:3000/healthz')
      .then(async (response) => {
        const body = await response.json();
        const headers = response.headers;
        if (!response.ok || body.status !== 'ok' || body.service !== 'vitrine') {
          process.exit(1);
        }
        if (
          headers.get('x-content-type-options') !== 'nosniff' ||
          headers.get('x-frame-options') !== 'DENY' ||
          !headers.get('content-security-policy')?.includes(\"default-src 'self'\")
        ) {
          process.exit(1);
        }
      })
      .catch(() => process.exit(1));
  " >/dev/null 2>&1; then
    ready=1
    break
  fi

  sleep 2
done

if [[ "$ready" -ne 1 ]]; then
  show_failure
  exit 1
fi

docker exec "$container_name" node -e "
  fetch('http://127.0.0.1:3000/readyz')
    .then(async (response) => {
      const body = await response.json();
      if (!response.ok || body.status !== 'ready' || body.check !== 'readiness') {
        process.exit(1);
      }
    })
    .catch(() => process.exit(1));
"

docker exec "$container_name" node -e "
  fetch('http://127.0.0.1:3000/api/checkout', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'idempotency-key': 'docker-smoke-checkout-disabled',
      origin: 'https://fichero.cloud',
    },
    body: '{}',
  })
    .then(async (response) => {
      const body = await response.json();
      if (
        response.status !== 503 ||
        body.status !== 'failed' ||
        body.checkoutUrl !== null
      ) {
        process.exit(1);
      }
    })
    .catch(() => process.exit(1));
"

docker exec "$container_name" node -e "
  fetch('http://127.0.0.1:3000/api/proposals', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'idempotency-key': 'docker-smoke-proposals-disabled',
      origin: 'https://fichero.cloud',
    },
    body: '{}',
  })
    .then(async (response) => {
      const body = await response.json();
      if (response.status !== 503 || body.status !== 'failed') {
        process.exit(1);
      }
    })
    .catch(() => process.exit(1));
"

if docker exec "$container_name" node -e "
  require('node:fs').writeFileSync('/app/.root-filesystem-must-be-read-only', 'x');
" >/dev/null 2>&1; then
  echo "The container root filesystem is unexpectedly writable." >&2
  exit 1
fi

docker exec "$container_name" node -e "
  const fs = require('node:fs');
  const probe = '/app/data/.write-probe';
  fs.writeFileSync(probe, 'ok', { mode: 0o600 });
  fs.unlinkSync(probe);
  if (fs.existsSync('/app/.env') || fs.existsSync('/app/.env.local')) {
    process.exit(1);
  }
"

echo "Hardened container smoke passed for ${image_ref}."
