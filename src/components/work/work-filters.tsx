"use client";

import { motion } from "framer-motion";
import { transitions } from "@/lib/motion";
import { cn } from "@/lib/utils";

export const workFilters = [
  { label: "All", value: "all" },
  { label: "AI Systems", value: "ai" },
  { label: "Interaction", value: "interaction" },
  { label: "Research", value: "research" },
  { label: "XR", value: "xr" }
] as const;

type WorkFiltersProps = {
  active: string;
  onChange: (value: string) => void;
  resultCount: number;
  animated: boolean;
};

export function WorkFilters({ active, onChange, resultCount, animated }: WorkFiltersProps) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-border/55 pb-2.5">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
        {workFilters.map((filter) => {
          const isActive = active === filter.value;
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => onChange(filter.value)}
              aria-pressed={isActive}
              className={cn(
                "relative py-3 font-body text-base text-text-secondary transition-colors hover:text-foreground md:py-2",
                isActive && "text-foreground"
              )}
            >
              {filter.label}
              {isActive ? (
                animated ? (
                  <motion.span
                    layoutId="work-filter-underline"
                    className="absolute bottom-[2px] left-0 h-[2px] w-full bg-accent"
                    transition={transitions.quick}
                  />
                ) : (
                  <span className="absolute bottom-[2px] left-0 h-[2px] w-full bg-accent" />
                )
              ) : null}
            </button>
          );
        })}
      </div>
      <p className="font-body text-sm text-text-muted" aria-live="polite">
        {resultCount} {resultCount === 1 ? "project" : "projects"}
      </p>
    </div>
  );
}
