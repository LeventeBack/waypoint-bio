# Waypoint Bio Frontend

Waypoint Bio web app built with Next.js, TypeScript and Tailwind CSS. The frontend serves both the public profile pages and the authenticated dashboard, which calls other microservices for data.

## Routes

| Path                    | Access  | Description                                          |
| ----------------------- | ------- | ---------------------------------------------------- |
| `/`                     | —       | Redirects to `/dashboard/links` or `/login`          |
| `/login`, `/register`   | public  | Auth screens (server actions set the session cookie) |
| `/:username`            | public  | SSR profile page with SEO/OpenGraph meta tags        |
| `/dashboard/links`      | session | Link editor: add / edit / delete / drag-reorder      |
| `/dashboard/appearance` | session | Theme presets, background, button style, bio, avatar |
| `/dashboard/analytics`  | session | Stat cards, 30-day clicks chart, per-link + geo      |

## Local development

```bash
npm install
npm run dev
```

## Docker

```bash
docker build -t waypoint/frontend .
```
