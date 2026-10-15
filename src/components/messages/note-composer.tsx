"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  messageLimits,
  stickyColors,
  type MessageNote,
  type StickyColor
} from "@/data/messages";
import { lockBodyScroll } from "@/lib/scroll-lock";
import { cn } from "@/lib/utils";
import { DrawingPad, type DrawingPadHandle } from "./drawing-pad";
import styles from "./messages.module.css";

export type ComposerKind = MessageNote["kind"];

const inks = [
  { value: "#1f1f1f", label: "Ink" },
  { value: "#ff9932", label: "Orange" },
  { value: "#3d6fd8", label: "Blue" }
];
const brushes = [
  { value: 7, label: "Fine" },
  { value: 16, label: "Bold" }
];

type NoteComposerProps = {
  kind: ComposerKind;
  onClose: () => void;
  onPosted: (note: MessageNote) => void;
};

const fieldClass =
  "w-full border-0 border-b border-border bg-transparent px-0 py-2 font-body text-body-sm text-foreground placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-0";

function ToolButton({
  pressed,
  label,
  onClick,
  children
}: {
  pressed?: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 min-w-8 items-center justify-center rounded-full border px-2 font-body text-xs text-text-secondary transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        pressed ? "border-foreground/70 text-foreground" : "border-border"
      )}
    >
      {children}
    </button>
  );
}

