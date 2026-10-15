import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { SystemModelMessage } from "ai";

export type PageContext = {
  path: string;
  title: string;
};

const contentDir = path.join(process.cwd(), "content");

function readContentFile(name: string): string {
  return fs.readFileSync(path.join(contentDir, name), "utf8");
}

// Unfilled kit placeholders would teach the model to echo "<fill>" or to
// improvise an answer, so drop them before they reach the prompt: authoring
// comments, any line still holding a <fill...> marker, and voice examples
// whose answer is still a <your ...> placeholder.
function stripPlaceholders(markdown: string): string {
  return markdown
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^Q:.*\nA:\s*<your[^\n]*\n?/gm, "")
    .split("\n")
    .filter((line) => !line.includes("<fill"))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Read once at module load so every request reuses the same string. Keeping
// this block byte-identical across requests is what lets Anthropic's prompt
// cache hit.
const stablePrompt = ["rules.md", "ari.md", "voice.md"]
  .map((name) => stripPlaceholders(readContentFile(name)))
  // A VOICE header with every example stripped would only confuse the model.
  .filter((section) => !section.startsWith("# VOICE") || /^A:/m.test(section))
  .join("\n\n---\n\n");

function describePage(pageContext?: PageContext): string {
  if (!pageContext?.path) {
    return "The visitor's current page is unknown.";
  }

  const title = pageContext.title ? ` ("${pageContext.title}")` : "";
  return `The visitor is currently on ${pageContext.path}${title}. If they say "this project" or "this page", that's what they mean.`;
}

export function buildInstructions(pageContext?: PageContext): SystemModelMessage[] {
  return [
    {
      role: "system",
      content: stablePrompt,
      providerOptions: {
        anthropic: { cacheControl: { type: "ephemeral" } }
      }
    },
    { role: "system", content: describePage(pageContext) }
  ];
}
