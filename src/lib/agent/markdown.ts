import { aboutJourney, aboutDomainReveals } from "@/data/about";
import { contactContent } from "@/data/contact";
import { cvPageContent, cvVersions } from "@/data/cv";
import { footerContent, heroContent } from "@/data/home";
import {
  experimentProjects,
  getExperimentDetailHref,
  getHomeFeaturedProjects,
  getProjectBySlug,
  getWorkDetailHref,
  workProjects
} from "@/data/projects";
import { siteMeta } from "@/data/site";
import type { Project, ProjectSection } from "@/types/project";

/**
 * Markdown views of the site for agents. The middleware serves these when a
 * request's Accept header prefers text/markdown; browsers keep getting HTML.
 * Everything is built from the same data modules the pages render, so the two
 * never drift apart.
 */

export const MARKDOWN_CONTENT_TYPE = "text/markdown; charset=utf-8";

const base = siteMeta.url.replace(/\/$/, "");
const abs = (path: string): string => (path.startsWith("http") ? path : `${base}${path}`);

// Routes that exist as HTML pages but have no Markdown view (interactive or
// utility pages). Agents asking for Markdown here still get the HTML page
// rather than a false 404. Every page under src/app must be either rendered
// below or listed here; agent-markdown.test.ts enforces that.
export const HTML_ONLY_ROUTES = ["/messages", "/privacy-policy", "/my_card", "/mobile_card"];

/** True when the Accept header explicitly asks for Markdown at least as much as HTML. */
export function prefersMarkdown(accept: string | null | undefined): boolean {
  if (!accept) return false;

  let markdownQ = 0;
  let htmlQ = 0;
  for (const part of accept.split(",")) {
    const [rawType, ...params] = part.trim().split(";");
    const type = rawType.trim().toLowerCase();
    const qParam = params.map((p) => p.trim()).find((p) => p.toLowerCase().startsWith("q="));
    const q = qParam ? Number.parseFloat(qParam.slice(2)) : 1;
    if (!Number.isFinite(q)) continue;
    if (type === "text/markdown" || type === "text/x-markdown") markdownQ = Math.max(markdownQ, q);
    if (type === "text/html" || type === "application/xhtml+xml") htmlQ = Math.max(htmlQ, q);
  }

  return markdownQ > 0 && markdownQ >= htmlQ;
}

export type MarkdownResult = { status: 200 | 404; body: string };

/**
 * Markdown for a path: 200 with the page, 404 with an agent-readable error, or
 * null when the path is an HTML-only page that should be served as usual.
 */
export function renderMarkdownForPath(pathname: string): MarkdownResult | null {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  if (HTML_ONLY_ROUTES.includes(path)) return null;

  switch (path) {
    case "/":
      return ok(renderHome());
    case "/work":
      return ok(renderProjectIndex("work"));
    case "/experiments":
      return ok(renderProjectIndex("experiments"));
    case "/about":
      return ok(renderAbout());
    case "/contact":
      return ok(renderContact());
    case "/cv":
      return ok(renderCv());
  }

  const detail = /^\/(work|experiments)\/([^/]+)$/.exec(path);
  if (detail) {
    const project = getProjectBySlug(decodeURIComponent(detail[2]));
    if (project && project.visible && project.section === detail[1]) {
      return ok(renderProject(project));
    }
  }

  return { status: 404, body: renderNotFound(path) };
}

const ok = (body: string): MarkdownResult => ({ status: 200, body });

const join = (...blocks: (string | false | undefined | null)[]): string =>
  blocks.filter(Boolean).join("\n\n") + "\n";

const projectHref = (project: Project): string =>
  project.section === "experiments"
    ? getExperimentDetailHref(project.slug)
    : getWorkDetailHref(project.slug);

/** Absolute URL of a project's detail page. */
export const projectUrl = (project: Project): string => abs(projectHref(project));

const projectLine = (project: Project): string =>
  `- [${project.title}](${abs(projectHref(project))}): ${project.oneLiner}`;

