<div align="center">

# zprompt-studio

**Visual prompt-engineering studio for Gemini 3.1 Flash Image (Nano Banana 2)**

Deterministic 6-pillar method · BYOK · MIT · Open Source

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-38bdf8)](https://tailwindcss.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](./CONTRIBUTING.md)

> **Architect of the Zprompt method:** [Daniel De Zumárraga](https://github.com/danielz100)

</div>

---

<table>
<tr>
<td valign="top" width="50%">

## 🇪🇸 Español

**zprompt-studio** es un estudio visual de ingeniería de prompts para `Gemini 3.1 Flash Image` (alias *Nano Banana 2*). Convierte lenguaje humano en parámetros físicos reales — longitud focal, apertura, temperatura de color, química de emulsión — mediante un método determinista de **6 pilares**.

### El método Zprompt

Creado por **Daniel De Zumárraga** (España, 2026). Cero inferencia de la IA: si falta información, el sistema pregunta. Nada se inventa.

| Pilar | Qué controla |
|---|---|
| 🎯 **Core** | Sujeto, anatomía, acción física, densidad de detalle |
| 🔬 **Optics** | Focal (14-200mm), apertura (f/1.2-22), ángulo, carácter de lente |
| 💡 **Physics** | Iluminación (Rembrandt, Three-point, Rim), IOR, SSS |
| 🎨 **Design** | Composición (Phi, Tercios, Fibonacci), aspecto, espacio negativo |
| 🧪 **Chemistry** | Emulsión (Portra, Cinestill), grano, ruido sensor |
| ⚫ **Void** | Exclusiones semánticas, control de polución estilística |

### Características

- 🎚️ **Semantic Sliders** — lenguaje humano → física real, mapeo determinista versionado
- 🧠 **Thinking Mode nativo** — `thinkingBudget` alto para razonamiento previo al render
- ⚡ **Optimistic UI** — feedback táctil <100ms, preview visual <200ms
- 🔐 **BYOK** — tu API key de Google AI Studio nunca sale de tu navegador
- 🌍 **Bilingüe** ES/EN nativo
- 📱 **PWA** — instalable, funciona offline (shell)
- 🔧 **Self-host** — `docker-compose` con n8n + Supabase local incluido

### Inicio rápido

```bash
git clone https://github.com/danielz100/zprompt-studio.git
cd zprompt-studio
pnpm install
cp .env.example .env.local
pnpm dev
```

Abre <http://localhost:3000> y pega tu API key (Google AI Studio) en `/settings`.

### Stack

Next.js 15 · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Supabase · Vercel

</td>
<td valign="top" width="50%">

## 🇬🇧 English

**zprompt-studio** is a visual prompt-engineering studio for `Gemini 3.1 Flash Image` (codename *Nano Banana 2*). It maps human language to real physical parameters — focal length, aperture, color temperature, film chemistry — through a deterministic **6-pillar** method.

### The Zprompt method

Created by **Daniel De Zumárraga** (Spain, 2026). Zero AI inference: if information is missing, the system asks. Nothing is invented.

| Pillar | Controls |
|---|---|
| 🎯 **Core** | Subject, anatomy, action physics, detail density |
| 🔬 **Optics** | Focal (14-200mm), aperture (f/1.2-22), angle, lens character |
| 💡 **Physics** | Lighting (Rembrandt, Three-point, Rim), IOR, SSS |
| 🎨 **Design** | Composition (Phi, Thirds, Fibonacci), aspect, negative space |
| 🧪 **Chemistry** | Emulsion (Portra, Cinestill), grain, sensor noise |
| ⚫ **Void** | Semantic exclusions, style pollution control |

### Features

- 🎚️ **Semantic Sliders** — human language → real physics, versioned deterministic mapping
- 🧠 **Native Thinking Mode** — high `thinkingBudget` for reasoning before render
- ⚡ **Optimistic UI** — touch feedback <100ms, visual preview <200ms
- 🔐 **BYOK** — your Google AI Studio key never leaves your browser
- 🌍 Native ES/EN bilingual
- 📱 **PWA** — installable, offline shell
- 🔧 **Self-host** — bundled `docker-compose` with n8n + local Supabase

### Quick start

```bash
git clone https://github.com/danielz100/zprompt-studio.git
cd zprompt-studio
pnpm install
cp .env.example .env.local
pnpm dev
```

Open <http://localhost:3000> and paste your API key (Google AI Studio) in `/settings`.

### Stack

Next.js 15 · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Supabase · Vercel

</td>
</tr>
</table>

---

## 📐 Architecture

The single source of truth is [SPEC.md](./SPEC.md) — caveman-encoded specification with goals (§G), constraints (§C), interfaces (§I), invariants (§V), tasks (§T), and bugs (§B).

## 🤝 Contributing

Pull requests welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md). Look for [`good-first-issue`](https://github.com/danielz100/zprompt-studio/labels/good-first-issue) to start.

## 🔒 Security

Found a vulnerability? See [SECURITY.md](./SECURITY.md). **Never open public issues for security reports.**

## 📜 License

[MIT](./LICENSE) © 2026 [Daniel De Zumárraga](https://github.com/danielz100). The Zprompt method is open and free to study, fork, implement, and extend.

---

<div align="center">
<sub>Made in Spain 🇪🇸 · Built for the world 🌍</sub>
</div>
