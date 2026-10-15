import { pingPresence } from "@/lib/presence";

export const dynamic = "force-dynamic";

const VISITOR_ID = /^[A-Za-z0-9-]{8,64}$/;

export async function POST(req: Request) {
  let visitorId: unknown;
  let first: unknown;
  try {
    ({ visitorId, first } = await req.json());
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof visitorId !== "string" || !VISITOR_ID.test(visitorId)) {
    return Response.json({ error: "Invalid visitor id." }, { status: 400 });
  }

  try {
    const counts = await pingPresence(visitorId, first === true);
    if (!counts) return Response.json({ error: "Counter unavailable." }, { status: 503 });
    return Response.json(counts, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Counter unavailable." }, { status: 503 });
  }
}
