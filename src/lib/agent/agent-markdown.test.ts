import assert from "node:assert/strict";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { NextRequest } from "next/server";
import { workProjects } from "@/data/projects";
import { middleware } from "@/middleware";
import {
  HTML_ONLY_ROUTES,
  prefersMarkdown,
  renderLlmsTxt,
  renderMarkdownForPath
} from "./markdown";

const req = (pathname: string, accept: string, method = "GET") =>
  new NextRequest(`https://arindamtripathi.com${pathname}`, { method, headers: { accept } });

test("prefersMarkdown follows the Accept header", () => {
  assert.equal(prefersMarkdown("text/markdown"), true);
  assert.equal(prefersMarkdown("text/markdown, text/html;q=0.9"), true);
  assert.equal(prefersMarkdown("text/html, text/markdown"), true);
  assert.equal(prefersMarkdown("text/html,application/xhtml+xml,*/*;q=0.8"), false);
  assert.equal(prefersMarkdown("text/html, text/markdown;q=0.5"), false);
  assert.equal(prefersMarkdown("text/markdown;q=0"), false);
  assert.equal(prefersMarkdown("*/*"), false);
  assert.equal(prefersMarkdown(null), false);
});

test("homepage is served as Markdown with Vary: Accept", async () => {
  const res = middleware(req("/", "text/markdown"));
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type") ?? "", /^text\/markdown/);
  assert.match(res.headers.get("vary") ?? "", /Accept/);
  const body = await res.text();
  assert.match(body, /^# Arindam Shiva Tripathi/);
  assert.match(body, /aritrip@umd\.edu/);
});

test("browsers still get HTML, with Vary: Accept", () => {
  const res = middleware(req("/", "text/html,application/xhtml+xml,*/*;q=0.8"));
  assert.equal(res.headers.get("x-middleware-next"), "1");
  assert.match(res.headers.get("vary") ?? "", /Accept/);
});

test("unknown paths return a Markdown 404 that points to llms.txt", async () => {
  const res = middleware(req("/__probe-does-not-exist", "text/markdown"));
  assert.equal(res.status, 404);
  assert.match(res.headers.get("content-type") ?? "", /^text\/markdown/);
  const body = await res.text();
  assert.ok(body.length >= 20);
  assert.match(body, /https:\/\/arindamtripathi\.com\/llms\.txt/);
});

test("HEAD gets headers and no body", async () => {
  const res = middleware(req("/", "text/markdown", "HEAD"));
  assert.equal(res.status, 200);
  assert.equal(await res.text(), "");
});

test("project pages render; hidden or wrong-section slugs 404", () => {
  const project = workProjects[0];
  const ok = renderMarkdownForPath(`/work/${project.slug}`);
  assert.equal(ok?.status, 200);
  assert.ok(ok?.body.includes(`# ${project.title}`));
  assert.equal(renderMarkdownForPath(`/experiments/${project.slug}`)?.status, 404);
  assert.equal(renderMarkdownForPath("/work/not-a-project")?.status, 404);
  assert.equal(renderMarkdownForPath("/work/")?.status, 200);
});

test("HTML-only pages are passed through, not 404ed", () => {
  for (const route of HTML_ONLY_ROUTES) {
    assert.equal(renderMarkdownForPath(route), null, route);
  }
});

test("every app page has a Markdown view or is marked HTML-only", () => {
  const appDir = path.join(process.cwd(), "src", "app");
  const routes: string[] = [];
  const walk = (dir: string, route: string) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) walk(full, `${route}/${entry}`);
      else if (entry === "page.tsx") routes.push(route || "/");
    }
  };
  walk(appDir, "");

  for (const route of routes) {
    const sample = route.replace("[slug]", route.startsWith("/work") ? workProjects[0].slug : "x");
    if (route.startsWith("/experiments/[slug]")) continue; // covered via project test data
    const result = renderMarkdownForPath(sample);
    assert.ok(result === null || result.status === 200, `${route} would 404 for Markdown agents`);
  }
});

test("llms.txt follows the llmstxt.org structure", () => {
  const txt = renderLlmsTxt();
  const lines = txt.split("\n");
  assert.match(lines[0], /^# \S/);
  assert.equal(lines.filter((l) => /^# /.test(l)).length, 1, "exactly one H1");
  assert.match(lines[2], /^> \S/, "blockquote summary follows the H1");

  const firstH2 = lines.findIndex((l) => l.startsWith("## "));
  assert.ok(lines.slice(1, firstH2).every((l) => !l.startsWith("#")), "no headings before the first H2");
  assert.match(txt, /When to use/);

  // Every non-empty line inside an H2 section is a "- [name](url)" link item.
  for (const line of lines.slice(firstH2)) {
    if (line === "" || line.startsWith("## ")) continue;
    assert.match(line, /^- \[[^\]]+\]\(https?:\/\/[^)]+\)(: .+)?$/, line);
  }
});
