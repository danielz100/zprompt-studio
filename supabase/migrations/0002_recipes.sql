-- ──────────────────────────────────────────────────────────────
-- 0002_recipes.sql — recipes table (6-pillar JSONB engine)
-- zprompt-studio · V11 (schemaVersion + metadata_version)
-- ──────────────────────────────────────────────────────────────

create table if not exists public.recipes (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,

  -- presentation
  name              text not null check (char_length(name) between 1 and 120),
  description       text check (description is null or char_length(description) <= 2000),

  -- versioning (V11)
  schema_version    integer not null default 1,           -- bumps on breaking pillar shape changes
  metadata_version  text    not null default 'v1',        -- human-readable engine version tag

  -- the heart: 6-pillar payload (Core, Optics, Physics, Design, Chemistry, Void)
  -- shape validated by Zod in lib/zprompt/pillars.ts (T7)
  pillars           jsonb   not null,

  -- cached derived data
  prompt_compiled   text,
  thumbnail_url     text,

  -- visibility (default private; public surface lands in a later task)
  is_public         boolean not null default false,

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- pillar payload sanity: must be a JSON object containing the 6 pillar keys
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

create trigger recipes_set_updated_at
before update on public.recipes
for each row execute function public.set_updated_at();

comment on column public.recipes.pillars is
  '6-pillar payload: { core, optics, physics, design, chemistry, void }. Shape enforced in app layer (Zod, T7). schema_version gates migrations.';
