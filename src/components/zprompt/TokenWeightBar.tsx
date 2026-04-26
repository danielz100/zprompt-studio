import * as React from "react";

interface TokenWeightBarProps {
  tokens: { label: string; weight: number }[];
}

export const TokenWeightBar: React.FC<TokenWeightBarProps> = ({ tokens }) => {
  const total = tokens.reduce((s, t) => s + t.weight, 0) || 1;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="label-engineering">Token Priority</span>
        <span className="font-mono text-[10px] text-mono-dim">Σ {total.toFixed(2)}</span>
      </div>
      <div className="flex h-2 w-full overflow-hidden rounded-sm border border-border-industrial bg-background">
        {tokens.map((t, i) => {
          const pct = (t.weight / total) * 100;
          const opacity = 0.35 + (t.weight / Math.max(...tokens.map((x) => x.weight))) * 0.65;
          return (
            <div
              key={i}
              className="h-full border-r border-background last:border-r-0 transition-all"
              style={{
                width: `${pct}%`,
                background: `hsl(51 100% 50% / ${opacity})`,
              }}
              title={`${t.label}: ${t.weight.toFixed(2)}`}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 font-mono text-[9px] text-mono-dim">
        {tokens.map((t, i) => (
          <span key={i}>
            {t.label}
            <span className="text-primary/70 ml-1">{t.weight.toFixed(2)}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
