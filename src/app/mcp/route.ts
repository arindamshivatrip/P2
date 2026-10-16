import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createMcpServer } from "@/lib/agent/mcp";
import { allowMcpRequest } from "@/lib/agent/rate-limit";

// Remote MCP endpoint (Streamable HTTP). Stateless: each request gets a fresh
// server and transport, which suits serverless and needs no session store.
// Clients connect with e.g. `claude mcp add --transport http ari https://arindamtripathi.com/mcp`.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 15;

function clientIp(req: Request): string {
  // Vercel puts the real client first in x-forwarded-for.
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip") || "unknown";
}

async function handle(req: Request): Promise<Response> {
  if (!(await allowMcpRequest(clientIp(req)))) {
    return Response.json(
      {
        jsonrpc: "2.0",
        error: { code: -32000, message: "Rate limit reached. Try again later, or email aritrip@umd.edu." },
        id: null
      },
      { status: 429 }
    );
  }

  const server = createMcpServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true
  });
  await server.connect(transport);
  return transport.handleRequest(req);
}

// Stateless servers have no stream to resume and no session to end, so GET
// (which would otherwise hold an SSE stream open until the function times out)
// and DELETE are refused, as the spec allows.
function methodNotAllowed(): Response {
  return Response.json(
    { jsonrpc: "2.0", error: { code: -32000, message: "Method not allowed. POST JSON-RPC to this endpoint." }, id: null },
    { status: 405, headers: { Allow: "POST" } }
  );
}

export { handle as POST, methodNotAllowed as GET, methodNotAllowed as DELETE };
