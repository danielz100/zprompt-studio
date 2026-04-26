# Contributing to zprompt-studio

> Bilingual: ES below · EN below

---

## 🇬🇧 English

Thanks for considering contributing to **zprompt-studio**. The Zprompt method is open by design — every well-argued PR makes the standard better.

### Ground rules

- **Read [SPEC.md](./SPEC.md) first.** It's the single source of truth (goals, constraints, interfaces, invariants, tasks, bugs). Any PR that violates a §V invariant must either fix the spec first or be rejected.
- **No AI inference.** The 6-pillar schema is deterministic. If a feature would let the model "guess" missing fields, it's wrong by construction.
- **BYOK is non-negotiable.** Never accept code that adds a server-side `GEMINI_API_KEY`.
- **Bilingual UI.** Every user-facing string must exist in ES + EN. CI will block hardcoded strings.

### Workflow

1. **Look for [`good-first-issue`](https://github.com/danielz100/zprompt-studio/labels/good-first-issue)** or open one to discuss before writing code.
2. **Fork** → branch from `main` → name it `feat/<short>`, `fix/<short>`, or `docs/<short>`.
3. **Run locally**:
   ```bash
   pnpm install
   pnpm dev
   pnpm lint && pnpm typecheck && pnpm test
   ```
4. **Commit style** — Conventional Commits:
   - `feat(scope): add X`
   - `fix(scope): correct Y`
   - `docs: update Z`
   - `chore(deps): bump W`
5. **Open PR** against `main`. Fill the template. Link the issue. Tick the §V invariants you respected.
6. **CI must be green** (lint + typecheck + test + build + a11y) before review.
7. **Review** within 72h. We respond fast.

### Adding a slider mapping

Edits to `lib/zprompt/mapping.ts` (V4) require:
- Unit tests covering the new mapping
- Bump `schemaVersion` if breaking (V11)
- CHANGELOG entry under `[Unreleased]`

### Reporting bugs

Use the bug issue template. Include: repro steps, expected vs actual, browser+OS, screenshot if UI. Security issues → see [SECURITY.md](./SECURITY.md), **not** the public tracker.

### Style

- TypeScript strict, no `any`. Prefer `unknown` + narrow.
- Tailwind utility classes; component variants via `cva`.
- shadcn for primitives. Don't reinvent.
- ARIA + keyboard nav for any interactive component (V15, WCAG 2.1 AA).

---

## 🇪🇸 Español

Gracias por colaborar en **zprompt-studio**. El método Zprompt es abierto por diseño: cada PR bien argumentado mejora el estándar.

### Reglas básicas

- **Lee [SPEC.md](./SPEC.md) primero.** Es la fuente única de verdad. Todo PR que viole un invariante §V debe arreglar el spec antes o será rechazado.
- **Cero inferencia IA.** El schema de 6 pilares es determinista. Si una funcionalidad deja al modelo "adivinar" campos faltantes, está mal por diseño.
- **BYOK no se negocia.** Nunca aceptamos código que añada `GEMINI_API_KEY` server-side.
- **UI bilingüe.** Todo string visible al usuario existe en ES + EN. CI bloquea strings hardcoded.

### Flujo

1. **Busca [`good-first-issue`](https://github.com/danielz100/zprompt-studio/labels/good-first-issue)** o abre una para discutir antes de codear.
2. **Fork** → branch desde `main` → nombre `feat/<corto>`, `fix/<corto>`, `docs/<corto>`.
3. **Local**:
   ```bash
   pnpm install
   pnpm dev
   pnpm lint && pnpm typecheck && pnpm test
   ```
4. **Commits** — Conventional Commits (en inglés para consistencia internacional).
5. **PR** contra `main`. Rellena el template. Linkea la issue. Marca los §V respetados.
6. **CI verde** (lint + typecheck + test + build + a11y) antes de revisión.
7. **Respondemos en 72h.**

### Estilo

- TypeScript strict, sin `any`. `unknown` + narrowing.
- Tailwind utilidades; variantes vía `cva`.
- shadcn para primitivos. No reinventes.
- ARIA + teclado en todo componente interactivo (V15, WCAG 2.1 AA).

### Reportar bugs

Plantilla de bug. Incluye: pasos repro, esperado vs actual, navegador+OS, screenshot si UI. Seguridad → [SECURITY.md](./SECURITY.md), **no** issues públicas.

---

By contributing you agree your work is licensed under [MIT](./LICENSE). · Al contribuir aceptas q tu trabajo se licencia bajo [MIT](./LICENSE).
