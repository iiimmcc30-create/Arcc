# ARC Esports API

NestJS + TypeORM + PostgreSQL backend for the ARC Esports website.

## Setup

```bash
# PostgreSQL
createdb arc_esports
# or use the provided credentials in .env

pnpm install
pnpm seed
pnpm start:dev
```

API base: `http://localhost:3001/api`

## Main endpoints

- `GET /api/games|teams|players|creators|tournaments|news|partners|media|site`
- `POST /api/applications` — join wizard submissions
- `GET /api/applications?type=player|team|creator`
- `PATCH /api/applications/:id/status`
- `GET /api/admin/dashboard`
