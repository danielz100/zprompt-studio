import * as React from "react";
import { motion } from "framer-motion";
import { Aperture, Camera, Lightbulb, Grid3x3, Film, Ban, Cpu, Sparkles, Copy, Check } from "lucide-react";
import { ModulePanel } from "@/components/zprompt/ModulePanel";
import { PrecisionSlider } from "@/components/zprompt/PrecisionSlider";
import { Segmented } from "@/components/zprompt/Segmented";
import { TokenWeightBar } from "@/components/zprompt/TokenWeightBar";
import { Visualizer } from "@/components/zprompt/Visualizer";
import { cn } from "@/lib/utils";

// Anti-inference banned tokens — words that signal AI-guessing
const BANNED = ["beautiful", "stunning", "amazing", "epic", "perfect", "best", "masterpiece", "high quality", "detailed", "8k", "hd", "realistic", "photo of"];

type Perspective = "Dutch" | "Low" | "Eye" | "Bird";
type Aspect = "21:9" | "16:9" | "9:16" | "1:1" | "4:5";
type Grid = "none" | "thirds" | "golden";
type Emulsion = "Kodak" | "Fuji" | "Cinestill";

const Index = () => {
  // Open module
  const [openModule, setOpenModule] = React.useState<number | null>(1);
  const [highlight, setHighlight] = React.useState<string | null>(null);

  // M1 — CORE
  const [subject, setSubject] = React.useState("solitary chess player, 38, weathered hands");
  const [pose, setPose] = React.useState("leaning forward, fingers hovering over knight");
  const [movement, setMovement] = React.useState(0.32);

  // M2 — OPTICS
  const [focal, setFocal] = React.useState(85);
  const [fstop, setFstop] = React.useState(1.8);
  const [perspective, setPerspective] = React.useState<Perspective>("Eye");

  // M3 — PHYSICS
  const [lightDir, setLightDir] = React.useState(0.65);
  const [lightInt, setLightInt] = React.useState(0.78);
  const [ior, setIor] = React.useState(0.45);
  const [sss, setSss] = React.useState(0.28);

  // M4 — DESIGN
  const [grid, setGrid] = React.useState<Grid>("thirds");
  const [aspect, setAspect] = React.useState<Aspect>("21:9");

  // M5 — CHEMISTRY
  const [emulsion, setEmulsion] = React.useState<Emulsion>("Cinestill");
  const [grain, setGrain] = React.useState(0.35);
  const [halation, setHalation] = React.useState(0.42);

  // M6 — VOID
  const [negative, setNegative] = React.useState("blurry, watermark, text overlay");

  const [copied, setCopied] = React.useState(false);

  // Anti-inference flags
  const flags = React.useMemo(() => {
    const tokens = negative.toLowerCase().split(/[,\s]+/).filter(Boolean);
    return tokens.filter((t) => BANNED.includes(t));
  }, [negative]);

  // Derived filters from controls (real-time visual feedback)
  const filters = React.useMemo(() => {
    // Wider aperture = more bokeh/blur. f/1.2 → ~3px, f/22 → 0px
    const blur = Math.max(0, (1.2 / fstop) * 1.6 - 0.3);
    // Light intensity affects brightness/contrast
    const brightness = 0.55 + lightInt * 0.7;
    const contrast = 0.85 + lightDir * 0.6;
    // Emulsion shifts color
    const emulsionMap = {
      Kodak: { sepia: 0.18, hue: 8, sat: 1.15 },
      Fuji: { sepia: 0.05, hue: -8, sat: 1.05 },
      Cinestill: { sepia: 0.22, hue: 12, sat: 1.25 },
    }[emulsion];
    return {
      blur,
      contrast,
      brightness,
      saturate: emulsionMap.sat,
      sepia: emulsionMap.sepia,
      hueRotate: emulsionMap.hue,
    };
  }, [fstop, lightInt, lightDir, emulsion]);

  // Token weight bar (from CORE)
  const coreTokens = [
    { label: "subject", weight: 1.0 },
    { label: "pose", weight: 0.7 },
    { label: "motion", weight: movement },
  ];

  // Real-time JSON
  const zprompt = React.useMemo(() => ({
    "@engine": "zprompt.v1",
    "@author": "Daniel De Zumárraga",
    core: { subject, pose, movement_physics: +movement.toFixed(2) },
    optics: {
      focal_length_mm: focal,
      f_stop: +fstop.toFixed(2),
      perspective_angle: perspective,
    },
    physics: {
      light_direction: +lightDir.toFixed(2),
      light_intensity: +lightInt.toFixed(2),
      material_ior: +ior.toFixed(2),
      subsurface_scattering: +sss.toFixed(2),
    },
    design: { grid_overlay: grid, aspect_ratio: aspect },
    chemistry: { emulsion, grain: +grain.toFixed(2), halation: +halation.toFixed(2) },
    void: {
      negative_tokens: negative.split(",").map((s) => s.trim()).filter(Boolean),
      anti_inference_flags: flags,
    },
  }), [subject, pose, movement, focal, fstop, perspective, lightDir, lightInt, ior, sss, grid, aspect, emulsion, grain, halation, negative, flags]);

  const jsonStr = JSON.stringify(zprompt, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const toggle = (n: number) => setOpenModule(openModule === n ? null : n);

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="border-b border-border-industrial relative z-10">
        <div className="px-6 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-sm bg-gradient-gold flex items-center justify-center shadow-gold">
              <Cpu className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-[0.3em] text-mono-dim">ZPROMPT // STUDIO</div>
              <div className="text-sm font-light tracking-wide">Deterministic Image Engineering Console</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 font-mono text-[10px] text-mono-dim">
            <span>BUILD <span className="text-primary">v1.0.0</span></span>
            <span>ENGINE <span className="text-signal-green">● online</span></span>
            <span>AUTHOR <span className="text-foreground/80">D. De Zumárraga</span></span>
          </div>
        </div>
      </header>

      {/* Hero strip */}
      <section className="px-6 py-10 border-b border-border-industrial relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(51_100%_50%/0.06),transparent_60%)]" />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative max-w-5xl"
        >
          <div className="flex items-center gap-2 font-mono text-[10px] text-primary mb-3 tracking-[0.25em]">
            <span className="w-6 h-px bg-primary" />
            THE SIX-PILLAR ENGINE
          </div>
          <h1 className="text-3xl md:text-5xl font-light leading-[1.05] tracking-tight">
            Engineering the Physics of <span className="italic text-primary">Imagination.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm md:text-base font-light text-muted-foreground">
            Stop guessing. Compose images the way a director composes a frame &mdash; with optics,
            physics, chemistry, and exclusion. Every parameter is deterministic. Every token has weight.
          </p>
        </motion.div>
      </section>

      {/* Main grid */}
      <main className="px-6 py-6 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6">
        {/* LEFT — Control Panel (40%) */}
        <div className="space-y-3">
          {/* M1 CORE */}
          <ModulePanel
            index={1} code="CORE"
            title="Anatomy & Action"
            subtitle="Subject, pose, movement physics."
            isOpen={openModule === 1} onToggle={() => toggle(1)}
            status={openModule === 1 ? "active" : "idle"}
          >
            <div className="space-y-3">
              <div>
                <div className="label-engineering mb-1">Subject</div>
                <input
                  value={subject} onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-background border border-border-industrial px-3 py-2 text-sm rounded-sm gold-ring font-light"
                  placeholder="solitary cellist on rooftop..."
                />
              </div>
              <div>
                <div className="label-engineering mb-1">Pose</div>
                <input
                  value={pose} onChange={(e) => setPose(e.target.value)}
                  className="w-full bg-background border border-border-industrial px-3 py-2 text-sm rounded-sm gold-ring font-light"
                />
              </div>
              <PrecisionSlider
                label="Movement Physics" value={movement} onChange={setMovement}
              />
              <TokenWeightBar tokens={coreTokens} />
            </div>
          </ModulePanel>

          {/* M2 OPTICS */}
          <ModulePanel
            index={2} code="OPTICS"
            title="The Lens"
            subtitle="Focal length, f-stop, perspective angle."
            isOpen={openModule === 2} onToggle={() => toggle(2)}
            status={openModule === 2 ? "active" : "idle"}
          >
            <PrecisionSlider
              label="Focal Length" value={focal} onChange={setFocal}
              min={14} max={200} step={1} unit="mm"
              format={(v) => `${Math.round(v)}mm`}
              onHover={(a) => setHighlight(a ? "optics" : null)} accent
            />
            <PrecisionSlider
              label="Aperture (f-stop)" value={fstop} onChange={setFstop}
              min={1.2} max={22} step={0.1}
              format={(v) => `f/${v.toFixed(1)}`}
              onHover={(a) => setHighlight(a ? "optics" : null)} accent
            />
            <Segmented<Perspective>
              label="Perspective Angle"
              options={["Dutch", "Low", "Eye", "Bird"] as const}
              value={perspective} onChange={setPerspective}
            />
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { l: "FOCAL", v: `${focal}mm`, h: focal < 35 ? "wide" : focal < 70 ? "normal" : focal < 135 ? "portrait" : "tele" },
                { l: "DOF", v: fstop < 2 ? "shallow" : fstop < 5.6 ? "moderate" : "deep", h: `f/${fstop.toFixed(1)}` },
                { l: "ANGLE", v: perspective.toUpperCase(), h: "vector" },
              ].map((c, i) => (
                <div key={i} className="bg-background border border-border-industrial rounded-sm p-2">
                  <div className="font-mono text-[9px] text-mono-dim">{c.l}</div>
                  <div className="font-mono text-xs text-primary mt-0.5">{c.v}</div>
                  <div className="font-mono text-[9px] text-mono-dim mt-0.5">{c.h}</div>
                </div>
              ))}
            </div>
          </ModulePanel>

          {/* M3 PHYSICS */}
          <ModulePanel
            index={3} code="PHYSICS"
            title="Light & Matter"
            subtitle="Light vectors, IOR, subsurface scattering."
            isOpen={openModule === 3} onToggle={() => toggle(3)}
            status={openModule === 3 ? "active" : "idle"}
          >
            <PrecisionSlider label="Light Direction (azimuth)" value={lightDir} onChange={setLightDir} />
            <PrecisionSlider label="Light Intensity" value={lightInt} onChange={setLightInt} />
            <PrecisionSlider label="Material IOR" value={ior} onChange={setIor}
              format={(v) => (1 + v * 1.5).toFixed(2)} />
            <PrecisionSlider label="Subsurface Scattering" value={sss} onChange={setSss} />
          </ModulePanel>

          {/* M4 DESIGN */}
          <ModulePanel
            index={4} code="DESIGN"
            title="Geometry"
            subtitle="Composition grid & aspect ratio."
            isOpen={openModule === 4} onToggle={() => toggle(4)}
            status={openModule === 4 ? "active" : "idle"}
          >
            <Segmented<Grid>
              label="Grid Overlay"
              options={["none", "thirds", "golden"] as const}
              value={grid} onChange={setGrid}
            />
            <Segmented<Aspect>
              label="Aspect Ratio"
              options={["21:9", "16:9", "9:16", "1:1", "4:5"] as const}
              value={aspect} onChange={setAspect}
            />
          </ModulePanel>

          {/* M5 CHEMISTRY */}
          <ModulePanel
            index={5} code="CHEMISTRY"
            title="Film Stock"
            subtitle="Emulsion, grain structure, halation."
            isOpen={openModule === 5} onToggle={() => toggle(5)}
            status={openModule === 5 ? "active" : "idle"}
          >
            <Segmented<Emulsion>
              label="Emulsion"
              options={["Kodak", "Fuji", "Cinestill"] as const}
              value={emulsion} onChange={setEmulsion}
            />
            <PrecisionSlider label="Grain Structure" value={grain} onChange={setGrain} />
            <PrecisionSlider label="Halation Intensity" value={halation} onChange={setHalation} />
          </ModulePanel>

          {/* M6 VOID */}
          <ModulePanel
            index={6} code="VOID"
            title="Exclusion"
            subtitle="Negative tokens & anti-inference validation."
            isOpen={openModule === 6} onToggle={() => toggle(6)}
            status={openModule === 6 ? "active" : "idle"}
          >
            <div>
              <div className="label-engineering mb-1">Negative Prompt Tokens</div>
              <textarea
                value={negative} onChange={(e) => setNegative(e.target.value)}
                rows={3}
                className="w-full bg-background border border-border-industrial px-3 py-2 text-sm rounded-sm gold-ring font-mono text-xs leading-relaxed resize-none"
                placeholder="comma, separated, tokens"
              />
            </div>
            <div className={cn(
              "border rounded-sm p-2.5 transition-colors",
              flags.length > 0 ? "border-signal-red/50 bg-signal-red/5" : "border-signal-green/40 bg-signal-green/5"
            )}>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                Anti-inference Validation
              </div>
              {flags.length === 0 ? (
                <div className="font-mono text-[11px] text-signal-green mt-1">✓ no AI-guessing tokens detected</div>
              ) : (
                <div className="font-mono text-[11px] text-signal-red mt-1">
                  ⚠ flagged: {flags.join(", ")}
                </div>
              )}
            </div>
          </ModulePanel>
        </div>

        {/* RIGHT — Visualizer (60%) */}
        <div className="lg:sticky lg:top-6 self-start space-y-4">
          <Visualizer
            filters={filters}
            grain={grain}
            halation={halation}
            aspect={aspect}
            grid={grid}
            highlight={highlight}
          />

          {/* Quick metric cards */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: Camera, l: "FOCAL", v: `${focal}mm` },
              { icon: Aperture, l: "APERTURE", v: `f/${fstop.toFixed(1)}` },
              { icon: Lightbulb, l: "LIGHT", v: `${(lightInt * 100).toFixed(0)}%` },
              { icon: Film, l: "STOCK", v: emulsion },
            ].map((m, i) => (
              <div key={i} className="glass rounded-sm p-2.5">
                <div className="flex items-center gap-1.5 text-mono-dim">
                  <m.icon className="w-3 h-3" />
                  <span className="font-mono text-[9px] tracking-wider">{m.l}</span>
                </div>
                <div className="font-mono text-sm text-primary mt-1">{m.v}</div>
              </div>
            ))}
          </div>

          {/* Raw Zprompt String */}
          <div className="panel">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border-industrial">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-signal-green animate-pulse" />
                <span className="font-mono text-[10px] tracking-[0.2em] text-mono-dim">RAW_ZPROMPT.json</span>
              </div>
              <button
                onClick={handleCopy}
                className="font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 gold-ring rounded-sm px-1"
              >
                {copied ? <><Check className="w-3 h-3" /> COPIED</> : <><Copy className="w-3 h-3" /> COPY</>}
              </button>
            </div>
            <pre className="px-3 py-3 max-h-64 overflow-auto font-mono text-[11px] leading-relaxed text-foreground/80">
              <code>{jsonStr}</code>
            </pre>
          </div>

          {/* Compile CTA */}
          <button
            onClick={handleCopy}
            className="w-full bg-gradient-gold text-primary-foreground font-mono text-xs tracking-[0.2em] uppercase py-3.5 rounded-sm shadow-gold hover:brightness-110 active:translate-y-px transition-all flex items-center justify-center gap-2 gold-ring relative overflow-hidden group"
          >
            <Cpu className="w-4 h-4" />
            Compile Deterministic Prompt
            <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
          </button>
        </div>
      </main>

      <footer className="px-6 py-6 border-t border-border-industrial mt-8">
        <div className="flex items-center justify-between font-mono text-[10px] text-mono-dim">
          <span>© ZPROMPT STUDIO &mdash; deterministic by design</span>
          <span>{new Date().toISOString().slice(0, 10).replace(/-/g, ".")} / NANO_GOLD_BUILD</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
