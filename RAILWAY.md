# Deploy ARC Esports on Railway

## 1) Create project

1. Go to [railway.app](https://railway.app) and create a new project.
2. Add a **PostgreSQL** plugin.
3. Add a **GitHub** service from this repository (branch `main` or your PR branch).
4. In the web service → **Settings → Networking**, generate a public domain.

## 2) Environment variables (web service)

Set these on the Nest/web service (Variables tab):

```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=change-this-to-a-long-random-string
ADMIN_EMAIL=madunitesp@gmail.com
ADMIN_PASSWORD=494930Mm
ADMIN_NAME=ARC Admin
NODE_ENV=production
```

### Important

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | **Required.** Use the variable reference `${{Postgres.DATABASE_URL}}` so Railway injects the private network URL. |
| `DB_SSL` | **Leave unset** when using the private URL (`*.railway.internal`). The app ignores `DB_SSL=true` on private hosts automatically. Set `DB_SSL=true` only for public `*.rlwy.net` URLs. |
| `PORT` | **Do not set.** Railway injects `PORT` automatically; the app listens on it. |
| `JWT_SECRET` | Required for admin login tokens. |
| `ADMIN_*` | Used by auto-seed / seed script to create the first admin user. |
| `AUTO_SEED` | Defaults to on in production. Seeds content + admin when the DB is empty. Set `AUTO_SEED=false` to disable. |

Wrong SSL settings used to be the most common deploy crash; the app now refuses TLS on `*.railway.internal` even if `DB_SSL=true` was set by mistake.

## 3) First seed

Production boots auto-seed when the database is empty (uses `ADMIN_EMAIL` / `ADMIN_PASSWORD`).

To re-seed manually (truncates all tables):

```bash
node dist/seed/seed.js
```

Or from your machine against Railway Postgres (use the **public** URL + SSL):

```bash
cd backend
DATABASE_URL='postgresql://...@....rlwy.net:..../railway' DB_SSL=true pnpm seed
```

## 4) Architecture

- One Docker image builds the Vite frontend and Nest API.
- Nest serves `/api/*` and static frontend files from `/public`.
- Postgres stores all content, applications, merch, and admin users.
- Healthcheck: `GET /api/health` (configured in `railway.toml`).

## 5) Verify

- Public site: `https://<your-service>.up.railway.app/`
- Health: `https://<your-service>.up.railway.app/api/health`
- API: `https://<your-service>.up.railway.app/api/games`
- Admin: navbar **الإدارة** → login with `ADMIN_EMAIL` / `ADMIN_PASSWORD`

### Deploy logs checklist

If deploy still fails, open Deploy Logs and look for:

1. `[db] target=... ssl=on|off` — confirm host is `*.railway.internal` with `ssl=off`, or `*.rlwy.net` with `ssl=on`.
2. `DATABASE_URL is required in production` — Postgres is not linked / variable missing.
3. `ECONNREFUSED` / `password authentication failed` — wrong `DATABASE_URL` or Postgres plugin not in the same project/environment.
