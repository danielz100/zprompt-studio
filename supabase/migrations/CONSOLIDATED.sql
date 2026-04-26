-- ══════════════════════════════════════════════════════════════
-- zprompt-studio · CONSOLIDATED schema (T4)
-- Paste this entire file into Supabase SQL Editor → Run.
-- Idempotent: safe to re-run.
-- ══════════════════════════════════════════════════════════════

-- ───────────────── 0001_init.sql ─────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique,
  display_name  text,
  locale        text not null default 'es' check (locale in ('es','en')),
  telemetry_opt_in boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ───────────────── 0002_recipes.sql ──────────────────────────
create table if not exists public.recipes (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  name              text not null check (char_length(name) between 1 and 120),
  description       text check (description is null or char_length(description) <= 2000),
  schema_version    integer not null default 1,
  metadata_version  text    not null default 'v1',
  pillars           jsonb   not null,
  prompt_compiled   text,
  thumbnail_url     text,
  is_public         boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint pillars_is_object check (jsonb_typeof(pillars) = 'object'),
  constraint pillars_has_six_keys check (
    pillars ? 'core' and pillars ? 'optics' and pillars ? 'physics'
    and pillars ? 'design' and pillars ? 'chemistry' and pillars ? 'void'
  )
);

create index if not exists recipes_user_id_idx        on public.recipes (user_id);
create index if not exists recipes_is_public_idx      on public.recipes (is_public) where is_public = true;
create index if not exists recipes_updated_at_idx     on public.recipes (updated_at desc);
create index if not exists recipes_pillars_gin        on public.recipes using gin (pillars);

drop trigger if exists recipes_set_updated_at on public.recipes;
create trigger recipes_set_updated_at
before update on public.recipes
for each row execute function public.set_updated_at();

-- ───────────────── 0003_favorites.sql ────────────────────────
create table if not exists public.favorites (
  user_id     uuid not null references auth.users(id) on delete cascade,
  recipe_id   uuid not null references public.recipes(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, recipe_id)
);

create index if not exists favorites_recipe_id_idx on public.favorites (recipe_id);

-- ───────────────── 0004_rls.sql ──────────────────────────────
alter table public.profiles  enable row level security;
alter table public.recipes   enable row level security;
alter table public.favorites enable row level security;

drop policy if exists "profiles: self select"        on public.profiles;
drop policy if exists "profiles: self update"        on public.profiles;
drop policy if exists "profiles: public read of authors of public recipes" on public.profiles;
drop policy if exists "recipes: owner select"        on public.recipes;
drop policy if exists "recipes: public select"       on public.recipes;
drop policy if exists "recipes: insert own"          on public.recipes;
drop policy if exists "recipes: update own"          on public.recipes;
drop policy if exists "recipes: delete own"          on public.recipes;
drop policy if exists "favorites: owner select"      on public.favorites;
drop policy if exists "favorites: owner insert"      on public.favorites;
drop policy if exists "favorites: owner delete"      on public.favorites;

create policy "profiles: self select"
  on public.profiles for select using (auth.uid() = id);

create policy "profiles: self update"
  on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "profiles: public read of authors of public recipes"
  on public.profiles for select
  using (
    exists (select 1 from public.recipes r where r.user_id = profiles.id and r.is_public = true)
  );

create policy "recipes: owner select"
  on public.recipes for select using (auth.uid() = user_id);

create policy "recipes: public select"
  on public.recipes for select using (is_public = true);

create policy "recipes: insert own"
  on public.recipes for insert with check (auth.uid() = user_id);

create policy "recipes: update own"
  on public.recipes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "recipes: delete own"
  on public.recipes for delete using (auth.uid() = user_id);

create policy "favorites: owner select"
  on public.favorites for select using (auth.uid() = user_id);

create policy "favorites: owner insert"
  on public.favorites for insert with check (auth.uid() = user_id);

create policy "favorites: owner delete"
  on public.favorites for delete using (auth.uid() = user_id);

-- ══════════════════════════════════════════════════════════════
-- DONE. Verify with:
--   select tablename, rowsecurity from pg_tables where schemaname = 'public';
-- All three (profiles, recipes, favorites) must show rowsecurity = true.
-- ══════════════════════════════════════════════════════════════
