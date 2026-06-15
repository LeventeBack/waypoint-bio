# analytics-service

Waypoint Bio analytics service. Ingests click/view events and serves aggregated per-user stats. NestJS + MongoDB via Mongoose.

**Internal-only.** It exposes no public route (ClusterIP, no Ingress). The write path is called by profile-reader-service over the cluster network; the read path is called by the frontend BFF, which forwards the user's JWT. The browser never talks to this service directly.

```
profile-reader-service (Go) ──POST /events──▶  analytics-service  ──aggregations──▶ MongoDB
frontend (Next.js BFF) ──GET /stats/* (Bearer JWT)──▶ analytics-service
```

## Endpoints

| Method | Path                   | Auth   | Description                             |
| ------ | ---------------------- | ------ | --------------------------------------- |
| POST   | `/events`              | —      | Ingest one event (network-isolated)     |
| GET    | `/stats/me`            | Bearer | Total clicks + per-link breakdown       |
| GET    | `/stats/me/timeseries` | Bearer | Clicks per day for the last 30 days     |
| GET    | `/stats/me/geo`        | Bearer | Clicks grouped by country               |
| GET    | `/metrics`             | —      | Prometheus exposition                   |
| GET    | `/health`              | —      | Liveness/readiness (Mongo connectivity) |

All `/stats/*` queries are scoped to the username carried in the validated JWT — never from a query param. The service validates tokens (shared `JWT_SECRET`) but never issues them.

## Configuration

Env is managed at the repo root (`.env`, from `.env.example`):

| Var                | Description                                   |
| ------------------ | --------------------------------------------- |
| `PORT`             | HTTP port (3030)                              |
| `ANALYTICS_DB_URL` | MongoDB connection string                     |
| `JWT_SECRET`       | Same value as profile-service (validate-only) |
| `NODE_ENV`         | `development` / `production`                  |

## Local development

```bash
# env is managed at the repo root — copy and fill in the root .env.example first
npm install
npm run start:dev   # needs a running MongoDB (see docker-compose mongo-analytics)
npm test            # unit tests for the stats aggregation logic
```

## Docker

```bash
docker build -t waypoint/analytics-service .
```
