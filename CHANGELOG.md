# Changelog

All notable changes to **zprompt-studio** are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · Versioning: [SemVer](https://semver.org/spec/v2.0.0.html) (V9).

## [Unreleased]

### Added
- OSS hygiene files (T2): `LICENSE` (MIT), `README.md` bilingual ES+EN, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `CHANGELOG.md`, `SECURITY.md`.
- `lovable/ui-ref` branch — frozen snapshot of Lovable UI design as visual reference for T9.

## [0.1.0] — 2026-04-26

### Added
- Initial scaffold (T1): Next.js 15 App Router, React 19, TypeScript strict, Tailwind v4 (CSS-first `@theme inline`, oklch palette), shadcn/ui (`new-york` preset, `neutral` base), pnpm 9, ESLint flat config, Prettier.
- Project skeleton: `app/layout.tsx` (a11y skip-link), `app/page.tsx` (placeholder landing), `app/globals.css`, `lib/utils.ts` (`cn`).
- Repo plumbing: `.gitignore`, `.env.example` (V14 — no server-side `GEMINI_API_KEY` by design, V2), `.nvmrc` (Node 20), `.eslintrc.json`, `components.json`.
- Architecture spec: [`SPEC.md`](./SPEC.md) — caveman-encoded source of truth (§G goal, §C constraints, §I interfaces, §V invariants, §T tasks, §B bugs).

### Architecture decisions
- BYOK mandatory (V2): Google AI Studio key client-side only, AES-GCM encrypted in `localStorage`, never persisted server-side.
- Native Thinking Mode via `thinkingBudget` parameter on `gemini-3.1-flash-image` (Nano Banana 2) — no separate reasoning layer.
- Optimistic UI: tactile response < 100ms (V5a), visual preview refresh < 200ms (V5b).
- Bilingual UI ES+EN, no hardcoded strings (V6, enforced by lint rule in T15).
- Supabase RLS for all DB writes (V7).

[Unreleased]: https://github.com/danielz100/zprompt-studio/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/danielz100/zprompt-studio/releases/tag/v0.1.0
