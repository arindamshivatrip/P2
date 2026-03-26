import type { Project, ProjectCategory, ProjectSection } from "@/types/project";

export const PROJECT_PLACEHOLDER_THUMBNAIL = "/images/projects/placeholder-thumbnail.png";
export const PROJECT_PLACEHOLDER_COVER = "/images/projects/placeholder-cover.png";

export const projects: Project[] = [
  {
    id: "loreal-ml-planning-suite",
    slug: "loreal-ml-planning-suite",
    title: "ML Planning Suite for APAC Markets",
    oneLiner:
      "A decision-support tool suite for promotion planning used across APAC markets.",
    summary:
      "At L’Oréal, I worked on ML-backed planning tools and analytics interfaces that helped commercial teams make faster, more consistent planning decisions across multiple APAC markets. The public version focuses on scope, contribution, and outcomes rather than internal product details.",
    section: "work",
    visibility: "confidential-summary",
    entryType: "professional",
    role: "Data Analytics Specialist",
    contributionTag: "AI Systems",
    meta: {
      org: "L’Oréal Singapore",
      teamType: "team",
      year: "2025",
      sortDate: "2025-08-01",
      dateRange: "Jul 2023 – Aug 2025",
      location: "Singapore"
    },
    metaStrip: {
      roleValue: "Data Analytics Specialist",
      timelineValue: "Jul 2023 – Aug 2025",
      teamValue: "Cross-functional regional team",
      focusValue: ["ML systems", "Decision support", "Analytics interfaces", "Workflow design"]
    },
    categories: ["AI Systems", "Engineering", "Data", "Interaction Design", "Analytics"],
    tech: ["ML", "Analytics Interfaces", "Dashboards", "Agile"],
    tags: ["Enterprise", "Decision Support"],
    featured: true,
    priority: 1,
    cardSize: "xl",
    status: "Case Study",
    caseStudyDepth: "light",
    visible: true,
    themeKey: "AI",
    thumbnail: "/images/projects/loreal-ml-planning-suite/thumbnail.jpg",
    coverImage: "/images/projects/loreal-ml-planning-suite/cover.jpg",
    video: {
      src: "/videos/loreal/L1.mp4",
      title: "L'Oréal ML Planning Suite preview"
    },
    highlights: [
      "Worked on ML-backed promotion planning tools for regional business users.",
      "Helped translate stakeholder requirements into workflows and analytics interfaces.",
      "Contributed to self-serve systems that reduced dependency on central data teams."
    ],
    metrics: [
      { label: "Users", value: "200+" },
      { label: "Markets", value: "10+ APAC" },
      { label: "Efficiency", value: "+24%" }
    ],
    nda: {
      isRestricted: true,
      visibility: "summary-only",
      note: "Selected details only. Some project specifics are omitted."
    },
    detailPage: {
      showHeroImage: true,
      showMetaStrip: true,
      showMetrics: true,
      showGallery: false,
      showPdfEmbed: false,
      showVideo: false,
      showOutcomeStrip: true
    }
  },

  {
    id: "smartphone-use-mental-wellbeing",
    slug: "smartphone-use-mental-wellbeing",
    title: "Smartphone Use & Mental Wellbeing",
    oneLiner:
      "A mixed-methods UX research study on how everyday smartphone behaviors shape emotional regulation.",
    summary:
      "I conducted a mixed-methods study combining diary studies and contextual interviews to understand how people use their phones during moments of stress, boredom, and self-regulation, then translated those findings into design requirements for digital wellbeing interventions.",
    section: "work",
    visibility: "public",
    entryType: "research",
    role: "Research Lead",
    contributionTag: "Research Lead",
    meta: {
      org: "University of Maryland",
      teamType: "team",
      year: "2025",
      sortDate: "2025-12-01",
      dateRange: "Aug 2025 – Dec 2025",
      location: "College Park, MD"
    },
    metaStrip: {
      roleValue: "Research Lead",
      timelineValue: "Aug 2025 – Dec 2025",
      teamValue: "Team project",
      focusValue: ["Diary studies", "Contextual interviews", "Affinity mapping", "Journey mapping"]
    },
    categories: ["Research", "Interaction Design", "Digital Wellbeing"],
    tech: [
      "Diary Studies",
      "Contextual Interviews",
      "Affinity Mapping",
      "Personas",
      "Journey Mapping"
    ],
    tags: ["HCIM", "UX Research"],
    featured: true,
    priority: 2,
    cardSize: "xl",
    status: "Case Study",
    caseStudyDepth: "full",
    visible: true,
    themeKey: "Research",
    thumbnail: "/images/projects/smartphone-use-mental-wellbeing/thumbnail.jpg",
    coverImage: "/images/projects/smartphone-use-mental-wellbeing/cover.jpg",
    pdf: {
      embedUrl: "/pdfs/smartphone-use-mental-wellbeing.pdf",
      downloadUrl: "/pdfs/smartphone-use-mental-wellbeing.pdf",
      title: "Full research report"
    },
    highlights: [
      "Analyzed diary study data from 9 participants and contextual interviews with 5 participants.",
      "Synthesized recurring behavioral patterns through affinity diagramming and interpretation sessions.",
      "Developed regulation profiles and translated findings into prioritized design requirements."
    ],
    metrics: [
      { label: "Diary participants", value: "9" },
      { label: "Interview participants", value: "5" },
      { label: "Study length", value: "4 months" }
    ],
    detailPage: {
      showHeroImage: true,
      showMetaStrip: true,
      showMetrics: true,
      showGallery: true,
      showPdfEmbed: true,
      showVideo: false,
      showOutcomeStrip: true
    }
  },

  {
    id: "shoot-it",
    slug: "shoot-it-ar-laser-tag-system",
    title: "ShooT IT",
    oneLiner:
      "A real-time AR laser tag system combining physical hardware, multiplayer gameplay, and multisensory feedback.",
    summary:
      "I designed and engineered an augmented reality laser tag system that integrated physical hardware with Unity-based gameplay, using MQTT for event synchronization and haptic feedback to strengthen responsiveness and game feel.",
    section: "work",
    visibility: "public",
    entryType: "project",
    role: "Project Lead / XR Developer",
    contributionTag: "Project Lead",
    meta: {
      org: "National University of Singapore",
      teamType: "team",
      year: "2022",
      sortDate: "2022-05-01",
      dateRange: "Jan 2022 – May 2022",
      location: "Singapore"
    },
    metaStrip: {
      roleValue: "Project Lead / XR Developer",
      timelineValue: "Jan 2022 – May 2022",
      teamValue: "Team project",
      focusValue: ["AR systems", "Multiplayer sync", "Haptics", "Interaction design"]
    },
    categories: ["XR / Spatial", "Engineering", "Interaction Design"],
    tech: ["Unity3D", "C#", "MQTT", "Vuforia"],
    tags: ["AR", "Multiplayer", "Physical Computing"],
    featured: true,
    priority: 3,
    cardSize: "lg",
    status: "Case Study",
    caseStudyDepth: "full",
    visible: true,
    themeKey: "XR",
    thumbnail: "/images/projects/shoot-it/thumbnail.jpg",
    coverImage: "/images/projects/shoot-it/cover.jpg",
    video: {
      src: "/videos/shoot-it/demo.mp4",
      poster: "/images/projects/shoot-it/video-poster.jpg",
      title: "ShooT IT demo video"
    },
    highlights: [
      "Engineered a real-time multiplayer AR gameplay system using MQTT for event synchronization.",
      "Integrated custom haptic feedback through hardware-triggered phone vibration.",
      "Structured interaction logic to maintain consistent gameplay across components."
    ],
    metrics: [{ label: "Latency", value: "~50ms" }],
    detailPage: {
      showHeroImage: true,
      showMetaStrip: true,
      showMetrics: true,
      showGallery: true,
      showPdfEmbed: false,
      showVideo: true,
      showOutcomeStrip: true
    }
  },

  {
    id: "music-lyrics-transcription",
    slug: "music-lyrics-transcription-system",
    title: "Music & Lyrics Transcription System",
    oneLiner:
      "An AI-driven pipeline for extracting lyrical and melodic content from uploaded audio.",
    summary:
      "I built an end-to-end transcription system that combined SpeechBrain and Spleeter to process uploaded tracks, evaluate reliability under different conditions, and present outputs through a React-based interface designed for clarity and interpretability.",
    section: "work",
    visibility: "public",
    entryType: "project",
    role: "Developer",
    contributionTag: "AI Systems",
    meta: {
      org: "National University of Singapore",
      teamType: "team",
      year: "2022",
      sortDate: "2022-11-01",
      dateRange: "Oct 2022 – Nov 2022",
      location: "Singapore"
    },
    metaStrip: {
      roleValue: "Developer",
      timelineValue: "Oct 2022 – Nov 2022",
      teamValue: "Team project",
      focusValue: ["Audio ML", "ASR", "Evaluation", "Frontend clarity"]
    },
    categories: ["AI Systems", "Engineering", "Interaction Design", "NLP"],
    tech: ["Python", "React", "SpeechBrain", "Spleeter", "ASR"],
    tags: ["ML", "Audio", "Evaluation"],
    featured: true,
    priority: 4,
    cardSize: "lg",
    status: "Case Study",
    caseStudyDepth: "medium",
    visible: true,
    themeKey: "AI",
    thumbnail: "/images/projects/music-lyrics-transcription/thumbnail.jpg",
    coverImage: "/images/projects/music-lyrics-transcription/cover.jpg",
    pdf: {
      embedUrl: "/pdfs/music-lyrics-transcription-system.pdf",
      downloadUrl: "/pdfs/music-lyrics-transcription-system.pdf",
      title: "Project report"
    },
    highlights: [
      "Built an end-to-end audio processing pipeline for lyrics and melody extraction.",
      "Benchmarked transcription performance using WER and F1.",
      "Identified reliability degradation under high-tempo conditions."
    ],
    metrics: [
      { label: "F1", value: "0.75" },
      { label: "WER", value: "18–20%" }
    ],
    detailPage: {
      showHeroImage: true,
      showMetaStrip: true,
      showMetrics: true,
      showGallery: true,
      showPdfEmbed: true,
      showVideo: false,
      showOutcomeStrip: true
    }
  },

  {
    id: "revamping-shopeepay",
    slug: "revamping-shopeepay",
    title: "Revamping ShopeePay",
    oneLiner:
      "A quantitative UX study comparing layout and navigation variants for critical payment tasks.",
    summary:
      "I designed a controlled usability experiment to evaluate how interface layout and navigation patterns affected payment task performance, then used statistical analysis to recommend a more efficient and convenient navigation model.",
    section: "work",
    visibility: "public",
    entryType: "research",
    role: "UX Researcher",
    contributionTag: "Quantitative UX",
    meta: {
      org: "National University of Singapore",
      teamType: "team",
      year: "2023",
      sortDate: "2023-03-01",
      dateRange: "Feb 2023 – Mar 2023",
      location: "Singapore"
    },
    metaStrip: {
      roleValue: "UX Researcher",
      timelineValue: "Feb 2023 – Mar 2023",
      teamValue: "Team project",
      focusValue: ["Experiment design", "Task performance", "Statistical testing", "Navigation evaluation"]
    },
    categories: ["Research", "Interaction Design", "Data"],
    tech: ["Qualtrics", "MTurk", "MATLAB", "Statistical Analysis"],
    tags: ["Quantitative UX", "Experiment Design"],
    featured: false,
    priority: 5,
    cardSize: "md",
    status: "Case Study",
    caseStudyDepth: "medium",
    visible: true,
    themeKey: "Research",
    thumbnail: "/images/projects/revamping-shopeepay/thumbnail.jpg",
    coverImage: "/images/projects/revamping-shopeepay/cover.jpg",
    pdf: {
      embedUrl: "/pdfs/revamping-shopeepay.pdf",
      downloadUrl: "/pdfs/revamping-shopeepay.pdf",
      title: "Study report"
    },
    highlights: [
      "Designed a 2×3 within-subject factorial experiment comparing layouts and navigation methods.",
      "Applied repeated-measures ANOVA to evaluate completion time and error rates.",
      "Recommended a persistent navigation bar based on performance and perceived convenience."
    ],
    metrics: [
      { label: "Layout variants", value: "2" },
      { label: "Navigation methods", value: "3" },
      { label: "Result", value: "Revised layout faster" }
    ],
    detailPage: {
      showHeroImage: true,
      showMetaStrip: true,
      showMetrics: true,
      showGallery: false,
      showPdfEmbed: true,
      showVideo: false,
      showOutcomeStrip: true
    }
  },

  {
    id: "vr-heatstroke-education-simulator",
    slug: "vr-heatstroke-education-simulator",
    title: "VR Heatstroke Education Simulator",
    oneLiner:
      "An immersive VR learning experience designed to teach children how to respond to heatstroke.",
    summary:
      "I developed an educational VR simulation focused on reducing interaction friction for younger users through intuitive locomotion, object snapping, and guided task flows tailored to their cognitive and motor needs.",
    section: "work",
    visibility: "public",
    entryType: "project",
    role: "XR Developer / Interaction Designer",
    contributionTag: "XR Design",
    meta: {
      org: "National University of Singapore",
      teamType: "team",
      year: "2023",
      sortDate: "2023-05-01",
      dateRange: "Mar 2023 – May 2023",
      location: "Singapore"
    },
    metaStrip: {
      roleValue: "XR Developer / Interaction Designer",
      timelineValue: "Mar 2023 – May 2023",
      teamValue: "Team project",
      focusValue: ["VR education", "Locomotion design", "Task guidance", "Accessibility"]
    },
    categories: ["XR / Spatial", "Interaction Design", "Accessibility"],
    tech: ["Unity3D", "C#", "XR Interaction Toolkit", "Oculus"],
    tags: ["VR", "Education", "Interaction Design"],
    featured: false,
    priority: 6,
    cardSize: "md",
    status: "Case Study",
    caseStudyDepth: "medium",
    visible: true,
    themeKey: "XR",
    thumbnail: "/images/projects/vr-heatstroke-education-simulator/thumbnail.jpg",
    coverImage: "/images/projects/vr-heatstroke-education-simulator/cover.jpg",
    highlights: [
      "Designed an immersive VR learning experience for children.",
      "Used joystick locomotion and object snapping to reduce interaction friction.",
      "Simplified flows using visual cues and stepwise guidance."
    ],
    metrics: [{ label: "Award", value: "Silver (STEPS)" }],
    detailPage: {
      showHeroImage: true,
      showMetaStrip: true,
      showMetrics: true,
      showGallery: true,
      showPdfEmbed: false,
      showVideo: false,
      showOutcomeStrip: true
    }
  },

  {
    id: "niantic-spatial-ar",
    slug: "niantic-spatial-ar",
    title: "Niantic Spatial AR",
    oneLiner:
      "A location-aware mobile AR prototype built around geospatial anchors and real-time environment mapping.",
    summary:
      "As part of a university–Niantic collaboration, I’m leading a small team to prototype spatially anchored AR interactions on mobile hardware, exploring how geospatial systems can support durable, place-based experiences.",
    section: "work",
    visibility: "public",
    entryType: "project",
    role: "Project Lead",
    contributionTag: "In Progress",
    meta: {
      org: "XR Club / University Collaboration",
      teamType: "team",
      year: "2026",
      sortDate: "2026-03-01",
      dateRange: "Mar 2026 – Present",
      location: "College Park, MD"
    },
    metaStrip: {
      roleValue: "Project Lead",
      timelineValue: "Mar 2026 – Present",
      teamValue: "3-person team",
      focusValue: ["Mobile AR", "Geospatial anchors", "Environment mapping", "Interaction prototyping"]
    },
    categories: ["XR / Spatial", "Engineering", "Mobile AR"],
    tech: ["Unity", "C#", "Niantic Spatial SDK"],
    tags: ["Location-aware AR", "Geospatial"],
    featured: false,
    priority: 7,
    cardSize: "md",
    status: "In Progress",
    caseStudyDepth: "light",
    visible: true,
    themeKey: "XR",
    thumbnail: "/images/projects/niantic-spatial-ar/thumbnail.jpg",
    coverImage: "/images/projects/niantic-spatial-ar/cover.jpg",
    highlights: [
      "Selected for a university–Niantic partnership to build location-aware mobile AR experiences.",
      "Leading a 3-person team prototyping spatially anchored interactions.",
      "Exploring geospatial anchors and real-time environment mapping on mobile hardware."
    ],
    detailPage: {
      showHeroImage: true,
      showMetaStrip: true,
      showMetrics: false,
      showGallery: true,
      showPdfEmbed: false,
      showVideo: false,
      showOutcomeStrip: false
    }
  },

  {
    id: "loreal-analytics-storefront",
    slug: "loreal-analytics-storefront",
    title: "Internal Analytics Dashboards + Tool Storefront",
    oneLiner:
      "An internal analytics and discovery system that made enterprise tools easier to access and navigate.",
    summary:
      "I designed internal analytics views and a centralized storefront experience to improve access to enterprise application data and tool discoverability. The public version focuses on information architecture, dashboard design, and workflow gains.",
    section: "work",
    visibility: "confidential-summary",
    entryType: "professional",
    role: "Enterprise Architecture Intern",
    contributionTag: "Analytics UX",
    meta: {
      org: "L’Oréal Singapore",
      teamType: "team",
      year: "2022",
      sortDate: "2022-09-01",
      dateRange: "May 2022 – Sep 2022",
      location: "Singapore"
    },
    metaStrip: {
      roleValue: "Enterprise Architecture Intern",
      timelineValue: "May 2022 – Sep 2022",
      teamValue: "Enterprise team",
      focusValue: ["Dashboard design", "Tool discoverability", "Information architecture", "Performance"]
    },
    categories: ["Data", "Interaction Design", "Engineering", "Analytics"],
    tech: ["Power BI", "Power Platform", "Databases", "Information Architecture"],
    tags: ["Internal Tools"],
    featured: false,
    priority: 8,
    cardSize: "md",
    status: "Case Study",
    caseStudyDepth: "light",
    visible: true,
    themeKey: "Data",
    thumbnail: "/images/projects/loreal-analytics-storefront/thumbnail.jpg",
    coverImage: "/images/projects/loreal-analytics-storefront/cover.jpg",
    highlights: [
      "Built dashboards to improve access to internal application data.",
      "Improved discoverability through a centralized storefront structure.",
      "Optimized data structures to improve performance."
    ],
    metrics: [
      { label: "Access time", value: "-90%" },
      { label: "Findability", value: "+50%" },
      { label: "DB size", value: "-30%" },
      { label: "Load time", value: "-20%" }
    ],
    nda: {
      isRestricted: true,
      visibility: "summary-only",
      note: "Selected details only. Some project specifics are omitted."
    },
    detailPage: {
      showHeroImage: true,
      showMetaStrip: true,
      showMetrics: true,
      showGallery: false,
      showPdfEmbed: false,
      showVideo: false,
      showOutcomeStrip: true
    }
  },

  {
    id: "sp-digital-utility-platform",
    slug: "sp-digital-utility-platform",
    title: "Customer-Facing Utility Platform",
    oneLiner:
      "Production frontend interfaces for customer utility workflows at scale.",
    summary:
      "At SP Digital, I built and refined production frontend experiences for customer utility journeys, translating specifications into reusable UI components and improving navigation clarity. The public entry emphasizes scale, implementation, and outcomes without exposing internal systems.",
    section: "work",
    visibility: "confidential-summary",
    entryType: "professional",
    role: "Full Stack Developer Intern",
    contributionTag: "Frontend Engineering",
    meta: {
      org: "SP Digital, Singapore",
      teamType: "team",
      year: "2021",
      sortDate: "2021-12-01",
      dateRange: "Jun 2021 – Dec 2021",
      location: "Singapore"
    },
    metaStrip: {
      roleValue: "Full Stack Developer Intern",
      timelineValue: "Jun 2021 – Dec 2021",
      teamValue: "Product engineering team",
      focusValue: ["Frontend systems", "Reusable UI", "Navigation clarity", "Production QA"]
    },
    categories: ["Engineering", "Interaction Design"],
    tech: ["React", "JavaScript", "Frontend Components", "QA"],
    tags: ["Production UI"],
    featured: false,
    priority: 9,
    cardSize: "md",
    status: "Case Study",
    caseStudyDepth: "light",
    visible: true,
    themeKey: "Web",
    thumbnail: "/images/projects/sp-digital-utility-platform/thumbnail.jpg",
    coverImage: "/images/projects/sp-digital-utility-platform/cover.jpg",
    highlights: [
      "Built and refined production React/JavaScript pages for customer workflows.",
      "Improved navigation clarity and maintainability through reusable components.",
      "Contributed to issue resolution across customer-facing experiences."
    ],
    metrics: [
      { label: "Pages", value: "150+" },
      { label: "Support tickets", value: "-20%" }
    ],
    nda: {
      isRestricted: true,
      visibility: "summary-only",
      note: "Selected details only. Some project specifics are omitted."
    },
    detailPage: {
      showHeroImage: true,
      showMetaStrip: true,
      showMetrics: true,
      showGallery: false,
      showPdfEmbed: false,
      showVideo: false,
      showOutcomeStrip: true
    }
  },

  {
    id: "media-framing-sentiment-pipeline",
    slug: "media-framing-sentiment-pipeline",
    title: "Media Framing & Sentiment Transformation Pipeline",
    oneLiner:
      "A pipeline for converting unstructured media into structured framing and sentiment representations.",
    summary:
      "I’m building a research-oriented transformation pipeline that combines classical NLP and LLM-based approaches to analyze sentiment, framing, and robustness across media inputs, with a focus on evaluation quality and bias awareness.",
    section: "work",
    visibility: "public",
    entryType: "research",
    role: "Builder / Researcher",
    contributionTag: "In Progress",
    meta: {
      org: "Personal / Academic",
      teamType: "solo",
      year: "2026",
      sortDate: "2026-03-01",
      dateRange: "Mar 2026 – Present"
    },
    metaStrip: {
      roleValue: "Builder / Researcher",
      timelineValue: "Mar 2026 – Present",
      teamValue: "Solo project",
      focusValue: ["NLP pipelines", "LLM evaluation", "Bias analysis", "Structured outputs"]
    },
    categories: ["AI Systems", "Research", "NLP"],
    tech: ["Python", "NLP", "LLMs", "Evaluation"],
    tags: ["LLM Evaluation", "Bias", "Robustness"],
    featured: false,
    priority: 10,
    cardSize: "md",
    status: "In Progress",
    caseStudyDepth: "light",
    visible: true,
    themeKey: "AI",
    thumbnail: "/images/projects/media-framing-sentiment-pipeline/thumbnail.jpg",
    coverImage: "/images/projects/media-framing-sentiment-pipeline/cover.jpg",
    highlights: [
      "Building a pipeline that transforms unstructured media into structured representations.",
      "Comparing classical NLP and LLM-based approaches.",
      "Evaluating outputs for robustness, bias, and significance."
    ],
    detailPage: {
      showHeroImage: true,
      showMetaStrip: true,
      showMetrics: false,
      showGallery: false,
      showPdfEmbed: false,
      showVideo: false,
      showOutcomeStrip: false
    }
  },

  {
    id: "ai-assisted-portfolio-platform",
    slug: "ai-assisted-portfolio-platform",
    title: "AI-Assisted Portfolio Platform",
    oneLiner:
      "A modular personal site built with AI coding tools, then restructured into a scalable frontend system.",
    summary:
      "I’m building my portfolio as both a design surface and a systems exercise, using AI coding assistants to accelerate exploration while manually restructuring the output into reusable components, cleaner architecture, and more intentional interaction patterns.",
    section: "experiments",
    visibility: "public",
    entryType: "experiment",
    role: "Designer / Developer",
    contributionTag: "Meta Build",
    meta: {
      org: "Personal",
      teamType: "solo",
      year: "2026",
      sortDate: "2026-03-01",
      dateRange: "Dec 2025 – Present"
    },
    metaStrip: {
      roleValue: "Designer / Developer",
      timelineValue: "Dec 2025 – Present",
      teamValue: "Solo project",
      focusValue: ["Design systems", "AI-assisted coding", "Frontend architecture", "Interaction polish"]
    },
    categories: ["Engineering", "Interaction Design"],
    tech: ["Next.js", "React", "TypeScript", "Tailwind", "Framer Motion"],
    tags: ["Meta", "Portfolio", "AI-assisted build"],
    featured: true,
    priority: 1,
    cardSize: "lg",
    status: "In Progress",
    caseStudyDepth: "light",
    visible: true,
    themeKey: "Editorial",
    thumbnail: "/images/projects/ai-assisted-portfolio-platform/thumbnail.jpg",
    coverImage: "/images/projects/ai-assisted-portfolio-platform/cover.jpg",
    highlights: [
      "Used AI coding tools to accelerate prototyping and iteration.",
      "Refactored generated code into reusable components and a modular architecture.",
      "Resolved consistency and maintainability issues across responsive layouts."
    ],
    detailPage: {
      showHeroImage: true,
      showMetaStrip: true,
      showMetrics: false,
      showGallery: true,
      showPdfEmbed: false,
      showVideo: false,
      showOutcomeStrip: false
    }
  },

  {
    id: "trailtales",
    slug: "trailtales-local-discovery-app",
    title: "TrailTales",
    oneLiner:
      "A local discovery app designed to surface non-touristy experiences through map-based exploration.",
    summary:
      "I designed and built a cross-platform mobile application for local experience discovery, using feedback from beta users to refine navigation, clustering, and the relevance of recommendations.",
    section: "experiments",
    visibility: "public",
    entryType: "project",
    role: "Designer / Developer",
    contributionTag: "Mobile Product",
    meta: {
      org: "National University of Singapore",
      teamType: "team",
      year: "2020",
      sortDate: "2020-08-01",
      dateRange: "May 2020 – Aug 2020",
      location: "Singapore"
    },
    metaStrip: {
      roleValue: "Designer / Developer",
      timelineValue: "May 2020 – Aug 2020",
      teamValue: "Team project",
      focusValue: ["Mobile UX", "Maps", "Recommendation flows", "User feedback"]
    },
    categories: ["Interaction Design", "Mobile", "Research"],
    tech: ["Flutter", "Firebase", "Google Maps API", "Figma", "Dart"],
    tags: ["Mobile App", "Maps", "Discovery"],
    featured: true,
    priority: 2,
    cardSize: "md",
    status: "Prototype",
    caseStudyDepth: "light",
    visible: true,
    themeKey: "Mobile",
    thumbnail: "/images/projects/trailtales/thumbnail.jpg",
    coverImage: "/images/projects/trailtales/cover.jpg",
    highlights: [
      "Built an end-to-end local discovery app with map-based browsing.",
      "Collected qualitative feedback from 20+ beta users.",
      "Refined navigation and clustering to improve discoverability."
    ],
    metrics: [{ label: "Beta users", value: "20+" }],
    detailPage: {
      showHeroImage: true,
      showMetaStrip: true,
      showMetrics: true,
      showGallery: true,
      showPdfEmbed: false,
      showVideo: false,
      showOutcomeStrip: false
    }
  },

  {
    id: "pico-game-jam-vr-flight-game",
    slug: "pico-game-jam-vr-flight-game",
    title: "Pico Game Jam — VR Flight Game",
    oneLiner:
      "A VR game prototype using arm-flapping locomotion and physics-based flight mechanics.",
    summary:
      "Built during a game jam, this project explored playful embodied locomotion in VR by mapping controller motion to flight behavior and tuning the resulting physics for stability and control.",
    section: "experiments",
    visibility: "public",
    entryType: "hackathon",
    role: "XR Developer",
    contributionTag: "Game Jam",
    meta: {
      org: "Game Jam",
      teamType: "team",
      year: "2023",
      sortDate: "2023-05-01",
      dateRange: "May 2023 – May 2023"
    },
    metaStrip: {
      roleValue: "XR Developer",
      timelineValue: "May 2023",
      teamValue: "Jam team",
      focusValue: ["VR locomotion", "Physics tuning", "Real-time input", "Embodied play"]
    },
    categories: ["XR / Spatial", "Game Design", "Engineering"],
    tech: ["Unity", "Pico XR SDK", "C#"],
    tags: ["VR", "Locomotion", "Jam"],
    featured: false,
    priority: 3,
    cardSize: "sm",
    status: "Prototype",
    caseStudyDepth: "light",
    visible: true,
    themeKey: "XR",
    thumbnail: "/images/projects/pico-game-jam-vr-flight-game/thumbnail.jpg",
    coverImage: "/images/projects/pico-game-jam-vr-flight-game/cover.jpg",
    highlights: [
      "Built and deployed a VR game to Pico 3.",
      "Mapped controller motion to arm-flapping flight mechanics.",
      "Handled real-time physics interactions for stable mid-air control."
    ],
    detailPage: {
      showHeroImage: true,
      showMetaStrip: true,
      showMetrics: false,
      showGallery: true,
      showPdfEmbed: false,
      showVideo: false,
      showOutcomeStrip: false
    }
  },

  {
    id: "intronus",
    slug: "intronus-interaction-design-project",
    title: "IntroNUS",
    oneLiner:
      "An interaction design concept shaped through user requirements, prototyping, and usability testing.",
    summary:
      "I designed this product concept through the full interaction design cycle, from requirement analysis and task flows to prototyping, usability testing, and iteration around navigation complexity and hierarchy.",
    section: "experiments",
    visibility: "public",
    entryType: "course",
    role: "Interaction Designer",
    contributionTag: "UX Concept",
    meta: {
      org: "National University of Singapore",
      teamType: "team",
      year: "2022",
      sortDate: "2022-10-01",
      dateRange: "Sep 2022 – Oct 2022"
    },
    metaStrip: {
      roleValue: "Interaction Designer",
      timelineValue: "Sep 2022 – Oct 2022",
      teamValue: "Team project",
      focusValue: ["Task flows", "Usability testing", "Hierarchy refinement", "Prototype iteration"]
    },
    categories: ["Interaction Design", "Research", "Product Design"],
    tech: ["Figma", "User Research", "Prototyping", "Usability Testing"],
    tags: ["UX", "Concept"],
    featured: false,
    priority: 4,
    cardSize: "sm",
    status: "Prototype",
    caseStudyDepth: "light",
    visible: true,
    themeKey: "Research",
    thumbnail: "/images/projects/intronus/thumbnail.jpg",
    coverImage: "/images/projects/intronus/cover.jpg",
    pdf: {
      embedUrl: "/pdfs/intronus.pdf",
      downloadUrl: "/pdfs/intronus.pdf",
      title: "Project deck"
    },
    highlights: [
      "Developed personas and task flows to ground design decisions.",
      "Conducted usability testing to identify navigation complexity.",
      "Refined information hierarchy based on feedback."
    ],
    detailPage: {
      showHeroImage: true,
      showMetaStrip: true,
      showMetrics: false,
      showGallery: true,
      showPdfEmbed: true,
      showVideo: false,
      showOutcomeStrip: false
    }
  }
];

