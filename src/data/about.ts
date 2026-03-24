export type AboutGalleryItem = {
  assetName: string;
  src: string;
  caption: string;
  alt: string;
};

export const aboutGalleryItems: AboutGalleryItem[] = [
  {
    assetName: "camera-process",
    src: "/images/about/camera-process.jpg",
    caption: "Looking Closer",
    alt: "using camera on a cliffside"
  },
  {
    assetName: "snow-hike",
    src: "/images/about/snow-hike.jpg",
    caption: "Higher Ground",
    alt: "hiking in snow-covered mountains"
  },
  {
    assetName: "loreal-professional",
    src: "/images/about/loreal-professional.jpg",
    caption: "At Work",
    alt: "professional portrait at a work event"
  },
  {
    assetName: "astrophotography",
    src: "/images/about/astrophotography.jpg",
    caption: "Night Sky",
    alt: "night sky over mountain peaks"
  },
  {
    assetName: "rainy-city-lights",
    src: "/images/about/rainy-city-lights.jpg",
    caption: "After Rain",
    alt: "rainy city street with red light trails"
  },
  {
    assetName: "rock-plane-silhouette",
    src: "/images/about/rock-plane-silhouette.jpg",
    caption: "In Transit",
    alt: "airplane crossing dusk above rock formations"
  }
];

export const aboutContent = {
  openingIdea:
    "I design and build human-centered systems that balance technical rigor with real human needs.",
  introParagraphs: [
    "My work sits at the intersection of HCI, data, and interactive systems - spanning immersive XR experiences, ML-driven web applications, and qualitative research. I am especially interested in how technology shapes behavior, attention, and well-being, and how design can make those interactions more intentional rather than overwhelming.",
    "I am currently pursuing a Master's in Human-Computer Interaction at the University of Maryland, building on a background in computer engineering, product development, and data-driven systems work across L'Oreal Singapore and SP Digital."
  ],
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
        "Data Analytics Specialist, L'Oreal Singapore",
        "Enterprise Architecture Intern, L'Oreal Singapore",
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
  personal:
    "Outside of work, I spend a lot of time hiking, photographing, and reconnecting with nature. A lot of how I think about observation, atmosphere, and design comes from moving between cities, landscapes, and quieter moments outdoors.",
  portrait: {
    src: "/images/about/brooklyn-main-portrait.jpg",
    alt: "standing portrait by brooklyn waterfront"
  }
} as const;
