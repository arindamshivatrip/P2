// Turns project names in an Ask Ari reply into links to their pages, so a
// reply that names a project always links it, whether or not the model did.
// Pure string work: safe to run on every render while a reply streams in.

export type ProjectLink = {
  href: string;
  /** Exact, case-sensitive ways the reply may name the project. */
  names: string[];
};

// Existing markdown links (including one still streaming in) and inline code
// are left alone, so we never nest a link inside a link.
const PROTECTED = /\[[^\]\n]*\](?:\([^)\s]*\)?)?|\[[^\]\n]*$|`[^`]*`?/g;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function linkProjects(text: string, projects: ProjectLink[]): string {
  // A project the model already linked doesn't get a second link.
  const pending = projects.filter((project) => !text.includes(`](${project.href})`));
  if (pending.length === 0) return text;

  // Longest names first, so "Helmet Scan-to-Fitment Pipeline" wins over a
  // shorter alias inside it.
  const candidates = pending
    .flatMap((project) => project.names.map((name) => ({ name, project })))
    .sort((a, b) => b.name.length - a.name.length);
  const pattern = new RegExp(
    `(?<![\\w-])(${candidates.map((candidate) => escapeRegExp(candidate.name)).join("|")})(?![\\w-])`,
    "g"
  );
  const projectByName = new Map(candidates.map((candidate) => [candidate.name, candidate.project]));
  const linked = new Set<ProjectLink>();

  const linkPlain = (segment: string) =>
    segment.replace(pattern, (name: string) => {
      const project = projectByName.get(name);
      // Only the first mention of each project becomes a link.
      if (!project || linked.has(project)) return name;
      linked.add(project);
      return `[${name}](${project.href})`;
    });

  let result = "";
  let last = 0;
  for (const match of text.matchAll(PROTECTED)) {
    result += linkPlain(text.slice(last, match.index)) + match[0];
    last = match.index + match[0].length;
  }
  return result + linkPlain(text.slice(last));
}
