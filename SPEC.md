# SPEC — zprompt-studio

v0.1.0-spec | 2026-04-26 | MIT

## §G — goal

Web studio q traduce lenguaje humano → prompts físicos deterministas p/ Gemini 2.5 Flash Image vía método Zprompt 6-pilares. 0% inferencia IA. OSS estándar prompt-eng visual.

## §C — constraints

- C1 stack: Next.js 15 (App Router, fullstack, API Routes)
- C2 hosting: Vercel free tier
- C3 db+auth: Supabase free tier
- C4 ui: Tailwind + shadcn/ui
- C5 i18n: next-intl, ES+EN, sin strings hardcoded
- C6 modelos: Gemini 3.1 Flash Image alias "Nano Banana 2" (feb 2026) c/ param `thinkingBudget` activo p/ razonamiento prompt → render mismo modelo
- C7 BYOK obligatorio — key Google AI Studio del user, AES client-side, nunca server plaintext
- C8 PWA: manifest + service worker offline-first shell
- C9 license: MIT
- C10 repo: github.com/<owner>/zprompt-studio público
- C11 6 pilares: Core, Optics, Physics, Design, Chemistry, Void — schema fijo versionado
- C12 deps gratis o free-tier; sin servicios pagos en MVP
- C13 sin telemetría sin opt-in explícito
- C14 semver estricto, CHANGELOG keep-a-changelog

## §I — interfaces

- I.ui.routes: `/` landing, `/studio` editor, `/library` recetas, `/settings` BYOK+i18n, `/auth/*`
- I.api.prompt: `POST /api/prompt/build` → input 6-pilares JSON → output prompt denso
- I.api.render: `POST /api/image/render` → input prompt → output url img
- I.api.recipe: `GET|POST|PATCH|DELETE /api/recipes`
- I.ext.gemini: Google AI SDK (`@google/genai`), modelo `gemini-3.1-flash-image`, param `thinkingBudget` configurable
- I.ext.n8n: webhook outbound `POST /api/integrations/n8n` (envía recipes/renders a workflow user-defined)
- I.devops: `docker-compose.yml` con n8n + Supabase local p/ self-host opcional
- I.ext.supabase: `@supabase/supabase-js` (auth + RLS tables `users`, `recipes`, `favorites`)
- I.byok: localStorage AES-GCM, key derivada user passphrase, nunca enviada al server salvo header `X-Goog-Api-Key` por request
- I.pwa: `/manifest.webmanifest` + SW Workbox
- I.cli: `pnpm dev|build|test|lint|typecheck`
- I.ci: GitHub Actions `.github/workflows/ci.yml`

## §V — invariants

- V1 ∀ render: si falta campo req en cualquiera de 6 pilares → bloquea, pregunta user, NO infiere
- V2 API key nunca logged, nunca persisted server-side, nunca en URL
- V3 ∀ render req → pasa por thinking layer 1º (sin atajo directo a imagen-3)
- V4 slider→physical-param mapping: tabla determinista versionada en `lib/zprompt/mapping.ts`, cubierto por unit tests
- V5a slider drag táctil response <100ms (innegociable)
- V5b Optimistic UI refresh visual <200ms (CSS filter preview)
- V6 ∀ user-facing string: ES+EN ambos presentes, sin fallback hardcoded
- V7 ∀ DB write: scoped `user_id = auth.uid()` vía Supabase RLS
- V8 telemetría off por default; opt-in toggle settings
- V9 ∀ release: tag semver `vX.Y.Z` + entry CHANGELOG
- V10 merge a `main`: CI verde (lint+typecheck+test+build) obligatorio
- V11 6-pilar schema versionado `schemaVersion` field; breaking change → bump major
- V12 Optimistic preview ≠ render real; UI etiqueta claramente "preview" vs "rendered"
- V13 BYOK key validada formato antes guardar (regex Google AI key)
- V14 sin secretos en repo; `.env.example` only, `.env.local` gitignored
- V15 a11y: WCAG 2.1 AA mínimo (sliders accesibles teclado + ARIA)

