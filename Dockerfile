ARG NODE_IMAGE=node:22-alpine@sha256:16e22a550f3863206a3f701448c45f7912c6896a62de43add43bb9c86130c3e2

FROM ${NODE_IMAGE} AS deps
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package*.json ./
RUN npm ci --no-audit --no-fund

FROM ${NODE_IMAGE} AS build
ARG NEXT_PUBLIC_MARKETING_VARIANT=
ARG NEXT_PUBLIC_SALES_BOOKING_URL=
ARG NEXT_PUBLIC_SITE_URL=https://fichero.cloud

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_MARKETING_VARIANT=${NEXT_PUBLIC_MARKETING_VARIANT}
ENV NEXT_PUBLIC_SALES_BOOKING_URL=${NEXT_PUBLIC_SALES_BOOKING_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM ${NODE_IMAGE} AS runner
ARG BUILD_DATE=1970-01-01T00:00:00Z
ARG VCS_REF=unknown
ARG VERSION=dev

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

LABEL org.opencontainers.image.created="${BUILD_DATE}" \
  org.opencontainers.image.description="Site public ProJD de Fichero" \
  org.opencontainers.image.revision="${VCS_REF}" \
  org.opencontainers.image.source="https://github.com/shadowoffice/vitrine" \
  org.opencontainers.image.title="Fichero Vitrine" \
  org.opencontainers.image.version="${VERSION}"

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs \
  && mkdir -p /app/data \
  && chown nextjs:nodejs /app/data

COPY --from=build --chown=nextjs:nodejs /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

# Image optimization is globally disabled; keep the vulnerable native Sharp
# toolchain out of the production runtime.
RUN rm -rf node_modules/sharp node_modules/@img

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=5 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/healthz').then((response)=>process.exit(response.ok?0:1)).catch(()=>process.exit(1))"]

STOPSIGNAL SIGTERM
CMD ["node", "server.js"]
