"use client";

import type { ReactNode } from "react";
import Masonry from "react-masonry-css";

type ResponsiveMasonryProps = {
  children: ReactNode;
  breakpointCols?: Record<string, number> | number;
  className?: string;
  columnClassName?: string;
};

const defaultBreakpoints = {
  default: 2,
  768: 1
};

const defaultClassName = "-ml-3.5 flex w-auto md:-ml-4";
const defaultColumnClassName = "space-y-3.5 pl-3.5 md:space-y-4 md:pl-4";

export function ResponsiveMasonry({
  children,
  breakpointCols = defaultBreakpoints,
  className = defaultClassName,
  columnClassName = defaultColumnClassName
}: ResponsiveMasonryProps) {
  return (
    <Masonry breakpointCols={breakpointCols} className={className} columnClassName={columnClassName}>
      {children}
    </Masonry>
  );
}
