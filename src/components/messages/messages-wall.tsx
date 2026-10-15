"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useState } from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/typography/eyebrow";
import type { MessageNote } from "@/data/messages";
import { cn } from "@/lib/utils";
import styles from "./messages.module.css";
import { NoteCard } from "./note-card";
import { NoteComposer, type ComposerKind } from "./note-composer";

function StickyIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2.5 2.5h11v7l-4 4h-7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M13.5 9.5h-4v4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function PolaroidIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2.5" y="1.5" width="11" height="13" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="4.5" y="3.5" width="7" height="7" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function MessagesWall({ initialNotes }: { initialNotes: MessageNote[] }) {
  const reduced = useReducedMotion();
  const [notes, setNotes] = useState(initialNotes);
  const [composer, setComposer] = useState<ComposerKind | null>(null);
  const [justPosted, setJustPosted] = useState<string | null>(null);

  const close = useCallback(() => setComposer(null), []);

  const onPosted = (note: MessageNote) => {
    // Pinned notes stay on top; a fresh note lands right after them.
    setNotes((current) => {
      const pinned = current.filter((item) => item.pinned);
      const rest = current.filter((item) => !item.pinned);
      return [...pinned, note, ...rest];
    });
    setJustPosted(note.id);
    setComposer(null);
  };

  const visitorCount = notes.filter((note) => !note.pinned).length;

  return (
    <Section spacing="compact" className="pt-4 md:pt-6">
      <Container>
        <div className={cn(styles.board, "relative rounded-card border border-border/70")}>
          <div className="flex items-baseline justify-between px-5 pt-5 md:px-10 md:pt-8">
            <Eyebrow>The wall</Eyebrow>
            <p aria-live="polite" className="font-body text-label uppercase text-text-muted">
              {visitorCount === 0 ? "Be the first" : `${visitorCount} ${visitorCount === 1 ? "note" : "notes"}`}
            </p>
          </div>

          <ul className="grid grid-cols-2 gap-x-5 gap-y-12 px-5 pb-16 pt-8 sm:grid-cols-3 md:px-10 md:pt-10 lg:grid-cols-4 lg:gap-x-8 2xl:grid-cols-5">
            <AnimatePresence initial={false}>
              {notes.map((note) => (
                <motion.li
                  key={note.id}
                  layout={!reduced}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: -18, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
                  className={cn("list-none", justPosted === note.id && "z-[1]")}
                >
                  <NoteCard note={note} />
                </motion.li>
              ))}
            </AnimatePresence>
            <li className="list-none">
              <button
                type="button"
                onClick={() => setComposer("sticky")}
                className="flex aspect-square w-full rotate-1 flex-col items-center justify-center gap-2 border border-dashed border-text-muted/50 font-body text-sm text-text-muted transition-colors hover:border-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                <span aria-hidden="true" className="text-2xl leading-none">+</span>
                Add yours
              </button>
            </li>
          </ul>

          {/* Floating tool bar, FigJam style: sticks to the bottom of the view while the wall is on screen. */}
          <div className="sticky bottom-5 z-10 flex justify-center pb-5 md:bottom-6 md:pb-8">
            <div
              role="toolbar"
              aria-label="Add to the wall"
              className="flex items-center gap-1 rounded-full bg-foreground p-1.5 text-background shadow-card"
            >
              <button
                type="button"
                onClick={() => setComposer("sticky")}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-body text-sm transition-colors hover:bg-background/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <StickyIcon />
                Sticky
              </button>
              <span aria-hidden="true" className="h-5 w-px bg-background/20" />
              <button
                type="button"
                onClick={() => setComposer("polaroid")}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-body text-sm transition-colors hover:bg-background/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <PolaroidIcon />
                Polaroid
              </button>
            </div>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {composer ? <NoteComposer key={composer} kind={composer} onClose={close} onPosted={onPosted} /> : null}
      </AnimatePresence>
    </Section>
  );
}
