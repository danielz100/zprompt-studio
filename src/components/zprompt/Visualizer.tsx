import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VisualizerProps {
  filters: {
    blur: number;       // px (optics aperture / focal)
    contrast: number;   // 1 = normal
    brightness: number; // 1 = normal
    saturate: number;   // 1 = normal
    sepia: number;      // 0..1 (chemistry warmth)
    hueRotate: number;  // deg
  };
  grain: number;        // 0..1
  halation: number;     // 0..1
  aspect: string;       // "21:9" etc
  grid: "none" | "thirds" | "golden";
  highlight: string | null;
}

const aspectMap: Record<string, string> = {
  "21:9": "aspect-[21/9]",
  "16:9": "aspect-video",
  "9:16": "aspect-[9/16] max-h-[60vh] mx-auto",
  "1:1": "aspect-square max-h-[60vh] mx-auto",
  "4:5": "aspect-[4/5] max-h-[65vh] mx-auto",
};

export const Visualizer: React.FC<VisualizerProps> = ({
  filters,
  grain,
  halation,
  aspect,
  grid,
  highlight,
}) => {
  const [splitX, setSplitX] = React.useState(50);
  const dragRef = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !dragRef.current) return;
    const rect = dragRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSplitX(Math.max(2, Math.min(98, x)));
  };
  const onPointerUp = () => { dragging.current = false; };

  const filterStr = `blur(${filters.blur}px) contrast(${filters.contrast}) brightness(${filters.brightness}) saturate(${filters.saturate}) sepia(${filters.sepia}) hue-rotate(${filters.hueRotate}deg)`;

  return (
    <div className="space-y-3">
      {/* Status bar */}
      <div className="flex items-center justify-between font-mono text-[10px] text-mono-dim">
        <div className="flex items-center gap-3">
          <span className="text-primary">● LIVE</span>
          <span>RENDER_PREVIEW.v1</span>
          {highlight && <span className="text-primary/80 uppercase tracking-wider">↳ {highlight}</span>}
        </div>
        <div className="flex items-center gap-3">
          <span>RATIO {aspect}</span>
          <span>~{Math.round(60 - filters.blur * 3)}fps</span>
        </div>
      </div>

      <div
        ref={dragRef}
        className={cn(
          "relative w-full overflow-hidden rounded-sm border border-border-industrial bg-black scanlines",
          aspectMap[aspect] || "aspect-video"
        )}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* AFTER (full image with all filters) */}
        <motion.div
          className="absolute inset-0"
          style={{ filter: filterStr }}
          animate={{ filter: filterStr }}
          transition={{ duration: 0.08 }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(ellipse 60% 80% at 35% 40%, hsl(28 80% 55% / 0.85), transparent 55%),
                radial-gradient(ellipse 50% 60% at 70% 60%, hsl(220 60% 25% / 0.9), transparent 60%),
                radial-gradient(ellipse 100% 40% at 50% 100%, hsl(15 50% 15%), transparent),
                linear-gradient(180deg, hsl(220 40% 8%), hsl(15 30% 12%) 60%, hsl(35 40% 20%))
              `,
            }}
          />
          {/* Subject silhouette */}
          <div
            className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[35%] h-[70%]"
            style={{
              background: `radial-gradient(ellipse 50% 30% at 50% 15%, hsl(20 30% 20%), transparent 70%),
                           radial-gradient(ellipse 40% 60% at 50% 60%, hsl(0 0% 5%), transparent 75%)`,
            }}
          />
          {/* Halation glow */}
          {halation > 0 && (
            <div
              className="absolute inset-0 pointer-events-none mix-blend-screen"
              style={{
                background: `radial-gradient(circle at 38% 42%, hsl(15 100% 60% / ${halation * 0.6}), transparent 35%)`,
              }}
            />
          )}
          {/* Grain */}
          {grain > 0 && (
            <div
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              style={{
                opacity: grain,
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E")`,
              }}
            />
          )}
        </motion.div>

        {/* BEFORE (raw, clipped to splitX) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - splitX}% 0 0)` }}
        >
          <div
            className="absolute inset-0 grayscale"
            style={{
              backgroundImage: `
                radial-gradient(ellipse 60% 80% at 35% 40%, hsl(0 0% 50%), transparent 55%),
                radial-gradient(ellipse 50% 60% at 70% 60%, hsl(0 0% 20%), transparent 60%),
                linear-gradient(180deg, hsl(0 0% 10%), hsl(0 0% 25%))
              `,
            }}
          />
          <div className="absolute top-3 left-3 font-mono text-[9px] text-white/60 tracking-widest">
            BEFORE / RAW
          </div>
        </div>
        <div className="absolute top-3 right-3 font-mono text-[9px] text-primary/80 tracking-widest">
          AFTER / DETERMINISTIC
        </div>

        {/* Grid overlays */}
        {grid === "thirds" && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
            <line x1="33.33%" y1="0" x2="33.33%" y2="100%" stroke="hsl(51 100% 50% / 0.35)" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="66.66%" y1="0" x2="66.66%" y2="100%" stroke="hsl(51 100% 50% / 0.35)" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="0" y1="33.33%" x2="100%" y2="33.33%" stroke="hsl(51 100% 50% / 0.35)" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="0" y1="66.66%" x2="100%" y2="66.66%" stroke="hsl(51 100% 50% / 0.35)" strokeWidth="0.5" strokeDasharray="3 3" />
          </svg>
        )}
        {grid === "golden" && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 56" preserveAspectRatio="none">
            <path d="M 0 56 A 56 56 0 0 1 56 0 L 56 56 Z" fill="none" stroke="hsl(51 100% 50% / 0.35)" strokeWidth="0.2" />
            <path d="M 56 0 A 21 21 0 0 1 77 21 L 56 21 Z" fill="none" stroke="hsl(51 100% 50% / 0.35)" strokeWidth="0.2" />
            <path d="M 77 21 A 13 13 0 0 1 90 34 L 77 34 Z" fill="none" stroke="hsl(51 100% 50% / 0.35)" strokeWidth="0.2" />
            <line x1="38.2" y1="0" x2="38.2" y2="56" stroke="hsl(51 100% 50% / 0.2)" strokeWidth="0.15" />
            <line x1="61.8" y1="0" x2="61.8" y2="56" stroke="hsl(51 100% 50% / 0.2)" strokeWidth="0.15" />
          </svg>
        )}

        {/* Split slider handle */}
        <div
          className="absolute top-0 bottom-0 w-px bg-primary shadow-gold cursor-ew-resize z-20"
          style={{ left: `${splitX}%` }}
          onPointerDown={onPointerDown}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-gold">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 2L1 6L3 10M9 2L11 6L9 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Highlight overlay (hover from sliders) */}
        {highlight === "optics" && (
          <div className="absolute inset-0 ring-2 ring-inset ring-primary/40 pointer-events-none animate-pulse" />
        )}

        {/* Corner markers */}
        {["top-2 left-2 border-t border-l", "top-2 right-2 border-t border-r", "bottom-2 left-2 border-b border-l", "bottom-2 right-2 border-b border-r"].map((c, i) => (
          <div key={i} className={cn("absolute w-3 h-3 border-primary/60 pointer-events-none", c)} />
        ))}
      </div>
    </div>
  );
};
