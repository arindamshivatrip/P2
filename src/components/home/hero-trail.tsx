"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { heroTrailFragments } from "@/data/home";
import type { HeroTrailFragment } from "@/data/home";
import { cn } from "@/lib/utils";

const SPAWN_DISTANCE = 90;
const SPAWN_INTERVAL_MS = 55;
const MAX_FRAGMENTS = 6;
const LIFETIME_MS = 1050;
// Cached pointer lerp — items spawn at this lagged position and flow toward the
// live pointer, the way the Codrops "Flow Follow" trail reads as a streak.
const CACHE_LERP = 0.28;
// Entry lead (start behind along travel) and exit drift (coast forward, fading).
const ENTRY_LEAD = 22;
const EXIT_DRIFT = 64;
// Headline (soft zone) opacity floor and the falloff band around the ink.
const SOFT_MIN_OPACITY = 0.22;
const SOFT_FALLOFF = 46;
const ZONE_PADDING = 14;

const HALF_SIZE: Record<HeroTrailFragment["kind"], { hw: number; hh: number }> = {
  tile: { hw: 58, hh: 58 },
  word: { hw: 82, hh: 22 }
};

type Rect = { left: number; top: number; right: number; bottom: number };
type Zone = { rect: Rect; soft: boolean };

type SpawnedFragment = {
  id: number;
  x: number;
  y: number;
  dirX: number;
  dirY: number;
  rotation: number;
  peak: number;
  fragment: HeroTrailFragment;
};

function FragmentContent({ fragment }: { fragment: HeroTrailFragment }) {
  if (fragment.kind === "tile") {
    return (
      <div
        className={cn(
          "relative flex h-[116px] w-[116px] items-center justify-center overflow-hidden rounded-[1.4rem] border border-white/15 p-3 text-center shadow-card",
          fragment.gradient
        )}
      >
        {fragment.src ? (
          <Image src={fragment.src} alt={fragment.alt ?? ""} fill sizes="116px" className="object-cover" />
        ) : null}
        <span className="relative font-display text-xl uppercase leading-tight tracking-wide text-white drop-shadow-[0_1px_5px_rgba(8,10,28,0.5)]">
          {fragment.label}
        </span>
      </div>
    );
  }

  return (
    <span className="block whitespace-nowrap font-serif text-2xl italic text-accent drop-shadow-sm">
      {fragment.text}
    </span>
  );
}

// Read the hero's protected boxes in layer-local coordinates. Text is measured
// per text node so we protect the actual ink (line boxes hugging the glyphs),
// not the full-width block. The headline is a "soft" zone (fade over it); the
// paragraph, CTA, and accent rule are "hard" (offset fragments clear of them).
function readProtectedZones(layer: HTMLElement): Zone[] {
  const parent = layer.parentElement;
  if (!parent) {
    return [];
  }
  const layerRect = layer.getBoundingClientRect();
  const toLocal = (r: DOMRect): Rect => ({
    left: r.left - layerRect.left,
    top: r.top - layerRect.top,
    right: r.right - layerRect.left,
    bottom: r.bottom - layerRect.top
  });

  const zones: Zone[] = [];
  const range = document.createRange();
  for (const el of Array.from(parent.querySelectorAll<HTMLElement>("[data-hero-protect]"))) {
    const soft = el.dataset.heroProtect === "headline";
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let added = 0;
    let node = walker.nextNode();
    while (node) {
      if (node.nodeValue && node.nodeValue.trim()) {
        range.selectNodeContents(node);
        for (const r of Array.from(range.getClientRects())) {
          if (r.width > 1 && r.height > 1) {
            zones.push({ rect: toLocal(r), soft });
            added += 1;
          }
        }
      }
      node = walker.nextNode();
    }
    if (added === 0) {
      zones.push({ rect: toLocal(el.getBoundingClientRect()), soft });
    }
  }
  return zones;
}

// Push a point clear of the hard zones (paragraph, CTA, accent rule), biased
// toward the right margin and away from the text column, then clamp in bounds.
function avoidHardZones(
  px: number,
  py: number,
  hw: number,
  hh: number,
  zones: Zone[],
  bounds: { width: number; height: number }
) {
  let x = px;
  let y = py;
  const hard = zones.filter((z) => !z.soft).map((z) => z.rect);

  for (let pass = 0; pass < 3; pass++) {
    let moved = false;
    for (const zone of hard) {
      const left = zone.left - hw - ZONE_PADDING;
      const right = zone.right + hw + ZONE_PADDING;
      const top = zone.top - hh - ZONE_PADDING;
      const bottom = zone.bottom + hh + ZONE_PADDING;
      if (x > left && x < right && y > top && y < bottom) {
        const candidates = [
          { nx: right, ny: y, cost: (right - x) * 0.75 },
          { nx: left, ny: y, cost: (x - left) * 1.5 },
          { nx: x, ny: top, cost: (y - top) * 1.05 },
          { nx: x, ny: bottom, cost: (bottom - y) * 1.05 }
        ].filter(
          (c) => c.nx >= hw && c.nx <= bounds.width - hw && c.ny >= hh && c.ny <= bounds.height - hh
        );
        const best = candidates.sort((a, b) => a.cost - b.cost)[0];
        if (best) {
          x = best.nx;
          y = best.ny;
          moved = true;
        }
      }
    }
    if (!moved) {
      break;
    }
  }

  return {
    x: Math.min(bounds.width - hw, Math.max(hw, x)),
    y: Math.min(bounds.height - hh, Math.max(hh, y))
  };
}

