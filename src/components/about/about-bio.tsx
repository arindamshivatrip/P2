"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  aboutBehaviorBoard,
  aboutDomainReveals,
  aboutGalleryItems,
  aboutJourney,
  aboutPersonalReveals
} from "@/data/about";
import { interactionSounds, setSoundMuted } from "@/lib/interaction-sound";
import { cn } from "@/lib/utils";

const EASE = [0.22, 0.61, 0.36, 1] as const;

const galleryByName = new Map(aboutGalleryItems.map((item) => [item.assetName, item] as const));

type PersonalId = keyof typeof aboutPersonalReveals;

/* ------------------------------ soft phrases ------------------------------ */

const PHRASE_BASE =
  "rounded-[0.3rem] px-[0.3em] py-[0.02em] align-baseline text-foreground underline underline-offset-[0.22em] [-webkit-box-decoration-break:clone] [box-decoration-break:clone] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const DOMAIN_CLOSED =
  "bg-foreground/5 decoration-dotted decoration-1 decoration-foreground/30 hover:bg-foreground/10 hover:decoration-accent/70";
const DOMAIN_OPEN = "bg-foreground/10 decoration-solid decoration-[1.5px] decoration-accent";
// journey is the main door — slightly warmer at rest than the quiet domains
const JOURNEY_CLOSED =
  "bg-accent/10 decoration-solid decoration-1 decoration-accent/50 hover:bg-accent/15 hover:decoration-accent";
const JOURNEY_OPEN = "bg-accent/15 decoration-solid decoration-[1.5px] decoration-accent";

function Phrase({
  label,
  open,
  onToggle,
  controls,
  variant = "domain"
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  controls: string;
  variant?: "domain" | "journey";
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={controls}
      onClick={onToggle}
      className={cn(
        PHRASE_BASE,
        variant === "journey"
          ? open
            ? JOURNEY_OPEN
            : JOURNEY_CLOSED
          : open
            ? DOMAIN_OPEN
            : DOMAIN_CLOSED
      )}
    >
      {label}
    </button>
  );
}

// Inline parenthetical clause — display:inline so it wraps as prose.
function Clause({
  open,
  reduced,
  id,
  children
}: {
  open: boolean;
  reduced: boolean;
  id: string;
  children: ReactNode;
}) {
  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.span
          key="clause"
          id={id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.12 : 0.3, ease: EASE }}
          className="text-text-muted"
        >
          {" "}
          <span aria-hidden="true" className="text-accent/60">
            (
          </span>
          {children}
          <span aria-hidden="true" className="text-accent/60">
            )
          </span>
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
}

/* ------------------------------ journey reveal ------------------------------ */

// The main progressive reveal: journey opens a tiny route, then three nested
// chapter blanks stagger in. Each blank opens only its own explanation. The
// chapters live only here — they are never closed-state phrases.
function JourneyReveal({
  open,
  onToggle,
  openChapters,
  onToggleChapter,
  reduced
}: {
  open: boolean;
  onToggle: () => void;
  openChapters: Set<string>;
  onToggleChapter: (id: string) => void;
  reduced: boolean;
}) {
  return (
    <span className="inline">
      <Phrase
        label="journey"
        variant="journey"
        open={open}
        onToggle={onToggle}
        controls="bio-journey"
      />
      <AnimatePresence initial={false}>
        {open ? (
          <motion.span
            key="route"
            id="bio-journey"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.12 : 0.2, ease: EASE }}
            className="text-text-muted"
          >
            {" "}
            <span aria-hidden="true" className="text-accent/60">
              (
            </span>
            {aboutJourney.stops.map((stop, index) => (
              <motion.span
                key={stop}
                className="whitespace-nowrap text-foreground/80"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { delay: reduced ? 0 : 0.08 + index * 0.14, duration: 0.22 }
                }}
              >
                {index > 0 ? <span className="mx-1 text-accent/70">→</span> : null}
                {stop}
              </motion.span>
            ))}
            <span className="text-foreground/45">: </span>
            {aboutJourney.chapters.map((chapter, index) => (
              <ChapterBlank
                key={chapter.id}
                chapter={chapter}
                open={openChapters.has(chapter.id)}
                onToggle={() => onToggleChapter(chapter.id)}
                reduced={reduced}
                delay={0.5 + index * 0.14}
                showComma={index > 0}
              />
            ))}
            <span aria-hidden="true" className="text-accent/60">
              )
            </span>
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}

