# profile-reader-service

Public-facing read cache that sits in front of every profile page view. It is
the hot path: no auth, no database, never handles writes. Reads come from Redis
first and fall back to `profile-service` on a miss.

## Request flow

1. Browser (via Next.js SSR) calls `GET /:username`.
2. The service checks Redis for `profile:{username}`.
   - **HIT** → returns the cached JSON immediately (`X-Cache: HIT`).
   - **MISS** → calls `profile-service` `GET /profiles/:username`, stores the
     result in Redis with a TTL, returns the JSON (`X-Cache: MISS`), and fires a
     non-blocking view event to `analytics-service` in a goroutine.
3. `DELETE /cache/:username` drops the Redis key. `profile-service` calls this
   (best-effort) after any profile or link write.

## Endpoints

| Method | Path              | Description                                  |
| ------ | ----------------- | -------------------------------------------- |
| GET    | `/health`         | Liveness only, always `200 {"status":"ok"}`. |
| GET    | `/:username`      | Public profile (cache → upstream).           |
| DELETE | `/cache/:username`| Invalidate a cached profile (`204`).         |

### Error semantics

- `profile-service` returns 404 → `404`, not cached.
- `profile-service` returns any other error → `502`, not cached.
- Redis unavailable → log a warning and fall through to `profile-service`.

## Configuration (environment variables)

| Variable                | Default | Description                                   |
| ----------------------- | ------- | --------------------------------------------- |
| `PORT`                  | `3020`  | HTTP listen port.                             |
| `REDIS_URL`             | —       | e.g. `redis://:pass@redis-reader:6379`. Req.  |
| `PROFILE_SERVICE_URL`   | —       | e.g. `http://profile-service:3010`. Required. |
| `ANALYTICS_SERVICE_URL` | —       | e.g. `http://analytics-service:3030`. Req.    |
| `CACHE_TTL_SECONDS`     | `300`   | Cache entry TTL in seconds.                   |

## Run locally

```sh
go run ./cmd/server
```

Or with Docker (built and wired by the repo's root `docker-compose.yml`):

```sh
docker compose up profile-reader-service
```

## Stack

Go standard library `net/http` (server and outbound clients), `go-redis/v9`,
structured logging via `log/slog`. No HTTP framework, no database.
