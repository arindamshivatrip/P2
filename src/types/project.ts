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
  | "Completed"
  | "Live"
  | "Shipped"
  | "Handed Off";

export type ProjectCardSize = "sm" | "md" | "lg" | "xl";
export type ProjectTileMediaAspect = "default" | "widescreen-16-9";

export type CaseStudyDepth = "full" | "medium" | "light" | "none";
export type ExperimentDetailTemplate = "structured" | "legacy";

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

// A numbered figure on the work detail page: short caption under the media,
// optional longer explanation as body text right after it.
export interface ProjectFigure {
  kind: "image" | "video";
  src: string;
  alt: string;
  poster?: string;
  caption: string;
  description?: string;
}

// Animated brand tile used when a project has no cover or video. `motion`
// picks the scene so tiles don't all move alike: "zoom" (mark grows in the
// centre), "scan" (laser sweep reveals the mark), "android-walk" (Android robot
// walks in and the wordmark follows), "aura-desk" (glowing title with the robot
// as a corner badge), "dashboard" (pastel chart cards behind the wordmark),
// "diary-clusters" (phone moments become diary cards that sort into clusters),
// "laser-tag" (aim, fire, MQTT sync, hit and haptic ripple) and "ab-race" (two
// layouts run the same payment task side by side; the revised one wins).
// Without `src` the wordmark text stands in; the last three scenes draw their
// own title from `wordmark`.
export interface ProjectLogoTile {
  motion?:
    | "zoom"
    | "scan"
    | "android-walk"
    | "aura-desk"
    | "dashboard"
    | "diary-clusters"
    | "laser-tag"
    | "ab-race";
  src?: string;
  alt: string;
  wordmark: string;
  background: string;
  foreground?: string;
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

export interface ProjectDetailMetadata {
  role: string;
  team: string;
  timeline: string;
  skills: string[];
}

export type ProjectDetailSectionType =
  | "text"
  | "text-bullets"
  | "split-media"
  | "media"
  | "quote"
  | "reflection";

export type ProjectDetailSectionLayout = "default" | "media-left" | "media-right" | "wide";

export interface ProjectDetailSectionMedia {
  kind: "image" | "video";
  src: string;
  alt?: string;
  poster?: string;
  title?: string;
  width?: number;
  height?: number;
}

export interface ProjectDetailSectionInlineMedia {
  afterParagraph: number;
  media: ProjectDetailSectionMedia;
  secondaryMedia?: ProjectDetailSectionMedia;
  caption?: string;
  spacing?: "default" | "tight";
}

export interface ProjectDetailSection {
  id: string;
  title: string;
  type: ProjectDetailSectionType;
  body: string[];
  bullets?: string[];
  media?: ProjectDetailSectionMedia;
  caption?: string;
  layout?: ProjectDetailSectionLayout;
  inlineMedia?: ProjectDetailSectionInlineMedia[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  oneLiner: string;
  summary: string;

  section: ProjectSection;
  visibility: ProjectVisibility;
  entryType: ProjectEntryType;

  role: string;
  contributionTag?: string;
  projectTypeLine?: string;

  meta: ProjectMeta;
  metaStrip?: ProjectMetaStrip;
  teamMembers?: ProjectTeamMember[];

  categories: ProjectCategory[];
  tech: string[];
  tags?: string[];

  featured: boolean;
  // Set to show on the home page's Selected Work; lower comes first. Kept
  // separate from `featured` so home can be curated independently of /work.
  homeOrder?: number;
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
  // Edited, titled loop for home and /work previews; the detail page keeps
  // `video` as its clean hero.
  previewVideo?: ProjectVideo;
  // Captions the hero as Figure 1; `figures` then continue the numbering.
  heroCaption?: string;
  figures?: ProjectFigure[];
  figuresTitle?: string;
  // A second figure section (e.g. event photos); numbering continues on.
  photos?: ProjectFigure[];
  photosTitle?: string;
  tileMediaAspect?: ProjectTileMediaAspect;
  logoTile?: ProjectLogoTile;

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
  detailTemplate?: ExperimentDetailTemplate;
  detailMetadata?: ProjectDetailMetadata;
  detailSections?: ProjectDetailSection[];
  detailBrandMark?: {
    src: string;
    alt: string;
  };
}
