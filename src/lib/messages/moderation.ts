import "server-only";
import { generateText } from "ai";
import { getModel } from "@/lib/arillm/model";

export type ModerationResult = { ok: true } | { ok: false; reason: string };

const REJECTED = "That one can't go on the wall. Try something else?";
const UNAVAILABLE = "Couldn't check that just now. Give it another go in a minute.";

// Fast first pass so obvious cases never cost a model call. Whole-word match
// after undoing common character swaps; the model catches everything subtler.
const BLOCKED_WORDS = [
  "fuck", "fucking", "fucker", "motherfucker", "shit", "bullshit", "cunt", "cock",
  "dick", "dickhead", "pussy", "bitch", "slut", "whore", "porn", "nudes",
  "penis", "vagina", "boobs", "tits", "rape", "rapist", "nazi", "kys",
  "faggot", "fag", "retard", "nigger", "nigga", "chink", "spic", "kike", "tranny"
];
const blocked = new Set(BLOCKED_WORDS);

const swaps: Record<string, string> = {
  "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", $: "s", "!": "i"
};

function words(text: string): string[] {
  const normalized = text
    .toLowerCase()
    .replace(/[013457@$!]/g, (char) => swaps[char] ?? char)
    .replace(/(.)\1{2,}/g, "$1$1");
  return normalized.split(/[^a-z]+/).filter(Boolean);
}

// Whole words only: substring matching flags innocent words ("therapist").
function hasBlockedWord(text: string): boolean {
  return words(text).some((word) => blocked.has(word));
}

const LINK = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|xyz|ru|ly|co)\b)/i;
const PHONE_LIKE = /\+?\d[\d\s().-]{8,}\d/g;

// The pattern alone also catches year ranges ("2024 - 2025"), so a match only
// counts as a phone number when it holds at least 10 digits.
function hasPhoneNumber(text: string): boolean {
  return (text.match(PHONE_LIKE) ?? []).some((match) => match.replace(/\D/g, "").length >= 10);
}

export function quickCheck(fields: string[]): ModerationResult {
  const all = fields.join(" \n ");
  if (hasBlockedWord(all)) return { ok: false, reason: REJECTED };
  if (LINK.test(all)) return { ok: false, reason: "Links can't go on the wall, sorry." };
  if (hasPhoneNumber(all)) return { ok: false, reason: "Leave phone numbers off the wall, please." };
  return { ok: true };
}

const INSTRUCTIONS = `You moderate a public guestbook wall on a student's personal portfolio site.
Visitors post short notes, sometimes with a small hand-drawn doodle.
Reply with exactly one word: ALLOW or BLOCK.
BLOCK if the text or the drawing contains any of: sexual content, nudity or genitals (including crude drawings of them), slurs, hate or harassment aimed at anyone, threats or violence, encouragement of self-harm, drugs promotion, spam or advertising, or personal contact details.
ALLOW everything else, including casual language, mild jokes, criticism of the work, emoji, and silly or messy drawings.`;

function dataUrlParts(dataUrl: string): { mediaType: string; base64: string } | null {
  const match = /^data:(image\/(?:png|webp|jpeg));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  return match ? { mediaType: match[1], base64: match[2] } : null;
}

/**
 * Model check on the text and drawing together. Fails closed: if the model
 * can't answer, the note doesn't go up.
 */
export async function aiCheck(text: string, image?: string): Promise<ModerationResult> {
  const hasKey = Boolean(process.env.ANTHROPIC_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  if (!hasKey) {
    if (process.env.NODE_ENV !== "production") return { ok: true };
    console.error("[messages] no AI key set; posting blocked");
    return { ok: false, reason: UNAVAILABLE };
  }

  const imagePart = image ? dataUrlParts(image) : null;
  if (image && !imagePart) return { ok: false, reason: REJECTED };

  try {
    const result = await generateText({
      model: getModel(),
      system: INSTRUCTIONS,
      // Room for Gemini's minimal thinking (it counts toward the cap) on the
      // fallback; the answer itself is one word.
      maxOutputTokens: 256,
      providerOptions: { google: { thinkingConfig: { thinkingLevel: "minimal" } } },
      timeout: 10_000,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: `Note text: """${text || "(none)"}"""` },
            ...(imagePart
              ? [{ type: "image" as const, image: imagePart.base64, mediaType: imagePart.mediaType }]
              : [])
          ]
        }
      ]
    });

    return /^\s*ALLOW\b/i.test(result.text) ? { ok: true } : { ok: false, reason: REJECTED };
  } catch (error) {
    console.error("[messages] moderation call failed", error);
    return { ok: false, reason: UNAVAILABLE };
  }
}
