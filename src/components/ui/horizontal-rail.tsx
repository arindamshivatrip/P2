"use client";

import { Children, useEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type HorizontalRailProps = {
  id: string;
  children: ReactNode;
  railLabel: string;
  className?: string;
  trackClassName?: string;
  viewportClassName?: string;
  loop?: boolean;
};

export function HorizontalRail({
  id,
  children,
  railLabel,
  className,
  trackClassName,
  viewportClassName,
  loop = false
}: HorizontalRailProps) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const childArray = useMemo(() => Children.toArray(children), [children]);

  const renderChildren = useMemo(() => {
    if (!loop) {
      return childArray;
    }

    const before = childArray.map((child, index) => (
      <div key={`loop-before-${id}-${index}`} className="contents" aria-hidden="true">
        {child}
      </div>
    ));

    const middle = childArray.map((child, index) => (
      <div key={`loop-middle-${id}-${index}`} className="contents">
        {child}
      </div>
    ));

    const after = childArray.map((child, index) => (
      <div key={`loop-after-${id}-${index}`} className="contents" aria-hidden="true">
        {child}
      </div>
    ));

    return [...before, ...middle, ...after];
  }, [childArray, id, loop]);

  const normalizeLoopPosition = () => {
    if (!loop) {
      return;
    }

    const node = railRef.current;
    if (!node) {
      return;
    }

    const setWidth = node.scrollWidth / 3;
    if (!Number.isFinite(setWidth) || setWidth <= 0) {
      return;
    }

    if (node.scrollLeft < setWidth * 0.5) {
      node.scrollLeft += setWidth;
      return;
    }

    if (node.scrollLeft > setWidth * 1.5) {
      node.scrollLeft -= setWidth;
    }
  };

  useEffect(() => {
    if (!loop) {
      return;
    }

    const node = railRef.current;
    if (!node) {
      return;
    }

    const setWidth = node.scrollWidth / 3;
    if (!Number.isFinite(setWidth) || setWidth <= 0) {
      return;
    }

    node.scrollLeft = setWidth;
  }, [loop, childArray.length]);

  useEffect(() => {
    return () => {
      if (settleTimerRef.current) {
        clearTimeout(settleTimerRef.current);
      }
    };
  }, []);

  const handleScroll = () => {
    if (!loop) {
      return;
    }

    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
    }

    settleTimerRef.current = setTimeout(() => {
      normalizeLoopPosition();
    }, 120);
  };

  const scrollRail = (direction: "left" | "right") => {
    const node = railRef.current;
    if (!node) {
      return;
    }

    const firstItem = node.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(node).columnGap || "0") || 0;
    const step = firstItem ? firstItem.getBoundingClientRect().width + gap : 0;
    const amount = step > 0 ? step : Math.max(320, Math.round(node.clientWidth * 0.72));

    node.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth"
    });

    if (!loop) {
      return;
    }

    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
    }

    settleTimerRef.current = setTimeout(() => {
      normalizeLoopPosition();
    }, 340);
  };

  return (
    <div
      className={cn(
        "grid grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-2 md:grid-cols-[3.25rem_minmax(0,1fr)_3.25rem] md:gap-3",
        className
      )}
    >
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={() => scrollRail("left")}
          aria-label={`Scroll ${railLabel} left`}
          aria-controls={id}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/45 bg-surface/96 text-foreground/70 shadow-[0_8px_18px_rgba(28,23,19,0.08)] transition-colors hover:border-accent/30 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 md:h-10 md:w-10"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="h-4 w-4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.5 3.5 5 8l4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className={cn("relative min-w-0 overflow-hidden", viewportClassName)}>
        <div
          id={id}
          ref={railRef}
          onScroll={handleScroll}
          className={cn(
            "flex snap-x snap-mandatory gap-4 overflow-x-auto px-3 pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
            trackClassName
          )}
          style={{ scrollPaddingLeft: "0.75rem", scrollPaddingRight: "0.75rem" }}
        >
          {renderChildren}
        </div>
      </div>

      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={() => scrollRail("right")}
          aria-label={`Scroll ${railLabel} right`}
          aria-controls={id}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/45 bg-surface/96 text-foreground/70 shadow-[0_8px_18px_rgba(28,23,19,0.08)] transition-colors hover:border-accent/30 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 md:h-10 md:w-10"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="h-4 w-4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.5 3.5 11 8l-4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
