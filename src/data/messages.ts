// Messages wall: shared types, limits, paper colours and Ari's pinned notes.
// Pinned notes live here (not in Redis) so they can be edited in code.

export const stickyColors = ["butter", "peach", "sage", "sky", "lilac"] as const;
export type StickyColor = (typeof stickyColors)[number];

export type MessageNote = {
  id: string;
  kind: "sticky" | "polaroid";
  /** Sticky body, or the polaroid caption. */
  text: string;
  name: string;
  color: StickyColor;
  /** Polaroid drawing as a data URL (webp/png, or svg for pinned notes). */
  image?: string;
  createdAt: number;
  pinned?: boolean;
};

export const messageLimits = {
  stickyText: 140,
  caption: 60,
  name: 30,
  // ~60KB of image once base64-encoded; a 320px webp doodle is usually 10–25KB.
  imageChars: 80_000
};

export const messagesContent = {
  eyebrow: "Messages",
  heading: "Leave a note, or draw one.",
  accentWord: "draw",
  supporting:
    "A shared wall for anyone passing through. Say hi, leave feedback on the work, or doodle something. Notes go up after a quick automatic check."
};

// A loose hand-drawn wave, so the pinned polaroid looks like it came from the
// same pad visitors use.
const waveDoodle = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320"><rect width="320" height="320" fill="#ffffff"/><g fill="none" stroke="#1f1f1f" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><circle cx="158" cy="104" r="38"/><path d="M144 98c0 4 0 6 1 8M172 98c0 4 0 6-1 8"/><path d="M142 120c9 9 24 9 32 0"/><path d="M158 142c-1 40 0 70 2 96"/><path d="M160 238c-14 18-24 32-34 50M160 238c12 18 22 32 32 50"/><path d="M158 170c-22 8-40 16-62 30"/><path d="M158 168c20-8 38-26 50-52"/></g><g fill="none" stroke="#ff9932" stroke-width="6" stroke-linecap="round"><path d="M222 96c8-6 14-14 16-24M232 118c11-2 20-8 26-17M212 78c3-9 3-18 0-26"/></g></svg>`
)}`;

export const pinnedNotes: MessageNote[] = [
  {
    id: "pinned-hello",
    kind: "sticky",
    text: "hi! you found the wall. leave a note, a doodle, or a hot take about my work :)",
    name: "Ari",
    color: "butter",
    createdAt: Date.UTC(2026, 9, 15),
    pinned: true
  },
  {
    id: "pinned-wave",
    kind: "polaroid",
    text: "me, waving. art is not my day job.",
    name: "Ari",
    color: "peach",
    image: waveDoodle,
    createdAt: Date.UTC(2026, 9, 15),
    pinned: true
  },
  {
    id: "pinned-aura",
    kind: "sticky",
    text: "currently heads-down on Aura Desk. if you've tried smart glasses, tell me what bugged you.",
    name: "Ari",
    color: "sage",
    createdAt: Date.UTC(2026, 9, 15),
    pinned: true
  }
];
