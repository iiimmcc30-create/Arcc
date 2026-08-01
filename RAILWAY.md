# Deploy ARC Esports on Railway

## 1) Create project

1. Go to [railway.app](https://railway.app) and create a new project.
2. Add a **PostgreSQL** plugin.
3. Add a **GitHub** service from this repository (branch `main` or your PR branch).

## 2) Environment variables (web service)

Set these on the Nest/web service:

```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
DB_SSL=true
JWT_SECRET=change-this-to-a-long-random-string
ADMIN_EMAIL=madunitesp@gmail.com
ADMIN_PASSWORD=494930Mm
ADMIN_NAME=ARC Admin
NODE_ENV=production
PORT=3000
```

`DATABASE_URL` should be linked from the Railway Postgres plugin.

## 3) First seed

After the first successful deploy, open the Railway service shell and run:

```bash
node dist/seed/seed.js
```

Or seed from your machine against Railway Postgres:

```bash
cd backend
DATABASE_URL='postgresql://...' DB_SSL=true pnpm seed
```

## 4) Architecture

- One Docker image builds the Vite frontend and Nest API.
- Nest serves `/api/*` and static frontend files from `/public`.
- Postgres stores all content, applications, merch, and admin users.

## 5) Verify

- Public site: `https://<your-service>.up.railway.app/`
- API: `https://<your-service>.up.railway.app/api/games`
- Admin: navbar **الإدارة** → login with `ADMIN_EMAIL` / `ADMIN_PASSWORD`