export function NoteComposer({ kind, onClose, onPosted }: NoteComposerProps) {
  const reduced = useReducedMotion();
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [color, setColor] = useState<StickyColor>("butter");
  const [ink, setInk] = useState(inks[0].value);
  const [brush, setBrush] = useState(brushes[0].value);
  const [strokeCount, setStrokeCount] = useState(0);
  const [status, setStatus] = useState<"idle" | "posting">("idle");
  const [error, setError] = useState<string | null>(null);
  const padRef = useRef<DrawingPadHandle>(null);
  const firstFieldRef = useRef<HTMLTextAreaElement & HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const textLimit = kind === "sticky" ? messageLimits.stickyText : messageLimits.caption;
  const canPost =
    status === "idle" && (kind === "sticky" ? text.trim().length > 0 : strokeCount > 0);

  useEffect(() => lockBodyScroll(), []);

  // Focus the note on open (Close for a polaroid; the pad has no keyboard
  // input), keep Tab inside the dialog, and hand focus back on close.
  useEffect(() => {
    const returnFocusTo = document.activeElement as HTMLElement | null;
    (kind === "sticky" ? firstFieldRef.current : closeRef.current)?.focus();
    return () => returnFocusTo?.focus?.();
  }, [kind]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !formRef.current) return;
      const focusable = Array.from(
        formRef.current.querySelectorAll<HTMLElement>("button:not(:disabled), input, textarea")
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;
      if (event.shiftKey && (current === first || !formRef.current.contains(current))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (current === last || !formRef.current.contains(current))) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onStrokesChange = useCallback((count: number) => setStrokeCount(count), []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canPost) return;
    setError(null);

    const image = kind === "polaroid" ? padRef.current?.exportImage() : undefined;
    if (kind === "polaroid" && !image) {
      setError("Draw something first.");
      return;
    }

    setStatus("posting");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, text, name, color, image })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.note) {
        setError(data.error ?? "Something went wrong. Try again?");
        setStatus("idle");
        return;
      }
      onPosted(data.note as MessageNote);
    } catch {
      setError("You look offline. Try again in a sec?");
      setStatus("idle");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <motion.button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default bg-foreground/25 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.form
        ref={formRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="composer-title"
        onSubmit={submit}
        className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-card border border-border bg-background px-5 pb-6 pt-5 shadow-card sm:max-w-[26rem] sm:rounded-card sm:px-7 sm:pb-7"
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <div className="flex items-baseline justify-between">
          <h2 id="composer-title" className="font-display text-display-xs tracking-tight">
            {kind === "sticky" ? (
              "New sticky"
            ) : (
              <>
                New <span className="font-serif italic text-accent">polaroid</span>
              </>
            )}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="font-body text-label uppercase text-text-muted hover:text-foreground"
          >
            Close
          </button>
        </div>

        {kind === "sticky" ? (
          <>
            <div className={cn(styles.paper, styles[color], "mx-auto mt-6 aspect-square w-full max-w-[16rem] -rotate-1 p-5")}>
              <label htmlFor="note-text" className="sr-only">
                Your note
              </label>
              <textarea
                ref={firstFieldRef}
                id="note-text"
                value={text}
                maxLength={textLimit}
                onChange={(event) => setText(event.target.value)}
                placeholder="Say hi, or say what you really think of the work."
                className="h-full w-full resize-none border-0 bg-transparent p-0 font-body text-body-sm leading-snug text-[#1f1f1f] placeholder:text-[#1f1f1f]/45 focus:outline-none focus:ring-0"
              />
            </div>
            <div className="mx-auto mt-4 flex max-w-[16rem] items-center justify-between">
              <div className="flex gap-2" role="group" aria-label="Paper colour">
                {stickyColors.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-label={option}
                    aria-pressed={color === option}
                    onClick={() => setColor(option)}
                    className={cn(
                      styles[option],
                      "h-6 w-6 rounded-full border transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
                      color === option ? "scale-110 border-foreground/70" : "border-black/10"
                    )}
                  />
                ))}
              </div>
              <span className="font-body text-label-xs text-text-muted">
                {text.length}/{textLimit}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className={cn(styles.paper, styles.polaroid, "relative mx-auto mt-6 w-full max-w-[16rem] rotate-1 p-2.5 pb-3")}>
              <DrawingPad ref={padRef} color={ink} width={brush} onStrokesChange={onStrokesChange} />
              <label htmlFor="note-caption" className="sr-only">
                Caption
              </label>
              <input
                ref={firstFieldRef}
                id="note-caption"
                value={text}
                maxLength={textLimit}
                onChange={(event) => setText(event.target.value)}
                placeholder="write a caption"
                className="mt-2 w-full border-0 bg-transparent px-1 py-0 font-serif text-[1.1rem] italic text-[#1f1f1f] placeholder:text-[#1f1f1f]/40 focus:outline-none focus:ring-0"
              />
            </div>
            <div className="mx-auto mt-4 flex max-w-[16rem] flex-wrap items-center justify-between gap-y-2">
              <div className="flex gap-1.5" role="group" aria-label="Ink colour">
                {inks.map((option) => (
                  <ToolButton
                    key={option.value}
                    label={option.label}
                    pressed={ink === option.value}
                    onClick={() => setInk(option.value)}
                  >
                    <span className="h-3.5 w-3.5 rounded-full" style={{ background: option.value }} />
                  </ToolButton>
                ))}
                {brushes.map((option) => (
                  <ToolButton
                    key={option.value}
                    label={`${option.label} brush`}
                    pressed={brush === option.value}
                    onClick={() => setBrush(option.value)}
                  >
                    <span
                      className="rounded-full bg-foreground"
                      style={{ width: option.value / 2.4 + 2, height: option.value / 2.4 + 2 }}
                    />
                  </ToolButton>
                ))}
              </div>
              <div className="flex gap-1.5">
                <ToolButton label="Undo" onClick={() => padRef.current?.undo()}>
                  Undo
                </ToolButton>
                <ToolButton label="Clear drawing" onClick={() => padRef.current?.clear()}>
                  Clear
                </ToolButton>
              </div>
            </div>
          </>
        )}

        <label htmlFor="note-name" className="sr-only">
          Your name (optional)
        </label>
        <input
          id="note-name"
          value={name}
          maxLength={messageLimits.name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name (optional)"
          autoComplete="nickname"
          className={cn(fieldClass, "mt-6")}
        />

        <p role="alert" className="mt-3 min-h-[1.25rem] font-body text-caption text-foreground">
          {error ? (
            <>
              <span aria-hidden="true" className="mr-1.5 inline-block h-1.5 w-1.5 -translate-y-px rounded-full bg-accent" />
              {error}
            </>
          ) : null}
        </p>

        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="font-body text-label-xs uppercase text-text-muted">Checked by AI before it goes up</p>
          <Button type="submit" disabled={!canPost} className="px-4 py-2 disabled:pointer-events-none disabled:opacity-45">
            {status === "posting" ? "Checking…" : "Pin it up"}
          </Button>
        </div>
      </motion.form>
    </div>
  );
}
