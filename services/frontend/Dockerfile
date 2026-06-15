FROM node:22-alpine AS dev
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# next dev defaults to 3000; pin to 3005 to match EXPOSE and the compose mapping.
ENV PORT=3005
EXPOSE 3005
CMD ["npm", "run", "dev"]

# ---- Build stage ----
FROM dev AS build
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Runtime stage (production image) ----
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --chown=node:node --from=build /app/.next/standalone ./
COPY --chown=node:node --from=build /app/.next/static ./.next/static

USER node
EXPOSE 3005
ENV PORT=3005
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
