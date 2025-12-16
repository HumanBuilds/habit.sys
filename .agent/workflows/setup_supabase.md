---
description: Setup Supabase CLI and Push Migrations
---

1. **Configure Environment**
   Ask the user for their **Supabase Project Reference ID** and **Database Password** (or full `DATABASE_URL`).
   Ensure `.env.local` contains the `DATABASE_URL` (direct Postgres connection string).
   *Format*: `DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"`

2. **Link Project**
   Link the local project to the remote Supabase instance.
   *Command*: `npx supabase link --project-ref [PROJECT_REF]`
   *(Note: One-time prompt for DB password may occur if not in env)*

3. **Push Migrations**
   Apply local migration files to the remote database.
   // turbo
   npx supabase db push
