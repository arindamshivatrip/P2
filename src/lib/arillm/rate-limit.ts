import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const CONTACT_EMAIL = "aritrip@umd.edu";
const PER_IP_PER_HOUR = 15;
const GLOBAL_PER_DAY = 300;

export type RateLimitResult = { ok: true } | { ok: false; message: string };

type Limiters = { perIp: Ratelimit; global: Ratelimit };

// Built lazily so a missing config (local dev) costs nothing, and once per
// server instance so the Redis client is reused across requests.
let limiters: Limiters | null | undefined;

function getLimiters(): Limiters | null {
  if (limiters !== undefined) return limiters;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    limiters = null;
    return limiters;
  }

  const redis = new Redis({ url, token });
  limiters = {
    perIp: new Ratelimit({
      redis,
      prefix: "arillm:ip",
      limiter: Ratelimit.slidingWindow(PER_IP_PER_HOUR, "1 h")
    }),
    // Fixed daily window (resets at 00:00 UTC): a hard ceiling on spend.
    global: new Ratelimit({
      redis,
      prefix: "arillm:global",
      limiter: Ratelimit.fixedWindow(GLOBAL_PER_DAY, "1 d")
    })
  };
  return limiters;
}

export function getClientIp(req: Request): string {
  // Vercel puts the real client first in x-forwarded-for.
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip") || "unknown";
}

/**
 * Checks the per-IP and global limits. Skipped when Upstash isn't configured.
 * Fails closed if Redis errors (outage, or the monthly command quota running
 * out): without these limits there is no cap on model spend, so the chat
 * pauses rather than running unmetered.
 */
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const active = getLimiters();
  if (!active) return { ok: true };

  try {
    // Per-IP first, so one noisy visitor can't burn through the global budget.
    const perIp = await active.perIp.limit(ip);
    if (!perIp.success) {
      return {
        ok: false,
        message: `I've talked a lot this hour. Give me a bit, or email me at ${CONTACT_EMAIL}.`
      };
    }

    const global = await active.global.limit("all");
    if (!global.success) {
      return {
        ok: false,
        message: `I've talked a lot today. Email me at ${CONTACT_EMAIL} and the real me will get back to you.`
      };
    }
  } catch (error) {
    console.error("[arillm] rate limit check failed", error);
    return {
      ok: false,
      message: `I'm taking a short break. Email me at ${CONTACT_EMAIL} and the real me will get back to you.`
    };
  }

  return { ok: true };
}
