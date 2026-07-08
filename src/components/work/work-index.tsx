"use client";

import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { Eyebrow } from "@/components/typography/eyebrow";
import { WorkFilters, workFilters } from "@/components/work/work-filters";
import { WorkRowPreview } from "@/components/work/work-row-preview";
import { transitions } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type WorkIndexItem = {
  id: string;
  href: string;
  title: string;
  oneLiner: string;
  year: string;
  org?: string;
  statusLabel: string;
  categories: string[];
  featured: boolean;
  fallbackGradient: string;
  cover?: string;
  video?: string;
};

type WorkIndexProps = {
  items: WorkIndexItem[];
};

const matchesFilter = (item: WorkIndexItem, filter: string): boolean => {
  if (filter === "all") return true;
  if (filter === "ai") return item.categories.includes("AI Systems");
  if (filter === "interaction") return item.categories.includes("Interaction Design");
  if (filter === "research") return item.categories.includes("Research");
  if (filter === "xr") {
    return item.categories.includes("XR / Spatial") || item.categories.includes("Mobile AR");
  }
  return true;
};


export function WorkIndex({ items }: WorkIndexProps) {
  const prefersReducedMotion = useReducedMotion();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState(() => {
    const requested = searchParams.get("focus") ?? "all";
    return workFilters.some((f) => f.value === requested) ? requested : "all";
  });
  const [finePointer, setFinePointer] = useState(false);
  const [activeItem, setActiveItem] = useState<WorkIndexItem | null>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  // rows entering after a filter change animate in; the first paint never does
  const hasMounted = useRef(false);

  useEffect(() => {
    hasMounted.current = true;
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    setFinePointer(query.matches);
    const onChange = (event: MediaQueryListEvent) => setFinePointer(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const filtered = useMemo(
    () => items.filter((item) => matchesFilter(item, filter)),
    [items, filter]
  );
  const featuredItems = filtered.filter((item) => item.featured);
  const moreItems = filtered.filter((item) => !item.featured);

  const previewEnabled = finePointer && !prefersReducedMotion;
  const animateRows = !prefersReducedMotion;

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setActiveItem(null);
    window.history.replaceState(null, "", value === "all" ? "/work" : `/work?focus=${value}`);
  };

  const handleListPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    pointerX.set(event.clientX);
    pointerY.set(event.clientY);
  };

  const renderRow = (item: WorkIndexItem, tier: "featured" | "compact") => {
    const row = (
      <Link
        href={item.href}
        onPointerEnter={previewEnabled ? () => setActiveItem(item) : undefined}
        className={cn(
          "group/row block border-t border-border/60 transition-opacity duration-200",
          tier === "featured" ? "py-6 md:py-8" : "py-4 md:py-5",
          // sibling dimming: hovering the list quiets every row but the active one
          finePointer && "group-hover/list:opacity-40 hover:!opacity-100"
        )}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2
            className={cn(
              "font-display tracking-tight transition-transform duration-200 motion-safe:group-hover/row:translate-x-2",
              tier === "featured"
                ? "text-[1.9rem] leading-[1.04] md:text-[clamp(2.4rem,3.8vw,3.6rem)]"
                : "text-xl leading-snug md:text-2xl"
            )}
          >
            {item.title}
          </h2>
          <span className="font-body text-sm text-text-muted">{item.year}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5">
          <p
            className={cn(
              "max-w-[62ch] font-body leading-relaxed text-text-secondary",
              tier === "featured" ? "text-base" : "text-sm"
            )}
          >
            {item.oneLiner}
          </p>
          <span className="font-body text-caption text-text-muted">
            {[item.org, item.statusLabel].filter(Boolean).join(" · ")}
          </span>
        </div>
      </Link>
    );

    if (!animateRows) {
      return <li key={item.id}>{row}</li>;
    }

    return (
      <motion.li
        key={item.id}
        layout
        initial={hasMounted.current ? { opacity: 0, y: 10 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={transitions.quick}
      >
        {row}
      </motion.li>
    );
  };

  const renderList = (list: WorkIndexItem[], tier: "featured" | "compact") => (
    <ul className="group/list">{list.map((item) => renderRow(item, tier))}</ul>
  );

  return (
    <div
      onPointerMove={previewEnabled ? handleListPointerMove : undefined}
      onPointerLeave={previewEnabled ? () => setActiveItem(null) : undefined}
    >
      <WorkFilters
        active={filter}
        onChange={handleFilterChange}
        resultCount={filtered.length}
        animated={animateRows}
      />

      {featuredItems.length > 0 ? (
        <div className="mt-2 md:mt-4">{renderList(featuredItems, "featured")}</div>
      ) : null}

      {moreItems.length > 0 ? (
        <div className="mt-10 md:mt-14">
          <Eyebrow className="mb-3 text-text-muted">More work</Eyebrow>
          {renderList(moreItems, "compact")}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <p className="mt-10 font-body text-text-secondary">
          Nothing under this lens yet — try another filter.
        </p>
      ) : null}

      {previewEnabled ? (
        <WorkRowPreview item={activeItem} pointerX={pointerX} pointerY={pointerY} />
      ) : null}
    </div>
  );
}
