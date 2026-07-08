"use client";

import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject
} from "react";
import { ExperimentCard, type LabItem } from "@/components/experiments/experiment-card";
import { Eyebrow } from "@/components/typography/eyebrow";
import { springs } from "@/lib/motion";
import { cn } from "@/lib/utils";

// ——— The Bench: a window onto a larger lab surface. Pan the surface, move the
// cards, draw with the pen, press the stamp. Everything is transforms only.

const SURFACE = { w: 2400, h: 1500 };
const START = { x: 1270, y: 540 };

const CARD_SPOTS = [
  { x: 920, y: 380, r: -1.2, w: 350 },
  { x: 1440, y: 320, r: 1.1, w: 300 },
  { x: 1540, y: 770, r: -0.7, w: 300 },
  { x: 590, y: 720, r: 1.6, w: 300 },
  { x: 1820, y: 540, r: -1.8, w: 300 }
];

const PEN_SPOT = { x: 830, y: 580 };
const STAMP_SPOT = { x: 1330, y: 610 };
const FLIP_NOTE_SPOT = { x: 1690, y: 790 };

const INK_SAMPLE_MS = 28;
const MAX_INK_SEGMENTS = 700;
const MAX_IMPRINTS = 24;
const MAX_BURSTS = 8;

// honest verdicts only — cycled in order, never random
const STAMP_VARIANTS = ["tested", "approved", "retry", "oddly works", "notes"];

type Imprint = { x: number; y: number; r: number; label: string };
type Burst = { id: number; x: number; y: number; kind: number };

function clampPan(value: number, min: number) {
  return Math.min(0, Math.max(min, value));
}

function FoldedNote({
  lines,
  className,
  style,
  restRotate = 1.5
}: {
  lines: string[];
  className?: string;
  style?: CSSProperties;
  restRotate?: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <motion.button
      type="button"
      onClick={() => setOpen((value) => !value)}
      className={cn(
        "rounded-[0.5rem] border border-border/60 bg-[#f6efdd] p-3 text-left shadow-card transition-[width] duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        open ? "w-60" : "w-40",
        className
      )}
      style={style}
      animate={{ rotate: open ? 0 : restRotate }}
      aria-expanded={open}
      aria-label={open ? "Close the lab note" : "Open the folded note"}
    >
      {open ? (
        <span className="block space-y-1">
          <span className="block font-body text-[0.58rem] uppercase tracking-[0.14em] text-text-muted">
            lab notes
          </span>
          {lines.map((line) => (
            <span
              key={line}
              className="block font-serif text-sm italic leading-snug text-foreground/85"
            >
              {line}
            </span>
          ))}
        </span>
      ) : (
        <span className="block font-serif text-sm italic leading-snug text-foreground/85">
          a folded note. open it?
        </span>
      )}
    </motion.button>
  );
}

