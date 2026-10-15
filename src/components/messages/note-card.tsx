import type { CSSProperties } from "react";
import type { MessageNote } from "@/data/messages";
import { cn } from "@/lib/utils";
import styles from "./messages.module.css";

function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Multiplayer-cursor colours for name tags. Ari always gets the site accent.
const cursorColors = [
  { bg: "#3d6fd8", fg: "#ffffff" },
  { bg: "#2f8f66", fg: "#ffffff" },
  { bg: "#c2549a", fg: "#ffffff" },
  { bg: "#7a5af8", fg: "#ffffff" },
  { bg: "#1f1f1f", fg: "#f5f4ed" }
];
const ariCursor = { bg: "#ff9932", fg: "#1f1f1f" };

function NameTag({ name, pinned, seed }: { name: string; pinned?: boolean; seed: number }) {
  const color = pinned ? ariCursor : cursorColors[seed % cursorColors.length];
  return (
    <span className="pointer-events-none absolute -bottom-3 right-3 flex items-start">
      <svg aria-hidden="true" width="14" height="16" viewBox="0 0 14 16" className="-mr-0.5 -mt-1.5">
        <path d="M1 1l11 6.2-5 1.3-2.6 4.6L1 1z" fill={color.bg} stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      <span
        className="mt-1 max-w-[9rem] truncate rounded-[5px] px-1.5 py-[3px] font-body text-[0.68rem] leading-none"
        style={{ background: color.bg, color: color.fg }}
      >
        {name}
      </span>
    </span>
  );
}

export function NoteCard({ note }: { note: MessageNote }) {
  const seed = hash(note.id);
  // Scattered, not gridded: each note gets its own small tilt and drop.
  const tilt = ((seed % 51) - 25) / 10;
  const drop = (seed >> 6) % 14;
  const style = { transform: `translateY(${drop}px) rotate(${tilt}deg)` } as CSSProperties;

  if (note.kind === "polaroid") {
    return (
      <figure className={cn(styles.note, styles.paper, styles.polaroid, "relative p-2 pb-3 sm:p-2.5 sm:pb-4")} style={style}>
        <span aria-hidden="true" className={styles.tape} />
        {/* eslint-disable-next-line @next/next/no-img-element -- data URLs, already tiny */}
        <img
          src={note.image}
          alt={note.text ? `Drawing: ${note.text}` : `Drawing by ${note.name}`}
          className="aspect-square w-full bg-white object-cover"
          loading="lazy"
          decoding="async"
        />
        {note.text ? (
          <figcaption className="mt-2 px-1 font-serif text-[1rem] italic leading-tight sm:text-[1.1rem]">
            {note.text}
          </figcaption>
        ) : null}
        <NameTag name={note.name} pinned={note.pinned} seed={seed} />
      </figure>
    );
  }

  return (
    <div
      className={cn(
        styles.note,
        styles.paper,
        styles[note.color],
        "relative flex aspect-square flex-col p-3.5 sm:p-5"
      )}
      style={style}
    >
      <p className="whitespace-pre-line break-words font-body text-[0.8rem] leading-snug sm:text-body-sm">
        {note.text}
      </p>
      <NameTag name={note.name} pinned={note.pinned} seed={seed} />
    </div>
  );
}
