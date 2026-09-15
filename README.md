# Oryx

Standalone Next.js 16 storefront + admin. Products, categories, orders, customers, and newsletter live in **Supabase**.

English + Arabic (RTL) and light + dark mode are built in. Switchers live in the gold top bar.

## Rebrand

Edit **one file**: `theme.config.ts`

## Run locally

```bash
cd qcommerce
cp .env.example .env.local
# fill in the Oryx Supabase URL, publishable key, and secret key
npm install
npm run db:migrate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## Supabase

`.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
DB_PASSWORD=your-database-password
ADMIN_EMAIL=admin@oryx.com
ADMIN_PASSWORD=admin123
```

`npm run db:migrate` applies `supabase/schema.sql` over Postgres (`DB_PASSWORD`) and upserts the catalogue. After that, manage products from `/admin`.
