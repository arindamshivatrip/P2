"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type SelectedWorkItem = {
  id: string;
  href: string;
  title: string;
  oneLiner: string;
  year: string;
  org?: string;
  statusLabel: string;
  fallbackGradient: string;
  cover?: string;
  video?: string;
};

type HomeSelectedProjectsProps = {
  items: SelectedWorkItem[];
};

// Media for one project — mirrors the /work row preview so the two surfaces
// read as siblings: real video/cover when it exists, otherwise the designed
// themed gradient with a typographic overlay (never a broken/blank frame).
function PreviewMedia({ item }: { item: SelectedWorkItem }) {
  if (item.video) {
    return (
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={item.video}
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        preload="metadata"
        tabIndex={-1}
      />
    );
  }

  if (item.cover) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src={item.cover}
        alt=""
        loading="eager"
        decoding="async"
      />
    );
  }

  return (
    <div className="absolute inset-0" style={{ backgroundImage: item.fallbackGradient }}>
      <div className="absolute inset-0 bg-[rgba(31,31,31,0.28)]" />
      <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-6">
        <span className="font-body text-label uppercase text-background/80">
          {item.year} · {item.statusLabel}
        </span>
        <span className="max-w-[14ch] font-display text-[1.6rem] leading-[1.1] tracking-tight text-background">
          {item.title}
        </span>
      </div>
    </div>
  );
}

function RowMeta({ item }: { item: SelectedWorkItem }) {
  return (
    <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5">
      <p className="max-w-[52ch] font-body text-base leading-relaxed text-text-secondary">
        {item.oneLiner}
      </p>
      <span className="font-body text-caption text-text-muted">
        {[item.org, item.statusLabel].filter(Boolean).join(" · ")}
      </span>
    </div>
  );
}

// Selected Work Ledger with Active Preview: a text-first list of large editorial
// rows beside one persistent preview panel that starts on the first project and
// follows hover/focus. Every fact (title, year, one-liner, org/status) stays in
// the row itself — the panel is a bonus, not the source of truth. Mobile stacks
// each project with its own inline preview (no hover dependency).
export function HomeSelectedProjects({ items }: HomeSelectedProjectsProps) {
  const prefersReducedMotion = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    setFinePointer(query.matches);
    const onChange = (event: MediaQueryListEvent) => setFinePointer(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  if (items.length === 0) {
    return null;
  }

  const active = items.find((item) => item.id === activeId) ?? items[0];
  const fade = prefersReducedMotion ? 0.12 : 0.3;

  return (
    <>
      {/* Desktop: ledger + one persistent preview */}
      <div className="mt-8 hidden gap-10 lg:grid lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-start">
        <ul className="group/list">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                onPointerEnter={finePointer ? () => setActiveId(item.id) : undefined}
                onFocus={() => setActiveId(item.id)}
                className={cn(
                  "group/row block border-t border-border/60 py-6 transition-opacity duration-200 last:border-b md:py-7",
                  finePointer && "group-hover/list:opacity-45 hover:!opacity-100",
                  finePointer && activeId === item.id && "!opacity-100"
                )}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="font-display text-[clamp(1.8rem,2.6vw,2.6rem)] leading-[1.05] tracking-tight transition-transform duration-200 motion-safe:group-hover/row:translate-x-2">
                    {item.title}
                  </h3>
                  <span className="font-body text-sm text-text-muted">{item.year}</span>
                </div>
                <RowMeta item={item} />
              </Link>
            </li>
          ))}
        </ul>

        <div className="sticky top-24">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1rem] shadow-card">
            <AnimatePresence>
              <motion.div
                key={active.id}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: fade, ease: [0.22, 0.61, 0.36, 1] }}
              >
                <PreviewMedia item={active} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile: stacked rows, each with its own inline preview */}
      <ul className="mt-6 lg:hidden">
        {items.map((item) => (
          <li key={item.id} className="border-t border-border/60 py-6 first:border-t-0 first:pt-2">
            <Link href={item.href} className="block">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[0.9rem] shadow-card">
                <PreviewMedia item={item} />
              </div>
              <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-display text-2xl leading-tight tracking-tight">{item.title}</h3>
                <span className="font-body text-sm text-text-muted">{item.year}</span>
              </div>
              <RowMeta item={item} />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
