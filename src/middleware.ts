import { NextResponse, type NextRequest } from "next/server";
import {
  MARKDOWN_CONTENT_TYPE,
  prefersMarkdown,
  renderMarkdownForPath
} from "@/lib/agent/markdown";

// Content negotiation for agents: `Accept: text/markdown` gets a Markdown view
// of the page (or a Markdown 404); everyone else gets the normal HTML. Markdown
// responses carry `Vary: Accept` so caches never hand them to browsers. Next
// replaces Vary on prerendered HTML pages, so the append below is best effort.
export function middleware(request: NextRequest) {
  if (prefersMarkdown(request.headers.get("accept"))) {
    const result = renderMarkdownForPath(request.nextUrl.pathname);
    if (result) {
      return new NextResponse(request.method === "HEAD" ? null : result.body, {
        status: result.status,
        headers: {
          "Content-Type": MARKDOWN_CONTENT_TYPE,
          Vary: "Accept",
          "X-Robots-Tag": "noindex"
        }
      });
    }
  }

  const response = NextResponse.next();
  response.headers.append("Vary", "Accept");
  return response;
}

export const config = {
  // Pages only: skip Next internals, API routes, and files with an extension
  // (public assets, sitemap.xml, robots.txt, llms.txt).
  matcher: ["/((?!_next/|api/|.*\\.[^/]+$).*)"]
};
