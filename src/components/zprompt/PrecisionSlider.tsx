import * as React from "react";
import { cn } from "@/lib/utils";

interface PrecisionSliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  format?: (v: number) => string;
  onHover?: (active: boolean) => void;
  accent?: boolean;
}

export const PrecisionSlider: React.FC<PrecisionSliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  unit = "",
  format,
  onHover,
  accent = false,
}) => {
  const pct = ((value - min) / (max - min)) * 100;
  const display = format ? format(value) : value.toFixed(2);

  return (
    <div
      className="group space-y-1.5"
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      <div className="flex items-center justify-between">
        <span className="label-engineering">{label}</span>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            value={Number(value.toFixed(2))}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (!Number.isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
            }}
            className="w-14 bg-background border border-border-industrial px-1.5 py-0.5 text-right font-mono text-[11px] text-primary tabular-nums gold-ring rounded-sm"
          />
          {unit && <span className="font-mono text-[10px] text-mono-dim">{unit}</span>}
        </div>
      </div>
      <div className="relative h-7 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
        />
        {/* track */}
        <div className="relative w-full h-[3px] bg-border-industrial rounded-full overflow-hidden">
          <div
            className={cn(
              "absolute inset-y-0 left-0 transition-[width] duration-75",
              accent ? "bg-gradient-gold" : "bg-primary/70 group-hover:bg-primary"
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        {/* thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary shadow-gold border border-primary-foreground/20 transition-transform group-hover:scale-125"
          style={{ left: `${pct}%` }}
        />
        {/* readout */}
        <div className="absolute -bottom-0 right-0 font-mono text-[9px] text-mono-dim">
          {display}
        </div>
      </div>
    </div>
  );
};