const contactBlock = join(
  "## Contact",
  [
    `- Email: ${contactContent.methods[0].primaryLine} (fastest, usually a reply within a day)`,
    `- LinkedIn: ${siteMeta.sameAs[0]}`,
    `- GitHub: ${siteMeta.sameAs[1]}`,
    `- CV (PDF): ${abs(cvPageContent.primaryHref)}`
  ].join("\n")
).trimEnd();

export function renderHome(): string {
  return join(
    `# ${siteMeta.formalName}`,
    `> ${heroContent.supporting}`,
    heroContent.signal,
    `**Availability:** ${footerContent.availability}.`,
    "## Selected work",
    getHomeFeaturedProjects().map(projectLine).join("\n"),
    "## More",
    [
      `- [All work](${abs("/work")})`,
      `- [Experiments](${abs("/experiments")})`,
      `- [About](${abs("/about")})`,
      `- [CV](${abs("/cv")})`,
      `- [Contact](${abs("/contact")})`,
      `- [llms.txt](${abs("/llms.txt")}): agent guide to this site`
    ].join("\n"),
    contactBlock
  );
}

function renderProjectIndex(section: ProjectSection): string {
  const isWork = section === "work";
  const list = isWork ? workProjects : experimentProjects;
  return join(
    `# ${isWork ? "Work" : "Experiments"} — ${siteMeta.name}`,
    isWork
      ? "> Selected case studies across XR, data-driven product systems, UX research, and interactive engineering."
      : "> Smaller builds, coursework, hackathons, and prototypes.",
    list.map(projectLine).join("\n"),
    contactBlock
  );
}

export function renderProject(project: Project): string {
  const meta = [
    project.meta.org && `- Organization: ${project.meta.org}`,
    `- Role: ${project.role}`,
    `- Timeline: ${project.meta.dateRange}`,
    project.meta.location && `- Location: ${project.meta.location}`,
    `- Status: ${project.status}`,
    project.categories.length > 0 && `- Areas: ${project.categories.join(", ")}`,
    project.tech.length > 0 && `- Tech: ${project.tech.join(", ")}`
  ]
    .filter(Boolean)
    .join("\n");

  const sections = (project.detailSections ?? []).map((section) =>
    join(
      `## ${section.title}`,
      section.body.join("\n\n"),
      section.bullets?.map((bullet) => `- ${bullet}`).join("\n")
    ).trimEnd()
  );

  const externalLinks = (project.links ?? []).filter((link) => link.kind === "external");

  return join(
    `# ${project.title}`,
    project.subtitle,
    `> ${project.oneLiner}`,
    meta,
    project.summary,
    project.nda?.isRestricted &&
      `_Confidential work: this is a public summary.${project.nda.note ? ` ${project.nda.note}` : ""}_`,
    Boolean(project.highlights?.length) && join("## Highlights", project.highlights!.map((h) => `- ${h}`).join("\n")).trimEnd(),
    Boolean(project.metrics?.length) &&
      join("## Outcomes", project.metrics!.map((m) => `- ${m.label}: ${m.value}`).join("\n")).trimEnd(),
    ...sections,
    externalLinks.length > 0 &&
      join("## Links", externalLinks.map((link) => `- [${link.label}](${link.href})`).join("\n")).trimEnd(),
    `Full case study with media: ${abs(projectHref(project))}`,
    contactBlock
  );
}

export function renderAbout(): string {
  return join(
    `# About — ${siteMeta.formalName}`,
    `> ${siteMeta.description}`,
    "## Path",
    aboutJourney.chapters
      .map((chapter, i) => `- **${aboutJourney.stops[i]} — ${chapter.title}:** ${chapter.body}`)
      .join("\n"),
    "## Focus areas",
    [
      `- **XR and spatial computing:** ${aboutDomainReveals.xr}`,
      `- **Human-AI interaction:** ${aboutDomainReveals["human-ai"]}`,
      `- **Data-driven tools:** ${aboutDomainReveals["data-driven"]}`,
      `- **Accessibility:** ${aboutDomainReveals.accessibility}`
    ].join("\n"),
    contactBlock
  );
}

