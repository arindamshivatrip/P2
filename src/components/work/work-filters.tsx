import Link from "next/link";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

const filters = [
  { label: "All", value: "all" },
  { label: "AI Systems", value: "ai" },
  { label: "Interaction", value: "interaction" },
  { label: "Research", value: "research" },
  { label: "XR", value: "xr" }
] as const;

type WorkFiltersProps = {
  activeFilter: string;
};

export function WorkFilters({ activeFilter }: WorkFiltersProps) {
  return (
    <Container className="pb-6 md:pb-8">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-border/55 pb-3">
        {filters.map((filter) => (
          <Link
            key={filter.value}
            href={filter.value === "all" ? "/work" : `/work?focus=${filter.value}`}
            className={cn(
              "relative pb-1 font-body text-sm text-text-secondary transition-colors hover:text-foreground",
              activeFilter === filter.value && "text-foreground font-medium"
            )}
          >
            {filter.label}
            {activeFilter === filter.value ? (
              <span className="absolute -bottom-[2px] left-0 h-px w-full bg-accent" />
            ) : null}
          </Link>
        ))}
      </div>
    </Container>
  );
}
