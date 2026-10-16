import assert from "node:assert/strict";
import { test } from "node:test";
import { experimentProjects, projects, workProjects } from "@/data/projects";
import { GET, POST } from "@/app/mcp/route";
import { getProjectMarkdown, listProjects, searchSite } from "./mcp";

let nextId = 1;
async function rpc(method: string, params: Record<string, unknown> = {}) {
  const res = await POST(
    new Request("https://arindamtripathi.com/mcp", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
      body: JSON.stringify({ jsonrpc: "2.0", id: nextId++, method, params })
    })
  );
  assert.equal(res.status, 200, `${method} -> ${res.status}`);
  return (await res.json()) as { result?: any; error?: { message: string } };
}

test("listProjects covers every visible project and filters", () => {
  assert.equal(listProjects({}).length, workProjects.length + experimentProjects.length);
  assert.deepEqual(
    listProjects({ section: "work" }).map((p) => p.slug),
    workProjects.map((p) => p.slug)
  );
  for (const p of listProjects({ featuredOnly: true })) assert.equal(p.featured, true);
  for (const p of listProjects({ area: "xr" })) assert.ok(p.areas.some((a) => /xr/i.test(a)));
  assert.ok(listProjects({}).every((p) => p.url.startsWith("https://arindamtripathi.com/")));
});

test("every visible project has a case study; hidden and unknown slugs don't", () => {
  for (const p of [...workProjects, ...experimentProjects]) {
    assert.ok(getProjectMarkdown(p.slug)?.startsWith(`# ${p.title}`), p.slug);
  }
  for (const p of projects.filter((p) => !p.visible)) assert.equal(getProjectMarkdown(p.slug), null, p.slug);
  assert.equal(getProjectMarkdown("not-a-project"), null);
});

test("searchSite ranks title matches first and ignores empty queries", () => {
  const target = workProjects[0];
  assert.equal(searchSite(target.title)[0]?.url.endsWith(`/${target.slug}`), true);
  assert.deepEqual(searchSite("  "), []);
  assert.ok(searchSite("xr", 3).length <= 3);
});

test("the endpoint initializes and lists read-only tools", async () => {
  const init = await rpc("initialize", {
    protocolVersion: "2025-06-18",
    capabilities: {},
    clientInfo: { name: "test", version: "0" }
  });
  assert.equal(init.result?.serverInfo?.name, "arindamtripathi.com");

  const { result } = await rpc("tools/list");
  const names = result.tools.map((t: { name: string }) => t.name).sort();
  assert.deepEqual(names, ["get_about", "get_contact", "get_cv", "get_project", "list_projects", "search_site"]);
  for (const tool of result.tools) assert.equal(tool.annotations?.readOnlyHint, true, tool.name);
});

test("tool calls return site content, and unknown slugs return a tool error", async () => {
  const contact = await rpc("tools/call", { name: "get_contact", arguments: {} });
  assert.match(contact.result.content[0].text, /aritrip@umd\.edu/);

  const slug = workProjects[0].slug;
  const project = await rpc("tools/call", { name: "get_project", arguments: { slug } });
  assert.match(project.result.content[0].text, new RegExp(`^# ${workProjects[0].title}`));

  const missing = await rpc("tools/call", { name: "get_project", arguments: { slug: "nope" } });
  assert.equal(missing.result.isError, true);
  assert.match(missing.result.content[0].text, new RegExp(slug));
});

test("GET is refused instead of holding a stream open", () => {
  const res = GET();
  assert.equal(res.status, 405);
  assert.equal(res.headers.get("allow"), "POST");
});
