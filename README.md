# Kim Long Motor — Miền Nam site

React (Vite) frontend + a small Express/JSON-file backend that powers a
password-protected `/admin` page for editing products and news content
scraped from the live site (https://kimlongvietnam.com/).

## Running the app locally

Two servers run side by side in development: the Vite dev server (React
frontend) and the Express API (reads/writes `server/data/content.json`).

```bash
npm install

# Terminal 1: Express API on http://localhost:4000
npm run server

# Terminal 2: Vite dev server on http://localhost:5173 (proxies /api -> :4000)
npm run dev

# ...or run both at once:
npm run dev:all
```

Visit http://localhost:5173 for the public site and
http://localhost:5173/admin for the admin panel.

### Admin login

The admin panel at `/admin` is protected by a single shared password, read
from the `ADMIN_PASSWORD` environment variable (see `.env.example`).

- **Default password:** `kimlong2026`
- Set your own by copying `.env.example` to `.env` (repo root or `server/.env`)
  and changing `ADMIN_PASSWORD`.

Login issues an in-memory bearer token (`POST /api/auth/login`) that the
frontend stores in `localStorage` and sends as `Authorization: Bearer <token>`
on every mutating request. Tokens reset when the server restarts.

## API routes

All routes are served by the Express app in `server/` (mounted under `/api`
via the Vite dev proxy in dev, or directly in production).

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | — | Health check |
| POST | `/api/auth/login` | — | `{ password }` → `{ token }` |
| GET | `/api/products` | — | List all products |
| GET | `/api/products/:id` | — | Get one product (by id or slug) |
| POST | `/api/products` | ✅ | Create a product |
| PUT | `/api/products/:id` | ✅ | Update a product |
| DELETE | `/api/products/:id` | ✅ | Delete a product |
| GET | `/api/articles` | — | List all news/press articles |
| GET | `/api/articles/:id` | — | Get one article (by id or slug) |
| POST | `/api/articles` | ✅ | Create an article |
| PUT | `/api/articles/:id` | ✅ | Update an article |
| DELETE | `/api/articles/:id` | ✅ | Delete an article |
| GET | `/api/about` | — | About-page content (scraped) |
| GET | `/api/careers` | — | Job listings (scraped, read-only) |
| GET | `/api/contact` | — | Branch addresses/hotlines (scraped) |

✅ = requires `Authorization: Bearer <token>` from `/api/auth/login`.

## Data store

All content lives in `server/data/content.json` (committed to the repo — not
gitignored), written with atomic temp-file-then-rename writes so a crash
mid-save can't corrupt it. It holds `products`, `articles`, `about`,
`careers`, and `contact`, seeded from a full scrape of the live site. A
legacy mirror is also written to `src/data/scraped-data.json` for any code
that still imports it directly, but the frontend pages read from the API.

## Re-running the scraper

```bash
npm run scrape
```

`scripts/scrape-kimlong.js` crawls `https://kimlongvietnam.com` (products,
news/press articles, about, careers, contact) with Puppeteer, downloads every
real image into `public/images/...`, and rewrites `server/data/content.json`.
It never fabricates data — job listings, article bodies, dates, and phone
numbers are only included if actually present on the live site; empty
sections are left empty rather than filled with placeholders.

## Build

```bash
npm run build   # production build via Vite, output in dist/
```