export function renderContact(): string {
  return join(
    `# Contact — ${siteMeta.formalName}`,
    `> ${contactContent.heading}`,
    contactContent.supporting,
    contactContent.personalLine,
    [
      `- Email: ${contactContent.methods[0].primaryLine} (backup: arindamtrip@gmail.com)`,
      `- LinkedIn: ${siteMeta.sameAs[0]}`,
      `- GitHub: ${siteMeta.sameAs[1]}`
    ].join("\n")
  );
}

export function renderCv(): string {
  return join(
    `# CV — ${siteMeta.formalName}`,
    `> ${cvPageContent.intro}`,
    cvPageContent.lastUpdated,
    "## Primary version",
    `- [${cvPageContent.primaryTitle}](${abs(cvPageContent.primaryHref)}): ${cvPageContent.primaryDescription}`,
    "## Other versions",
    cvVersions.map((v) => `- [${v.title}](${abs(v.href)}): ${v.description}`).join("\n"),
    contactBlock
  );
}

export function renderNotFound(path: string): string {
  return join(
    "# 404 — Page not found",
    `There is no page at \`${path}\` on ${base}.`,
    "Try one of these instead:",
    [
      `- [llms.txt](${abs("/llms.txt")}): guide to this site for agents`,
      `- [Sitemap](${abs("/sitemap.xml")}): every public page`,
      `- [Home](${abs("/")})`,
      `- [Work](${abs("/work")})`
    ].join("\n")
  );
}

/**
 * /llms.txt, following https://llmstxt.org: H1, blockquote summary, free-form
 * notes without headings, then H2 sections that are lists of links.
 */
export function renderLlmsTxt(): string {
  return join(
    `# ${siteMeta.formalName}`,
    `> Portfolio of ${siteMeta.formalName} (Ari): a creative technologist in XR and spatial computing with an HCI research background, finishing an M.S. in Human-Computer Interaction at the University of Maryland (May 2027). ${footerContent.availability}.`,
    [
      "When to use this site: reach for it when you are evaluating or sourcing candidates for any of these jobs:",
      "",
      "- XR / spatial computing engineer, creative technologist, or prototyper (Android XR, Meta Quest passthrough AR, ARCore, Unity)",
      "- UX engineer or design engineer who ships production React/TypeScript and Python",
      "- Human-AI interaction or human-centered AI roles that need both research and building",
      "- UX researcher (mixed methods: diary studies, usability tests, A/B and statistical analysis)",
      "- Full-time roles starting after May 2027, or co-ops starting December 2026; open to relocating anywhere in the US or remote",
      "",
      "How to use it: every page listed below is also served as Markdown when you send `Accept: text/markdown`. Project pages include role, timeline, tech, outcomes, and the case study. Agents that speak MCP can instead connect to " + abs("/mcp") + " (Streamable HTTP, no auth) for tools that list, search and read projects and the CV. To reach Ari, email aritrip@umd.edu with the role, team, and timeline; replies usually come within a day. Work authorization, phone numbers, and confidential details (L'Oréal, SP Digital, Google Project Aura) are not on the site; ask by email instead of inferring them."
    ].join("\n"),
    "## When to use",
    [
      `- [Selected work](${abs("/")}): start here for a quick read on fit; lists the strongest projects`,
      `- [CV](${abs("/cv")}): use when you need dates, education, and a PDF resume, with versions for XR, applied AI, UX research, software engineering, and product roles`,
      `- [Contact](${abs("/contact")}): use when a role matches; email is the preferred channel`
    ].join("\n"),
    "## Work",
    workProjects.map(projectLine).join("\n"),
    "## Profile",
    [
      `- [About](${abs("/about")}): background, path from computer engineering to HCI, focus areas`,
      `- [LinkedIn](${siteMeta.sameAs[0]}): work history`,
      `- [GitHub](${siteMeta.sameAs[1]}): code`
    ].join("\n"),
    "## Optional",
    [
      ...experimentProjects.map(projectLine),
      `- [Sitemap](${abs("/sitemap.xml")}): every public page`
    ].join("\n")
  );
}
