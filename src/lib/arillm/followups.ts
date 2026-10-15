// Follow-up suggestions shown under the latest reply. A static keyword map,
// so suggestions cost nothing and never need a second model call.

type FollowupRule = {
  /** Lowercase word starts; any one appearing in the reply triggers the rule. */
  keywords: string[];
  questions: string[];
};

const RULES: FollowupRule[] = [
  {
    keywords: ["helmet", "scan", "fitment", "light helmets"],
    questions: ["How did the head scanning work?", "What was the hardest part of the helmet pipeline?"]
  },
  {
    keywords: ["seating", "pose search", "grid search"],
    questions: ["Why did the original pose solver stall?"]
  },
  {
    keywords: ["reframed", "passthrough", "artwork", "painting"],
    questions: ["How does Reframed recognize the paintings?", "What's your thesis about?"]
  },
  {
    keywords: ["thesis", "advisor", "ming lin", "bonsignore"],
    questions: ["What's your thesis question?"]
  },
  {
    keywords: ["aura desk", "project aura", "android xr", "glasses"],
    questions: ["What's Aura Desk?", "What was it like building on unreleased hardware?"]
  },
  {
    keywords: ["trusted developer", "hackathon", "awe 2026"],
    questions: ["What did you build at the AWE hackathon?"]
  },
  {
    keywords: ["niantic"],
    questions: ["What are you building with Niantic's SDK?"]
  },
  {
    keywords: ["l'oréal", "l'oreal", "promotion", "planning tools", "apac"],
    questions: ["What did you build at L'Oréal?", "What was leading developers like?"]
  },
  {
    keywords: ["prd", "product manager", "sprint"],
    questions: ["Do you want to be a PM or an engineer?"]
  },
  {
    keywords: ["sp digital"],
    questions: ["What did you work on at SP Digital?"]
  },
  {
    keywords: ["snapt", "chrome extension", "chatgpt"],
    questions: ["How did you make SnaPT faster?"]
  },
  {
    keywords: ["claude code", "coding agent", "ai-assisted", "ai tools"],
    questions: ["How do you use AI when you build?"]
  },
  {
    keywords: ["shoot it", "laser tag", "capstone"],
    questions: ["What's your hardest-bug story?"]
  },
  {
    keywords: ["diary study", "interview", "usability", "ux research", "persona"],
    questions: ["How do you approach UX research?", "Which research project are you proudest of?"]
  },
  {
    keywords: ["trailtogether", "hiking"],
    questions: ["What did testing TrailTogether change?"]
  },
  {
    keywords: ["shopeepay", "anova"],
    questions: ["What did the ShopeePay study find?"]
  },
  {
    keywords: ["sentiment", "movies", "films", "sbert"],
    questions: ["What did the movie sentiment study find?"]
  },
  {
    keywords: ["unity", "quest 3", "vr", "xr", "mixed reality"],
    questions: ["Why XR?", "What XR tools do you use?"]
  },
  {
    keywords: ["e-ink", "kindle", "hardware"],
    questions: ["Tell me about the e-ink reader."]
  },
  {
    keywords: ["umd", "maryland", "hci", "master"],
    questions: ["Why did you go back for an HCI master's?"]
  },
  {
    keywords: ["role", "full-time", "co-op", "internship", "looking for", "2027"],
    questions: ["What roles are you looking for?", "Are you open to relocating?"]
  },
  {
    keywords: ["singapore", "nus"],
    questions: ["What brought you from Singapore to Maryland?"]
  }
];

const GENERAL = [
  "What are you working on right now?",
  "What kind of team do you want to join?",
  "What's a project you're proud of?"
];

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Match at the start of a word, so "scan" catches "scanning" but "vr" doesn't
// fire inside an unrelated word.
const MATCHERS = RULES.map((rule) => ({
  questions: rule.questions,
  pattern: new RegExp(`(?<![\\p{L}\\p{N}])(?:${rule.keywords.map(escapeRegExp).join("|")})`, "iu")
}));

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Emails and links appear in most replies ("email me at aritrip@umd.edu"), so
// they would otherwise trigger the same rules every time.
function stripAddresses(text: string): string {
  return text
    .replace(/\]\([^)]*\)/g, "]")
    .replace(/\S+@\S+/g, " ")
    .replace(/https?:\/\/\S+/g, " ");
}

/**
 * Up to `limit` follow-ups for a reply, skipping anything the visitor already
 * asked. Rules that match earlier in the reply win; general questions fill
 * any gap.
 */
export function getFollowups(reply: string, alreadyAsked: string[], limit = 3): string[] {
  const text = stripAddresses(reply);
  const asked = new Set(alreadyAsked.map(normalize));

  const matched = MATCHERS.map((rule) => ({ rule, index: text.search(rule.pattern) }))
    .filter(({ index }) => index >= 0)
    .sort((a, b) => a.index - b.index)
    .flatMap(({ rule }) => rule.questions);

  const fresh = (questions: string[]) =>
    [...new Set(questions)].filter((question) => !asked.has(normalize(question)));

  // Keep the most relevant few, then shuffle so repeat visits vary a little.
  const picked = shuffle(fresh(matched).slice(0, limit + 1)).slice(0, limit);
  const filler = shuffle(fresh(GENERAL).filter((question) => !picked.includes(question)));
  return [...picked, ...filler].slice(0, limit);
}
