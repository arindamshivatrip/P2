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
    tileMediaAspect: "widescreen-16-9",
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
    id: "snapt",
    slug: "snapt",
    title: "SnaPT",
    subtitle: "Designing around friction in AI workflows",
    oneLiner: "Designing around friction in AI workflows",
    summary:
      "A browser extension for improving the performance and readability of long ChatGPT conversations.",
    section: "experiments",
    visibility: "public",
    entryType: "experiment",
    role: "Builder, UX Engineer",
    contributionTag: "Personal Project",
    projectTypeLine: "Chrome Extension • Personal Project",
    meta: {
      org: "Personal",
      teamType: "solo",
      year: "2026",
      sortDate: "2026-04-01",
      dateRange: "Weekend in April 2026"
    },
    metaStrip: {
      roleValue: "Builder, UX Engineer",
      timelineValue: "Weekend in April 2026",
      teamValue: "1 person",
      focusValue: [
        "Browser engineering",
        "Interaction design",
        "Prompt-assisted coding",
        "Privacy / store-readiness"
      ]
    },
    categories: ["Engineering", "Interaction Design"],
    tech: [
      "Browser engineering",
      "Interaction design",
      "Prompt-assisted coding",
      "Privacy / store-readiness"
    ],
    tags: ["Chrome Extension", "Personal Project", "AI workflow"],
    featured: true,
    priority: 1,
    cardSize: "lg",
    status: "Completed",
    caseStudyDepth: "light",
    visible: true,
    themeKey: "Web",
    thumbnail: PROJECT_PLACEHOLDER_THUMBNAIL,
    coverImage: PROJECT_PLACEHOLDER_COVER,
    video: {
      src: "/videos/experiments/snapt/snapt-thumb.mp4",
      title: "SnaPT hero preview"
    },
    links: [
      {
        label: "View on Chrome Web Store",
        href: "https://chromewebstore.google.com/detail/snapt-chatgpt-chat-optimi/dcgfnddkkikbpicaomnaddfgleakcjci?hl=en&authuser=2&pageId=none",
        kind: "external"
      }
    ],
    tileMediaAspect: "widescreen-16-9",
    highlights: [
      "Focused on reducing friction in long AI chat workflows.",
      "Improved readability and perceived performance in extended ChatGPT sessions."
    ],
    detailPage: {
      showHeroImage: true,
      showMetaStrip: true,
      showMetrics: false,
      showGallery: false,
      showPdfEmbed: false,
      showVideo: false,
      showOutcomeStrip: false
    },
    detailTemplate: "structured",
    detailMetadata: {
      role: "Builder, UX Engineer",
      team: "1 person",
      timeline: "Weekend in April 2026",
      skills: [
        "Browser engineering",
        "Interaction design",
        "Prompt-assisted coding",
        "Privacy / store-readiness"
      ]
    },
    detailSections: [
      {
        id: "overview",
        title: "Overview",
        type: "text",
        body: [
          "SnaPT is a project born out of personal frustration. The longer I used ChatGPT for real work, the more obvious a specific issue became: the interface got slow and laggy right as the conversation became richer in context and history.",
          "While fresh chats felt snappy, long working threads with multiple exchanges lagged and chugged along in a way that was not becoming of a $852 billion valuation firm.",
          "This issue annoyed me enough that, over a weekend in April, I decided to solve it myself.",
          "What started as a performance fix quickly turned into a broader systems and product problem involving systems design, performance optimization, interaction design, prototyping, privacy constraints, and the quagmire of getting something onto the Chrome Web Store."
        ]
      },
      {
        id: "problem-motivation",
        title: "Problem & Motivation",
        type: "text",
        body: [
          "The cause of this issue comes down to how the browser renders threads. Long ChatGPT conversations accumulate state. More messages mean more DOM nodes, with DOM standing for Document Object Model, the browser's internal representation of everything visible on the page. They also mean heavier payloads and more for the browser to process and maintain.",
          "What that looks like in practice is typing lag, sluggish scrolling, and slower response rendering. The interface gets heavier as the conversation gets longer. This is not really a device issue either. It happens whether you are running ChatGPT on a souped-up RTX 5090 desktop or on a potato.",
          "The obvious solution sounds simple: just start a new chat. The problem is that doing that means abandoning context, which defeats the entire point of using ChatGPT as a running work surface for projects that actually depend on that context. The more useful the conversation becomes, the worse the tool gets at supporting it.",
          "While trying to understand why this lag happened, I found an existing extension that addressed the issue. Unfortunately, after a 7-day free trial, it asked for money. That was the point where I stopped looking for a solution and decided to build one myself. With AI coding tools and my own experience building things, the project stopped being a complaint and became a reverse-engineering exercise."
        ],
        inlineMedia: [
          {
            afterParagraph: 2,
            spacing: "tight",
            media: {
              kind: "image",
              src: "/images/experiments/snapt/thread-controls.png",
              alt: "Long thread with older turns pushed out of the live surface",
              width: 1726,
              height: 151
            },
            caption: "A long thread, with older turns pushed out of the live surface."
          }
        ]
      },
      {
        id: "design-requirements",
        title: "Design Requirements",
        type: "text-bullets",
        body: [
          "The scope of this project was to make long reasoning threads usable again without throwing away the context that made them valuable in the first place.",
          "Any workable solution had to satisfy four conditions:"
        ],
        bullets: [
          "reduce the amount of conversation state the live thread had to carry",
          "preserve the recent working context",
          "keep older history recoverable on demand",
          "maintain enough conversational continuity that the chat still felt alive"
        ]
      },
      {
        id: "research",
        title: "Research",
        type: "text",
        body: [
          "I started by trying to understand where the slowdown was actually coming from, because that would decide what kind of solution was even worth building.",
          "There were two real approaches to investigate. The first was hiding already rendered content from the DOM. The second was reducing what the page had to render in the first place by intercepting conversation data before it reached the browser.",
          "On the surface, those approaches looked pretty similar. In practice, they behaved very differently.",
          "DOM-only hiding reduced visual clutter, but render times stayed the same and the lag while typing remained.",
          "Pre-render trimming, intercepting ChatGPT's conversation JSON responses and stripping older turns before the page processed them, produced a genuinely lighter working set. That made it clear that this was the solution space worth building in."
        ]
      },
      {
        id: "exploring-the-solution-space",
        title: "Exploring the Solution Space",
        type: "text",
        body: [
          "Once that distinction was clear, the solution space narrowed quickly. DOM-only trimming stayed in the build as a fallback because it was simple and visually useful, but it did not meaningfully improve performance.",
          "Pre-render payload trimming became the real direction.",
          "That choice only worked with cached retrieval. Trimming older turns without a way to bring them back would have meant losing context, which would have solved the lag while damaging the product experience.",
          "Cached recovery made aggressive trimming viable while still letting users pull older turns back on demand.",
          "Once this architecture was in place, the problem shifted from figuring out the architecture to balancing the compromises: how much to trim, how much recent context to preserve, and how to keep the extension fast without killing the flow of the chats and omitting too much."
        ]
      },
      {
        id: "prototyping-testing",
        title: "Prototyping and Testing",
        type: "text",
        body: [
          "By this point, with the architecture locked in, the work shifted to iterating on the experience until it felt like something worth releasing. Some versions improved performance but made the conversation feel dead. Some preserved more context but brought the lag back. Some fixed a local problem and created a worse one somewhere else.",
          "**Phase 1: Make the extension real**",
          "The first hurdle was getting a local extension to reliably attach to ChatGPT conversation pages and do anything useful. This phase established that the problem was real, that the extension needed better observability, and that shallow fixes would not be enough.",
          "**Phase 2: Find the real performance lever**",
          "Early DOM-only trimming made the page look cleaner but barely changed the experience. The breakthrough came from trimming the conversation payload before the page rendered it. The difference was not subtle. DOM-trimmed versions changed the page. Payload-trimmed versions changed the feel.",
          "**Phase 3: Fix the mental model**",
          "Once pre-render trimming worked, the next problem was semantics. Counting visible messages as turns made the feature behave in ways that did not match how users think about conversations. Switching to user-anchored grouped turns, one user message plus all following assistant content until the next user message, fixed the logic. It also rippled through every part of the extension: keep counts, trim thresholds, load-previous behavior, cached counts, and the top bar numbers all had to be rebuilt around the new unit.",
          "**Phase 4: Make recovery and recent context usable**",
          "Older turns needed to come back as readable conversation, not as a dump of fragments. Early cached-history versions failed exactly that test. At the same time, aggressive trimming made the live thread feel too compressed. This phase was about making cached retrieval coherent and figuring out how much recent assistant activity to preserve in the live view without reintroducing lag. Getting thinking blocks right was the hardest part of this phase. Some versions dropped them entirely. Some surfaced only timer stubs like 'Thought for 1m 23s' because the cleanup logic caught simple duration formats but missed longer ones. The fix was treating thinking as structured assistant-side content inside a turn rather than whatever matched a text pattern.",
          "**Phase 5: Turn it into a product**",
          "DThe later iterations focused on fit and finish. The popup moved away from a dev-utility aesthetic toward a calmer, cleaner surface with advanced options tucked behind a disclosure. Several technically valid but experientially wrong ideas got cut. The clearest example was a version that fixed a cached panel layout issue by turning it into a bounded internal scroll widget with its own nested control bar. It solved the local problem and made the extension feel like a mini-app bolted inside ChatGPT. It got pulled immediately. By the end of this phase, the extension had finally started feeling like a shippable product."
        ],
        inlineMedia: [
          {
            afterParagraph: 11,
            media: {
              kind: "image",
              src: "/images/experiments/snapt/popup-dev.png",
              alt: "Older dev-utility popup"
            },
            secondaryMedia: {
              kind: "image",
              src: "/images/experiments/snapt/popup-productized.png",
              alt: "Later productized popup"
            },
            caption: "The popup went from debug-heavy utility to a narrower, more trustable control surface."
          }
        ]
      },
      {
        id: "the-actual-solution",
        title: "The Actual Solution",
        type: "text",
        body: [
          "SnaPT is built around one core idea: reduce what the page has to carry in the live thread without throwing away the value of the conversation.",
          "For the user, the experience is simple. They open the popup, decide how many recent turns should stay live, choose when trimming should begin, and reload the thread. After that, the extension gets out of the way. The recent working context stays visible, the older turns move into a recoverable cache, and the chat just feels lighter and responsive.",
          "The core mechanism is trimming conversational nodes and caching them for later viewing. The extension intercepts ChatGPT's conversation JSON response and strips older turns before the browser has to process and render them. Once the conversation response is intercepted, the extension groups the content into user-anchored turns. One turn is one user message plus all following assistant content until the next user message. That grouped-turn model drives everything: how many turns stay live, when trimming kicks in, how older turns get counted and retrieved. The live thread keeps only the most recent set of turns. Older ones go into a local cache.",
          "The live thread and the cached messages are designed by slightly different paradigms. Live texts are optimized for speed. They stay lean, keeping just enough assistant activity in the newest turns to make the conversation feel alive without making the payload heavy again. Cached texts, on the other hand, are optimized for readability. When the user pulls older context back, it comes back as structured conversation: user message, optional intermediate assistant activity, final assistant reply. The goal is for cached context to feel like part of the same thread, not like an archive dumped onto the page.",
          "The hard boundaries are also worth highlighting. The extension works only on ChatGPT. It stores settings locally and handles conversation content only to perform trimming and cached retrieval. It does not collect data, load remote code, or operate outside the domains it declares."
        ],
        inlineMedia: [
          {
            afterParagraph: 2,
            media: {
              kind: "image",
              src: "/images/experiments/snapt/grouped-flow.png",
              alt: "SnaPT trim and recovery architecture flow",
              width: 4623,
              height: 828
            },
            caption: "SnaPT trims the live working set and moves older turns into a recoverable layer."
          },
          {
            afterParagraph: 4,
            media: {
              kind: "video",
              src: "/videos/experiments/snapt/snapt-recovered-context.mp4",
              title: "Recovered cached chat turns in motion"
            },
            caption: "Recovered turns were designed to feel like part of the same conversation, not a detached archive."
          }
        ]
      },
      {
        id: "design-decisions",
        title: "Design Decisions",
        type: "text",
        body: [
          "While I have gone over the technical decisions I made during this project, here I explain the reasoning behind my judgment calls.",
          "**Selective fidelity** ",
          "The live thread cannot preserve everything equally and stay fast. The decision was to preserve more thinking context in the newest turns, where the user is actively working, and less in older un-cached turns, where readability matters less than responsiveness. That principle, selective fidelity, became the organizing idea behind how the chat payload was structured. It meant consciously accepting that some conversational texture would be lost in older live turns. That tradeoff was worth it because a live thread that felt dead defeated the whole point.",
          "**Accepting that perfect optimization does not exist** ",
          "Some of the worst versions of this extension came from trying to make the live thread both maximally complete and maximally fast at the same time. Once I stopped treating that as a solvable problem, the decisions got cleaner. The goal shifted from preserving everything to preserving what mattered most in the right place. That reframe is what made selective fidelity possible as a principle rather than just a compromise.",
          "**Permissions as a product decision** ",
          "Scoping the extension to ChatGPT only, keeping settings local, and removing permissions that looked redundant were product decisions born out of privacy concerns. The extension handles conversation content because trimming requires it. Being precise and narrow about that scope made the privacy story easy to explain and easy to trust. Permissions are part of the interface. A broad and invasive list of permissions makes a product feel untrustworthy regardless of how well it works.",
          "**Visual design as a trust signal** ",
          "The extension's final look drew heavily from Material 3: flat surfaces, clear hierarchy, intentional spacing, and a system that worked across light, dark, and system appearance modes. While early versions leaned into glass, gradients, and layered cards in a bid to look impressive, they lacked finesse and were cluttered. Material 3's philosophy of calm, surface-first design pushed the design toward something that felt more like a focused utility and less like a coding experiment. Fewer layers, less ornamentation, and tighter information hierarchy made the extension easier to read and easier to trust at a glance."
        ]
      },
      {
        id: "reflection",
        title: "Reflection",
        type: "reflection",
        body: [
          "The thing that surprised me most about this project was how quickly it stopped being a performance problem. I expected to spend a lot of time on the technical solution to figure out how to do the trim, but that did not take too long. The more interesting questions became things like: what counts as one turn, how much recent context feels like enough, and what makes recovered history readable instead of merely available. Those questions did not have clean technical answers and required judgment calls based on UX, and those compromises were the hardest part.",
          "Building SnaPT with AI assistance made that even clearer. AI helped me move fast and break things. Zuckerberg would be proud. It made it much easier to inspect different approaches, rewrite logic, debug edge cases, and keep momentum over a lot of iterations. It lowered the cost of trying things. What it did not do was tell me which of those things were actually good. It could help me build faster, but it could not tell me when a solution felt wrong, when a fix solved the wrong problem, or when a version had technically improved and experientially regressed. That part still depended on judgment. If anything, using AI made that more obvious.",
          "Another thing this project made clearer to me is that as AI makes building easier, UX becomes even more important. The differentiator has shifted from whether it works to whether it feels coherent, intuitive, and convenient. It also makes first-mover advantage a little less advantageous. If you ship something early, you risk a copycat doing your whole thing better than you do. Except instead of it taking months, it could be done over a weekend.",
          "For future iterations, I want to look beyond just SnaPT. I can envision a small family of workflow extensions around the same kind of user behavior: exporting chats more cleanly, saving and inserting commonly used prompts, and reducing repetitive friction around context management. What interests me there is not building a giant toolkit for the sake of it. It is that these problems sit very close to real human behavior and frustrations. I like noticing those patterns and fixing them, partly because they matter, and partly for the love of the game.",
          "That is probably the cleanest takeaway from SnaPT. It is a small project, but it taught me something big. AI can make building faster. It does not make judgment less important. If anything, it raises the value of it. The part of building I care about most is still the same: figuring out what should exist, how it should behave, and why it should feel good to use."
        ]
      }
    ]
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
    },
    detailTemplate: "legacy"
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
    },
    detailTemplate: "legacy"
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
    },
    detailTemplate: "legacy"
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
    },
    detailTemplate: "legacy"
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

export const getExperimentDetailHref = (slug: string): string => `/experiments/${slug}`;
export const getWorkDetailHref = (slug: string): string => `/work/${slug}`;

export const getProjectDestinationHref = (project: Project): string => {
  const internalLink = project.links?.find((link) => link.kind === "internal")?.href;
  if (internalLink) {
    return internalLink;
  }

  if (project.section === "experiments") {
    return getExperimentDetailHref(project.slug);
  }

  if (project.section === "work") {
    return getWorkDetailHref(project.slug);
  }

  return "/";
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


