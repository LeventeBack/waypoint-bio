FROM node:22-alpine AS dev
WORKDIR /app

# Toolchain for native modules (e.g. Prisma)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci          # all deps, including devDependencies (@nestjs/cli, ts-node)

COPY . .
RUN npx prisma generate

EXPOSE 3010
CMD ["sh", "-c", "npx prisma migrate deploy && npx nest start --watch"]

# ---- Build stage ----
FROM dev AS build
RUN npm run build && npm prune --omit=dev

# ---- Runtime stage (production image) ----
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/src/generated ./src/generated
COPY --chown=node:node --from=build /app/package.json ./

USER node
EXPOSE 3001
CMD ["node", "dist/main.js"]
