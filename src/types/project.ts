export type ProjectSection = "work" | "experiments";

export type ProjectVisibility = "public" | "confidential-summary";

export type ProjectEntryType =
  | "professional"
  | "research"
  | "project"
  | "experiment"
  | "course"
  | "hackathon";

export type ProjectCategory =
  | "AI Systems"
  | "Interaction Design"
  | "XR / Spatial"
  | "Research"
  | "Engineering"
  | "Accessibility"
  | "Digital Wellbeing"
  | "Mobile"
  | "Data"
  | "NLP"
  | "Game Design"
  | "Mobile AR"
  | "Analytics"
  | "Product Design";

export type ProjectStatus =
  | "Case Study"
  | "Prototype"
  | "In Progress"
  | "Live"
  | "Shipped"
  | "Handed Off";

export type ProjectCardSize = "sm" | "md" | "lg" | "xl";

export type CaseStudyDepth = "full" | "medium" | "light" | "none";

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectLink {
  label: string;
  href: string;
  kind: "internal" | "external";
}

export interface ProjectPdf {
  embedUrl: string;
  downloadUrl?: string;
  title?: string;
}

export interface ProjectImage {
  src: string;
  alt: string;
  kind?: "cover" | "gallery" | "thumbnail";
}

export interface ProjectVideo {
  src: string;
  poster?: string;
  title?: string;
}

export interface ProjectNDA {
  isRestricted: boolean;
  visibility: "summary-only" | "private-walkthrough";
  note?: string;
}

export interface ProjectMeta {
  org?: string;
  team?: string[];
  teamType?: "solo" | "team";
  year: string;
  sortDate: string;
  dateRange: string;
  location?: string;
}

export interface ProjectMetaStrip {
  roleValue: string;
  timelineValue: string;
  teamValue: string;
  focusValue: string[];
}

export interface ProjectTeamMember {
  name?: string;
  role: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  oneLiner: string;
  summary: string;

  section: ProjectSection;
  visibility: ProjectVisibility;
  entryType: ProjectEntryType;

  role: string;
  contributionTag?: string;

  meta: ProjectMeta;
  metaStrip?: ProjectMetaStrip;
  teamMembers?: ProjectTeamMember[];

  categories: ProjectCategory[];
  tech: string[];
  tags?: string[];

  featured: boolean;
  priority: number;
  cardSize: ProjectCardSize;
  status: ProjectStatus;
  caseStudyDepth: CaseStudyDepth;
  visible: boolean;

  themeKey?: "AI" | "XR" | "Research" | "Data" | "Web" | "Mobile" | "Editorial";

  thumbnail?: string;
  coverImage?: string;
  gallery?: ProjectImage[];
  pdf?: ProjectPdf;
  video?: ProjectVideo;

  highlights?: string[];
  metrics?: ProjectMetric[];
  links?: ProjectLink[];

  nda?: ProjectNDA;

  detailPage?: {
    showHeroImage?: boolean;
    showMetaStrip?: boolean;
    showMetrics?: boolean;
    showGallery?: boolean;
    showPdfEmbed?: boolean;
    showVideo?: boolean;
    showOutcomeStrip?: boolean;
  };
}