import * as React from "react";
import { cn } from "@/lib/utils";

interface SegmentedProps<T extends string> {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}

export function Segmented<T extends string>({ label, options, value, onChange }: SegmentedProps<T>) {
  return (
    <div className="space-y-1.5">
      <div className="label-engineering">{label}</div>
      <div className="flex gap-1 p-1 bg-background border border-border-industrial rounded-sm">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              "flex-1 px-2 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded-[2px] transition-all gold-ring",
              value === opt
                ? "bg-primary text-primary-foreground shadow-gold"
                : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
