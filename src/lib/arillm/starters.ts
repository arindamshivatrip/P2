// Starter chips for the empty chat, picked by the page the visitor is on.

const GENERAL = ["What are you working on?", "What roles are you looking for?", "What's Aura Desk?"];

const PAGE_STARTERS: Record<string, string[]> = {
  "/about": ["Why did you move into HCI?", "What do you do outside work?", "What roles are you looking for?"],
  "/contact": ["What's the best way to reach you?", "When can you start?", "What roles are you looking for?"],
  "/cv": ["Walk me through your experience.", "What are your strongest skills?", "What roles are you looking for?"]
};

// Keyed by project slug, for /work/<slug> and /experiments/<slug>.
const PROJECT_STARTERS: Record<string, string[]> = {
  "light-helmets-scan-to-fitment": [
    "How did the head scanning work?",
    "What was the hardest part of the helmet pipeline?",
    "How did you keep the results reproducible?"
  ],
  "reframed-passthrough-ar": [
    "How does Reframed recognize the paintings?",
    "What's your thesis about?",
    "How did people react at NextNOW Fest?"
  ],
  "aura-desk-android-xr": [
    "Why did you build Aura Desk?",
    "What was it like building on unreleased hardware?",
    "What's next for Aura Desk?"
  ],
  "niantic-spatial-ar": [
    "What are you building with Niantic?",
    "What's it like leading the XR Club team?"
  ],
  "loreal-ml-planning-suite": [
    "What did the planning tools do?",
    "What was leading two developers like?",
    "How did you get analysts to adopt the dashboards?"
  ],
  "loreal-analytics-storefront": [
    "How did you cut data access time by 90%?",
    "What was the tool storefront?"
  ],
  "sp-digital-utility-platform": [
    "What did you build at SP Digital?",
    "What did you learn from working at that scale?"
  ],
  "smartphone-use-mental-wellbeing": [
    "How did you run the diary study?",
    "What did the study find?"
  ],
  "trailtogether-group-hiking-app": [
    "What problem does TrailTogether solve?",
    "What changed after usability testing?"
  ],
  "revamping-shopeepay": [
    "How did you set up the ShopeePay experiment?",
    "What did the study find?"
  ],
  "vr-heatstroke-education-simulator": [
    "How did you design VR for kids?",
    "What did testing with children change?"
  ],
  "shoot-it-ar-laser-tag-system": [
    "How did the AR laser tag work?",
    "What's your hardest-bug story?"
  ],
  "music-lyrics-transcription-system": [
    "How did the transcription pipeline work?",
    "Where did it struggle?"
  ],
  "media-framing-sentiment-pipeline": [
    "What did the movie sentiment study find?",
    "Why compare six ways of representing plots?"
  ],
  snapt: ["How did you make SnaPT faster?", "Why build a Chrome extension?", "How many people use it?"],
  "ai-assisted-portfolio-platform": [
    "How did you build this site?",
    "How do you use AI when you build?",
    "How does Ask Ari work?"
  ],
  "trailtales-local-discovery-app": ["What was TrailTales?", "What did the beta users change?"],
  "intronus-interaction-design-project": ["What was IntroNUS?", "What did usability testing show?"]
};

const PROJECT_ROUTE = /^\/(?:work|experiments)\/([^/]+)\/?$/;

export function getStarters(pathname: string | null): string[] {
  if (!pathname) return GENERAL;
  const slug = PROJECT_ROUTE.exec(pathname)?.[1];
  if (slug) return PROJECT_STARTERS[slug] ?? GENERAL;
  return PAGE_STARTERS[pathname.replace(/\/$/, "")] ?? GENERAL;
}