## §T — tasks

| id | st | task | cites |
|----|----|------|-------|
| T1 | x | scaffold Next.js 15 App Router + TS + Tailwind + shadcn + pnpm | C1,C4 |
| T2 | . | OSS hygiene: LICENSE MIT, README ES+EN, CONTRIBUTING, CODE_OF_CONDUCT, CHANGELOG, SECURITY.md | C9,C14 |
| T3 | . | repo init: .gitignore, .env.example, issue+PR templates, labels good-first-issue | C10 |
| T4 | . | Supabase init: schema migrations, tables users/recipes/favorites, RLS policies | I.ext.supabase,V7 |
| T5 | . | auth flow Supabase (email magic link + OAuth Google opt) | I.ui.routes,V7 |
| T6 | . | BYOK store: client AES-GCM, settings UI, validación key | I.byok,V2,V13 |
| T7 | . | 6-pilar schema TS+Zod (`lib/zprompt/pillars.ts`): Core{subject_anatomy,action_physics,detail_density 0-1}, Optics{focal_length 14-200mm,f_stop 1.2-22,camera_angle,lens_character}, Physics{light_setup,lumen_intensity,material_ior,sss_depth}, Design{composition_math,aspect_ratio,negative_space_weight}, Chemistry{emulsion_type,grain_structure,sensor_noise_iso}, Void{semantic_exclusions,style_pollution_control} | C11,V1,V11 |
| T8 | . | mapping table slider→physical params versionada (`lib/zprompt/mapping.ts`) | V4 |
| T9 | . | Semantic Sliders component (shadcn slider + label bilingüe + tooltip físico) | I.ui.routes,V4,V6,V15 |
| T10 | . | pillar-gating: bloquea CTA render si schema incompleto, lista campos faltantes | V1 |
| T11 | . | thinking layer `/api/prompt/build`: gemini-3.1-flash-image c/ thinkingBudget alto, output prompt denso | I.api.prompt,C6,V3 |
| T12 | . | render `/api/image/render`: gemini-3.1-flash-image, BYOK header `X-Goog-Api-Key` passthrough, jamás server-stored | I.api.render,C6,V2,V3 |
| T13 | . | Optimistic UI: CSS filter preview pipeline <100ms, label "preview" | V5,V12 |
| T14 | . | recipe CRUD: API routes + library UI + favorites toggle | I.api.recipe,V7 |
| T15 | . | i18n setup next-intl ES+EN, locale switcher, lint regla anti-hardcode | C5,V6 |
| T16 | . | PWA: manifest, icons, SW Workbox, offline shell | C8,I.pwa |
| T17 | . | unit tests: mapping table (V4), pillar validation (V1), key validator (V13) | V4,V1,V13 |
| T18 | . | E2E Playwright: BYOK setup → slider edit → gating → render → save recipe | V1,V3,V5 |
| T19 | . | a11y audit axe-core en CI; teclado nav sliders | V15 |
| T20 | . | GitHub Actions CI: lint+typecheck+test+build+axe | V10 |
| T21 | . | Vercel deploy: env vars, preview branches, prod main | C2 |
| T22 | . | Discussions habilitado + welcome post + roadmap pinned | C10 |
| T23 | . | release v0.1.0: tag, CHANGELOG, GitHub Release notes ES+EN | V9 |
| T24 | . | landing page bilingüe + demo gif + CTA "trae tu key" | C5,I.ui.routes |
| T25 | . | docker-compose.yml: n8n + Supabase local self-host (free path) | I.devops |
| T26 | . | n8n webhook integration `/api/integrations/n8n` + docs uso | I.ext.n8n |
| T27 | . | import design tokens/components Lovable PRO export → adapt a shadcn | C4 |

## §B — bugs

| id | date | cause | fix |
|----|------|-------|-----|

---

**estado**: spec inicial, todos T en `.` (pending). Numeración monotónica. Próximo: `/build T1` o `/build --next`.
