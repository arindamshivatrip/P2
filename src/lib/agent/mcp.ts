import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { aboutDomainReveals, aboutJourney } from "@/data/about";
import { cvPageContent, cvVersions } from "@/data/cv";
import { experimentProjects, getProjectBySlug, workProjects } from "@/data/projects";
import { siteMeta } from "@/data/site";
import type { Project, ProjectSection } from "@/types/project";
import { projectUrl, renderAbout, renderContact, renderCv, renderProject } from "./markdown";

/**
 * MCP server for agents that connect to https://arindamtripathi.com/mcp.
 * Read-only and public: every tool answers from the same data modules the
 * pages and the Markdown views render, so nothing here can drift from the site.
 * The tool handlers are exported as plain functions so tests can call them
 * without a transport.
 */

const SECTIONS = ["work", "experiments"] as const;

const visibleProjects = (section?: ProjectSection): Project[] =>
  section === "work"
    ? workProjects
    : section === "experiments"
      ? experimentProjects
      : [...workProjects, ...experimentProjects];

export type ProjectSummary = {
  slug: string;
  title: string;
  section: ProjectSection;
  oneLiner: string;
  role: string;
  timeline: string;
  org?: string;
  areas: string[];
  tech: string[];
  featured: boolean;
  url: string;
};

const summarize = (project: Project): ProjectSummary => ({
  slug: project.slug,
  title: project.title,
  section: project.section,
  oneLiner: project.oneLiner,
  role: project.role,
  timeline: project.meta.dateRange,
  org: project.meta.org,
  areas: project.categories,
  tech: project.tech,
  featured: project.featured,
  url: projectUrl(project)
});

const lower = (s: string) => s.toLowerCase();

export function listProjects(filter: {
  section?: ProjectSection;
  area?: string;
  tech?: string;
  featuredOnly?: boolean;
}): ProjectSummary[] {
  const area = filter.area && lower(filter.area);
  const tech = filter.tech && lower(filter.tech);
  return visibleProjects(filter.section)
    .filter((p) => !filter.featuredOnly || p.featured)
    .filter((p) => !area || p.categories.some((c) => lower(c).includes(area)))
    .filter((p) => !tech || p.tech.some((t) => lower(t).includes(tech)))
    .map(summarize);
}

/** Markdown case study for a visible project, or null for an unknown or hidden slug. */
export function getProjectMarkdown(slug: string): string | null {
  const project = getProjectBySlug(slug);
  return project && project.visible ? renderProject(project) : null;
}

export type SearchHit = { title: string; url: string; snippet: string };

// Weighted fields: a hit in the title says more than one deep in a case study.
function projectFields(project: Project): [string, number][] {
  return [
    [project.title, 5],
    [project.oneLiner, 3],
    [[...project.categories, ...project.tech, ...(project.tags ?? [])].join(" "), 3],
    [project.role, 2],
    [project.meta.org ?? "", 2],
    [project.summary, 2],
    [(project.highlights ?? []).join(" "), 1],
    [
      (project.detailSections ?? [])
        .map((s) => [s.title, ...s.body, ...(s.bullets ?? [])].join(" "))
        .join(" "),
      1
    ]
  ];
}

const base = siteMeta.url.replace(/\/$/, "");

const pageDocs = (): { title: string; url: string; snippet: string; fields: [string, number][] }[] => [
  {
    title: "About",
    url: `${base}/about`,
    snippet: siteMeta.description,
    fields: [
      [aboutJourney.chapters.map((c) => `${c.title} ${c.body}`).join(" "), 1],
      [Object.values(aboutDomainReveals).join(" "), 1]
    ]
  },
  {
    title: "CV",
    url: `${base}/cv`,
    snippet: cvPageContent.intro,
    fields: [
      [cvVersions.map((v) => `${v.title} ${v.description}`).join(" "), 2],
      [cvPageContent.primaryDescription, 1]
    ]
  }
];

