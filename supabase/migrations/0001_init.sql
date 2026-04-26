-- ──────────────────────────────────────────────────────────────
-- 0001_init.sql — extensions + profiles + shared utilities
-- zprompt-studio · V7 (RLS), V8 (telemetry opt-in), V11 (versioning)
-- ──────────────────────────────────────────────────────────────

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ── shared updated_at trigger ─────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── profiles ─────────────────────────────────────────────────
-- mirrors auth.users; holds app-level user data (display name, locale, telemetry opt-in)
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique,
  display_name  text,
  locale        text not null default 'es' check (locale in ('es','en')),
  telemetry_opt_in boolean not null default false,  -- V8
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- ── auto-create profile on user signup ───────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
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

comment on table public.profiles is 'App-level user data; auto-populated on auth.users insert.';
