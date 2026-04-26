import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModulePanelProps {
  index: number;
  code: string;
  title: string;
  subtitle: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  status?: "active" | "idle";
}

export const ModulePanel: React.FC<ModulePanelProps> = ({
  index,
  code,
  title,
  subtitle,
  isOpen,
  onToggle,
  children,
  status = "idle",
}) => {
  return (
    <div className={cn("panel overflow-hidden transition-colors", isOpen && "border-primary/40")}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-elevated/40 transition-colors gold-ring"
      >
        <div className="font-mono text-[10px] text-mono-dim w-8">
          M.{String(index).padStart(2, "0")}
        </div>
        <div className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "active" ? "bg-primary animate-pulse-gold" : "bg-border-industrial"
        )} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[11px] tracking-[0.2em] text-primary">{code}</span>
            <span className="text-sm font-light text-foreground/90 truncate">{title}</span>
          </div>
          <div className="text-[11px] text-muted-foreground font-light">{subtitle}</div>
        </div>
        <ChevronRight
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-300",
            isOpen && "rotate-90 text-primary"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-border-industrial/60 space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