const tokenize = (query: string): string[] =>
  Array.from(new Set(lower(query).split(/[^a-z0-9+#.]+/).filter((t) => t.length > 1)));

function score(fields: [string, number][], terms: string[]): number {
  let total = 0;
  for (const term of terms) {
    for (const [text, weight] of fields) {
      if (lower(text).includes(term)) total += weight;
    }
  }
  return total;
}

export function searchSite(query: string, limit = 5): SearchHit[] {
  const terms = tokenize(query);
  if (terms.length === 0) return [];

  const hits = [
    ...visibleProjects().map((p) => ({
      title: p.title,
      url: projectUrl(p),
      snippet: p.oneLiner,
      score: score(projectFields(p), terms)
    })),
    ...pageDocs().map((d) => ({ title: d.title, url: d.url, snippet: d.snippet, score: score(d.fields, terms) }))
  ];

  // Scores only rank the hits; agents get them back in order without the numbers.
  return hits
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ title, url, snippet }) => ({ title, url, snippet }));
}

const text = (body: string) => ({ content: [{ type: "text" as const, text: body }] });
const json = (value: unknown) => text(JSON.stringify(value, null, 2));

const READ_ONLY = { readOnlyHint: true, openWorldHint: false } as const;

export function createMcpServer(): McpServer {
  const server = new McpServer(
    { name: "arindamtripathi.com", version: "1.0.0" },
    {
      instructions: `Portfolio of ${siteMeta.name} (Ari), a creative technologist in XR and spatial computing with an HCI research background. Use these tools when evaluating Ari for a role: start with list_projects or search_site, then get_project for detail. Everything here is public. Work authorization, phone numbers and confidential project details are not available; to reach Ari, use the email in get_contact.`
    }
  );

  server.registerTool(
    "list_projects",
    {
      title: "List projects",
      description:
        "List Ari's public projects with role, timeline, areas, tech and URL. 'work' holds the main case studies; 'experiments' holds smaller builds, coursework and hackathons. Filters are optional and case-insensitive.",
      inputSchema: {
        section: z.enum(SECTIONS).optional().describe("Only this section"),
        area: z.string().optional().describe('Area to match, e.g. "XR", "Research", "Accessibility"'),
        tech: z.string().optional().describe('Technology to match, e.g. "Unity", "React", "Python"'),
        featuredOnly: z.boolean().optional().describe("Only the featured projects")
      },
      annotations: READ_ONLY
    },
    async (args) => json(listProjects(args))
  );

  server.registerTool(
    "get_project",
    {
      title: "Get project",
      description:
        "Full case study for one project as Markdown: role, timeline, tech, outcomes, sections and links. Take the slug from list_projects or search_site.",
      inputSchema: { slug: z.string().describe("Project slug") },
      annotations: READ_ONLY
    },
    async ({ slug }) => {
      const body = getProjectMarkdown(slug);
      if (body) return text(body);
      const known = visibleProjects().map((p) => p.slug).join(", ");
      return { ...text(`No public project with slug "${slug}". Known slugs: ${known}`), isError: true };
    }
  );

  server.registerTool(
    "search_site",
    {
      title: "Search the site",
      description:
        "Keyword search across projects, About and the CV. Returns the best matches with URLs. Use it to check for specific skills or experience (e.g. \"diary study\", \"Android XR\").",
      inputSchema: {
        query: z.string().min(1).max(200),
        limit: z.number().int().min(1).max(10).optional()
      },
      annotations: READ_ONLY
    },
    async ({ query, limit }) => json(searchSite(query, limit))
  );

  server.registerTool(
    "get_cv",
    {
      title: "Get CV",
      description:
        "CV overview with links to the PDF versions (primary, plus versions tuned for XR, applied AI, UX research, software engineering and product roles).",
      annotations: READ_ONLY
    },
    async () => text(renderCv())
  );

  server.registerTool(
    "get_about",
    {
      title: "Get about",
      description: "Ari's background, path from computer engineering to HCI, and focus areas.",
      annotations: READ_ONLY
    },
    async () => text(renderAbout())
  );

  server.registerTool(
    "get_contact",
    {
      title: "Get contact",
      description: "How to reach Ari. Email is preferred; include the role, team and timeline.",
      annotations: READ_ONLY
    },
    async () => text(renderContact())
  );

  return server;
}
