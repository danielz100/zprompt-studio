# Repo setup — manual checklist

> One-time GitHub configuration. Run after first push. Most items can't be set via files.

## 1. Repository settings

Settings → General:

- [ ] **Description**: `Visual prompt-engineering studio for Gemini 3.1 Flash Image — deterministic 6-pillar method.`
- [ ] **Website**: `https://zprompt-studio.vercel.app`
- [ ] **Topics**: `nextjs` `react` `typescript` `tailwindcss` `gemini` `prompt-engineering` `image-generation` `byok` `oss` `spain`
- [ ] **Features**:
  - [x] Issues
  - [x] Discussions ← **enable**
  - [x] Projects (optional)
  - [ ] Wiki (off — SPEC.md is the wiki)
- [ ] Default branch: `main`
- [ ] **Pull requests**:
  - [x] Allow squash merging (default)
  - [ ] Allow merge commits (off)
  - [ ] Allow rebase merging (off)
  - [x] Always suggest updating PR branches
  - [x] Automatically delete head branches

## 2. Branch protection (`main`)

Settings → Branches → Add rule:

- [ ] Require PR before merge
- [ ] Require approvals: 1 (relax to 0 only while solo-author)
- [ ] Require status checks: `lint`, `typecheck`, `test`, `build` (configured in T20)
- [ ] Require branches up to date
- [ ] Require conversation resolution
- [ ] Require linear history
- [ ] Block force pushes
- [ ] Block deletions

## 3. Discussions

Settings → Discussions → Set up:

- [ ] Categories:
  - 💬 General
  - 💡 Ideas
  - 🙏 Q&A
  - 🎨 Show & Tell (Z-Recipes)
  - 📐 Architecture / RFCs

## 4. Labels

Sync via `.github/labels.yml`. Either:

- Manual one-time: install [`github-label-sync`](https://github.com/Financial-Times/github-label-sync) and run `github-label-sync --labels .github/labels.yml danielz100/zprompt-studio`
- Or wait for the workflow added in T20 (auto-sync on push to `main`).

## 5. Secrets (Settings → Secrets and variables → Actions)

⚠ V2: **NO `GEMINI_API_KEY`** anywhere. BYOK only.

Required for CI/CD:

- [ ] `VERCEL_TOKEN` (T21)
- [ ] `VERCEL_ORG_ID` (T21)
- [ ] `VERCEL_PROJECT_ID` (T21)

Required for Supabase migrations CI (T4):

- [ ] `SUPABASE_ACCESS_TOKEN`
- [ ] `SUPABASE_DB_PASSWORD` (project-specific, never user-level)

## 6. Dependabot (optional, recommended)

Already covered minimally; add `.github/dependabot.yml` in T20 if desired.

## 7. Social preview image

Upload a 1280×640 PNG showing the studio UI under Settings → Social preview after T9 ships.
