# Alveo personal site

Personal site for an Alveo Land senior sales associate. Next.js App Router with Payload CMS 3 and PostgreSQL in one app. Public pages live in `src/app/(frontend)`; the editor is at `/admin`.

## Local development

```powershell
docker compose up -d          # Postgres 16 on localhost:5433
Copy-Item .env.example .env   # then fill PAYLOAD_SECRET and the seed admin
pnpm install
pnpm dev                      # http://localhost:3000
pnpm seed                     # nine public Alveo properties + first admin (idempotent)
```

## Content

- **Profile** (global): name, title, portrait, intro, direct contact, cities, years with Alveo, accreditation. Empty fields stay hidden.
- **Properties**: seeded from public Alveo listings with `priceVerified` off.
- **Awards, Testimonials, Sales records**: real entries only. The landing page hides the Record section until one of them has an entry; testimonials appear only when published.
- **Inquiries**: written by the public form through a server action. Admin-only.

See `DEPLOY.md` for Coolify and migrations, and `branding-kit.md` for the visual rules.
