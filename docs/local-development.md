# Local development

The whole stack runs with Docker Compose: four services plus Postgres, MongoDB,
and Redis.

## Prerequisites

- Docker + Docker Compose
- (Optional) the GCS uploader key at `secrets/waypoint-storage-key.json` if you
  want avatar/icon uploads to work locally (see [infrastructure.md](infrastructure.md)).
  Everything else runs without it.

## Start

```bash
cp .env.example .env
docker compose up --build
```

`.env.example` ships with working local defaults (dev passwords, in-cluster
URLs), so no edits are needed to boot.

## Ports

| Service | URL |
| --- | --- |
| frontend | http://localhost:3005 |
| profile-service | http://localhost:3010 |
| profile-reader-service | http://localhost:3020 |
| analytics-service | http://localhost:3030 |
| Postgres | localhost:5433 |
| MongoDB | localhost:27017 |
| Redis | localhost:6379 |

## Verify it works

```bash
# health checks
curl localhost:3010/health        # {"status":"ok","db":"up"}
curl localhost:3030/health

# register a user, then open the dashboard at http://localhost:3005/register
# the public page is http://localhost:3005/<username>

# reader cache: first call is a MISS, second a HIT
curl -si localhost:3020/<username> | grep -i x-cache
```

## Useful commands

```bash
docker compose logs -f profile-service     # follow one service
docker compose ps                          # status of everything
docker compose down                        # stop (keeps DB volumes)
docker compose down -v                     # stop and wipe data
```

## Notes

- **TypeScript services hot-reload** on file changes (source is bind-mounted).
- **The Go reader does not hot-reload.** Rebuild it after changes:
  `docker compose up -d --build profile-reader-service`.
- After changing dependencies or the Prisma schema in `profile-service`, recreate
  it so the rebuilt image's `node_modules` / generated client are used:
  `docker compose up -d --build profile-service` (add `--force-recreate` if a
  stale volume lingers).
- The reader caches profile JSON in Redis (5 min TTL). To force-refresh during
  testing: `docker compose exec redis-reader redis-cli FLUSHALL`.
