import "server-only";
import { Redis } from "@upstash/redis";
import { pinnedNotes, type MessageNote } from "@/data/messages";

const NOTES_KEY = "messages:notes";
const HIDDEN_KEY = "messages:hidden";
// Drawings live apart from the note list (id -> data URL) so the page only
// carries a link to each one, not the image itself.
const IMAGES_KEY = "messages:images";
// Oldest notes fall off the wall past this; keeps reads small and bounded.
const MAX_NOTES = 200;

let redis: Redis | null | undefined;

export function getMessagesRedis(): Redis | null {
  if (redis !== undefined) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  redis = url && token ? new Redis({ url, token }) : null;
  return redis;
}

const isProduction = process.env.NODE_ENV === "production";

// Local dev without Upstash keeps notes in memory so the wall can be tried out.
// It hangs off globalThis because each route gets its own copy of this module.
type MemoryStore = { notes: MessageNote[]; hidden: Set<string>; images: Map<string, string> };
const globalStore = globalThis as typeof globalThis & { __messagesMemory?: MemoryStore };
const memory = (globalStore.__messagesMemory ??= {
  notes: [],
  hidden: new Set(),
  images: new Map()
});

export function noteImageUrl(id: string): string {
  return `/api/messages/image/${id}`;
}

/** Pinned notes first, then visitor notes newest first. */
export async function listNotes(): Promise<MessageNote[]> {
  const client = getMessagesRedis();
  let stored: MessageNote[] = [];

  if (client) {
    try {
      const [notes, hidden] = await Promise.all([
        client.lrange<MessageNote>(NOTES_KEY, 0, MAX_NOTES - 1),
        client.smembers(HIDDEN_KEY)
      ]);
      const hiddenIds = new Set(hidden);
      stored = notes.filter((note) => !hiddenIds.has(note.id));
    } catch (error) {
      // The wall still renders Ari's notes if Redis is down.
      console.error("[messages] failed to read notes", error);
    }
  } else if (!isProduction) {
    stored = memory.notes.filter((note) => !memory.hidden.has(note.id));
  }

  return [...pinnedNotes, ...stored];
}

/**
 * Saves a note, and its drawing under its own key. The note should already
 * point at `noteImageUrl(id)` when it has a drawing.
 */
export async function addNote(note: MessageNote, image?: string): Promise<void> {
  const client = getMessagesRedis();
  if (client) {
    const tx = client.multi();
    if (image) tx.hset(IMAGES_KEY, { [note.id]: image });
    tx.lpush(NOTES_KEY, note);
    tx.lrange<MessageNote>(NOTES_KEY, MAX_NOTES, -1);
    tx.ltrim(NOTES_KEY, 0, MAX_NOTES - 1);
    const results = await tx.exec();

    // Drop the drawings of notes that just fell off the end of the wall.
    const dropped = (results[image ? 2 : 1] as MessageNote[]).filter((item) => item.image);
    if (dropped.length > 0) {
      await client.hdel(IMAGES_KEY, ...dropped.map((item) => item.id));
    }
    return;
  }
  if (isProduction) throw new Error("Messages storage is not configured.");
  memory.notes = [note, ...memory.notes];
  memory.notes.slice(MAX_NOTES).forEach((item) => memory.images.delete(item.id));
  memory.notes = memory.notes.slice(0, MAX_NOTES);
  if (image) memory.images.set(note.id, image);
}

/** The drawing's data URL, or null if there is none or the note is hidden. */
export async function getNoteImage(id: string): Promise<string | null> {
  const client = getMessagesRedis();
  if (client) {
    const [image, hidden] = await Promise.all([
      client.hget<string>(IMAGES_KEY, id),
      client.sismember(HIDDEN_KEY, id)
    ]);
    return hidden ? null : (image ?? null);
  }
  if (isProduction) return null;
  return memory.hidden.has(id) ? null : (memory.images.get(id) ?? null);
}

/** Hides a note by id (an admin action; the entry ages out of the list later). */
export async function hideNote(id: string): Promise<void> {
  const client = getMessagesRedis();
  if (client) {
    await client.multi().sadd(HIDDEN_KEY, id).hdel(IMAGES_KEY, id).exec();
    return;
  }
  memory.hidden.add(id);
  memory.images.delete(id);
}
