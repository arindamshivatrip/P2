import { Ratelimit } from "@upstash/ratelimit";
import { revalidatePath } from "next/cache";
import { messageLimits, stickyColors, type MessageNote, type StickyColor } from "@/data/messages";
import { getClientIp } from "@/lib/arillm/rate-limit";
import { aiCheck, quickCheck } from "@/lib/messages/moderation";
import { addNote, getMessagesRedis, hideNote, noteImageUrl } from "@/lib/messages/store";

export const runtime = "nodejs";
export const maxDuration = 20;

const PER_IP_PER_HOUR = 3;
const GLOBAL_PER_DAY = 100;

type Limiters = { perIp: Ratelimit; global: Ratelimit };
let limiters: Limiters | null | undefined;

function getLimiters(): Limiters | null {
  if (limiters !== undefined) return limiters;
  const redis = getMessagesRedis();
  limiters = redis
    ? {
        perIp: new Ratelimit({
          redis,
          prefix: "messages:ip",
          limiter: Ratelimit.slidingWindow(PER_IP_PER_HOUR, "1 h")
        }),
        global: new Ratelimit({
          redis,
          prefix: "messages:global",
          limiter: Ratelimit.fixedWindow(GLOBAL_PER_DAY, "1 d")
        })
      }
    : null;
  return limiters;
}

function reject(status: number, error: string) {
  return Response.json({ error }, { status });
}

// Fails closed in production: without the limits, posting stays off.
async function checkLimits(ip: string): Promise<string | null> {
  const active = getLimiters();
  if (!active) {
    return process.env.NODE_ENV === "production" ? "The wall is closed for a bit. Try later?" : null;
  }
  try {
    if (!(await active.perIp.limit(ip)).success) {
      return "That's a few notes this hour already. Come back in a bit?";
    }
    if (!(await active.global.limit("all")).success) {
      return "The wall is full for today. Come back tomorrow?";
    }
    return null;
  } catch (error) {
    console.error("[messages] rate limit check failed", error);
    return "The wall is closed for a bit. Try later?";
  }
}

type PostBody = {
  kind?: unknown;
  text?: unknown;
  name?: unknown;
  color?: unknown;
  image?: unknown;
};

// Stickies keep their line breaks, up to this many, so nobody can stretch a
// card with a column of blank lines.
const MAX_LINE_BREAKS = 6;

function clean(value: unknown, max: number, { multiline = false } = {}): string | null {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") return null;
  let trimmed: string;
  if (multiline) {
    const lines = value
      .replace(/\r\n?/g, "\n")
      .split("\n")
      .map((line) => line.replace(/\s+/g, " ").trim())
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
      .split("\n");
    trimmed =
      lines.length > MAX_LINE_BREAKS + 1
        ? [...lines.slice(0, MAX_LINE_BREAKS), lines.slice(MAX_LINE_BREAKS).join(" ").replace(/ {2,}/g, " ").trim()].join("\n")
        : lines.join("\n");
  } else {
    trimmed = value.replace(/\s+/g, " ").trim();
  }
  return trimmed.length > max ? null : trimmed;
}

export async function POST(req: Request) {
  let body: PostBody;
  try {
    body = await req.json();
  } catch {
    return reject(400, "Invalid request.");
  }

  const kind = body.kind === "polaroid" ? "polaroid" : body.kind === "sticky" ? "sticky" : null;
  if (!kind) return reject(400, "Invalid note.");

  const text =
    kind === "sticky"
      ? clean(body.text, messageLimits.stickyText, { multiline: true })
      : clean(body.text, messageLimits.caption);
  const name = clean(body.name, messageLimits.name);
  if (text === null || name === null) return reject(400, "That's a bit long.");
  if (kind === "sticky" && !text) return reject(400, "Write something first.");

  const color: StickyColor = stickyColors.includes(body.color as StickyColor)
    ? (body.color as StickyColor)
    : "butter";

  let image: string | undefined;
  if (kind === "polaroid") {
    if (
      typeof body.image !== "string" ||
      body.image.length > messageLimits.imageChars ||
      !/^data:image\/(png|webp);base64,/.test(body.image)
    ) {
      return reject(400, "Draw something first.");
    }
    image = body.image;
  }

  const quick = quickCheck([text, name]);
  if (!quick.ok) return reject(422, quick.reason);

  const limited = await checkLimits(getClientIp(req));
  if (limited) return reject(429, limited);

  const moderation = await aiCheck([text, name && `Signed: ${name}`].filter(Boolean).join("\n"), image);
  if (!moderation.ok) return reject(422, moderation.reason);

  const id = crypto.randomUUID();
  const note: MessageNote = {
    id,
    kind,
    text,
    name: name || "anonymous",
    color,
    image: image ? noteImageUrl(id) : undefined,
    createdAt: Date.now()
  };

  try {
    await addNote(note, image);
  } catch (error) {
    console.error("[messages] failed to save note", error);
    return reject(503, "Couldn't pin that up just now. Try again in a minute.");
  }

  revalidatePath("/messages");
  return Response.json({ note });
}

// Admin removal: DELETE with `Authorization: Bearer <MESSAGES_ADMIN_TOKEN>` and
// a JSON body of { "id": "<note id>" }. Without the env var this route is off.
export async function DELETE(req: Request) {
  const token = process.env.MESSAGES_ADMIN_TOKEN;
  if (!token || req.headers.get("authorization") !== `Bearer ${token}`) {
    return reject(404, "Not found.");
  }

  let id: unknown;
  try {
    ({ id } = await req.json());
  } catch {
    return reject(400, "Invalid request.");
  }
  if (typeof id !== "string" || !id) return reject(400, "Missing id.");

  await hideNote(id);
  revalidatePath("/messages");
  return Response.json({ hidden: id });
}