export const workProjects = projects
  .filter((project) => project.section === "work" && project.visible)
  .sort((a, b) => a.priority - b.priority);

export const experimentProjects = projects
  .filter((project) => project.section === "experiments" && project.visible)
  .sort((a, b) => a.priority - b.priority);

export const featuredWorkProjects = workProjects.filter((project) => project.featured);
export const featuredExperimentProjects = experimentProjects.filter((project) => project.featured);

const homeFeaturedProjectSlugs = [
  "loreal-ml-planning-suite",
  "shoot-it-ar-laser-tag-system",
  "revamping-shopeepay"
] as const;

const byPriority = (a: Project, b: Project) => a.priority - b.priority;

const projectBySlug = new Map(projects.map((project) => [project.slug, project] as const));

export const getProjectBySlug = (slug: string): Project | undefined => projectBySlug.get(slug);

export const getProjectDestinationHref = (project: Project): string => {
  const internalLink = project.links?.find((link) => link.kind === "internal")?.href;
  if (internalLink) {
    return internalLink;
  }

  return project.section === "work" ? "/work" : "/experiments";
};

export const getProjectThumbnailSrc = (project: Project): string =>
  project.thumbnail ?? PROJECT_PLACEHOLDER_THUMBNAIL;

export const getProjectCoverSrc = (project: Project): string =>
  project.coverImage ?? project.thumbnail ?? PROJECT_PLACEHOLDER_COVER;

