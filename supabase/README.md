# Supabase — schema & migrations

Single source of truth for the data layer. Migrations are plain SQL — no Supabase CLI required.

## Tables

| Table | Purpose | RLS |
|---|---|---|
| `profiles` | App-level user data (display name, locale, telemetry opt-in). Auto-created on signup via trigger. | Self read/update. Public read for authors of public recipes. |
| `recipes` | Z-Recipes — 6-pillar JSONB engine. `schema_version` + `metadata_version` for V11 versioning. | Owner CRUD. Public select if `is_public = true`. |
| `favorites` | User → recipe bookmarks (composite PK). | Owner CRUD only. |

Pillar payload shape (validated by Zod in `lib/zprompt/pillars.ts`, T7):

```jsonc
{
  "core":      { "subject_anatomy": "...", "action_physics": "...", "detail_density": 0.7 },
  "optics":    { "focal_length": 85, "f_stop": 1.8, "camera_angle": "low", "lens_character": "anamorphic" },
  "physics":   { "light_setup": "Rembrandt", "lumen_intensity": 800, "material_ior": 1.45, "sss_depth": 0.3 },
  "design":    { "composition_math": "golden_ratio", "aspect_ratio": "3:2", "negative_space_weight": 0.4 },
  "chemistry": { "emulsion_type": "Kodak Portra 400", "grain_structure": "fine", "sensor_noise_iso": 200 },
  "void":      { "semantic_exclusions": ["text", "watermark"], "style_pollution_control": 0.9 }
}
```

A SQL constraint enforces the 6 top-level keys exist. Field shape is enforced server-side by Zod before insert/update.

## Apply to your Supabase project

### Option 1 — Dashboard SQL Editor (recommended for MVP)

1. Open your Supabase project → **SQL Editor** (sidebar `>_` icon) → **New query**.
2. Open [`migrations/CONSOLIDATED.sql`](./migrations/CONSOLIDATED.sql), copy entire contents.
3. Paste into editor → **Run**.
4. Expect: `Success. No rows returned`.
5. Verify RLS:
   ```sql
   select tablename, rowsecurity from pg_tables where schemaname = 'public';
   -- All three rows must show rowsecurity = true.
   ```

### Option 2 — Supabase CLI (later, for CI/CD)

```bash
brew install supabase/tap/supabase   # or scoop install supabase
supabase login
supabase link --project-ref <ref>
supabase db push
```

The CLI applies migrations in `migrations/00*.sql` order automatically.

## Regenerating TypeScript types

After any schema change:

```bash
supabase gen types typescript --project-id <ref> > lib/supabase/types.generated.ts
```

For now `lib/supabase/types.ts` is hand-written and matches the schema 1:1 — replace with generated output once CLI is configured.

## Notes

- **V2 (BYOK)**: Supabase auth handles user identity only. **Never** store user's Google AI key here.
- **V7 (RLS)**: Every table has RLS on. Test with `set role authenticated;` in psql.
- **V11 (versioning)**: Bump `schema_version` on breaking pillar changes. Old recipes stay readable; the engine handles migrations in app layer.
- **V14**: Real credentials live only in `.env.local` (gitignored). `.env.example` ships placeholders.
