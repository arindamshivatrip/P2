export type AboutGalleryItem = {
  assetName: string;
  src: string;
  caption: string;
  note: string;
  alt: string;
};

export const aboutGalleryItems: AboutGalleryItem[] = [
  {
    assetName: "camera-process",
    src: "/images/about/camera-process.jpg",
    caption: "Looking closer",
    note: "camera first, explanation later",
    alt: "using camera on a cliffside"
  },
  {
    assetName: "snow-hike",
    src: "/images/about/snow-hike.jpg",
    caption: "Higher ground",
    note: "scale changes the problem",
    alt: "hiking in snow-covered mountains"
  },
  {
    assetName: "loreal-professional",
    src: "/images/about/loreal-professional.jpg",
    caption: "At work",
    note: "systems meet rooms full of people",
    alt: "professional portrait at a work event"
  },
  {
    assetName: "astrophotography",
    src: "/images/about/astrophotography.jpg",
    caption: "Night sky",
    note: "patience, noise, signal",
    alt: "night sky over mountain peaks"
  },
  {
    assetName: "rainy-city-lights",
    src: "/images/about/rainy-city-lights.jpg",
    caption: "After rain",
    note: "city light doing half the composition",
    alt: "rainy city street with red light trails"
  },
  {
    assetName: "rock-plane-silhouette",
    src: "/images/about/rock-plane-silhouette.jpg",
    caption: "In transit",
    note: "most ideas arrive between places",
    alt: "airplane crossing dusk above rock formations"
  }
];

export const aboutPersonal = {
  eyebrow: "Personal",
  title: "Outside the screen",
  intro:
    "I take photos for the same reason I like research: it slows down the first answer."
} as const;

// The journey is the main progressive reveal: a tiny inline route plus three
// compact chapter clauses. The chapters exist only inside this reveal — they
// are not separate closed-state phrases.
export const aboutJourney = {
  stops: ["NUS", "SP Digital / L'Oréal", "UMD HCIM"],
  chapters: [
    {
      id: "ce",
      title: "computer engineering",
      body: "NUS, interactive digital media, software systems, business context, and early AR, VR, mobile, and media-processing projects"
    },
    {
      id: "product",
      title: "professional product systems",
      body: "SP Digital and L'Oréal Singapore, where prototypes became production interfaces, dashboards, stakeholder workflows, adoption problems, and decisions made under pressure"
    },
    {
      id: "hci",
      title: "human-computer interaction",
      body: "UMD HCIM, where I study how people understand systems, where they hesitate, what they trust, and when technology starts to overwhelm"
    }
  ]
} as const;

// Soft prose-control clauses for the four domain phrases. AWE volunteering and
// Project Aura participation are public and stated plainly; only the specific
// Project Aura details carry a tiny redaction object (appended in the
// component, never as literal "black tape" copy).
export const aboutDomainReveals: Record<string, string> = {
  xr: "VR training, AR laser tag, mobile AR scanning, spatial desktops, and interfaces that understand rooms and bodies. Recently, I've been getting more involved in the XR community through AWE 2026 volunteering and the Project Aura hackathon.",
  "human-ai":
    "tools that keep uncertainty and human judgment visible instead of hiding everything behind a clean answer",
  "data-driven":
    "dashboards, forecasts, planning systems, and decision tools that help people act without drowning them in metrics",
  accessibility:
    "interfaces that stay usable when attention, vision, confidence, or context changes"
};

// One split-flap board object replaces three separate phrase buttons.
export const aboutBehaviorBoard = [
  {
    phrase: "shapes behavior",
    detail: "how people adapt, hesitate, trust, ignore, repeat, or work around a system"
  },
  {
    phrase: "directs attention",
    detail: "what a tool asks someone to notice first, compare, act on, or forget"
  },
  {
    phrase: "affects well-being",
    detail: "where helpful support becomes friction, overload, or quiet pressure"
  }
] as const;

// The three personal words share one side polaroid. Images come from the
// existing gallery items (by assetName); the note doubles as the caption.
export const aboutPersonalReveals = {
  photographing: {
    note: "how I practice framing, patience, and looking before deciding",
    images: ["camera-process", "rainy-city-lights", "rock-plane-silhouette"]
  },
  hiking: {
    note: "a way to reset scale, pace, and attention",
    images: ["snow-hike"]
  },
  nature: {
    note: "a reminder that atmosphere changes how people feel, move, and notice",
    images: ["astrophotography"]
  }
} as const;

export const aboutContent = {
  snapshot: [
    {
      title: "Right now",
      items: [
        "Master's student in Human-Computer Interaction (HCIM) at the University of Maryland",
        "Focused on user research, interaction design, and behavior-aware systems",
        "Exploring qualitative methods, sensemaking, and design ethics through research-heavy studio coursework"
      ]
    },
    {
      title: "Before that",
      items: [
        "Data Analytics Specialist, L'Oréal Singapore",
        "Enterprise Architecture Intern, L'Oréal Singapore",
        "Full Stack Developer Intern, SP Digital",
        "B.Eng. Computer Engineering (Honors), National University of Singapore"
      ]
    },
    {
      title: "Interested in",
      items: [
        "Well-being",
        "Accessibility",
        "XR / spatial computing",
        "Human-AI interaction",
        "Behavior-aware systems"
      ]
    }
  ],
  portrait: {
    src: "/images/about/brooklyn-main-portrait.jpg",
    alt: "standing portrait by brooklyn waterfront"
  }
} as const;