export const getProjectGallery = (project: Project) => project.gallery ?? [];

export const hasProjectPdf = (project: Project): boolean => Boolean(project.pdf?.embedUrl);

export const hasProjectVideo = (project: Project): boolean => Boolean(project.video?.src);

export const getProjectsBySection = (section: ProjectSection): Project[] =>
  projects.filter((project) => project.section === section).sort(byPriority);

export const getVisibleProjectsBySection = (section: ProjectSection): Project[] =>
  projects.filter((project) => project.section === section && project.visible).sort(byPriority);

export const getFeaturedProjectsBySection = (section: ProjectSection): Project[] =>
  projects
    .filter((project) => project.section === section && project.visible && project.featured)
    .sort(byPriority);

export const getHomeFeaturedProjects = (): Project[] => {
  const bySlug = new Map(workProjects.map((project) => [project.slug, project] as const));

  return homeFeaturedProjectSlugs
    .map((slug) => bySlug.get(slug))
    .filter((project): project is Project => Boolean(project));
};

export const getVisibleProjects = (): Project[] =>
  projects.filter((project) => project.visible).sort(byPriority);

export const getProjectsByCategory = (category: ProjectCategory): Project[] =>
  projects.filter((project) => project.visible && project.categories.includes(category)).sort(byPriority);

export const getProjectsByTag = (tag: string): Project[] =>
  projects
    .filter((project) => project.visible && project.tags?.some((projectTag) => projectTag === tag))
    .sort(byPriority);

export const getProjectSlugs = (section?: ProjectSection): string[] =>
  (section ? getProjectsBySection(section) : projects).map((project) => project.slug);

export const getCategoryCounts = (section?: ProjectSection): Partial<Record<ProjectCategory, number>> => {
  const source = section ? getProjectsBySection(section) : projects;

  return source.reduce<Partial<Record<ProjectCategory, number>>>((acc, project) => {
    project.categories.forEach((category) => {
      acc[category] = (acc[category] ?? 0) + 1;
    });

    return acc;
  }, {});
};
