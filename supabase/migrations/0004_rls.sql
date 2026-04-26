-- ──────────────────────────────────────────────────────────────
-- 0004_rls.sql — Row Level Security (V7 — every write scoped to auth.uid())
-- ──────────────────────────────────────────────────────────────

alter table public.profiles  enable row level security;
alter table public.recipes   enable row level security;
alter table public.favorites enable row level security;

-- ── profiles ─────────────────────────────────────────────────
-- Self read/update only. No insert/delete from clients (handled by trigger).
drop policy if exists "profiles: self select"        on public.profiles;
drop policy if exists "profiles: self update"        on public.profiles;
drop policy if exists "profiles: public read of authors of public recipes" on public.profiles;

create policy "profiles: self select"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: self update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Future-proofing: allow reading display_name of authors whose recipes are public.
create policy "profiles: public read of authors of public recipes"
  on public.profiles for select
  using (
    exists (
      select 1 from public.recipes r
      where r.user_id = profiles.id and r.is_public = true
    )
  );

-- ── recipes ──────────────────────────────────────────────────
drop policy if exists "recipes: owner full"              on public.recipes;
drop policy if exists "recipes: public select"           on public.recipes;
drop policy if exists "recipes: insert own"              on public.recipes;
drop policy if exists "recipes: update own"              on public.recipes;
drop policy if exists "recipes: delete own"              on public.recipes;

create policy "recipes: owner select"
  on public.recipes for select
  using (auth.uid() = user_id);

create policy "recipes: public select"
  on public.recipes for select
  using (is_public = true);

create policy "recipes: insert own"
  on public.recipes for insert
  with check (auth.uid() = user_id);

create policy "recipes: update own"
  on public.recipes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "recipes: delete own"
  on public.recipes for delete
  using (auth.uid() = user_id);

-- ── favorites ────────────────────────────────────────────────
drop policy if exists "favorites: owner all" on public.favorites;

create policy "favorites: owner select"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "favorites: owner insert"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "favorites: owner delete"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- ── done ─────────────────────────────────────────────────────
-- Smoke check (manual):
--   set role authenticated;
--   select * from public.recipes;  -- should see only own + public rows
