# Ask Ari (AriLLM)

The "Ask Ari" chat on arindamtripathi.com: an AI version of Ari that answers in first person about Ari's work, background, and what Ari is looking for. Open it from the nav, with `/` or Ctrl/Cmd+K, or by selecting text on a page and clicking "Ask Ari". In the code and file names it's still called AriLLM (`arillm`).

There's no database or RAG. Everything the bot knows is in three Markdown files that go into the system prompt.

## Update what the bot knows

| File | What it's for |
| --- | --- |
| [`content/ari.md`](content/ari.md) | Facts: experience, projects, skills, opinions, and topics to deflect |
| [`content/voice.md`](content/voice.md) | Example answers in Ari's own words. These shape tone more than the rules do. |
| [`content/rules.md`](content/rules.md) | Persona, tone, guardrails, contact email |

1. Edit the file. Any line containing `<fill` is dropped from the prompt automatically, so placeholders are safe to leave.
2. Restart `npm run dev`. The prompt is read once when the server starts.
3. Run the eval (below) and read the answers.
4. Commit and push. Vercel ships `content/*.md` with the API function (`outputFileTracingIncludes` in `next.config.mjs`).

Links in `ari.md` must match real routes: case studies are under `/work/<slug>`, and side projects are under `/experiments/<slug>`.

## Check how it sounds

With the dev server running in another terminal:

```bash
npm run arillm:eval
```

That sends every line of [`content/eval-questions.txt`](content/eval-questions.txt) to `http://localhost:3000/api/chat`, each as a fresh conversation, and prints the questions and answers. Options:

```bash
npm run arillm:eval -- http://localhost:3006 --only salary
```

Add a question to the text file whenever the bot gets something wrong, so you can check it next time. A full run is 18 short calls, about one or two cents on Haiku.

## Switch models

Set these in `.env.local` locally and in Vercel under Project Settings > Environment Variables, then restart or redeploy. No code changes needed.

| Variable | Example | Notes |
| --- | --- | --- |
| `AI_PROVIDER` | `anthropic` | `anthropic` or `google` |
| `AI_MODEL` | `claude-haiku-5-5` | Optional; each provider has a default |
| `ANTHROPIC_API_KEY` | | Needed when either model is Anthropic |
| `AI_FALLBACK_PROVIDER` | `google` | Optional. Leave blank for no fallback. |
| `AI_FALLBACK_MODEL` | `gemini-3.5-flash-lite` | Optional |
| `GOOGLE_GENERATIVE_AI_API_KEY` | | Needed when either model is Gemini |
| `UPSTASH_REDIS_REST_URL` | | Rate limiting; leave blank locally |
| `UPSTASH_REDIS_REST_TOKEN` | | Rate limiting; leave blank locally |

If the primary model fails before it starts replying (bad key, outage, rate limit), the same request goes once to the fallback.

Model-specific settings in [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts):

- Anthropic: thinking is off and effort is `low`. Haiku 5.5 thinks by default, which used up the 400-token reply budget and cut answers off mid-sentence. If you switch to another Claude model, check its thinking rules first: some reject `thinking: disabled`.
- `temperature: 0.6` only affects Gemini. Haiku 5.5 ignores it, and the AI SDK logs a warning on each request.
- Replies are capped at 400 output tokens, and only the last 12 messages are sent.

## Limits and safety

- **Rate limits** ([`src/lib/arillm/rate-limit.ts`](src/lib/arillm/rate-limit.ts)): 15 messages per hour per IP, and 300 per day across the whole site (resets at midnight UTC). Over a limit, the visitor sees a friendly message pointing to email, with no "Try again" link. Rate limiting is skipped when the Upstash vars are missing, and the chat stays up if Redis is unreachable.
- Visitor messages over 1,000 characters are rejected.
- The browser can only send user and assistant messages, so visitors can't inject system messages.
- Provider errors and model reasoning are never sent to the browser.

### Setting up Upstash (one time)

1. Create a free Redis database at [upstash.com](https://upstash.com) (any region close to your Vercel functions).
2. Copy the REST URL and REST token from its page.
3. Add them to Vercel as `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`, then redeploy.

## Code map

| What | Where |
| --- | --- |
| API route (validation, rate limit, streaming) | [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts) |
| System prompt builder (cached block + page context) | [`src/lib/arillm/prompt.ts`](src/lib/arillm/prompt.ts) |
| Provider switch and fallback | [`src/lib/arillm/model.ts`](src/lib/arillm/model.ts) |
| Rate limiting | [`src/lib/arillm/rate-limit.ts`](src/lib/arillm/rate-limit.ts) |
| Starter questions per page and project | [`src/lib/arillm/starters.ts`](src/lib/arillm/starters.ts) |
| Follow-up suggestions (keyword map) | [`src/lib/arillm/followups.ts`](src/lib/arillm/followups.ts) |
| Chat state, `sessionStorage`, keyboard shortcut | [`src/components/arillm/chat-provider.tsx`](src/components/arillm/chat-provider.tsx) |
| Nav button | [`src/components/arillm/chat-launcher.tsx`](src/components/arillm/chat-launcher.tsx) |
| Drawer (desktop) and bottom sheet (mobile) | [`src/components/arillm/chat-panel.tsx`](src/components/arillm/chat-panel.tsx) |
| "Ask Ari" pill on selected text | [`src/components/arillm/selection-ask.tsx`](src/components/arillm/selection-ask.tsx) |
| Eval script | [`scripts/arillm-eval.ts`](scripts/arillm-eval.ts) |

New project page? Add 2 or 3 questions for its slug in `starters.ts` (and keywords in `followups.ts` if you like). Pages without an entry use the general starters.

## Open to-dos

- Add the model vars and the Upstash vars in Vercel, then redeploy.
- Delete the old Gemini key that appeared in an earlier screenshot, if not done already.
- After Immersed the Bay (November 2026), update its section in `ari.md`.
- Optional: add what INST346 covers and what you do as its TA to `ari.md`. Right now the bot only knows that you're the TA.
- Optional: add the Pico game jam to `ari.md`, then give it starters in `starters.ts`.
- Optional: say what you actually do about the delegation weakness. The bot improvises "it's something I'm working on."
- Migrate `next lint` to the ESLint CLI before Next.js 16 removes it.
