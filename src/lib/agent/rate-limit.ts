import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Per-IP cap on /mcp so a looping agent can't hammer the site. Unlike Ask Ari
// there is no model spend behind these tools, so this fails open: a missing
// config or a Redis outage lets requests through rather than taking MCP down.
const PER_IP_PER_HOUR = 120;

let limiter: Ratelimit | null | undefined;

function getLimiter(): Ratelimit | null {
  if (limiter !== undefined) return limiter;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  limiter =
    url && token
      ? new Ratelimit({
          redis: new Redis({ url, token }),
          prefix: "mcp:ip",
          limiter: Ratelimit.slidingWindow(PER_IP_PER_HOUR, "1 h")
        })
      : null;
  return limiter;
}

/** True when this IP may make another MCP request. */
export async function allowMcpRequest(ip: string): Promise<boolean> {
  const active = getLimiter();
  if (!active) return true;
  try {
    return (await active.limit(ip)).success;
  } catch (error) {
    console.error("[mcp] rate limit check failed", error);
    return true;
  }
}
