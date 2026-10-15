// Sends every question in content/eval-questions.txt to the local AriLLM
// route and prints the Q/A pairs, so you can read how the bot sounds after
// editing content/*.md.
//
//   npm run arillm:eval                          # http://localhost:3000
//   npm run arillm:eval -- http://localhost:3006 # another port
//   npm run arillm:eval -- --only salary         # questions containing "salary"
//
// Each question is asked in a fresh conversation. Needs the dev server running.

import { readFile } from "node:fs/promises";
import path from "node:path";

const QUESTIONS_FILE = path.join(process.cwd(), "content", "eval-questions.txt");

function parseArgs(argv: string[]) {
  let baseUrl = "http://localhost:3000";
  let only: string | null = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--only") only = argv[++i]?.toLowerCase() ?? null;
    else if (/^https?:\/\//.test(argv[i])) baseUrl = argv[i].replace(/\/$/, "");
  }
  return { baseUrl, only };
}

async function readQuestions(): Promise<string[]> {
  const raw = await readFile(QUESTIONS_FILE, "utf8");
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

// The route streams Server-Sent Events: `data: {"type":"text-delta","delta":"..."}`.
async function ask(baseUrl: string, question: string): Promise<string> {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      messages: [{ id: "eval", role: "user", parts: [{ type: "text", text: question }] }],
      pageContext: { path: "/", title: "Ask Ari eval" }
    })
  });

  if (!response.ok) {
    const body = await response.text();
    return `[HTTP ${response.status}] ${body}`;
  }

  let answer = "";
  for (const line of (await response.text()).split("\n")) {
    if (!line.startsWith("data: ")) continue;
    const data = line.slice(6).trim();
    if (data === "[DONE]") break;
    try {
      const event = JSON.parse(data) as { type: string; delta?: string; errorText?: string };
      if (event.type === "text-delta" && event.delta) answer += event.delta;
      if (event.type === "error") answer += `\n[stream error] ${event.errorText ?? ""}`;
    } catch {
      // Ignore anything that isn't a JSON event.
    }
  }
  return answer.trim() || "[empty reply]";
}

async function main() {
  const { baseUrl, only } = parseArgs(process.argv.slice(2));
  const questions = (await readQuestions()).filter(
    (question) => !only || question.toLowerCase().includes(only)
  );

  if (!questions.length) {
    console.error("No questions to run.");
    process.exit(1);
  }

  console.log(`Ask Ari eval: ${questions.length} questions against ${baseUrl}\n`);

  for (const [index, question] of questions.entries()) {
    const started = Date.now();
    let answer: string;
    try {
      answer = await ask(baseUrl, question);
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      console.error(`Couldn't reach ${baseUrl}/api/chat (${reason}). Is \`npm run dev\` running?`);
      process.exit(1);
    }
    const seconds = ((Date.now() - started) / 1000).toFixed(1);
    console.log(`Q${index + 1}. ${question}`);
    console.log(`${answer}\n  (${seconds}s)\n`);
  }
}

void main();
