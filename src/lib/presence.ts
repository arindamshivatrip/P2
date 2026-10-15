import "server-only";
import { Redis } from "@upstash/redis";

// The visit count starts at 300. Only the total gets the offset; the
// online-now number is always the real one.
export const TOTAL_VISITS_OFFSET = 300;

// A visitor counts as online if their tab has pinged within this window.
// The client heartbeats every 30s, so this tolerates one missed ping.
const ONLINE_WINDOW_MS = 75_000;

const ONLINE_KEY = "presence:online";
const SEEN_KEY = "presence:seen";
const TOTAL_KEY = "presence:total";

// `total` only comes back on a visit's first ping; heartbeats skip it to save
// Redis commands (3 per heartbeat instead of 5).
export type PresenceCounts = { online: number; total?: number };

let redis: Redis | null | undefined;

// The counter can live in its own Upstash database so a traffic spike here can
// never use up the commands Ask Ari's rate limiter depends on. Falls back to
// the shared database when the PRESENCE_* pair isn't set.
function getRedis(): Redis | null {
  if (redis !== undefined) return redis;
  const url = process.env.PRESENCE_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.PRESENCE_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  redis = url && token ? new Redis({ url, token }) : null;
  return redis;
}

// Local dev without Upstash keeps counts in memory so the footer can still be
// seen working. Production without Upstash reports nothing and the counter hides.
const memory = { online: new Map<string, number>(), seen: new Set<string>() };

function pingMemory(visitorId: string, now: number, firstPing: boolean): PresenceCounts {
  memory.online.set(visitorId, now);
  for (const [id, at] of memory.online) {
    if (at < now - ONLINE_WINDOW_MS) memory.online.delete(id);
  }
  if (!firstPing) return { online: memory.online.size };
  memory.seen.add(visitorId);
  return { online: memory.online.size, total: memory.seen.size + TOTAL_VISITS_OFFSET };
}

export async function pingPresence(
  visitorId: string,
  firstPing: boolean
): Promise<PresenceCounts | null> {
  const now = Date.now();
  const client = getRedis();

  if (!client) {
    return process.env.NODE_ENV === "production" ? null : pingMemory(visitorId, now, firstPing);
  }

  const [, , online] = await client
    .pipeline()
    .zadd(ONLINE_KEY, { score: now, member: visitorId })
    .zremrangebyscore(ONLINE_KEY, 0, now - ONLINE_WINDOW_MS)
    .zcard(ONLINE_KEY)
    .exec<[number, number, number]>();

  if (!firstPing) return { online };

  const added = await client.sadd(SEEN_KEY, visitorId);
  const total = added ? await client.incr(TOTAL_KEY) : ((await client.get<number>(TOTAL_KEY)) ?? 0);

  return { online, total: total + TOTAL_VISITS_OFFSET };
}
