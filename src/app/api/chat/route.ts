import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage
} from "ai";
import { getModel, hasFallback } from "@/lib/arillm/model";
import { buildInstructions, type PageContext } from "@/lib/arillm/prompt";
import { checkRateLimit, getClientIp } from "@/lib/arillm/rate-limit";

// fs reads content/*.md, so this has to run on Node, not the edge runtime.
export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_USER_MESSAGE_CHARS = 1000;
const MAX_HISTORY_MESSAGES = 12;

type ChatRequestBody = {
  messages?: UIMessage[];
  pageContext?: PageContext;
};

function messageText(message: UIMessage): string {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("");
}

function jsonError(status: number, error: string, extra?: Record<string, unknown>) {
  return Response.json({ error, ...extra }, { status });
}

export async function POST(req: Request) {
  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "Invalid request.");
  }

  // Only user/assistant turns come from the client; a visitor can't smuggle in
  // their own system messages.
  const messages = (Array.isArray(body.messages) ? body.messages : []).filter(
    (message) => message.role === "user" || message.role === "assistant"
  );
  const latest = messages.at(-1);
  if (!latest || latest.role !== "user") {
    return jsonError(400, "Invalid request.");
  }

  if (messageText(latest).length > MAX_USER_MESSAGE_CHARS) {
    return jsonError(
      413,
      `That's a long one. Can you keep it under ${MAX_USER_MESSAGE_CHARS} characters?`
    );
  }

  // Checked after validation, so malformed requests don't spend anyone's quota.
  const limit = await checkRateLimit(getClientIp(req));
  if (!limit.ok) {
    // `limited` tells the UI a retry won't help, so it hides "Try again".
    return jsonError(429, limit.message, { limited: true });
  }

  try {
    const result = streamText({
      model: getModel(),
      // With a fallback configured, a failed primary call goes straight to the
      // fallback once; SDK retries on top would multiply both.
      maxRetries: hasFallback() ? 0 : 2,
      instructions: buildInstructions(body.pageContext),
      messages: await convertToModelMessages(messages.slice(-MAX_HISTORY_MESSAGES)),
      temperature: 0.6,
      maxOutputTokens: 400,
      providerOptions: {
        // Haiku 5.5 thinks by default, which spends the 400-token budget
        // before the reply and cut answers off mid-sentence. Short persona
        // chat doesn't need it. (Haiku ignores temperature; Gemini uses it.)
        anthropic: { thinking: { type: "disabled" }, effort: "low" }
      },
      onError: ({ error }) => {
        console.error("[arillm] stream error", error);
      }
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        // Reasoning can quote the system prompt; never send it to the browser.
        sendReasoning: false,
        // Never forward provider error details (they can echo keys or prompt).
        onError: () => "Something went wrong on my end. Try again in a sec."
      })
    });
  } catch (error) {
    console.error("[arillm] request failed", error);
    return jsonError(500, "Something went wrong on my end. Try again in a sec.");
  }
}