// A nested "blank" inside the journey: a small, quiet chapter phrase (route-dot
// + dashed underline, lighter than the domain pills) that opens only its own
// explanation inline, directly after it. Fades in on a stagger after the route.
function ChapterBlank({
  chapter,
  open,
  onToggle,
  reduced,
  delay,
  showComma
}: {
  chapter: (typeof aboutJourney.chapters)[number];
  open: boolean;
  onToggle: () => void;
  reduced: boolean;
  delay: number;
  showComma: boolean;
}) {
  return (
    <motion.span
      className="inline"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: reduced ? 0 : delay, duration: 0.26 } }}
    >
      {showComma ? <span className="text-foreground/45">, </span> : null}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`bio-ch-${chapter.id}`}
        onClick={onToggle}
        className={cn(
          "align-baseline text-[0.94em] text-foreground/90 underline decoration-dashed underline-offset-[0.2em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          open ? "decoration-[1.5px] decoration-accent" : "decoration-accent/40 hover:decoration-accent/80"
        )}
      >
        <span aria-hidden="true" className="mr-[0.15em] text-accent/60">
          ·
        </span>
        {chapter.title}
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.span
            key="chapter-body"
            id={`bio-ch-${chapter.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.12 : 0.28, ease: EASE }}
            className="text-[0.9em] text-text-muted/85"
          >
            {" "}
            <span aria-hidden="true" className="text-accent/45">
              (
            </span>
            {chapter.body}
            <span aria-hidden="true" className="text-accent/45">
              )
            </span>
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.span>
  );
}

/* ------------------------------ XR redaction ------------------------------ */

// Tiny tape attached only to "Project Aura details" — participation is public,
// the details are not. Quietly alternates two safe labels.
function Redaction({ reduced }: { reduced: boolean }) {
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (reduced) {
      return;
    }
    const timer = setInterval(() => setFlip((value) => !value), 2200);
    return () => clearInterval(timer);
  }, [reduced]);

  const label = reduced ? "redacted" : flip ? "NDA" : "redacted";

  return (
    <span className="inline-flex items-baseline">
      <span className="sr-only">private for now</span>
      <span
        aria-hidden="true"
        className="mx-[0.1em] inline-block min-w-[5.2em] rounded-[2px] bg-foreground px-[0.4em] text-center font-mono text-[0.78em] leading-snug text-background"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={label}
            className="inline-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

/* ------------------------------ behavior board ------------------------------ */

// One black split-flap board instead of three separate phrase buttons. It
// cycles slowly on its own; click freezes it and opens the detail clause for
// whatever it is showing. Fixed width so the sentence never reflows.
function BehaviorBoard({ reduced }: { reduced: boolean }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (reduced || open) {
      return;
    }
    const timer = setInterval(
      () => setIndex((value) => (value + 1) % aboutBehaviorBoard.length),
      3800
    );
    return () => clearInterval(timer);
  }, [reduced, open]);

  const state = aboutBehaviorBoard[index];

  const handleClick = () => {
    interactionSounds.flap();
    setOpen((value) => !value);
  };

  return (
    <span className="inline">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="bio-board-detail"
        onClick={handleClick}
        className="mx-[0.1em] inline-flex min-w-[12.5em] items-center justify-center rounded-[0.28rem] bg-foreground px-[0.55em] py-[0.14em] align-[0.08em] font-body text-[0.62em] uppercase tracking-[0.1em] text-background transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span className="sr-only">{state.phrase}</span>
        <span aria-hidden="true" className="overflow-hidden [perspective:400px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={state.phrase}
              className="inline-block [backface-visibility:hidden]"
              style={{ transformOrigin: "50% 100%" }}
              initial={reduced ? { opacity: 0 } : { rotateX: -88, opacity: 0 }}
              animate={reduced ? { opacity: 1 } : { rotateX: 0, opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { rotateX: 88, opacity: 0 }}
              transition={{ duration: reduced ? 0.12 : 0.3, ease: EASE }}
            >
              {state.phrase}
            </motion.span>
          </AnimatePresence>
        </span>
      </button>
      <Clause open={open} reduced={reduced} id="bio-board-detail">
        {state.detail}
      </Clause>
    </span>
  );
}

/* ------------------------------ terminal object ------------------------------ */

// Tiny inline command object — earned here because building is literal in this
// sentence. Resting text is a path; activating types a short command, holds,
// and reverts.
function TerminalObject({ reduced }: { reduced: boolean }) {
  const [typed, setTyped] = useState<string | null>(null);
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    const active = timers.current;
    return () => {
      active.forEach((timer) => clearTimeout(timer));
      active.clear();
    };
  }, []);

  const schedule = (fn: () => void, ms: number) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      fn();
    }, ms);
    timers.current.add(timer);
  };

  const run = () => {
    if (typed !== null) {
      return;
    }
    interactionSounds.key();
    const command = "npm run prototype";
    if (reduced) {
      setTyped(command);
      schedule(() => setTyped(null), 1800);
      return;
    }
    for (let i = 1; i <= command.length; i++) {
      schedule(() => setTyped(command.slice(0, i)), i * 34);
    }
    schedule(() => setTyped(null), command.length * 34 + 1700);
  };

  return (
    <button
      type="button"
      aria-label="build command"
      onClick={run}
      className="mx-[0.12em] inline-block rounded-[0.25rem] bg-foreground px-[0.5em] py-[0.05em] align-[0.06em] font-mono text-[0.6em] leading-snug text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span aria-hidden="true" className="text-accent">
        ${" "}
      </span>
      <span aria-hidden="true">{typed ?? "~/build"}</span>
      {typed !== null && !reduced ? (
        <motion.span
          aria-hidden="true"
          className="ml-[1px] inline-block h-[0.9em] w-[0.45em] translate-y-[0.12em] bg-background/90"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      ) : null}
    </button>
  );
}

/* ------------------------------ crossroads word ------------------------------ */

// "where" — the word at which research, code, and design meet. Activating it
// draws two tiny paths that cross and merge into one line.
function CrossroadsWord({ reduced }: { reduced: boolean }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    interactionSounds.tick();
    setOpen((value) => !value);
  };

  return (
    <span className="inline whitespace-nowrap">
      <button
        type="button"
        aria-pressed={open}
        aria-label="where — paths meeting"
        onClick={handleClick}
        className={cn(
          "border-b border-dashed align-baseline text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          open ? "border-accent" : "border-accent/50 hover:border-accent"
        )}
      >
        where
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.span
            key="cross"
            aria-hidden="true"
            className="ml-[0.2em] inline-block align-[-0.12em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="30" height="14" viewBox="0 0 30 14" fill="none" className="inline-block">
              <motion.path
                d="M1 3 C 10 3, 13 11, 29 11"
                stroke="rgb(var(--color-accent))"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
              />
              <motion.path
                d="M1 11 C 10 11, 13 3, 29 3"
                stroke="rgb(var(--color-foreground) / 0.55)"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.12, ease: EASE }}
              />
            </svg>
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}

/* ------------------------- intentional / overwhelming ------------------------- */

const ALIGN_MARKS = [
  { left: "8%", rotate: -38, y: -5 },
  { left: "27%", rotate: 26, y: 4 },
  { left: "46%", rotate: -16, y: -3 },
  { left: "65%", rotate: 32, y: 5 },
  { left: "82%", rotate: -24, y: -4 }
] as const;

// Scattered ticks under the word snap into a clean dashed underline — order
// arriving. Marks live inside the word's box, under the text.
function IntentionalWord({ reduced }: { reduced: boolean }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    interactionSounds.snap();
    setOpen((value) => !value);
  };

  return (
    <span className="relative inline-block">
      <button
        type="button"
        aria-pressed={open}
        onClick={handleClick}
        className={cn(
          PHRASE_BASE,
          open
            ? reduced
              ? "bg-accent/15 decoration-solid decoration-[1.5px] decoration-accent"
              : "bg-accent/10 no-underline"
            : DOMAIN_CLOSED
        )}
      >
        intentional
      </button>
      {open && !reduced ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[0.35em] bottom-[0.16em] block"
        >
          {ALIGN_MARKS.map((mark, index) => (
            <motion.span
              key={index}
              className="absolute bottom-0 h-[1.5px] w-[0.5em] rounded-full bg-accent"
              style={{ left: mark.left }}
              initial={{ opacity: 0, rotate: mark.rotate, y: mark.y }}
              animate={{ opacity: 1, rotate: 0, y: 0 }}
              transition={{ duration: 0.34, delay: index * 0.045, ease: EASE }}
            />
          ))}
        </span>
      ) : null}
    </span>
  );
}

const BURST_MARKS = [
  { x: -22, y: -12, rotate: 40, dash: true, delay: 0 },
  { x: 24, y: -15, rotate: -30, dash: false, delay: 0.02 },
  { x: -15, y: 13, rotate: -55, dash: true, delay: 0.04 },
  { x: 18, y: 14, rotate: 25, dash: false, delay: 0.01 },
  { x: -26, y: 2, rotate: 15, dash: false, delay: 0.05 },
  { x: 27, y: -2, rotate: -40, dash: true, delay: 0.03 },
  { x: -8, y: -17, rotate: 60, dash: false, delay: 0.06 },
  { x: 8, y: 17, rotate: -20, dash: true, delay: 0.02 },
  { x: -20, y: -6, rotate: -35, dash: false, delay: 0.07 },
  { x: 22, y: 8, rotate: 45, dash: true, delay: 0.04 },
  { x: -3, y: 15, rotate: 10, dash: false, delay: 0.08 },
  { x: 4, y: -14, rotate: -50, dash: true, delay: 0.05 }
] as const;

// A visible, contained overload: marks burst out around the word, jitter, and
// settle away. Replayable; each click re-keys the burst.
function OverwhelmingWord({ reduced }: { reduced: boolean }) {
  const [burst, setBurst] = useState(0);
  const [tinted, setTinted] = useState(false);

  const handleClick = () => {
    interactionSounds.scatter();
    if (reduced) {
      setTinted((value) => !value);
      return;
    }
    setBurst((value) => value + 1);
  };

  return (
    <span className="relative inline-block">
      <button
        type="button"
        aria-pressed={reduced ? tinted : undefined}
        aria-label="overwhelming — play a small burst"
        onClick={handleClick}
        className={cn(PHRASE_BASE, tinted ? "bg-foreground/10" : DOMAIN_CLOSED, "relative z-10")}
      >
        overwhelming
      </button>
      {burst > 0 && !reduced ? (
        <span key={burst} aria-hidden="true" className="pointer-events-none absolute inset-0">
          {/* brief pressure tint on the word itself */}
          <motion.span
            className="absolute inset-0 rounded-[0.3rem] bg-accent/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
          {BURST_MARKS.map((mark, index) => (
            <motion.span
              key={index}
              className={cn(
                "absolute left-1/2 top-1/2 rounded-full",
                mark.dash ? "h-[1.5px] w-[7px]" : "h-[3.5px] w-[3.5px]",
                index % 3 === 0 ? "bg-accent" : "bg-foreground/55"
              )}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.4, rotate: 0 }}
              animate={{
                x: mark.x,
                y: mark.y,
                opacity: [0, 1, 1, 0],
                scale: 1,
                rotate: mark.rotate
              }}
              transition={{ duration: 0.8, delay: mark.delay, ease: "easeOut" }}
            />
          ))}
        </span>
      ) : null}
    </span>
  );
}

/* ------------------------------ side polaroid ------------------------------ */

const POLAROID_ROTATIONS = [-2.4, 2.2, -1.6];

// One shared polaroid pulled out of the sentence by the personal words. On xl+
// it sits beside the paragraph; below xl it appears under the paragraph.
function SidePolaroid({
  personal,
  photoIndex,
  reduced
}: {
  personal: PersonalId | null;
  photoIndex: number;
  reduced: boolean;
}) {
  const reveal = personal ? aboutPersonalReveals[personal] : null;
  const assetName = reveal ? reveal.images[photoIndex % reveal.images.length] : null;
  const item = assetName ? galleryByName.get(assetName) : null;
  const rotation = POLAROID_ROTATIONS[photoIndex % POLAROID_ROTATIONS.length];

  const frame = (variant: "side" | "inline") => (
    <motion.figure
      key={`${assetName}-${variant}`}
      initial={
        reduced
          ? { opacity: 0 }
          : variant === "side"
            ? { opacity: 0, x: -12, scale: 0.95, rotate: rotation - 2 }
            : { opacity: 0, y: 8, scale: 0.97 }
      }
      animate={
        reduced
          ? { opacity: 1 }
          : variant === "side"
            ? { opacity: 1, x: 0, scale: 1, rotate: rotation }
            : { opacity: 1, y: 0, scale: 1, rotate: rotation * 0.6 }
      }
      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
      transition={{ duration: reduced ? 0.12 : 0.32, ease: EASE }}
      className={cn(
        "w-[190px] rounded-[0.45rem] border border-border/45 bg-surface p-2 pb-0 shadow-[0_12px_30px_rgba(28,23,19,0.14)]",
        variant === "side" ? "absolute left-full top-0 ml-7 hidden xl:block" : "mt-4 xl:hidden"
      )}
    >
      {item ? (
        <>
          <span className="relative block aspect-square w-full overflow-hidden rounded-[0.3rem] bg-background">
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="190px"
              quality={92}
              unoptimized
              className="object-cover object-center"
            />
          </span>
          <figcaption className="px-1 pb-2.5 pt-2 text-center font-body text-[0.72rem] leading-snug text-text-secondary">
            {reveal?.note}
          </figcaption>
        </>
      ) : null}
    </motion.figure>
  );

  return (
    <span id="bio-polaroid" className="block">
      <AnimatePresence initial={false} mode="wait">
        {item ? frame("side") : null}
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait">
        {item ? frame("inline") : null}
      </AnimatePresence>
    </span>
  );
}

/* ------------------------------ the bio ------------------------------ */

// One progressive paragraph set. Each interactive object has its own form:
// journey = staggered route + chapters; domains = quiet prose controls; the
// behavior board = black split-flap; terminal = typed command; "where" = a tiny
// path merge; intentional = marks snapping into order; overwhelming = a local
// burst; the personal words pull a polaroid out beside the text.
export function AboutBio() {
  const prefersReducedMotion = useReducedMotion();
  const reduced = Boolean(prefersReducedMotion);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [personal, setPersonal] = useState<PersonalId | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [soundOn, setSoundOn] = useState(true);

  // Ordinary phrase opens/closes are silent. Sound is reserved for the special
  // microinteractions (terminal, board, crossroads, intentional, overwhelming).
  const toggle = (id: string) => {
    setOpenIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Closing the journey collapses its nested chapter blanks too.
  const toggleJourney = () => {
    setOpenIds((previous) => {
      const next = new Set(previous);
      if (next.has("journey")) {
        next.delete("journey");
        aboutJourney.chapters.forEach((chapter) => next.delete(chapter.id));
      } else {
        next.add("journey");
      }
      return next;
    });
  };

  const handlePersonal = (id: PersonalId) => {
    if (personal !== id) {
      setPersonal(id);
      setPhotoIndex(0);
      return;
    }
    const images = aboutPersonalReveals[id].images;
    const next = photoIndex + 1;
    if (next >= images.length) {
      setPersonal(null);
      setPhotoIndex(0);
    } else {
      setPhotoIndex(next);
    }
  };

  const domain = (id: string, label: string, extra?: ReactNode) => (
    <span className="inline">
      <Phrase
        label={label}
        open={openIds.has(id)}
        onToggle={() => toggle(id)}
        controls={`bio-note-${id}`}
      />
      <Clause open={openIds.has(id)} reduced={reduced} id={`bio-note-${id}`}>
        {aboutDomainReveals[id]}
        {extra}
      </Clause>
    </span>
  );

  const personalWord = (id: PersonalId, label: string) => (
    <Phrase
      label={label}
      open={personal === id}
      onToggle={() => handlePersonal(id)}
      controls="bio-polaroid"
    />
  );

  return (
    <div className="max-w-[54ch] space-y-4 font-body text-[1.06rem] leading-[1.78] text-text-secondary md:text-[1.15rem]">
      <p>
        Hi, I&rsquo;m Arindam. My{" "}
        <JourneyReveal
          open={openIds.has("journey")}
          onToggle={toggleJourney}
          openChapters={openIds}
          onToggleChapter={toggle}
          reduced={reduced}
        />{" "}
        is what pulled me from building systems to asking what they do to people.
      </p>

      <p>
        I design and build human-centered systems across{" "}
        {domain(
          "xr",
          "XR and spatial computing",
          <>
            {" "}
            Project Aura details: <Redaction reduced={reduced} />
          </>
        )}
        , {domain("human-ai", "human-AI interaction")}, {domain("data-driven", "data-driven tools")},
        and {domain("accessibility", "accessibility")}.
      </p>

      <p>
        I&rsquo;m drawn to work <CrossroadsWord reduced={reduced} /> research becomes a prototype, a
        prototype becomes a system <TerminalObject reduced={reduced} />, and the system still has to
        make sense to people.
      </p>

      <p>
        I&rsquo;m especially interested in how advanced technology <BehaviorBoard reduced={reduced} />
        , and how design can make those interactions feel <IntentionalWord reduced={reduced} />{" "}
        instead of <OverwhelmingWord reduced={reduced} />.
      </p>

      <div className="relative">
        <p>
          Outside the screen, I spend time {personalWord("photographing", "photographing")},{" "}
          {personalWord("hiking", "hiking")}, and reconnecting with {personalWord("nature", "nature")}
          . Photography makes me a better designer because it trains the same habit I need in
          research: notice first, decide later.
        </p>
        <SidePolaroid personal={personal} photoIndex={photoIndex} reduced={reduced} />
      </div>

      <p className="!mt-6 text-caption text-text-muted">
        <button
          type="button"
          aria-pressed={soundOn}
          onClick={() =>
            setSoundOn((value) => {
              setSoundMuted(value);
              return !value;
            })
          }
          className="underline decoration-dotted underline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45"
        >
          sound: {soundOn ? "on" : "off"}
        </button>
      </p>
    </div>
  );
}