function TapBurst({ burst }: { burst: Burst }) {
  const baseStyle = { left: burst.x, top: burst.y };
  const baseClass = "pointer-events-none absolute -translate-x-1/2 -translate-y-1/2";

  if (burst.kind === 0) {
    return (
      <motion.span
        className={`${baseClass} h-7 w-7 rounded-full border-2 border-accent`}
        style={baseStyle}
        initial={{ scale: 0.2, opacity: 0.85 }}
        animate={{ scale: 1.7, opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        aria-hidden="true"
      />
    );
  }

  if (burst.kind === 1) {
    return (
      <motion.span
        className={`${baseClass} font-display text-2xl leading-none text-accent`}
        style={baseStyle}
        initial={{ scale: 0.3, opacity: 0.85, rotate: 0 }}
        animate={{ scale: 1.15, opacity: 0, rotate: 40 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        aria-hidden="true"
      >
        ✳
      </motion.span>
    );
  }

  if (burst.kind === 2) {
    return (
      <motion.span
        className={baseClass}
        style={baseStyle}
        initial={{ opacity: 0.85 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        aria-hidden="true"
      >
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            className="absolute h-1.5 w-1.5 rounded-full bg-foreground/70"
            initial={{ x: 0, y: 0 }}
            animate={{
              x: Math.cos((dot * 2 * Math.PI) / 3 - Math.PI / 2) * 18,
              y: Math.sin((dot * 2 * Math.PI) / 3 - Math.PI / 2) * 18
            }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        ))}
      </motion.span>
    );
  }

  return (
    <motion.svg
      className={baseClass}
      style={baseStyle}
      width="26"
      height="12"
      viewBox="0 0 26 12"
      initial={{ opacity: 0.85 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.85, ease: "easeOut" }}
      aria-hidden="true"
    >
      <motion.path
        d="M1 8 Q 5 1 9 8 T 17 8 T 25 8"
        fill="none"
        stroke="rgb(31 31 31 / 0.75)"
        strokeWidth={1.6}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />
    </motion.svg>
  );
}


type SpotProps = {
  item: LabItem;
  spot: (typeof CARD_SPOTS)[number];
  index: number;
  surfaceRef: RefObject<HTMLDivElement | null>;
  onFocusPan: () => void;
};

function BenchCard({ item, spot, index, surfaceRef, onFocusPan }: SpotProps) {
  const dragged = useRef(false);

  return (
    <motion.div
      className="absolute cursor-grab active:cursor-grabbing"
      style={{ left: spot.x, top: spot.y, width: spot.w, rotate: spot.r, willChange: "transform" }}
      drag
      dragConstraints={surfaceRef}
      dragMomentum={false}
      dragElastic={0.18}
      whileDrag={{ rotate: 0, scale: 1.03, zIndex: 30 }}
      onDragStart={() => {
        dragged.current = true;
      }}
      onDragEnd={() => {
        window.setTimeout(() => {
          dragged.current = false;
        }, 0);
      }}
      onClickCapture={(event) => {
        // a drag should never open the card
        if (dragged.current) {
          event.preventDefault();
          event.stopPropagation();
        }
      }}
    >
      <ExperimentCard item={item} tint={index} featured={index === 0} onLinkFocus={onFocusPan} />
    </motion.div>
  );
}

function LabCanvas({ items }: { items: LabItem[] }) {
  const windowRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [win, setWin] = useState({ w: 0, h: 0 });
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);
  const initialised = useRef(false);

  const strokesRef = useRef<string[]>([]);
  const segmentsRef = useRef(0);
  const lastSampleRef = useRef(0);
  const [strokes, setStrokes] = useState<string[]>([]);
  const penTipRef = useRef<HTMLSpanElement>(null);
  const stampRef = useRef<HTMLButtonElement>(null);
  const stampDragged = useRef(false);
  const totalImprintsRef = useRef(0);
  const [imprints, setImprints] = useState<Imprint[]>([]);
  const surfaceDragged = useRef(false);
  const burstIdRef = useRef(0);
  const [bursts, setBursts] = useState<Burst[]>([]);

  const boundLeft = Math.min(0, win.w - SURFACE.w);
  const boundTop = Math.min(0, win.h - SURFACE.h);

  useEffect(() => {
    const el = windowRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      setWin({ w: rect.width, h: rect.height });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (!win.w || initialised.current) return;
    initialised.current = true;
    panX.set(clampPan(-(START.x - win.w / 2), Math.min(0, win.w - SURFACE.w)));
    panY.set(clampPan(-(START.y - win.h / 2), Math.min(0, win.h - SURFACE.h)));
  }, [win, panX, panY]);

  const panBy = (dx: number, dy: number) => {
    animate(panX, clampPan(panX.get() + dx, boundLeft), { type: "spring", ...springs.follow });
    animate(panY, clampPan(panY.get() + dy, boundTop), { type: "spring", ...springs.follow });
  };

  const panToSpot = (spot: (typeof CARD_SPOTS)[number]) => {
    animate(panX, clampPan(-(spot.x + spot.w / 2 - win.w / 2), boundLeft), {
      type: "spring",
      ...springs.follow
    });
    animate(panY, clampPan(-(spot.y + 150 - win.h / 2), boundTop), {
      type: "spring",
      ...springs.follow
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = 160;
    if (event.key === "ArrowLeft") panBy(step, 0);
    else if (event.key === "ArrowRight") panBy(-step, 0);
    else if (event.key === "ArrowUp") panBy(0, step);
    else if (event.key === "ArrowDown") panBy(0, -step);
    else return;
    event.preventDefault();
  };

  const handlePenDragStart = () => {
    strokesRef.current = [...strokesRef.current, ""];
  };

  const handlePenDrag = () => {
    const now = performance.now();
    if (now - lastSampleRef.current < INK_SAMPLE_MS) return;
    lastSampleRef.current = now;
    const surfaceEl = surfaceRef.current;
    const tipEl = penTipRef.current;
    if (!surfaceEl || !tipEl) return;
    // ink flows from the nib, not from wherever the pen was grabbed
    const rect = surfaceEl.getBoundingClientRect();
    const tip = tipEl.getBoundingClientRect();
    const x = Math.round(tip.left + tip.width / 2 - rect.left);
    const y = Math.round(tip.top + tip.height / 2 - rect.top);
    if (x < 0 || y < 0 || x > SURFACE.w || y > SURFACE.h) return;
    const strokeIndex = strokesRef.current.length - 1;
    strokesRef.current[strokeIndex] = strokesRef.current[strokeIndex]
      ? `${strokesRef.current[strokeIndex]} L ${x} ${y}`
      : `M ${x} ${y}`;
    segmentsRef.current += 1;
    if (segmentsRef.current > MAX_INK_SEGMENTS && strokesRef.current.length > 1) {
      const removed = strokesRef.current.shift();
      segmentsRef.current -= removed ? removed.split(" L ").length : 0;
    }
    setStrokes([...strokesRef.current]);
  };

  const pressStamp = () => {
    // a drag repositions the stamp; only a clean press leaves a mark
    if (stampDragged.current) return;
    const stampEl = stampRef.current;
    const surfaceEl = surfaceRef.current;
    if (!stampEl || !surfaceEl) return;
    const stampRect = stampEl.getBoundingClientRect();
    const surfaceRect = surfaceEl.getBoundingClientRect();
    const count = totalImprintsRef.current;
    totalImprintsRef.current += 1;
    const centerX = stampRect.left + stampRect.width / 2 - surfaceRect.left;
    const centerY = stampRect.top + stampRect.height / 2 - surfaceRect.top;
    setImprints((previous) =>
      [
        ...previous,
        {
          x: centerX - 28 + ((count * 13) % 14) - 7,
          y: centerY - 28 + ((count * 7) % 10) - 5,
          r: ((count * 37) % 26) - 13,
          label: STAMP_VARIANTS[count % STAMP_VARIANTS.length]
        }
      ].slice(-MAX_IMPRINTS)
    );
  };

  const handleSurfaceClick = (event: MouseEvent<HTMLDivElement>) => {
    // panning is not tapping, and objects handle their own clicks
    if (surfaceDragged.current) return;
    if ((event.target as HTMLElement).closest("[data-lab-object], a, button, article")) return;
    const surfaceEl = surfaceRef.current;
    if (!surfaceEl) return;
    const rect = surfaceEl.getBoundingClientRect();
    const id = burstIdRef.current;
    burstIdRef.current += 1;
    setBursts((previous) =>
      [
        ...previous,
        { id, x: event.clientX - rect.left, y: event.clientY - rect.top, kind: id % 4 }
      ].slice(-MAX_BURSTS)
    );
    window.setTimeout(() => {
      setBursts((previous) => previous.filter((burst) => burst.id !== id));
    }, 950);
  };

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <Eyebrow>The bench</Eyebrow>
        <p className="font-body text-xs text-text-muted">
          drag to look around · cards move · arrow keys pan
        </p>
      </div>

      <div
        ref={windowRef}
        tabIndex={0}
        role="region"
        aria-label="Experiments lab bench. A draggable canvas — use arrow keys to pan. All experiments are also listed below the canvas."
        onKeyDown={handleKeyDown}
        className="relative mt-3 h-[min(72svh,44rem)] min-h-[30rem] overflow-hidden rounded-[1rem] border border-border/60 bg-surface/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      >
        <motion.div
          ref={surfaceRef}
          drag
          dragConstraints={{ left: boundLeft, right: 0, top: boundTop, bottom: 0 }}
          dragElastic={0.06}
          dragTransition={{ power: 0.25, timeConstant: 220 }}
          onDragStart={() => {
            surfaceDragged.current = true;
          }}
          onDragEnd={() => {
            window.setTimeout(() => {
              surfaceDragged.current = false;
            }, 0);
          }}
          onClick={handleSurfaceClick}
          style={{ x: panX, y: panY, width: SURFACE.w, height: SURFACE.h, willChange: "transform" }}
          className="relative cursor-grab bg-[radial-gradient(circle,rgba(31,31,31,0.055)_1px,transparent_1px)] [background-size:32px_32px] active:cursor-grabbing"
        >
          {/* ink layer — under everything so drawings sit on the bench */}
          <svg
            className="pointer-events-none absolute inset-0"
            width={SURFACE.w}
            height={SURFACE.h}
            aria-hidden="true"
          >
            {strokes.map((d, index) =>
              d ? (
                <path
                  key={index}
                  d={d}
                  fill="none"
                  stroke="rgb(31 31 31 / 0.7)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null
            )}
          </svg>

          {/* stamp imprints */}
          {imprints.map((imprint, index) => (
            <motion.span
              key={`${imprint.x}-${imprint.y}-${index}`}
              className="absolute flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent/70 px-1 text-center font-body text-[0.45rem] font-semibold uppercase leading-tight tracking-[0.13em] text-accent"
              style={{ left: imprint.x, top: imprint.y, rotate: imprint.r }}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.9 }}
              transition={{ type: "spring", ...springs.snappy }}
              aria-hidden="true"
            >
              {imprint.label}
            </motion.span>
          ))}

          {/* tap bursts */}
          {bursts.map((burst) => (
            <TapBurst key={burst.id} burst={burst} />
          ))}

          {/* hint scraps */}
          <p
            className="absolute w-max font-serif text-[1.05rem] italic text-text-secondary"
            style={{ left: 1210, top: 240, rotate: "2deg" }}
            aria-hidden="true"
          >
            drag the canvas ↘
          </p>
          <p
            className="absolute w-max font-serif text-[1.05rem] italic text-text-secondary"
            style={{ left: 1000, top: 700, rotate: "-2deg" }}
            aria-hidden="true"
          >
            the cards move too — pick one up
          </p>

          {/* the pen — drag it and it writes from the nib */}
          <motion.div
            className="absolute z-20 cursor-grab active:cursor-grabbing"
            style={{ left: PEN_SPOT.x, top: PEN_SPOT.y }}
            drag
            dragConstraints={surfaceRef}
            dragMomentum={false}
            dragElastic={0.15}
            onDragStart={handlePenDragStart}
            onDrag={handlePenDrag}
            data-lab-object=""
          >
            <div className="relative -rotate-[38deg]">
              {/* invisible marker at the nib apex — the ink origin */}
              <span ref={penTipRef} className="absolute left-0 top-1/2 h-px w-px" aria-hidden="true" />
              <div className="flex items-center">
                <span className="relative block h-3 w-4 bg-[#c9a26b] [clip-path:polygon(0_50%,100%_0,100%_100%)]">
                  <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-foreground/50" />
                </span>
                <span className="block h-2.5 w-1.5 rounded-[1px] bg-foreground/80" />
                <span className="relative block h-3 w-12 rounded-r-full bg-foreground">
                  <span className="absolute right-2.5 top-0 block h-3 w-[2px] bg-[#c9a26b]/80" />
                </span>
              </div>
            </div>
            <p className="mt-3 w-max font-serif text-xs italic text-text-muted">the pen writes</p>
          </motion.div>

          {/* the stamp — carry it anywhere, press it there */}
          <motion.div
            className="absolute z-20 cursor-grab active:cursor-grabbing"
            style={{ left: STAMP_SPOT.x, top: STAMP_SPOT.y }}
            drag
            dragConstraints={surfaceRef}
            dragMomentum={false}
            dragElastic={0.15}
            onDragStart={() => {
              stampDragged.current = true;
            }}
            onDragEnd={() => {
              window.setTimeout(() => {
                stampDragged.current = false;
              }, 0);
            }}
            data-lab-object=""
          >
            <motion.button
              ref={stampRef}
              type="button"
              onClick={pressStamp}
              whileTap={{ scale: 0.85, y: 4 }}
              className="relative block h-14 w-14 rounded-[0.5rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              aria-label="Press the stamp — it leaves a mark right where it sits"
            >
              <span className="absolute left-1/2 top-0 h-5 w-3.5 -translate-x-1/2 rounded-t-full bg-foreground/85" />
              <span className="absolute left-1/2 top-4 h-3 w-2 -translate-x-1/2 bg-foreground/70" />
              <span className="absolute bottom-0 left-1/2 h-7 w-14 -translate-x-1/2 rounded-[0.5rem] bg-accent shadow-card" />
            </motion.button>
            <p className="mt-2 w-max font-serif text-xs italic text-text-muted">
              the stamp — move it, press it
            </p>
          </motion.div>

          {/* the folded note */}
          <FoldedNote
            className="absolute z-20"
            style={{ left: FLIP_NOTE_SPOT.x, top: FLIP_NOTE_SPOT.y }}
            lines={[
              "the pen writes. the stamp judges.",
              "cards open the full write-ups.",
              "tap the bench for sparks. — A"
            ]}
          />

          {/* the experiments */}
          {items.map((item, index) => {
            const spot = CARD_SPOTS[index % CARD_SPOTS.length];
            return (
              <BenchCard
                key={item.id}
                item={item}
                spot={spot}
                index={index}
                surfaceRef={surfaceRef}
                onFocusPan={() => panToSpot(spot)}
              />
            );
          })}
        </motion.div>
      </div>

      {/* nothing is drag-gated: a plain index of everything on the bench */}
      <p className="mt-3 font-body text-sm text-text-muted">
        On the bench:{" "}
        {items.map((item, index) => (
          <span key={item.id}>
            {index > 0 ? " · " : ""}
            <Link
              href={item.href}
              className="text-text-secondary underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {item.title}
            </Link>
          </span>
        ))}
      </p>
    </div>
  );
}

function LabShelf({ items }: { items: LabItem[] }) {
  const [stampCount, setStampCount] = useState(0);

  return (
    <div className="max-w-2xl">
      <div className="space-y-5">
        {items.map((item, index) => (
          <div key={item.id} className={index % 2 === 0 ? "-rotate-[0.35deg]" : "rotate-[0.45deg]"}>
            <ExperimentCard item={item} tint={index} featured={index === 0} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setStampCount((count) => Math.min(count + 1, 8))}
          className="rounded-[0.5rem] border border-border/70 bg-surface px-3 py-2 font-body text-[0.7rem] font-medium uppercase tracking-[0.12em] text-foreground shadow-card transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 motion-safe:active:scale-95"
        >
          press the stamp
        </button>
        <span className="flex flex-wrap gap-1.5" aria-hidden="true">
          {Array.from({ length: stampCount }).map((_, index) => (
            <span
              key={index}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent/70 px-0.5 text-center font-body text-[0.38rem] font-semibold uppercase leading-tight tracking-[0.12em] text-accent"
              style={{ rotate: `${((index * 37) % 26) - 13}deg` }}
            >
              {STAMP_VARIANTS[index % STAMP_VARIANTS.length]}
            </span>
          ))}
        </span>
      </div>

      <FoldedNote
        className="mt-4 block"
        restRotate={0}
        lines={["the stamp still works down here.", "the full bench lives on desktop. — A"]}
      />
    </div>
  );
}

export function ExperimentsCanvas({ items }: { items: LabItem[] }) {
  const prefersReducedMotion = useReducedMotion();
  const [canvasCapable, setCanvasCapable] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 900px) and (pointer: fine)");
    const update = () => setCanvasCapable(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (!canvasCapable || prefersReducedMotion) {
    return <LabShelf items={items} />;
  }

  return <LabCanvas items={items} />;
}