// Opacity multiplier for the headline soft zone: full strength in open
// whitespace, easing down to SOFT_MIN over the headline ink so words stay
// readable without the trail going invisible.
function softOpacity(x: number, y: number, hw: number, hh: number, zones: Zone[]) {
  let factor = 1;
  for (const { rect, soft } of zones) {
    if (!soft) {
      continue;
    }
    const left = rect.left - hw;
    const right = rect.right + hw;
    const top = rect.top - hh;
    const bottom = rect.bottom + hh;
    if (x > left && x < right && y > top && y < bottom) {
      factor = Math.min(factor, SOFT_MIN_OPACITY);
    } else {
      const dx = Math.max(left - x, x - right, 0);
      const dy = Math.max(top - y, y - bottom, 0);
      const d = Math.hypot(dx, dy);
      if (d < SOFT_FALLOFF) {
        factor = Math.min(factor, SOFT_MIN_OPACITY + (1 - SOFT_MIN_OPACITY) * (d / SOFT_FALLOFF));
      }
    }
  }
  return factor;
}

// HeroTrail — a Flow Follow-inspired pointer trail for the hero. Minimal
// project tiles (+ a few craft words) stream along the pointer path: each
// spawns at a lagged/cached position, flows to the pointer, then drifts along
// the travel direction while fading. Readability is handled by placement +
// opacity, not by dimming the whole effect: hard text zones are avoided, the
// headline fades the trail, open whitespace carries full strength. The layer is
// pointer-events-none and sits behind the copy. Fine-pointer desktop only;
// mobile and reduced motion render nothing.
export function HeroTrail() {
  const prefersReducedMotion = useReducedMotion();
  const layerRef = useRef<HTMLDivElement>(null);
  const cachePos = useRef<{ x: number; y: number } | null>(null);
  const lastSpawnPos = useRef<{ x: number; y: number } | null>(null);
  const lastSpawnAt = useRef(0);
  const nextId = useRef(0);
  const deckIndex = useRef(0);
  const [enabled, setEnabled] = useState(false);
  const [spawned, setSpawned] = useState<SpawnedFragment[]>([]);

  useEffect(() => {
    setEnabled(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  useEffect(() => {
    const layer = layerRef.current;
    const parent = layer?.parentElement;
    if (!enabled || prefersReducedMotion || !layer || !parent) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }
      const rect = layer.getBoundingClientRect();
      const mx = event.clientX - rect.left;
      const my = event.clientY - rect.top;

      // Lerp the cached pointer toward the live pointer — the lagged origin is
      // what gives consecutive tiles their flowing continuity.
      const cache = cachePos.current ?? { x: mx, y: my };
      cache.x += (mx - cache.x) * CACHE_LERP;
      cache.y += (my - cache.y) * CACHE_LERP;
      cachePos.current = cache;

      const last = lastSpawnPos.current;
      if (last && Math.hypot(mx - last.x, my - last.y) < SPAWN_DISTANCE) {
        return;
      }
      lastSpawnPos.current = { x: mx, y: my };
      if (!last) {
        return;
      }

      const now = performance.now();
      if (now - lastSpawnAt.current < SPAWN_INTERVAL_MS) {
        return;
      }
      lastSpawnAt.current = now;

      const dx = mx - last.x;
      const dy = my - last.y;
      const len = Math.hypot(dx, dy) || 1;
      const dirX = dx / len;
      const dirY = dy / len;

      const id = nextId.current++;
      const fragment = heroTrailFragments[deckIndex.current++ % heroTrailFragments.length];
      const { hw, hh } = HALF_SIZE[fragment.kind];
      const zones = readProtectedZones(layer);
      // Spawn from the lagged cached position; keep it clear of hard zones.
      const placement = avoidHardZones(cache.x, cache.y, hw, hh, zones, {
        width: rect.width,
        height: rect.height
      });
      const base = fragment.kind === "tile" ? 1 : 0.9;
      const peak = base * softOpacity(placement.x, placement.y, hw, hh, zones);
      const rotation = Math.max(-7, Math.min(7, dirX * 7));

      setSpawned((previous) =>
        [...previous, { id, x: placement.x, y: placement.y, dirX, dirY, rotation, peak, fragment }].slice(
          -MAX_FRAGMENTS
        )
      );
    };

    const handlePointerLeave = () => {
      lastSpawnPos.current = null;
    };

    parent.addEventListener("pointermove", handlePointerMove);
    parent.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      parent.removeEventListener("pointermove", handlePointerMove);
      parent.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [enabled, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return null;
  }

  const removeFragment = (id: number) =>
    setSpawned((previous) => previous.filter((item) => item.id !== id));

  return (
    <div
      ref={layerRef}
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block"
      aria-hidden="true"
    >
      {spawned.map((item) => (
        <motion.div
          key={item.id}
          className="absolute"
          style={{ left: item.x, top: item.y }}
          initial={{ x: -item.dirX * ENTRY_LEAD, y: -item.dirY * ENTRY_LEAD, opacity: 0, scale: 0.72 }}
          animate={{
            x: [-item.dirX * ENTRY_LEAD, 0, item.dirX * EXIT_DRIFT],
            y: [-item.dirY * ENTRY_LEAD, 0, item.dirY * EXIT_DRIFT],
            opacity: [0, item.peak, item.peak, 0],
            scale: [0.72, 1, 1, 0.98],
            filter: ["blur(5px)", "blur(0px)", "blur(0px)", "blur(2px)"]
          }}
          transition={{
            duration: LIFETIME_MS / 1000,
            ease: [0.22, 0.61, 0.36, 1],
            times: [0, 0.24, 0.68, 1]
          }}
          onAnimationComplete={() => removeFragment(item.id)}
        >
          <div style={{ transform: `translate(-50%, -50%) rotate(${item.rotation}deg)` }}>
            <FragmentContent fragment={item.fragment} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
