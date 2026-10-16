# Deploying on Coolify

One Dockerfile application plus one Coolify PostgreSQL database.

## Application

- Build pack: **Dockerfile** (repo root). Port **3000**.
- Health check: `GET /` on port 3000, expect `200`. Allow a start period of about 30 s; the first request opens the database pool and runs pending migrations.
- Persistent storage: mount a volume at **`/app/media`**. Payload writes uploads (portrait, property galleries) there. Without it, a redeploy deletes every upload.

## Environment

| Key | Build | Runtime | Notes |
| --- | --- | --- | --- |
| `DATABASE_URI` | | yes | Internal URL of the Coolify Postgres, e.g. `postgresql://user:pass@<db-host>:5432/alveo` |
| `PAYLOAD_SECRET` | | yes | Long random string, unique to production. Changing it logs everyone out. |
| `NEXT_PUBLIC_SERVER_URL` | **yes** | yes | Public origin, no trailing slash, e.g. `https://example.com`. Next inlines it at build, so mark it as a build variable in Coolify. |
| `PAYLOAD_MEDIA_DIR` | | optional | Defaults to `/app/media` in the image. Keep it equal to the volume mount. |

Optional later: an SMTP adapter for inquiry emails (not wired yet; inquiries are saved in the admin under **Inbox → Inquiries**).

## Migrations

Local development uses Payload's schema push (the dev server syncs tables automatically). Production does not push. Instead, `prodMigrations` in `src/payload.config.ts` runs any pending migration from `src/migrations` when the server starts, so a deploy applies them on its own.

When you change a collection, global, or field:

```powershell
pnpm payload migrate:create <short-name>   # writes src/migrations/<timestamp>_<short-name>.ts and updates index.ts
pnpm payload migrate                       # apply it to your local database
pnpm payload migrate:status                # check what has run
```

Commit the migration files with the schema change. If the dev server asked about "dev mode" migrations, answer yes once; that only affects the local database.

## First admin and seed data

- The image does not contain the seed script. On a fresh production database, open `/admin` and Payload shows the **create first user** screen.
- To load the nine public Alveo properties into production, run the seed from a workstation with `DATABASE_URI` pointed at the production database (for example over an SSH tunnel): `pnpm seed`. It skips properties whose slug already exists and only creates an admin when `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` are set and no user exists.

## Before launch

- Confirm with Alveo that the white wordmark and hotlinked project photography may appear on a personal domain. Both are loaded from `www.alveoland.com.ph`.
- Every seeded property has **Price verified** unticked, so the site shows "Price to be confirmed". Tick it per property after checking the current price list.
