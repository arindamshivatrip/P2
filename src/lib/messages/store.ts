import "server-only";
import { Redis } from "@upstash/redis";
import { pinnedNotes, type MessageNote } from "@/data/messages";

const NOTES_KEY = "messages:notes";
const HIDDEN_KEY = "messages:hidden";
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
const memory: { notes: MessageNote[]; hidden: Set<string> } = { notes: [], hidden: new Set() };

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

export async function addNote(note: MessageNote): Promise<void> {
  const client = getMessagesRedis();
  if (client) {
    await client.pipeline().lpush(NOTES_KEY, note).ltrim(NOTES_KEY, 0, MAX_NOTES - 1).exec();
    return;
  }
  if (isProduction) throw new Error("Messages storage is not configured.");
  memory.notes = [note, ...memory.notes].slice(0, MAX_NOTES);
}

/** Hides a note by id (an admin action; the entry ages out of the list later). */
export async function hideNote(id: string): Promise<void> {
  const client = getMessagesRedis();
  if (client) {
    await client.sadd(HIDDEN_KEY, id);
    return;
  }
  memory.hidden.add(id);
}
