# Waypoint Bio Frontend

Waypoint Bio web app built with Next.js, TypeScript and Tailwind CSS. The frontend serves both the public profile pages and the authenticated dashboard, which calls other microservices for data.

## Routes

| Path                    | Access  | Description                                          |
| ----------------------- | ------- | ---------------------------------------------------- |
| `/`                     | any     | Redirects to `/dashboard/links` or `/login`          |
| `/login`, `/register`   | public  | Auth screens (server actions set the session cookie) |
| `/:username`            | public  | SSR profile page with SEO/OpenGraph meta tags        |
| `/dashboard/links`      | session | Link editor: add / edit / delete / drag-reorder      |
| `/dashboard/appearance` | session | Theme presets, background, button style, bio, avatar |
| `/dashboard/analytics`  | session | Stat cards, 30-day clicks chart, per-link + geo      |

## Environment

Read server-side at runtime (no `NEXT_PUBLIC_` values needed).

| Variable | Description |
| --- | --- |
| `PORT` | HTTP port (default 3005) |
| `NODE_ENV` | `development` / `production` |
| `PROFILE_SERVICE_URL` | profile-service base URL |
| `PROFILE_READER_SERVICE_URL` | profile-reader-service base URL |
| `ANALYTICS_SERVICE_URL` | analytics-service base URL |
| `SESSION_COOKIE_SECURE` | `true` over HTTPS, `false` over plain HTTP |

## Local development

```bash
npm install
npm run dev
```

## Docker

```bash
docker build -t waypoint/frontend .
```
