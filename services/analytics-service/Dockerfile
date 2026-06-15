FROM node:22-alpine AS dev
WORKDIR /app

COPY package*.json ./
RUN npm ci          # all deps, including devDependencies (@nestjs/cli, ts-node)

COPY . .

EXPOSE 3030
CMD ["npx", "nest", "start", "--watch"]

# ---- Build stage ----
FROM dev AS build
RUN npm run build && npm prune --omit=dev

# ---- Runtime stage (production image) ----
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/package.json ./

USER node
EXPOSE 3030
CMD ["node", "dist/main.js"]
