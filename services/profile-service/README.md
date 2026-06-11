# profile-service

Waypoint Bio profile service. Owns user accounts (JWT auth), public profiles and their links. NestJS + PostgreSQL via Prisma 7.

## Endpoints

| Method | Path                     | Auth   | Description                              |
| ------ | ------------------------ | ------ | ---------------------------------------- |
| POST   | `/auth/register`         | —      | Create account, returns JWT + profile    |
| POST   | `/auth/login`            | —      | Login, returns JWT + profile             |
| GET    | `/profiles/me`           | Bearer | Own profile incl. links                  |
| PUT    | `/profiles/me`           | Bearer | Update bio / theme / avatarUrl           |
| POST   | `/profiles/me/avatar`    | Bearer | Placeholder — GCS upload not implemented |
| GET    | `/profiles/:username`    | —      | Public profile incl. links               |
| POST   | `/profiles/me/links`     | Bearer | Create link                              |
| PATCH  | `/profiles/me/links/:id` | Bearer | Update link                              |
| DELETE | `/profiles/me/links/:id` | Bearer | Delete link                              |

## Local development

```bash
# env is managed at the repo root — copy and fill in the root .env.example first
npm install
npm run prisma:generate     # generates the client into src/generated/prisma
npm run prisma:migrate:dev  # creates/applies migrations (needs a running Postgres)
npm run start:dev
```

## Docker

```bash
docker build -t waypoint/profile-service .
```
